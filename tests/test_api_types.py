"""web/src/lib/api.ts: the page's types of the server's answers match what the server sends, both ways."""
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
from claude_usage import pricing
from claude_usage import scan
from claude_usage import secret_paths
from claude_usage import server
from claude_usage import store

import demo
from helpers import TMP_DIR

API_TYPES = Path(__file__).resolve().parent.parent / "web" / "src" / "lib" / "api.ts"
SHARED = types.SimpleNamespace()
PRIMITIVES = {"string": str, "boolean": bool, "null": type(None)}


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


def without_comments(text):
    """The TypeScript text without its line and block comments."""
    return re.sub(r"/\*.*?\*/|//[^\n]*", "", text, flags=re.DOTALL)


def parse_types(text):
    """The declared types by name: an interface is ("interface", parents, {field: (type, optional)}), an alias is
    ("alias", type). A type is a string: primitives, a name, a quoted literal, `T[]`, `Record<string, T>` and
    `A | B`, which the checker reads."""
    declared = {}
    source = without_comments(text)
    for match in re.finditer(r"export interface (\w+)(?: extends ([\w, ]+))? \{(.*?)\n\}", source, flags=re.DOTALL):
        name, parents, body = match.groups()
        fields = {}
        for field in re.finditer(r"^\s+(?:(\w+)|'([\w-]+)')(\??): (.+);$", body, flags=re.MULTILINE):
            key = field.group(1) or field.group(2)
            fields[key] = (field.group(4).strip(), field.group(3) == "?")
        declared[name] = ("interface", [parent.strip() for parent in (parents or "").split(",") if parent.strip()],
                          fields)
    for match in re.finditer(r"export type (\w+) = ([^;]+);", source):
        declared[match.group(1)] = ("alias", match.group(2).strip())
    return declared


DECLARED = parse_types(API_TYPES.read_text(encoding="utf-8"))


def fields_of(name):
    """An interface's fields with those of the interfaces it extends."""
    _, parents, own = DECLARED[name]
    fields = {}
    for parent in parents:
        fields.update(fields_of(parent))
    fields.update(own)
    return fields


def split_union(declaration):
    """The members of `A | B`, at the top level (none of the subset's types nest a bar)."""
    return [member.strip() for member in declaration.split(" | ")]


def problems(value, declaration, where):
    """What differs between a value and its declared type, as messages; empty where it matches."""
    members = split_union(declaration)
    if len(members) > 1:
        found = [problems(value, member, where) for member in members]
        return [] if any(not each for each in found) else min(found, key=len)
    if declaration.endswith("[]"):
        if not isinstance(value, list):
            return [f"{where}: expected {declaration}, got {type(value).__name__}"]
        return [message for index, item in enumerate(value)
                for message in problems(item, declaration[:-2], f"{where}[{index}]")]
    record = re.fullmatch(r"Record<string, (.+)>", declaration)
    if record:
        if not isinstance(value, dict):
            return [f"{where}: expected {declaration}, got {type(value).__name__}"]
        return [message for key, item in value.items() for message in problems(item, record.group(1), f"{where}.{key}")]
    if declaration == "number":
        return [] if isinstance(value, (int, float)) and not isinstance(value, bool) else [
            f"{where}: expected number, got {value!r}"]
    if declaration in PRIMITIVES:
        return [] if isinstance(value, PRIMITIVES[declaration]) else [f"{where}: expected {declaration}, got {value!r}"]
    literal = re.fullmatch(r"'([^']*)'", declaration)
    if literal:
        return [] if value == literal.group(1) else [f"{where}: expected '{literal.group(1)}', got {value!r}"]
    kind, *_ = DECLARED[declaration]
    if kind == "alias":
        return problems(value, DECLARED[declaration][1], where)
    return interface_problems(value, declaration, where)


def interface_problems(value, name, where):
    """What differs between an object and an interface: fields declared and not sent (unless optional), sent and not
    declared, and the fields' own differences."""
    if not isinstance(value, dict):
        return [f"{where}: expected {name}, got {type(value).__name__}"]
    fields = fields_of(name)
    found = [f"{where}: {name} declares {key}, the server doesn't send it"
             for key, (_, optional) in fields.items() if key not in value and not optional]
    found += [f"{where}: the server sends {key}, {name} doesn't declare it" for key in value if key not in fields]
    for key, (declaration, _) in fields.items():
        if key in value:
            found += problems(value[key], declaration, f"{where}.{key}")
    return found


def as_json(payload):
    """A payload as the page receives it."""
    return json.loads(json.dumps(payload))


class TypeParserTest(unittest.TestCase):
    def test_every_interface_and_alias_is_read(self):
        declared_in_file = re.findall(r"^export (?:interface|type) (\w+)", API_TYPES.read_text(encoding="utf-8"),
                                      flags=re.MULTILINE)
        self.assertEqual(sorted(DECLARED), sorted(declared_in_file))

    def test_every_field_is_read(self):
        # one declaration per field line: a field the pattern missed would never be checked
        source = without_comments(API_TYPES.read_text(encoding="utf-8"))
        lines = [line for line in source.splitlines() if re.match(r"^  \S", line)]
        self.assertEqual(sum(len(DECLARED[name][2]) for name in DECLARED if DECLARED[name][0] == "interface"),
                         len(lines))

    def test_a_missing_and_an_undeclared_field_are_found(self):
        found = interface_problems({"calls": 1, "extra": 2}, "Reminders", "x")
        self.assertEqual(sorted(found), ["x: Reminders declares chars, the server doesn't send it",
                                         "x: the server sends extra, Reminders doesn't declare it"])

    def test_a_value_of_another_kind_is_found(self):
        self.assertEqual(interface_problems({"calls": "1", "chars": 2}, "Reminders", "x"),
                         ["x.calls: expected number, got '1'"])

    def test_null_matches_only_a_nullable_field(self):
        self.assertEqual(problems(None, "string | null", "x"), [])
        self.assertEqual(problems(None, "string", "x"), ["x: expected string, got None"])

    def test_a_literal_union_takes_its_members_only(self):
        self.assertEqual(len(problems("saved", DECLARED["SecretReach"][1], "x")), 1)
        self.assertEqual(problems("sent", DECLARED["SecretReach"][1], "x"), [])


class AnswerTest(unittest.TestCase):
    """Every answer the demo's store gives has the fields its type declares and no others, of the declared kinds."""

    def session_ids(self):
        """Every session of the store."""
        rows = SHARED.store.connection.execute("SELECT DISTINCT session_id FROM transcripts ORDER BY session_id")
        return [row[0] for row in rows]

    def assertMatches(self, payloads, name):
        """Fail with every difference between the payloads and the named type, each once."""
        found = sorted({message for payload in payloads for message in problems(as_json(payload), name, name)})
        self.assertEqual(found, [], "web/src/lib/api.ts and the server's answers differ")

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


if __name__ == "__main__":
    unittest.main()
