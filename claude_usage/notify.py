"""Desktop notifications when a live session's state changes: Claude asks something (a question, a plan to approve,
a permission prompt), a possible secret access rises to a higher level, or compacting now reaches a new state, the
states the live cards show as icons. serve's Watcher looks every WATCH_INTERVAL, also while no page is open, and a
Sender hands the notifications to the system's own notifier, found by detect():

- macOS: osascript's display notification;
- Windows, and WSL with interop on: a toast from Windows PowerShell 5.1 (pwsh 7 can't load its WinRT types so), as
  claude-usage's own app (APP_ID, registered for the user);
- Linux, and WSL without interop: notify-send on the user's session bus;
- or [notify] command, whose words get the texts in place of {title} and {body}, and the icon's file for {icon}.

Each notification has its kind's icon (icons/), in the live cards' colors.

The first pass after a start only notes the states, so a start sends no burst. A wait notifies once, a secret level
only as it rises, and each compact state once per stretch between compactions (Soon and Close may take turns as the
estimate moves). The texts hold titles, tool names and counts, never a prompt or a path: the system keeps them in its
notification history.
"""
import base64
import collections
import concurrent.futures
import functools
import hashlib
import os
import platform as platform_module
import queue
import re
import shutil
import sqlite3
import subprocess
import sys
import threading
import traceback
from collections.abc import Callable
from collections.abc import Mapping
from collections.abc import Sequence
from dataclasses import dataclass
from dataclasses import replace
from datetime import UTC
from datetime import datetime
from pathlib import Path
from typing import Any
from typing import Protocol

from claude_usage import config
from claude_usage import readers

WATCH_INTERVAL = 5.0                    # seconds between the watcher's passes, as the scan's throttle
SEND_TIMEOUT = 20                       # seconds a notifier may take; PowerShell starts in one or two
QUEUE_LIMIT = 20                        # passes waiting to be sent; more are dropped
MEMORY_LIMIT = 1000                     # sessions whose notified states are kept
STOP_TIMEOUT = 5                        # seconds stop() waits for a thread
APP_NAME = "claude-usage"
# the toasts' own app id, registered for the user (no admin) with APP_NAME and the app icon, so Windows names them and
# lists them in its notification settings; PowerShell's, which comes with Windows, where that fails
APP_ID = "ClaudeUsage.Dashboard"
POWERSHELL_APP_ID = "{1AC14E77-02E7-4E5D-B744-2EB1AE5198B7}\\WindowsPowerShell\\v1.0\\powershell.exe"
# the icons beside the texts: the live cards' icons, white on their tone's color from the light theme, 96 px,
# rendered once in a browser from LIVE_ICONS (figures.js); app is the app's own
ICONS_DIR = Path(__file__).resolve().parent / "icons"
APP_ICON = "app"
ICON_NAMES = (APP_ICON, "waiting", "permission", "secret-medium", "secret-high", "compact-soon", "compact-close",
              "compact-unlikely", "compact")
# a compact state's icon, by the trash compactor's tone: cold is soon's, hint and pays have none
COMPACT_ICONS = {"cold": "compact-soon", "soon": "compact-soon", "close": "compact-close",
                 "unlikely": "compact-unlikely", "pays": "compact", "hint": "compact"}
WSLPATH_TIMEOUT = 5                     # seconds wslpath may take
WINDOWS_POWERSHELL = Path("Windows") / "System32" / "WindowsPowerShell" / "v1.0" / "powershell.exe"
WSL_INTEROP_MARKS = ("WSLInterop", "WSLInterop-late")
WSL_RUN_DIR = Path("run") / "WSL"
INIT_INTEROP = "1_interop"              # init's socket, which outlives the terminal the dashboard started from
BUS_VARIABLE = "DBUS_SESSION_BUS_ADDRESS"
PLACEHOLDER = re.compile(r"\{(title|body|icon)\}")
# the secret levels from medium up, as the live card's black hat shows them
SECRET_LEVELS = {None: 0, "medium": 1, "high": 2}
# the compact state a notification is titled by where several are new at once, the most pressing first
COMPACT_ORDER = ("cold", "soon", "close", "pays", "unlikely", "hint")
PAYOFF_WORDS = {"soon": "Soon", "close": "Close", "unlikely": "Likely too late"}
# what a pass may meet and goes on after: a locked store, a reader process that died or was closed
WATCH_ERRORS = (sqlite3.Error, OSError, RuntimeError, concurrent.futures.BrokenExecutor)


class NotifyError(Exception):
    """No notifier could be found, or one failed; the message says why."""


@dataclass(frozen=True)
class NotifySettings:
    """The [notify] settings: whether serve notifies, and the command to run instead of the system's notifier."""
    enabled: bool
    command: tuple[str, ...]


def parse_notify(values: Mapping[str, Any]) -> NotifySettings:
    """The config's [notify] settings, on without the table. Raises ConfigError naming the key for a bad value."""
    table = values.get("notify") or {}
    if not isinstance(table, dict):
        raise config.ConfigError(f"notify: expected a table, got {table!r}")
    enabled = table.get("enabled", True)
    if not isinstance(enabled, bool):
        raise config.ConfigError(f"notify.enabled: expected true or false, got {enabled!r}")
    command = table.get("command", [])
    if not isinstance(command, list) or not all(isinstance(word, str) and word for word in command):
        raise config.ConfigError(f"notify.command: expected a list of non-empty strings, got {command!r}")
    return NotifySettings(enabled, tuple(command))


@dataclass(frozen=True)
class Notification:
    """What a notification says, and the name of its icon (ICON_NAMES), if any."""
    title: str
    body: str
    icon: str | None = None


def icon_path(name: str) -> Path:
    """An icon's file in the package."""
    return ICONS_DIR / f"{name}.png"


@functools.cache
def icon_file(name: str) -> str:
    """An icon's file name on the Windows side, carrying its content's hash: a changed icon is copied anew."""
    digest = hashlib.sha256(icon_path(name).read_bytes()).hexdigest()[:10]
    return f"{name}-{digest}.png"


@dataclass(frozen=True)
class Command:
    """A program to run, with the variables set on top of the server's environment and the folder it runs in."""
    argv: tuple[str, ...]
    environment: tuple[tuple[str, str], ...] = ()
    cwd: str | None = None


@dataclass(frozen=True)
class Environment:
    """What detect() looks at: the platform, the kernel's release, the variables, a program finder, the mount table,
    the folder /proc and /run are under, the user id, and how Windows sees a WSL path (None where it can't)."""
    platform: str
    release: str
    environ: Mapping[str, str]
    which: Callable[[str], str | None]
    mounts: str
    root: Path
    uid: int | None
    windows_path: Callable[[str], str | None]

    @classmethod
    def current(cls) -> "Environment":
        """This process's environment."""
        return cls(sys.platform, platform_module.release(), os.environ, shutil.which, readers.read_mounts(),
                   Path("/"), os.getuid() if hasattr(os, "getuid") else None, wsl_windows_path)


def wsl_windows_path(path: str) -> str | None:
    """A WSL path as Windows sees it (wslpath -w: \\\\wsl.localhost\\<distro>\\…), None where that fails."""
    try:
        completed = subprocess.run(["wslpath", "-w", path], capture_output=True, text=True, timeout=WSLPATH_TIMEOUT,
                                   check=False)
    except (OSError, subprocess.SubprocessError):
        return None
    return completed.stdout.strip() or None if completed.returncode == 0 else None


@dataclass(frozen=True)
class Notifier:
    """How notifications are shown: the method in words, its kind (command, osascript, powershell, notify-send), the
    program, a command's words, the variables to set, the folder to run in, for WSL the folder of its interop
    sockets, one of which is picked per send, and for PowerShell the icons' folder as Windows sees it (None: no
    icons)."""
    method: str
    kind: str
    program: str
    arguments: tuple[str, ...] = ()
    environment: tuple[tuple[str, str], ...] = ()
    cwd: str | None = None
    wsl: bool = False
    interop_dir: str | None = None
    icon_dir: str | None = None

    def commands(self, notifications: Sequence[Notification], environ: Mapping[str, str]) -> list[Command]:
        """The commands that show these notifications: one PowerShell run for all of them (it takes a second or two
        to start), else one each. environ is the server's environment, whose WSL interop socket may be gone."""
        environment = self.environment
        if self.interop_dir is not None:
            socket = interop_socket(environ, Path(self.interop_dir))
            if socket is not None:
                environment = (*environment, ("WSL_INTEROP", socket))
        if self.kind == "powershell":
            return [Command(powershell_argv(self.program, notifications, self.icon_dir), environment, self.cwd)]
        return [Command(self.argv(notification), environment, self.cwd) for notification in notifications]

    def argv(self, notification: Notification) -> tuple[str, ...]:
        """The words that show one notification, for every kind but PowerShell's."""
        icon = str(icon_path(notification.icon)) if notification.icon else ""
        if self.kind == "command":
            texts = {"title": notification.title, "body": notification.body, "icon": icon}
            return tuple(PLACEHOLDER.sub(lambda match: texts[match.group(1)], word) for word in self.arguments)
        if self.kind == "osascript":
            # a text starting with - would be read as an option
            texts = [f" {text}" if text.startswith("-") else text for text in (notification.title, notification.body)]
            return (self.program, "-e", "on run argv", "-e",
                    "display notification (item 2 of argv) with title (item 1 of argv)", "-e", "end run", *texts)
        # notification daemons may read the body as markup
        body = notification.body.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")
        return (self.program, f"--app-name={APP_NAME}", *([f"--icon={icon}"] if icon else []), "--",
                notification.title, body)


def powershell_argv(program: str, notifications: Sequence[Notification],
                    icon_dir: str | None = None) -> tuple[str, ...]:
    """Windows PowerShell showing each notification as a toast of APP_ID, registered for the user first (PowerShell's
    own where that fails), with its icon from icon_dir (as Windows sees it), copied once to the Windows side, since a
    toast shows local images only. The texts go in as base64 of UTF-8, decoded inside: PowerShell also ends a quoted
    text at curly quotes. The script goes in as -EncodedCommand (base64 of UTF-16LE)."""
    def encoded(text: str) -> str:
        """A text as base64 of its UTF-8, quoted."""
        return "'" + base64.b64encode(text.encode("utf-8")).decode("ascii") + "'"

    def icon_words(name: str | None) -> str:
        """An icon's source and its name on the Windows side, or two empty words without one."""
        if icon_dir is None or name is None:
            return "'' ''"
        return f"{encoded(icon_dir.rstrip(chr(92)) + chr(92) + f'{name}.png')} {encoded(icon_file(name))}"

    toasts = "\n".join(f"Show-Toast {encoded(notification.title)} {encoded(notification.body)} "
                       f"{icon_words(notification.icon)}" for notification in notifications)
    app_icon = f"Copy-Icon {icon_words(APP_ICON)}" if icon_dir is not None else "$null"
    # raw: the registry key and the icons' folder are Windows paths
    script = rf"""$ErrorActionPreference = 'Stop'
$ProgressPreference = 'SilentlyContinue'
[Windows.UI.Notifications.ToastNotificationManager, Windows.UI.Notifications, ContentType = WindowsRuntime] > $null
[Windows.Data.Xml.Dom.XmlDocument, Windows.Data.Xml.Dom.XmlDocument, ContentType = WindowsRuntime] > $null
function Decode($text) {{ [Text.Encoding]::UTF8.GetString([Convert]::FromBase64String($text)) }}
$icons = Join-Path $env:LOCALAPPDATA '{APP_NAME}\icons'
function Copy-Icon($source, $name) {{
  if (-not $source) {{ return $null }}
  try {{
    $target = Join-Path $icons (Decode $name)
    if (-not (Test-Path -LiteralPath $target)) {{
      New-Item -ItemType Directory -Force -Path $icons > $null
      Copy-Item -LiteralPath (Decode $source) -Destination $target
    }}
    return $target
  }} catch {{ return $null }}
}}
$appIcon = {app_icon}
$appId = '{POWERSHELL_APP_ID}'
try {{
  $key = 'HKCU:\Software\Classes\AppUserModelId\{APP_ID}'
  if (-not (Test-Path -LiteralPath $key)) {{ New-Item -Path $key -Force > $null }}
  Set-ItemProperty -LiteralPath $key -Name DisplayName -Value '{APP_NAME}'
  if ($appIcon) {{ Set-ItemProperty -LiteralPath $key -Name IconUri -Value $appIcon }}
  $appId = '{APP_ID}'
}} catch {{ }}
$notifier = [Windows.UI.Notifications.ToastNotificationManager]::CreateToastNotifier($appId)
function Show-Toast($title, $body, $source, $name) {{
  $xml = [Windows.Data.Xml.Dom.XmlDocument]::new()
  $xml.LoadXml('<toast><visual><binding template="ToastGeneric"/></visual></toast>')
  $binding = $xml.GetElementsByTagName('binding').Item(0)
  foreach ($text in @((Decode $title), (Decode $body))) {{
    $element = $xml.CreateElement('text')
    $element.AppendChild($xml.CreateTextNode($text)) > $null
    $binding.AppendChild($element) > $null
  }}
  $icon = Copy-Icon $source $name
  if ($icon) {{
    $image = $xml.CreateElement('image')
    $image.SetAttribute('placement', 'appLogoOverride')
    $image.SetAttribute('src', ([Uri]$icon).AbsoluteUri)
    $binding.AppendChild($image) > $null
  }}
  $notifier.Show([Windows.UI.Notifications.ToastNotification]::new($xml))
}}
{toasts}
"""
    return (program, "-NoProfile", "-NonInteractive", "-NoLogo", "-EncodedCommand",
            base64.b64encode(script.encode("utf-16-le")).decode("ascii"))


def interop_socket(environ: Mapping[str, str], run_dir: Path) -> str | None:
    """The WSL interop socket to run a Windows program with, where the server's is gone (make start detaches serve,
    and the terminal it came from may have closed): init's, else the newest; None to keep the server's."""
    own = environ.get("WSL_INTEROP")
    if own and Path(own).exists():
        return None
    init = run_dir / INIT_INTEROP
    if init.exists():
        return str(init)
    try:
        sockets = [(path.stat().st_mtime, str(path)) for path in run_dir.glob("*_interop")]
    except OSError:
        return None
    return max(sockets)[1] if sockets else None


def detect(settings: NotifySettings, environment: Environment) -> Notifier:
    """The notifier for this environment: [notify] command, else the system's own (see the module's docstring). It
    looks at paths only and runs nothing but WSL's wslpath. Raises NotifyError saying what is missing."""
    if settings.command:
        return Notifier(f"your command ({settings.command[0]})", "command", settings.command[0], settings.command)
    if environment.platform == "darwin":
        program = environment.which("osascript") or "/usr/bin/osascript"
        return Notifier("macOS notification (osascript)", "osascript", program)
    if environment.platform == "win32":
        program = environment.which("powershell.exe") or environment.which("powershell")
        if program is None:
            raise NotifyError("Windows PowerShell (powershell.exe) not found; set [notify] command")
        return Notifier("Windows toast (powershell.exe)", "powershell", program, icon_dir=str(ICONS_DIR))
    missing = []
    if "microsoft" in environment.release.lower():
        binfmt = environment.root / "proc" / "sys" / "fs" / "binfmt_misc"
        drive = windows_drive(environment.mounts)
        if not any((binfmt / mark).exists() for mark in WSL_INTEROP_MARKS):
            missing.append("WSL interop is off")
        else:
            program = environment.which("powershell.exe")
            if program is None and drive is not None and (Path(drive) / WINDOWS_POWERSHELL).exists():
                program = str(Path(drive) / WINDOWS_POWERSHELL)
            if program is not None:
                return Notifier("Windows toast via powershell.exe (WSL)", "powershell", program, cwd=drive, wsl=True,
                                interop_dir=str(environment.root / WSL_RUN_DIR),
                                icon_dir=environment.windows_path(str(ICONS_DIR)))
            missing.append("powershell.exe not found")
    program = environment.which("notify-send")
    if program is None:
        raise NotifyError("; ".join([*missing, "notify-send not found (libnotify)"]) + "; set [notify] command")
    if environment.environ.get(BUS_VARIABLE):
        return Notifier("notify-send", "notify-send", program)
    bus = user_bus(environment)
    if bus is None:
        # D-Bus would start a bus of its own, which shows nothing and still succeeds
        raise NotifyError(f"notify-send has no session bus to reach (no {BUS_VARIABLE}, no user bus socket)")
    return Notifier("notify-send", "notify-send", program, environment=((BUS_VARIABLE, f"unix:path={bus}"),))


def user_bus(environment: Environment) -> Path | None:
    """The user's session bus socket where the variable is missing (serve started from cron or over ssh): under
    $XDG_RUNTIME_DIR, else /run/user/<uid>; None without one."""
    candidates = []
    runtime = environment.environ.get("XDG_RUNTIME_DIR")
    if runtime:
        candidates.append(Path(runtime) / "bus")
    if environment.uid is not None:
        candidates.append(environment.root / "run" / "user" / str(environment.uid) / "bus")
    return next((path for path in candidates if path.exists()), None)


def windows_drive(mounts: str) -> str | None:
    """The mount point of WSL's C: drive in /proc/self/mounts, None without one."""
    for line in mounts.splitlines():
        fields = line.split()
        if len(fields) < 4:
            continue
        source = readers.MOUNT_ESCAPE.sub(lambda match: chr(int(match.group(1), 8)), fields[0])
        options = set(readers.OPTION_SEPARATORS.split(fields[3]))
        drvfs = fields[2] == "drvfs" or (fields[2] == "9p" and "aname=drvfs" in options)
        if drvfs and source.upper().startswith("C:"):
            return readers.MOUNT_ESCAPE.sub(lambda match: chr(int(match.group(1), 8)), fields[1])
    return None


def run_command(command: Command, timeout: float = SEND_TIMEOUT) -> None:
    """Run a notifier's command. Raises NotifyError where it can't start, times out or fails: by its exit code only,
    since PowerShell writes to stderr even when it succeeds."""
    environment = {**os.environ, **dict(command.environment)}
    try:
        completed = subprocess.run(command.argv, stdin=subprocess.DEVNULL, stdout=subprocess.DEVNULL,
                                   stderr=subprocess.DEVNULL, env=environment, cwd=command.cwd, timeout=timeout,
                                   creationflags=getattr(subprocess, "CREATE_NO_WINDOW", 0), check=False)
    except (OSError, subprocess.SubprocessError) as exc:
        raise NotifyError(f"{Path(command.argv[0]).name}: {exc}") from exc
    if completed.returncode != 0:
        raise NotifyError(f"{Path(command.argv[0]).name} exited with {completed.returncode}")


class Sender:
    """Hands each pass's notifications to the notifier in its own thread, so a slow one holds up nothing; a full
    queue drops a pass. The first failure is reported once (warn, and on_failure with the reason)."""

    def __init__(self, notifier: Notifier, warn: Callable[[str], None],
                 run: Callable[[Command], None] | None = None, on_failure: Callable[[str], None] | None = None,
                 limit: int = QUEUE_LIMIT) -> None:
        self.notifier = notifier
        self.warn = warn
        self.run = run if run is not None else run_command     # looked up now, so a test can replace it
        self.on_failure = on_failure
        self.queue: queue.Queue[tuple[Notification, ...] | None] = queue.Queue(maxsize=limit)
        self.thread: threading.Thread | None = None
        self.failed = False

    def start(self) -> None:
        """Start sending."""
        self.thread = threading.Thread(target=self.loop, name="notify-sender", daemon=True)
        self.thread.start()

    def send(self, notifications: Sequence[Notification]) -> None:
        """Queue one pass's notifications; dropped while the queue is full."""
        try:
            self.queue.put_nowait(tuple(notifications))
        except queue.Full:
            pass

    def deliver(self, notifications: Sequence[Notification]) -> None:
        """Show the notifications now. Raises NotifyError."""
        for command in self.notifier.commands(notifications, os.environ):
            self.run(command)

    def loop(self) -> None:
        """Send what comes until stop()."""
        while (notifications := self.queue.get()) is not None:
            try:
                self.deliver(notifications)
            except NotifyError as exc:
                if not self.failed:
                    self.failed = True
                    self.warn(f"desktop notifications failed: {exc}")
                    if self.on_failure is not None:
                        self.on_failure(str(exc))

    def stop(self) -> None:
        """Send what is queued, then stop; waits STOP_TIMEOUT at most, also behind a notifier that takes long."""
        if self.thread is None:
            return
        try:
            self.queue.put(None, timeout=STOP_TIMEOUT)
        except queue.Full:                  # a daemon thread: it goes with the process
            return
        self.thread.join(STOP_TIMEOUT)


# --- what changed --------------------------------------------------------------------------------------------

def wait_key(waiting: Mapping[str, Any] | None) -> tuple[str, str, str] | None:
    """What a session waits for (waiting in /api/live) as its kind, tool and start; None while it waits for nothing."""
    if not waiting:
        return None
    return waiting["kind"], waiting["tool"], waiting["since"]


def secret_level(secrets: Mapping[str, int]) -> str | None:
    """The level of a session's possible secret accesses from medium up, as the live card's black hat: high where one
    was sent out, medium where one returned a result or may still; None below."""
    if secrets.get("high", 0):
        return "high"
    return "medium" if secrets.get("medium", 0) else None


def payoff_tone(estimate: Mapping[str, Any], expired: bool) -> str | None:
    """The page's payoffTone (drilldown.js): soon, close, later, unlikely or None, against the replies still ahead
    on average; once the cache has expired by the cold break-even, at once being soon."""
    ahead = estimate.get("calls_ahead")
    breakeven = estimate.get("breakeven_calls")
    if expired:
        cold_saving = estimate.get("cold_saving")
        if cold_saving is not None and cold_saving >= 0:
            return "soon"
        breakeven = estimate.get("breakeven_cold")
    known = ahead is not None
    if breakeven is not None and known and breakeven <= ahead:
        return "soon" if breakeven <= ahead / 2 else "close"
    if estimate.get("pays_later_in") is not None:
        return "later"
    if breakeven is None:
        return "unlikely"
    return "unlikely" if known else None


def expired_cache(current: Mapping[str, Any], now: datetime) -> bool:
    """Whether the gauge's cache has expired by now."""
    until = current["compact_now"].get("cache_warm_until")
    return until is not None and datetime.fromisoformat(until) < now


def compact_states(current: Mapping[str, Any] | None, now: datetime) -> frozenset[str]:
    """The states of compacting now that the live card's trash compactor shows (liveCompactBadge in figures.js,
    whose states a test holds this to): hint past the compact hint; cold where the cache has expired and compacting
    saves at once; else the pay-off's tone (soon, close, unlikely), or pays where it pays off without one; nothing
    where it would pay off only once the context has grown, or never, and without calls ahead to compare with where
    it doesn't pay off within the longest finished stretch. None of them right after a compaction."""
    preview = current.get("compact_now") if current else None
    if not preview:
        return frozenset()
    hint = frozenset({"hint"}) if current["context"] >= current["hint_tokens"] else frozenset()
    estimate = preview.get("estimate")
    if not estimate:
        return hint
    expired = expired_cache(current, now)
    cold_saving = estimate.get("cold_saving")
    if expired and cold_saving is not None and cold_saving >= 0:
        return hint | {"cold"}
    tone = payoff_tone(estimate, expired)
    if tone == "later":
        return hint
    breakeven = estimate.get("breakeven_cold") if expired else estimate.get("breakeven_calls")
    # without calls ahead to compare with, only a break-even within the longest finished stretch is worth a
    # notification: right after a compaction the context is small, which puts it far off, or out of reach at the
    # median estimate
    longest = estimate.get("calls_after_high")
    if estimate.get("calls_ahead") is None and (breakeven is None or longest is None or breakeven > longest):
        return hint
    if breakeven is None:
        return hint if expired or estimate.get("breakeven_low") is None else hint | {"unlikely"}
    return hint | {tone or "pays"}


@dataclass(frozen=True)
class Marks:
    """A session's states in one pass: what it waits for, its secret level, its compact states and the stretch they
    belong to (its last compaction). known is False where its state failed to load: only the wait counts then."""
    wait: tuple[str, str, str] | None
    secret: str | None
    compact: frozenset[str]
    stretch: str | None
    known: bool = True


@dataclass(frozen=True)
class Change:
    """What is new about a session: a wait, a higher secret level, the compact states not yet had in its stretch."""
    wait: bool
    secret: bool
    compact: frozenset[str]


@dataclass(frozen=True)
class Notified:
    """What a session was last notified of: its wait, its highest secret level, its stretch and the compact states
    had in it."""
    wait: tuple[str, str, str] | None = None
    secret: str | None = None
    stretch: str | None = None
    compact: frozenset[str] = frozenset()


class Memory:
    """What each session was notified of, the limit latest only; a session that leaves the live list and comes back
    keeps what it had."""

    def __init__(self, limit: int = MEMORY_LIMIT) -> None:
        self.limit = limit
        self.sessions: collections.OrderedDict[str, Notified] = collections.OrderedDict()

    def changes(self, session_id: str, marks: Marks) -> Change:
        """What is new about the session since it was last notified, noted as notified: a wait other than the last
        one, a secret level above the highest, and the compact states not yet had in the stretch (a new one starts
        with none)."""
        before = self.sessions.pop(session_id, Notified())
        wait = marks.wait is not None and marks.wait != before.wait
        after = replace(before, wait=marks.wait if wait else before.wait)
        secret = False
        compact: frozenset[str] = frozenset()
        if marks.known:
            secret = SECRET_LEVELS[marks.secret] > SECRET_LEVELS[before.secret]
            had = before.compact if marks.stretch == before.stretch else frozenset()
            compact = marks.compact - had
            after = replace(after, secret=marks.secret if secret else before.secret, stretch=marks.stretch,
                            compact=had | marks.compact)
        self.sessions[session_id] = after
        while len(self.sessions) > self.limit:
            self.sessions.popitem(last=False)
        return Change(wait, secret, compact)


def session_marks(session: Mapping[str, Any], state: Mapping[str, Any] | None, now: datetime) -> Marks:
    """A live session's marks from its entry in /api/live and its state (/api/session/<id>/state, None where it
    failed to load)."""
    if state is None:
        return Marks(wait_key(session.get("waiting")), None, frozenset(), None, known=False)
    current = state["current"]
    return Marks(wait_key(session.get("waiting")), secret_level(state["secrets"]), compact_states(current, now),
                 current.get("last_compaction") if current else None)


# --- the texts -----------------------------------------------------------------------------------------------

def tokens(value: float) -> str:
    """A token count as the page's compact numbers: 950, 1.2K, 200K, 1.5M."""
    for size, suffix in ((1_000_000, "M"), (1000, "K")):
        if value >= size:
            scaled = value / size
            return f"{scaled:.1f}".rstrip("0").rstrip(".") + suffix if scaled < 10 else f"{round(scaled)}{suffix}"
    return str(round(value))


def money(value: float) -> str:
    """Dollars as the page shows them: two decimals below $100."""
    return f"${value:.2f}" if abs(value) < 100 else f"${value:,.0f}"


def calls(count: int) -> str:
    """A number of calls."""
    return "1 call" if count == 1 else f"{count:,} calls"


def session_name(session: Mapping[str, Any]) -> str:
    """How a notification names a session: its title and project folder, else the folder, else its id's start."""
    project = Path(session["project"]).name if session.get("project") else None
    if session.get("title"):
        return f"{session['title']} · {project}" if project else session["title"]
    return project or f"session {session['session_id'][:8]}"


def wait_title(waiting: Mapping[str, Any]) -> str:
    """What Claude waits for, as the live card's speech bubble or padlock says it."""
    if waiting["kind"] == "permission":
        agent = f" (a {waiting['agent_type']} subagent)" if waiting.get("agent_type") else ""
        return f"Claude asks to use {waiting['tool']}{agent}"
    if waiting["tool"] == "ExitPlanMode":
        return "Claude is waiting for you to approve the plan"
    return "Claude is waiting for your answer"


def secret_texts(secrets: Mapping[str, int]) -> tuple[str, str]:
    """A possible secret access as its title and its counts, as the live card's black hat says them."""
    high = secrets.get("high", 0)
    medium = secrets.get("medium", 0)
    if high:
        more = f", {medium:,} more returned a result or may still" if medium else ""
        return "Possible secret access: sent out", f"{calls(high)} sent out{more}"
    return "Possible secret access: a result returned", f"{calls(medium)} returned a result or may still"


def compact_title(state: str, current: Mapping[str, Any], now: datetime) -> str:
    """What compacting now would do in one compact state."""
    if state == "hint":
        return f"Past your {tokens(current['hint_tokens'])} compact hint"
    estimate = current["compact_now"]["estimate"]
    if state == "cold":
        return f"Cache expired: compacting now saves ~{money(estimate['cold_saving'])}"
    breakeven = estimate.get("breakeven_cold") if expired_cache(current, now) else estimate.get("breakeven_calls")
    if breakeven is None:
        return "Compacting now would likely not pay off"
    replies = f"compacting now pays off after ~{round(breakeven):,} replies"
    return f"{PAYOFF_WORDS[state]}: {replies}" if state in PAYOFF_WORDS else replies[0].upper() + replies[1:]


def notifications_for(session: Mapping[str, Any], state: Mapping[str, Any] | None, change: Change,
                      now: datetime) -> list[Notification]:
    """The notifications of what changed in a live session: its wait, its secret level, and its new compact states
    as one, titled by the most pressing (COMPACT_ORDER)."""
    name = session_name(session)
    notes = []
    if change.wait and session.get("waiting"):
        waiting = session["waiting"]
        notes.append(Notification(wait_title(waiting), name,
                                  "permission" if waiting["kind"] == "permission" else "waiting"))
    if change.secret and state is not None:
        title, counts = secret_texts(state["secrets"])
        notes.append(Notification(title, f"{name} · {counts}",
                                  "secret-high" if state["secrets"].get("high", 0) else "secret-medium"))
    if change.compact and state is not None and state["current"] is not None:
        current = state["current"]
        first = next(kind for kind in COMPACT_ORDER if kind in change.compact)
        hint = f" · past your {tokens(current['hint_tokens'])} compact hint" if (
            first != "hint" and "hint" in change.compact) else ""
        notes.append(Notification(compact_title(first, current, now), f"{name}{hint}", COMPACT_ICONS[first]))
    return notes


# --- the watcher ---------------------------------------------------------------------------------------------

class LiveSource(Protocol):
    """What the watcher asks: the live sessions and each one's state (server.UsageApp)."""

    def live(self) -> Mapping[str, Any]:
        """/api/live without a range."""

    def session_state(self, session_id: str) -> Mapping[str, Any] | None:
        """/api/session/<id>/state."""


class NotifySender(Protocol):
    """Where the watcher's notifications go (Sender)."""

    def send(self, notifications: Sequence[Notification]) -> None:
        """Queue one pass's notifications."""


def utc_now() -> datetime:
    """Now, in UTC."""
    return datetime.now(UTC)


class Watcher:
    """Looks at the live sessions every interval in its own thread and sends what changed (Memory). The first pass
    only notes the states. It never holds the app's lock itself: live() and session_state() take it. Each distinct
    error is reported once (warn), and a pass goes on after a session that failed."""

    def __init__(self, app: LiveSource, sender: NotifySender, warn: Callable[[str], None],
                 interval: float = WATCH_INTERVAL, now: Callable[[], datetime] = utc_now) -> None:
        self.app = app
        self.sender = sender
        self.warn = warn
        self.interval = interval
        self.now = now
        self.memory = Memory()
        self.baseline = True
        self.reported: set[str] = set()
        self.stopping = threading.Event()
        self.thread: threading.Thread | None = None

    def start(self) -> None:
        """Start looking, the first pass one interval from now."""
        self.thread = threading.Thread(target=self.loop, name="notify-watcher", daemon=True)
        self.thread.start()

    def loop(self) -> None:
        """A pass every interval until stop(); an unexpected error is reported with its traceback, once."""
        while not self.stopping.wait(self.interval):
            try:
                self.check()
            except Exception:              # the thread must go on: nothing else would tell that it stopped
                self.report(f"notifications: a pass failed:\n{traceback.format_exc()}")

    def check(self) -> None:
        """One pass: every live session's marks against what it was notified of, and the notifications of what
        changed, sent at once."""
        try:
            sessions = self.app.live()["sessions"]
        except WATCH_ERRORS as exc:
            self.report(f"notifications: the live sessions failed: {exc}")
            return
        now = self.now()
        notes = []
        for session in sessions:
            try:
                state = self.app.session_state(session["session_id"])
            except WATCH_ERRORS as exc:
                self.report(f"notifications: a session's state failed: {exc}")
                state = None
            change = self.memory.changes(session["session_id"], session_marks(session, state, now))
            if not self.baseline:
                notes += notifications_for(session, state, change, now)
        self.baseline = False
        if notes:
            self.sender.send(notes)

    def report(self, message: str) -> None:
        """Warn of a message once."""
        if message not in self.reported:
            self.reported.add(message)
            self.warn(message)

    def stop(self) -> None:
        """Stop after the pass under way."""
        self.stopping.set()
        if self.thread is not None:
            self.thread.join(STOP_TIMEOUT)
