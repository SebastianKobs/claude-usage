"""compact.py: where the conversation view hints at compacting, and the settings for it."""
import unittest

from claude_usage import compact
from claude_usage import config


def reply(context, model="claude-sonnet-5", cache_read_cost=0.01, pays=None):
    """A conversation entry as the chat payload has it, with the usage fields compact_hints reads; pays is the
    estimate where compacting after it likely pays (server.chat's compact_pays)."""
    usage = {"context": context, "model": model, "cost_parts": {"cache_read": cache_read_cost}}
    if pays is not None:
        usage["compact_pays"] = pays
    return {"kind": "text", "usage": usage}


PAYS = {"breakeven_calls": 6, "calls_ahead": 40.2, "ahead_from": "longer", "one_time": 0.36, "after": 51_000}


class CompactHintsTest(unittest.TestCase):
    """Where the conversation hints at compacting: a configurable soft threshold, and near auto-compaction."""

    def setUp(self):
        self.settings = compact.CompactSettings(hint_tokens=200_000, warn_share=0.8,
                                                auto_compact={"default": 967_000, "claude-haiku-4-5": 200_000})

    def hints(self, entries):
        """The compact_hint of each entry, after compact_hints."""
        compact.compact_hints(entries, self.settings)
        return [entry.get("compact_hint") for entry in entries]

    def test_a_soft_hint_where_the_context_first_crosses_the_threshold(self):
        hints = self.hints([reply(150_000), reply(250_000, cache_read_cost=0.03), reply(290_000)])
        self.assertEqual(hints, [None, {"kind": "soft", "context": 250_000, "threshold": 200_000,
                                        "reread_cost": 0.03}, None])

    def test_soft_reminders_at_each_step_over_the_threshold(self):
        hints = self.hints([reply(210_000), reply(290_000), reply(310_000), reply(350_000), reply(400_000)])
        self.assertEqual([hint and hint["kind"] for hint in hints],
                         ["soft", None, "soft_reminder", None, "soft_reminder"])
        self.assertEqual(hints[2], {"kind": "soft_reminder", "context": 310_000, "threshold": 200_000, "times": 1.6})

    def test_a_jump_past_several_steps_reminds_once(self):
        hints = self.hints([reply(210_000), reply(520_000), reply(590_000), reply(600_000)])
        self.assertEqual([hint and hint["kind"] for hint in hints], ["soft", "soft_reminder", None, "soft_reminder"])

    def test_auto_reminders_at_each_step_of_the_auto_compact_point(self):
        contexts = (780_000, 800_000, 825_000, 830_000, 875_000)      # 80.7, 82.7, 85.3, 85.8, 90.5 %
        hints = self.hints([reply(context) for context in contexts])
        self.assertEqual([hint and hint["kind"] for hint in hints],
                         ["auto", None, "auto_reminder", None, "auto_reminder"])
        self.assertEqual(hints[4], {"kind": "auto_reminder", "context": 875_000, "auto_compact": 967_000,
                                    "share": 0.9})

    def test_no_soft_reminders_once_the_auto_tier_announced(self):
        hints = self.hints([reply(210_000), reply(790_000), reply(810_000)])
        self.assertEqual([hint and hint["kind"] for hint in hints], ["soft", "auto", None])

    def test_the_reminders_start_again_after_a_compaction(self):
        hints = self.hints([reply(210_000), reply(310_000), {"kind": "compaction"}, reply(220_000), reply(300_000)])
        self.assertEqual([hint and hint["kind"] for hint in hints],
                         ["soft", "soft_reminder", None, "soft", "soft_reminder"])

    def test_the_steps_come_from_the_settings(self):
        self.settings = compact.CompactSettings(hint_tokens=100_000, warn_share=0.8, auto_compact={"default": 967_000},
                                                reminder_step=1.0, auto_reminder_step=0.1)
        hints = self.hints([reply(100_000), reply(150_000), reply(200_000)])
        self.assertEqual([hint and hint["kind"] for hint in hints], ["soft", None, "soft_reminder"])

    def test_the_hint_comes_again_after_a_compaction(self):
        hints = self.hints([reply(250_000), {"kind": "compaction"}, reply(40_000), reply(210_000)])
        self.assertEqual([hint and hint["kind"] for hint in hints], ["soft", None, None, "soft"])

    def test_near_the_auto_compact_point_of_the_model(self):
        haiku = self.hints([reply(170_000, model="claude-haiku-4-5-20251001")])
        self.assertEqual(haiku, [{"kind": "auto", "context": 170_000, "auto_compact": 200_000, "share": 0.85}])
        default = self.hints([reply(700_000), reply(780_000)])
        self.assertEqual([hint["kind"] for hint in default], ["soft", "auto"])
        self.assertEqual(default[1]["auto_compact"], 967_000)

    def test_crossing_both_at_once_warns_once(self):
        hints = self.hints([reply(800_000), reply(810_000)])
        self.assertEqual([hint and hint["kind"] for hint in hints], ["auto", None])

    def test_a_warning_where_compacting_first_likely_pays(self):
        hints = self.hints([reply(100_000), reply(120_000, pays=PAYS), reply(130_000, pays=PAYS)])
        self.assertEqual(hints, [None, {"kind": "pays", "context": 120_000, "pays_off_in": 6, "calls_ahead": 40,
                                        "ahead_from": "longer", "one_time": 0.36, "after": 51_000}, None])

    def test_pays_reminders_at_each_step_of_the_context_it_first_warned_at(self):
        contexts = (120_000, 170_000, 180_000, 200_000, 240_000)
        hints = self.hints([reply(context, pays=PAYS) for context in contexts])
        self.assertEqual([hint and hint["kind"] for hint in hints],
                         ["pays", None, "pays_reminder", None, "pays_reminder"])
        self.assertEqual(hints[2], {"kind": "pays_reminder", "context": 180_000, "pays_off_in": 6})

    def test_no_pays_reminder_where_compacting_no_longer_likely_pays(self):
        hints = self.hints([reply(120_000, pays=PAYS), reply(180_000)])
        self.assertEqual([hint and hint["kind"] for hint in hints], ["pays", None])

    def test_the_pays_warning_outranks_the_soft_hint_and_quiets_it(self):
        hints = self.hints([reply(210_000), reply(250_000, pays=PAYS), reply(310_000), reply(400_000)])
        self.assertEqual([hint and hint["kind"] for hint in hints], ["soft", "pays", None, None])

    def test_the_auto_tier_outranks_the_pays_warning(self):
        hints = self.hints([reply(120_000, pays=PAYS), reply(790_000, pays=PAYS), reply(900_000, pays=PAYS)])
        self.assertEqual([hint and hint["kind"] for hint in hints], ["pays", "auto", "auto_reminder"])

    def test_the_pays_warning_comes_again_after_a_compaction(self):
        hints = self.hints([reply(120_000, pays=PAYS), {"kind": "compaction"}, reply(130_000, pays=PAYS)])
        self.assertEqual([hint and hint["kind"] for hint in hints], ["pays", None, "pays"])

    def test_entries_without_usage_are_left_alone(self):
        self.assertEqual(self.hints([{"kind": "prompt", "usage": None}, {"kind": "tool"}]), [None, None])


class CompactSettingsTest(unittest.TestCase):
    def test_the_shipped_settings(self):
        settings = compact.parse_compact_settings(config.load(overrides=[]).values)
        self.assertEqual((settings.hint_tokens, settings.warn_share), (200_000, 0.8))
        self.assertEqual((settings.reminder_step, settings.auto_reminder_step), (0.5, 0.05))
        self.assertEqual(compact.auto_compact_point(settings, "claude-opus-5-5[1m]"), 967_000)
        self.assertEqual(compact.auto_compact_point(settings, "claude-haiku-4-5-20251001"), 200_000)
        self.assertEqual((settings.delegate_hint_tokens, settings.delegate_calls_ahead), (20_000, 60))

    def test_missing_tables_take_the_defaults(self):
        self.assertEqual(compact.parse_compact_settings({}), compact.DEFAULT_COMPACT)

    def test_bad_values_raise(self):
        for values in ({"chat": {"compact_hint_tokens": "lots"}}, {"chat": {"auto_compact_warn_share": 2}},
                       {"auto_compact": {"default": -1}}, {"chat": {"compact_hint_tokens": True}},
                       {"chat": {"compact_reminder_step": 0}}, {"chat": {"auto_compact_reminder_step": 1.5}},
                       {"chat": {"compact_reminder_step": float("inf")}}, {"chat": {"auto_compact_warn_share": 5}},
                       {"chat": 5}, {"auto_compact": "x"}, {"chat": {"delegate_hint_tokens": 0}},
                       {"chat": {"delegate_calls_ahead": 1.5}}):
            with self.subTest(values=values):
                with self.assertRaises(config.ConfigError):
                    compact.parse_compact_settings(values)


if __name__ == "__main__":
    unittest.main()
