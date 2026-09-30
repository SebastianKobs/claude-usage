"""web/: checks over the page's Svelte sources and their build settings that need no node."""
import hashlib
import json
import re
import unittest
from pathlib import Path

REPO = Path(__file__).resolve().parent.parent
WEB = REPO / "web"
MANIFEST = WEB / "build.json"                           # written by make build, committed with the bundle
BUNDLE = REPO / "claude_usage" / "static" / "js" / "app.js"
LICENSES = BUNDLE.with_name("app-licenses.md")          # what the bundle holds of other packages, and their licenses
STALE = "run make build: the bundle was built from other sources"
# what the build reads besides the modules it bundles: the installed versions and every setting
SETTINGS = {"web/package.json", "web/package-lock.json", "web/tsconfig.json", "web/svelte.config.js",
            "web/vite.config.ts"}


def read(path):
    """A file's text."""
    return path.read_text(encoding="utf-8")


def digest(path):
    """A file's sha256, as the build records it."""
    return hashlib.sha256(path.read_bytes()).hexdigest()


def components():
    """Every Svelte component under web/src."""
    return sorted((WEB / "src").rglob("*.svelte"))


def markup(path):
    """A component's template: its text without the script and style blocks."""
    return re.sub(r"<(script|style)\b.*?</\1>", "", read(path), flags=re.DOTALL)


class BuildSettingsTest(unittest.TestCase):
    def test_no_component_injects_its_css(self):
        # the CSP allows no <style> the page adds, and a custom element's CSS is always injected
        for path in components():
            with self.subTest(component=path.name):
                options = " ".join(re.findall(r"<svelte:options\b[^>]*>", read(path)))
                self.assertNotIn("css=", options)
                self.assertNotIn("customElement", options)

    def test_no_component_writes_a_style_attribute(self):
        # the CSP will drop style attributes (3.34): style: sets a style through the CSSOM, while a style attribute
        # and a component's --x prop, which wraps the component in an element with one, need them
        for path in components():
            with self.subTest(component=path.name):
                self.assertNotRegex(markup(path), r"\sstyle\s*=")
                self.assertNotRegex(markup(path), r"<[A-Z][\w.]*\b[^>]*\s--[\w-]+\s*=")

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
        # nothing is installed to run the page: the libraries the bundle holds are built in, so they are dev ones
        self.assertNotIn("dependencies", package)


class BuildManifestTest(unittest.TestCase):
    def recorded(self):
        """What the last build read (sources) and wrote (outputs): each file's sha256 by its path in the checkout."""
        self.assertTrue(MANIFEST.is_file(), STALE)
        return json.loads(read(MANIFEST))

    def test_the_bundle_was_built_from_the_files_as_they_are(self):
        # a source changed or removed since the build, or a bundle committed without its build
        recorded = self.recorded()
        files = {**recorded["sources"], **recorded["outputs"]}
        stale = sorted(path for path, sha in files.items() if not (REPO / path).is_file() or digest(REPO / path) != sha)
        self.assertEqual(stale, [], STALE)

    def test_the_build_records_its_settings_and_its_entry(self):
        self.assertLessEqual(SETTINGS | {"web/src/main.ts"}, set(self.recorded()["sources"]))

    def test_the_build_records_only_our_own_sources(self):
        # the lockfile stands for what node_modules holds
        outside = [path for path in self.recorded()["sources"]
                   if not path.startswith("web/") or "node_modules" in path.split("/")]
        self.assertEqual(outside, [])

    def test_the_build_records_the_bundle(self):
        self.assertIn("claude_usage/static/js/app.js", self.recorded()["outputs"])

    def test_the_build_records_the_bundles_licenses(self):
        self.assertIn(LICENSES.relative_to(REPO).as_posix(), self.recorded()["outputs"])


class BundleTest(unittest.TestCase):
    def test_the_bundle_ships_the_licenses_of_what_it_holds(self):
        licenses = read(LICENSES)
        for package in ("svelte", "marked", "dompurify", "highlight.js"):
            with self.subTest(package=package):
                self.assertIn(f"## {package} - ", licenses)

    def test_the_bundle_creates_only_dompurifys_trusted_types_policy(self):
        # fragments: 'tree' builds templates without one; 3.34's CSP names only DOMPurify's and highlight.js's
        bundle = read(BUNDLE)
        self.assertEqual(len(re.findall(r"createPolicy\(", bundle)), 1)
        self.assertIn('"dompurify"', bundle)


if __name__ == "__main__":
    unittest.main()
