"""What a transcript's turns say about its context, computed per request from the stored turns and never stored:
- growth: what each step added beyond the previous call's context and output (tool results, prompts, attachments);
- cache rebuilds: calls that wrote again what the previous call had cached, with their likely cause and extra cost;
- the fixed overhead: the first call's context (system prompt, tools, CLAUDE.md), which every later call reads again;
- the gauge: where the main thread stands against the auto-compact point, and how many turns are likely left.
"""
import math
import statistics
from dataclasses import dataclass
from datetime import datetime
from datetime import timedelta
from typing import Any

from claude_usage import compact
from claude_usage import pricing

# below this a missed cache read is noise: short prompts may not be cached at all (a heuristic)
REBUILD_MIN_CONTEXT = 4_096
REBUILD_READ_SHARE = 0.5                # a rebuild reads less than this share of the previous context from the cache
CACHE_TTL_5M = timedelta(minutes=5)
CACHE_TTL_1H = timedelta(hours=1)
GAUGE_STEPS = 10                        # the gauge's mean growth covers this many of the latest steps


@dataclass(frozen=True)
class Turn:
    """One API call of a transcript, as stored: its tokens by part, model and times."""
    message_id: str
    ts: datetime | None                 # of its first record
    model: str
    speed: str
    new_input: int
    cache_write_5m: int
    cache_write_1h: int
    cache_read: int
    output: int
    request_ts: datetime | None         # of the last user record before it
    end_ts: datetime | None             # of its last record

    @property
    def cache_write(self) -> int:
        """Both cache writes."""
        return self.cache_write_5m + self.cache_write_1h

    @property
    def context(self) -> int:
        """New input plus cache writes and reads: the whole context the call sent."""
        return self.new_input + self.cache_write + self.cache_read


@dataclass(frozen=True)
class Rebuild:
    """A call that wrote the cache again instead of reading it."""
    cause: str                          # model (the model changed), idle (the cache expired) or prefix (it changed)
    lost: int                           # tokens written again that the previous call had in its context
    extra_cost: float | None            # those tokens at the write price minus at the read price; None unpriced


@dataclass(frozen=True)
class Step:
    """What one turn added to the context, and whether it rebuilt the cache."""
    growth: int | None                  # None for the first turn and the first after a compaction
    rebuild: Rebuild | None


@dataclass(frozen=True)
class Overhead:
    """The first call's context, and what the later calls paid to read it again."""
    tokens: int
    cost: float


def unit_rates(prices: pricing.Prices, turn: Turn) -> tuple[float, float] | None:
    """The $ per token of this turn's cache writes (its 5m/1h mix, 5m without writes) and of a cache read, fast
    mode included; None for a model without a price."""
    price = pricing.price_for(prices, turn.model)
    if price is None:
        return None
    multiplier = price.fast_multiplier if turn.speed != pricing.STANDARD_SPEED else 1.0
    if turn.cache_write:
        write = ((turn.cache_write_5m * price.cache_write_5m + turn.cache_write_1h * price.cache_write_1h)
                 / turn.cache_write)
    else:
        write = price.cache_write_5m
    return write * multiplier / pricing.PER_TOKENS, price.cache_read * multiplier / pricing.PER_TOKENS


def compacted_between(compactions: tuple[datetime, ...], previous: Turn, current: Turn) -> bool:
    """True if a compaction falls after the previous turn and up to the current one."""
    if previous.ts is None or current.ts is None:
        return False
    return any(previous.ts < moment <= current.ts for moment in compactions)


def idle_gap(previous: Turn, current: Turn) -> timedelta | None:
    """The time from the end of the previous reply to the current request; None if a time is missing."""
    start = previous.end_ts or previous.ts
    end = current.request_ts or current.ts
    if start is None or end is None:
        return None
    return end - start


def rebuild_cause(previous: Turn, current: Turn) -> str:
    """Why the cache was written again: model if the model changed, idle if the gap outlasted the cache's lifetime
    (1 h if the writes are mostly 1h ones, else 5 min), else prefix (something early in the context changed)."""
    if current.model != previous.model:
        return "model"
    lifetime = CACHE_TTL_1H if current.cache_write_1h > current.cache_write_5m else CACHE_TTL_5M
    gap = idle_gap(previous, current)
    if gap is not None and gap > lifetime:
        return "idle"
    return "prefix"


def rebuild(previous: Turn, current: Turn, prices: pricing.Prices) -> Rebuild | None:
    """The rebuild of the current turn, or None: it is one if the previous context was big enough to be cached and
    the current call read less than half of it from the cache while writing some of it again."""
    if previous.context < REBUILD_MIN_CONTEXT or current.cache_read >= previous.context * REBUILD_READ_SHARE:
        return None
    lost = min(previous.context - current.cache_read, current.cache_write)
    if lost <= 0:
        return None
    rates = unit_rates(prices, current)
    extra = None if rates is None else lost * (rates[0] - rates[1])
    return Rebuild(rebuild_cause(previous, current), lost, extra)


def steps(turns: list[Turn], compactions: tuple[datetime, ...], prices: pricing.Prices) -> list[Step]:
    """One Step per turn, in order. Growth is the context minus the previous context and output; it may be negative
    (thinking dropped, context edited). The first turn and the first after a compaction have neither growth nor a
    rebuild."""
    result = []
    for index, current in enumerate(turns):
        previous = turns[index - 1] if index else None
        if previous is None or compacted_between(compactions, previous, current):
            result.append(Step(None, None))
            continue
        result.append(Step(current.context - previous.context - previous.output, rebuild(previous, current, prices)))
    return result


def overhead(turns: list[Turn], prices: pricing.Prices) -> Overhead | None:
    """The first turn's context as the fixed overhead, and its cost carried: each later turn's cache read, up to
    that size, at the read price (unpriced turns add nothing). None without turns."""
    if not turns:
        return None
    first = turns[0].context
    cost = 0.0
    for later in turns[1:]:
        rates = unit_rates(prices, later)
        if rates is not None:
            cost += min(first, later.cache_read) * rates[1]
    return Overhead(first, cost)


def gauge(turns: list[Turn], turn_steps: list[Step], compactions: tuple[datetime, ...],
          settings: compact.CompactSettings) -> dict[str, Any] | None:
    """Where the last turn's context stands: against the model's auto-compact point and the soft hint, the turns
    since the last compaction, the mean growth and context step over the last GAUGE_STEPS steps since then, and
    the turns left until auto-compact at that pace (None if it doesn't grow). None without turns."""
    if not turns:
        return None
    last = turns[-1]
    point = compact.auto_compact_point(settings, last.model)
    # the stretch since the last compaction starts at the latest step without growth
    start = max(index for index, step in enumerate(turn_steps) if step.growth is None)
    recent = range(max(start + 1, len(turns) - GAUGE_STEPS), len(turns))
    growths = [turn_steps[index].growth for index in recent]
    context_steps = [turns[index].context - turns[index - 1].context for index in recent]
    mean_step = round(statistics.mean(context_steps)) if context_steps else None
    headroom = point - last.context
    turns_left = math.floor(headroom / mean_step) if mean_step and mean_step > 0 and headroom > 0 else None
    past = [moment for moment in compactions if last.ts is None or moment <= last.ts]
    return {"context": last.context, "model": last.model, "auto_compact": point,
            "hint_tokens": settings.hint_tokens, "share": round(last.context / point, 2), "headroom": headroom,
            "turns_since_compaction": len(turns) - start,
            "last_compaction": max(past).isoformat(timespec="milliseconds") if past else None,
            "mean_growth": round(statistics.mean(growths)) if growths else None, "mean_step": mean_step,
            "turns_left": turns_left}
