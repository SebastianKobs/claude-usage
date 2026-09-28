"""static/: checks over the page's scripts, stylesheets and markup that don't need a browser."""
import json
import re
import shutil
import subprocess
import unittest
from pathlib import Path

from claude_usage import queries
from claude_usage import server
from claude_usage import store
from claude_usage import turns

ROOT = Path(__file__).resolve().parent.parent
STATIC = Path(server.__file__).resolve().parent / "static"
OWN_SCRIPTS = sorted(path for path in (STATIC / "js").glob("*.js"))
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


def run_function(script, name, *arguments):
    """Calls a script's top-level function, which must use nothing else of the page, in node; its result."""
    source = re.search(rf"^function {name}\(.*?^\}}$", read(STATIC / "js" / script), re.DOTALL | re.MULTILINE)
    program = f"{source.group(0)}\nprocess.stdout.write(JSON.stringify({name}(...{json.dumps(arguments)})));"
    result = subprocess.run(["node", "-e", program], capture_output=True, text=True, check=True, timeout=30)
    return json.loads(result.stdout)


def object_keys(script, name):
    """The keys of a script's `const name = {…}` object literal."""
    body = re.search(rf"const {name} = \{{(.*?)\}};", read(STATIC / "js" / script), re.DOTALL).group(1)
    return set(re.findall(r"(\w+):", body))


class ScriptTest(unittest.TestCase):
    def test_every_rebuild_cause_has_its_words(self):
        self.assertEqual(object_keys("chat.js", "REBUILD_CAUSES"), {"model", "idle", "prefix"})

    def test_every_injected_kind_that_is_no_attachment_type_has_its_words(self):
        self.assertEqual(object_keys("chat.js", "INJECTED_KINDS"), {"meta", "skill", "summary"})

    def test_every_compaction_verdict_has_its_words(self):
        self.assertEqual(object_keys("chat.js", "COMPACTION_VERDICTS"), set(turns.VERDICTS))

    def test_every_compaction_trigger_has_its_words(self):
        self.assertEqual(object_keys("drilldown.js", "COMPACTION_TRIGGERS"), {"manual", "auto"})

    def test_the_context_chart_stacks_the_three_parts_of_a_turn(self):
        body = re.search(r"const CONTEXT_PARTS = \[(.*?)\];", read(STATIC / "js" / "drilldown.js"), re.DOTALL).group(1)
        self.assertEqual(re.findall(r'field: "(\w+)"', body), ["cache_read", "cache_write", "new_input"])

    def test_the_page_orders_effort_levels_like_the_report(self):
        body = re.search(r"const EFFORT_ORDER = \[(.*?)\];", read(STATIC / "js" / "util.js")).group(1)
        self.assertEqual(tuple(re.findall(r'"(\w+)"', body)), queries.EFFORT_ORDER)

    def test_every_hatched_effort_level_has_a_shade(self):
        self.assertLessEqual(object_keys("util.js", "HATCH_SHADES"), object_keys("util.js", "EFFORT_SHADES"))
        self.assertIn(store.ULTRACODE, object_keys("util.js", "HATCH_SHADES"))

    def test_html_is_inserted_only_by_the_two_sanitized_paths_in_chat_js(self):
        uses = {path.name: len(re.findall(r"\binnerHTML\b", read(path))) for path in OWN_SCRIPTS}
        self.assertEqual({name: count for name, count in uses.items() if count}, {"chat.js": 2})

    def test_the_scripts_load_in_the_order_claude_md_gives(self):
        loaded = [Path(source).stem.replace(".min", "").replace(".umd", "")
                  for source in re.findall(r'<script src="/static/js/([^"]+)"', dashboard())]
        documented = re.search(r"loaded in order: (.+?)\n\s+\(calls setup\(\)\)", read(ROOT / "CLAUDE.md"),
                               re.DOTALL).group(1)
        names = [name.strip() for name in re.sub(r"\s+", " ", documented).split(",")]
        aliases = {"highlight.js": "highlight", "marked": "marked", "DOMPurify": "purify", "main": "main"}
        self.assertEqual(loaded, [aliases.get(name, name) for name in names])

    def test_every_own_script_is_loaded(self):
        loaded = set(re.findall(r'<script src="/static/js/([^"/]+\.js)"', dashboard()))
        self.assertEqual(loaded, {path.name for path in OWN_SCRIPTS})

    def test_every_table_toggle_has_its_table(self):
        markup = dashboard()
        loop = r"for \(const name of (\[[^\]]+\])\) \{\s+document.getElementById\(`\$\{name\}-table-toggle"
        toggles = re.search(loop, read(STATIC / "js" / "main.js")).group(1)
        for name in re.findall(r'"([\w-]+)"', toggles):
            with self.subTest(name=name):
                self.assertIn(f'id="{name}-table-toggle"', markup)
                self.assertIn(f'id="{name}-table"', markup)


class CompactionWordingTest(unittest.TestCase):
    def test_the_one_time_amount_reads_as_a_cost(self):
        # "one-time $0.12" read like a saving; the page says "costs $0.12 once"
        for path in OWN_SCRIPTS:
            strings = re.findall(r'"[^"\n]*"|`[^`]*`', read(path))
            with self.subTest(script=path.name):
                self.assertEqual([text for text in strings if re.search(r"one-time", text, re.IGNORECASE)], [])


class VerdictToneTest(unittest.TestCase):
    @unittest.skipUnless(shutil.which("node"), "needs node")
    def test_a_saving_is_a_gain_a_proven_loss_a_loss_the_rest_neutral(self):
        tones = {verdict: run_function("chat.js", "verdictTone", {"verdict": verdict}) for verdict in turns.VERDICTS}
        self.assertEqual(tones, {"saved": "gain", "cost_more": "loss", "even": None, "forced": None, "open": None,
                                 "unknown": None})

    @unittest.skipUnless(shutil.which("node"), "needs node")
    def test_a_stretch_not_paid_off_yet_is_a_loss_so_far(self):
        self.assertEqual(run_function("chat.js", "verdictTone", {"verdict": "open", "net": -0.21}), "loss")
        self.assertIsNone(run_function("chat.js", "verdictTone", {"verdict": "open", "net": 0.05}))

    def test_a_loss_so_far_shows_its_amount(self):
        body = re.search(r"^function verdictText\(.*?^\}$", read(STATIC / "js" / "chat.js"),
                         re.DOTALL | re.MULTILINE).group(0)
        self.assertIn("so far", body)

    def test_both_tones_have_a_text_color_in_every_theme(self):
        for theme in ("light", "dark"):
            text = read(STATIC / "css" / "themes" / f"{theme}.css")
            with self.subTest(theme=theme):
                self.assertIn("--gain-text:", text)
                self.assertIn("--loss-text:", text)


class CompactCallTest(unittest.TestCase):
    NOW = "2026-09-28T12:00:00.000+00:00"

    def detail(self, live=True, likely=True, warm_until="2026-09-28T12:30:00.000+00:00", cold_saving=-0.5,
               compactions=()):
        """A session's detail with the gauge's preview of compacting now, and the main thread's compactions."""
        return {"live": live, "agents": [{"agent_id": None, "compactions": list(compactions)},
                                         {"agent_id": "a1", "compactions": [{"versus_keeping": None}]}],
                "current": {"compact_now": {
                    "likely_pays": likely, "cache_warm_until": warm_until,
                    "estimate": {"breakeven_calls": 6, "calls_ahead": 40.2, "cold_saving": cold_saving}}}}

    def compaction(self, net, one_time=0.42, net_high=None, input_side=0.3):
        """A compaction row with its comparison against keeping the context: net and one-time cost at the summary
        estimate, net_high and the input side without it."""
        return {"versus_keeping": {"net": net, "one_time": one_time, "net_high": net_high, "call_low": input_side,
                                   "rewrite": 0.0}}

    def kind(self, detail):
        """compactCallKind of this detail at NOW."""
        return run_function("drilldown.js", "compactCallKind", detail, self.NOW)

    @unittest.skipUnless(shutil.which("node"), "needs node")
    def test_a_live_session_where_compacting_likely_pays_gets_the_call(self):
        self.assertEqual(self.kind(self.detail()), "warm")

    @unittest.skipUnless(shutil.which("node"), "needs node")
    def test_no_call_where_it_likely_does_not_pay_or_the_session_has_ended(self):
        self.assertIsNone(self.kind(self.detail(likely=False)))
        self.assertIsNone(self.kind(self.detail(live=False)))
        self.assertIsNone(self.kind({"live": True, "current": None}))

    @unittest.skipUnless(shutil.which("node"), "needs node")
    def test_once_the_cache_has_expired_the_call_comes_where_compacting_cold_saves_at_once(self):
        expired = "2026-09-28T11:00:00.000+00:00"
        self.assertEqual(self.kind(self.detail(likely=False, warm_until=expired, cold_saving=1.2)), "cold")
        self.assertIsNone(self.kind(self.detail(warm_until=expired, cold_saving=-0.5)))

    @unittest.skipUnless(shutil.which("node"), "needs node")
    def test_the_call_comes_once_the_last_compaction_has_gained_at_least_what_it_cost(self):
        self.assertEqual(self.kind(self.detail(compactions=[self.compaction(-1.0), self.compaction(0.42)])), "warm")
        self.assertEqual(self.kind(self.detail(compactions=[self.compaction(0.9)])), "warm")

    @unittest.skipUnless(shutil.which("node"), "needs node")
    def test_no_call_while_the_last_compactions_gain_is_below_its_cost(self):
        # 28 Sept., 22:49: +$0.26 against ~$0.42 once
        self.assertIsNone(self.kind(self.detail(compactions=[self.compaction(0.26)])))
        self.assertIsNone(self.kind(self.detail(compactions=[self.compaction(0.9), self.compaction(-0.1)])))

    @unittest.skipUnless(shutil.which("node"), "needs node")
    def test_once_the_cache_has_expired_the_call_does_not_wait_for_the_last_compaction(self):
        # compacting cold saves at once, so waiting would not pay off
        expired = "2026-09-28T11:00:00.000+00:00"
        self.assertEqual(self.kind(self.detail(warm_until=expired, cold_saving=1.2,
                                               compactions=[self.compaction(-0.1)])), "cold")

    @unittest.skipUnless(shutil.which("node"), "needs node")
    def test_no_call_right_after_a_compaction_with_no_call_since(self):
        self.assertIsNone(self.kind(self.detail(compactions=[{"versus_keeping": None}])))

    @unittest.skipUnless(shutil.which("node"), "needs node")
    def test_without_a_summary_estimate_the_gain_on_the_input_side_must_reach_its_cost(self):
        self.assertEqual(self.kind(self.detail(compactions=[self.compaction(None, None, 0.3)])), "warm")
        self.assertIsNone(self.kind(self.detail(compactions=[self.compaction(None, None, 0.2)])))

    def test_the_copy_button_is_wired_in_the_script_not_inline(self):
        script = read(STATIC / "js" / "drilldown.js")
        self.assertIn('id: "compact-copy"', script)
        self.assertIn("navigator.clipboard", script)
        self.assertNotIn("onclick", script)


class ChatOrderTest(unittest.TestCase):
    def test_the_order_switch_is_a_toggle_kept_as_a_preference(self):
        script = read(STATIC / "js" / "chat.js")
        self.assertRegex(script, r'id: "chat-order", "aria-pressed"')
        self.assertIn("savePreference(CHAT_ORDER_PREFERENCE", script)
        self.assertIn("readPreference(CHAT_ORDER_PREFERENCE)", script)

    def test_the_order_switch_is_an_arrow_turning_with_the_order(self):
        script = read(STATIC / "js" / "chat.js")
        self.assertIn('class: "chat-order-arrow"', script)
        self.assertIn('"aria-label": "Oldest first"', script)
        rule = css_block(read(STATIC / "css" / "common.css"), '#chat-order[aria-pressed="true"] .chat-order-arrow')
        self.assertIn("rotate(180deg)", rule)

    def test_the_conversation_is_its_own_framed_section(self):
        script = read(STATIC / "js" / "chat.js")
        self.assertIn('el("section", {class: "chat-section", id: "chat-section"', script)
        self.assertIn("border", css_block(read(STATIC / "css" / "common.css"), ".chat-section {"))
        self.assertIn('document.getElementById("chat-section")', read(STATIC / "js" / "drilldown.js"))

    def test_a_shown_conversation_can_be_closed(self):
        script = read(STATIC / "js" / "chat.js")
        self.assertIn('id: "chat-close"', script)
        closing = script[script.index("function closeChat"):]
        closing = closing[:closing.index("\n}\n")]
        self.assertIn("chatRequest++", closing)
        self.assertIn("shownChat = null", closing)
        self.assertIn("focus()", closing)

    @unittest.skipUnless(shutil.which("node"), "needs node")
    def test_newest_first_keeps_each_calls_entries_in_their_order(self):
        entries = [{"kind": "prompt", "message_id": None}, {"kind": "thinking", "message_id": "a"},
                   {"kind": "tool", "message_id": "a"}, {"kind": "injected", "message_id": None},
                   {"kind": "text", "message_id": "b"}, {"kind": "text", "message_id": "c"}]
        ordered = run_function("chat.js", "orderedEntries", entries, False)
        self.assertEqual([(entry["kind"], entry["message_id"]) for entry in ordered],
                         [("text", "c"), ("text", "b"), ("injected", None), ("thinking", "a"), ("tool", "a"),
                          ("prompt", None)])

    @unittest.skipUnless(shutil.which("node"), "needs node")
    def test_oldest_first_is_the_transcripts_order(self):
        entries = [{"kind": "prompt", "message_id": None}, {"kind": "text", "message_id": "a"}]
        self.assertEqual(run_function("chat.js", "orderedEntries", entries, True), entries)


class SessionSectionsTest(unittest.TestCase):
    @unittest.skipUnless(shutil.which("node"), "needs node")
    def test_the_conversation_takes_the_tools_place_while_its_transcript_exists(self):
        self.assertEqual(run_function("drilldown.js", "toolsAndChat", True, ["tools"], ["chat"]),
                         [["chat"], ["tools"]])

    @unittest.skipUnless(shutil.which("node"), "needs node")
    def test_without_a_transcript_the_tools_stay_and_the_conversation_comes_last(self):
        self.assertEqual(run_function("drilldown.js", "toolsAndChat", False, ["tools"], ["chat"]),
                         [["tools"], ["chat"]])

    def test_the_session_view_places_them_by_it(self):
        self.assertIn("toolsAndChat(detail.transcript", read(STATIC / "js" / "drilldown.js"))


class SessionPollTest(unittest.TestCase):
    def function_body(self, name):
        """main.js's function `name`, from its line to its closing brace."""
        return re.search(rf"^(async )?function {name}\(.*?^\}}$", read(STATIC / "js" / "main.js"),
                         re.DOTALL | re.MULTILINE).group(0)

    def test_opening_another_session_or_hiding_the_tab_stops_the_open_sessions_poll(self):
        for name in ("loadSession", "pollWhileVisible", "pollSession"):
            with self.subTest(name=name):
                self.assertIn("clearTimeout(sessionTimer)", self.function_body(name))

    def test_a_changed_session_is_drawn_in_place_with_its_conversation(self):
        body = self.function_body("refreshSession")
        self.assertIn("renderDrilldown(session, true)", body)
        self.assertIn("refreshChat(session.session_id)", body)


class StyleTest(unittest.TestCase):
    def test_every_variable_used_is_defined_for_every_theme(self):
        # light.css and common.css apply in every theme; the others only override
        defaults = set(re.findall(r"(--[\w-]+):", read(STATIC / "css" / "themes" / "light.css")
                                  + read(STATIC / "css" / "common.css")))
        sources = STYLESHEETS + OWN_SCRIPTS
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
        block = re.search(rf"\n  {theme}: \{{(.*?)\n  \}},", read(STATIC / "js" / "themes.js"), re.DOTALL).group(1)
        return set(re.findall(r'^\s+"([^"]+)":', block, re.MULTILINE))

    def labels(self):
        """The labels the page themes: data-label in the markup, themed() and tile() in the scripts, and the
        by-model chart's title per time unit."""
        found = set(re.findall(r'data-label="([^"]+)"', dashboard()))
        for path in OWN_SCRIPTS:
            text = read(path)
            found |= set(re.findall(r'themed\("[a-z0-9]+", "([^"]+)"', text))
            found |= set(re.findall(r'\btile\("([^"]+)"', text))
            for template in re.findall(r"`(Per \$\{buckets\.unit\}, [^`]+)`", text):
                found |= {template.replace("${buckets.unit}", unit) for unit in ("day", "hour")}
        return found

    def test_every_label_has_each_themes_wording(self):
        for theme in GIMMICK_THEMES:
            with self.subTest(theme=theme):
                self.assertEqual(sorted(self.labels() - self.copy(theme)), [])

    def test_every_wording_belongs_to_a_label(self):
        # a label can also reach themed() through a variable: then it is a string elsewhere in the scripts
        scripts = "".join(read(path) for path in OWN_SCRIPTS if path.name != "themes.js")
        for theme in GIMMICK_THEMES:
            with self.subTest(theme=theme):
                unused = [key for key in self.copy(theme) - self.labels() if f'"{key}"' not in scripts]
                self.assertEqual(sorted(unused), [])


if __name__ == "__main__":
    unittest.main()
