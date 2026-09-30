"""web/: checks over the page's Svelte sources and their build settings that need no node."""
import json
import re
import unittest
from pathlib import Path

WEB = Path(__file__).resolve().parent.parent / "web"


def read(path):
    """A file's text."""
    return path.read_text(encoding="utf-8")


def components():
    """Every Svelte component under web/src."""
    return sorted((WEB / "src").rglob("*.svelte"))


class BuildSettingsTest(unittest.TestCase):
    def test_no_component_injects_its_css(self):
        # the CSP allows no <style> the page adds, and a custom element's CSS is always injected
        for path in components():
            with self.subTest(component=path.name):
                options = " ".join(re.findall(r"<svelte:options\b[^>]*>", read(path)))
                self.assertNotIn("css=", options)
                self.assertNotIn("customElement", options)

    def test_the_compiler_neither_injects_css_nor_builds_templates_from_html(self):
        # html fragments need a Trusted Types policy of Svelte's own, which the CSP won't name
        settings = read(WEB / "svelte.config.js")
        self.assertNotIn("injected", settings)
        self.assertIn("fragments: 'tree'", settings)

    def test_the_versions_are_exact(self):
        # the lockfile pins what is installed, the exact versions what the plan checked to fit together
        package = json.loads(read(WEB / "package.json"))
        ranges = {name: version for name, version in package["devDependencies"].items()
                  if not re.fullmatch(r"\d+\.\d+\.\d+", version)}
        self.assertEqual(ranges, {})
        self.assertNotIn("dependencies", package)


if __name__ == "__main__":
    unittest.main()
