"""turns.py: growth per step, cache rebuilds, the fixed overhead and the current-context gauge."""
import unittest
from datetime import UTC
from datetime import datetime
from datetime import timedelta

from claude_usage import compact
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
