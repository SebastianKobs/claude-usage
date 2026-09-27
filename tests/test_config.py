"""config.py: defaults shipped in the package, overrides merged over them in order, and where paths point to."""
import tomllib
import unittest
from fnmatch import fnmatchcase
from pathlib import Path

from claude_usage import config
from helpers import TempDirTestCase

REPO = Path(__file__).resolve().parent.parent

DEFAULTS = """\
projects_dir = "~/.claude/projects"
store = "usage.sqlite"

[serve]
port = 8765
live_minutes = 5

[prices."claude-sonnet"]
input = 3.0
output = 15.0
"""


class ConfigCase(TempDirTestCase):
    """A defaults file, override files and a data folder in the test's temp folder."""

    def setUp(self):
        super().setUp()
        self.defaults = self.tmp / "package" / "config.toml"
        self.user = self.tmp / "user" / "config.toml"
        self.local = self.tmp / "checkout" / "config.local.toml"
        self.data = self.tmp / "data"
        self.write(self.defaults, DEFAULTS)

    def write(self, path, text):
        """Write a config file, creating its folder."""
        path.parent.mkdir(parents=True, exist_ok=True)
        path.write_text(text, encoding="utf-8")

    def load(self):
        """The config from the defaults with the user and local overrides, if they exist."""
        return config.load(self.defaults, [self.user, self.local], self.data)


class DefaultsTest(ConfigCase):
    def test_defaults_without_overrides(self):
        loaded = self.load()
        self.assertEqual(loaded.values["serve"], {"port": 8765, "live_minutes": 5})
        self.assertEqual(loaded.values["prices"], {"claude-sonnet": {"input": 3.0, "output": 15.0}})
        self.assertEqual(loaded.sources, (self.defaults,))

    def test_missing_defaults_raise_with_the_file_name(self):
        self.defaults.unlink()
        with self.assertRaises(config.ConfigError) as caught:
            self.load()
        self.assertIn(str(self.defaults), str(caught.exception))


class OverrideTest(ConfigCase):
    def test_tables_are_merged_key_by_key(self):
        self.write(self.user, "[serve]\nport = 9000\n")
        self.assertEqual(self.load().values["serve"], {"port": 9000, "live_minutes": 5})

    def test_nested_tables_are_merged_too(self):
        self.write(self.user, '[prices."claude-sonnet"]\noutput = 20.0\n[prices."claude-opus"]\ninput = 5.0\n')
        prices = self.load().values["prices"]
        self.assertEqual(prices["claude-sonnet"], {"input": 3.0, "output": 20.0})
        self.assertEqual(prices["claude-opus"], {"input": 5.0})

    def test_other_values_are_replaced(self):
        self.write(self.user, 'store = "/var/lib/usage.sqlite"\nserve = "off"\n')
        values = self.load().values
        self.assertEqual((values["store"], values["serve"]), ("/var/lib/usage.sqlite", "off"))

    def test_later_overrides_win(self):
        self.write(self.user, "[serve]\nport = 9000\nlive_minutes = 3\n")
        self.write(self.local, "[serve]\nport = 9100\n")
        loaded = self.load()
        self.assertEqual(loaded.values["serve"], {"port": 9100, "live_minutes": 3})
        self.assertEqual(loaded.sources, (self.defaults, self.user, self.local))

    def test_loading_does_not_change_the_defaults(self):
        self.write(self.user, "[serve]\nport = 9000\n")
        self.load()
        self.user.unlink()
        self.assertEqual(self.load().values["serve"]["port"], 8765)

    def test_broken_override_raises_with_its_name(self):
        self.write(self.local, "[serve\n")
        with self.assertRaises(config.ConfigError) as caught:
            self.load()
        self.assertIn(str(self.local), str(caught.exception))

    def test_broken_defaults_raise_with_the_file_name(self):
        self.write(self.defaults, "store = \n")
        with self.assertRaises(config.ConfigError) as caught:
            self.load()
        self.assertIn(str(self.defaults), str(caught.exception))


class PathTest(ConfigCase):
    def test_a_relative_default_is_taken_from_the_data_folder(self):
        self.assertEqual(self.load().path("store"), self.data / "usage.sqlite")

    def test_a_relative_override_is_taken_from_its_file_folder(self):
        self.write(self.user, 'store = "history/usage.sqlite"\n')
        self.assertEqual(self.load().path("store"), self.user.parent / "history" / "usage.sqlite")

    def test_home_is_expanded(self):
        self.assertEqual(self.load().path("projects_dir"), Path.home() / ".claude" / "projects")

    def test_absolute_path_stays(self):
        self.write(self.local, 'store = "/srv/usage.sqlite"\n')
        self.assertEqual(self.load().path("store"), Path("/srv/usage.sqlite"))

    def test_missing_or_non_text_path_raises_with_the_key(self):
        self.write(self.user, "store = 5\n")
        loaded = self.load()
        for key in ("store", "nothing"):
            with self.subTest(key=key):
                with self.assertRaises(config.ConfigError) as caught:
                    loaded.path(key)
                self.assertIn(key, str(caught.exception))


class LocationTest(TempDirTestCase):
    def test_a_source_checkout_keeps_its_data_in_data(self):
        (self.tmp / "pyproject.toml").write_text("", encoding="utf-8")
        self.assertEqual(config.data_home({}, self.tmp), self.tmp / "data")

    def test_an_installed_package_uses_the_xdg_data_folder(self):
        self.assertEqual(config.data_home({"XDG_DATA_HOME": "/xdg/data"}, self.tmp),
                         Path("/xdg/data") / "claude-usage")
        self.assertEqual(config.data_home({}, self.tmp), Path.home() / ".local" / "share" / "claude-usage")

    def test_the_user_config_follows_xdg_config_home(self):
        self.assertEqual(config.user_config_file({"XDG_CONFIG_HOME": "/xdg/config"}),
                         Path("/xdg/config") / "claude-usage" / "config.toml")
        self.assertEqual(config.user_config_file({}), Path.home() / ".config" / "claude-usage" / "config.toml")

    def test_override_files_in_a_checkout_and_installed(self):
        environ = {"XDG_CONFIG_HOME": "/xdg/config"}
        user = Path("/xdg/config") / "claude-usage" / "config.toml"
        self.assertEqual(config.override_files(environ, self.tmp), [user])
        (self.tmp / "pyproject.toml").write_text("", encoding="utf-8")
        self.assertEqual(config.override_files(environ, self.tmp), [user, self.tmp / "config.local.toml"])

    def test_this_repository_is_a_checkout(self):
        self.assertEqual(config.CHECKOUT_DIR, REPO)
        self.assertEqual(config.data_home({}), REPO / "data")


class SettingsTest(ConfigCase):
    def settings(self):
        """The checked settings of the defaults with the overrides."""
        return config.settings(self.load())

    def assert_refused(self, override, *words):
        """An override config.settings refuses, with every word in the message."""
        self.write(self.user, override)
        with self.assertRaises(config.ConfigError) as caught:
            self.settings()
        for word in words:
            self.assertIn(word, str(caught.exception))

    def test_the_settings_of_the_defaults(self):
        settings = self.settings()
        self.assertEqual((settings.store, settings.port, settings.live_minutes, settings.prices_checked),
                         (self.data / "usage.sqlite", 8765, 5.0, None))

    def test_prices_checked_is_text(self):
        self.write(self.user, "prices_checked = 2026-09-27\n")
        self.assertEqual(self.settings().prices_checked, "2026-09-27")

    def test_an_unknown_key_is_refused_with_its_name(self):
        self.assert_refused('projcts_dir = "/tmp"\n', "projcts_dir", str(self.user))

    def test_an_unknown_key_in_a_table_is_refused(self):
        self.assert_refused("[serve]\nlive_minute = 3\n", "serve.live_minute")

    def test_a_table_given_as_a_value_is_refused(self):
        for key in ("prices", "chat", "serve", "fees", "auto_compact"):
            with self.subTest(key=key):
                self.assert_refused(f"{key} = 5\n", key, "table")

    def test_bad_port_or_live_minutes_are_refused(self):
        for override in ('[serve]\nport = "8765"\n', "[serve]\nport = 70000\n", "[serve]\nport = true\n",
                         "[serve]\nlive_minutes = nan\n", "[serve]\nlive_minutes = 0\n",
                         "[serve]\nlive_minutes = inf\n"):
            with self.subTest(override=override):
                self.assert_refused(override, "serve.")


class ShippedConfigTest(unittest.TestCase):
    def test_the_defaults_ship_inside_the_package(self):
        self.assertEqual(config.DEFAULTS_FILE, REPO / "claude_usage" / "config.toml")
        self.assertFalse((REPO / "config.toml").exists())

    def test_the_defaults_have_the_keys_the_tool_needs(self):
        with config.DEFAULTS_FILE.open("rb") as handle:
            values = tomllib.load(handle)
        self.assertEqual(values["store"], "usage.sqlite")
        self.assertIsInstance(values["projects_dir"], str)
        self.assertIsInstance(values["serve"]["port"], int)
        self.assertIsInstance(values["serve"]["live_minutes"], int)
        self.assertIsInstance(values["prices"], dict)

    def package_data(self):
        """The package-data globs of claude_usage in pyproject.toml."""
        with (REPO / "pyproject.toml").open("rb") as handle:
            return tomllib.load(handle)["tool"]["setuptools"]["package-data"]["claude_usage"]

    def test_the_version_comes_from_the_package(self):
        with (REPO / "pyproject.toml").open("rb") as handle:
            pyproject = tomllib.load(handle)
        self.assertEqual(pyproject["project"]["dynamic"], ["version"])
        self.assertEqual(pyproject["tool"]["setuptools"]["dynamic"]["version"], {"attr": "claude_usage.__version__"})

    def test_the_package_data_includes_the_defaults(self):
        self.assertIn("config.toml", self.package_data())

    def test_every_file_of_the_page_is_packaged(self):
        patterns = [tuple(pattern.split("/")) for pattern in self.package_data()]
        package = REPO / "claude_usage"
        files = [path.relative_to(package) for path in sorted((package / "static").rglob("*")) if path.is_file()]

        def packaged(relative):
            """Whether a glob matches: setuptools globs don't cross "/", so it needs as many parts as the path."""
            return any(len(parts) == len(relative.parts)
                       and all(fnmatchcase(part, glob) for part, glob in zip(relative.parts, parts))
                       for parts in patterns)

        self.assertEqual([relative.as_posix() for relative in files if not packaged(relative)], [])

if __name__ == "__main__":
    unittest.main()
