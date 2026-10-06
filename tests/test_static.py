"""static/: checks over the page's scripts, stylesheets and markup that don't need a browser."""
import base64
import re
import unittest
from pathlib import Path

from claude_usage import notify
from claude_usage import queries
from claude_usage import server
from claude_usage import store
from claude_usage import tool_kinds
from claude_usage import turns
from helpers import PAGE_SOURCES
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


def page_sources():
    """The page's own sources (web/src, without the tests): its TypeScript and its Svelte components."""
    return sorted(path for path in PAGE_SOURCES.rglob("*")
                  if path.suffix in (".ts", ".svelte") and ".test." not in path.name)


def css_block(text, selector):
    """The declarations of the first rule whose selector starts with selector."""
    start = text.index(selector)
    return text[text.index("{", start) + 1:text.index("}", start)]


def declarations(block):
    """A rule's custom properties, name -> value."""
    return dict(re.findall(r"(--[\w-]+):\s*([^;]+);", block))


def object_keys(source_file, name):
    """The keys of a source file's `const name = {…}` object literal (a type annotation before the = is fine)."""
    source = read(source_file)
    body = re.search(rf"const {name}\b[^=]*= \{{(.*?)\}};", source, re.DOTALL).group(1)
    return set(re.findall(r"(\w+):", body))


class ScriptTest(unittest.TestCase):
    def test_every_rebuild_cause_has_its_words(self):
        self.assertEqual(object_keys(page_file("compact.ts"), "REBUILD_CAUSES"), {"model", "idle", "prefix"})

    def test_every_injected_kind_that_is_no_attachment_type_has_its_words(self):
        self.assertEqual(object_keys(page_file("entries.ts"), "INJECTED_KINDS"), {"meta", "skill", "summary"})

    def test_every_compaction_verdict_has_its_words(self):
        self.assertEqual(object_keys(page_file("compact.ts"), "COMPACTION_VERDICTS"), set(turns.VERDICTS))

    def test_every_compaction_trigger_has_its_words(self):
        self.assertEqual(object_keys(page_file("context.ts"), "COMPACTION_TRIGGERS"), {"manual", "auto"})

    def test_the_context_chart_stacks_the_three_parts_of_a_turn(self):
        body = re.search(r"const CONTEXT_PARTS\b[^=]*= \[(.*?)\];", read(page_file("context.ts")), re.DOTALL).group(1)
        self.assertEqual(re.findall(r"field: '(\w+)'", body), ["cache_read", "cache_write", "new_input"])

    def test_the_page_orders_effort_levels_like_the_report(self):
        body = re.search(r"const EFFORT_ORDER[^=]*= \[(.*?)\];", read(COLORS)).group(1)
        self.assertEqual(tuple(re.findall(r"'(\w+)'", body)), queries.EFFORT_ORDER)

    def test_every_hatched_effort_level_has_a_shade(self):
        self.assertLessEqual(object_keys(COLORS, "HATCH_SHADES"), object_keys(COLORS, "EFFORT_SHADES"))
        self.assertIn(store.ULTRACODE, object_keys(COLORS, "HATCH_SHADES"))

    def test_every_hatched_effort_level_has_an_angle_of_its_own(self):
        body = re.search(r"const HATCH_TURNS[^=]*= \{(.*?)\};", read(COLORS)).group(1)
        turns_by_level = dict(re.findall(r"(\w+): (-?\d+)", body))
        self.assertEqual(set(turns_by_level), object_keys(COLORS, "HATCH_SHADES"))
        self.assertEqual(len(set(turns_by_level.values())), len(turns_by_level))

    def test_the_page_knows_the_background_effort_level(self):
        self.assertIn(f"const BACKGROUND_EFFORT = '{store.BACKGROUND_EFFORT}';", read(COLORS))
        self.assertIn(store.BACKGROUND_EFFORT, object_keys(COLORS, "HATCH_SHADES"))
        self.assertIn(store.BACKGROUND_EFFORT, object_keys(COLORS, "EFFORT_SHADES"))

    def test_html_is_inserted_only_by_the_two_sanitized_paths_in_markup_ts(self):
        uses = {path.name: len(re.findall(r"\binnerHTML\b|\{@html\b", read(path))) for path in page_sources()}
        self.assertEqual({name: count for name, count in uses.items() if count}, {"markup.ts": 2})

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


class CompactionWordingTest(unittest.TestCase):
    def test_the_one_time_amount_reads_as_a_cost(self):
        # "one-time $0.12" read like a saving; the page says "costs $0.12 once"
        for path in page_sources():
            strings = re.findall(r"""'[^'\n]*'|"[^"\n]*"|`[^`]*`""", read(path))
            with self.subTest(source=path.name):
                self.assertEqual([text for text in strings if re.search(r"one-time", text, re.IGNORECASE)], [])


class VerdictToneTest(unittest.TestCase):

    def test_both_tones_have_a_text_color_in_every_theme(self):
        for theme in ("light", "dark"):
            text = read(STATIC / "css" / "themes" / f"{theme}.css")
            with self.subTest(theme=theme):
                self.assertIn("--gain-text:", text)
                self.assertIn("--loss-text:", text)


class ToolTableTest(unittest.TestCase):

    def test_every_command_kind_has_its_words(self):
        self.assertEqual(object_keys(page_file("tables.ts"), "TOOL_KINDS"), set(tool_kinds.KINDS))


class SecretAccessTest(unittest.TestCase):

    def test_the_warning_card_is_edged_in_the_warning_color(self):
        self.assertIn("var(--hint-warning-edge)", css_block(read(STATIC / "css" / "common.css"), ".secret-warning"))

    def test_each_severity_has_its_mark_color(self):
        css = read(STATIC / "css" / "common.css")
        for severity, color in (("high", "--hint-critical-edge"), ("medium", "--hint-warning-edge"),
                                ("low-medium", "--series-1"), ("low", "--text-secondary")):
            with self.subTest(severity=severity):
                self.assertIn(f"var({color})", css_block(css, f".secret-severity-{severity}"))

    def test_the_warning_is_edged_in_the_critical_color(self):
        self.assertIn("var(--status-critical)", css_block(read(STATIC / "css" / "common.css"), ".secret-alert"))


class PayoffStyleTest(unittest.TestCase):

    def test_each_tone_has_its_mark_color(self):
        css = read(STATIC / "css" / "common.css")
        for tone, color in (("soon", "--gain-text"), ("close", "--hint-warning-edge"),
                            ("unlikely", "--hint-critical-edge"), ("later", "--text-secondary")):
            with self.subTest(tone=tone):
                self.assertIn(f"var({color})", css_block(css, f".payoff-{tone}"))

    def test_the_estimate_is_full_size_text_under_a_divider_its_pay_off_in_the_primary_color(self):
        css = read(STATIC / "css" / "common.css")
        block = css_block(css, ".compact-estimate {")
        self.assertIn("border-top: 1px solid var(--border)", block)
        self.assertIn("var(--text-secondary)", block)
        self.assertNotIn("font-size", block)
        self.assertIn("var(--text-primary)", css_block(css, ".compact-estimate strong"))


class ConversationStyleTest(unittest.TestCase):

    def test_the_order_arrow_turns_with_the_order(self):
        rule = css_block(read(STATIC / "css" / "common.css"), '#chat-order[aria-pressed="true"] .chat-order-arrow')
        self.assertIn("rotate(180deg)", rule)

    def test_the_conversation_is_framed(self):
        self.assertIn("border", css_block(read(STATIC / "css" / "common.css"), ".chat-section {"))

    def test_the_skip_link_is_out_of_sight_until_it_has_focus(self):
        rule = css_block(read(STATIC / "css" / "common.css"), ".skip-link:not(:focus)")
        self.assertIn("clip-path", rule)


class PagingTest(unittest.TestCase):

    def test_the_pager_comes_before_the_table(self):
        # where it goes (TableView.test.ts); here only the room it leaves
        self.assertIn("margin-bottom: 8px", css_block(read(STATIC / "css" / "common.css"), ".pager"))

    def test_the_pager_joins_the_title_row(self):
        css = read(STATIC / "css" / "common.css")
        self.assertIn("display: flex", css_block(css, ".title-row {"))
        self.assertIn("margin-left: auto", css_block(css, ".title-row .pager"))


class LiveStateTest(unittest.TestCase):

    def test_each_tone_has_the_session_views_mark_color(self):
        css = read(STATIC / "css" / "common.css")
        for tone, color in (("soon", "--gain-text"), ("close", "--hint-warning-edge"),
                            ("medium", "--hint-warning-edge"), ("unlikely", "--hint-critical-edge"),
                            ("high", "--hint-critical-edge")):
            with self.subTest(tone=tone):
                self.assertIn(f".live-icon-{tone}", css)
                rule = re.search(rf"[^}}]*\.live-icon-{tone}\b[^{{]*\{{([^}}]*)\}}", css).group(1)
                self.assertIn(f"var({color})", rule)

    def test_waiting_is_blue(self):
        # blue, not a warning's or an alarm's hue: nothing is wrong, the session only waits (≥ 3:1 on every card)
        css = read(STATIC / "css" / "common.css")
        self.assertIn("var(--series-1)", re.search(r"\.live-icon-waiting \{([^}]*)\}", css).group(1))


class SessionListTest(unittest.TestCase):

    def test_the_app_mounts_the_list_in_its_card(self):
        app = read(page_file("App.svelte"))
        guarded = '<SectionGuard name="Sessions"><SessionsList /></SectionGuard>'
        self.assertIn(f'<div id="sessions-card">{guarded}</div>', app)
        self.assertNotIn('id="sessions-project"', dashboard())

    def test_the_search_field_looks_like_the_other_controls_in_every_theme(self):
        css = read(STATIC / "css" / "common.css")
        self.assertIn("var(--surface)", css_block(css, 'input[type="search"] {'))
        self.assertIn("var(--text-muted)", css_block(css, 'input[type="search"]::placeholder'))
        for theme in GIMMICK_THEMES:
            with self.subTest(theme=theme):
                self.assertIn(f'[data-theme="{theme}"] input[type="search"]',
                              read(STATIC / "css" / "themes" / f"{theme}.css"))


class SessionWaitTest(unittest.TestCase):

    def test_the_notice_is_in_the_waiting_tone(self):
        # blue, like the live cards' icons: nothing is wrong, a session only waits
        css = read(STATIC / "css" / "common.css")
        self.assertIn("var(--series-1)", css_block(css, ".wait-notice {"))
        self.assertIn("var(--series-1)", css_block(css, ".wait-icon {"))


class LimitWindowTest(unittest.TestCase):

    def test_the_rate_limits_section_is_drawn_by_its_component(self):
        # the chart, the windows and the latest errors, in that order, are RateLimits.svelte's markup
        app = read(page_file("App.svelte"))
        self.assertIn('<div id="limits-card"><SectionGuard name="Rate limits"><RateLimits /></SectionGuard></div>', app)
        self.assertNotIn('id="limit-windows"', dashboard())


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


class CopyTest(unittest.TestCase):
    """The gimmick themes reword labels; a label they miss shows plain, a key no label uses is dead."""

    def copy(self, theme):
        """A gimmick theme's label -> wording."""
        block = re.search(rf"\n  {theme}: \{{(.*?)\n  \}},", read(page_file("themes.ts")), re.DOTALL).group(1)
        return set(re.findall(r'^\s+"([^"]+)":', block, re.MULTILINE))

    def labels(self):
        """The labels the page themes: hype() and StatTile's label and themed note in the components, the tiles' parts
        in tiles.ts, and the by-model chart's title per time unit."""
        found = set()
        for path in sorted(PAGE_SOURCES.rglob("*.svelte")):
            found |= set(re.findall(r"\bhype\('([^']+)'\)", read(path)))
            found |= set(re.findall(r'\bnote="([^"]+)" themedNote', read(path)))
            found |= set(re.findall(r'<StatTile\s+label="([^"]+)"', read(path)))
        found |= set(re.findall(r"\blabel: '([^']+)'", read(page_file("tiles.ts"))))
        return found

    def test_every_label_has_each_themes_wording(self):
        for theme in GIMMICK_THEMES:
            with self.subTest(theme=theme):
                self.assertEqual(sorted(self.labels() - self.copy(theme)), [])

    def test_every_wording_belongs_to_a_label(self):
        # a label can also reach hype() through a variable: then it is a string elsewhere in the page's sources
        sources = "".join(read(path) for path in page_sources() if path.name != "themes.ts")
        for theme in GIMMICK_THEMES:
            with self.subTest(theme=theme):
                unused = [key for key in self.copy(theme) - self.labels() if f"'{key}'" not in sources]
                self.assertEqual(sorted(unused), [])


if __name__ == "__main__":
    unittest.main()
