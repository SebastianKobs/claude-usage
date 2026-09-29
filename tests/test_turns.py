"""turns.py: growth per step, cache rebuilds, the fixed overhead and the current-context gauge."""
import dataclasses
import math
import unittest
from datetime import UTC
from datetime import datetime
from datetime import timedelta

from claude_usage import compact
from claude_usage import pricing
from claude_usage import turns
from helpers import MILLION
from helpers import PRICES

START = datetime(2026, 9, 1, 12, 0, tzinfo=UTC)
SONNET = "claude-sonnet-5"


def turn(index, new=0, cache_5m=0, cache_1h=0, cache_read=0, output=0, model=SONNET, speed="standard",
         seconds=None, gap=10):
    """A turn at START + index minutes (or + seconds), its request gap seconds after the previous reply ended."""
    moment = START + (timedelta(seconds=seconds) if seconds is not None else timedelta(minutes=index))
    return turns.Turn(message_id=f"m{index}", ts=moment, model=model, speed=speed, new_input=new,
                      cache_write_5m=cache_5m, cache_write_1h=cache_1h, cache_read=cache_read, output=output,
                      request_ts=moment - timedelta(seconds=1), end_ts=moment + timedelta(seconds=5))


def spaced(*specs):
    """Turns from (new, cache_5m, cache_read, output) tuples, one minute apart."""
    return [turn(index, new=new, cache_5m=write, cache_read=read, output=output)
            for index, (new, write, read, output) in enumerate(specs)]


class GrowthTest(unittest.TestCase):
    def test_the_first_turn_has_no_growth(self):
        steps = turns.steps(spaced((10, 20_000, 0, 100)), (), PRICES)
        self.assertIsNone(steps[0].growth)

    def test_growth_is_the_context_added_beyond_the_previous_output(self):
        steps = turns.steps(spaced((10, 20_000, 0, 100), (5, 1_000, 20_010, 50)), (), PRICES)
        self.assertEqual(steps[1].growth, 21_015 - 20_010 - 100)

    def test_growth_may_be_negative(self):
        steps = turns.steps(spaced((10, 20_000, 0, 5_000), (5, 0, 20_000, 50)), (), PRICES)
        self.assertEqual(steps[1].growth, 20_005 - 20_010 - 5_000)

    def test_each_step_carries_the_previous_reply(self):
        steps = turns.steps(spaced((10, 20_000, 0, 100), (5, 1_000, 20_010, 50)), (), PRICES)
        self.assertEqual([step.reply for step in steps], [None, 100])

    def test_no_reply_right_after_a_compaction(self):
        history = spaced((10, 20_000, 0, 100), (5, 3_000, 0, 50))
        steps = turns.steps(history, (START + timedelta(seconds=30),), PRICES)
        self.assertIsNone(steps[1].reply)

    def test_no_growth_right_after_a_compaction(self):
        history = spaced((10, 20_000, 0, 100), (5, 3_000, 0, 50), (5, 100, 3_000, 50))
        compacted = (START + timedelta(seconds=30),)
        steps = turns.steps(history, compacted, PRICES)
        self.assertEqual([step.growth for step in steps], [None, None, 3_105 - 3_005 - 50])


class RebuildTest(unittest.TestCase):
    def test_a_cache_read_below_half_the_previous_context_is_a_rebuild(self):
        history = spaced((10, 20_000, 0, 100), (5, 20_000, 1_000, 50))
        rebuild = turns.steps(history, (), PRICES)[1].rebuild
        self.assertEqual((rebuild.cause, rebuild.lost), ("prefix", 20_010 - 1_000))

    def test_the_lost_tokens_are_at_most_the_cache_writes(self):
        history = spaced((10, 20_000, 0, 100), (5, 4_000, 1_000, 50))
        self.assertEqual(turns.steps(history, (), PRICES)[1].rebuild.lost, 4_000)

    def test_the_extra_cost_is_the_lost_tokens_written_instead_of_read(self):
        history = spaced((10, 20_000, 0, 100), (5, 20_000, 1_000, 50))
        rebuild = turns.steps(history, (), PRICES)[1].rebuild
        self.assertAlmostEqual(rebuild.extra_cost, 19_010 * (2.5 - 0.2) / MILLION)

    def test_a_1h_write_is_priced_at_the_1h_rate(self):
        history = [turn(0, cache_1h=20_000, output=100), turn(1, cache_1h=20_000, cache_read=1_000)]
        rebuild = turns.steps(history, (), PRICES)[1].rebuild
        self.assertAlmostEqual(rebuild.extra_cost, 19_000 * (4.0 - 0.2) / MILLION)

    def test_an_unpriced_model_has_no_extra_cost(self):
        history = [turn(0, cache_5m=20_000, model="gpt-x"), turn(1, cache_5m=20_000, model="gpt-x")]
        rebuild = turns.steps(history, (), PRICES)[1].rebuild
        self.assertEqual((rebuild.lost, rebuild.extra_cost), (20_000, None))

    def test_a_cache_read_of_half_or_more_is_no_rebuild(self):
        history = spaced((10, 20_000, 0, 100), (5, 10_000, 10_005, 50))
        self.assertIsNone(turns.steps(history, (), PRICES)[1].rebuild)

    def test_a_small_previous_context_is_no_rebuild(self):
        history = spaced((10, 1_000, 0, 100), (5, 1_000, 0, 50))
        self.assertIsNone(turns.steps(history, (), PRICES)[1].rebuild)

    def test_no_rebuild_without_cache_writes(self):
        history = spaced((10, 20_000, 0, 100), (20_000, 0, 0, 50))
        self.assertIsNone(turns.steps(history, (), PRICES)[1].rebuild)

    def test_the_first_turn_and_the_turn_after_a_compaction_are_no_rebuild(self):
        history = spaced((10, 20_000, 0, 100), (5, 15_000, 0, 50))
        steps = turns.steps(history, (START + timedelta(seconds=30),), PRICES)
        self.assertEqual([step.rebuild for step in steps], [None, None])

    def test_a_model_change_is_the_cause(self):
        history = [turn(0, cache_5m=20_000), turn(1, cache_5m=20_000, model="claude-opus-5")]
        self.assertEqual(turns.steps(history, (), PRICES)[1].rebuild.cause, "model")

    def test_an_idle_gap_over_five_minutes_is_the_cause_for_5m_writes(self):
        history = [turn(0, cache_5m=20_000), turn(1, cache_5m=20_000, seconds=6 * 60 + 10)]
        self.assertEqual(turns.steps(history, (), PRICES)[1].rebuild.cause, "idle")

    def test_an_idle_gap_under_an_hour_is_no_cause_for_1h_writes(self):
        history = [turn(0, cache_1h=20_000), turn(1, cache_1h=20_000, seconds=30 * 60)]
        self.assertEqual(turns.steps(history, (), PRICES)[1].rebuild.cause, "prefix")

    def test_an_idle_gap_over_an_hour_is_the_cause_for_1h_writes(self):
        history = [turn(0, cache_1h=20_000), turn(1, cache_1h=20_000, seconds=61 * 60 + 10)]
        self.assertEqual(turns.steps(history, (), PRICES)[1].rebuild.cause, "idle")

    def test_without_times_the_gap_is_unknown(self):
        first = turns.Turn("m0", None, SONNET, "standard", 0, 20_000, 0, 0, 0, None, None)
        second = turns.Turn("m1", None, SONNET, "standard", 0, 20_000, 0, 0, 0, None, None)
        self.assertEqual(turns.steps([first, second], (), PRICES)[1].rebuild.cause, "prefix")


class CacheTtlTest(unittest.TestCase):
    def test_mostly_1h_writes_live_an_hour(self):
        self.assertEqual(turns.cache_ttl(turn(0, cache_5m=10, cache_1h=20)), timedelta(hours=1))

    def test_mostly_5m_writes_live_five_minutes(self):
        self.assertEqual(turns.cache_ttl(turn(0, cache_5m=20, cache_1h=10)), timedelta(minutes=5))

    def test_without_writes_five_minutes(self):
        self.assertEqual(turns.cache_ttl(turn(0, cache_read=10)), timedelta(minutes=5))


class OutputRateTest(unittest.TestCase):
    def test_the_median_of_long_replies_and_the_fastest_of_all_but_short_ones(self):
        rates = turns.output_rates([(SONNET, 4_000, 40), (SONNET, 6_000, 50), (SONNET, 3_000, 30),
                                    (SONNET, 1_500, 10), (SONNET, 500, 1)])
        self.assertEqual(rates, {SONNET: turns.OutputRate(median=100.0, fastest=150.0)})

    def test_without_long_replies_the_median_of_the_others(self):
        rates = turns.output_rates([(SONNET, 1_000, 10), (SONNET, 2_000, 10)])
        self.assertEqual(rates[SONNET], turns.OutputRate(median=150.0, fastest=200.0))

    def test_short_replies_and_no_time_give_no_rate(self):
        self.assertEqual(turns.output_rates([(SONNET, 999, 1), (SONNET, 5_000, 0)]), {})


# L at START: context 200K (190K read from the cache, 10K written for an hour), reply 1K. A compaction 30 s later
# that took 20 s. F a minute after L: context 50K, 30K of it the cached system prompt and tools, 20K written.
COMPACTED_AT = START + timedelta(seconds=30)
COMPACTION = turns.Compaction(ts=COMPACTED_AT, trigger="manual", pre_tokens=201_000, post_tokens=12_000,
                              duration_ms=20_000)
RATES = {SONNET: turns.OutputRate(median=100.0, fastest=150.0)}
DIFFERENCE = 200_000 + 1_000 - 50_000
REWRITE = (20_000 - 1_000) * (4.0 - 0.2) / MILLION
CALL_INPUT = (190_000 * 0.2 + 2_100 * 2.0 + (10_000 + 1_000 + 1_400 - 2_100) * 2.5) / MILLION
CALL = CALL_INPUT + 20 * 100 * 10.0 / MILLION           # the summary at 100 tokens per second for 20 s
CALL_HIGH = CALL_INPUT + 20 * 150 * 10.0 / MILLION
SAVING = DIFFERENCE * 0.2 / MILLION


def last_call():
    """L: the call before the compaction."""
    return turn(0, cache_1h=10_000, cache_read=190_000, output=1_000)


def next_call(index=1, **timing):
    """F: the first call after it."""
    return turn(index, cache_1h=20_000, cache_read=30_000, output=500, **timing)


def later(index, base=50_000):
    """A later call of the stretch, reading the one before it from the cache."""
    return turn(index, cache_1h=500, cache_read=base + 500 * (index - 2), output=500)


def compacted(calls_after):
    """L, the compaction, F and calls_after - 1 later calls."""
    return [last_call(), next_call()] + [later(index) for index in range(2, calls_after + 1)]


def twice_compacted(calls_after):
    """As compacted, then a second compaction and two calls after it."""
    history = compacted(calls_after)
    second = START + timedelta(minutes=calls_after, seconds=30)
    history += [next_call(calls_after + 1), later(calls_after + 2)]
    return history, (COMPACTION, turns.Compaction(second, "manual", 60_000, 12_000, 20_000))


class CompactionCallTest(unittest.TestCase):
    def rates(self):
        """The prices of L as $ per token."""
        return turns.turn_rates(PRICES, last_call())

    def test_a_warm_call_reads_the_last_cache_read_and_writes_the_rest_for_five_minutes(self):
        call = turns.compaction_call(last_call(), COMPACTION, RATES[SONNET], self.rates(), warm=True)
        self.assertAlmostEqual(call.low, CALL_INPUT)

    def test_a_cold_call_writes_all_but_the_tail(self):
        call = turns.compaction_call(last_call(), COMPACTION, RATES[SONNET], self.rates(), warm=False)
        self.assertAlmostEqual(call.low, ((190_000 + 12_400 - 2_100) * 2.5 + 2_100 * 2.0) / MILLION)

    def test_the_summary_is_estimated_from_the_duration(self):
        call = turns.compaction_call(last_call(), COMPACTION, RATES[SONNET], self.rates(), warm=True)
        self.assertEqual((call.summary_tokens, call.summary_high), (2_000, 3_000))
        self.assertAlmostEqual(call.cost, CALL)
        self.assertAlmostEqual(call.high, CALL_HIGH)

    def test_without_a_rate_the_summary_is_unknown(self):
        call = turns.compaction_call(last_call(), COMPACTION, None, self.rates(), warm=True)
        self.assertEqual((call.summary_tokens, call.cost, call.high), (None, None, None))
        self.assertAlmostEqual(call.low, CALL_INPUT)


class VersusKeepingTest(unittest.TestCase):
    def compare(self, history, compactions=(COMPACTION,), settings=compact.DEFAULT_COMPACT, rates=None):
        """versus_keeping over these turns, with steps computed as the session view does."""
        moments = tuple(compaction.ts for compaction in compactions)
        return turns.versus_keeping(history, turns.steps(history, moments, PRICES), compactions, PRICES, settings,
                                    RATES if rates is None else rates)

    def test_the_difference_is_the_last_context_and_reply_minus_the_next_context(self):
        [result] = self.compare(compacted(3))
        self.assertEqual((result.before, result.after, result.difference), (201_000, 50_000, DIFFERENCE))

    def test_the_rewrite_is_what_the_next_call_wrote_beyond_the_reply(self):
        [result] = self.compare(compacted(3))
        self.assertAlmostEqual(result.rewrite, REWRITE)

    def test_the_one_time_cost_is_the_call_and_the_rewrite(self):
        [result] = self.compare(compacted(3))
        self.assertAlmostEqual(result.one_time, CALL + REWRITE)

    def test_each_later_call_saves_the_difference_at_the_read_price(self):
        [result] = self.compare(compacted(3))
        self.assertAlmostEqual(result.saving_per_call, SAVING)

    def test_it_pays_off_at_the_first_call_whose_savings_reach_the_one_time_cost_at_the_fastest_summary(self):
        [result] = self.compare(compacted(10))
        self.assertEqual((result.breakeven_call, result.breakeven_at_least),
                         (math.ceil((CALL_HIGH + REWRITE) / SAVING), False))
        self.assertEqual((result.calls_after, result.verdict), (10, "saved"))
        self.assertAlmostEqual(result.net, 10 * SAVING - CALL - REWRITE)

    def test_the_break_even_is_projected_past_the_last_call(self):
        [result] = self.compare(compacted(3))
        self.assertEqual(result.breakeven_call, math.ceil((CALL_HIGH + REWRITE) / SAVING))

    def test_the_last_stretch_before_its_break_even_is_open(self):
        [result] = self.compare(compacted(3))
        self.assertEqual((result.last_stretch, result.verdict), (True, "open"))

    def test_a_stretch_that_ended_before_its_break_even_cost_more(self):
        history, compactions = twice_compacted(3)
        first = self.compare(history, compactions)[0]
        # three calls, and the next compaction's call reads the difference once more
        self.assertEqual((first.calls_after, first.last_stretch, first.verdict), (3, False, "cost_more"))
        self.assertAlmostEqual(first.net, 4 * SAVING - CALL - REWRITE)

    def test_a_following_compaction_reads_the_difference_even_as_the_last_record(self):
        second = turns.Compaction(START + timedelta(minutes=3, seconds=30), "manual", 60_000, 12_000, 20_000)
        first = self.compare(compacted(3), (COMPACTION, second))[0]
        self.assertAlmostEqual(first.net, 4 * SAVING - CALL - REWRITE)

    def test_a_net_within_the_summary_estimate_is_about_even(self):
        history, compactions = twice_compacted(4)
        self.assertEqual(self.compare(history, compactions)[0].verdict, "even")

    def test_a_compaction_at_the_auto_compact_point_was_forced(self):
        settings = compact.CompactSettings(hint_tokens=100_000, warn_share=0.8, auto_compact={"default": 150_000})
        [result] = self.compare(compacted(10), settings=settings)
        self.assertEqual(result.verdict, "forced")

    def test_the_kept_session_stops_saving_where_it_would_have_auto_compacted_and_pays_for_that(self):
        # the kept context is each call's context plus the difference: 201K, 201.5K, then 202K at the third call.
        # There the kept session compacts itself: it reads its 201.5K from the cache and rewrites like F did
        settings = compact.CompactSettings(hint_tokens=100_000, warn_share=0.8, auto_compact={"default": 202_000})
        [result] = self.compare(compacted(10), settings=settings)
        kept_compaction = (50_500 + DIFFERENCE) * 0.2 / MILLION + REWRITE
        self.assertEqual((result.capped_at, result.verdict, result.breakeven_call), (3, "saved", 3))
        self.assertAlmostEqual(result.net, 2 * SAVING + kept_compaction - CALL - REWRITE)

    def test_a_kept_session_that_could_not_make_the_next_call_was_forced(self):
        # after the compaction the session goes on with a 200K model: the kept 201K would not have fit
        settings = compact.CompactSettings(hint_tokens=100_000, warn_share=0.8,
                                           auto_compact={"default": 967_000, "claude-haiku": 200_000})
        history = [last_call(), turn(1, cache_1h=20_000, cache_read=30_000, output=500, model="claude-haiku-4-5")]
        [result] = self.compare(history, settings=settings)
        self.assertEqual(result.verdict, "forced")

    def test_without_a_summary_estimate_the_break_even_is_at_least_the_input_sides(self):
        untimed = turns.Compaction(COMPACTED_AT, "manual", 201_000, 12_000, None)
        [result] = self.compare(compacted(10), (untimed,))
        self.assertEqual((result.breakeven_call, result.breakeven_at_least),
                         (math.ceil((CALL_INPUT + REWRITE) / SAVING), True))

    def test_without_a_summary_estimate_a_stretch_that_saved_beyond_its_input_side_is_unknown(self):
        history, compactions = twice_compacted(10)
        untimed = turns.Compaction(COMPACTED_AT, "manual", 201_000, 12_000, None)
        self.assertEqual(self.compare(history, (untimed, compactions[1]))[0].verdict, "unknown")

    def test_without_a_summary_estimate_a_stretch_below_its_input_side_cost_more(self):
        history, compactions = twice_compacted(2)
        untimed = turns.Compaction(COMPACTED_AT, "manual", 201_000, 12_000, None)
        self.assertEqual(self.compare(history, (untimed, compactions[1]))[0].verdict, "cost_more")

    def test_a_free_next_call_gives_no_rework_margin(self):
        free = pricing.parse_prices({"free": {"input": 0, "cache_write_5m": 0, "cache_write_1h": 0, "cache_read": 0,
                                              "output": 0}, "claude-sonnet-5": {"input": 2.0, "cache_write_5m": 2.5,
                                                                                 "cache_write_1h": 4.0,
                                                                                 "cache_read": 0.2, "output": 10.0}})
        history = [last_call(), turn(1, cache_1h=20_000, cache_read=30_000, output=500, model="free"), later(2)]
        [result] = turns.versus_keeping(history, turns.steps(history, (COMPACTED_AT,), free), (COMPACTION,), free,
                                        compact.DEFAULT_COMPACT, RATES)
        self.assertIsNone(result.rework_margin)

    def test_a_later_rebuild_saves_the_difference_at_the_write_price(self):
        history = [last_call(), next_call(), turn(2, cache_1h=51_000, seconds=2 * 3_600)]
        [result] = self.compare(history)
        self.assertAlmostEqual(result.net, SAVING + DIFFERENCE * 4.0 / MILLION - CALL - REWRITE)

    def test_a_kept_first_call_after_the_cache_expired_would_have_written_everything(self):
        [result] = self.compare([last_call(), next_call(seconds=2 * 3_600)])
        saving = (DIFFERENCE * 4.0 + 30_000 * (4.0 - 0.2)) / MILLION + REWRITE
        self.assertAlmostEqual(result.net, saving - CALL - REWRITE)

    def test_a_compaction_long_after_the_last_call_finds_the_cache_cold(self):
        late = turns.Compaction(START + timedelta(hours=2), "manual", 201_000, 12_000, 20_000)
        [result] = self.compare([last_call(), next_call(seconds=2 * 3_600 + 60)], (late,))
        self.assertFalse(result.cache_warm)
        self.assertAlmostEqual(result.call.low, ((190_000 + 12_400 - 2_100) * 2.5 + 2_100 * 2.0) / MILLION)

    def test_a_compaction_that_dropped_nothing_never_pays_off(self):
        history = [last_call(), turn(1, cache_1h=250_000, output=500), later(2, base=250_000)]
        [result] = self.compare(history)
        self.assertIsNone(result.breakeven_call)

    def test_the_rework_margin_is_the_re_read_tokens_that_would_cancel_the_saving(self):
        [result] = self.compare(compacted(10))
        net_low = 10 * SAVING - CALL_HIGH - REWRITE
        self.assertEqual(result.rework_margin, math.floor(net_low / ((4.0 + 0.2 * 9) / MILLION)))

    def test_without_a_rate_nothing_is_proven_saved(self):
        [result] = self.compare(compacted(10), rates={})
        self.assertEqual((result.net, result.verdict), (None, "unknown"))

    def test_no_call_before_or_after_means_no_comparison(self):
        early = turns.Compaction(START - timedelta(minutes=1), "manual", 1, 1, 1)
        self.assertEqual(self.compare([last_call()], (early, COMPACTION)), [None, None])

    def test_a_comparison_knows_when_its_compaction_ran_and_when_its_stretch_ended(self):
        history, compactions = twice_compacted(3)
        first, second = self.compare(history, compactions)
        self.assertEqual((first.compacted_at, first.ended_at), (COMPACTED_AT, compactions[1].ts))
        self.assertEqual((second.compacted_at, second.ended_at), (compactions[1].ts, None))

    def test_an_unpriced_model_means_no_comparison(self):
        history = [turn(0, cache_1h=10_000, cache_read=190_000, output=1_000, model="gpt-x"),
                   turn(1, cache_1h=20_000, cache_read=30_000, model="gpt-x")]
        self.assertEqual(self.compare(history), [None])


def with_overhead(*later_turns):
    """A 30K first call (the overhead), then the given turns."""
    return [turn(0, cache_1h=30_000, output=100), *later_turns]


CURRENT = with_overhead(turn(1, cache_1h=10_000, cache_read=290_000, output=1_000))


class PreviewTest(unittest.TestCase):
    """What compacting now would cost and when it would pay off."""

    def past(self):
        """One earlier compaction: 200K and a 1K reply before, 50K after (20K above the overhead, 30K of it the
        cached prefix), a 20 s summary call, 9 calls after it."""
        history = with_overhead(turn(1, cache_1h=10_000, cache_read=190_000, output=1_000),
                                turn(2, cache_1h=20_000, cache_read=30_000, output=500),
                                *[later(index + 1) for index in range(2, 10)])
        compaction = turns.Compaction(START + timedelta(seconds=90), "manual", 201_000, 12_000, 20_000)
        return turns.versus_keeping(history, turns.steps(history, (compaction.ts,), PRICES), (compaction,), PRICES,
                                    compact.DEFAULT_COMPACT, RATES)

    def preview(self, history, past=()):
        """compact_preview of these turns."""
        return turns.compact_preview(history, list(past), PRICES)

    def test_no_turns_no_preview(self):
        self.assertIsNone(self.preview([]))

    def test_the_exact_parts_need_no_history(self):
        current = with_overhead(turn(1, cache_1h=10_000, cache_read=290_000, output=1_000))
        preview = self.preview(current)
        self.assertEqual(preview["before"], 301_000)
        self.assertAlmostEqual(preview["reread_cost"], 301_000 * 0.2 / MILLION)
        self.assertAlmostEqual(preview["keep_across_break"], 301_000 * (4.0 - 0.2) / MILLION)
        self.assertEqual(preview["cache_warm_until"],
                         (current[-1].request_ts + timedelta(hours=1)).isoformat(timespec="milliseconds"))
        self.assertIsNone(preview["estimate"])

    def test_the_break_even_estimated_from_past_compactions(self):
        preview = self.preview(with_overhead(turn(1, cache_1h=10_000, cache_read=290_000, output=1_000)), self.past())
        estimate = preview["estimate"]
        one_time = (290_000 * 0.2 + 2_100 * 2.0 + 10_300 * 2.5 + 2_000 * 10.0 + 19_000 * 3.8) / MILLION
        self.assertEqual((estimate["after"], estimate["summary_tokens"], estimate["compactions"]), (50_000, 2_000, 1))
        self.assertAlmostEqual(estimate["one_time"], one_time)
        self.assertEqual(estimate["breakeven_calls"], math.ceil(one_time / (251_000 * 0.2 / MILLION)))

    def test_compacting_before_a_break_saves_rewriting_the_difference(self):
        preview = self.preview(with_overhead(turn(1, cache_1h=10_000, cache_read=290_000, output=1_000)), self.past())
        call_high = (290_000 * 0.2 + 2_100 * 2.0 + 10_300 * 2.5 + 3_000 * 10.0) / MILLION
        self.assertAlmostEqual(preview["estimate"]["before_break"], 251_000 * 4.0 / MILLION - call_high)

    def test_a_context_below_the_expected_one_after_never_pays_off(self):
        preview = self.preview(with_overhead(turn(1, cache_1h=10_000, cache_read=30_000, output=100)), self.past())
        self.assertEqual((preview["estimate"]["breakeven_calls"], preview["estimate"]["before_break"]), (None, None))

    def test_the_range_spans_the_past_compactions(self):
        [first] = self.past()
        bigger = dataclasses.replace(first, added=40_000,
                                     call=dataclasses.replace(first.call, summary_tokens=6_000, summary_high=8_000))
        estimate = self.preview(with_overhead(turn(1, cache_1h=10_000, cache_read=290_000, output=1_000)),
                                [first, bigger])["estimate"]
        self.assertEqual((estimate["after_low"], estimate["after"], estimate["after_high"]), (50_000, 60_000, 70_000))
        self.assertLessEqual(estimate["breakeven_low"], estimate["breakeven_calls"])
        self.assertLessEqual(estimate["breakeven_calls"], estimate["breakeven_high"])

    def test_the_summary_of_the_same_model_is_preferred(self):
        [first] = self.past()
        other = dataclasses.replace(first, model="claude-opus-5",
                                    call=dataclasses.replace(first.call, summary_tokens=9_000, summary_high=9_000))
        estimate = self.preview(with_overhead(turn(1, cache_1h=10_000, cache_read=290_000, output=1_000)),
                                [first, other])["estimate"]
        self.assertEqual(estimate["summary_tokens"], 2_000)

    def test_the_calls_that_followed_finished_past_compactions(self):
        [first] = self.past()
        finished = dataclasses.replace(first, last_stretch=False)
        estimate = self.preview(CURRENT, [first, finished, dataclasses.replace(finished, calls_after=30)])["estimate"]
        self.assertEqual((estimate["calls_after_low"], estimate["calls_after_high"]), (9, 30))

    def test_the_calls_still_ahead_are_the_mean_left_of_the_finished_stretches_longer_than_this_one(self):
        [first] = self.past()
        stretches = [dataclasses.replace(first, last_stretch=False, calls_after=calls) for calls in (3, 9, 30, 40)]
        estimate = turns.compact_preview(CURRENT, stretches, PRICES, calls_so_far=5)["estimate"]
        self.assertEqual((estimate["calls_ahead"], estimate["stretches_ahead"], estimate["ahead_from"]),
                         (21.3, 3, "longer"))

    def test_with_fewer_than_three_longer_stretches_the_calls_ahead_are_the_mean_stretch(self):
        # having outlasted most past stretches says nothing about stopping soon: the mean of all is the cautious
        # estimate
        [first] = self.past()
        stretches = [dataclasses.replace(first, last_stretch=False, calls_after=calls) for calls in (3, 9, 30, 40)]
        estimate = turns.compact_preview(CURRENT, stretches, PRICES, calls_so_far=10)["estimate"]
        self.assertEqual((estimate["calls_ahead"], estimate["stretches_ahead"], estimate["ahead_from"]),
                         (20.5, 2, "all"))

    def test_fewer_than_three_finished_stretches_tell_nothing_about_the_calls_ahead(self):
        [first] = self.past()
        stretches = [dataclasses.replace(first, last_stretch=False, calls_after=calls) for calls in (30, 40)]
        estimate = turns.compact_preview(CURRENT, stretches, PRICES, calls_so_far=1)["estimate"]
        self.assertEqual((estimate["calls_ahead"], estimate["ahead_from"]), (None, None))

    def test_the_preview_leaves_whether_compacting_likely_pays_to_the_conversations_hints(self):
        [first] = self.past()
        stretches = [dataclasses.replace(first, last_stretch=False, calls_after=calls) for calls in (30, 40, 50)]
        self.assertNotIn("likely_pays", turns.compact_preview(CURRENT, stretches, PRICES, calls_so_far=1))

    def test_open_stretches_tell_nothing_about_the_calls_that_follow(self):
        estimate = self.preview(CURRENT, self.past())["estimate"]
        self.assertEqual((estimate["calls_after_low"], estimate["calls_after_high"]), (None, None))

    def test_the_context_after_is_the_cached_prefix_and_what_past_compactions_added(self):
        # another session cached a 45K prefix and added 10K: independent of this session's first call
        [first] = self.past()
        other = dataclasses.replace(first, prefix_read=45_000, added=10_000)
        estimate = self.preview(with_overhead(turn(1, cache_1h=3_000, cache_read=200_000, output=3_000)),
                                [other])["estimate"]
        self.assertEqual(estimate["after"], 55_000)
        self.assertGreater(estimate["one_time"], 0)
        self.assertGreaterEqual(estimate["breakeven_calls"], 1)

    def test_a_reply_bigger_than_what_compacting_adds_rewrites_nothing(self):
        [first] = self.past()
        estimate = self.preview(with_overhead(turn(1, cache_1h=10_000, cache_read=290_000, output=30_000)),
                                [first])["estimate"]
        uncached = 10_000 + 30_000 + 1_400
        input_side = (290_000 * 0.2 + 2_100 * 2.0 + (uncached - 2_100) * 2.5) / MILLION
        self.assertAlmostEqual(estimate["one_time"], input_side + 2_000 * 10.0 / MILLION)

    def test_a_cold_cache_prices_the_compaction_cold_against_rewriting_everything(self):
        estimate = self.preview(CURRENT, self.past())["estimate"]
        cold_input = ((290_000 + 12_400 - 2_100) * 2.5 + 2_100 * 2.0) / MILLION
        self.assertAlmostEqual(estimate["cold_saving"], 251_000 * 4.0 / MILLION - cold_input - 2_000 * 10.0 / MILLION)
        self.assertEqual(estimate["breakeven_cold"], 1)

    def test_the_cache_lifetime_comes_from_the_latest_call_that_wrote(self):
        current = with_overhead(turn(1, cache_1h=10_000, cache_read=290_000, output=1_000),
                                turn(2, cache_read=301_000, output=10))
        self.assertEqual(self.preview(current)["cache_ttl_minutes"], 60)

    def test_stored_compactions_without_a_summary_estimate_are_counted(self):
        [first] = self.past()
        untimed = dataclasses.replace(first, call=dataclasses.replace(first.call, summary_tokens=None))
        preview = self.preview(CURRENT, [untimed])
        self.assertEqual((preview["estimate"], preview["stored_compactions"]), (None, 1))


class LikelyPaysTest(unittest.TestCase):
    """Where compacting is predicted to pay off within the calls that on average still follow."""

    def past(self, calls_after=9):
        """PreviewTest's earlier compaction, its stretch finished after calls_after calls a day later."""
        [first] = PreviewTest.past(self)
        return dataclasses.replace(first, last_stretch=False, calls_after=calls_after,
                                   ended_at=first.compacted_at + timedelta(days=1))

    def test_it_pays_where_the_break_even_comes_within_the_calls_ahead(self):
        self.assertTrue(turns.likely_pays({"breakeven_calls": 5, "calls_ahead": 5.0}))
        self.assertFalse(turns.likely_pays({"breakeven_calls": 6, "calls_ahead": 5.5}))

    def test_nothing_is_likely_without_an_estimate_a_break_even_or_the_calls_ahead(self):
        for estimate in (None, {"breakeven_calls": None, "calls_ahead": 5.0},
                         {"breakeven_calls": 1, "calls_ahead": None}):
            with self.subTest(estimate=estimate):
                self.assertFalse(turns.likely_pays(estimate))

    def test_only_compactions_before_the_moment_are_known(self):
        past = self.past()
        self.assertEqual(turns.known_at([past], past.compacted_at), [])
        self.assertEqual(turns.known_at([past], past.compacted_at + timedelta(seconds=1)),
                         [dataclasses.replace(past, last_stretch=True)])

    def test_a_stretch_that_ends_later_is_still_open_at_the_moment(self):
        past = self.past()
        self.assertEqual(turns.known_at([past], past.ended_at), [past])

    def calls(self):
        """A call before the past compaction, then a small and a big one well after its stretch ended."""
        past = self.past()
        later_start = past.ended_at + timedelta(hours=1)
        small = dataclasses.replace(turn(1, cache_1h=100, cache_read=40_000, output=100), ts=later_start)
        big = dataclasses.replace(turn(2, cache_1h=10_000, cache_read=290_000, output=1_000),
                                  ts=later_start + timedelta(minutes=1))
        early = dataclasses.replace(big, ts=past.compacted_at - timedelta(minutes=1))
        return [early, small, big]

    def test_each_call_where_compacting_after_it_likely_pays(self):
        estimates = turns.pays_estimates(self.calls(), (), [self.past()] * 3, PRICES)
        self.assertEqual([estimate is not None for estimate in estimates], [False, False, True])
        # three calls so far, and each past stretch ran 9
        self.assertEqual(estimates[2]["calls_ahead"], 6)

    def test_the_calls_so_far_count_from_the_transcripts_last_compaction(self):
        history = self.calls()
        moment = history[1].ts - timedelta(seconds=1)
        estimates = turns.pays_estimates(history, (moment,), [self.past()] * 3, PRICES)
        self.assertEqual(estimates[2]["calls_ahead"], 7)


class SavingsTotalTest(unittest.TestCase):
    """What compacting saved so far: the nets of the compactions summed."""

    def comparison(self, verdict, net):
        """PreviewTest's earlier compaction with this verdict and net."""
        [first] = PreviewTest.past(self)
        return dataclasses.replace(first, verdict=verdict, net=net)

    def test_the_nets_summed_open_and_even_stretches_as_they_stand(self):
        total = turns.savings_total([self.comparison("saved", 0.9), self.comparison("cost_more", -0.2),
                                     self.comparison("open", -0.05), self.comparison("even", 0.01), None])
        self.assertAlmostEqual(total["net"], 0.66)
        self.assertEqual((total["compactions"], total["unknown"]), (4, 0))

    def test_forced_compactions_are_left_out_and_unknown_ones_counted(self):
        total = turns.savings_total([self.comparison("saved", 0.5), self.comparison("forced", 3.0),
                                     self.comparison("unknown", None)])
        self.assertEqual((total["net"], total["compactions"], total["unknown"]), (0.5, 1, 1))

    def test_nothing_to_sum_is_no_total(self):
        self.assertIsNone(turns.savings_total([None, self.comparison("forced", 1.0)]))


class OverheadTest(unittest.TestCase):
    def test_the_overhead_is_the_first_turns_context(self):
        overhead = turns.overhead(spaced((10, 20_000, 0, 100), (5, 100, 20_010, 50)), PRICES)
        self.assertEqual(overhead.tokens, 20_010)

    def test_its_cost_is_what_later_turns_read_of_it(self):
        history = spaced((10, 20_000, 0, 100), (5, 100, 20_010, 50), (5, 100, 8_000, 50))
        overhead = turns.overhead(history, PRICES)
        self.assertAlmostEqual(overhead.cost, (20_010 + 8_000) * 0.2 / MILLION)

    def test_no_turns_no_overhead(self):
        self.assertIsNone(turns.overhead([], PRICES))

    def test_unpriced_turns_add_no_cost(self):
        history = [turn(0, cache_5m=20_000, model="gpt-x"), turn(1, cache_read=20_000, model="gpt-x")]
        self.assertEqual(turns.overhead(history, PRICES).cost, 0.0)


class GaugeTest(unittest.TestCase):
    def setUp(self):
        self.settings = compact.CompactSettings(hint_tokens=200_000, warn_share=0.8,
                                                auto_compact={"default": 1_000_000})

    def gauge(self, history, compacted=()):
        """The gauge of these turns and compaction times."""
        return turns.gauge(history, turns.steps(history, compacted, PRICES), compacted, self.settings)

    def test_no_turns_no_gauge(self):
        self.assertIsNone(self.gauge([]))

    def test_the_last_context_against_the_auto_compact_point(self):
        gauge = self.gauge(spaced((10, 20_000, 0, 100), (5, 100_000, 20_010, 50)))
        self.assertEqual((gauge["context"], gauge["model"], gauge["auto_compact"], gauge["hint_tokens"]),
                         (120_015, SONNET, 1_000_000, 200_000))
        self.assertEqual((gauge["share"], gauge["headroom"]), (0.12, 1_000_000 - 120_015))

    def test_turns_since_the_last_compaction(self):
        history = spaced((10, 20_000, 0, 100), (5, 3_000, 0, 50), (5, 100, 3_000, 50))
        gauge = self.gauge(history, (START + timedelta(seconds=30),))
        self.assertEqual((gauge["turns_since_compaction"], gauge["last_compaction"]),
                         (2, (START + timedelta(seconds=30)).isoformat(timespec="milliseconds")))

    def test_without_a_compaction_every_turn_counts(self):
        gauge = self.gauge(spaced((10, 20_000, 0, 100), (5, 100, 20_010, 50)))
        self.assertEqual((gauge["turns_since_compaction"], gauge["last_compaction"]), (2, None))

    def test_the_mean_step_and_the_turns_left(self):
        # contexts 100K, 200K, 300K: 100K per turn, 700K to go
        history = spaced((0, 100_000, 0, 0), (0, 100_000, 100_000, 0), (0, 100_000, 200_000, 0))
        gauge = self.gauge(history)
        self.assertEqual((gauge["mean_growth"], gauge["mean_step"], gauge["turns_left"]), (100_000, 100_000, 7))

    def test_only_the_last_ten_steps_count(self):
        specs = [(0, 1_000, 1_000 * index, 0) for index in range(11)] + [(0, 12_000, 11_000, 0)]
        gauge = self.gauge(spaced(*specs))
        self.assertEqual(gauge["mean_step"], round((9 * 1_000 + 12_000) / 10))

    def test_a_shrinking_context_has_no_estimate(self):
        gauge = self.gauge(spaced((0, 100_000, 0, 0), (0, 0, 50_000, 0)))
        self.assertIsNone(gauge["turns_left"])

    def test_a_single_turn_has_no_estimate(self):
        gauge = self.gauge(spaced((0, 100_000, 0, 0)))
        self.assertEqual((gauge["mean_growth"], gauge["mean_step"], gauge["turns_left"]), (None, None, None))

    def test_steps_before_the_compaction_do_not_count(self):
        history = spaced((0, 100_000, 0, 0), (0, 400_000, 100_000, 0), (0, 10_000, 0, 0), (0, 1_000, 10_000, 0))
        gauge = self.gauge(history, (START + timedelta(seconds=90),))
        self.assertEqual(gauge["mean_step"], 1_000)


if __name__ == "__main__":
    unittest.main()
