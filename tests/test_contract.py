"""web/contract.json, what the page expects of the server (its tests write it: make contract), and the server keeping
to it: every answer of a demo store has the fields its type declares and no others, of the declared kinds; the session
route takes the ids the page links to; the CSP names the policies the page creates; the values the page has words
for are the server's; and the desktop notifications agree with the live card's compact states."""
import json
import re
import shutil
import tempfile
import types
import unittest
from datetime import UTC
from datetime import datetime
from pathlib import Path

from claude_usage import compact
from claude_usage import config
from claude_usage import notify
from claude_usage import pricing
from claude_usage import queries
from claude_usage import scan
from claude_usage import secret_paths
from claude_usage import server
from claude_usage import store
from claude_usage import tool_kinds
from claude_usage import turns

import demo
from helpers import TMP_DIR

CONTRACT = json.loads((Path(__file__).resolve().parent.parent / "web" / "contract.json").read_text(encoding="utf-8"))
TYPES = CONTRACT["types"]
PRIMITIVES = {"string": str, "boolean": bool, "null": type(None)}
DIFFER = "the server's answers and web/src/api/api.ts differ: change api.ts and run make contract"
SHARED = types.SimpleNamespace()


def setUpModule():
    """Build the demo for the current time, scan it and start an app over its store."""
    TMP_DIR.mkdir(exist_ok=True)
    SHARED.root = Path(tempfile.mkdtemp(dir=TMP_DIR))
    paths = demo.build(SHARED.root / "demo", datetime.now(UTC).replace(microsecond=0))
    SHARED.store = store.Store(paths.store, check_same_thread=False)
    scan.scan(SHARED.store, paths.projects)
    values = config.load(overrides=[demo.config_file(paths)]).values
    prices = pricing.parse_prices(values["prices"], values.get("fees"))
    SHARED.app = server.UsageApp(SHARED.store, paths.projects, prices, live_minutes=5, agent_live_minutes=180,
                                 compact=compact.parse_compact_settings(values),
                                 secret_settings=secret_paths.parse_secrets(values))


def tearDownModule():
    """Stop the app and remove the demo."""
    SHARED.app.close()
    SHARED.store.close()
    shutil.rmtree(SHARED.root)


def fields_of(name):
    """An interface's fields with those of the interfaces it extends: name -> (shape, optional)."""
    declared = TYPES[name]
    fields = {}
    for parent in declared["extends"]:
        fields.update(fields_of(parent))
    fields.update({key: (shape, key in declared["optional"]) for key, shape in declared["fields"].items()})
    return fields


def primitive_problems(value, name, where):
    """What differs between a value and a primitive type (a bool is no number)."""
    if name == "number":
        matches = isinstance(value, (int, float)) and not isinstance(value, bool)
    else:
        matches = isinstance(value, PRIMITIVES[name])
    return [] if matches else [f"{where}: expected {name}, got {value!r}"]


def problems(value, shape, where):
    """What differs between a value and its declared shape, as messages; empty where it matches. A union reports
    the member that differs least."""
    if isinstance(shape, str):
        return primitive_problems(value, shape, where)
    if "union" in shape:
        found = [problems(value, member, where) for member in shape["union"]]
        return [] if any(not each for each in found) else min(found, key=len)
    if "literal" in shape:
        return [] if value == shape["literal"] else [f"{where}: expected '{shape['literal']}', got {value!r}"]
    if "array" in shape:
        if not isinstance(value, list):
            return [f"{where}: expected a list, got {type(value).__name__}"]
        return [message for index, item in enumerate(value)
                for message in problems(item, shape["array"], f"{where}[{index}]")]
    if "record" in shape:
        if not isinstance(value, dict):
            return [f"{where}: expected a record, got {type(value).__name__}"]
        return [message for key, item in value.items() for message in problems(item, shape["record"], f"{where}.{key}")]
    declared = TYPES[shape["ref"]]
    if "alias" in declared:
        return problems(value, declared["alias"], where)
    return interface_problems(value, shape["ref"], where)


def interface_problems(value, name, where):
    """What differs between an object and an interface: fields declared and not sent (unless optional), sent and not
    declared, and the fields' own differences."""
    if not isinstance(value, dict):
        return [f"{where}: expected {name}, got {type(value).__name__}"]
    fields = fields_of(name)
    found = [f"{where}: {name} declares {key}, the server doesn't send it"
             for key, (_, optional) in fields.items() if key not in value and not optional]
    found += [f"{where}: the server sends {key}, {name} doesn't declare it" for key in value if key not in fields]
    for key, (shape, _) in fields.items():
        if key in value:
            found += problems(value[key], shape, f"{where}.{key}")
    return found


def as_json(payload):
    """A payload as the page receives it."""
    return json.loads(json.dumps(payload))


class CheckerTest(unittest.TestCase):
    def test_a_missing_and_an_undeclared_field_are_found(self):
        found = interface_problems({"calls": 1, "extra": 2}, "Reminders", "x")
        self.assertEqual(sorted(found), ["x: Reminders declares chars, the server doesn't send it",
                                         "x: the server sends extra, Reminders doesn't declare it"])

    def test_a_value_of_another_kind_is_found(self):
        self.assertEqual(interface_problems({"calls": "1", "chars": 2}, "Reminders", "x"),
                         ["x.calls: expected number, got '1'"])

    def test_null_matches_only_a_nullable_field(self):
        self.assertEqual(problems(None, {"union": ["string", "null"]}, "x"), [])
        self.assertEqual(problems(None, "string", "x"), ["x: expected string, got None"])

    def test_a_literal_union_takes_its_members_only(self):
        self.assertEqual(len(problems("saved", {"ref": "SecretReach"}, "x")), 1)
        self.assertEqual(problems("sent", {"ref": "SecretReach"}, "x"), [])

    def test_lists_and_records_check_each_item(self):
        self.assertEqual(problems([1, "2"], {"array": "number"}, "x"), ["x[1]: expected number, got '2'"])
        self.assertEqual(problems({"a": True}, {"record": "number"}, "x"), ["x.a: expected number, got True"])


class AnswerTest(unittest.TestCase):
    """Every answer the demo's store gives has the fields its type declares and no others, of the declared kinds."""

    def session_ids(self):
        """Every session of the store."""
        rows = SHARED.store.connection.execute("SELECT DISTINCT session_id FROM transcripts ORDER BY session_id")
        return [row[0] for row in rows]

    def assertMatches(self, payloads, name):
        """Fail with every difference between the payloads and the named type, each once."""
        found = sorted({message for payload in payloads for message in problems(as_json(payload), {"ref": name}, name)})
        self.assertEqual(found, [], DIFFER)

    def test_summary_over_a_day_a_week_and_a_month(self):
        self.assertMatches([SHARED.app.summary(days) for days in (1, 7, 30)], "Summary")

    def test_live_without_and_with_a_range(self):
        self.assertMatches([SHARED.app.live(), SHARED.app.live(7)], "Live")

    def test_every_session(self):
        self.assertMatches([SHARED.app.session(session_id) for session_id in self.session_ids()], "SessionDetail")

    def test_every_sessions_state(self):
        self.assertMatches([SHARED.app.session_state(session_id) for session_id in self.session_ids()],
                           "SessionState")

    def test_every_transcripts_conversation(self):
        chats = []
        for session_id in self.session_ids():
            agents = [None] + [agent["agent_id"] for agent in SHARED.app.session(session_id)["agents"]
                               if agent["agent_id"]]
            chats += [SHARED.app.chat(session_id, agent_id) for agent_id in agents]
        self.assertMatches([chat for chat in chats if chat is not None], "Chat")

    def test_the_demo_shows_a_compaction_a_secret_and_a_wait(self):
        # the checks above mean something only where the demo reaches these parts of the answers
        session = SHARED.app.session(demo.FEATURED_SESSION)
        self.assertTrue(any(agent["compactions"] for agent in session["agents"]))
        self.assertTrue(session["secret_accesses"])
        self.assertTrue(SHARED.app.live()["sessions"][0]["waiting"] or SHARED.app.session(demo.PERMISSION_SESSION))


class ExpectationTest(unittest.TestCase):
    def test_the_session_route_takes_the_ids_the_page_links_to(self):
        self.assertEqual(re.fullmatch(r"/api/session/\((.+)\)", server.SESSION_PATH.pattern).group(1),
                         CONTRACT["session_id"])

    def test_the_csp_names_exactly_the_policies_the_page_creates(self):
        directives = [part.split() for part in server.DASHBOARD_POLICY.split(";")]
        self.assertEqual([names for name, *names in directives if name == "trusted-types"], [CONTRACT["trusted_types"]])

    def test_the_page_has_words_for_every_compaction_verdict(self):
        self.assertEqual(sorted(CONTRACT["words"]["compaction_verdicts"]), sorted(turns.VERDICTS))

    def test_the_page_has_words_for_every_command_kind(self):
        self.assertEqual(sorted(CONTRACT["words"]["tool_kinds"]), sorted(tool_kinds.KINDS))

    def test_the_page_orders_effort_levels_like_the_report(self):
        self.assertEqual(tuple(CONTRACT["efforts"]["order"]), queries.EFFORT_ORDER)

    def test_the_page_hatches_ultracode_and_the_background_calls(self):
        self.assertEqual(CONTRACT["efforts"]["background"], store.BACKGROUND_EFFORT)
        self.assertIn(store.BACKGROUND_EFFORT, CONTRACT["efforts"]["hatched"])
        self.assertIn(store.ULTRACODE, CONTRACT["efforts"]["hatched"])

    def test_the_notifications_agree_with_the_live_cards_compact_states(self):
        for index, badge in enumerate(CONTRACT["compact_badges"]):
            with self.subTest(case=index, states=badge["states"]):
                now = datetime.fromisoformat(badge["now"])
                self.assertEqual(notify.compact_states(badge["current"], now), frozenset(badge["states"]))


if __name__ == "__main__":
    unittest.main()
