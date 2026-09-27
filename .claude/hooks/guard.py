#!/usr/bin/env python3
"""PreToolUse guard for the main session and every subagent, registered once in .claude/settings.json. It applies
two policies to each tool call and combines their answers, most restrictive first:

1. Agent scopes, for subagents (events with an agent_type; the main session is left alone):
   - Built in, for every subagent: no writing the files that enforce this guard (PROTECTED: the Claude Code
     settings, .claude/hooks/, this file, the guard config), neither with the edit tools nor with a Bash command
     that names one of them (which also blocks `cat`; Read still works). Not configurable, so a subagent can't
     lift it by editing the config. For Bash this is a heuristic: paths hidden in globs, variables or inline code
     get through.
   - Agents listed in `hooks.agent_scopes`:
     - Bash only for one of their `commands`, exactly, with `{paths}` replaced by one or more paths below their
       `write` paths and no shell operators. Without `commands`, no Bash at all.
     - Write and the edit tools only on or below their `write` paths.
   - Every other subagent: Write and the edit tools only on or below `hooks.subagent_write` (default: the project
     directory). Their Bash is left to the project boundary.
   Everything else these tools try is denied with a reason. Other tools (Read, Grep, MCP tools) are left alone.
   `{name.key}` in a value refers to another config value: a section of the guard config, or else
   config/<name>.yml (+ <name>.local.yml) of the project, loaded only when a scope refers to it.
2. Project boundary, for everyone: a permission prompt ("ask") for any path outside the project directory or in
   `shared.never_access`, except the allowed paths in the `hooks` section (session directories, extras, exact
   paths). Bash commands themselves are allowed (sed, python3, /usr/bin/..., ...); only explicit references to
   outside data paths (~, $HOME, /etc, /var, /tmp, other repos, ..) in a command prompt. This is a heuristic, not a
   sandbox.

Combined: an agent-scope deny wins, then a boundary prompt, then the agent-scope allow of a configured command (so a
configured command that names an outside path still prompts); otherwise the hook stays silent.

Config: .claude/guard.yml, overridden by .claude/guard.local.yml; both are optional. Values there replace the
DEFAULTS below: nested mappings are merged key by key, lists are replaced, and an empty key keeps the default. The
project directory is $CLAUDE_PROJECT_DIR, or else the directory two levels above this file.

The two policies fail differently, and each part catches its own errors, so a broken agent scope never touches the
main session. Agent scopes fail closed: a config that can't be loaded (unreadable, invalid YAML, PyYAML missing) or
a broken entry or reference mean "deny" for every subagent's Bash and edit calls. The boundary fails to a prompt: an
error while checking asks with the reason. Input that isn't a JSON object is denied, since it can't tell whose call
it is. The hook never blocks a tool call by crashing.

Paths are resolved with realpath, so symlinks out of the project or out of the write paths are caught. They are
handled as strings (os.path), not pathlib: most of them come raw from shell commands and tool arguments (~, $HOME,
globs), and the checks are prefix checks on the resolved strings.
"""
import json
import os
import re
import shlex
import sys
from collections.abc import Iterator
from dataclasses import dataclass
from typing import Any

PROJECT = os.path.realpath(os.environ.get("CLAUDE_PROJECT_DIR")
                           or os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", ".."))
HOME = os.path.expanduser("~")
# Claude Code names its per-project directories after the project path with
# every non-alphanumeric character replaced by "-" (/home/x/repo -> -home-x-repo).
SLUG = re.sub(r"[^A-Za-z0-9]", "-", PROJECT)

CONFIG_FILES = (".claude/guard.yml", ".claude/guard.local.yml")     # relative to the project
CONFIG_NAME = CONFIG_FILES[0]
REFERENCED_CONFIG_DIR = "config"                                    # {name.key} -> config/<name>.yml
DEFAULTS: dict[str, Any] = {
    "shared": {
        "never_access": [],
    },
    "hooks": {
        "session_paths": ["~/.claude/projects/{slug}", "/tmp/claude-{uid}/{slug}"],
        "extra_allowed_paths": [],
        "allowed_exact": ["/dev/null", "/dev/stdin", "/dev/stdout", "/dev/stderr", "/dev/tty"],
        "bash_system_prefixes": ["/usr", "/bin", "/sbin", "/lib", "/lib32", "/lib64", "/libx32", "/opt", "/snap",
                                 "/dev"],
        "subagent_write": ["."],
        "agent_scopes": {},
    },
}

# Project boundary
# Tool argument names that hold file system paths (Read, Write, Glob, Grep, MCP tools, …).
PATH_KEYS = frozenset({"file_path", "path", "paths", "file_paths", "notebook_path",
                       "repo_path", "root", "out_dir", "cwd", "directory", "dir"})
SHELL_OPERATOR = re.compile(r"[;&|()<>]+")
REDIRECTION_PREFIX = re.compile(r"^(\d*[<>]+|&>)")     # 2>/x, >>/x, <x, &>/x
GLOB_WILDCARD = re.compile(r"[*?\[{]")
MAX_LISTED_PATHS = 5                                   # how many offending paths the prompt names

# Agent scopes
# The files that enforce this guard, relative to the project; no subagent may write them (see protected_paths()).
PROTECTED = (".claude/settings.json", ".claude/settings.local.json", ".claude/hooks", *CONFIG_FILES)
USER_SETTINGS = ("~/.claude/settings.json", "~/.claude/settings.local.json")
EDIT_TOOLS = frozenset({"Write", "Edit", "MultiEdit", "NotebookEdit"})
EDIT_PATH_KEYS = ("file_path", "notebook_path", "path")
SHELL_SPECIAL = set(";&|<>`$\n\\(){}*?[]~!#")      # anything a shell would do more with than pass a word
ENTRY_KEYS = ("write", "commands")
# {name.key}: at least one dot, so the {paths} placeholder in a command is not taken for a reference
REFERENCE = re.compile(r"\{(\w[\w-]*(?:\.\w[\w-]*)+)\}")
PATHS_PLACEHOLDER = "{paths}"                      # in a command: one or more paths below the write paths
NO_MATCH = "not a configured command"

Config = dict[str, Any]
Hit = tuple[str, str]                                  # (path as written, resolved path)


class Denied(Exception):
    """The tool call is not allowed; the message is the reason shown to the agent."""


@dataclass(frozen=True)
class Verdict:
    """The hook's answer: a permission decision ("deny", "ask" or "allow") and its reason."""
    decision: str
    reason: str


# --- shared ------------------------------------------------------------------------------------------------------

def merge(base: Config, override: Config) -> Config:
    """base updated with override: mappings merged recursively, lists and texts replaced, empty (None) keys skipped."""
    merged = dict(base)
    for key, value in override.items():
        if value is None:
            continue                                   # `key:` without a value keeps the default
        if isinstance(value, dict) and isinstance(merged.get(key), dict):
            merged[key] = merge(merged[key], value)
        else:
            merged[key] = value
    return merged


def load_files(names: tuple[str, ...]) -> tuple[Config, str | None]:
    """(config, error) for the project-relative YAML files `names`, merged in order; missing files are skipped."""
    config: Config = {}
    error = None
    for name in names:
        path = os.path.join(PROJECT, name)
        if not os.path.exists(path):
            continue
        try:
            import yaml
        except ImportError:
            return config, f"PyYAML not installed, can't read {name}"
        try:
            with open(path, encoding="utf-8") as handle:
                data = yaml.safe_load(handle)
        except (OSError, yaml.YAMLError) as exc:
            error = f"{name}: {exc}"
            continue
        if data is None:
            continue
        if not isinstance(data, dict):
            error = f"{name}: not a mapping"
            continue
        config = merge(config, data)
    return config, error


def load_config() -> tuple[Config, str | None]:
    """Return (config, error): DEFAULTS overridden by .claude/guard.yml and .claude/guard.local.yml."""
    try:
        config, error = load_files(CONFIG_FILES)
    except Exception as exc:                           # deliberately broad: the hook must never crash
        return DEFAULTS, f"{type(exc).__name__}: {exc}"
    return merge(DEFAULTS, config), error


def section(config: Config, name: str) -> Config:
    """config[name] if it is a mapping, else {}."""
    value = config.get(name)
    if isinstance(value, dict):
        return value
    return {}


def is_under(path: str, base: str) -> bool:
    return path == base or path.startswith(base + os.sep)


def expand_home(raw: str) -> str:
    """raw with $HOME, ${HOME} and ~ filled in."""
    path = raw.replace("${HOME}", HOME).replace("$HOME", HOME)
    return os.path.expanduser(path)


def real_path(raw: str, cwd: str) -> str:
    """Absolute, symlink-free form of a path as written in a tool call, relative ones taken from cwd."""
    return os.path.realpath(os.path.join(cwd, expand_home(raw)))


def display_path(path: str) -> str:
    """A resolved path relative to the project if it is inside, else absolute."""
    if is_under(path, PROJECT):
        return os.path.relpath(path, PROJECT)
    return path


def tool_input_of(event: dict[str, Any]) -> dict[str, Any]:
    tool_input = event.get("tool_input")
    if isinstance(tool_input, dict):
        return tool_input
    return {}


def cwd_of(event: dict[str, Any]) -> str:
    return event.get("cwd") or os.getcwd()


# --- project boundary --------------------------------------------------------------------------------------------

def configured_paths(config: Config, section_name: str, key: str, expand: bool = True) -> list[str]:
    """A list of path strings from the config; with expand, ~, {uid} and {slug} are filled in."""
    values = section(config, section_name).get(key) or []
    if not isinstance(values, list):
        raise ValueError(f"{section_name}.{key} in {CONFIG_NAME} must be a list")
    paths = []
    for value in values:
        if not isinstance(value, str) or not value:
            continue
        if expand:
            value = value.replace("{uid}", str(os.getuid())).replace("{slug}", SLUG)
            value = os.path.expanduser(value)
        paths.append(value)
    return paths


@dataclass(frozen=True)
class Boundary:
    """Where tools may go without a prompt: the project and the allowed paths, minus never_access."""
    never_access: tuple[str, ...]
    allowed_prefixes: tuple[str, ...]
    allowed_exact: frozenset[str]
    bash_system_prefixes: tuple[str, ...]
    config_error: str | None

    @classmethod
    def from_config(cls, config: Config, config_error: str | None) -> "Boundary":
        never_access = [os.path.join(PROJECT, path.strip("/"))
                        for path in configured_paths(config, "shared", "never_access", expand=False)]
        # Session directories plus configured extras; everything else outside PROJECT prompts.
        allowed_prefixes = [os.path.realpath(path)
                            for path in configured_paths(config, "hooks", "session_paths")
                            + configured_paths(config, "hooks", "extra_allowed_paths")]
        return cls(never_access=tuple(never_access),
                   allowed_prefixes=tuple(allowed_prefixes),
                   allowed_exact=frozenset(configured_paths(config, "hooks", "allowed_exact")),
                   bash_system_prefixes=tuple(configured_paths(config, "hooks", "bash_system_prefixes")),
                   config_error=config_error)

    def is_never_access(self, path: str) -> bool:
        return any(is_under(path, blocked) for blocked in self.never_access)

    def is_system_path(self, path: str) -> bool:
        """Program and library locations that Bash commands may name without a prompt."""
        return any(is_under(path, prefix) for prefix in self.bash_system_prefixes)

    def is_allowed(self, path: str) -> bool:
        """True for resolved paths inside the project or an allowed location, and not never_access."""
        if path in self.allowed_exact:
            return True
        if self.is_never_access(path):
            return False
        return any(is_under(path, base) for base in [PROJECT, *self.allowed_prefixes])

    def resolve(self, raw: str, cwd: str) -> str:
        """real_path(), but never_access paths stay as written, so they prompt even where the symlink is missing."""
        normalized = os.path.normpath(os.path.join(cwd, expand_home(raw)))
        if self.is_never_access(normalized):
            return normalized
        return real_path(raw, cwd)


def path_arguments(value: Any, key: str | None = None) -> Iterator[str]:
    """Every non-URL string stored under a PATH_KEYS key, at any depth of the tool input."""
    if isinstance(value, dict):
        for child_key, child in value.items():
            yield from path_arguments(child, child_key)
    elif isinstance(value, list):
        for child in value:
            yield from path_arguments(child, key)
    elif isinstance(value, str) and value and key in PATH_KEYS and "://" not in value:
        yield value


def from_input(tool: str, tool_input: dict[str, Any], cwd: str, boundary: Boundary) -> Iterator[Hit]:
    """Paths from structured tool arguments."""
    for raw in path_arguments(tool_input):
        yield raw, boundary.resolve(raw, cwd)
    pattern = tool_input.get("pattern")
    if tool == "Glob" and isinstance(pattern, str):
        if pattern.startswith(("/", "~")) or ".." in pattern:
            # check the fixed part of the pattern before the first wildcard
            fixed_part = GLOB_WILDCARD.split(pattern, maxsplit=1)[0] or "/"
            yield pattern, boundary.resolve(fixed_part, cwd)


def tokenize(command: str) -> list[str]:
    """Shell words and operators; falls back to whitespace splitting for unbalanced quotes."""
    try:
        lexer = shlex.shlex(command, posix=True, punctuation_chars=True)
        lexer.whitespace_split = True
        return list(lexer)
    except ValueError:
        return command.split()


def is_cd_target(token: str, previous: str | None) -> bool:
    """The directory argument of `cd DIR` / `pushd DIR` (not an option, operator or unknown variable)."""
    if previous not in ("cd", "pushd"):
        return False
    if token.startswith("-") or SHELL_OPERATOR.fullmatch(token):
        return False
    return "$" not in token.replace("$HOME", "")


def strip_redirection(token: str) -> str:
    """The path part of redirections and --option=value tokens: 2>/x, >>/x, <x, --file=/x."""
    token = REDIRECTION_PREFIX.sub("", token)
    if token.startswith("-") and "=" in token:
        token = token.split("=", 1)[1]
    return token


def token_parts(token: str) -> list[str]:
    """Split colon-separated lists (PATH=/a:/b) into their parts, but leave URLs whole."""
    if ":" in token and "://" not in token:
        return token.split(":")
    return [token]


def looks_like_path(part: str) -> bool:
    """Absolute, home-relative or parent-relative paths; plain relative words don't count."""
    return (part.startswith(("/", "~", "$HOME", "${HOME}"))
            or part == ".."
            or part.startswith("../")
            or "/../" in part)


def top_level_exists(part: str) -> bool:
    """Skips regex-like tokens such as /foo/p whose top-level directory doesn't exist."""
    top_level = "/" + part.lstrip("/").split("/", 1)[0]
    return os.path.exists(top_level)


def from_bash(command: str, cwd: str, boundary: Boundary) -> Iterator[Hit]:
    """Paths that a shell command refers to explicitly."""
    previous = None
    for token in tokenize(command):
        cd_target = is_cd_target(token, previous)
        previous = token
        if cd_target:
            # follow `cd DIR` so later relative paths resolve from there
            target = boundary.resolve(token, cwd)
            if not boundary.is_allowed(target) and not boundary.is_system_path(target):
                yield token, target
            cwd = target
            continue
        for part in token_parts(strip_redirection(token)):
            if not part or "://" in part:
                continue
            if not looks_like_path(part):
                # relative paths only matter when they point into a never_access path
                if "$" not in part:
                    candidate = os.path.normpath(os.path.join(cwd, part))
                    if boundary.is_never_access(candidate):
                        yield part, candidate
                continue
            if part.startswith("/") and not top_level_exists(part):
                continue
            resolved = boundary.resolve(part, cwd)
            if not boundary.is_system_path(resolved):
                yield part, resolved


def outside_paths(event: dict[str, Any], boundary: Boundary) -> list[str]:
    """Sorted descriptions ("raw -> resolved") of every path in the tool call that isn't allowed."""
    tool = event.get("tool_name", "")
    tool_input = tool_input_of(event)
    cwd = cwd_of(event)

    hits: list[Hit] = []
    command = tool_input.get("command")
    if tool == "Bash" and isinstance(command, str):
        hits += from_bash(command, cwd, boundary)
    hits += from_input(tool, tool_input, cwd, boundary)
    # a subagent/session running with cwd outside the project is itself outside
    real_cwd = os.path.realpath(cwd)
    if tool in ("Glob", "Grep") and not boundary.is_allowed(real_cwd):
        hits.append((cwd, real_cwd))

    descriptions = set()
    for raw, resolved in hits:
        if not boundary.is_allowed(resolved):
            descriptions.add(resolved if raw == resolved else f"{raw} -> {resolved}")
    return sorted(descriptions)


def permission_reason(paths: list[str], boundary: Boundary) -> str:
    listed = "; ".join(paths[:MAX_LISTED_PATHS])
    if len(paths) > MAX_LISTED_PATHS:
        listed += " …"
    reason = (f"Access outside the project directory {PROJECT} or to a shared.never_access path "
              f"(see {CONFIG_NAME}): {listed}")
    if boundary.config_error:
        reason += f" [guard config not loaded: {boundary.config_error}]"
    return reason


def boundary_verdict(event: dict[str, Any], config: Config, config_error: str | None) -> Verdict | None:
    """"ask" for a call that touches a path outside the boundary, or when the check itself fails."""
    try:
        boundary = Boundary.from_config(config, config_error)
        paths = outside_paths(event, boundary)
    except Exception as exc:                           # deliberately broad: prompt instead of crashing
        return Verdict("ask", f"guard error while checking the project boundary, see {CONFIG_NAME} "
                              f"({type(exc).__name__}: {exc})")
    if not paths:
        return None
    return Verdict("ask", permission_reason(paths, boundary))


# --- agent scopes ------------------------------------------------------------------------------------------------

@dataclass(frozen=True)
class Scope:
    """What one agent may do: its write paths as configured and resolved, its commands, and where they are set."""
    agent: str
    write_names: tuple[str, ...]
    write_paths: tuple[str, ...]
    commands: tuple[str, ...]
    source: str                                        # the config key, named in the reasons


class ConfigValues:
    """The values {name.key} references point to: a section of the guard config, else config/<name>.yml."""

    def __init__(self, config: Config) -> None:
        self.config = config
        self.other_files: dict[str, Config] = {}

    def other_file(self, name: str) -> Config:
        """config/<name>.yml (+ <name>.local.yml), loaded once; raises Denied if it is missing or broken."""
        if name not in self.other_files:
            base = os.path.join(REFERENCED_CONFIG_DIR, name)
            config, error = load_files((f"{base}.yml", f"{base}.local.yml"))
            if error or not config:
                raise Denied(f"agent guard: {base}.yml not usable ({error or 'missing or empty'})")
            self.other_files[name] = config
        return self.other_files[name]

    def lookup(self, dotted: str) -> str:
        namespace, _, rest = dotted.partition(".")
        value: Any
        if namespace in self.config:
            value = self.config
            keys = dotted.split(".")
        else:
            value = self.other_file(namespace)
            keys = rest.split(".")
        for key in keys:
            if not isinstance(value, dict) or key not in value:
                raise Denied(f"agent guard: unknown config reference {{{dotted}}}")
            value = value[key]
        if not isinstance(value, str) or not value:
            raise Denied(f"agent guard: config reference {{{dotted}}} is not a text")
        return value

    def expand(self, text: str) -> str:
        return REFERENCE.sub(lambda match: self.lookup(match.group(1)), text)


def repo_path(relative: str) -> str:
    """A repo-relative config path as a resolved absolute path."""
    return os.path.realpath(os.path.join(PROJECT, relative))


def is_in_scope(path: str, scope: Scope) -> bool:
    return any(is_under(path, base) for base in scope.write_paths)


def configured_list(entry: Config, key: str, where: str) -> list[str]:
    """entry[key] as a list of non-empty texts ([] if absent or empty); raises Denied for anything else."""
    values = entry.get(key)
    if values is None:
        return []
    is_text_list = isinstance(values, list) and all(isinstance(value, str) and value for value in values)
    if not is_text_list:
        raise Denied(f"agent guard: {where}.{key} in {CONFIG_NAME} must be a list of texts")
    return values


def make_scope(agent: str, write: list[str], commands: list[str], values: ConfigValues, source: str) -> Scope:
    """A Scope with its references expanded and its write paths resolved."""
    write_names = tuple(values.expand(path) for path in write)
    expanded_commands = tuple(values.expand(command) for command in commands)
    write_paths = tuple(repo_path(name) for name in write_names)
    return Scope(agent, write_names, write_paths, expanded_commands, source)


def listed_scope(agent: str, entry: Any, values: ConfigValues) -> Scope:
    """The agent's scope from its hooks.agent_scopes entry; raises Denied if the entry is broken."""
    where = f"hooks.agent_scopes.{agent}"
    if not isinstance(entry, dict):
        raise Denied(f"agent guard: {where} must be a mapping with {' and '.join(ENTRY_KEYS)}")
    unknown = sorted(str(key) for key in entry if key not in ENTRY_KEYS)
    if unknown:
        raise Denied(f"agent guard: {where} has unknown keys {', '.join(unknown)} (allowed: {', '.join(ENTRY_KEYS)})")
    return make_scope(agent, configured_list(entry, "write", where), configured_list(entry, "commands", where),
                      values, where)


def default_scope(agent: str, hooks: Config, values: ConfigValues) -> Scope:
    """The write scope of subagents not listed in hooks.agent_scopes: hooks.subagent_write, no commands."""
    return make_scope(agent, configured_list(hooks, "subagent_write", "hooks"), [], values, "hooks.subagent_write")


def protected_paths() -> list[str]:
    """PROTECTED and the user settings, resolved, plus this file wherever it is installed."""
    paths = [repo_path(relative) for relative in PROTECTED]
    paths += [os.path.realpath(os.path.expanduser(path)) for path in USER_SETTINGS]
    paths.append(os.path.realpath(__file__))
    return paths


def command_paths(command: str, cwd: str) -> list[str]:
    """Every word of a shell command resolved as a path, following `cd DIR`; words with variables are skipped."""
    paths = []
    previous = None
    for token in tokenize(command):
        cd_target = is_cd_target(token, previous)
        previous = token
        if cd_target:
            cwd = real_path(token, cwd)
            continue
        for part in token_parts(strip_redirection(token)):
            if part and "://" not in part and "$" not in part.replace("${HOME}", "").replace("$HOME", ""):
                paths.append(real_path(part, cwd))
    return paths


def check_protected(tool: str, tool_input: dict[str, Any], cwd: str, agent: str) -> None:
    """Raise Denied if a subagent's edit or Bash call names one of the guard's own files."""
    if tool == "Bash":
        targets = command_paths(str(tool_input.get("command", "")), cwd)
    else:
        targets = edit_targets(tool_input, cwd)
    protected = protected_paths()
    hits = sorted({display_path(target) for target in targets
                   if any(is_under(target, path) for path in protected)})
    if not hits:
        return
    listed = ", ".join(hits[:MAX_LISTED_PATHS])
    if tool == "Bash":
        raise Denied(f"{agent}: subagents may not name the guard's own files in Bash commands ({listed}); "
                     f"read them with Read")
    raise Denied(f"{agent}: subagents may not write the guard's own files ({listed})")


def write_scope_text(scope: Scope) -> str:
    names = ["the project directory" if os.path.normpath(name) == "." else name for name in scope.write_names]
    return ", ".join(names) or "nothing"


def command_problem(words: list[str], template: str, scope: Scope, cwd: str) -> str | None:
    """Why the command's words don't match the configured command template, or None if they do."""
    template_words = shlex.split(template)
    if PATHS_PLACEHOLDER not in template_words:
        if words == template_words:
            return None
        return NO_MATCH
    placeholder = template_words.index(PATHS_PLACEHOLDER)
    prefix = template_words[:placeholder]
    suffix = template_words[placeholder + 1:]
    has_frame = words[:len(prefix)] == prefix and (not suffix or words[-len(suffix):] == suffix)
    paths = words[len(prefix):len(words) - len(suffix)]
    if not has_frame or not paths:
        return NO_MATCH
    for raw in paths:
        if raw.startswith("-") or not is_in_scope(real_path(raw, cwd), scope):
            return f"`{raw}` is not a path in {write_scope_text(scope)}"
    return None


def check_command(command: str, scope: Scope, cwd: str) -> None:
    """Raise Denied unless command is one of the agent's configured commands."""
    if not scope.commands:
        raise Denied(f"{scope.agent} runs no commands ({scope.source} in {CONFIG_NAME}); "
                     f"read with Read, Grep and the MCP tools")
    hint = f"{scope.agent} may only run " + " or ".join(f"`{template}`" for template in scope.commands)
    if any(PATHS_PLACEHOLDER in template for template in scope.commands):
        hint += f", with {PATHS_PLACEHOLDER} = one or more paths in {write_scope_text(scope)}"
    if set(command) & SHELL_SPECIAL:
        raise Denied(f"shell operators or special characters are not allowed; {hint}")
    try:
        words = shlex.split(command)
    except ValueError as exc:
        raise Denied(f"unparsable command ({exc}); {hint}") from exc
    problems = [command_problem(words, template, scope, cwd) for template in scope.commands]
    if None in problems:
        return
    specific = [problem for problem in problems if problem != NO_MATCH]
    if specific:
        raise Denied(f"{specific[0]}; {hint}")
    raise Denied(hint)


def edit_targets(tool_input: dict[str, Any], cwd: str) -> list[str]:
    """The resolved paths an edit tool would write."""
    return [real_path(tool_input[key], cwd) for key in EDIT_PATH_KEYS if isinstance(tool_input.get(key), str)]


def check_edit(tool_input: dict[str, Any], scope: Scope, cwd: str) -> None:
    """Raise Denied unless every path the edit tool writes is in the agent's write paths."""
    if scope.write_names:
        rule = f"{scope.agent} may write only in {write_scope_text(scope)} ({scope.source} in {CONFIG_NAME})"
    else:
        rule = f"{scope.agent} may not write files ({scope.source} in {CONFIG_NAME})"
    targets = edit_targets(tool_input, cwd)
    if not targets:
        raise Denied(f"{rule}; no file path given")
    for target in targets:
        if not is_in_scope(target, scope):
            raise Denied(f"{rule}, not {display_path(target)}")


def scope_decision(event: dict[str, Any], config: Config, config_error: str | None) -> str | None:
    """"allow" for a configured command, None to leave the call to the boundary check; raises Denied otherwise."""
    agent = event.get("agent_type")
    if not agent:
        return None                                    # the main session
    tool = event.get("tool_name")
    if tool != "Bash" and tool not in EDIT_TOOLS:
        return None
    check_protected(tool, tool_input_of(event), cwd_of(event), agent)
    if config_error:
        raise Denied(f"agent guard: can't load {CONFIG_NAME} ({config_error})")
    hooks = section(config, "hooks")
    scopes = hooks.get("agent_scopes") or {}
    if not isinstance(scopes, dict):
        raise Denied(f"agent guard: hooks.agent_scopes in {CONFIG_NAME} must map agent names to their scopes")
    values = ConfigValues(config)
    cwd = cwd_of(event)
    tool_input = tool_input_of(event)
    if agent not in scopes:
        if tool == "Bash":
            return None                                # unlisted agents: Bash is left to the boundary
        check_edit(tool_input, default_scope(agent, hooks, values), cwd)
        return None
    scope = listed_scope(agent, scopes[agent], values)
    if tool == "Bash":
        check_command(str(tool_input.get("command", "")), scope, cwd)
        return "allow"
    check_edit(tool_input, scope, cwd)
    return None


# --- combined ----------------------------------------------------------------------------------------------------

def decide(event: dict[str, Any]) -> Verdict | None:
    """The agent-scope deny, else the boundary prompt, else the agent-scope allow, else None (stay silent)."""
    config, config_error = load_config()
    try:
        scope_result = scope_decision(event, config, config_error)
    except Denied as exc:
        return Verdict("deny", str(exc))
    except Exception as exc:                           # deliberately broad: fail closed, never crash
        return Verdict("deny", f"agent guard: {type(exc).__name__}: {exc}")
    boundary_result = boundary_verdict(event, config, config_error)
    if boundary_result is not None:
        return boundary_result
    if scope_result == "allow":
        return Verdict("allow", f"a configured command for this agent (hooks.agent_scopes in {CONFIG_NAME})")
    return None


def reply(verdict: Verdict) -> None:
    print(json.dumps({"hookSpecificOutput": {
        "hookEventName": "PreToolUse",
        "permissionDecision": verdict.decision,
        "permissionDecisionReason": verdict.reason,
    }}))


def main() -> int:
    try:
        event = json.load(sys.stdin)
    except (OSError, ValueError) as exc:
        reply(Verdict("deny", f"guard: unreadable hook input ({exc})"))
        return 0
    if not isinstance(event, dict):
        reply(Verdict("deny", "guard: hook input is not a JSON object"))
        return 0
    verdict = decide(event)
    if verdict is not None:
        reply(verdict)
    return 0


if __name__ == "__main__":
    sys.exit(main())
