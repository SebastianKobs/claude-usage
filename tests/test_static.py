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

    def kind_row(self, tool, kind, calls, detail=None, options=None):
        """A tool_kinds row as /api/session sends it."""
        return {"tool": tool, "kind": kind, "detail": detail, "options": options, "calls": calls, "errors": 1,
                "result_chars": 90, "result_median": 30, "result_p90": 50, "input_median": 12,
                "calls_after_median": 4.5, "carried": 0.01, "input_cost": 0.002}

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
    @unittest.skipUnless(shutil.which("node"), "needs node")
    def test_each_row_folds_under_the_one_it_splits_but_kinds_stay_shown(self):
        agent = {"agent_id": None, "agent_type": "main", "tools": [],
                 "tool_kinds": [self.kind_row("Bash", None, 3), self.kind_row("Bash", "search", 2),
                                self.kind_row("Bash", "search", 2, "grep"),
                                self.kind_row("Bash", "search", 2, "grep", "-rn")]}
        rows = self.rows([agent])
        self.assertEqual([row["sub"] for row in rows], [False, True, True, True])
        self.assertEqual([row["parent"] for row in rows], [None, None, rows[1]["fold"], rows[2]["fold"]])
        self.assertEqual(len({row["fold"] for row in rows}), 4)

    @unittest.skipUnless(shutil.which("node"), "needs node")
    def test_a_tool_without_kinds_folds_its_details_itself(self):
        agent = {"agent_id": None, "agent_type": "main", "tools": [],
                 "tool_kinds": [self.kind_row("Read", None, 2), self.kind_row("Read", None, 2, ".go"),
                                self.kind_row("Read", None, 2, ".go", "")]}
        rows = self.rows([agent])
        self.assertEqual([row["sub"] for row in rows], [False, True, True])
        self.assertEqual([row["parent"] for row in rows], [None, rows[0]["fold"], rows[1]["fold"]])

    @unittest.skipUnless(shutil.which("node"), "needs node")
    def test_each_agent_has_folds_of_its_own(self):
        def agent(agent_id):
            return {"agent_id": agent_id, "agent_type": "main", "tools": [],
                    "tool_kinds": [self.kind_row("Bash", None, 1), self.kind_row("Bash", "list", 1),
                                   self.kind_row("Bash", "list", 1, "ls")]}
        rows = self.rows([agent(None), agent("a1")])
        self.assertNotEqual(rows[2]["parent"], rows[5]["parent"])

    @unittest.skipUnless(shutil.which("node"), "needs node")
    def test_the_fold_names_what_a_row_splits_by(self):
        cases = [({"tool": "Bash", "kind": "inline_script", "detail": None}, 2, "interpreters"),
                 ({"tool": "Bash", "kind": "git", "detail": None}, 1, "subcommand"),
                 ({"tool": "Bash", "kind": "search", "detail": None}, 3, "programs"),
                 ({"tool": "Bash", "kind": "search", "detail": "grep"}, 2, "option sets"),
                 ({"tool": "Read", "kind": None, "detail": None}, 4, "file types"),
                 ({"tool": "NotebookEdit", "kind": None, "detail": None}, 1, "file type"),
                 ({"tool": "Read", "kind": None, "detail": ".go"}, 2, "option sets"),
                 ({"tool": "Grep", "kind": None, "detail": None}, 2, "output modes"),
                 ({"tool": "Glob", "kind": None, "detail": None}, 2, "file types"),
                 ({"tool": "Agent", "kind": None, "detail": None}, 2, "subagent types"),
                 ({"tool": "Task", "kind": None, "detail": None}, 1, "subagent type"),
                 ({"tool": "Skill", "kind": None, "detail": None}, 3, "skills"),
                 ({"tool": "MCP", "kind": "git", "detail": None}, 2, "tools"),
                 ({"tool": "MCP", "kind": "srv", "detail": "find"}, 2, "option sets")]
        for row, count, noun in cases:
            with self.subTest(row=row):
                self.assertEqual(run_function("drilldown.js", "detailNoun", row, count), noun)

    @unittest.skipUnless(shutil.which("node"), "needs node")
    def test_an_empty_detail_says_what_is_missing(self):
        cases = [({"tool": "Bash", "kind": "run"}, "(none)"), ({"tool": "Read", "kind": None}, "no type"),
                 ({"tool": "Glob", "kind": None}, "no single type"), ({"tool": "Skill", "kind": None}, "no name")]
        for row, text in cases:
            with self.subTest(row=row):
                self.assertEqual(run_function("drilldown.js", "emptyDetail", row), text)

    @unittest.skipUnless(shutil.which("node"), "needs node")
    def test_a_kind_is_named_in_words_for_bash_and_as_it_is_for_an_mcp_server(self):
        labels = {"run": "run a program"}
        self.assertEqual(run_function("drilldown.js", "kindLabel", {"tool": "Bash", "kind": "run"}, labels),
                         "run a program")
        self.assertEqual(run_function("drilldown.js", "kindLabel", {"tool": "MCP", "kind": "run"}, labels), "run")

    @unittest.skipUnless(shutil.which("node"), "needs node")
    def test_without_the_transcript_the_stored_tools_show_without_what_only_it_tells(self):
        [row] = self.rows([{"agent_type": "Explore", "tools": self.STORED, "tool_kinds": None}])
        self.assertEqual((row["agent"], row["tool"], row["kind"], row["sub"], row["calls"], row["result_chars"]),
                         ("Explore", "Bash", None, False, 3, 450))
        for field in ("detail", "options", "fold", "parent", "errors", "result_median", "result_p90", "input_median",
                      "calls_after_median", "carried", "input_cost"):
            with self.subTest(field=field):
                self.assertIsNone(row[field])

    @unittest.skipUnless(shutil.which("node"), "needs node")
    def test_each_agents_rows_follow_each_other(self):
        rows = self.rows([{"agent_type": "main", "tools": [], "tool_kinds": [self.kind_row("Read", None, 1)]},
                          {"agent_type": "Explore", "tools": self.STORED, "tool_kinds": None}])
        self.assertEqual([(row["agent"], row["tool"]) for row in rows], [("main", "Read"), ("Explore", "Bash")])


class SecretAccessTest(unittest.TestCase):
    @unittest.skipUnless(shutil.which("node"), "needs node")
    def test_each_access_says_how_far_it_reached(self):
        cases = [(("sent", True), "sent to a service"), (("returned", False), "into the conversation"),
                 (("error", False), "error: blocked or failed"),
                 (("error", True), "error, the service may have got it"),
                 (("empty", False), "nothing returned"), (("pending", False), "no result yet")]
        for (reach, sent), text in cases:
            with self.subTest(reach=reach, sent=sent):
                self.assertEqual(run_function("drilldown.js", "secretReach", {"reach": reach, "sent": sent}), text)

    @unittest.skipUnless(shutil.which("node"), "needs node")
    def test_a_returned_test_says_so(self):
        access = {"reach": "returned", "sent": False, "test": True}
        self.assertEqual(run_function("drilldown.js", "secretReach", access), "into the conversation, likely a test")

    @unittest.skipUnless(shutil.which("node"), "needs node")
    def test_only_a_high_access_raises_the_alarm_a_medium_one_warns(self):
        cases = [(["low", "high", "medium"], "alert"), (["low", "medium"], "warning"), (["low", "low"], "quiet"),
                 (["low-medium", "low"], "quiet"),
                 ([], None)]
        for severities, tone in cases:
            with self.subTest(severities=severities):
                detail = {"secret_accesses": [{"severity": severity} for severity in severities]}
                self.assertEqual(run_function("drilldown.js", "secretTone", detail), tone)

    def test_the_warning_card_is_edged_in_the_warning_color(self):
        self.assertIn("var(--hint-warning-edge)", css_block(read(STATIC / "css" / "common.css"), ".secret-warning"))

    def test_each_severity_has_its_mark_color(self):
        css = read(STATIC / "css" / "common.css")
        for severity, color in (("high", "--hint-critical-edge"), ("medium", "--hint-warning-edge"),
                                ("low-medium", "--series-1"), ("low", "--text-secondary")):
            with self.subTest(severity=severity):
                self.assertIn(f"var({color})", css_block(css, f".secret-severity-{severity}"))

    @unittest.skipUnless(shutil.which("node"), "needs node")
    def test_a_path_a_script_named_says_which_script(self):
        self.assertEqual(run_function("drilldown.js", "secretVia", {"via": "deploy.py"}), "in deploy.py, which it ran")
        self.assertIsNone(run_function("drilldown.js", "secretVia", {"via": None}))

    def test_the_warning_comes_after_the_tiles_and_before_the_call_to_compact(self):
        source = read(STATIC / "js" / "drilldown.js")
        render = source[source.index("function renderDrilldown("):source.index("\n}\n", source.index(
            "function renderDrilldown("))]
        self.assertLess(render.index("runtimeTiles("), render.index("secretAccesses(detail"))
        self.assertLess(render.index("secretAccesses(detail"), render.index("compactCall(detail)"))

    def test_the_warning_is_edged_in_the_critical_color(self):
        self.assertIn("var(--status-critical)", css_block(read(STATIC / "css" / "common.css"), ".secret-alert"))


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


class PayoffToneTest(unittest.TestCase):
    def tone(self, expired=False, **estimate):
        """payoffTone of an estimate with 40 calls ahead on average, updated by the given fields."""
        values = {"breakeven_calls": 10, "breakeven_low": 5, "calls_ahead": 40.0, "cold_saving": -0.5,
                  "breakeven_cold": 10}
        values.update(estimate)
        return run_function("drilldown.js", "payoffTone", values, expired)

    @unittest.skipUnless(shutil.which("node"), "needs node")
    def test_within_half_the_calls_ahead_it_pays_back_soon(self):
        self.assertEqual(self.tone(breakeven_calls=20), "soon")

    @unittest.skipUnless(shutil.which("node"), "needs node")
    def test_within_the_calls_ahead_it_is_close(self):
        self.assertEqual(self.tone(breakeven_calls=21), "close")
        self.assertEqual(self.tone(breakeven_calls=40), "close")

    @unittest.skipUnless(shutil.which("node"), "needs node")
    def test_past_the_calls_ahead_or_never_it_likely_does_not(self):
        self.assertEqual(self.tone(breakeven_calls=41), "unlikely")
        self.assertEqual(self.tone(breakeven_calls=None), "unlikely")
        self.assertEqual(self.tone(breakeven_calls=None, breakeven_low=None, calls_ahead=None), "unlikely")

    @unittest.skipUnless(shutil.which("node"), "needs node")
    def test_without_calls_ahead_a_break_even_has_no_tone(self):
        self.assertIsNone(self.tone(calls_ahead=None))

    @unittest.skipUnless(shutil.which("node"), "needs node")
    def test_an_expired_cache_goes_by_the_cold_break_even(self):
        self.assertEqual(self.tone(expired=True, cold_saving=0.2), "soon")
        self.assertEqual(self.tone(expired=True, breakeven_cold=30), "close")
        self.assertEqual(self.tone(expired=True, breakeven_cold=None), "unlikely")

    def test_each_tone_has_its_mark_color(self):
        css = read(STATIC / "css" / "common.css")
        for tone, color in (("soon", "--gain-text"), ("close", "--hint-warning-edge"),
                            ("unlikely", "--hint-critical-edge")):
            with self.subTest(tone=tone):
                self.assertIn(f"var({color})", css_block(css, f".payoff-{tone}"))

    def test_the_estimate_is_full_size_text_under_a_divider_its_pay_off_in_the_primary_color(self):
        css = read(STATIC / "css" / "common.css")
        block = css_block(css, ".compact-estimate {")
        self.assertIn("border-top: 1px solid var(--border)", block)
        self.assertIn("var(--text-secondary)", block)
        self.assertNotIn("font-size", block)
        self.assertIn("var(--text-primary)", css_block(css, ".compact-estimate strong"))
        source = read(STATIC / "js" / "drilldown.js")
        notes = source[source.index("function compactNowNotes("):source.index("\n}\n", source.index(
            "function compactNowNotes("))]
        self.assertIn('class: "compact-estimate"', notes)


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
        sites = {"tables.js": 7, "limits.js": 2, "drilldown.js": 9, "chartkit.js": 1, "figures.js": 1}
        for script, count in sites.items():
            with self.subTest(script=script):
                self.assertEqual(len(re.findall(r"\bpaged\(", read(STATIC / "js" / script))), count)

    @unittest.skipUnless(shutil.which("node"), "needs node")
    def test_a_pager_of_cards_names_what_they_are(self):
        window = {"page": 0, "pages": 30, "first": 0, "last": 10}
        self.assertEqual(run_function("tables.js", "pageText", window, 300, "sessions"), "sessions 1–10 of 300")

    def test_the_pager_comes_before_the_table(self):
        script = read(STATIC / "js" / "tables.js")
        self.assertIn('el("div", {class: "paged"}, pager, list)', script)
        self.assertIn("list.before(pager)", script)
        self.assertNotIn("list.after(pager)", script)
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

    def test_a_redrawn_tables_old_pager_is_let_go(self):
        # the live sessions redraw every 5 s: a pager kept for good would keep every old draw's rows alive
        body = re.search(r"^function paged\(.*?^\}$", read(STATIC / "js" / "tables.js"),
                         re.DOTALL | re.MULTILINE).group(0)
        self.assertIn("queueMicrotask(forgetDetachedPagers)", body)
        forget = re.search(r"^function forgetDetachedPagers\(.*?^\}$", read(STATIC / "js" / "tables.js"),
                           re.DOTALL | re.MULTILINE).group(0)
        self.assertIn("isConnected", forget)
        self.assertIn("pagers.delete", forget)

    def test_the_live_sessions_are_paged_as_cards_their_pager_by_the_heading(self):
        figures = read(STATIC / "js" / "figures.js")
        # paged even when none is live, so a pager left from a longer list goes
        self.assertRegex(figures, r'paged\("live", live\.sessions\.length')
        self.assertIn('class: "live-grid paged-cards"', figures)
        self.assertIn('<div id="live" class="paged-wrap">', dashboard())
        self.assertIn('".table-wrap, .paged-wrap"', read(STATIC / "js" / "tables.js"))
        self.assertIn("display: none", css_block(read(STATIC / "css" / "common.css"), ".paged-cards > .off-page"))


def function_body(script, name):
    """The source of a script's top-level function."""
    return re.search(rf"^(?:async )?function {name}\(.*?^\}}$", read(STATIC / "js" / script),
                     re.DOTALL | re.MULTILINE).group(0)


class LiveRangeTest(unittest.TestCase):
    @unittest.skipUnless(shutil.which("node"), "needs node")
    def test_the_range_names_its_day_only_for_a_single_day(self):
        self.assertEqual(run_function("main.js", "rangeQuery", 1, "2026-09-28"), "days=1&until=2026-09-28")
        self.assertEqual(run_function("main.js", "rangeQuery", 1, None), "days=1")
        self.assertEqual(run_function("main.js", "rangeQuery", 7, "2026-09-28"), "days=7")

    def test_the_live_sessions_ask_for_the_summarys_range(self):
        script = read(STATIC / "js" / "main.js")
        self.assertIn("fetchJson(`/api/live?${rangeQuery(state.days, state.day)}`)", script)
        self.assertIn("fetchJson(`/api/summary?${rangeQuery(state.days, state.day)}`)", script)

    def test_a_new_range_loads_the_live_sessions_at_once(self):
        load = function_body("main.js", "loadRange")
        self.assertIn("loadSummary();", load)
        self.assertIn("loadLive();", load)
        self.assertIn("loadRange();", function_body("figures.js", "stepDay"))
        setup = function_body("main.js", "setup")
        self.assertIn("loadRange();", setup)
        self.assertNotIn("loadSummary();", setup)

    def test_only_the_newest_live_request_renders(self):
        # a poll for the range before may answer after the new range's request
        body = function_body("main.js", "loadLive")
        self.assertIn("const request = ++liveRequest;", body)
        self.assertEqual(body.count("if (request !== liveRequest) return;"), 2)

    @unittest.skipUnless(shutil.which("node"), "needs node")
    def test_a_past_day_is_the_day_the_live_sessions_were_kept_by(self):
        past = {"days": 1, "since": "2026-09-28", "until": "2026-09-28"}
        self.assertEqual(run_function("figures.js", "livePastDay", past, "2026-09-29"), "2026-09-28")
        today = {"days": 1, "since": "2026-09-29", "until": "2026-09-29"}
        self.assertIsNone(run_function("figures.js", "livePastDay", today, "2026-09-29"))
        week = {"days": 7, "since": "2026-09-23", "until": "2026-09-29"}
        self.assertIsNone(run_function("figures.js", "livePastDay", week, "2026-09-29"))
        self.assertIsNone(run_function("figures.js", "livePastDay", {"days": None, "since": None, "until": None},
                                       "2026-09-29"))

    def test_the_live_sessions_name_a_past_day(self):
        body = function_body("figures.js", "renderLive")
        self.assertIn("livePastDay(live, dayText(new Date()))", body)
        self.assertIn("active on ${longDay(pastDay)}", body)
        self.assertIn("No live session was active on ${longDay(pastDay)}.", body)


class SessionListTest(unittest.TestCase):
    SESSIONS = [
        {"session_id": "abc-1", "title": "Parser fix", "project": "/home/dev/app"},
        {"session_id": "def-2", "title": None, "project": "/home/dev/other"},
        {"session_id": "ghi-3", "title": "Chart colors", "project": "/home/dev/app"},
    ]

    def matching(self, project, text):
        """The ids of the sessions the filter keeps."""
        return [session["session_id"] for session in self.SESSIONS
                if run_function("tables.js", "sessionMatches", session, project, text)]

    @unittest.skipUnless(shutil.which("node"), "needs node")
    def test_no_filter_keeps_every_session(self):
        self.assertEqual(self.matching("", ""), ["abc-1", "def-2", "ghi-3"])

    @unittest.skipUnless(shutil.which("node"), "needs node")
    def test_a_project_keeps_only_its_sessions(self):
        self.assertEqual(self.matching("/home/dev/app", ""), ["abc-1", "ghi-3"])

    @unittest.skipUnless(shutil.which("node"), "needs node")
    def test_every_word_must_be_in_the_title_project_or_id_in_any_case(self):
        self.assertEqual(self.matching("", "parser"), ["abc-1"])
        self.assertEqual(self.matching("", "  OTHER "), ["def-2"])
        self.assertEqual(self.matching("", "ghi app"), ["ghi-3"])
        self.assertEqual(self.matching("", "parser other"), [])

    @unittest.skipUnless(shutil.which("node"), "needs node")
    def test_the_project_and_the_words_both_count(self):
        self.assertEqual(self.matching("/home/dev/other", "parser"), [])

    @unittest.skipUnless(shutil.which("node"), "needs node")
    def test_the_projects_to_pick_come_by_name_with_their_sessions(self):
        self.assertEqual(run_function("tables.js", "sessionProjects", self.SESSIONS, ""),
                         [{"project": "/home/dev/app", "count": 2}, {"project": "/home/dev/other", "count": 1}])

    @unittest.skipUnless(shutil.which("node"), "needs node")
    def test_a_picked_project_stays_on_offer_in_a_range_without_it(self):
        self.assertEqual(run_function("tables.js", "sessionProjects", self.SESSIONS[:1], "/home/dev/gone"),
                         [{"project": "/home/dev/app", "count": 1}, {"project": "/home/dev/gone", "count": 0}])

    @unittest.skipUnless(shutil.which("node"), "needs node")
    def test_the_count_says_how_many_of_the_ranges_sessions_show(self):
        self.assertEqual(run_function("tables.js", "sessionCount", 84, 84), "84 sessions")
        self.assertEqual(run_function("tables.js", "sessionCount", 1, 1), "1 session")
        self.assertEqual(run_function("tables.js", "sessionCount", 12, 84), "12 of 84 sessions")

    def test_the_filters_come_between_the_heading_and_the_table(self):
        markup = dashboard()
        heading = markup.index('id="sessions-title"')
        for control in ('id="sessions-project"', 'id="sessions-search"', 'id="sessions-count"'):
            with self.subTest(control=control):
                self.assertLess(heading, markup.index(control))
                self.assertLess(markup.index(control), markup.index('id="sessions" class="table-wrap"'))
        self.assertRegex(markup, r'<select id="sessions-project" aria-label="[^"]+"')
        self.assertRegex(markup, r'<input type="search" id="sessions-search" aria-label="[^"]+"')

    def test_the_pager_still_joins_the_heading_past_the_filters(self):
        body = re.search(r"^function placePager\(.*?^\}$", read(STATIC / "js" / "tables.js"),
                         re.DOTALL | re.MULTILINE).group(0)
        self.assertIn('"table-filters"', body)
        self.assertIn('class="table-filters"', dashboard())

    def test_a_new_filter_starts_at_the_first_page(self):
        body = re.search(r"^function setupSessionFilters\(.*?^\}$", read(STATIC / "js" / "tables.js"),
                         re.DOTALL | re.MULTILINE).group(0)
        self.assertIn('"sessions-search", "input"', body)
        self.assertIn('"sessions-project", "change"', body)
        self.assertIn('tablePages.delete("sessions")', body)
        self.assertIn("setupSessionFilters()", read(STATIC / "js" / "main.js"))

    def test_the_search_field_looks_like_the_other_controls_in_every_theme(self):
        css = read(STATIC / "css" / "common.css")
        self.assertIn("var(--surface)", css_block(css, 'input[type="search"] {'))
        self.assertIn("var(--text-muted)", css_block(css, 'input[type="search"]::placeholder'))
        for theme in GIMMICK_THEMES:
            with self.subTest(theme=theme):
                self.assertIn(f'[data-theme="{theme}"] input[type="search"]',
                              read(STATIC / "css" / "themes" / f"{theme}.css"))


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


class BannerTest(unittest.TestCase):
    @unittest.skipUnless(shutil.which("node"), "needs node")
    def test_the_same_message_from_two_sources_shows_once(self):
        # without the token, the live sessions and the summary are refused alike
        self.assertEqual(run_function("util.js", "bannerText", ["a", "b", "a"]), "a\nb")

    def test_a_refused_request_says_why_without_its_address(self):
        self.assertIn("if (response.status === 403) throw new Error(payload.error", read(STATIC / "js" / "util.js"))


class LimitWindowTest(unittest.TestCase):
    WINDOW = {"start": "2026-09-01T12:00:00.000+00:00", "first_hit": "2026-09-01T15:12:00.000+00:00",
              "resets_at": "2026-09-01T17:00:00.000+00:00"}

    @unittest.skipUnless(shutil.which("node"), "needs node")
    def test_a_window_is_hit_after_the_time_from_its_start(self):
        self.assertEqual(run_function("limits.js", "windowHitAfter", self.WINDOW), (3 * 60 + 12) * 60 * 1000)

    def test_the_windows_come_between_the_chart_and_the_latest_errors(self):
        page = dashboard()
        self.assertLess(page.index('id="limits-table"'), page.index('id="limit-windows"'))
        self.assertLess(page.index('id="limit-windows"'), page.index('id="limit-events"'))


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
