"""config.py: config.toml defaults, config.local.toml deep-merged over them, paths resolved from the config folder."""
import tomllib
import unittest
from pathlib import Path

from claude_usage import config
from helpers import TempDirTestCase

REPO = Path(__file__).resolve().parent.parent

DEFAULTS = """\
projects_dir = "~/.claude/projects"
store = "data/usage.sqlite"

[serve]
port = 8765
live_minutes = 5

[prices."claude-sonnet"]
input = 3.0
output = 15.0
"""


class ConfigCase(TempDirTestCase):
    """Config files written into the test's temp folder."""

    def write(self, name, text):
        """Write a config file into the test's folder."""
        (self.tmp / name).write_text(text, encoding="utf-8")

    def load(self):
        """The config from the test's folder."""
        return config.load(self.tmp)


class DefaultsTest(ConfigCase):
    def test_defaults_without_local_file(self):
        self.write("config.toml", DEFAULTS)
        loaded = self.load()
        self.assertEqual(loaded.values["serve"], {"port": 8765, "live_minutes": 5})
        self.assertEqual(loaded.values["prices"], {"claude-sonnet": {"input": 3.0, "output": 15.0}})

    def test_missing_config_file_raises_with_the_file_name(self):
        with self.assertRaises(config.ConfigError) as caught:
            self.load()
        self.assertIn("config.toml", str(caught.exception))

    def test_default_directory_is_the_project(self):
        self.assertEqual(config.DEFAULT_DIR, REPO)


class LocalOverrideTest(ConfigCase):
    def setUp(self):
        super().setUp()
        self.write("config.toml", DEFAULTS)

    def test_tables_are_merged_key_by_key(self):
        self.write("config.local.toml", "[serve]\nport = 9000\n")
        self.assertEqual(self.load().values["serve"], {"port": 9000, "live_minutes": 5})

    def test_nested_tables_are_merged_too(self):
        self.write("config.local.toml",
                   '[prices."claude-sonnet"]\noutput = 20.0\n[prices."claude-opus"]\ninput = 5.0\n')
        prices = self.load().values["prices"]
        self.assertEqual(prices["claude-sonnet"], {"input": 3.0, "output": 20.0})
        self.assertEqual(prices["claude-opus"], {"input": 5.0})

    def test_other_values_are_replaced(self):
        self.write("config.local.toml", 'store = "/var/lib/usage.sqlite"\nserve = "off"\n')
        values = self.load().values
        self.assertEqual(values["store"], "/var/lib/usage.sqlite")
        self.assertEqual(values["serve"], "off")

    def test_loading_does_not_change_the_defaults(self):
        self.write("config.local.toml", "[serve]\nport = 9000\n")
        self.load()
        (self.tmp / "config.local.toml").unlink()
        self.assertEqual(self.load().values["serve"]["port"], 8765)


class BrokenTomlTest(ConfigCase):
    def test_broken_defaults_raise_with_the_file_name(self):
        self.write("config.toml", "store = \n")
        with self.assertRaises(config.ConfigError) as caught:
            self.load()
        self.assertIn(str(self.tmp / "config.toml"), str(caught.exception))

    def test_broken_local_file_raises_with_its_name(self):
        self.write("config.toml", DEFAULTS)
        self.write("config.local.toml", "[serve\n")
        with self.assertRaises(config.ConfigError) as caught:
            self.load()
        self.assertIn(str(self.tmp / "config.local.toml"), str(caught.exception))


class PathTest(ConfigCase):
    def setUp(self):
        super().setUp()
        self.write("config.toml", DEFAULTS)

    def test_relative_path_is_taken_from_the_config_folder(self):
        self.assertEqual(self.load().path("store"), self.tmp / "data" / "usage.sqlite")

    def test_home_is_expanded(self):
        self.assertEqual(self.load().path("projects_dir"), Path.home() / ".claude" / "projects")

    def test_absolute_path_stays(self):
        self.write("config.local.toml", 'store = "/srv/usage.sqlite"\n')
        self.assertEqual(self.load().path("store"), Path("/srv/usage.sqlite"))

    def test_missing_or_non_text_path_raises_with_the_key(self):
        self.write("config.local.toml", "store = 5\n")
        loaded = self.load()
        for key in ("store", "nothing"):
            with self.subTest(key=key):
                with self.assertRaises(config.ConfigError) as caught:
                    loaded.path(key)
                self.assertIn(key, str(caught.exception))


class ShippedConfigTest(unittest.TestCase):
    def test_config_toml_has_the_keys_the_tool_needs(self):
        with (REPO / "config.toml").open("rb") as handle:
            values = tomllib.load(handle)
        self.assertIsInstance(values["projects_dir"], str)
        self.assertIsInstance(values["store"], str)
        self.assertIsInstance(values["serve"]["port"], int)
        self.assertIsInstance(values["serve"]["live_minutes"], int)
        self.assertIsInstance(values["prices"], dict)


if __name__ == "__main__":
    unittest.main()
