"""Possible secret locations a tool call named, for the session view's warning: the paths in a call's input matched
against `[secrets] patterns`, read from the transcript on demand and never stored.

A pattern is a name that matches any part of a path (`.env`, `*.pem`, `id_rsa`), a path from the home folder or the
root that matches it and everything below it (`~/.ssh`, `/mnt/?/Users/*/.ssh`, wildcards per part), or either
negated with `!` (`!.env.example`), which exempts what it matches; the last pattern that matches decides, as in a
.gitignore. It is a heuristic: a command's words are taken as paths, with the variables it sets expanded, quoted text
only where it holds a slash (a commit message or a search pattern naming `.env` is no access), and a heredoc's text
only for an inline script. A script the transcript wrote (Write, Edit) and a later command runs is scanned too, as
far as the transcript shows its text: a shell script like a command, other code by its quoted paths. Neither a
variable set in an earlier call nor a script from elsewhere is known. Each match notes whether its call handed its
input to something outside Claude Code (sends_out): an MCP server, or a command with a `network_programs` program;
and whether it looks like a test (looks_like_test): a word of the call, the script it ran or the path matching
`test_patterns`."""
import fnmatch
import posixpath
import re
from dataclasses import dataclass
from pathlib import PurePosixPath
from typing import Any

from claude_usage import config
from claude_usage import tool_kinds

# the inputs of any tool that hold paths, by name: file_path, notebook_path, relative_path, path, paths, root, glob...
PATH_KEY = re.compile(r"(?:^|_)(?:path|paths|file|files|dir|dirs|directory|directories|folder|root|cwd|glob)$",
                      flags=re.IGNORECASE)
# a tool's inputs that hold a path whatever their name: Glob's pattern is a path, Grep's is a regular expression
EXTRA_PATH_KEYS = {"Glob": frozenset({"pattern"})}
# a shell word: single-quoted, double-quoted, or plain up to a separator or a redirection
SHELL_WORD = re.compile(r"'([^']*)'|\"((?:\\.|[^\"\\])*)\"|([^\s'\"|;&<>()`]+)")
QUOTED_TEXT = re.compile(r"'([^']*)'|\"((?:\\.|[^\"\\])*)\"")
HOME_PREFIX = re.compile(r"^(?:~|\$HOME|\$\{HOME\})(?=/|$)")
# a shell variable set: at the start or after a separator (not --key=value), its value plain or quoted
ASSIGNMENT = re.compile(r"(?<![^\s;&|(])([A-Za-z_][A-Za-z0-9_]*)=('[^']*'|\"(?:\\.|[^\"\\])*\"|[^\s;&|<>()`'\"]*)")
SHELL_SUFFIXES = frozenset({".sh", ".bash", ".zsh", ".ksh"})
SHEBANG_SHELL = re.compile(r"#!\S*?(?:/|env\s+)(?:ba|z|k|da)?sh\b")
DRIVE = re.compile(r"^[A-Za-z]:/")


@dataclass(frozen=True)
class SecretSettings:
    """The [secrets] table: where secrets may be, the programs that send what they are given elsewhere, and what
    marks a call as a test."""
    patterns: tuple[str, ...]
    network_programs: frozenset[str]
    test_patterns: tuple[str, ...]


def parse_secrets(values: dict[str, Any]) -> SecretSettings:
    """The config's [secrets] patterns, network programs (lower-cased) and test patterns; none without the table.
    Raises ConfigError for any of them but a list of non-empty strings."""
    secrets = values.get("secrets") or {}
    if not isinstance(secrets, dict):
        raise config.ConfigError(f"secrets: expected a table, got {secrets!r}")
    lists = {}
    for key in ("patterns", "network_programs", "test_patterns"):
        items = secrets.get(key, [])
        if not isinstance(items, list) or not all(isinstance(item, str) and item.strip("!") for item in items):
            raise config.ConfigError(f"secrets.{key}: expected a list of non-empty strings, got {items!r}")
        lists[key] = items
    return SecretSettings(tuple(lists["patterns"]), frozenset(item.lower() for item in lists["network_programs"]),
                          tuple(lists["test_patterns"]))


def normalized_parts(path: str, home: str, cwd: str | None) -> list[str]:
    """A path's parts, with backslashes as slashes, the home folder expanded and a relative path taken from cwd
    where it is known; an absolute path's first part is empty."""
    path = HOME_PREFIX.sub(home.replace("\\", "\\\\"), path.replace("\\", "/"))
    if not path.startswith("/") and not DRIVE.match(path) and cwd:
        path = posixpath.join(cwd.replace("\\", "/"), path)
    return posixpath.normpath(path).split("/")


def pattern_matches(parts: list[str], pattern: str, home: str) -> bool:
    """Whether a path's parts match a pattern (without its !): one anchored at the home folder or the root from the
    start, a name or a relative pattern at any depth."""
    if pattern.startswith(("~/", "/")) or pattern == "~":
        wanted = normalized_parts(pattern, home, None)
        return len(wanted) <= len(parts) and all(fnmatch.fnmatchcase(part, want)
                                                 for part, want in zip(parts, wanted))
    wanted = pattern.split("/")
    return any(all(fnmatch.fnmatchcase(part, want) for part, want in zip(parts[start:], wanted))
               for start in range(len(parts) - len(wanted) + 1))


def matching_pattern(path: str, patterns: tuple[str, ...], home: str, cwd: str | None = None) -> str | None:
    """The pattern that marks a path as a possible secret, the last one that matches unless that is a negation;
    None for none."""
    return deciding_pattern(normalized_parts(path, home, cwd), patterns, home)


def deciding_pattern(parts: list[str], patterns: tuple[str, ...], home: str) -> str | None:
    """The last pattern that matches a path's parts, unless that is a negation; None for none."""
    found = None
    for pattern in patterns:
        negated = pattern.startswith("!")
        if pattern_matches(parts, pattern[1:] if negated else pattern, home):
            found = None if negated else pattern
    return found


def expanded(text: str) -> str:
    """Shell text with the variables it sets itself ($NAME, ${NAME}) replaced by their values, except in single
    quotes, as the shell does; a value may use a variable set before it."""
    values: dict[str, str] = {}
    for match in ASSIGNMENT.finditer(text):
        value = match.group(2)
        if value[:1] in ("'", '"'):
            value = value[1:-1]
        values[match.group(1)] = substituted(value, values)
    return substituted(text, values) if values else text


def substituted(text: str, values: dict[str, str]) -> str:
    """text with $NAME and ${NAME} of these values replaced, outside single quotes; a longer name ($NAMEx) is
    another variable."""
    if not values:
        return text
    names = "|".join(re.escape(name) for name in values)
    reference = re.compile(rf"'[^']*'|\$\{{({names})\}}|\$({names})(?![A-Za-z0-9_])")

    def value_of(match: re.Match[str]) -> str:
        """A variable's value, or single-quoted text as it is."""
        name = match.group(1) or match.group(2)
        return match.group(0) if name is None else values[name]
    return reference.sub(value_of, text)


def shell_words(text: str) -> list[str]:
    """The words of shell text that may be paths: plain words and an option's value (--env-file=.env gives .env),
    a file given by @ without it (curl -d @.env), quoted text only where it holds a slash; no options, no URLs."""
    words = []
    for match in SHELL_WORD.finditer(text):
        plain = match.group(3)
        if plain is None:
            words += [part for part in match.groups()[:2] if part and "/" in part]
        elif "://" not in plain:
            words += [part.removeprefix("@") for part in plain.split("=")
                      if part.strip("@") and not part.startswith("-")]
    return words


def quoted_paths(text: str) -> list[str]:
    """Code's quoted text that holds a slash."""
    return [part for match in QUOTED_TEXT.finditer(text) for part in match.groups() if part and "/" in part]


def command_words(command: str) -> list[str]:
    """The words of a command that may be paths (shell_words), with the variables it sets expanded. A heredoc's text
    counts only for an inline script (its quoted paths), since a file written or a message may mention anything."""
    head = command_head_line(command)
    body = command[len(head) + 1:]
    words = shell_words(expanded(head))
    if body and tool_kinds.command_kind(command) == "inline_script":
        words += quoted_paths(body)
    return words


def script_words(file_path: str, text: str) -> list[str]:
    """The words of a script that may be paths: a shell script's (by its suffix or #! line) as a command's, other
    code's quoted paths."""
    shell = PurePosixPath(file_path).suffix in SHELL_SUFFIXES or SHEBANG_SHELL.match(text) is not None
    return shell_words(expanded(text)) if shell else quoted_paths(text)


def call_paths(name: str, tool_input: dict[str, Any]) -> list[str]:
    """The paths a call names, each once, in the order given: a Bash command's words (command_words), for any
    other tool the text of its inputs that hold paths (PATH_KEY, EXTRA_PATH_KEYS), never what it writes or searches
    for."""
    if name == tool_kinds.BASH:
        command = tool_input.get("command")
        paths = command_words(command) if isinstance(command, str) else []
    else:
        extra = EXTRA_PATH_KEYS.get(name, frozenset())
        paths = []
        for key, value in tool_input.items():
            if key not in extra and not PATH_KEY.search(key):
                continue
            values = value if isinstance(value, list) else [value]
            paths += [text for text in values if isinstance(text, str) and text]
    return list(dict.fromkeys(paths))


def sends_out(name: str, tool_input: dict[str, Any], network_programs: frozenset[str]) -> bool:
    """Whether a call hands its input to something outside Claude Code, which may then get the secret itself: an MCP
    tool's server, or a command where any program is one of network_programs (past cd, assignments and wrappers)."""
    if tool_kinds.mcp_tool(name) is not None:
        return True
    command = tool_input.get("command") if name == tool_kinds.BASH else None
    if not isinstance(command, str):
        return False
    head = tool_kinds.command_head(command)
    segments = (tool_kinds.program_words(part) for part in tool_kinds.SEPARATORS.split(head))
    return any(words and tool_kinds.program_name(words[0]) in network_programs for words in segments)


def looks_like_test(words: list[str], test_patterns: tuple[str, ...], home: str, cwd: str | None) -> bool:
    """Whether any of these words (a call's, the script it ran, the path it named) matches a test pattern, as a path
    from the working folder: the folder itself doesn't count, or a project under tests/ would be all tests."""
    if not test_patterns:
        return False
    base = normalized_parts(cwd, home, None) if cwd else []
    for word in words:
        parts = normalized_parts(word, home, cwd)
        if base and parts[:len(base)] == base:
            parts = parts[len(base):]
        if parts and deciding_pattern(parts, test_patterns, home) is not None:
            return True
    return False


def finder(patterns: tuple[str, ...], home: str, network_programs: frozenset[str] = frozenset(),
           test_patterns: tuple[str, ...] = ()) -> tool_kinds.SecretFinder:
    """What starts a TranscriptScan with these patterns, home folder, network programs and test patterns, one per
    transcript read."""
    def start() -> tool_kinds.SecretScan:
        """A new scan, knowing no file written yet."""
        return TranscriptScan(patterns, home, network_programs, test_patterns)
    return start


class TranscriptScan:
    """A transcript's calls in order, as tool_kinds.read_calls hands them: what each named that marks a possible
    secret (secret_matches), and for a command that runs a script the transcript wrote, what the script's text
    names (script_words), with the word that ran it, whether the call sends out (sends_out) and whether it looks
    like a test (looks_like_test). It remembers the text each file got: a Write's content, an Edit's new text
    added."""

    def __init__(self, patterns: tuple[str, ...], home: str, network_programs: frozenset[str] = frozenset(),
                 test_patterns: tuple[str, ...] = ()) -> None:
        self.patterns = patterns
        self.home = home
        self.network_programs = network_programs
        self.test_patterns = test_patterns
        self.written: dict[str, str] = {}               # a file's normalized path -> the text written to it

    def __call__(self, name: str, tool_input: dict[str, Any],
                 cwd: str | None) -> list[tuple[str, str, str | None, bool, bool]]:
        """The call's matches as (path, pattern, the script's word or None, whether the call sends out, whether it
        looks like a test), its own first."""
        found: list[tuple[str, str, str | None]] = [(path, pattern, None) for path, pattern
                                                    in secret_matches(name, tool_input, self.patterns, self.home, cwd)]
        if name == tool_kinds.BASH and isinstance(tool_input.get("command"), str):
            found += self.script_matches(tool_input["command"], cwd)
        else:
            self.remember(name, tool_input, cwd)
        if not found:
            return []
        sent = sends_out(name, tool_input, self.network_programs)
        call_test = looks_like_test(call_paths(name, tool_input), self.test_patterns, self.home, cwd)
        return [(path, pattern, via, sent,
                 call_test or looks_like_test([path, *([via] if via else [])], self.test_patterns, self.home, cwd))
                for path, pattern, via in found]

    def key(self, file_path: str, cwd: str | None) -> str:
        """A file's path as the scan knows it."""
        return "/".join(normalized_parts(file_path, self.home, cwd))

    def remember(self, name: str, tool_input: dict[str, Any], cwd: str | None) -> None:
        """The text a Write, Edit or MultiEdit gave its file."""
        file_path = tool_input.get("file_path")
        if not isinstance(file_path, str) or not file_path:
            return
        key = self.key(file_path, cwd)
        if name == "Write" and isinstance(tool_input.get("content"), str):
            self.written[key] = tool_input["content"]
        elif name in ("Edit", "MultiEdit"):
            edits = tool_input.get("edits") if name == "MultiEdit" else [tool_input]
            added = [edit.get("new_string") for edit in edits or [] if isinstance(edit, dict)]
            self.written[key] = "\n".join([self.written.get(key, ""),
                                           *(text for text in added if isinstance(text, str))])

    def script_matches(self, command: str, cwd: str | None) -> list[tuple[str, str, str]]:
        """What the scripts a command runs name: each of its words that is a file written here, where it runs a
        program (not viewing, searching or editing it)."""
        if not self.written or tool_kinds.command_kind(command) != "run":
            return []
        found = []
        for word in dict.fromkeys(shell_words(expanded(command_head_line(command)))):
            text = self.written.get(self.key(word, cwd))
            if text is None:
                continue
            for path in dict.fromkeys(script_words(word, text)):
                pattern = matching_pattern(path, self.patterns, self.home, cwd)
                if pattern is not None:
                    found.append((path, pattern, word))
        return found


def command_head_line(command: str) -> str:
    """A command up to the end of its heredoc's first line, if it has one."""
    marker = command.find("<<")
    line_end = command.find("\n", marker) if marker >= 0 else -1
    return command if line_end < 0 else command[:line_end]


def secret_matches(name: str, tool_input: dict[str, Any], patterns: tuple[str, ...], home: str,
                   cwd: str | None) -> list[tuple[str, str]]:
    """Each path a call names (call_paths) that marks a possible secret, as given, with the pattern it matched."""
    if not patterns:
        return []
    matches = []
    for path in call_paths(name, tool_input):
        pattern = matching_pattern(path, patterns, home, cwd)
        if pattern is not None:
            matches.append((path, pattern))
    return matches
