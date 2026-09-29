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
# an option's name, without a value attached to it (-C3, -I/usr/include, --key=2): values can be paths or text
OPTION_NAME = re.compile(r"--[A-Za-z][A-Za-z0-9-]*|-[A-Za-z]+")
NUMBER_OPTION = re.compile(r"-[0-9]+")                  # head -20: -N, or every count would be a row of its own
# tools that work on one file, with the input naming it and the inputs every call gives; the others are its options
FILE_TOOLS = {"Read": ("file_path", frozenset({"file_path"})),
              "Edit": ("file_path", frozenset({"file_path", "old_string", "new_string"})),
              "MultiEdit": ("file_path", frozenset({"file_path", "edits"})),
              "Write": ("file_path", frozenset({"file_path", "content"})),
              "NotebookRead": ("notebook_path", frozenset({"notebook_path"})),
              "NotebookEdit": ("notebook_path", frozenset({"notebook_path", "new_source"}))}
# a file name's type: its last suffix, or a dotfile's name (.env); anything longer or odder is no type
FILE_TYPE = re.compile(r"\.[A-Za-z0-9_+-]{1,10}")


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
    detail: str | None = None           # what splits its kind further (command_class), else None
    options: str | None = None          # the options its detail ran with (command_class), else None

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
    """A tool's calls, a Bash kind's (kind set), a kind's detail's (detail set too: a program, an interpreter, a
    git subcommand) or a detail's options' (options set too), in a transcript: counts, sizes and costs."""
    tool: str
    kind: str | None
    detail: str | None
    options: str | None
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


def program_label(program: str) -> str:
    """A program as its kind's detail: an interpreter without its version (python3.12 is python), any other as it
    is (pip3 stays pip3)."""
    bare = VERSION_SUFFIX.sub("", program)
    return bare if bare in INTERPRETERS else program


def option_names(words: list[str]) -> str:
    """A program's options as they were given, each once: their names only (OPTION_NAME), a number as -N, up to
    `--`; its arguments, and with them any path or text, are left out."""
    names: list[str] = []
    for word in words:
        if word == "--":
            break
        if not word.startswith("-"):
            continue
        if word == "-":
            name = word                                 # the code comes on standard input
        elif NUMBER_OPTION.fullmatch(word):
            name = "-N"
        else:
            match = OPTION_NAME.match(word)
            name = match.group(0) if match else None
        if name is not None and name not in names:
            names.append(name)
    return " ".join(names)


def command_class(command: str) -> tuple[str, str, str]:
    """What a Bash command does (one of KINDS), by its first program past setup (cd, export) and wrappers: an edit
    in place anywhere (sed -i, perl -i), a file written (a heredoc or echo, printf or cat redirected into one, tee),
    an inline script (an interpreter fed code by a heredoc or -c/-e/-r), git's searches, then searching, viewing
    and listing programs; everything else runs a program. With it the detail that splits the kind further: the
    program that does it (program_label: the one that edits, the interpreter), for git its subcommand ("git grep"
    for a search); empty without a program or subcommand. Then that program's options (option_names), for git its
    subcommand's."""
    head = command_head(command)
    commands = [words for words in (program_words(part) for part in SEPARATORS.split(head)) if words]
    for words in commands:
        program = program_name(words[0])
        if program in IN_PLACE_PROGRAMS and any(IN_PLACE_FLAG.fullmatch(word) for word in words[1:]):
            return "edit_in_place", program, option_names(words[1:])
    commands = [words for words in commands if program_name(words[0]) not in SETUP_PROGRAMS]
    if not commands:
        return "run", "", ""
    words = commands[0]
    program = program_name(words[0])
    label = program_label(program)
    options = option_names(words[1:])
    redirected = any(target != "/dev/null" for target in REDIRECT.findall(head))
    if program == "tee" or (program in WRITE_PROGRAMS
                            and (redirected or any(program_name(other[0]) == "tee" for other in commands[1:]))):
        return "write_file", program, options
    if label in INTERPRETERS and ("<<" in head or (len(words) > 1 and words[1].lower() in INLINE_FLAGS)):
        return "inline_script", label, options
    if program == "git":
        subcommand, rest = git_subcommand(words[1:])
        if subcommand in GIT_SEARCHES:
            return "search", f"git {subcommand}", option_names(rest)
        return "git", subcommand, option_names(rest)
    for kind, programs in (("search", SEARCH_PROGRAMS), ("view", VIEW_PROGRAMS), ("list", LIST_PROGRAMS)):
        if program in programs:
            return kind, program, options
    return "run", label, options


def git_subcommand(words: list[str]) -> tuple[str, list[str]]:
    """git's subcommand, past its options (-C <path> and -c <name=value> take a value), and the words after it;
    empty and none without one."""
    index = 0
    while index < len(words):
        word = words[index]
        if word in GIT_VALUE_OPTIONS:
            index += 2
        elif word.startswith("-"):
            index += 1
        else:
            return word, words[index + 1:]
    return "", []


def call_class(name: str, tool_input: dict[str, Any]) -> tuple[str | None, str | None, str | None]:
    """A call's kind, detail and options: a Bash call's by command_class; a file tool's without a kind, its file's
    type and the optional inputs it gave, by name (file_options); None for each for any other tool."""
    if name == BASH:
        command = tool_input.get("command")
        return command_class(command if isinstance(command, str) else "")
    if name in FILE_TOOLS:
        path_key, _ = FILE_TOOLS[name]
        file_path = tool_input.get(path_key)
        return None, file_type(file_path if isinstance(file_path, str) else ""), file_options(name, tool_input)
    return None, None, None


def file_type(file_path: str) -> str:
    """A file's type (FILE_TYPE), lower-cased, from its name alone; empty without one. Never the path or the name,
    which can say more than a type."""
    name = file_path.replace("\\", "/").rsplit("/", 1)[-1]
    suffix = name[name.rfind("."):] if "." in name else ""
    return suffix.lower() if FILE_TYPE.fullmatch(suffix) else ""


def file_options(name: str, tool_input: dict[str, Any]) -> str:
    """The optional inputs a file tool's call gave (offset, limit, replace_all), sorted, by name: not their values.
    One set to false or null counts as not given."""
    _, required = FILE_TOOLS[name]
    given = (key for key, value in tool_input.items()
             if key not in required and value is not None and value is not False)
    return " ".join(sorted(given))


# --- one transcript ----------------------------------------------------------------------------------------------

@dataclass(frozen=True)
class PendingCall:
    """A tool call as read, before its result and the calls after it are known."""
    tool: str
    kind: str | None
    input_chars: int
    message_id: str
    detail: str | None
    options: str | None


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
                kind, detail, options = call_class(name, tool_input)
                calls[tool_use_id] = PendingCall(transcripts.display_name(name), kind,
                                                 len(json.dumps(tool_input, ensure_ascii=False)), message_id, detail,
                                                 options)
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
                              input_cost, message_stretch == current_stretch, reread, call.detail,
                              call.options))
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


def tool_row(tool: str, kind: str | None, facts: list[CallFact], detail: str | None = None,
             options: str | None = None) -> ToolKindRow:
    """One row over the calls of a tool, a Bash kind, a kind's detail or a detail's options."""
    sizes = [fact.result_chars for fact in facts if fact.result_chars is not None]
    result_median = median_or_none(sizes)
    input_median = median_or_none([fact.input_chars for fact in facts])
    return ToolKindRow(tool=tool, kind=kind, detail=detail, options=options, calls=len(facts),
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
    """One row per tool, the most called first; Bash's is followed by one per command kind, each kind's and a file
    tool's by one per detail, each detail's by one per set of options."""
    rows = []
    for tool, tool_facts in grouped(facts, lambda fact: fact.tool):
        rows.append(tool_row(tool, None, tool_facts))
        if tool == BASH:
            for kind, kind_facts in grouped(tool_facts, lambda fact: fact.kind):
                rows.append(tool_row(tool, kind, kind_facts))
                rows += detail_rows(tool, kind, kind_facts)
        elif tool in FILE_TOOLS:
            rows += detail_rows(tool, None, tool_facts)
    return rows


def detail_rows(tool: str, kind: str | None, facts: list[CallFact]) -> list[ToolKindRow]:
    """One row per detail of these calls, each followed by one per set of options."""
    rows = []
    for detail, detail_facts in grouped(facts, lambda fact: fact.detail):
        rows.append(tool_row(tool, kind, detail_facts, detail))
        rows += [tool_row(tool, kind, options_facts, detail, options)
                 for options, options_facts in grouped(detail_facts, lambda fact: fact.options)]
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
