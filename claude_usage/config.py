"""Settings: the defaults ship with the package (claude_usage/config.toml); override files are merged over them in
order, each optional:

1. ~/.config/claude-usage/config.toml ($XDG_CONFIG_HOME respected): the user's own settings
2. config.local.toml in a source checkout (gitignored), for development

Tables are merged key by key, at any depth, so an override can change one price field; every other value is
replaced. Relative paths in an override count from that file's folder; relative paths in the defaults count from the
data folder: data/ in a source checkout (so the history stays next to the code), else
~/.local/share/claude-usage ($XDG_DATA_HOME respected). A checkout is recognized by its pyproject.toml.
"""
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
         data_dir: Path | None = None) -> Config:
    """The defaults with every existing override file merged over them, in order."""
    files = override_files() if overrides is None else overrides
    values = read_toml(defaults)
    base = data_home() if data_dir is None else data_dir
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
