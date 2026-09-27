"""Settings: config.toml holds the defaults, config.local.toml (optional, gitignored) overrides them. Tables are
merged key by key, at any depth, so a local file can change one price field; every other value is replaced.
Relative paths are taken from the folder of the config files, so the tool works from any working directory."""
import tomllib
from dataclasses import dataclass
from pathlib import Path
from typing import Any

DEFAULT_DIR = Path(__file__).resolve().parent.parent
CONFIG_FILE = "config.toml"
LOCAL_CONFIG_FILE = "config.local.toml"

Values = dict[str, Any]


class ConfigError(Exception):
    """A config file is missing or broken, or a value has the wrong type; the message names the file or key."""


@dataclass(frozen=True)
class Config:
    """The merged settings and the folder their relative paths are taken from."""
    directory: Path
    values: Values

    def path(self, key: str) -> Path:
        """The top-level path setting `key`, with ~ expanded and relative paths taken from the config folder."""
        value = self.values.get(key)
        if not isinstance(value, str) or not value:
            raise ConfigError(f"{key}: expected a path in {self.directory / CONFIG_FILE}, got {value!r}")
        path = Path(value).expanduser()
        if path.is_absolute():
            return path
        return self.directory / path


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


def load(directory: Path = DEFAULT_DIR) -> Config:
    """config.toml from directory, with config.local.toml merged over it if that exists."""
    values = read_toml(directory / CONFIG_FILE)
    local_path = directory / LOCAL_CONFIG_FILE
    if local_path.exists():
        values = merge(values, read_toml(local_path))
    return Config(directory, values)
