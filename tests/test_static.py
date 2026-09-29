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
from claude_usage import tool_kinds
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

    def test_every_hatched_effort_level_has_an_angle_of_its_own(self):
        body = re.search(r"const HATCH_TURNS = \{(.*?)\};", read(STATIC / "js" / "util.js")).group(1)
        turns_by_level = dict(re.findall(r"(\w+): (-?\d+)", body))
        self.assertEqual(set(turns_by_level), object_keys("util.js", "HATCH_SHADES"))
        self.assertEqual(len(set(turns_by_level.values())), len(turns_by_level))

    def test_the_page_knows_the_background_effort_level(self):
        self.assertIn(f'const BACKGROUND_EFFORT = "{store.BACKGROUND_EFFORT}";', read(STATIC / "js" / "util.js"))
        self.assertIn(store.BACKGROUND_EFFORT, object_keys("util.js", "HATCH_SHADES"))

    def test_a_swatch_hatch_runs_like_the_columns(self):
        # the columns' pattern turns vertical lines by the angle; the swatch's gradient runs across them
        self.assertIn("135deg", run_function("util.js", "swatchFill", "red", "blue", 45))
        self.assertIn("45deg", run_function("util.js", "swatchFill", "red", "blue", -45))
        self.assertEqual(run_function("util.js", "swatchFill", "red", None, None), "red")

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


class ToolTableTest(unittest.TestCase):
    STORED = [{"tool": "Bash", "calls": 3, "result_chars": 450}]

    def kind_row(self, tool, kind, calls):
        """A tool_kinds row as /api/session sends it."""
        return {"tool": tool, "kind": kind, "calls": calls, "errors": 1, "result_chars": 90, "result_median": 30,
                "result_p90": 50, "input_median": 12, "calls_after_median": 4.5, "carried": 0.01,
                "input_cost": 0.002}

    def rows(self, agents):
        """toolTableRows of these agents."""
        return run_function("drilldown.js", "toolTableRows", agents)

    def test_every_command_kind_has_its_words(self):
        self.assertEqual(object_keys("drilldown.js", "TOOL_KINDS"), set(tool_kinds.KINDS))

    @unittest.skipUnless(shutil.which("node"), "needs node")
    def test_bash_kinds_are_sub_rows_under_bash(self):
        agent = {"agent_type": "main", "tools": self.STORED,
                 "tool_kinds": [self.kind_row("Bash", None, 3), self.kind_row("Bash", "search", 2),
                                self.kind_row("Bash", "view", 1), self.kind_row("Read", None, 1)]}
        rows = self.rows([agent])
        self.assertEqual([(row["tool"], row["kind"], row["sub"]) for row in rows],
                         [("Bash", None, False), ("Bash", "search", True), ("Bash", "view", True),
                          ("Read", None, False)])
        self.assertEqual((rows[1]["agent"], rows[1]["carried"], rows[1]["calls_after_median"]), ("main", 0.01, 4.5))

    @unittest.skipUnless(shutil.which("node"), "needs node")
    def test_without_the_transcript_the_stored_tools_show_without_what_only_it_tells(self):
        [row] = self.rows([{"agent_type": "Explore", "tools": self.STORED, "tool_kinds": None}])
        self.assertEqual((row["agent"], row["tool"], row["kind"], row["sub"], row["calls"], row["result_chars"]),
                         ("Explore", "Bash", None, False, 3, 450))
        for field in ("errors", "result_median", "result_p90", "input_median", "calls_after_median", "carried",
                      "input_cost"):
            with self.subTest(field=field):
                self.assertIsNone(row[field])

    @unittest.skipUnless(shutil.which("node"), "needs node")
    def test_each_agents_rows_follow_each_other(self):
        rows = self.rows([{"agent_type": "main", "tools": [], "tool_kinds": [self.kind_row("Read", None, 1)]},
                          {"agent_type": "Explore", "tools": self.STORED, "tool_kinds": None}])
        self.assertEqual([(row["agent"], row["tool"]) for row in rows], [("main", "Read"), ("Explore", "Bash")])


class DelegateCallTest(unittest.TestCase):
    def detail(self, live=True, tokens=30_000, calls_ahead=73.5, exploration=True, estimate=True):
        """A session's detail with the main thread's exploration in this stretch and the calls ahead on average."""
        return {"live": live, "delegate_hint_tokens": 20_000, "delegate_calls_ahead": 60,
                "current": {"exploration": {"calls": 12, "chars": tokens * 2.3, "tokens": tokens, "carried": 0.4,
                                            "reread": 0.006} if exploration else None,
                            "compact_now": {"estimate": {"calls_ahead": calls_ahead} if estimate else None}}}

    def shown(self, detail):
        """delegateCallShown of this detail."""
        return run_function("drilldown.js", "delegateCallShown", detail)

    @unittest.skipUnless(shutil.which("node"), "needs node")
    def test_a_live_session_with_much_exploration_and_many_calls_ahead_gets_the_hint(self):
        self.assertTrue(self.shown(self.detail()))
        self.assertTrue(self.shown(self.detail(tokens=20_000, calls_ahead=60)))

    @unittest.skipUnless(shutil.which("node"), "needs node")
    def test_little_exploration_or_few_calls_ahead_get_none(self):
        self.assertFalse(self.shown(self.detail(tokens=19_999)))
        self.assertFalse(self.shown(self.detail(calls_ahead=59.9)))

    @unittest.skipUnless(shutil.which("node"), "needs node")
    def test_without_what_it_rests_on_there_is_none(self):
        for detail in (self.detail(live=False), self.detail(exploration=False), self.detail(estimate=False),
                       self.detail(calls_ahead=None), {"live": True, "current": None}):
            with self.subTest(detail=detail):
                self.assertFalse(self.shown(detail))


class CompactCallTest(unittest.TestCase):
    NOW = "2026-09-28T12:00:00.000+00:00"
    EXPIRED = "2026-09-28T11:00:00.000+00:00"

    def detail(self, live=True, warm_until="2026-09-28T12:30:00.000+00:00", cold_saving=-0.5, context=150_000,
               estimate=True):
        """A session's detail with the gauge (its context against a 200K hint) and its preview of compacting now,
        where compacting likely pays (the conversation's hint)."""
        return {"live": live, "agents": [{"agent_id": None, "compactions": []}],
                "current": {"context": context, "hint_tokens": 200_000, "compact_now": {
                    "likely_pays": True, "cache_warm_until": warm_until,
                    "estimate": {"breakeven_calls": 6, "calls_ahead": 40.2, "cold_saving": cold_saving}
                    if estimate else None}}}

    def kind(self, detail):
        """compactCallKind of this detail at NOW."""
        return run_function("drilldown.js", "compactCallKind", detail, self.NOW)

    @unittest.skipUnless(shutil.which("node"), "needs node")
    def test_below_the_hint_a_warm_cache_gets_no_call_even_where_compacting_likely_pays(self):
        # replayed on the stored sessions, the warm call added about $1.5 in two weeks against $175 past the hint
        self.assertIsNone(self.kind(self.detail()))

    @unittest.skipUnless(shutil.which("node"), "needs node")
    def test_an_ended_session_or_one_without_a_gauge_gets_no_call(self):
        self.assertIsNone(self.kind(self.detail(live=False)))
        self.assertIsNone(self.kind({"live": True, "current": None}))

    @unittest.skipUnless(shutil.which("node"), "needs node")
    def test_once_the_cache_has_expired_the_call_comes_where_compacting_cold_saves_at_once(self):
        self.assertEqual(self.kind(self.detail(warm_until=self.EXPIRED, cold_saving=1.2)), "cold")
        self.assertIsNone(self.kind(self.detail(warm_until=self.EXPIRED, cold_saving=-0.5)))

    @unittest.skipUnless(shutil.which("node"), "needs node")
    def test_past_the_hint_the_call_comes_whatever_the_savings(self):
        for detail in (self.detail(context=200_000), self.detail(context=250_000, estimate=False),
                       self.detail(context=250_000, warm_until=self.EXPIRED)):
            with self.subTest(detail=detail["current"]):
                self.assertEqual(self.kind(detail), "threshold")

    @unittest.skipUnless(shutil.which("node"), "needs node")
    def test_past_the_hint_a_cold_call_that_saves_still_says_so(self):
        self.assertEqual(self.kind(self.detail(context=250_000, warm_until=self.EXPIRED, cold_saving=1.2)), "cold")

    def test_past_the_hint_an_ended_session_gets_no_call(self):
        self.assertIsNone(self.kind(self.detail(context=250_000, live=False)))

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


class CompactionTotalTest(unittest.TestCase):
    @staticmethod
    def row(verdict, net):
        """A compaction row compared against keeping the context."""
        return {"versus_keeping": {"verdict": verdict, "net": net}}

    @unittest.skipUnless(shutil.which("node"), "needs node")
    def test_the_nets_are_summed_like_the_estimated_cost_tile(self):
        rows = [self.row("saved", 1.25), self.row("open", -0.25), self.row("forced", 9.0), self.row("unknown", None),
                {"versus_keeping": None}]
        self.assertEqual(run_function("drilldown.js", "compactionTotal", rows),
                         {"net": 1.0, "compactions": 2, "unknown": 1})

    @unittest.skipUnless(shutil.which("node"), "needs node")
    def test_nothing_to_sum_gives_none(self):
        rows = [self.row("forced", 2.0), {"versus_keeping": None}]
        self.assertIsNone(run_function("drilldown.js", "compactionTotal", rows))

    def test_the_compactions_heading_carries_the_total(self):
        self.assertIn("compactionTotal(agent.compactions)", read(STATIC / "js" / "drilldown.js"))


class PagingTest(unittest.TestCase):
    @unittest.skipUnless(shutil.which("node"), "needs node")
    def test_a_sub_row_stays_on_the_page_of_its_group(self):
        self.assertEqual(run_function("tables.js", "pageUnits", [False, True, True, False, False, True]),
                         [0, 0, 0, 1, 2, 2])

    @unittest.skipUnless(shutil.which("node"), "needs node")
    def test_a_page_covers_its_share_of_the_groups(self):
        self.assertEqual(run_function("tables.js", "pageWindow", 84, 10, 1),
                         {"page": 1, "pages": 9, "first": 10, "last": 20})

    @unittest.skipUnless(shutil.which("node"), "needs node")
    def test_the_last_page_holds_the_rest(self):
        self.assertEqual(run_function("tables.js", "pageWindow", 84, 25, 3),
                         {"page": 3, "pages": 4, "first": 75, "last": 84})

    @unittest.skipUnless(shutil.which("node"), "needs node")
    def test_a_page_past_the_end_falls_back_to_the_last(self):
        self.assertEqual(run_function("tables.js", "pageWindow", 30, 25, 5)["page"], 1)
        self.assertEqual(run_function("tables.js", "pageWindow", 30, 25, -1)["page"], 0)

    @unittest.skipUnless(shutil.which("node"), "needs node")
    def test_the_pager_names_the_rows_shown(self):
        window = {"page": 1, "pages": 9, "first": 10, "last": 20}
        self.assertEqual(run_function("tables.js", "pageText", window, 84), "rows 11–20 of 84")

    @unittest.skipUnless(shutil.which("node"), "needs node")
    def test_a_saved_page_size_counts_only_if_offered(self):
        self.assertEqual(run_function("tables.js", "pageSizeFrom", "50", [10, 25, 50], 25), 50)
        self.assertEqual(run_function("tables.js", "pageSizeFrom", "7", [10, 25, 50], 25), 25)
        self.assertEqual(run_function("tables.js", "pageSizeFrom", None, [10, 25, 50], 25), 25)

    def test_the_page_size_is_a_preference(self):
        script = read(STATIC / "js" / "tables.js")
        self.assertIn("savePreference(PAGE_SIZE_PREFERENCE", script)
        self.assertIn("const DEFAULT_PAGE_SIZE = 25;", script)
        self.assertIn("readPreference(PAGE_SIZE_PREFERENCE)", script)
        self.assertRegex(script, r"const PAGE_SIZES = \[10, 25, 50\];")

    def test_every_table_is_paged(self):
        sites = {"tables.js": 7, "limits.js": 1, "drilldown.js": 8, "chartkit.js": 1}
        for script, count in sites.items():
            with self.subTest(script=script):
                self.assertEqual(len(re.findall(r"\bpaged\(", read(STATIC / "js" / script))), count)

    def test_the_pager_comes_before_the_table(self):
        script = read(STATIC / "js" / "tables.js")
        self.assertIn('el("div", {class: "paged"}, pager, table)', script)
        self.assertIn("table.before(pager)", script)
        self.assertNotIn("table.after(pager)", script)
        self.assertIn("margin-bottom: 8px", css_block(read(STATIC / "css" / "common.css"), ".pager"))

    def test_the_pager_joins_the_title_row(self):
        script = read(STATIC / "js" / "tables.js")
        self.assertIn("queueMicrotask(() => placePager(pager, pager))", script)
        self.assertLess(script.index("queueMicrotask(() => placePager(pager, pager))"),
                        script.index("queueMicrotask(() => document.getElementById(refocus)"))
        css = read(STATIC / "css" / "common.css")
        self.assertIn("display: flex", css_block(css, ".title-row {"))
        self.assertIn("margin-left: auto", css_block(css, ".title-row .pager"))

    def test_rows_off_the_page_are_hidden_by_a_class_not_by_hidden(self):
        # a workflow run's agents are shown and hidden with `hidden`, so paging keeps to its own switch
        self.assertIn("display: none", css_block(read(STATIC / "css" / "common.css"), "tr.off-page"))
        self.assertIn('classList.toggle("off-page"', read(STATIC / "js" / "tables.js"))


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
