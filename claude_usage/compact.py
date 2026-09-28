"""Compact hints for the conversation view, computed per chat request and never stored.

Anthropic publishes no "normal" context size, only that quality degrades as the context fills, so the soft hint's
threshold ([chat] compact_hint_tokens) is a heuristic. The hard number is where Claude Code auto-compacts
([auto_compact], by model prefix).
"""
import math
from dataclasses import dataclass
from typing import Any

from claude_usage import config
from claude_usage import pricing


@dataclass(frozen=True)
class CompactSettings:
    """When the conversation hints at compacting ([chat] and [auto_compact] in the config)."""
    hint_tokens: int                    # the soft hint: a heuristic threshold, not an Anthropic number
    warn_share: float                   # the stronger warning from this share of the auto-compact point on
    auto_compact: dict[str, int]        # where Claude Code auto-compacts, by model id prefix, and "default"
    reminder_step: float = 0.5          # a soft reminder at each further this share of hint_tokens
    auto_reminder_step: float = 0.05    # an auto reminder at each further this share of the auto-compact point



# about 967K on models with a native 1M window, 200K on 200K windows (code.claude.com/docs/en/model-config)
DEFAULT_COMPACT = CompactSettings(hint_tokens=200_000, warn_share=0.8, auto_compact={"default": 967_000})



def positive_number(owner: str, value: Any, whole: bool) -> float:
    """value as a positive finite number (a whole one if whole); raises ConfigError naming owner otherwise."""
    kinds = (int,) if whole else (int, float)
    if isinstance(value, bool) or not isinstance(value, kinds) or not math.isfinite(value) or value <= 0:
        raise config.ConfigError(f"{owner}: expected a positive {'whole ' if whole else ''}number, got {value!r}")
    return value



def parse_compact_settings(values: dict[str, Any]) -> CompactSettings:
    """The compact settings of the config's [chat] and [auto_compact] tables, missing values from
    DEFAULT_COMPACT; raises ConfigError for a value that isn't a positive number (a share at most 1)."""
    for table in ("chat", "auto_compact"):
        if not isinstance(values.get(table, {}), dict):
            raise config.ConfigError(f"{table}: expected a table, got {values[table]!r}")
    chat = values.get("chat") or {}
    hint = positive_number("chat.compact_hint_tokens", chat.get("compact_hint_tokens", DEFAULT_COMPACT.hint_tokens),
                           whole=True)
    share = positive_number("chat.auto_compact_warn_share",
                            chat.get("auto_compact_warn_share", DEFAULT_COMPACT.warn_share), whole=False)
    if share > 1:
        raise config.ConfigError(f"chat.auto_compact_warn_share: expected a share up to 1, got {share!r}")
    step = positive_number("chat.compact_reminder_step",
                           chat.get("compact_reminder_step", DEFAULT_COMPACT.reminder_step), whole=False)
    auto_step = positive_number("chat.auto_compact_reminder_step",
                                chat.get("auto_compact_reminder_step", DEFAULT_COMPACT.auto_reminder_step),
                                whole=False)
    if auto_step > 1:
        raise config.ConfigError(f"chat.auto_compact_reminder_step: expected a share up to 1, got {auto_step!r}")
    points = {**DEFAULT_COMPACT.auto_compact}
    for model, point in (values.get("auto_compact") or {}).items():
        points[model] = int(positive_number(f"auto_compact.{model}", point, whole=True))
    return CompactSettings(int(hint), float(share), points, float(step), float(auto_step))



def auto_compact_point(settings: CompactSettings, model: str) -> int:
    """Where Claude Code auto-compacts a conversation with this model: the longest prefix's, else the default."""
    by_model = {prefix: point for prefix, point in settings.auto_compact.items() if prefix != "default"}
    return pricing.longest_prefix(by_model, model) or settings.auto_compact["default"]



def next_milestone(ratio: float, start: float, step: float) -> float:
    """The first of start, start + step, start + 2 step, ... above ratio: where the next reminder is due."""
    # the small tolerance keeps a ratio that lands exactly on a milestone from being taken for one below it
    return start + (math.floor((ratio - start) / step + 1e-9) + 1) * step



def compact_hints(entries: list[dict[str, Any]], settings: CompactSettings) -> None:
    """Set compact_hint on the conversation entries, per stretch between compactions, in three tiers:
    - soft: "soft" where a call's context first reaches hint_tokens (with what re-reading it cost), then a
      "soft_reminder" at each further reminder_step of hint_tokens (1.5x, 2x, ... by default);
    - pays: "pays" where compacting after a call first likely pays off (its usage carries compact_pays, the
      estimate), then a "pays_reminder" at each further reminder_step of the context it first fired at, while it
      still likely pays;
    - auto: "auto" where it first reaches warn_share of the model's auto-compact point, then an "auto_reminder"
      at each further auto_reminder_step of that point (85 %, 90 %, ... by default).
    A call gets at most one hint, the highest milestone it passed; once a stronger tier has spoken the weaker ones
    are quiet, so it takes over."""
    soft_next: float | None = None      # the next soft milestone, as a multiple of hint_tokens; None: not yet shown
    pays_at: int | None = None          # the context the pays warning fired at; None: not yet shown
    pays_next: float | None = None      # the next pays milestone, as a multiple of pays_at
    auto_next: float | None = None      # the next auto milestone, as a share of the auto-compact point
    for entry in entries:
        if entry.get("kind") == "compaction":
            soft_next = None
            pays_at = None
            pays_next = None
            auto_next = None
            continue
        usage = entry.get("usage")
        if not usage:
            continue
        context = usage["context"]
        point = auto_compact_point(settings, usage["model"])
        share = context / point
        times = context / settings.hint_tokens
        pays = usage.get("compact_pays")
        if auto_next is None and share >= settings.warn_share:
            entry["compact_hint"] = {"kind": "auto", "context": context, "auto_compact": point,
                                     "share": round(share, 2)}
            auto_next = next_milestone(share, settings.warn_share, settings.auto_reminder_step)
        elif auto_next is not None:
            if share >= auto_next - 1e-9:
                entry["compact_hint"] = {"kind": "auto_reminder", "context": context, "auto_compact": point,
                                         "share": round(share, 2)}
                auto_next = next_milestone(share, settings.warn_share, settings.auto_reminder_step)
        elif pays_at is None and pays is not None:
            entry["compact_hint"] = {"kind": "pays", "context": context, "pays_off_in": pays["breakeven_calls"],
                                     "calls_ahead": round(pays["calls_ahead"]), "ahead_from": pays["ahead_from"],
                                     "one_time": pays["one_time"], "after": pays["after"]}
            pays_at = context
            pays_next = next_milestone(1.0, 1.0, settings.reminder_step)
        elif pays_at is not None:
            if pays is not None and context / pays_at >= pays_next - 1e-9:
                entry["compact_hint"] = {"kind": "pays_reminder", "context": context,
                                         "pays_off_in": pays["breakeven_calls"]}
                pays_next = next_milestone(context / pays_at, 1.0, settings.reminder_step)
        elif soft_next is None and times >= 1:
            entry["compact_hint"] = {"kind": "soft", "context": context, "threshold": settings.hint_tokens,
                                     "reread_cost": usage["cost_parts"]["cache_read"]}
            soft_next = next_milestone(times, 1.0, settings.reminder_step)
        elif soft_next is not None and times >= soft_next - 1e-9:
            entry["compact_hint"] = {"kind": "soft_reminder", "context": context, "threshold": settings.hint_tokens,
                                     "times": round(times, 1)}
            soft_next = next_milestone(times, 1.0, settings.reminder_step)
