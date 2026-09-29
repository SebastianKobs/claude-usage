"""A transcript's tool calls by tool, and Bash by what its command does, for the session view's Tools table: read
from the file on demand, never stored. A command's kind comes from its programs, never from a language: an
interpreter fed code inline is an inline script whether it is Python, Node, PHP or a shell.

What a call costs beyond its own turn is what the later calls carry: its input (which the model wrote) and its
result stay in the context and are read again by every call after it, up to the next compaction. Exploration (reads,
searches, views and listings) in the main thread is carried that way; in a subagent only its summary is."""
import json
import math
import re
import statistics
from collections.abc import Callable
from collections.abc import Iterable
from dataclasses import dataclass
from pathlib import Path
from typing import Any

from claude_usage import conversation
from claude_usage import pricing
from claude_usage import transcripts
from claude_usage import turns

BASH = "Bash"
# Characters per token of what tool calls add to the context, a heuristic: the median over 1,966 steps of real
# transcripts that added a single tool result of 2,000 characters or more (checked 2026-09-29, counts only; code,
# logs and JSON in several languages; 2.2 to 2.4 across Read, cat and grep).
CHARS_PER_TOKEN = 2.3

KINDS = ("search", "view", "list", "edit_in_place", "write_file", "inline_script", "git", "run")
# looking at code rather than changing or running it: these tools, and Bash calls of these kinds. MCP tools don't
# count, since what one does is unknown.
EXPLORING_TOOLS = frozenset({"Read", "Grep", "Glob", "LSP", "NotebookRead"})
EXPLORING_KINDS = frozenset({"search", "view", "list"})
SEARCH_PROGRAMS = frozenset({"grep", "egrep", "fgrep", "rg", "ag", "ack", "find", "fd", "fdfind", "locate",
                             "mdfind", "findstr"})
VIEW_PROGRAMS = frozenset({"cat", "head", "tail", "less", "more", "nl", "bat", "batcat", "sed", "awk", "gawk", "cut",
                           "jq", "yq", "wc", "diff", "cmp", "od", "xxd", "hexdump", "strings", "file", "stat", "sort",
                           "uniq", "column", "type"})
LIST_PROGRAMS = frozenset({"ls", "tree", "du", "dir", "exa", "eza"})
WRITE_PROGRAMS = frozenset({"cat", "echo", "printf"})   # with a redirection into a file
IN_PLACE_PROGRAMS = frozenset({"sed", "perl"})          # with -i
# interpreters by name without a version (python3.12 is python), fed code inline by a heredoc or a flag
INTERPRETERS = frozenset({"python", "py", "pypy", "node", "nodejs", "deno", "bun", "ruby", "irb", "perl", "php",
                          "bash", "sh", "zsh", "dash", "ksh", "fish", "pwsh", "powershell", "rscript", "r", "lua",
                          "luajit", "julia", "groovy", "kotlinc", "scala", "swift", "elixir", "iex", "erl", "tclsh",
                          "osascript", "ghci", "runghc"})
INLINE_FLAGS = frozenset({"-c", "-e", "-p", "-r", "-", "--eval", "--print", "--command", "-command", "eval"})
GIT_SEARCHES = frozenset({"grep", "ls-files"})
GIT_VALUE_OPTIONS = frozenset({"-C", "-c", "--git-dir", "--work-tree"})
# words before the program: they run it, they don't do the work
WRAPPERS = frozenset({"sudo", "env", "command", "exec", "nice", "nohup", "time", "xargs", "builtin"})
# simple commands that only set up the shell
SETUP_PROGRAMS = frozenset({"cd", "pushd", "popd", "export", "set", "unset", "source", ".", "alias", "true", ":",
                            "local", "declare", "shopt"})
# a shell keyword that starts a condition or a list header, whose words aren't a program
HEADER_KEYWORDS = frozenset({"for", "while", "until", "if", "elif", "case", "select", "function", "done", "fi",
                             "esac", "}", ")"})
BODY_KEYWORDS = frozenset({"do", "then", "else", "{", "(", "!"})
QUOTED = re.compile(r"'[^']*'|\"(?:\\.|[^\"\\])*\"")
SEPARATORS = re.compile(r"\|\||&&|[|;&\n]")
ASSIGNMENT = re.compile(r"[A-Za-z_][A-Za-z0-9_]*=\S*")
# a redirection of standard output into a file: not 2>, not >&1, not into /dev/null
REDIRECT = re.compile(r"(?<![0-9&>])>>?\s*(?![&\s])(\S+)")
IN_PLACE_FLAG = re.compile(r"-[a-zA-Z]*i\S*|--in-place\S*")
VERSION_SUFFIX = re.compile(r"[0-9.]+$")


@dataclass(frozen=True)
class CallFact:
    """One tool call of a transcript, as counts: its tool, its Bash kind, its sizes and what later calls carry."""
    tool: str                           # the display name
    kind: str | None                    # a Bash call's kind, else None
    input_chars: int                    # of its input as JSON: the model wrote it
    result_chars: int | None            # None while its result hasn't come
    error: bool
    calls_after: int                    # the calls after it, up to the next compaction or the last call so far
    carried: float | None               # what those calls pay to have it in their context; None unpriced
    input_cost: float | None            # its input at the output price; None unpriced
    current: bool = False               # in the transcript's last stretch, since its last compaction
    reread: float | None = None         # what each later call pays to read it again; None unpriced
    interpreter: str | None = None      # an inline script's interpreter, else None

    @property
    def chars(self) -> int:
        """What it adds to the context: its input and its result."""
        return self.input_chars + (self.result_chars or 0)

    @property
    def exploring(self) -> bool:
        """Whether it looks at code (EXPLORING_TOOLS, EXPLORING_KINDS)."""
        return self.tool in EXPLORING_TOOLS or self.kind in EXPLORING_KINDS


@dataclass(frozen=True)
class Exploration:
    """The exploring calls of a transcript's last stretch: what they hold and cost to carry."""
    calls: int
    chars: int
    tokens: float                       # chars at CHARS_PER_TOKEN
    carried: float | None               # what the later calls paid so far; None unpriced
    reread: float | None                # what each further call pays to read them again


@dataclass(frozen=True)
class ToolKindRow:
    """A tool's calls, a Bash kind's (kind set) or an inline script interpreter's (interpreter set too), in a
    transcript: counts, sizes and costs."""
    tool: str
    kind: str | None
    interpreter: str | None
    calls: int
    errors: int
    result_chars: int
    result_median: int | None
    result_p90: int | None
    input_median: int | None
    calls_after_median: float | None
    carried: float | None               # None: no call was priced
    input_cost: float | None


# --- command kinds -----------------------------------------------------------------------------------------------

def command_head(command: str) -> str:
    """The command without a heredoc's body (which can hold anything) and with quoted text emptied, so neither
    splits it nor looks like a redirection."""
    head = command
    marker = command.find("<<")
    if marker >= 0:
        line_end = command.find("\n", marker)
        head = command if line_end < 0 else command[:line_end]
    return QUOTED.sub("''", head)


def program_words(segment: str) -> list[str]:
    """A simple command's words from its program on: past assignments, wrappers (sudo, env, timeout and its
    duration, xargs and its options) and keywords that open a body (do, then); none for a header (for, if)."""
    words = segment.split()
    while words:
        word = words[0]
        if word in HEADER_KEYWORDS:
            return []
        if ASSIGNMENT.fullmatch(word) or word in BODY_KEYWORDS:
            words = words[1:]
        elif word in WRAPPERS or word == "timeout":
            words = words[1:]
            while words and (words[0].startswith("-") or (word == "timeout" and words[0][:1].isdigit())):
                words = words[1:]
        else:
            break
    return words


def program_name(word: str) -> str:
    """A program's name: its path's last part, lower-cased, without .exe."""
    name = word.rsplit("/", 1)[-1].lower()
    return name.removesuffix(".exe")


def command_kind(command: str) -> str:
    """What a Bash command does (one of KINDS), as command_class tells it."""
    return command_class(command)[0]


def command_class(command: str) -> tuple[str, str | None]:
    """What a Bash command does (one of KINDS), by its first program past setup (cd, export) and wrappers: an edit
    in place anywhere (sed -i, perl -i), a file written (a heredoc or echo, printf or cat redirected into one, tee),
    an inline script (an interpreter fed code by a heredoc or -c/-e/-r), git's searches, then searching, viewing
    and listing programs; everything else runs a program. With it an inline script's interpreter, named without
    its path or version (python3.12 is python), else None."""
    head = command_head(command)
    commands = [words for words in (program_words(part) for part in SEPARATORS.split(head)) if words]
    if any(program_name(words[0]) in IN_PLACE_PROGRAMS and any(IN_PLACE_FLAG.fullmatch(word) for word in words[1:])
           for words in commands):
        return "edit_in_place", None
    commands = [words for words in commands if program_name(words[0]) not in SETUP_PROGRAMS]
    if not commands:
        return "run", None
    words = commands[0]
    program = program_name(words[0])
    redirected = any(target != "/dev/null" for target in REDIRECT.findall(head))
    if program == "tee" or (program in WRITE_PROGRAMS
                            and (redirected or any(program_name(other[0]) == "tee" for other in commands[1:]))):
        return "write_file", None
    interpreter = VERSION_SUFFIX.sub("", program)
    if interpreter in INTERPRETERS and ("<<" in head or (len(words) > 1 and words[1].lower() in INLINE_FLAGS)):
        return "inline_script", interpreter
    if program == "git":
        return ("search" if git_subcommand(words[1:]) in GIT_SEARCHES else "git"), None
    for kind, programs in (("search", SEARCH_PROGRAMS), ("view", VIEW_PROGRAMS), ("list", LIST_PROGRAMS)):
        if program in programs:
            return kind, None
    return "run", None


def git_subcommand(words: list[str]) -> str | None:
    """git's subcommand, past its options (-C <path> and -c <name=value> take a value)."""
    index = 0
    while index < len(words):
        word = words[index]
        if word in GIT_VALUE_OPTIONS:
            index += 2
        elif word.startswith("-"):
            index += 1
        else:
            return word
    return None


def call_class(name: str, tool_input: dict[str, Any]) -> tuple[str | None, str | None]:
    """A Bash call's command kind and inline script interpreter (command_class); None and None for any other
    tool."""
    if name != BASH:
        return None, None
    command = tool_input.get("command")
    return command_class(command if isinstance(command, str) else "")


# --- one transcript ----------------------------------------------------------------------------------------------

@dataclass(frozen=True)
class PendingCall:
    """A tool call as read, before its result and the calls after it are known."""
    tool: str
    kind: str | None
    input_chars: int
    message_id: str
    interpreter: str | None


def read_calls(path: Path, prices: pricing.Prices) -> list[CallFact]:
    """Every tool call of a transcript file in order, as counts. A record written again (the same uuid) counts
    once; synthetic messages (API errors) are no calls. Raises OSError if the file is gone."""
    calls: dict[str, PendingCall] = {}
    results: dict[str, tuple[int, bool]] = {}
    positions: dict[str, tuple[int, int]] = {}      # message id -> (its call number, its stretch)
    accumulator = transcripts.MessageAccumulator()
    stretch = 0
    seen: set[str] = set()
    for record in transcripts.iter_lines(path):
        record_id = transcripts.text_or_none(record.get("uuid"))
        if record_id is not None and record_id in seen:
            continue
        if record_id is not None:
            seen.add(record_id)
        kind = record.get("type")
        if kind == "system" and record.get("subtype") == transcripts.COMPACT_BOUNDARY:
            stretch += 1
        elif kind == "assistant":
            message_id = accumulator.add(record)
            if message_id is None:
                continue
            positions.setdefault(message_id, (len(positions), stretch))
            for block in transcripts.content_blocks(record):
                tool_use_id = transcripts.text_or_none(block.get("id"))
                name = transcripts.text_or_none(block.get("name"))
                if block.get("type") != "tool_use" or tool_use_id is None or name is None or tool_use_id in calls:
                    continue
                tool_input = block.get("input") if isinstance(block.get("input"), dict) else {}
                kind, interpreter = call_class(name, tool_input)
                calls[tool_use_id] = PendingCall(transcripts.display_name(name), kind,
                                                 len(json.dumps(tool_input, ensure_ascii=False)), message_id,
                                                 interpreter)
        elif kind == "user":
            for block in transcripts.content_blocks(record):
                tool_use_id = transcripts.text_or_none(block.get("tool_use_id"))
                if block.get("type") == "tool_result" and tool_use_id is not None:
                    results[tool_use_id] = (transcripts.result_chars(block.get("content")),
                                            block.get("is_error") is True)
    current_stretch = stretch
    last_in_stretch: dict[int, int] = {}
    for number, message_stretch in positions.values():
        last_in_stretch[message_stretch] = number
    facts = []
    for tool_use_id, call in calls.items():
        number, message_stretch = positions[call.message_id]
        calls_after = last_in_stretch[message_stretch] - number
        result_chars, error = results.get(tool_use_id, (None, False))
        rates = turns.turn_rates(prices, conversation.as_turn(accumulator.usage(call.message_id)))
        carried = input_cost = reread = None
        if rates is not None:
            tokens = (call.input_chars + (result_chars or 0)) / CHARS_PER_TOKEN
            # the next call writes it to the cache, each one after that reads it
            carried = tokens * (rates.write + rates.read * (calls_after - 1)) if calls_after else 0.0
            input_cost = call.input_chars / CHARS_PER_TOKEN * rates.output
            reread = tokens * rates.read
        facts.append(CallFact(call.tool, call.kind, call.input_chars, result_chars, error, calls_after, carried,
                              input_cost, message_stretch == current_stretch, reread, call.interpreter))
    return facts


def nearest_rank(values: list[int], share: float) -> int | None:
    """The value at this share of the sorted values (nearest rank); None without values."""
    if not values:
        return None
    ordered = sorted(values)
    return ordered[max(0, math.ceil(len(ordered) * share) - 1)]


def median_or_none(values: list[int]) -> float | None:
    """The median, None without values."""
    return statistics.median(values) if values else None


def priced_sum(values: Iterable[float | None]) -> float | None:
    """The sum of the priced values; None if none was priced."""
    priced = [value for value in values if value is not None]
    return sum(priced) if priced else None


def tool_row(tool: str, kind: str | None, facts: list[CallFact], interpreter: str | None = None) -> ToolKindRow:
    """One row over the calls of a tool, a Bash kind or an inline script interpreter."""
    sizes = [fact.result_chars for fact in facts if fact.result_chars is not None]
    result_median = median_or_none(sizes)
    input_median = median_or_none([fact.input_chars for fact in facts])
    return ToolKindRow(tool=tool, kind=kind, interpreter=interpreter, calls=len(facts),
                       errors=sum(fact.error for fact in facts), result_chars=sum(sizes),
                       result_median=None if result_median is None else round(result_median),
                       result_p90=nearest_rank(sizes, 0.9),
                       input_median=None if input_median is None else round(input_median),
                       calls_after_median=median_or_none([fact.calls_after for fact in facts]),
                       carried=priced_sum(fact.carried for fact in facts),
                       input_cost=priced_sum(fact.input_cost for fact in facts))


def grouped(facts: list[CallFact], key: Callable[[CallFact], Any]) -> list[tuple[Any, list[CallFact]]]:
    """The facts grouped by key, the group with most calls first, then by key."""
    groups: dict[Any, list[CallFact]] = {}
    for fact in facts:
        groups.setdefault(key(fact), []).append(fact)
    return sorted(groups.items(), key=lambda item: (-len(item[1]), str(item[0])))


def tool_rows(facts: list[CallFact]) -> list[ToolKindRow]:
    """One row per tool, the most called first; Bash's is followed by one per command kind, the inline scripts'
    by one per interpreter."""
    rows = []
    for tool, tool_facts in grouped(facts, lambda fact: fact.tool):
        rows.append(tool_row(tool, None, tool_facts))
        if tool != BASH:
            continue
        for kind, kind_facts in grouped(tool_facts, lambda fact: fact.kind):
            rows.append(tool_row(tool, kind, kind_facts))
            if kind == "inline_script":
                rows += [tool_row(tool, kind, interpreter_facts, interpreter)
                         for interpreter, interpreter_facts in grouped(kind_facts, lambda fact: fact.interpreter)]
    return rows


def exploration(facts: list[CallFact]) -> Exploration | None:
    """The exploring calls of the last stretch summed; None without one."""
    exploring = [fact for fact in facts if fact.current and fact.exploring]
    if not exploring:
        return None
    chars = sum(fact.chars for fact in exploring)
    return Exploration(calls=len(exploring), chars=chars, tokens=chars / CHARS_PER_TOKEN,
                       carried=priced_sum(fact.carried for fact in exploring),
                       reread=priced_sum(fact.reread for fact in exploring))


@dataclass(frozen=True)
class TranscriptTools:
    """What the session view shows of a transcript's tool calls: the Tools table's rows and the last stretch's
    exploration."""
    rows: tuple[ToolKindRow, ...]
    exploration: Exploration | None


def transcript_tools(path: Path, prices: pricing.Prices) -> TranscriptTools:
    """The Tools table's rows (tool_rows) and the exploration of one transcript file, from one read (read_calls).
    Raises OSError if it is gone."""
    facts = read_calls(path, prices)
    return TranscriptTools(tuple(tool_rows(facts)), exploration(facts))
