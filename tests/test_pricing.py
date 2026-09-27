"""pricing.py: prices by longest model-id prefix, cost per token category, fast mode, and the shipped price table."""
import math
import tomllib
import unittest
from datetime import date
from pathlib import Path

from claude_usage import pricing

REPO = Path(__file__).resolve().parent.parent

TABLE = {
    "claude-opus-5": {"input": 5.0, "cache_write_5m": 6.25, "cache_write_1h": 10.0, "cache_read": 0.5,
                      "output": 25.0, "fast_multiplier": 2.0},
    "claude-opus-5-5": {"input": 4.0, "cache_write_5m": 5.0, "cache_write_1h": 8.0, "cache_read": 0.2,
                        "output": 20.0, "fast_multiplier": 2.0},
    "claude-sonnet-5": {"input": 2.0, "cache_write_5m": 2.5, "cache_write_1h": 4.0, "cache_read": 0.2,
                        "output": 10.0},
}
MILLION = 1_000_000


def cost(model, speed="standard", **tokens):
    """The cost of the given token counts (all others 0) under TABLE."""
    counts = {"new_input": 0, "cache_write_5m": 0, "cache_write_1h": 0, "cache_read": 0, "output": 0}
    counts.update(tokens)
    return pricing.cost(pricing.parse_prices(TABLE), model, speed, **counts)


class LookupTest(unittest.TestCase):
    def setUp(self):
        self.prices = pricing.parse_prices(TABLE)

    def test_exact_id(self):
        self.assertEqual(pricing.price_for(self.prices, "claude-sonnet-5").output, 10.0)

    def test_longest_prefix_wins(self):
        self.assertEqual(pricing.price_for(self.prices, "claude-opus-5-5").input, 4.0)
        self.assertEqual(pricing.price_for(self.prices, "claude-opus-5").input, 5.0)

    def test_dated_id_matches_its_prefix(self):
        self.assertEqual(pricing.price_for(self.prices, "claude-sonnet-5-20260801").input, 2.0)

    def test_context_suffix_is_ignored(self):
        self.assertEqual(pricing.price_for(self.prices, "claude-opus-5-5[1m]").input, 4.0)

    def test_unknown_model_is_none(self):
        for model in ("claude-haiku-4-5", "gpt-5", "", "<synthetic>"):
            with self.subTest(model=model):
                self.assertIsNone(pricing.price_for(self.prices, model))


class CostTest(unittest.TestCase):
    def test_each_token_category_has_its_price(self):
        cases = {"new_input": 5.0, "cache_write_5m": 6.25, "cache_write_1h": 10.0, "cache_read": 0.5, "output": 25.0}
        for category, per_million in cases.items():
            with self.subTest(category=category):
                self.assertTrue(math.isclose(cost("claude-opus-5", **{category: MILLION}), per_million))

    def test_the_1h_cache_write_price(self):
        self.assertTrue(math.isclose(cost("claude-opus-5-5", cache_write_1h=500_000), 4.0))

    def test_sum_over_categories(self):
        total = cost("claude-sonnet-5", new_input=1_000, cache_read=2_000_000, output=100_000)
        self.assertTrue(math.isclose(total, 0.002 + 0.4 + 1.0))

    def test_fast_mode_multiplies_every_category(self):
        standard = cost("claude-opus-5", new_input=MILLION, cache_read=MILLION, cache_write_1h=MILLION, output=MILLION)
        fast = cost("claude-opus-5", "fast", new_input=MILLION, cache_read=MILLION, cache_write_1h=MILLION,
                    output=MILLION)
        self.assertTrue(math.isclose(fast, 2 * standard))

    def test_fast_without_a_multiplier_is_billed_at_standard_rates(self):
        self.assertTrue(math.isclose(cost("claude-sonnet-5", "fast", output=MILLION), 10.0))

    def test_any_non_standard_speed_counts_as_fast(self):
        self.assertTrue(math.isclose(cost("claude-opus-5", "priority-fast", output=MILLION), 50.0))

    def test_unknown_model_costs_none(self):
        self.assertIsNone(cost("claude-unknown", output=MILLION))

    def test_no_tokens_cost_nothing(self):
        self.assertEqual(cost("claude-opus-5"), 0.0)


class CostPartsTest(unittest.TestCase):
    def setUp(self):
        self.prices = pricing.parse_prices(TABLE)
        self.counts = {"new_input": MILLION, "cache_write_5m": MILLION, "cache_write_1h": MILLION,
                       "cache_read": MILLION, "output": MILLION}

    def test_parts_per_category(self):
        parts = pricing.cost_parts(self.prices, "claude-opus-5", "standard", **self.counts)
        self.assertEqual(parts, {"new_input": 5.0, "cache_write": 16.25, "cache_read": 0.5, "output": 25.0})

    def test_parts_add_up_to_the_cost(self):
        for speed in ("standard", "fast"):
            with self.subTest(speed=speed):
                parts = pricing.cost_parts(self.prices, "claude-opus-5", speed, **self.counts)
                total = pricing.cost(self.prices, "claude-opus-5", speed, **self.counts)
                self.assertAlmostEqual(sum(parts.values()), total)

    def test_fast_mode_multiplies_every_part(self):
        parts = pricing.cost_parts(self.prices, "claude-opus-5", "fast", **self.counts)
        self.assertEqual(parts["cache_read"], 1.0)

    def test_unknown_model_has_no_parts(self):
        self.assertIsNone(pricing.cost_parts(self.prices, "claude-unknown", "standard", **self.counts))


class WebSearchTest(unittest.TestCase):
    def test_default_fee(self):
        self.assertEqual(pricing.parse_prices(TABLE).web_search_per_1000, pricing.DEFAULT_WEB_SEARCH_PER_1000)
        self.assertEqual(pricing.DEFAULT_WEB_SEARCH_PER_1000, 10.0)

    def test_web_search_cost(self):
        prices = pricing.parse_prices(TABLE, {"web_search_per_1000": 12.0})
        self.assertAlmostEqual(pricing.web_search_cost(prices, 250), 3.0)
        self.assertEqual(pricing.web_search_cost(prices, 0), 0.0)

    def test_broken_fees_raise(self):
        for fees in ({"web_search_per_1000": -1}, {"web_search_per_1000": "10"}, {"websearch": 1.0}, "10"):
            with self.subTest(fees=fees):
                with self.assertRaises(pricing.PricingError):
                    pricing.parse_prices(TABLE, fees)

    def test_prices_still_look_up_by_model(self):
        prices = pricing.parse_prices(TABLE, {"web_search_per_1000": 12.0})
        self.assertEqual(prices["claude-sonnet-5"].output, 10.0)


class ParseTest(unittest.TestCase):
    def test_missing_field_raises_with_model_and_field(self):
        broken = {"claude-x": {"input": 1.0, "cache_write_5m": 1.0, "cache_read": 0.1, "output": 5.0}}
        with self.assertRaises(pricing.PricingError) as caught:
            pricing.parse_prices(broken)
        self.assertIn("claude-x", str(caught.exception))
        self.assertIn("cache_write_1h", str(caught.exception))

    def test_non_numeric_or_negative_price_raises(self):
        for value in ("5", -1.0, True):
            with self.subTest(value=value):
                entry = dict(TABLE["claude-sonnet-5"], output=value)
                with self.assertRaises(pricing.PricingError):
                    pricing.parse_prices({"claude-sonnet-5": entry})

    def test_unknown_field_raises(self):
        with self.assertRaises(pricing.PricingError) as caught:
            pricing.parse_prices({"claude-sonnet-5": dict(TABLE["claude-sonnet-5"], outptu=1.0)})
        self.assertIn("outptu", str(caught.exception))

    def test_entry_that_is_no_table_raises(self):
        with self.assertRaises(pricing.PricingError):
            pricing.parse_prices({"claude-sonnet-5": 3.0})

    def test_integers_are_accepted(self):
        prices = pricing.parse_prices({"claude-sonnet-5": dict(TABLE["claude-sonnet-5"], output=10)})
        self.assertEqual(prices["claude-sonnet-5"].output, 10.0)


class ShippedPricesTest(unittest.TestCase):
    def setUp(self):
        with (REPO / "claude_usage" / "config.toml").open("rb") as handle:
            self.config = tomllib.load(handle)
        self.prices = pricing.parse_prices(self.config["prices"])

    def test_web_search_fee(self):
        prices = pricing.parse_prices(self.config["prices"], self.config["fees"])
        self.assertEqual(prices.web_search_per_1000, 10.0)

    def test_prices_are_dated(self):
        self.assertIsInstance(self.config["prices_checked"], date)

    def test_models_seen_in_transcripts_have_a_price(self):
        for model in ("claude-opus-5-5", "claude-opus-5", "claude-sonnet-5", "claude-opus-4-8", "claude-haiku-4-5",
                      "claude-fable-5-1", "claude-sonnet-4-6", "claude-opus-4-20250514", "claude-3-5-haiku-20241022"):
            with self.subTest(model=model):
                self.assertIsNotNone(pricing.price_for(self.prices, model))

    def test_opus_5_5_prices(self):
        price = pricing.price_for(self.prices, "claude-opus-5-5")
        self.assertEqual((price.input, price.cache_write_5m, price.cache_write_1h, price.cache_read, price.output,
                          price.fast_multiplier), (4.0, 5.0, 8.0, 0.2, 20.0, 2.0))

    def test_dated_opus_4_prefix_does_not_catch_other_4_x_models(self):
        self.assertIsNone(pricing.price_for(self.prices, "claude-opus-4-9"))


if __name__ == "__main__":
    unittest.main()
