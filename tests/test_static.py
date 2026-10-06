"""The page without a browser or node: what static/ serves, and the stylesheets' themes. How the page behaves is the
Vitest tests' and the browser check's."""
import base64
import re
import unittest
from pathlib import Path

from claude_usage import notify
from claude_usage import server
from helpers import page_file

STATIC = Path(server.__file__).resolve().parent / "static"
COLORS = page_file("colors.ts")                         # the model colors and effort levels
STYLESHEETS = sorted((STATIC / "css").rglob("*.css"))
GIMMICK_THEMES = ("hacker", "startup", "rgb")
# variables a gimmick theme defines for its own file only
PRIVATE_VARIABLE = re.compile(r"--(term|flex|rgb)-[a-z]+")


def read(path):
    """A file's text."""
    return path.read_text(encoding="utf-8")


def dashboard():
    """The page's markup."""
    return read(STATIC / "dashboard.html")


def css_block(text, selector):
    """The declarations of the first rule whose selector starts with selector."""
    start = text.index(selector)
    return text[text.index("{", start) + 1:text.index("}", start)]


def declarations(block):
    """A rule's custom properties, name -> value."""
    return dict(re.findall(r"(--[\w-]+):\s*([^;]+);", block))


class ScriptTest(unittest.TestCase):
    def test_the_page_is_the_bundle_mounted_on_an_empty_main(self):
        # the app (web/src/app/App.svelte) draws everything, so the page holds only its head and the mount point
        page = dashboard()
        self.assertEqual(re.findall(r"<script\b[^>]*>", page), ['<script type="module" src="/static/js/app.js">'])
        self.assertIn("<main></main>", page)
        body = page[page.index("<body>"):]
        self.assertEqual(re.findall(r"<(?!/?(?:body|main|script)\b)[a-z]+", body), [])

    def test_the_tab_icon_is_the_notifications_app_icon_inline(self):
        # without an icon named the browser asks for /favicon.ico, which the CSP blocks: it lets images in as data: only
        icon = re.search(r'<link rel="icon" type="image/png" href="data:image/png;base64,([^"]+)">', dashboard())
        self.assertIsNotNone(icon)
        self.assertEqual(base64.b64decode(re.sub(r"\s", "", icon.group(1))),
                         (notify.ICONS_DIR / f"{notify.APP_ICON}.png").read_bytes())

    def test_no_script_but_the_bundle_is_served(self):
        self.assertEqual([path.name for path in (STATIC / "js").glob("*.js")], ["app.js"])


class VerdictToneTest(unittest.TestCase):

    def test_both_tones_have_a_text_color_in_every_theme(self):
        for theme in ("light", "dark"):
            text = read(STATIC / "css" / "themes" / f"{theme}.css")
            with self.subTest(theme=theme):
                self.assertIn("--gain-text:", text)
                self.assertIn("--loss-text:", text)


class StyleTest(unittest.TestCase):
    def test_every_variable_used_is_defined_for_every_theme(self):
        # light.css and common.css apply in every theme; the others only override
        defaults = set(re.findall(r"(--[\w-]+):", read(STATIC / "css" / "themes" / "light.css")
                                  + read(STATIC / "css" / "common.css")))
        sources = STYLESHEETS + [COLORS, page_file("tiles.ts"), page_file("costly.ts"), page_file("limits.ts")]
        used = {name for path in sources for name in re.findall(r"var\((--[\w-]+)", read(path))}
        # a --series-N or --shade-step-N built in a script counts for every slot
        used = {name for name in used if not name.endswith("-")}
        used |= {f"--{kind}-{slot}" for kind in ("series", "shade-step") for slot in [*range(1, 9), "other"]}
        missing = sorted(name for name in used - defaults if not PRIVATE_VARIABLE.fullmatch(name))
        self.assertEqual(missing, [])

    def test_the_dark_palette_is_the_same_for_auto_and_picked(self):
        text = read(STATIC / "css" / "themes" / "dark.css")
        automatic = declarations(css_block(text, ':root:where(:not([data-theme="light"]))'))
        picked = declarations(css_block(text, ':root[data-theme="dark"]'))
        self.assertEqual(automatic, picked)

    def test_the_gimmick_themes_share_the_dark_palette(self):
        selector = re.search(r'(:root\[data-theme="dark"\][^{]*)\{', read(STATIC / "css" / "themes" / "dark.css"))
        for theme in GIMMICK_THEMES:
            with self.subTest(theme=theme):
                self.assertIn(f':root[data-theme="{theme}"]', selector.group(1))


if __name__ == "__main__":
    unittest.main()
