import base64
import os
import re
import shutil
import sqlite3
import threading
import time
import unittest
from datetime import UTC
from datetime import datetime
from unittest import mock

from claude_usage import config
from claude_usage import notify
from claude_usage import server
from claude_usage import store
from helpers import FakeClock
from helpers import PRICES
from helpers import TempDirTestCase
from helpers import tool_use_block
from helpers import usage
from test_static import run_function

NOW = datetime(2026, 9, 28, 12, 0, tzinfo=UTC)
WARM = "2026-09-28T12:30:00.000+00:00"
EXPIRED = "2026-09-28T11:00:00.000+00:00"


def gauge(context=150_000, warm_until=WARM, estimate=True, compacted=None, last_compaction=None, **fields):
    """A main thread's gauge with a 200K hint and an estimate with 40 calls ahead on average and a longest finished
    stretch of 60 calls, updated by the given fields, as LiveStateTest in test_static builds it (no preview once it
    compacted after its last call)."""
    values = {"breakeven_calls": 10, "breakeven_low": 5, "calls_ahead": 40.0, "cold_saving": -0.5,
              "breakeven_cold": 10, "calls_after_high": 60}
    values.update(fields)
    return {"context": context, "hint_tokens": 200_000, "compacted": compacted, "last_compaction": last_compaction,
            "compact_now": None if compacted else {"cache_warm_until": warm_until,
                                                   "estimate": values if estimate else None}}


def environment(tmp, **fields):
    """A Linux environment under tmp that has nothing, changed by the given fields."""
    values = {"platform": "linux", "release": "6.8.0-generic", "environ": {}, "which": lambda name: None,
              "mounts": "", "root": tmp, "uid": 1000, "windows_path": lambda path: None}
    values.update(fields)
    return notify.Environment(**values)


def finder(**programs):
    """A shutil.which that finds only these programs, name -> path."""
    return lambda name: programs.get(name)


def touch(path):
    """Create a file and the folders above it; its path."""
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text("", encoding="utf-8")
    return path


def mount_line(point):
    """A /proc/self/mounts line for WSL's C: drive at point."""
    return f"C:\\134 {point} 9p rw,noatime,aname=drvfs;path=C:\\;uid=1000;gid=1000 0 0\n"


ENABLED = notify.NotifySettings(enabled=True, command=())


class ParseNotifyTest(unittest.TestCase):
    def test_the_defaults_turn_notifications_on(self):
        self.assertEqual(notify.parse_notify(config.load(overrides=[]).values), ENABLED)

    def test_without_the_table_they_are_on(self):
        self.assertEqual(notify.parse_notify({}), ENABLED)

    def test_they_can_be_switched_off(self):
        self.assertFalse(notify.parse_notify({"notify": {"enabled": False}}).enabled)

    def test_a_command_is_a_list_of_words(self):
        settings = notify.parse_notify({"notify": {"command": ["my-notifier", "{title}", "{body}"]}})
        self.assertEqual(settings.command, ("my-notifier", "{title}", "{body}"))

    def test_bad_values_are_refused_with_their_key(self):
        for table, key in (({"enabled": "yes"}, "notify.enabled"), ({"command": "notify-send"}, "notify.command"),
                           ({"command": [1]}, "notify.command"), ({"command": [""]}, "notify.command")):
            with self.subTest(table=table):
                with self.assertRaisesRegex(config.ConfigError, re.escape(key)):
                    notify.parse_notify({"notify": table})


class DetectTest(TempDirTestCase):
    def detect(self, settings=ENABLED, **fields):
        """detect() in environment(**fields)."""
        return notify.detect(settings, environment(self.tmp, **fields))

    def wsl(self, **fields):
        """detect() on WSL with interop on, changed by the given fields."""
        touch(self.tmp / "proc" / "sys" / "fs" / "binfmt_misc" / "WSLInterop")
        values = {"release": "6.18.33.2-microsoft-standard-WSL2", "mounts": mount_line(self.tmp / "mnt" / "c")}
        values.update(fields)
        return self.detect(**values)

    def test_a_command_of_your_own_wins(self):
        notifier = self.detect(notify.NotifySettings(True, ("my-notifier", "{title}")), platform="darwin")
        self.assertEqual((notifier.kind, notifier.arguments), ("command", ("my-notifier", "{title}")))

    def test_macos_uses_osascript(self):
        notifier = self.detect(platform="darwin", which=finder(osascript="/usr/bin/osascript"))
        self.assertEqual((notifier.kind, notifier.program), ("osascript", "/usr/bin/osascript"))

    def test_windows_uses_windows_powershell(self):
        # not pwsh 7, which can't load the toast's WinRT types this way
        notifier = self.detect(platform="win32", which=finder(**{"powershell.exe": "C:\\ps\\powershell.exe"}))
        self.assertEqual((notifier.kind, notifier.program, notifier.wsl), ("powershell", "C:\\ps\\powershell.exe",
                                                                             False))

    def test_windows_takes_the_icons_from_the_package(self):
        notifier = self.detect(platform="win32", which=finder(**{"powershell.exe": "C:\\ps\\powershell.exe"}))
        self.assertEqual(notifier.icon_dir, str(notify.ICONS_DIR))

    def test_windows_without_powershell_says_so(self):
        with self.assertRaisesRegex(notify.NotifyError, "powershell.exe"):
            self.detect(platform="win32")

    def test_wsl_shows_a_windows_toast_from_the_c_drive(self):
        # a Linux cwd would reach PowerShell as a \\wsl.localhost path
        notifier = self.wsl(which=finder(**{"powershell.exe": "/mnt/c/ps/powershell.exe"}))
        self.assertEqual((notifier.kind, notifier.program, notifier.wsl), ("powershell", "/mnt/c/ps/powershell.exe",
                                                                             True))
        self.assertEqual(notifier.cwd, str(self.tmp / "mnt" / "c"))

    def test_wsl_hands_powershell_the_icons_by_their_windows_path(self):
        windows = {str(notify.ICONS_DIR): "\\\\wsl.localhost\\Ubuntu\\icons"}
        notifier = self.wsl(which=finder(**{"powershell.exe": "/mnt/c/ps/powershell.exe"}), windows_path=windows.get)
        self.assertEqual(notifier.icon_dir, "\\\\wsl.localhost\\Ubuntu\\icons")

    def test_wsl_without_a_windows_path_shows_toasts_without_icons(self):
        notifier = self.wsl(which=finder(**{"powershell.exe": "/mnt/c/ps/powershell.exe"}))
        self.assertIsNone(notifier.icon_dir)

    def test_wsl_finds_powershell_on_the_c_drive_without_windows_on_the_path(self):
        # appendWindowsPath = false leaves the Windows folders off PATH
        program = touch(self.tmp / "mnt" / "c" / "Windows" / "System32" / "WindowsPowerShell" / "v1.0" /
                        "powershell.exe")
        self.assertEqual(self.wsl().program, str(program))

    def test_wsl_without_interop_falls_back_to_notify_send(self):
        notifier = self.detect(release="6.18.33.2-microsoft-standard-WSL2",
                               which=finder(**{"notify-send": "/usr/bin/notify-send",
                                               "powershell.exe": "/mnt/c/ps/powershell.exe"}),
                               environ={"DBUS_SESSION_BUS_ADDRESS": "unix:path=/run/user/1000/bus"})
        self.assertEqual(notifier.kind, "notify-send")

    def test_linux_uses_notify_send_on_the_session_bus(self):
        notifier = self.detect(which=finder(**{"notify-send": "/usr/bin/notify-send"}),
                               environ={"DBUS_SESSION_BUS_ADDRESS": "unix:path=/run/user/1000/bus"})
        self.assertEqual((notifier.kind, notifier.program, notifier.environment),
                         ("notify-send", "/usr/bin/notify-send", ()))

    def test_without_the_bus_address_notify_send_finds_the_users_bus(self):
        # started from cron or over ssh, the variable is missing
        bus = touch(self.tmp / "xdg" / "bus")
        notifier = self.detect(which=finder(**{"notify-send": "/usr/bin/notify-send"}),
                               environ={"XDG_RUNTIME_DIR": str(self.tmp / "xdg")})
        self.assertEqual(notifier.environment, (("DBUS_SESSION_BUS_ADDRESS", f"unix:path={bus}"),))
        bus = touch(self.tmp / "run" / "user" / "1000" / "bus")
        notifier = self.detect(which=finder(**{"notify-send": "/usr/bin/notify-send"}))
        self.assertEqual(notifier.environment, (("DBUS_SESSION_BUS_ADDRESS", f"unix:path={bus}"),))

    def test_notify_send_without_a_bus_says_so(self):
        # D-Bus would start a bus of its own that shows nothing, and still succeed
        with self.assertRaisesRegex(notify.NotifyError, "session bus"):
            self.detect(which=finder(**{"notify-send": "/usr/bin/notify-send"}))

    def test_nothing_found_names_what_to_install_or_set(self):
        with self.assertRaisesRegex(notify.NotifyError, r"notify-send not found.*\[notify\] command"):
            self.detect()


class CommandTest(TempDirTestCase):
    NOTE = notify.Notification("Claude is waiting for your answer", "Parser fix · app")

    def commands(self, notifier, *notes, environ=None):
        """The commands notifier runs for notes (by default NOTE) with the server's environment environ."""
        return notifier.commands(list(notes or [self.NOTE]), environ or {})

    def test_osascript_gets_the_texts_as_arguments(self):
        [command] = self.commands(notify.Notifier("macOS", "osascript", "/usr/bin/osascript"))
        self.assertEqual(command.argv, ("/usr/bin/osascript", "-e", "on run argv", "-e",
                                        "display notification (item 2 of argv) with title (item 1 of argv)",
                                        "-e", "end run", "Claude is waiting for your answer", "Parser fix · app"))

    def test_a_text_starting_with_a_dash_is_no_option_to_osascript(self):
        [command] = self.commands(notify.Notifier("macOS", "osascript", "osascript"),
                                  notify.Notification("-x", "--y"))
        self.assertEqual(command.argv[-2:], (" -x", " --y"))

    def test_notify_send_ends_its_options_and_escapes_the_body(self):
        # notification daemons may read the body as markup
        [command] = self.commands(notify.Notifier("notify-send", "notify-send", "/usr/bin/notify-send"),
                                  notify.Notification("-a <b>", "x & <i>y</i>"))
        self.assertEqual(command.argv, ("/usr/bin/notify-send", "--app-name=claude-usage", "--", "-a <b>",
                                        "x &amp; &lt;i&gt;y&lt;/i&gt;"))

    def test_notify_send_shows_the_icon_of_its_kind(self):
        [command] = self.commands(notify.Notifier("notify-send", "notify-send", "notify-send"),
                                  notify.Notification("a", "b", "waiting"))
        self.assertEqual(command.argv, ("notify-send", "--app-name=claude-usage",
                                        f"--icon={notify.ICONS_DIR / 'waiting.png'}", "--", "a", "b"))

    def test_notify_send_runs_each_notification(self):
        notifier = notify.Notifier("notify-send", "notify-send", "notify-send")
        self.assertEqual(len(self.commands(notifier, self.NOTE, self.NOTE)), 2)

    def test_a_command_of_your_own_gets_the_texts_in_its_words(self):
        notifier = notify.Notifier("yours", "command", "my-notifier",
                                   arguments=("my-notifier", "--title={title}", "{body}", "{other}"))
        [command] = self.commands(notifier, notify.Notification("a {body} b", "c {title} d"))
        self.assertEqual(command.argv, ("my-notifier", "--title=a {body} b", "c {title} d", "{other}"))

    def test_a_command_of_your_own_gets_the_icons_path(self):
        notifier = notify.Notifier("yours", "command", "my-notifier", arguments=("my-notifier", "--icon={icon}"))
        [command] = self.commands(notifier, notify.Notification("a", "b", "permission"))
        self.assertEqual(command.argv, ("my-notifier", f"--icon={notify.ICONS_DIR / 'permission.png'}"))
        [command] = self.commands(notifier, notify.Notification("a", "b"))
        self.assertEqual(command.argv, ("my-notifier", "--icon="))

    def script(self, command):
        """The PowerShell script of command, decoded."""
        return base64.b64decode(command.argv[-1]).decode("utf-16-le")

    def powershell_texts(self, command, line="Show-Toast"):
        """The words of the script's lines that start so (each a quoted text), decoded: a toast's title, body, the
        icon's source and its name on the Windows side."""
        quoted = " '([A-Za-z0-9+/=]*)'"
        rows = re.findall(rf"^{line}{quoted}{quoted}{quoted}{quoted}$", self.script(command), re.MULTILINE)
        return [tuple(base64.b64decode(text).decode("utf-8") for text in row) for row in rows]

    def test_powershell_gets_one_encoded_script(self):
        notifier = notify.Notifier("Windows", "powershell", "powershell.exe")
        [command] = self.commands(notifier)
        self.assertEqual(command.argv[:-1], ("powershell.exe", "-NoProfile", "-NonInteractive", "-NoLogo",
                                             "-EncodedCommand"))
        script = base64.b64decode(command.argv[-1]).decode("utf-16-le")
        self.assertIn("ToastNotificationManager", script)
        self.assertIn("appLogoOverride", script)
        self.assertEqual(self.powershell_texts(command), [(self.NOTE.title, self.NOTE.body, "", "")])

    def test_powershell_shows_the_toasts_as_claude_usage(self):
        # its own app id, registered for the user (no admin), so Windows names it and lists it in its settings
        script = self.script(self.commands(notify.Notifier("Windows", "powershell", "powershell.exe"))[0])
        self.assertIn(f"HKCU:\\Software\\Classes\\AppUserModelId\\{notify.APP_ID}", script)
        self.assertIn("-Name DisplayName -Value 'claude-usage'", script)

    def test_where_it_cannot_register_powershell_shows_them_as_its_own(self):
        script = self.script(self.commands(notify.Notifier("Windows", "powershell", "powershell.exe"))[0])
        self.assertRegex(script, re.compile(rf"\$appId = '{re.escape(notify.POWERSHELL_APP_ID)}'\ntry \{{.*"
                                            rf"\$appId = '{re.escape(notify.APP_ID)}'\n\}} catch \{{ \}}", re.DOTALL))

    def test_powershell_copies_each_icon_to_the_windows_side_once(self):
        # a toast shows only local images; the name carries the file's hash, so a changed icon is copied anew
        notifier = notify.Notifier("WSL", "powershell", "powershell.exe", icon_dir="\\\\wsl.localhost\\U\\icons")
        [command] = self.commands(notifier, notify.Notification("a", "b", "waiting"))
        [(_, _, source, name)] = self.powershell_texts(command)
        self.assertEqual(source, "\\\\wsl.localhost\\U\\icons\\waiting.png")
        self.assertRegex(name, r"^waiting-[0-9a-f]{10}\.png$")
        self.assertIn("Test-Path -LiteralPath $target", self.script(command))

    def test_the_app_icon_goes_with_the_registration(self):
        notifier = notify.Notifier("WSL", "powershell", "powershell.exe", icon_dir="C:\\icons")
        script = self.script(self.commands(notifier)[0])
        self.assertIn("-Name IconUri -Value $appIcon", script)
        self.assertRegex(script, r"\$appIcon = Copy-Icon '[A-Za-z0-9+/=]+' '[A-Za-z0-9+/=]+'")

    def test_without_the_icons_folder_the_toasts_have_no_icon(self):
        [command] = self.commands(notify.Notifier("Windows", "powershell", "powershell.exe"),
                                  notify.Notification("a", "b", "waiting"))
        self.assertEqual(self.powershell_texts(command), [("a", "b", "", "")])

    def test_powershell_gets_any_title_intact(self):
        # PowerShell also ends a quoted text at curly quotes, which titles often have
        note = notify.Notification("It’s ‘done’ 'now' \"here\"", "$(Get-Date) `n ü")
        [command] = self.commands(notify.Notifier("Windows", "powershell", "powershell.exe"), note)
        self.assertEqual(self.powershell_texts(command), [(note.title, note.body, "", "")])

    def test_powershell_shows_a_pass_at_once(self):
        # its start takes a second or two
        notifier = notify.Notifier("Windows", "powershell", "powershell.exe")
        [command] = self.commands(notifier, self.NOTE, notify.Notification("b", "c"))
        self.assertEqual(self.powershell_texts(command),
                         [(self.NOTE.title, self.NOTE.body, "", ""), ("b", "c", "", "")])

    def wsl_notifier(self):
        """PowerShell from WSL, with its interop sockets under tmp."""
        return notify.Notifier("WSL", "powershell", "powershell.exe", wsl=True, cwd="/mnt/c",
                               interop_dir=str(self.tmp / "WSL"))

    def test_wsl_runs_powershell_from_the_c_drive(self):
        [command] = self.commands(self.wsl_notifier())
        self.assertEqual(command.cwd, "/mnt/c")

    def test_wsl_keeps_a_live_interop_socket(self):
        socket = touch(self.tmp / "WSL" / "40707_interop")
        [command] = self.commands(self.wsl_notifier(), environ={"WSL_INTEROP": str(socket)})
        self.assertEqual(command.environment, ())

    def test_wsl_replaces_the_interop_socket_of_a_closed_terminal(self):
        # make start detaches the dashboard: the terminal it started from may be gone
        init = touch(self.tmp / "WSL" / "1_interop")
        touch(self.tmp / "WSL" / "40707_interop")
        [command] = self.commands(self.wsl_notifier(), environ={"WSL_INTEROP": str(self.tmp / "WSL" / "9_interop")})
        self.assertEqual(command.environment, (("WSL_INTEROP", str(init)),))

    def test_without_init_s_socket_wsl_takes_the_newest(self):
        older = touch(self.tmp / "WSL" / "2_interop")
        newer = touch(self.tmp / "WSL" / "40707_interop")
        os.utime(older, (1000, 1000))
        [command] = self.commands(self.wsl_notifier())
        self.assertEqual(command.environment, (("WSL_INTEROP", str(newer)),))

    def test_notify_send_gets_the_bus_it_was_detected_with(self):
        notifier = notify.Notifier("notify-send", "notify-send", "notify-send",
                                   environment=(("DBUS_SESSION_BUS_ADDRESS", "unix:path=/run/user/1000/bus"),))
        [command] = self.commands(notifier)
        self.assertEqual(command.environment, (("DBUS_SESSION_BUS_ADDRESS", "unix:path=/run/user/1000/bus"),))


class RunCommandTest(unittest.TestCase):
    def test_a_program_that_fails_raises_with_its_name_and_code(self):
        with mock.patch.object(notify.subprocess, "run", return_value=mock.Mock(returncode=3)):
            with self.assertRaisesRegex(notify.NotifyError, "notify-send exited with 3"):
                notify.run_command(notify.Command(("/usr/bin/notify-send", "a")))

    def test_a_program_that_cannot_start_raises(self):
        with mock.patch.object(notify.subprocess, "run", side_effect=FileNotFoundError("gone")):
            with self.assertRaisesRegex(notify.NotifyError, "gone"):
                notify.run_command(notify.Command(("notify-send",)))

    def test_its_environment_and_folder_are_set_and_nothing_reads_its_output(self):
        with mock.patch.object(notify.subprocess, "run", return_value=mock.Mock(returncode=0)) as run:
            notify.run_command(notify.Command(("x",), (("WSL_INTEROP", "/run/WSL/1_interop"),), "/mnt/c"))
        kwargs = run.call_args.kwargs
        self.assertEqual((kwargs["cwd"], kwargs["env"]["WSL_INTEROP"]), ("/mnt/c", "/run/WSL/1_interop"))
        self.assertEqual((kwargs["stdin"], kwargs["stdout"]), (notify.subprocess.DEVNULL, notify.subprocess.DEVNULL))
        self.assertEqual(kwargs["timeout"], notify.SEND_TIMEOUT)


class SenderTest(unittest.TestCase):
    NOTE = notify.Notification("a", "b")

    def sender(self, run, **options):
        """A Sender over a notify-send notifier with this runner, its warnings and failures collected."""
        self.warnings = []
        self.failures = []
        return notify.Sender(notify.Notifier("notify-send", "notify-send", "notify-send"), self.warnings.append,
                             run=run, on_failure=self.failures.append, **options)

    def test_notifications_go_out_in_the_background(self):
        sent = []
        sender = self.sender(sent.append)
        sender.start()
        sender.send([self.NOTE])
        sender.stop()
        self.assertEqual([command.argv[-2:] for command in sent], [("a", "b")])

    def test_the_first_failure_is_reported_once(self):
        sender = self.sender(mock.Mock(side_effect=notify.NotifyError("notify-send exited with 1")))
        sender.start()
        sender.send([self.NOTE])
        sender.send([self.NOTE])
        sender.stop()
        self.assertEqual(self.warnings, ["desktop notifications failed: notify-send exited with 1"])
        self.assertEqual(self.failures, ["notify-send exited with 1"])

    def test_a_full_queue_drops_what_comes_after(self):
        sent = []
        sender = self.sender(sent.append, limit=1)
        sender.send([self.NOTE])
        sender.send([notify.Notification("c", "d")])
        sender.start()
        sender.stop()
        self.assertEqual([command.argv[-2:] for command in sent], [("a", "b")])

    def test_a_full_queue_does_not_hold_up_the_stop(self):
        # a notifier may take its whole timeout
        running = threading.Event()
        release = threading.Event()

        def run(command):
            """A notifier that takes until the test lets it go."""
            running.set()
            release.wait(5)

        sender = self.sender(run, limit=1)
        sender.start()
        sender.send([self.NOTE])
        self.assertTrue(running.wait(5))
        sender.send([self.NOTE])                 # the queue is full now
        started = time.monotonic()
        with mock.patch.object(notify, "STOP_TIMEOUT", 0.1):
            sender.stop()
        self.assertLess(time.monotonic() - started, 2)
        release.set()

    def test_deliver_sends_at_once_and_raises(self):
        # notify-test waits for it
        sender = self.sender(mock.Mock(side_effect=notify.NotifyError("no")))
        with self.assertRaises(notify.NotifyError):
            sender.deliver([self.NOTE])


# the compact states' cases: the gauge's fields, and the states the live card's trash compactor shows
COMPACT_CASES = [
    ({}, {"soon"}),
    ({"breakeven_calls": 30}, {"close"}),
    ({"breakeven_calls": 50}, {"unlikely"}),
    ({"breakeven_calls": None}, {"unlikely"}),
    ({"breakeven_calls": None, "breakeven_low": None}, set()),
    ({"breakeven_calls": 50, "pays_later_in": 5}, set()),
    ({"calls_ahead": None}, {"pays"}),
    ({"calls_ahead": None, "breakeven_calls": 60}, {"pays"}),
    # without calls ahead, a break-even beyond every finished stretch, or none at the median estimate (both as
    # right after a compaction), says nothing
    ({"calls_ahead": None, "breakeven_calls": 61}, set()),
    ({"calls_ahead": None, "calls_after_high": None}, set()),
    ({"calls_ahead": None, "breakeven_calls": None}, set()),
    ({"calls_ahead": None, "breakeven_calls": 100, "context": 250_000}, {"hint"}),
    ({"calls_ahead": None, "warm_until": EXPIRED, "breakeven_cold": 100}, set()),
    ({"context": 250_000}, {"soon", "hint"}),
    ({"context": 250_000, "breakeven_calls": 50, "pays_later_in": 5}, {"hint"}),
    ({"context": 250_000, "estimate": False}, {"hint"}),
    ({"estimate": False}, set()),
    ({"warm_until": EXPIRED, "cold_saving": 0.4}, {"cold"}),
    ({"warm_until": EXPIRED, "breakeven_cold": 30}, {"close"}),
    ({"warm_until": EXPIRED, "breakeven_cold": None}, set()),
    ({"context": 250_000, "compacted": "2026-09-28T11:59:00.000+00:00"}, set()),
]


class CompactStatesTest(unittest.TestCase):
    def test_each_case_has_the_states_of_the_live_cards_icon(self):
        for fields, states in COMPACT_CASES:
            with self.subTest(fields=fields):
                self.assertEqual(notify.compact_states(gauge(**fields), NOW), frozenset(states))

    def test_without_a_gauge_there_is_no_state(self):
        self.assertEqual(notify.compact_states(None, NOW), frozenset())

    @unittest.skipUnless(shutil.which("node"), "needs node")
    def test_the_states_agree_with_the_live_cards_icon(self):
        uses = ("format.ts:compact", "format.ts:whole", "format.ts:money", "drilldown.js:compactCallKind",
                "drilldown.js:payoffTone", "drilldown.js:PAYOFF_WORDS")
        for fields, states in COMPACT_CASES:
            with self.subTest(fields=fields):
                badge = run_function("figures.js", "liveCompactBadge", gauge(**fields), NOW.isoformat(), uses=uses)
                self.assertEqual(set(badge["states"]) if badge else set(), states)


class SecretAndWaitTest(unittest.TestCase):
    def test_the_secret_level_is_the_highest_from_medium_up(self):
        for counts, level in (({"high": 1, "medium": 2}, "high"), ({"medium": 1, "low": 4}, "medium"),
                              ({"low": 3, "low-medium": 1}, None), ({}, None)):
            with self.subTest(counts=counts):
                self.assertEqual(notify.secret_level(counts), level)

    def test_a_wait_is_its_kind_tool_and_start(self):
        waiting = {"kind": "question", "tool": "AskUserQuestion", "since": "2026-09-28T12:00:00.000+00:00",
                   "agent_type": None}
        self.assertEqual(notify.wait_key(waiting), ("question", "AskUserQuestion", "2026-09-28T12:00:00.000+00:00"))
        self.assertIsNone(notify.wait_key(None))


def marks(wait=None, secret=None, compact=(), stretch=None, known=True):
    """A session's marks."""
    return notify.Marks(wait, secret, frozenset(compact), stretch, known)


class MemoryTest(unittest.TestCase):
    ASKED = ("question", "AskUserQuestion", "2026-09-28T12:00:00.000+00:00")

    def setUp(self):
        self.memory = notify.Memory()

    def test_a_new_wait_is_a_change(self):
        self.assertTrue(self.memory.changes("s1", marks(self.ASKED)).wait)
        self.assertFalse(self.memory.changes("s1", marks(self.ASKED)).wait)
        self.assertTrue(self.memory.changes("s1", marks(("question", "AskUserQuestion", "later"))).wait)

    def test_a_wait_that_flickers_off_and_on_is_no_new_one(self):
        self.memory.changes("s1", marks(self.ASKED))
        self.memory.changes("s1", marks())
        self.assertFalse(self.memory.changes("s1", marks(self.ASKED)).wait)

    def test_only_a_rising_secret_level_is_a_change(self):
        self.assertTrue(self.memory.changes("s1", marks(secret="medium")).secret)
        self.assertFalse(self.memory.changes("s1", marks(secret="medium")).secret)
        self.assertTrue(self.memory.changes("s1", marks(secret="high")).secret)
        self.assertFalse(self.memory.changes("s1", marks(secret="medium")).secret)
        self.assertFalse(self.memory.changes("s1", marks()).secret)

    def test_each_compact_state_is_new_once_per_stretch(self):
        self.assertEqual(self.memory.changes("s1", marks(compact={"soon"})).compact, {"soon"})
        self.assertEqual(self.memory.changes("s1", marks(compact={"close"})).compact, {"close"})
        self.assertEqual(self.memory.changes("s1", marks(compact={"soon"})).compact, set())

    def test_passing_the_hint_is_new_beside_a_state_already_had(self):
        self.memory.changes("s1", marks(compact={"soon"}))
        self.assertEqual(self.memory.changes("s1", marks(compact={"soon", "hint"})).compact, {"hint"})

    def test_a_compaction_starts_the_states_again(self):
        self.memory.changes("s1", marks(compact={"soon"}))
        changed = self.memory.changes("s1", marks(compact={"soon"}, stretch="2026-09-28T12:05:00.000+00:00"))
        self.assertEqual(changed.compact, {"soon"})

    def test_a_session_whose_state_failed_to_load_keeps_its_marks(self):
        self.memory.changes("s1", marks(secret="medium", compact={"soon"}, stretch="c1"))
        changed = self.memory.changes("s1", marks(self.ASKED, known=False))
        self.assertEqual((changed.wait, changed.secret, changed.compact), (True, False, set()))
        self.assertEqual(self.memory.changes("s1", marks(secret="medium", compact={"soon"}, stretch="c1")).compact,
                         set())

    def test_the_oldest_sessions_are_forgotten_past_the_limit(self):
        memory = notify.Memory(limit=2)
        for session_id in ("s1", "s2", "s3"):
            memory.changes(session_id, marks(self.ASKED))
        self.assertTrue(memory.changes("s1", marks(self.ASKED)).wait)
        self.assertFalse(memory.changes("s3", marks(self.ASKED)).wait)


class TextsTest(unittest.TestCase):
    SESSION = {"session_id": "0a1b2c3d-4e5f", "title": "Parser fix", "project": "/home/dev/app",
               "waiting": None}

    def texts(self, change, session=None, state=None, current=None):
        """The notifications' (title, body) for change in session (by default SESSION)."""
        state = state or {"current": current, "secrets": {"high": 0, "medium": 0, "low-medium": 0, "low": 0}}
        return [(note.title, note.body)
                for note in notify.notifications_for(session or self.SESSION, state, change, NOW)]

    def test_a_question_plan_and_permission_say_what_claude_waits_for(self):
        cases = (({"kind": "question", "tool": "AskUserQuestion", "agent_type": None},
                  "Claude is waiting for your answer"),
                 ({"kind": "question", "tool": "ExitPlanMode", "agent_type": None},
                  "Claude is waiting for you to approve the plan"),
                 ({"kind": "permission", "tool": "Write", "agent_type": None}, "Claude asks to use Write"),
                 ({"kind": "permission", "tool": "Bash", "agent_type": "general-purpose"},
                  "Claude asks to use Bash (a general-purpose subagent)"))
        for waiting, title in cases:
            with self.subTest(waiting=waiting):
                session = {**self.SESSION, "waiting": {**waiting, "since": "2026-09-28T12:00:00.000+00:00"}}
                self.assertEqual(self.texts(notify.Change(True, False, frozenset()), session),
                                 [(title, "Parser fix · app")])

    def test_a_secret_access_says_how_far_it_got_in_counts(self):
        state = {"current": None, "secrets": {"high": 1, "medium": 2, "low-medium": 0, "low": 0}}
        self.assertEqual(self.texts(notify.Change(False, True, frozenset()), state=state),
                         [("Possible secret access: sent out", "Parser fix · app · 1 call sent out, 2 more returned "
                                                               "a result or may still")])
        state = {"current": None, "secrets": {"high": 0, "medium": 2, "low-medium": 0, "low": 0}}
        self.assertEqual(self.texts(notify.Change(False, True, frozenset()), state=state),
                         [("Possible secret access: a result returned", "Parser fix · app · 2 calls returned a "
                                                                        "result or may still")])

    def compact_title(self, states, **fields):
        """The one compact notification's title for these new states of gauge(**fields)."""
        [(title, _)] = self.texts(notify.Change(False, False, frozenset(states)), current=gauge(**fields))
        return title

    def test_each_compact_state_says_what_compacting_now_would_do(self):
        self.assertEqual(self.compact_title({"soon"}), "Soon: compacting now pays off after ~10 replies")
        self.assertEqual(self.compact_title({"close"}, breakeven_calls=30),
                         "Close: compacting now pays off after ~30 replies")
        self.assertEqual(self.compact_title({"unlikely"}, breakeven_calls=50),
                         "Likely too late: compacting now pays off after ~50 replies")
        self.assertEqual(self.compact_title({"unlikely"}, breakeven_calls=None),
                         "Compacting now would likely not pay off")
        self.assertEqual(self.compact_title({"pays"}, calls_ahead=None), "Compacting now pays off after ~10 replies")
        self.assertEqual(self.compact_title({"cold"}, warm_until=EXPIRED, cold_saving=0.4),
                         "Cache expired: compacting now saves ~$0.40")
        self.assertEqual(self.compact_title({"hint"}, context=250_000), "Past your 200K compact hint")

    def test_passing_the_hint_beside_a_new_state_is_one_notification(self):
        [(title, body)] = self.texts(notify.Change(False, False, frozenset({"soon", "hint"})),
                                     current=gauge(context=250_000))
        self.assertEqual((title, body), ("Soon: compacting now pays off after ~10 replies",
                                         "Parser fix · app · past your 200K compact hint"))

    def icons(self, change, session=None, state=None, current=None):
        """The notifications' icons for change in session (by default SESSION)."""
        state = state or {"current": current, "secrets": {"high": 1, "medium": 0, "low-medium": 0, "low": 0}}
        return [note.icon for note in notify.notifications_for(session or self.SESSION, state, change, NOW)]

    def test_each_wait_and_secret_level_has_its_icon(self):
        wait = notify.Change(True, False, frozenset())
        for kind, tool, icon in (("question", "AskUserQuestion", "waiting"), ("question", "ExitPlanMode", "waiting"),
                                 ("permission", "Write", "permission")):
            with self.subTest(tool=tool):
                session = {**self.SESSION, "waiting": {"kind": kind, "tool": tool, "since": "x", "agent_type": None}}
                self.assertEqual(self.icons(wait, session), [icon])
        secret = notify.Change(False, True, frozenset())
        self.assertEqual(self.icons(secret), ["secret-high"])
        medium = {"current": None, "secrets": {"high": 0, "medium": 1, "low-medium": 0, "low": 0}}
        self.assertEqual(self.icons(secret, state=medium), ["secret-medium"])

    def test_each_compact_state_has_the_icon_of_its_tone(self):
        # as the live card's trash compactor: cold is soon's tone, hint and pays have none
        for state, icon, fields in (("soon", "compact-soon", {}), ("cold", "compact-soon", {"cold_saving": 0.4}),
                                    ("close", "compact-close", {}), ("unlikely", "compact-unlikely", {}),
                                    ("pays", "compact", {}), ("hint", "compact", {"context": 250_000})):
            with self.subTest(state=state):
                change = notify.Change(False, False, frozenset({state}))
                self.assertEqual(self.icons(change, current=gauge(**fields)), [icon])

    def test_an_untitled_session_goes_by_its_project_then_its_id(self):
        change = notify.Change(False, False, frozenset({"soon"}))
        [(_, body)] = self.texts(change, {**self.SESSION, "title": None}, current=gauge())
        self.assertEqual(body, "app")
        [(_, body)] = self.texts(change, {**self.SESSION, "title": None, "project": None}, current=gauge())
        self.assertEqual(body, "session 0a1b2c3d")


class WatcherTest(TempDirTestCase):
    def setUp(self):
        super().setUp()
        now = datetime.now(UTC)
        self.session = self.projects.session("s1", project="/home/dev/app").at(now)
        self.session.user("Fix the parser")
        self.session.ai_title("Parser fix")
        self.session.assistant("m1", [tool_use_block("t1", "Read")], usage(output=5))
        self.session.tool_result("t1", "abc")
        self.clock = FakeClock()
        self.store = store.Store(self.store_path, check_same_thread=False)
        self.addCleanup(self.store.close)
        self.app = server.UsageApp(self.store, self.projects.root, PRICES, live_minutes=5, clock=self.clock)
        self.addCleanup(self.app.close)
        self.sent = []
        self.warnings = []
        self.watcher = notify.Watcher(self.app, mock.Mock(send=self.sent.append), self.warnings.append)

    def check(self):
        """One pass of the watcher, the scan's throttle passed."""
        self.clock.now += server.SCAN_INTERVAL
        self.watcher.check()

    def ask(self):
        """The main thread asks a question."""
        self.session.assistant("m2", [tool_use_block("q1", "AskUserQuestion", {"questions": []})], usage(output=5))

    def titles(self):
        """The titles sent so far, pass by pass."""
        return [[note.title for note in notes] for notes in self.sent]

    def test_the_first_pass_only_notes_the_states(self):
        # the dashboard's start sends no burst of what was already so
        self.ask()
        self.check()
        self.assertEqual(self.sent, [])

    def test_a_question_asked_since_is_notified_once(self):
        self.check()
        self.ask()
        self.check()
        self.check()
        self.assertEqual(self.titles(), [["Claude is waiting for your answer"]])
        self.assertEqual(self.sent[0][0].body, "Parser fix · app")

    def test_a_session_that_fails_to_load_is_reported_once_and_the_pass_goes_on(self):
        self.check()
        self.ask()
        with mock.patch.object(self.app, "session_state", side_effect=sqlite3.OperationalError("locked")):
            self.check()
            self.check()
        self.assertEqual(self.titles(), [["Claude is waiting for your answer"]])
        self.assertEqual(self.warnings, ["notifications: a session's state failed: locked"])

    def test_the_live_list_failing_skips_the_pass(self):
        with mock.patch.object(self.app, "live", side_effect=sqlite3.OperationalError("locked")):
            self.check()
        self.assertEqual(self.warnings, ["notifications: the live sessions failed: locked"])

    def test_it_runs_in_its_thread_until_stopped(self):
        watcher = notify.Watcher(self.app, mock.Mock(send=self.sent.append), self.warnings.append, interval=0.01)
        passes = threading.Event()
        with mock.patch.object(watcher, "check", side_effect=passes.set):
            watcher.start()
            self.assertTrue(passes.wait(5))
            watcher.stop()
        self.assertFalse(watcher.thread.is_alive())


class IconsTest(unittest.TestCase):
    def test_every_icon_ships_as_a_96_pixel_png(self):
        # rendered from the live cards' icons, white on their tone's color from the light theme
        for name in notify.ICON_NAMES:
            with self.subTest(name=name):
                data = (notify.ICONS_DIR / f"{name}.png").read_bytes()
                self.assertEqual(data[:8], b"\x89PNG\r\n\x1a\n")
                self.assertEqual((int.from_bytes(data[16:20], "big"), int.from_bytes(data[20:24], "big")), (96, 96))

    def test_no_icon_file_is_left_unused(self):
        self.assertEqual(sorted(path.stem for path in notify.ICONS_DIR.glob("*.png")), sorted(notify.ICON_NAMES))


class NotifyTimingTest(unittest.TestCase):
    def test_the_watcher_waits_as_long_as_the_scan_throttle(self):
        self.assertEqual(notify.WATCH_INTERVAL, server.SCAN_INTERVAL)
