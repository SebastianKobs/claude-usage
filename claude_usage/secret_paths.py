"""Possible secret locations a tool call named, for the session view's warning: the paths in a call's input matched
against `[secrets] patterns`, read from the transcript on demand and never stored.

A pattern is a name that matches any part of a path (`.env`, `*.pem`, `id_rsa`), a path from the home folder or the
root that matches it and everything below it (`~/.ssh`, `/mnt/?/Users/*/.ssh`, wildcards per part), or either
negated with `!` (`!.env.example`), which exempts what it matches; the last pattern that matches decides, as in a
.gitignore. It is a heuristic: a command's words are taken as paths, quoted text only where it holds a slash (a
commit message or a search pattern naming `.env` is no access), and a heredoc's text only for an inline script."""
import fnmatch
import posixpath
import re
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
DRIVE = re.compile(r"^[A-Za-z]:/")


def parse_patterns(values: dict[str, Any]) -> tuple[str, ...]:
    """The config's [secrets] patterns; none without the table. Raises ConfigError for anything but a list of
    non-empty strings."""
    secrets = values.get("secrets") or {}
    if not isinstance(secrets, dict):
        raise config.ConfigError(f"secrets: expected a table, got {secrets!r}")
    patterns = secrets.get("patterns", [])
    if not isinstance(patterns, list) or not all(isinstance(pattern, str) and pattern.strip("!")
                                                 for pattern in patterns):
        raise config.ConfigError(f"secrets.patterns: expected a list of non-empty strings, got {patterns!r}")
    return tuple(patterns)


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
    parts = normalized_parts(path, home, cwd)
    found = None
    for pattern in patterns:
        negated = pattern.startswith("!")
        if pattern_matches(parts, pattern[1:] if negated else pattern, home):
            found = None if negated else pattern
    return found


def command_words(command: str) -> list[str]:
    """The words of a command that may be paths: plain words and an option's value (--env-file=.env gives .env),
    quoted text only where it holds a slash; no options, no URLs. A heredoc's text counts only for an inline script
    (its quoted paths), since a file written or a message may mention anything."""
    marker = command.find("<<")
    line_end = command.find("\n", marker) if marker >= 0 else -1
    head, body = (command, "") if line_end < 0 else (command[:line_end], command[line_end + 1:])
    words = []
    for match in SHELL_WORD.finditer(head):
        plain = match.group(3)
        if plain is None:
            words += [text for text in match.groups()[:2] if text and "/" in text]
        elif "://" not in plain:
            words += [part for part in plain.split("=") if part and not part.startswith("-")]
    if body and tool_kinds.command_kind(command) == "inline_script":
        for match in QUOTED_TEXT.finditer(body):
            words += [text for text in match.groups() if text and "/" in text]
    return words


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


def finder(patterns: tuple[str, ...], home: str) -> tool_kinds.SecretFinder:
    """secret_matches with these patterns and home folder, as tool_kinds.read_calls asks for each call."""
    def find(name: str, tool_input: dict[str, Any], cwd: str | None) -> list[tuple[str, str]]:
        """The call's paths that mark a possible secret, with their patterns."""
        return secret_matches(name, tool_input, patterns, home, cwd)
    return find


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
