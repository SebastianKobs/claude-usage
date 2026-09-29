"""Permission prompts: no transcript records Claude Code asking before a tool call, so a PermissionRequest hook posts
each prompt to the running dashboard over a Unix socket next to the store (server.open_prompt_socket), which matches
it to the call it asks about (queries.waiting_calls); with no dashboard running nothing shows it, and the hook is
ignored. Checked 2026-09-29: the hook fires as the dialog opens (0.08 s after the call is written), also in auto mode
and in the VS Code extension, and for a subagent with its agent_id; never for a call that goes through without
asking. Its input has no tool_use_id, whatever the docs say, and a subagent's transcript_path is the main thread's.
Only names, ids and times are kept, in the server's memory, never the call's input (commands, paths, a written file's
text)."""
import json
from dataclasses import dataclass
from datetime import datetime
from pathlib import Path
from typing import Any

from claude_usage import transcripts

HOOK_EVENT = "PermissionRequest"
SOCKET_FILE = "permission.sock"         # next to the store, in its private folder


@dataclass(frozen=True)
class Prompt:
    """One permission prompt, as noted when its dialog opened."""
    ts: str                             # ISO text in UTC with milliseconds, as the store writes times
    session_id: str
    agent_id: str | None                # a subagent's, None for the main thread
    tool: str                           # the display name, as the store keeps it (transcripts.display_name)
    mode: str | None                    # the permission mode: default, auto, plan, acceptEdits, ...


def socket_path(store_path: Path) -> Path:
    """The Unix socket the hook posts to: next to the store, so serve and hook-settings agree on it wherever a
    session runs."""
    return store_path.with_name(SOCKET_FILE)


def prompt_of(text: str, now: datetime) -> Prompt | None:
    """The prompt a PermissionRequest hook's input (JSON text) describes, noted at now; None for another event, text
    that isn't a JSON object, or an input without a session or a tool."""
    try:
        given: Any = json.loads(text)
    except ValueError:
        return None
    if not isinstance(given, dict) or given.get("hook_event_name") != HOOK_EVENT:
        return None
    session_id, tool, agent_id, mode = (given.get(key) for key in ("session_id", "tool_name", "agent_id",
                                                                    "permission_mode"))
    if not isinstance(session_id, str) or not session_id or not isinstance(tool, str) or not tool:
        return None
    return Prompt(ts=now.isoformat(timespec="milliseconds"), session_id=session_id,
                  agent_id=agent_id if isinstance(agent_id, str) and agent_id else None,
                  tool=transcripts.display_name(tool), mode=mode if isinstance(mode, str) else None)
