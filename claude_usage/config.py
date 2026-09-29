"""Settings: the defaults ship with the package (claude_usage/config.toml); override files are merged over them in
order, each optional:

1. ~/.config/claude-usage/config.toml ($XDG_CONFIG_HOME respected): the user's own settings
2. config.local.toml in a source checkout (gitignored), for development

Tables are merged key by key, at any depth, so an override can change one price field; every other value is
replaced. Relative paths in an override count from that file's folder; relative paths in the defaults count from the
data folder: data/ in a source checkout (so the history stays next to the code), else
~/.local/share/claude-usage ($XDG_DATA_HOME respected). A checkout is recognized by its pyproject.toml.

Claude Code keeps its transcripts in $CLAUDE_CONFIG_DIR/projects when that is set, so that replaces the default
projects_dir; a projects_dir in an override file still wins.

settings() checks the merged values: an unknown key is refused rather than ignored, so a typo doesn't silently
leave a default in place. The [prices], [fees], [chat]/[auto_compact], [secrets] and [notify] values are checked where
they are parsed (pricing.py, compact.py, secret_paths.py, notify.py).
"""
import math
import os
import tomllib
from collections.abc import Mapping
from dataclasses import dataclass
from pathlib import Path
from typing import Any

PACKAGE_DIR = Path(__file__).resolve().parent
DEFAULTS_FILE = PACKAGE_DIR / "config.toml"
CHECKOUT_DIR = PACKAGE_DIR.parent        # a source checkout if it holds pyproject.toml
APP_NAME = "claude-usage"
USER_CONFIG_FILE = "config.toml"
LOCAL_CONFIG_FILE = "config.local.toml"
CHECKOUT_MARKER = "pyproject.toml"
CHECKOUT_DATA_DIR = "data"
CLAUDE_HOME_VARIABLE = "CLAUDE_CONFIG_DIR"
CLAUDE_PROJECTS = "projects"
MAX_PORT = 65535
# the tables the tool reads with their keys; None for tables keyed by model-id prefix
TABLES: dict[str, tuple[str, ...] | None] = {
    "serve": ("port", "live_minutes", "agent_live_minutes"),
    "fees": ("web_search_per_1000",),
    "chat": ("compact_hint_tokens", "auto_compact_warn_share", "compact_reminder_step", "auto_compact_reminder_step",
             "delegate_hint_tokens", "delegate_calls_ahead"),
    "auto_compact": None,
    "secrets": ("patterns", "network_programs", "test_patterns"),
    "notify": ("enabled", "command"),
    "prices": None,
}
VALUES = ("projects_dir", "store", "prices_checked", "retention_days")
# how many days of history the store keeps, as the dashboard's ranges offer them; 0 keeps everything
RETENTION_CHOICES = (0, 7, 30, 90, 365)

Values = dict[str, Any]


class ConfigError(Exception):
    """A config file is missing or broken, or a value has the wrong type; the message names the file or key."""


@dataclass(frozen=True)
class Config:
    """The merged settings, where each top-level key's relative path counts from, and the files that were read."""
    values: Values
    bases: dict[str, Path]
    sources: tuple[Path, ...]

    def path(self, key: str) -> Path:
        """The top-level path setting `key`, with ~ expanded and a relative path taken from where it was set."""
        value = self.values.get(key)
        if not isinstance(value, str) or not value:
            files = ", ".join(str(source) for source in self.sources)
            raise ConfigError(f"{key}: expected a path in {files}, got {value!r}")
        path = Path(value).expanduser()
        if path.is_absolute():
            return path
        return self.bases[key] / path


@dataclass(frozen=True)
class Settings:
    """The checked settings the commands use besides prices and compact hints."""
    projects_dir: Path
    store: Path
    port: int                           # 0 for any free port
    live_minutes: float                 # a session is live if its transcript changed within this many minutes
    agent_live_minutes: float           # ... or within this many while one of its agents is at work
    prices_checked: str | None          # when the prices were last checked, as the config gives it
    retention_days: int                 # the days of history the store keeps, 0 for everything


def check_keys(config: Config) -> None:
    """Raise ConfigError for an unknown key, or a table given as a plain value."""
    files = ", ".join(str(source) for source in config.sources)
    for key, value in config.values.items():
        if key not in TABLES and key not in VALUES:
            raise ConfigError(f"{key}: unknown setting in {files}")
        if key not in TABLES:
            continue
        if not isinstance(value, dict):
            raise ConfigError(f"{key}: expected a table in {files}, got {value!r}")
        known = TABLES[key]
        unknown = [name for name in value if known is not None and name not in known]
        if unknown:
            raise ConfigError(f"{key}.{unknown[0]}: unknown setting in {files}")


def settings(config: Config) -> Settings:
    """The checked Settings of a Config; raises ConfigError naming the key for an unknown or bad value."""
    check_keys(config)
    serve = config.values.get("serve") or {}
    port = serve.get("port")
    if isinstance(port, bool) or not isinstance(port, int) or not 0 <= port <= MAX_PORT:
        raise ConfigError(f"serve.port: expected a whole number from 0 to {MAX_PORT}, got {port!r}")
    live_minutes = minutes_setting(serve, "live_minutes")
    agent_live_minutes = minutes_setting(serve, "agent_live_minutes")
    retention = config.values.get("retention_days")
    if isinstance(retention, bool) or retention not in RETENTION_CHOICES or not isinstance(retention, int):
        raise ConfigError(f"retention_days: expected 0, 7, 30, 90 or 365 (0 keeps everything), got {retention!r}")
    checked = config.values.get("prices_checked")
    return Settings(projects_dir=config.path("projects_dir"), store=config.path("store"), port=port,
                    live_minutes=live_minutes, agent_live_minutes=agent_live_minutes,
                    prices_checked=str(checked) if checked else None,
                    retention_days=retention)


def minutes_setting(serve: dict[str, Any], key: str) -> float:
    """A [serve] number of minutes above 0; raises ConfigError naming the key otherwise."""
    value = serve.get(key)
    if isinstance(value, bool) or not isinstance(value, (int, float)) or not math.isfinite(value) or value <= 0:
        raise ConfigError(f"serve.{key}: expected a number above 0, got {value!r}")
    return float(value)


def is_checkout(directory: Path = CHECKOUT_DIR) -> bool:
    """True if the package runs from a source checkout (or an editable install of one)."""
    return (directory / CHECKOUT_MARKER).is_file()


def data_home(environ: Mapping[str, str] = os.environ, checkout: Path = CHECKOUT_DIR) -> Path:
    """The folder the defaults' relative paths count from: data/ in a checkout, else the XDG data folder."""
    if is_checkout(checkout):
        return checkout / CHECKOUT_DATA_DIR
    base = environ.get("XDG_DATA_HOME") or str(Path.home() / ".local" / "share")
    return Path(base) / APP_NAME


def user_config_file(environ: Mapping[str, str] = os.environ) -> Path:
    """~/.config/claude-usage/config.toml, or below $XDG_CONFIG_HOME."""
    base = environ.get("XDG_CONFIG_HOME") or str(Path.home() / ".config")
    return Path(base) / APP_NAME / USER_CONFIG_FILE


def claude_projects_dir(environ: Mapping[str, str] = os.environ) -> Path | None:
    """$CLAUDE_CONFIG_DIR/projects, where Claude Code keeps its transcripts, or None when the variable is unset.

    Claude Code takes the value as it is: no ~, and a relative one from its working folder, as here.
    """
    claude_home = environ.get(CLAUDE_HOME_VARIABLE)
    if not claude_home:
        return None
    return Path(claude_home).absolute() / CLAUDE_PROJECTS


def override_files(environ: Mapping[str, str] = os.environ, checkout: Path = CHECKOUT_DIR) -> list[Path]:
    """The override files in the order they are merged (later wins); they need not exist."""
    files = [user_config_file(environ)]
    if is_checkout(checkout):
        files.append(checkout / LOCAL_CONFIG_FILE)
    return files


def merge(base: Values, override: Values) -> Values:
    """base updated with override: tables merged recursively, every other value replaced. Returns new tables."""
    merged = dict(base)
    for key, value in override.items():
        if isinstance(value, dict) and isinstance(merged.get(key), dict):
            merged[key] = merge(merged[key], value)
        else:
            merged[key] = value
    return merged


def read_toml(path: Path) -> Values:
    """The parsed TOML file; raises ConfigError naming the file if it can't be read or parsed."""
    try:
        with path.open("rb") as handle:
            return tomllib.load(handle)
    except OSError as exc:
        raise ConfigError(f"{path}: can't read ({exc.strerror or exc})") from exc
    except tomllib.TOMLDecodeError as exc:
        raise ConfigError(f"{path}: invalid TOML ({exc})") from exc


def load(defaults: Path = DEFAULTS_FILE, overrides: list[Path] | None = None,
         data_dir: Path | None = None, environ: Mapping[str, str] = os.environ) -> Config:
    """The defaults, with $CLAUDE_CONFIG_DIR's projects folder, and every existing override file merged over them."""
    files = override_files(environ) if overrides is None else overrides
    values = read_toml(defaults)
    claude_projects = claude_projects_dir(environ)
    if claude_projects is not None:
        values["projects_dir"] = str(claude_projects)
    base = data_home(environ) if data_dir is None else data_dir
    bases = dict.fromkeys(values, base)
    sources = [defaults]
    for path in files:
        if not path.exists():
            continue
        override = read_toml(path)
        values = merge(values, override)
        bases.update(dict.fromkeys(override, path.parent))
        sources.append(path)
    return Config(values, bases, tuple(sources))
