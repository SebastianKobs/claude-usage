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
BUNDLE = STATIC / "js" / "app.js"                       # built from web/ (make build), not written by hand
OWN_SCRIPTS = sorted(path for path in (STATIC / "js").glob("*.js") if path != BUNDLE)
FORMAT = ROOT / "web" / "src" / "lib" / "format.ts"     # the formatters, moved out of util.js
COLORS = ROOT / "web" / "src" / "lib" / "colors.ts"     # the model colors and effort levels, moved out of util.js
LIB = ROOT / "web" / "src" / "lib"                      # what moved out of the old scripts, as TypeScript
COMPONENTS = ROOT / "web" / "src" / "components"         # the Svelte components mounted into the page
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


def definition(script, name):
    """A script's top-level function or constant, as written."""
    source = re.search(rf"^(?:function {name}\(.*?^\}}|const {name} = .*?;)$", read(STATIC / "js" / script),
                       re.DOTALL | re.MULTILINE)
    return source.group(0)


MODULES = {name: LIB / name
           for name in ("format.ts", "colors.ts", "compact.ts", "context.ts", "secrets.ts", "live.ts", "tables.ts",
                        "charts.ts")}


def run_function(script, name, *arguments, uses=()):
    """Calls a top-level function of a script in node, with the page's functions and constants it uses named in uses
    ("script.js:name"), which must use nothing else of the page; its result. The script, or a use, may be a module of
    web/src/lib (MODULES): its function is imported as it is, which node runs as TypeScript (skipped where it can't)."""
    imported = {}
    helpers = []
    for source, function in [use.split(":") for use in uses]:
        if source in MODULES:
            imported.setdefault(source, []).append(function)
        else:
            helpers.append(definition(source, function))
    if script in MODULES:
        imported.setdefault(script, []).append(name)
    imports = [f"import {{ {', '.join(names)} }} from {json.dumps(MODULES[source].as_uri())};"
               for source, names in imported.items()]
    tested = [] if script in MODULES else [definition(script, name)]
    program = "\n".join([*imports, *helpers, *tested,
                         f"process.stdout.write(JSON.stringify({name}(...{json.dumps(arguments)})));"])
    result = subprocess.run(["node", "--input-type=module", "-e", program], capture_output=True, text=True,
                            timeout=30)
    if result.returncode and "ERR_UNKNOWN_FILE_EXTENSION" in result.stderr:
        raise unittest.SkipTest("this node can't run TypeScript")
    if result.returncode:
        raise subprocess.CalledProcessError(result.returncode, result.args, result.stdout, result.stderr)
    return json.loads(result.stdout)


def object_keys(script, name):
    """The keys of a script's `const name = {…}` object literal (a type annotation before the = is fine)."""
    source = read(script if isinstance(script, Path) else STATIC / "js" / script)
    body = re.search(rf"const {name}\b[^=]*= \{{(.*?)\}};", source, re.DOTALL).group(1)
    return set(re.findall(r"(\w+):", body))


class ScriptTest(unittest.TestCase):
    def test_every_rebuild_cause_has_its_words(self):
        self.assertEqual(object_keys(MODULES["compact.ts"], "REBUILD_CAUSES"), {"model", "idle", "prefix"})

    def test_every_injected_kind_that_is_no_attachment_type_has_its_words(self):
        self.assertEqual(object_keys("chat.js", "INJECTED_KINDS"), {"meta", "skill", "summary"})

    def test_every_compaction_verdict_has_its_words(self):
        self.assertEqual(object_keys(MODULES["compact.ts"], "COMPACTION_VERDICTS"), set(turns.VERDICTS))

    def test_every_compaction_trigger_has_its_words(self):
        self.assertEqual(object_keys(MODULES["context.ts"], "COMPACTION_TRIGGERS"), {"manual", "auto"})

    def test_the_context_chart_stacks_the_three_parts_of_a_turn(self):
        body = re.search(r"const CONTEXT_PARTS\b[^=]*= \[(.*?)\];", read(MODULES["context.ts"]), re.DOTALL).group(1)
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

    @unittest.skipUnless(shutil.which("node"), "needs node")
    def test_a_swatch_hatch_runs_like_the_columns(self):
        # the columns' pattern turns vertical lines by the angle; the swatch's gradient runs across them
        self.assertIn("135deg", run_function("colors.ts", "swatchFill", "red", "blue", 45))
        self.assertIn("45deg", run_function("colors.ts", "swatchFill", "red", "blue", -45))
        self.assertEqual(run_function("colors.ts", "swatchFill", "red", None, None), "red")

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

    def test_the_bundle_loads_first_as_a_module(self):
        tags = re.findall(r"<script\b[^>]*>", dashboard())
        self.assertEqual(tags[0], '<script type="module" src="/static/js/app.js">')

    def test_the_classic_scripts_are_deferred_so_they_run_after_the_bundle(self):
        classic = [tag for tag in re.findall(r"<script\b[^>]*>", dashboard()) if 'type="module"' not in tag]
        self.assertEqual([tag for tag in classic if not tag.endswith(" defer>")], [])

    def test_every_own_script_is_loaded(self):
        loaded = set(re.findall(r'<script src="/static/js/([^"/]+\.js)"', dashboard()))
        self.assertEqual(loaded, {path.name for path in OWN_SCRIPTS})


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
        tones = {verdict: run_function("compact.ts", "verdictTone", {"verdict": verdict})
                 for verdict in turns.VERDICTS}
        self.assertEqual(tones, {"saved": "gain", "cost_more": "loss", "even": None, "forced": None, "open": None,
                                 "unknown": None})

    @unittest.skipUnless(shutil.which("node"), "needs node")
    def test_a_stretch_not_paid_off_yet_is_a_loss_so_far(self):
        self.assertEqual(run_function("compact.ts", "verdictTone", {"verdict": "open", "net": -0.21}), "loss")
        self.assertIsNone(run_function("compact.ts", "verdictTone", {"verdict": "open", "net": 0.05}))

    def test_a_loss_so_far_shows_its_amount(self):
        body = re.search(r"^export function verdictText\(.*?^\}$", read(MODULES["compact.ts"]),
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
        return run_function("tables.ts", "toolTableRows", agents)

    def test_every_command_kind_has_its_words(self):
        self.assertEqual(object_keys(MODULES["tables.ts"], "TOOL_KINDS"), set(tool_kinds.KINDS))

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
                self.assertEqual(run_function("tables.ts", "detailNoun", row, count), noun)

    @unittest.skipUnless(shutil.which("node"), "needs node")
    def test_an_empty_detail_says_what_is_missing(self):
        cases = [({"tool": "Bash", "kind": "run"}, "(none)"), ({"tool": "Read", "kind": None}, "no type"),
                 ({"tool": "Glob", "kind": None}, "no single type"), ({"tool": "Skill", "kind": None}, "no name")]
        for row, text in cases:
            with self.subTest(row=row):
                self.assertEqual(run_function("tables.ts", "emptyDetail", row), text)

    @unittest.skipUnless(shutil.which("node"), "needs node")
    def test_a_kind_is_named_in_words_for_bash_and_as_it_is_for_an_mcp_server(self):
        labels = {"run": "run a program"}
        self.assertEqual(run_function("tables.ts", "kindLabel", {"tool": "Bash", "kind": "run"}, labels),
                         "run a program")
        self.assertEqual(run_function("tables.ts", "kindLabel", {"tool": "MCP", "kind": "run"}, labels), "run")

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
                self.assertEqual(run_function("secrets.ts", "secretReach", {"reach": reach, "sent": sent}), text)

    @unittest.skipUnless(shutil.which("node"), "needs node")
    def test_a_returned_test_says_so(self):
        access = {"reach": "returned", "sent": False, "test": True}
        self.assertEqual(run_function("secrets.ts", "secretReach", access), "into the conversation, likely a test")

    @unittest.skipUnless(shutil.which("node"), "needs node")
    def test_only_a_high_access_raises_the_alarm_a_medium_one_warns(self):
        cases = [(["low", "high", "medium"], "alert"), (["low", "medium"], "warning"), (["low", "low"], "quiet"),
                 (["low-medium", "low"], "quiet"),
                 ([], None)]
        for severities, tone in cases:
            with self.subTest(severities=severities):
                detail = {"secret_accesses": [{"severity": severity} for severity in severities]}
                self.assertEqual(run_function("secrets.ts", "secretTone", detail), tone)

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
        self.assertEqual(run_function("secrets.ts", "secretVia", {"via": "deploy.py"}), "in deploy.py, which it ran")
        self.assertIsNone(run_function("secrets.ts", "secretVia", {"via": None}))

    def test_the_warning_comes_after_the_tiles_and_before_the_call_to_compact(self):
        # all three are the session view's components
        view = read(COMPONENTS / "SessionView.svelte")
        self.assertLess(view.index("<RuntimeTiles"), view.index("<SecretAccesses"))
        self.assertLess(view.index("<SecretAccesses"), view.index("<ContextGauge"))
        self.assertLess(view.index("<ContextGauge"), view.index("<ContextPerTurn"))

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
        return run_function("compact.ts", "delegateCallShown", detail)

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
        return run_function("compact.ts", "payoffTone", values, expired)

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

    @unittest.skipUnless(shutil.which("node"), "needs node")
    def test_where_it_pays_off_only_once_the_context_has_grown_it_is_not_yet(self):
        # a young stretch or one right after a compaction: too early, not too late
        self.assertEqual(self.tone(breakeven_calls=41, pays_later_in=5), "later")
        self.assertEqual(self.tone(breakeven_calls=None, pays_later_in=6), "later")
        self.assertEqual(self.tone(expired=True, breakeven_cold=50, pays_later_in=3), "later")
        self.assertEqual(self.tone(breakeven_calls=41, pays_later_in=None), "unlikely")

    @unittest.skipUnless(shutil.which("node"), "needs node")
    def test_paying_off_now_goes_before_later(self):
        self.assertEqual(self.tone(breakeven_calls=20, pays_later_in=1), "soon")
        self.assertEqual(self.tone(expired=True, cold_saving=0.2, pays_later_in=1), "soon")

    def estimate_words(self, name, *arguments):
        """A pay-off wording function of compact.ts called with these arguments."""
        return run_function("compact.ts", name, *arguments)

    @unittest.skipUnless(shutil.which("node"), "needs node")
    def test_not_yet_says_when_compacting_would_pay_off(self):
        estimate = {"breakeven_calls": 60, "calls_ahead": 40.0, "ahead_from": "longer", "pays_later_in": 5,
                    "pays_later_at": 70_000}
        self.assertEqual(self.estimate_words("payoffAhead", "later", estimate, False),
                         "Not yet: growing at its recent pace, the context reaches about 70K in 5 replies, and "
                         "compacting then would pay off within the replies still ahead on average.")

    @unittest.skipUnless(shutil.which("node"), "needs node")
    def test_a_context_below_what_compacting_leaves_pays_off_not_yet_rather_than_never(self):
        below = {"breakeven_calls": None, "breakeven_low": None, "breakeven_cold": None, "cold_saving": -0.5}
        for expired in (False, True):
            with self.subTest(expired=expired):
                self.assertEqual(self.estimate_words("payoffText", {**below, "pays_later_in": 6}, expired),
                                 "would not pay off yet: the context is below what compacting leaves")
                self.assertEqual(self.estimate_words("payoffText", {**below, "pays_later_in": None}, expired),
                                 "would never pay off: the context is below what compacting leaves")

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
        self.assertIn('class="compact-estimate"', read(COMPONENTS / "ContextGauge.svelte"))


class CompactCallTest(unittest.TestCase):
    NOW = "2026-09-28T12:00:00.000+00:00"
    EXPIRED = "2026-09-28T11:00:00.000+00:00"

    def detail(self, live=True, warm_until="2026-09-28T12:30:00.000+00:00", cold_saving=-0.5, context=150_000,
               estimate=True, compacted=None):
        """A session's detail with the gauge (its context against a 200K hint) and its preview of compacting now,
        where compacting likely pays (the conversation's hint); none once it compacted after its last call."""
        preview = {"likely_pays": True, "cache_warm_until": warm_until,
                   "estimate": {"breakeven_calls": 6, "calls_ahead": 40.2, "cold_saving": cold_saving}
                   if estimate else None}
        return {"live": live, "agents": [{"agent_id": None, "compactions": []}],
                "current": {"context": context, "hint_tokens": 200_000, "compacted": compacted,
                            "compact_now": None if compacted else preview}}

    def kind(self, detail):
        """compactCallKind of this detail at NOW."""
        return run_function("compact.ts", "compactCallKind", detail, self.NOW)

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

    @unittest.skipUnless(shutil.which("node"), "needs node")
    def test_after_a_compaction_without_a_call_since_there_is_no_call(self):
        self.assertIsNone(self.kind(self.detail(context=250_000, compacted=self.NOW)))

    def test_the_copy_button_is_wired_in_the_script_not_inline(self):
        component = read(COMPONENTS / "CompactCall.svelte")
        self.assertIn('id="compact-copy"', component)
        self.assertIn("navigator.clipboard", component)
        self.assertNotIn(" onclick=\"", component)


class CompactedGaugeTest(unittest.TestCase):
    def test_the_gauge_draws_the_compaction_in_place_of_the_meter(self):
        # the words are tested in gauge.test.ts; the card shows the meter only for the other kind
        component = read(COMPONENTS / "ContextGauge.svelte")
        self.assertIn("{#if card.kind === 'meter'}", component)
        self.assertLess(component.index("{#if card.kind === 'meter'}"), component.index('role="meter"'))


class ChatOrderTest(unittest.TestCase):
    def setUp(self):
        self.component = read(COMPONENTS / "Conversation.svelte")

    def test_the_order_switch_is_a_toggle_kept_as_a_preference(self):
        self.assertRegex(self.component, r'id="chat-order"\s+aria-pressed=\{preferences.oldestFirst\}')
        # saved and read by the bundle's preferences (prefs.svelte.test.ts holds the key and the round trip)
        self.assertIn("preferences.oldestFirst = !preferences.oldestFirst", self.component)
        self.assertIn("chat-oldest-first", read(LIB / "prefs.svelte.ts"))

    def test_the_order_switch_is_an_arrow_turning_with_the_order(self):
        self.assertIn('class="chat-order-arrow"', self.component)
        self.assertIn('aria-label="Oldest first"', self.component)
        rule = css_block(read(STATIC / "css" / "common.css"), '#chat-order[aria-pressed="true"] .chat-order-arrow')
        self.assertIn("rotate(180deg)", rule)

    def test_the_conversation_is_its_own_framed_section(self):
        self.assertIn('<section class="chat-section" id="chat-section"', self.component)
        self.assertIn("border", css_block(read(STATIC / "css" / "common.css"), ".chat-section {"))

    def test_a_shown_conversation_can_be_closed(self):
        self.assertIn('id="chat-close"', self.component)
        closing = self.component[self.component.index("function close()"):]
        closing = closing[:closing.index("\n  }\n")]
        self.assertIn("request++", closing)
        self.assertIn("chat = null", closing)
        self.assertIn("focus()", closing)

    def test_a_keyboard_can_skip_the_conversation(self):
        self.assertIn('class="skip-link"', self.component)
        self.assertIn('id="chat-end"', self.component)
        rule = css_block(read(STATIC / "css" / "common.css"), ".skip-link:not(:focus)")
        self.assertIn("clip-path", rule)

    @unittest.skipUnless(shutil.which("node"), "needs node")
    def test_newest_first_keeps_each_calls_entries_in_their_order(self):
        entries = [{"kind": "prompt", "message_id": None}, {"kind": "thinking", "message_id": "a"},
                   {"kind": "tool", "message_id": "a"}, {"kind": "injected", "message_id": None},
                   {"kind": "text", "message_id": "b"}, {"kind": "text", "message_id": "c"}]
        ordered = run_function("tables.ts", "orderedEntries", entries, False)
        self.assertEqual([(entry["kind"], entry["message_id"]) for entry in ordered],
                         [("text", "c"), ("text", "b"), ("injected", None), ("thinking", "a"), ("tool", "a"),
                          ("prompt", None)])

    @unittest.skipUnless(shutil.which("node"), "needs node")
    def test_oldest_first_is_the_transcripts_order(self):
        entries = [{"kind": "prompt", "message_id": None}, {"kind": "text", "message_id": "a"}]
        self.assertEqual(run_function("tables.ts", "orderedEntries", entries, True), entries)


class CompactionTotalTest(unittest.TestCase):
    @staticmethod
    def row(verdict, net):
        """A compaction row compared against keeping the context."""
        return {"versus_keeping": {"verdict": verdict, "net": net}}

    @unittest.skipUnless(shutil.which("node"), "needs node")
    def test_the_nets_are_summed_like_the_estimated_cost_tile(self):
        rows = [self.row("saved", 1.25), self.row("open", -0.25), self.row("forced", 9.0), self.row("unknown", None),
                {"versus_keeping": None}]
        self.assertEqual(run_function("compact.ts", "compactionTotal", rows),
                         {"net": 1.0, "compactions": 2, "unknown": 1})

    @unittest.skipUnless(shutil.which("node"), "needs node")
    def test_nothing_to_sum_gives_none(self):
        rows = [self.row("forced", 2.0), {"versus_keeping": None}]
        self.assertIsNone(run_function("compact.ts", "compactionTotal", rows))

    def test_the_compactions_heading_carries_the_total(self):
        self.assertIn("compactionTotal(compactions)", read(MODULES["context.ts"]))


class PagingTest(unittest.TestCase):
    @unittest.skipUnless(shutil.which("node"), "needs node")
    def test_a_sub_row_stays_on_the_page_of_its_group(self):
        self.assertEqual(run_function("tables.ts", "pageUnits", [False, True, True, False, False, True]),
                         [0, 0, 0, 1, 2, 2])

    @unittest.skipUnless(shutil.which("node"), "needs node")
    def test_a_page_covers_its_share_of_the_groups(self):
        self.assertEqual(run_function("tables.ts", "pageWindow", 84, 10, 1),
                         {"page": 1, "pages": 9, "first": 10, "last": 20})

    @unittest.skipUnless(shutil.which("node"), "needs node")
    def test_the_last_page_holds_the_rest(self):
        self.assertEqual(run_function("tables.ts", "pageWindow", 84, 25, 3),
                         {"page": 3, "pages": 4, "first": 75, "last": 84})

    @unittest.skipUnless(shutil.which("node"), "needs node")
    def test_a_page_past_the_end_falls_back_to_the_last(self):
        self.assertEqual(run_function("tables.ts", "pageWindow", 30, 25, 5)["page"], 1)
        self.assertEqual(run_function("tables.ts", "pageWindow", 30, 25, -1)["page"], 0)

    @unittest.skipUnless(shutil.which("node"), "needs node")
    def test_the_pager_names_the_rows_shown(self):
        window = {"page": 1, "pages": 9, "first": 10, "last": 20}
        self.assertEqual(run_function("tables.ts", "pageText", window, 84), "rows 11–20 of 84")

    @unittest.skipUnless(shutil.which("node"), "needs node")
    def test_a_saved_page_size_counts_only_if_offered(self):
        self.assertEqual(run_function("tables.ts", "pageSizeFrom", "50", [10, 25, 50], 25), 50)
        self.assertEqual(run_function("tables.ts", "pageSizeFrom", "7", [10, 25, 50], 25), 25)
        self.assertEqual(run_function("tables.ts", "pageSizeFrom", None, [10, 25, 50], 25), 25)

    def test_the_page_size_is_a_preference(self):
        script = read(STATIC / "js" / "tables.js")
        # saved and read by the bundle's preferences (prefs.svelte.test.ts holds the key and the round trip); the
        # pager component sets it, and every pager reads it
        self.assertIn("preferences.pageSize = size;", read(COMPONENTS / "Pager.svelte"))
        self.assertNotIn("pagers", script)
        self.assertIn("page_size", read(LIB / "prefs.svelte.ts"))
        module = read(MODULES["tables.ts"])
        self.assertIn("export const DEFAULT_PAGE_SIZE = 25;", module)
        self.assertRegex(module, r"export const PAGE_SIZES = \[10, 25, 50\];")

    def test_every_table_is_paged(self):
        sites = {"tables.js": 1, "chartkit.js": 1}
        for script, count in sites.items():
            with self.subTest(script=script):
                self.assertEqual(len(re.findall(r"\bpaged\(", read(STATIC / "js" / script))), count)

    @unittest.skipUnless(shutil.which("node"), "needs node")
    def test_a_pager_of_cards_names_what_they_are(self):
        window = {"page": 0, "pages": 30, "first": 0, "last": 10}
        self.assertEqual(run_function("tables.ts", "pageText", window, 300, "sessions"), "sessions 1–10 of 300")

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
        self.assertIn("classList.toggle('off-page'", read(COMPONENTS / "Pager.svelte"))
        self.assertNotIn("hidden", read(COMPONENTS / "Pager.svelte").replace("never `hidden`", ""))

    def test_a_redrawn_tables_old_pager_is_let_go(self):
        # the live sessions redraw every 5 s: a pager kept for good would keep every old draw's rows alive
        body = re.search(r"^function paged\(.*?^\}$", read(STATIC / "js" / "tables.js"),
                         re.DOTALL | re.MULTILINE).group(0)
        self.assertIn("queueMicrotask(releaseDetachedPagers)", body)
        release = re.search(r"^export function releaseDetachedPagers\(.*?^\}$", read(LIB / "paging.svelte.ts"),
                            re.DOTALL | re.MULTILINE).group(0)
        self.assertIn("isConnected", release)
        self.assertIn("unmount(", release)

    def test_the_live_sessions_are_paged_as_cards_their_pager_by_the_heading(self):
        live = read(COMPONENTS / "LiveSessions.svelte")
        self.assertIn("pageUnits(", live)
        self.assertIn('<Pager key={KEY} noun="sessions"', live)
        self.assertIn('class="title-row"', live)
        self.assertIn('<div id="live-card"></div>', dashboard())


def function_body(script, name):
    """The source of a script's top-level function."""
    return re.search(rf"^(?:async )?function {name}\(.*?^\}}$", read(STATIC / "js" / script),
                     re.DOTALL | re.MULTILINE).group(0)


class LiveRangeTest(unittest.TestCase):
    def test_the_live_sessions_ask_for_the_summarys_range(self):
        script = read(STATIC / "js" / "main.js")
        self.assertIn("fetchJson(`/api/live?${rangeQuery(range.days, range.day)}`)", script)
        self.assertIn("fetchJson(`/api/summary?${rangeQuery(range.days, range.day)}`)", script)

    def test_a_new_range_loads_the_live_sessions_at_once(self):
        load = function_body("main.js", "loadRange")
        self.assertIn("loadSummary();", load)
        self.assertIn("loadLive();", load)
        # the range filter (a component) reports a new range, and the summary's load fits it to the retention
        setup = function_body("main.js", "setup")
        self.assertIn("range.onchange = loadRange;", setup)
        self.assertNotIn("loadSummary();", setup)
        self.assertIn("range.fit(summary);", function_body("main.js", "loadSummary"))

    def test_only_the_newest_live_request_renders(self):
        # a poll for the range before may answer after the new range's request
        body = function_body("main.js", "loadLive")
        self.assertIn("const request = ++liveRequest;", body)
        self.assertEqual(body.count("if (request !== liveRequest) return;"), 2)


class LiveStateTest(unittest.TestCase):
    NOW = "2026-09-28T12:00:00.000+00:00"
    EXPIRED = "2026-09-28T11:00:00.000+00:00"

    def badges(self, secrets=None, context=150_000, warm_until="2026-09-28T12:30:00.000+00:00", estimate=True,
               current=True, compacted=None, **fields):
        """liveStateBadges at NOW of a state with a 200K hint and an estimate with 40 calls ahead on average and a
        longest finished stretch of 60 calls, updated by the given fields (no preview once it compacted after its last
        call), and the secret accesses by severity."""
        values = {"breakeven_calls": 10, "breakeven_low": 5, "calls_ahead": 40.0, "cold_saving": -0.5,
                  "breakeven_cold": 10, "calls_after_high": 60}
        values.update(fields)
        gauge = {"context": context, "hint_tokens": 200_000, "compacted": compacted,
                 "compact_now": None if compacted else {"cache_warm_until": warm_until,
                                                        "estimate": values if estimate else None}}
        state = {"current": gauge if current else None,
                 "secrets": {"high": 0, "medium": 0, "low-medium": 0, "low": 0, **(secrets or {})}}
        return run_function("live.ts", "liveStateBadges", state, self.NOW)

    def badge(self, **arguments):
        """The only badge of badges(**arguments) as (kind, tone, text)."""
        [badge] = self.badges(**arguments)
        return badge["kind"], badge["tone"], badge["text"]

    @unittest.skipUnless(shutil.which("node"), "needs node")
    def test_compacting_that_pays_off_soon_has_the_session_views_tone_and_words(self):
        self.assertEqual(self.badge(), ("compact", "soon",
                                        "Soon: compacting now pays off after ~10 replies, ~40 ahead on average."))

    @unittest.skipUnless(shutil.which("node"), "needs node")
    def test_close_and_late_pay_offs_have_their_tones(self):
        self.assertEqual(self.badge(breakeven_calls=30)[1:], ("close", "Close: compacting now pays off after ~30 "
                                                                       "replies, ~40 ahead on average."))
        self.assertEqual(self.badge(breakeven_calls=50)[1], "unlikely")

    @unittest.skipUnless(shutil.which("node"), "needs node")
    def test_where_compacting_would_never_pay_off_there_is_no_compact_badge(self):
        self.assertEqual(self.badges(breakeven_calls=None, breakeven_low=None), [])
        self.assertEqual(self.badges(warm_until=self.EXPIRED, breakeven_cold=None), [])

    @unittest.skipUnless(shutil.which("node"), "needs node")
    def test_where_compacting_pays_off_only_later_there_is_no_compact_badge(self):
        self.assertEqual(self.badges(breakeven_calls=50, pays_later_in=5), [])
        self.assertEqual(self.badges(breakeven_calls=None, breakeven_low=60, pays_later_in=5), [])
        self.assertEqual(self.badge(context=250_000, breakeven_calls=50, pays_later_in=5),
                         ("compact", None, "Past your 200K compact hint."))

    @unittest.skipUnless(shutil.which("node"), "needs node")
    def test_where_it_likely_would_not_the_badge_says_so_in_the_late_tone(self):
        self.assertEqual(self.badge(breakeven_calls=None, breakeven_low=60),
                         ("compact", "unlikely", "Compacting now would likely not pay off."))

    @unittest.skipUnless(shutil.which("node"), "needs node")
    def test_without_calls_ahead_there_is_no_tone(self):
        self.assertEqual(self.badge(calls_ahead=None), ("compact", None, "Compacting now pays off after ~10 replies."))

    @unittest.skipUnless(shutil.which("node"), "needs node")
    def test_without_calls_ahead_only_a_break_even_within_the_longest_finished_stretch_shows(self):
        # right after a compaction the context is small: the break-even lies far beyond any stretch seen, or at the
        # median estimate compacting wouldn't pay off yet
        self.assertEqual(self.badges(calls_ahead=None, breakeven_calls=100), [])
        self.assertEqual(self.badges(calls_ahead=None, calls_after_high=None), [])
        self.assertEqual(self.badges(calls_ahead=None, breakeven_calls=None), [])

    @unittest.skipUnless(shutil.which("node"), "needs node")
    def test_an_expired_cache_goes_by_the_cold_estimate(self):
        self.assertEqual(self.badge(warm_until=self.EXPIRED, cold_saving=1.2),
                         ("compact", "soon", "Compacting now saves ~$1.20 at once: the cache has expired."))
        self.assertEqual(self.badge(warm_until=self.EXPIRED, breakeven_cold=30)[1], "close")

    @unittest.skipUnless(shutil.which("node"), "needs node")
    def test_past_the_hint_it_says_so(self):
        self.assertTrue(self.badge(context=250_000)[2].endswith(" Past your 200K compact hint."))
        self.assertEqual(self.badge(context=250_000, estimate=False), ("compact", None, "Past your 200K compact hint."))

    @unittest.skipUnless(shutil.which("node"), "needs node")
    def test_after_a_compaction_without_a_call_since_there_is_no_compact_badge(self):
        self.assertEqual(self.badges(context=250_000, compacted=self.NOW), [])

    @unittest.skipUnless(shutil.which("node"), "needs node")
    def test_without_a_gauge_or_an_estimate_below_the_hint_there_is_no_compact_badge(self):
        self.assertEqual(self.badges(current=False), [])
        self.assertEqual(self.badges(estimate=False), [])

    @unittest.skipUnless(shutil.which("node"), "needs node")
    def test_a_secret_access_sent_out_is_high(self):
        self.assertEqual(self.badge(secrets={"high": 1, "medium": 2}, current=False),
                         ("secret", "high", "Possible secret access: 1 call sent out, 2 more returned a result or may "
                                            "still"))

    @unittest.skipUnless(shutil.which("node"), "needs node")
    def test_a_secret_access_that_returned_is_medium(self):
        self.assertEqual(self.badge(secrets={"medium": 2}, current=False),
                         ("secret", "medium", "Possible secret access: 2 calls returned a result or may still"))

    @unittest.skipUnless(shutil.which("node"), "needs node")
    def test_below_medium_a_secret_access_shows_nothing(self):
        self.assertEqual(self.badges(secrets={"low-medium": 3, "low": 1}, current=False), [])

    @unittest.skipUnless(shutil.which("node"), "needs node")
    def test_the_secret_access_comes_first_as_in_the_session_view(self):
        self.assertEqual([badge["kind"] for badge in self.badges(secrets={"medium": 1})], ["secret", "compact"])

    def test_each_tone_has_the_session_views_mark_color(self):
        css = read(STATIC / "css" / "common.css")
        for tone, color in (("soon", "--gain-text"), ("close", "--hint-warning-edge"),
                            ("medium", "--hint-warning-edge"), ("unlikely", "--hint-critical-edge"),
                            ("high", "--hint-critical-edge")):
            with self.subTest(tone=tone):
                self.assertIn(f".live-icon-{tone}", css)
                rule = re.search(rf"[^}}]*\.live-icon-{tone}\b[^{{]*\{{([^}}]*)\}}", css).group(1)
                self.assertIn(f"var({color})", rule)

    def test_each_kind_has_its_icon_described_on_hover(self):
        icon = read(COMPONENTS / "LiveIcon.svelte")
        for kind in ("secret", "waiting", "permission"):
            with self.subTest(kind=kind):
                self.assertIn(f"badge.kind === '{kind}'", icon)
        self.assertIn("{:else}", icon)                  # the trash compactor, the last kind
        self.assertIn('role="img"', icon)
        self.assertIn("aria-label={badge.text}", icon)
        self.assertIn("title={badge.text}", icon)
        self.assertIn('aria-hidden="true"', icon)

    def wait_badge(self, waiting):
        """liveWaitBadge of a live session's waiting."""
        return run_function("live.ts", "liveWaitBadge", waiting)

    @unittest.skipUnless(shutil.which("node"), "needs node")
    def test_a_question_without_an_answer_waits_for_the_user(self):
        badge = self.wait_badge({"kind": "question", "tool": "AskUserQuestion", "since": self.NOW, "agent_type": None})
        self.assertEqual((badge["kind"], badge["tone"]), ("waiting", "waiting"))
        self.assertTrue(badge["text"].startswith("Waiting for your answer since "))

    @unittest.skipUnless(shutil.which("node"), "needs node")
    def test_a_plan_waits_for_its_approval(self):
        badge = self.wait_badge({"kind": "question", "tool": "ExitPlanMode", "since": self.NOW, "agent_type": None})
        self.assertTrue(badge["text"].startswith("Waiting for you to approve the plan since "))

    @unittest.skipUnless(shutil.which("node"), "needs node")
    def test_a_permission_prompt_waits_with_its_own_icon_in_the_same_tone(self):
        badge = self.wait_badge({"kind": "permission", "tool": "Bash", "since": self.NOW, "agent_type": None})
        self.assertEqual((badge["kind"], badge["tone"]), ("permission", "waiting"))
        self.assertTrue(badge["text"].startswith("Waiting for your permission to use Bash since "))

    @unittest.skipUnless(shutil.which("node"), "needs node")
    def test_a_subagents_permission_prompt_names_the_subagent(self):
        badge = self.wait_badge({"kind": "permission", "tool": "Write", "since": self.NOW,
                                 "agent_type": "general-purpose"})
        self.assertTrue(badge["text"].startswith("Waiting for your permission to use Write (a general-purpose "
                                                 "subagent) since "))

    @unittest.skipUnless(shutil.which("node"), "needs node")
    def test_a_session_waiting_for_nothing_has_no_wait_badge(self):
        self.assertIsNone(self.wait_badge(None))

    def test_waiting_is_blue_and_comes_first_by_the_title(self):
        # blue, not a warning's or an alarm's hue: nothing is wrong, the session only waits (≥ 3:1 on every card)
        css = read(STATIC / "css" / "common.css")
        self.assertIn("var(--series-1)", re.search(r"\.live-icon-waiting \{([^}]*)\}", css).group(1))
        card = read(COMPONENTS / "LiveCard.svelte")
        self.assertLess(card.index('<div class="title">'), card.index("<LiveIcon badge={waitBadge} />"))
        self.assertLess(card.index("<LiveIcon badge={waitBadge} />"), card.index('class="live-states"'))

    def test_the_states_are_asked_for_after_the_list_is_drawn_without_holding_up_the_poll(self):
        body = function_body("main.js", "loadLive")
        self.assertIn("loadLiveStates(live.sessions);", body)
        self.assertNotIn("await loadLiveStates", body)
        self.assertLess(body.index("setPayload({live, liveAt"), body.index("loadLiveStates(live.sessions)"))
        self.assertIn("fetchJson(`/api/session/${encodeURIComponent(id)}/state`)",
                      function_body("main.js", "loadLiveState"))

    def test_a_state_still_on_its_way_is_not_asked_for_again(self):
        body = function_body("main.js", "loadLiveState")
        self.assertIn("if (liveStateRequests.has(id)) return;", body)
        self.assertIn("liveStateRequests.delete(id)", body)


class SessionListTest(unittest.TestCase):
    SESSIONS = [
        {"session_id": "abc-1", "title": "Parser fix", "project": "/home/dev/app"},
        {"session_id": "def-2", "title": None, "project": "/home/dev/other"},
        {"session_id": "ghi-3", "title": "Chart colors", "project": "/home/dev/app"},
    ]

    def matching(self, project, text):
        """The ids of the sessions the filter keeps."""
        return [session["session_id"] for session in self.SESSIONS
                if run_function("tables.ts", "sessionMatches", session, project, text)]

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
        self.assertEqual(run_function("tables.ts", "sessionProjects", self.SESSIONS, ""),
                         [{"project": "/home/dev/app", "count": 2}, {"project": "/home/dev/other", "count": 1}])

    @unittest.skipUnless(shutil.which("node"), "needs node")
    def test_a_picked_project_stays_on_offer_in_a_range_without_it(self):
        self.assertEqual(run_function("tables.ts", "sessionProjects", self.SESSIONS[:1], "/home/dev/gone"),
                         [{"project": "/home/dev/app", "count": 1}, {"project": "/home/dev/gone", "count": 0}])

    @unittest.skipUnless(shutil.which("node"), "needs node")
    def test_the_count_says_how_many_of_the_ranges_sessions_show(self):
        self.assertEqual(run_function("tables.ts", "sessionCount", 84, 84), "84 sessions")
        self.assertEqual(run_function("tables.ts", "sessionCount", 1, 1), "1 session")
        self.assertEqual(run_function("tables.ts", "sessionCount", 12, 84), "12 of 84 sessions")

    def test_the_filters_come_between_the_heading_and_the_table(self):
        # TableView draws its heading, then its intro (the filters), then the table
        source = read(COMPONENTS / "SessionsList.svelte")
        heading = source.index('id="sessions-title"')
        for control in ('id="sessions-project"', 'id="sessions-search"', 'id="sessions-count"'):
            with self.subTest(control=control):
                self.assertLess(heading, source.index(control))
        self.assertRegex(source, r'<select\s+id="sessions-project"\s+aria-label="[^"]+"')
        self.assertRegex(source, r'<input\s+type="search"\s+id="sessions-search"\s+aria-label="[^"]+"')
        self.assertRegex(source, r"\{heading\}\s+\{intro\}")

    def test_the_heading_says_the_amounts_are_the_ranges_and_themes_keep_it(self):
        self.assertRegex(read(COMPONENTS / "SessionsList.svelte"),
                         r"<h2 id=\"sessions-title\"><span>\{hype\('Sessions'\)\}</span>\s+"
                         r'<span class="muted">[^<]*in the range</span></h2>')

    def test_a_new_filter_starts_at_the_first_page(self):
        source = read(COMPONENTS / "SessionsList.svelte")
        self.assertEqual(source.count("tablePages.forget(KEY)"), 2)
        self.assertIn("const KEY = 'sessions'", source)

    def test_the_page_mounts_the_list_where_the_old_card_was(self):
        self.assertIn('<div id="sessions-card"></div>', dashboard())
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
    NOW = "2026-09-29T20:11:17.932+00:00"
    QUESTION = {"kind": "question", "tool": "AskUserQuestion", "since": NOW, "agent_type": None}
    PERMISSION = {"kind": "permission", "tool": "Write", "since": NOW, "agent_type": None}

    def waits(self, waiting, sessions):
        """sessionWaits of the open session s1 waiting so, with these live sessions."""
        return run_function("live.ts", "sessionWaits", {"session_id": "s1", "waiting": waiting}, sessions)

    @unittest.skipUnless(shutil.which("node"), "needs node")
    def test_the_open_session_says_what_it_waits_for(self):
        [wait] = self.waits(self.QUESTION, [])
        self.assertEqual((wait["kind"], wait["session_id"], wait["title"]), ("waiting", "s1", None))
        self.assertTrue(wait["text"].startswith("Waiting for your answer since "))

    @unittest.skipUnless(shutil.which("node"), "needs node")
    def test_the_other_live_sessions_waits_follow_with_their_titles(self):
        # the open session's view hides the live list, and with it their icons
        sessions = [{"session_id": "s1", "title": "Open", "waiting": self.QUESTION},
                    {"session_id": "s2", "title": "Parser fix", "waiting": self.PERMISSION},
                    {"session_id": "s3", "title": None, "waiting": self.QUESTION},
                    {"session_id": "s4", "title": "Busy", "waiting": None}]
        waits = self.waits(self.QUESTION, sessions)
        self.assertEqual([(wait["session_id"], wait["title"], wait["kind"]) for wait in waits],
                         [("s1", None, "waiting"), ("s2", "Parser fix", "permission"),
                          ("s3", "Untitled session", "waiting")])

    @unittest.skipUnless(shutil.which("node"), "needs node")
    def test_the_open_sessions_own_wait_comes_from_its_detail_not_the_live_list(self):
        sessions = [{"session_id": "s1", "title": "Open", "waiting": self.QUESTION}]
        self.assertEqual(self.waits(None, sessions), [])

    @unittest.skipUnless(shutil.which("node"), "needs node")
    def test_a_wait_the_live_list_saw_first_asks_for_the_session_at_once(self):
        # a session quiet for minutes is asked for once a minute, the live list every five seconds
        detail = {"session_id": "s1", "waiting": None}
        changed = [{"session_id": "s1", "waiting": self.QUESTION}]
        self.assertTrue(run_function("live.ts", "waitChanged", detail, changed))
        self.assertFalse(run_function("live.ts", "waitChanged", {**detail, "waiting": self.QUESTION}, changed))
        self.assertFalse(run_function("live.ts", "waitChanged", detail, [{"session_id": "s1", "waiting": None}]))

    @unittest.skipUnless(shutil.which("node"), "needs node")
    def test_an_answered_wait_goes_as_soon_as_the_live_list_sees_it(self):
        detail = {"session_id": "s1", "waiting": self.QUESTION}
        self.assertTrue(run_function("live.ts", "waitChanged", detail, [{"session_id": "s1", "waiting": None}]))

    @unittest.skipUnless(shutil.which("node"), "needs node")
    def test_a_session_off_the_live_list_says_nothing_of_its_wait(self):
        # a past day's range leaves it out
        detail = {"session_id": "s1", "waiting": self.QUESTION}
        self.assertFalse(run_function("live.ts", "waitChanged", detail, []))

    def test_the_waits_come_first_under_the_sessions_heading(self):
        view = read(COMPONENTS / "SessionView.svelte")
        self.assertLess(view.index('id="drilldown-title"'), view.index("<SessionWaits"))
        self.assertLess(view.index("<SessionWaits"), view.index("<KpiTiles"))
        self.assertIn('role="status"', read(COMPONENTS / "SessionWaits.svelte"))

    def test_each_live_answer_asks_for_the_session_where_its_wait_changed(self):
        # the notice itself follows the payload's live answer
        body = function_body("main.js", "loadLive")
        self.assertIn("setPayload({live, liveAt", body)
        self.assertIn("if (state.session && sessionShown() && waitChanged(state.session, live.sessions)) refreshSession()",
                      body)

    def test_a_wait_asks_for_the_open_session_only_while_no_other_one_loads(self):
        # a refresh of the open one would drop the answer of the one loading
        body = function_body("main.js", "sessionShown")
        self.assertIn("location.hash.match(SESSION_HASH)", body)
        self.assertIn("match[1] === state.session.session_id", body)

    def test_the_waits_are_keyed_so_a_screen_reader_hears_a_new_one_once(self):
        notice = read(COMPONENTS / "SessionWaits.svelte")
        self.assertRegex(notice, r"\{#each \w+ as \w+ \([^)]+\)\}")
        self.assertIn("<LiveIcon", notice)
        self.assertIn("sessionHref(", notice)

    def test_the_notice_is_in_the_waiting_tone(self):
        # blue, like the live cards' icons: nothing is wrong, a session only waits
        css = read(STATIC / "css" / "common.css")
        self.assertIn("var(--series-1)", css_block(css, ".wait-notice {"))
        self.assertIn("var(--series-1)", css_block(css, ".wait-icon {"))


class SessionPollTest(unittest.TestCase):
    def function_body(self, name):
        """main.js's function `name`, from its line to its closing brace."""
        return re.search(rf"^(async )?function {name}\(.*?^\}}$", read(STATIC / "js" / "main.js"),
                         re.DOTALL | re.MULTILINE).group(0)

    def test_opening_another_session_or_hiding_the_tab_stops_the_open_sessions_poll(self):
        for name in ("loadSession", "pollWhileVisible", "pollSession"):
            with self.subTest(name=name):
                self.assertIn("clearTimeout(sessionTimer)", self.function_body(name))

    def test_a_changed_session_is_drawn_in_place_and_the_conversation_reads_itself_again(self):
        body = self.function_body("refreshSession")
        self.assertIn("renderDrilldown(session, true)", body)
        self.assertNotIn("refreshChat", body)
        # the conversation's effect follows the payload's session, which renderDrilldown sets
        self.assertIn("void payload.session;", read(COMPONENTS / "Conversation.svelte"))


class BannerTest(unittest.TestCase):
    def test_the_banner_and_its_messages_come_from_the_bundle(self):
        # web/src/lib/banner.svelte.ts keeps one message per source; the old scripts call its showError and hasError
        moved = r"\bfunction (showError|hasError|bannerText)\b|\berrors\.(has|set|delete)\("
        for path in OWN_SCRIPTS:
            with self.subTest(script=path.name):
                self.assertNotRegex(read(path), moved)

    def test_the_banner_takes_the_placeholders_place(self):
        # the bridge mounts it there, so it keeps its place in the layout
        self.assertIn('<div id="error" class="banner" role="alert"></div>', dashboard())

    def test_a_refused_request_says_why_without_its_address(self):
        self.assertIn("if (response.status === 403) throw new Error(payload.error", read(STATIC / "js" / "util.js"))


class LimitWindowTest(unittest.TestCase):
    WINDOW = {"start": "2026-09-01T12:00:00.000+00:00", "first_hit": "2026-09-01T15:12:00.000+00:00",
              "resets_at": "2026-09-01T17:00:00.000+00:00"}

    @unittest.skipUnless(shutil.which("node"), "needs node")
    def test_a_window_is_hit_after_the_time_from_its_start(self):
        self.assertEqual(run_function("charts.ts", "windowHitAfter", self.WINDOW), (3 * 60 + 12) * 60 * 1000)

    def test_the_rate_limits_section_is_drawn_by_its_component(self):
        # the chart, the windows and the latest errors, in that order, are RateLimits.svelte's markup
        page = dashboard()
        self.assertIn('<div id="limits-card"></div>', page)
        self.assertNotIn('id="limit-windows"', page)


class StyleTest(unittest.TestCase):
    def test_every_variable_used_is_defined_for_every_theme(self):
        # light.css and common.css apply in every theme; the others only override
        defaults = set(re.findall(r"(--[\w-]+):", read(STATIC / "css" / "themes" / "light.css")
                                  + read(STATIC / "css" / "common.css")))
        sources = STYLESHEETS + OWN_SCRIPTS + [COLORS, LIB / "tiles.ts", LIB / "costly.ts", LIB / "limits.ts"]
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
        block = re.search(rf"\n  {theme}: \{{(.*?)\n  \}},", read(LIB / "themes.ts"), re.DOTALL).group(1)
        return set(re.findall(r'^\s+"([^"]+)":', block, re.MULTILINE))

    def labels(self):
        """The labels the page themes: data-label in the markup, themed() and tile() in the scripts, hype() and
        StatTile's label and themed note in the components, the tiles' parts in lib/tiles.ts, and the by-model chart's title per time unit."""
        found = set(re.findall(r'data-label="([^"]+)"', dashboard()))
        for path in OWN_SCRIPTS:
            text = read(path)
            found |= set(re.findall(r'themed\("[a-z0-9]+", "([^"]+)"', text))
            found |= set(re.findall(r'\btile\("([^"]+)"', text))
            for template in re.findall(r"`(Per \$\{buckets\.unit\}, [^`]+)`", text):
                found |= {template.replace("${buckets.unit}", unit) for unit in ("day", "hour")}
        for path in sorted(COMPONENTS.glob("*.svelte")):
            found |= set(re.findall(r"\bhype\('([^']+)'\)", read(path)))
            found |= set(re.findall(r'\bnote="([^"]+)" themedNote', read(path)))
            found |= set(re.findall(r'<StatTile\s+label="([^"]+)"', read(path)))
        found |= set(re.findall(r"\blabel: '([^']+)'", read(LIB / "tiles.ts")))
        return found

    def test_every_label_has_each_themes_wording(self):
        for theme in GIMMICK_THEMES:
            with self.subTest(theme=theme):
                self.assertEqual(sorted(self.labels() - self.copy(theme)), [])

    def test_every_wording_belongs_to_a_label(self):
        # a label can also reach themed() through a variable: then it is a string elsewhere in the scripts
        scripts = "".join(read(path) for path in OWN_SCRIPTS)
        for theme in GIMMICK_THEMES:
            with self.subTest(theme=theme):
                unused = [key for key in self.copy(theme) - self.labels() if f'"{key}"' not in scripts]
                self.assertEqual(sorted(unused), [])


if __name__ == "__main__":
    unittest.main()
