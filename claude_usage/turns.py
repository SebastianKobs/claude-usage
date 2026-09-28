"""What a transcript's turns say about its context, computed per request from the stored turns and never stored:
- growth: what each step added beyond the previous call's context and output (tool results, prompts, attachments);
- cache rebuilds: calls that wrote again what the previous call had cached, with their likely cause and extra cost;
- the fixed overhead: the first call's context (system prompt, tools, CLAUDE.md), which every later call reads again;
- the gauge: where the main thread stands against the auto-compact point, and how many turns are likely left;
- compaction versus keeping: what a compaction cost once and saved per later call against the same calls carrying
  the dropped context, the call at which it paid off, and whether it did.
"""
import dataclasses
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
# The compaction call is in no transcript; Claude Code's cost records show its input side (checked 2026-09-28 on 3
# calls): it reads the last call's cache read, adds the last call's writes, its reply and its own prompt, sends the
# last COMPACT_UNCACHED_TAIL tokens as plain input and writes the rest to the 5-minute cache.
COMPACT_PROMPT_TOKENS = 1_400           # its own prompt: 684 to 1,926
COMPACT_UNCACHED_TAIL = 2_100           # 2,040 to 2,177
RATE_MEDIAN_MIN_OUTPUT = 3_000          # replies this long give the median output speed, the summary's estimate
RATE_FASTEST_MIN_OUTPUT = 1_000         # and this long the fastest one, its upper bound
VERDICTS = ("saved", "cost_more", "even", "forced", "open", "unknown")


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
    reply: int | None = None            # the previous call's output, sent again; growth leaves it out


@dataclass(frozen=True)
class Rates:
    """$ per token of one call's model and speed: its cache writes at its own 5m/1h mix (5m without writes)."""
    input: float
    write_5m: float
    write: float
    read: float
    output: float


@dataclass(frozen=True)
class Compaction:
    """A stored compaction: its time and what Claude Code's compact_boundary record says."""
    ts: datetime | None
    trigger: str | None
    pre_tokens: int | None
    post_tokens: int | None
    duration_ms: int | None


@dataclass(frozen=True)
class OutputRate:
    """A model's output speed on the main threads, in tokens per second."""
    median: float
    fastest: float


@dataclass(frozen=True)
class CallCost:
    """The compaction call's estimated cost: its input side alone (low), with the summary at the median output
    speed (cost) and at the fastest (high); None where the summary is unknown."""
    low: float
    cost: float | None
    high: float | None
    summary_tokens: int | None
    summary_high: int | None


@dataclass(frozen=True)
class VersusKeeping:
    """A compaction against keeping the context: the same later calls, each carrying the difference."""
    model: str
    before: int                         # the last call's context and reply: what the next call would have carried
    after: int                          # the next call's context
    difference: int
    saving_per_call: float              # the difference at the next call's read price
    call: CallCost
    rewrite: float                      # the next call's cache writes beyond the reply, at the write price over read
    one_time: float | None              # the call and the rewrite
    calls_after: int                    # up to the next compaction or the last call
    last_stretch: bool                  # no compaction after it
    capped_at: int | None               # the call from which the kept session would have auto-compacted
    cache_warm: bool                    # the compaction call found the cache warm
    breakeven_call: int | None          # the first call whose savings reach the one-time cost at the fastest
                                        # summary (the bound saved uses); None: never
    breakeven_at_least: bool            # without a summary estimate: reached by the input side alone, a lower bound
    net: float | None                   # saved minus the one-time cost, over the calls after
    net_low: float | None               # with the summary at the fastest speed
    net_high: float                     # with the call's input side alone
    verdict: str                        # one of VERDICTS
    rework_margin: int | None           # the re-read tokens after compacting that would cancel a proven saving
    added: int                          # the next call's context beyond its cache read: the summary, new input
    prefix_read: int                    # the next call's cache read: the system prompt and tools, still cached


@dataclass(frozen=True)
class Overhead:
    """The first call's context, and what the later calls paid to read it again."""
    tokens: int
    cost: float


def turn_rates(prices: pricing.Prices, turn: Turn) -> Rates | None:
    """The $ per token of this turn's model and speed, fast mode included, its writes at its own 5m/1h mix; None
    for a model without a price."""
    price = pricing.price_for(prices, turn.model)
    if price is None:
        return None
    scale = (price.fast_multiplier if turn.speed != pricing.STANDARD_SPEED else 1.0) / pricing.PER_TOKENS
    if turn.cache_write:
        write = ((turn.cache_write_5m * price.cache_write_5m + turn.cache_write_1h * price.cache_write_1h)
                 / turn.cache_write)
    else:
        write = price.cache_write_5m
    return Rates(input=price.input * scale, write_5m=price.cache_write_5m * scale, write=write * scale,
                 read=price.cache_read * scale, output=price.output * scale)


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


def cache_ttl(turn: Turn) -> timedelta:
    """How long what this turn wrote stays cached: 1 h if its writes are mostly 1h ones, else 5 min."""
    return CACHE_TTL_1H if turn.cache_write_1h > turn.cache_write_5m else CACHE_TTL_5M


def rebuild_cause(previous: Turn, current: Turn) -> str:
    """Why the cache was written again: model if the model changed, idle if the gap outlasted the cache's lifetime
    (cache_ttl), else prefix (something early in the context changed)."""
    if current.model != previous.model:
        return "model"
    gap = idle_gap(previous, current)
    if gap is not None and gap > cache_ttl(current):
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
    rates = turn_rates(prices, current)
    extra = None if rates is None else lost * (rates.write - rates.read)
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
        result.append(Step(current.context - previous.context - previous.output, rebuild(previous, current, prices),
                           previous.output))
    return result


def overhead(turns: list[Turn], prices: pricing.Prices) -> Overhead | None:
    """The first turn's context as the fixed overhead, and its cost carried: each later turn's cache read, up to
    that size, at the read price (unpriced turns add nothing). None without turns."""
    if not turns:
        return None
    first = turns[0].context
    cost = 0.0
    for later in turns[1:]:
        rates = turn_rates(prices, later)
        if rates is not None:
            cost += min(first, later.cache_read) * rates.read
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


def output_rates(samples: list[tuple[str, int, float]]) -> dict[str, OutputRate]:
    """Each model's output speed from (model, output tokens, seconds from request to the reply's end) samples: the
    median over replies of at least RATE_MEDIAN_MIN_OUTPUT tokens (over the others if there are none) and the fastest
    of at least RATE_FASTEST_MIN_OUTPUT. The time includes the wait for the first token, so both run low."""
    by_model: dict[str, list[tuple[int, float]]] = {}
    for model, output, seconds in samples:
        if output >= RATE_FASTEST_MIN_OUTPUT and seconds > 0:
            by_model.setdefault(model, []).append((output, output / seconds))
    rates = {}
    for model, entries in by_model.items():
        long_ones = [rate for output, rate in entries if output >= RATE_MEDIAN_MIN_OUTPUT]
        median = statistics.median(long_ones or [rate for _, rate in entries])
        rates[model] = OutputRate(median=median, fastest=max(rate for _, rate in entries))
    return rates


def compaction_input(last: Turn, rates: Rates, warm: bool) -> float:
    """The input side of a compaction call after the last call: warm, it reads the last call's cache read and writes
    the rest but the tail to the 5-minute cache; cold, it writes all but the tail."""
    uncached = last.context - last.cache_read + last.output + COMPACT_PROMPT_TOKENS
    tail = min(uncached, COMPACT_UNCACHED_TAIL)
    if warm:
        return last.cache_read * rates.read + tail * rates.input + (uncached - tail) * rates.write_5m
    return (last.cache_read + uncached - tail) * rates.write_5m + tail * rates.input


def compaction_call(last: Turn, compaction: Compaction, rate: OutputRate | None, rates: Rates,
                    warm: bool) -> CallCost:
    """The compaction call's cost, which no transcript shows. Its input side is known: warm, it reads the last
    call's cache read and writes the rest but the tail to the 5-minute cache; cold, it writes all but the tail. Its
    output, the summary, is estimated from the call's duration at the model's median and fastest output speed."""
    low = compaction_input(last, rates, warm)
    if rate is None or not compaction.duration_ms:
        return CallCost(low=low, cost=None, high=None, summary_tokens=None, summary_high=None)
    seconds = compaction.duration_ms / 1000
    summary = round(seconds * rate.median)
    summary_high = round(seconds * rate.fastest)
    return CallCost(low=low, cost=low + summary * rates.output, high=low + summary_high * rates.output,
                    summary_tokens=summary, summary_high=summary_high)


def call_saving(difference: int, rates: Rates, step: Step) -> float:
    """What a later call saved against the kept session: the difference at the read price, or at the write price
    if the call rewrote the cache anyway (the kept session would have rewritten the difference too)."""
    return difference * (rates.write if step.rebuild is not None else rates.read)


def breakeven(savings: list[float], one_time: float, per_call: float, capped: bool) -> int | None:
    """The first call whose summed savings reach the one-time cost, projected past the last call at per_call; None
    if it never does (nothing saved per call, or the kept session would have auto-compacted)."""
    total = 0.0
    for number, saving in enumerate(savings, start=1):
        total += saving
        if total >= one_time:
            return number
    if capped or per_call <= 0:
        return None
    return len(savings) + math.ceil((one_time - total) / per_call)


def verdict_of(forced: bool, net_low: float | None, net_high: float, final: bool) -> str:
    """forced if keeping couldn't go on; saved even at the fastest summary; cost_more when a finished stretch fell
    short even of the input side alone; unknown without a summary estimate; open while the last stretch hasn't paid
    off; else even (within the summary's estimate)."""
    if forced:
        return "forced"
    if net_low is not None and net_low > 0:
        return "saved"
    if final and net_high < 0:
        return "cost_more"
    if net_low is None:
        return "unknown"
    return "even" if final else "open"


def versus_keeping(turns: list[Turn], turn_steps: list[Step], compactions: tuple[Compaction, ...],
                   prices: pricing.Prices, settings: compact.CompactSettings,
                   rates: dict[str, OutputRate]) -> list[VersusKeeping | None]:
    """Each compaction against keeping the context: the same later calls, each carrying the difference between the
    last call's context and reply and the next call's context. The one-time cost is the compaction call (its
    summary estimated) and what the next call wrote beyond the reply; each later call saved the difference at the
    read price (at the write price if it rewrote the cache anyway), and a following compaction's call reads it once
    more. The kept session stops saving where it would have auto-compacted. None without a call before or after,
    or for a model without a price."""
    moments = [compaction.ts for compaction in compactions]
    results: list[VersusKeeping | None] = []
    for position, compaction in enumerate(compactions):
        results.append(None if compaction.ts is None
                       else compare_one(turns, turn_steps, compaction, moments[position + 1:], prices, settings,
                                        rates))
    return results


def compare_one(turns: list[Turn], turn_steps: list[Step], compaction: Compaction, later: list[datetime | None],
                prices: pricing.Prices, settings: compact.CompactSettings,
                rates: dict[str, OutputRate]) -> VersusKeeping | None:
    """versus_keeping for one compaction; later holds the times of the compactions after it."""
    before_index = [index for index, turn in enumerate(turns) if turn.ts is not None and turn.ts < compaction.ts]
    after_index = [index for index, turn in enumerate(turns) if turn.ts is not None and turn.ts >= compaction.ts]
    if not before_index or not after_index:
        return None
    last, first = turns[before_index[-1]], turns[after_index[0]]
    next_moment = min((moment for moment in later if moment is not None), default=None)
    stretch = [index for index in after_index if next_moment is None or turns[index].ts < next_moment]
    last_rates, first_rates = turn_rates(prices, last), turn_rates(prices, first)
    if last_rates is None or first_rates is None or not stretch:
        return None
    before = last.context + last.output
    difference = before - first.context
    rewrite = (first.cache_write - last.output) * (first_rates.write - first_rates.read)
    call_start = compaction.ts - timedelta(milliseconds=compaction.duration_ms or 0)
    last_request = last.request_ts or last.ts
    warm = last_request is None or call_start - last_request <= cache_ttl(last)
    call = compaction_call(last, compaction, rates.get(last.model), last_rates, warm)
    savings: list[float] = []
    capped_at = None
    for number, index in enumerate(stretch, start=1):
        turn = turns[index]
        turn_rate = turn_rates(prices, turn)
        if turn.context + difference >= compact.auto_compact_point(settings, turn.model):
            capped_at = number
            if number > 1 and turn_rate is not None:
                # here the kept session would have compacted itself: at least reading its context from the cache,
                # then rewriting as the actual next call did
                kept = turns[stretch[number - 2]].context + difference
                savings.append(kept * turn_rate.read + rewrite)
            break
        if turn_rate is None:
            savings.append(0.0)
        elif number == 1:
            gap = idle_gap(last, first)
            if gap is not None and gap > cache_ttl(last):
                # the kept call would have found the cache expired and written everything, the static prefix too
                savings.append(difference * first_rates.write + first.cache_read * (first_rates.write
                                                                                      - first_rates.read) + rewrite)
            else:
                savings.append(difference * first_rates.read)
        else:
            savings.append(call_saving(difference, turn_rate, turn_steps[index]))
    if next_moment is not None and capped_at is None:
        # the next compaction's call reads the difference once more
        savings[-1] += difference * (turn_rates(prices, turns[stretch[-1]]) or first_rates).read
    saved = sum(savings)
    one_time = None if call.cost is None else call.cost + rewrite
    net = None if call.cost is None else saved - call.cost - rewrite
    net_low = None if call.high is None else saved - call.high - rewrite
    net_high = saved - call.low - rewrite
    # keeping couldn't go on: at the auto-compact point already, or not even the next call would have fitted
    forced = before >= compact.auto_compact_point(settings, last.model) or capped_at == 1
    final = next_moment is not None or capped_at is not None
    per_call = difference * first_rates.read
    # the break-even at the bound saved uses; without a summary estimate at the input side, a lower bound
    target = (call.low if call.high is None else call.high) + rewrite
    per_token = first_rates.write + first_rates.read * (len(savings) - 1)
    margin = None
    if net_low is not None and net_low > 0 and per_token > 0:
        margin = math.floor(net_low / per_token)
    return VersusKeeping(
        model=last.model, before=before, after=first.context, difference=difference, saving_per_call=per_call,
        call=call, rewrite=rewrite, one_time=one_time, calls_after=len(stretch), last_stretch=next_moment is None,
        capped_at=capped_at, cache_warm=warm,
        breakeven_call=breakeven(savings, target, per_call, capped_at is not None),
        breakeven_at_least=call.high is None,
        net=net, net_low=net_low, net_high=net_high, verdict=verdict_of(forced, net_low, net_high, final),
        rework_margin=margin, added=first.context - first.cache_read, prefix_read=first.cache_read)


def cache_writer(turns: list[Turn]) -> Turn:
    """The latest turn that wrote to the cache (its lifetime and write price stand for the session's), else the
    last one."""
    return next((turn for turn in reversed(turns) if turn.cache_write), turns[-1])


def compact_preview(turns: list[Turn], past: list[VersusKeeping | None],
                    prices: pricing.Prices) -> dict[str, Any] | None:
    """What compacting after the last turn would cost and when it would pay off. Exact: what each call reads again
    (the last context and reply), until when the cache stays warm (the last request plus the lifetime of the latest
    writes; other requests may refresh it), and what keeping costs across a break past that (rewriting it all).
    Estimated from past compactions (preview_estimate, None without one that estimated a summary). None without
    turns or a price."""
    if not turns:
        return None
    last = turns[-1]
    writer = cache_writer(turns)
    rates = turn_rates(prices, last)
    writer_rates = turn_rates(prices, writer) if writer.model == last.model else rates
    if rates is None or writer_rates is None:
        return None
    rates = dataclasses.replace(rates, write=writer_rates.write)
    before = last.context + last.output
    start = last.request_ts or last.ts
    known = [item for item in past if item is not None]
    return {"before": before, "reread_cost": before * rates.read,
            "cache_ttl_minutes": round(cache_ttl(writer).total_seconds() / 60),
            "cache_warm_until": None if start is None
            else (start + cache_ttl(writer)).isoformat(timespec="milliseconds"),
            "keep_across_break": before * (rates.write - rates.read), "stored_compactions": len(known),
            "estimate": preview_estimate(last, known, rates)}


def preview_estimate(last: Turn, past: list[VersusKeeping], rates: Rates) -> dict[str, Any] | None:
    """compact_preview's estimates from past comparisons: the context after (the median cached prefix plus what
    past compactions added beyond it, the next call's rewrite never below nothing), the summary (the same model's
    median), the one-time cost, the calls to break even with a range, the calls that followed finished stretches,
    what compacting right before a break past the cache's lifetime saves at the fastest summary, and the same once
    the cache has expired (compacting cold against keeping's rewrite of everything). None without a past summary."""
    same_model = [item for item in past if item.model == last.model and item.call.summary_tokens is not None]
    timed = same_model or [item for item in past if item.call.summary_tokens is not None]
    if not timed:
        return None
    before = last.context + last.output
    prefix = statistics.median(item.prefix_read for item in past)
    added = [item.added for item in past]
    summaries = [item.call.summary_tokens for item in timed]
    warm_input = compaction_input(last, rates, warm=True)

    def horizon(add: float, summary: float) -> tuple[float, int | None]:
        """The one-time cost and the calls to break even when compacting adds this much and summarises so long."""
        one_time = warm_input + summary * rates.output + max(0.0, add - last.output) * (rates.write - rates.read)
        saving = (before - prefix - add) * rates.read
        return one_time, math.ceil(one_time / saving) if saving > 0 else None

    add = statistics.mean(added)
    summary = statistics.median(summaries)
    one_time, calls = horizon(add, summary)
    difference = before - prefix - add
    summary_high = max(item.call.summary_high for item in timed)
    break_saving = difference * rates.write - (warm_input + summary_high * rates.output)
    cold_saving = difference * rates.write - (compaction_input(last, rates, warm=False) + summary * rates.output)
    per_call = difference * rates.read
    if cold_saving >= 0:
        cold_calls = 1
    else:
        cold_calls = 1 + math.ceil(-cold_saving / per_call) if per_call > 0 else None
    finished = [item.calls_after for item in past if not item.last_stretch]
    return {"compactions": len(past), "after": round(prefix + add), "after_low": round(prefix + min(added)),
            "after_high": round(prefix + max(added)), "summary_tokens": round(summary), "one_time": one_time,
            "breakeven_calls": calls, "breakeven_low": horizon(min(added), min(summaries))[1],
            "breakeven_high": horizon(max(added), max(summaries))[1],
            "before_break": break_saving if break_saving > 0 and difference > 0 else None,
            "cold_saving": cold_saving, "breakeven_cold": cold_calls if difference > 0 else None,
            "calls_after_low": min(finished, default=None), "calls_after_high": max(finished, default=None)}
