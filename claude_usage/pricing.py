"""Estimated cost from the [prices] table of the config: $ per million tokens per model-id prefix, the longest
matching prefix wins. The fast-mode multiplier applies to every token category, cache writes and reads included,
because the cache multipliers stack on top of the fast-mode price. Web searches are a flat fee per search
([fees] web_search_per_1000), not multiplied by fast mode. Not modelled: the 1.1x for US-only inference
(`inference_geo`; not seen in real transcripts) and the Batch API discount."""
from dataclasses import dataclass
from typing import Any

from claude_usage import transcripts

STANDARD_SPEED = "standard"
PER_TOKENS = 1_000_000
PRICE_FIELDS = ("input", "cache_write_5m", "cache_write_1h", "cache_read", "output")
OPTIONAL_FIELDS = {"fast_multiplier": 1.0}
DEFAULT_WEB_SEARCH_PER_1000 = 10.0      # $ per 1,000 web searches (Claude API)
FEE_FIELDS = ("web_search_per_1000",)


class PricingError(Exception):
    """The price table in the config is broken; the message names the model and field."""


@dataclass(frozen=True)
class Price:
    """$ per million tokens of each category for one model prefix."""
    input: float
    cache_write_5m: float
    cache_write_1h: float
    cache_read: float
    output: float
    fast_multiplier: float = 1.0


class Prices(dict[str, Price]):
    """The Price per model prefix, plus the flat web-search fee."""

    def __init__(self, models: dict[str, Price], web_search_per_1000: float) -> None:
        super().__init__(models)
        self.web_search_per_1000 = web_search_per_1000


def parse_number(owner: str, field: str, value: Any) -> float:
    """A price field as a float; raises PricingError for non-numbers and negatives."""
    if isinstance(value, bool) or not isinstance(value, (int, float)) or value < 0:
        where = owner if owner == "fees" else f'prices."{owner}"'
        raise PricingError(f"{where}.{field} must be a non-negative number, got {value!r}")
    return float(value)


def parse_fees(fees: Any) -> float:
    """The web-search fee from the config's [fees] table (default if absent); raises PricingError if broken."""
    if fees is None:
        return DEFAULT_WEB_SEARCH_PER_1000
    if not isinstance(fees, dict):
        raise PricingError(f"fees must be a table with {', '.join(FEE_FIELDS)}")
    unknown = sorted(set(fees) - set(FEE_FIELDS))
    if unknown:
        raise PricingError(f"fees has unknown fields {', '.join(unknown)}")
    return parse_number("fees", "web_search_per_1000", fees.get("web_search_per_1000", DEFAULT_WEB_SEARCH_PER_1000))


def parse_prices(table: dict[str, Any], fees: Any = None) -> Prices:
    """The Price per model prefix from the config's [prices] table and the fee from [fees]; raises PricingError
    for a broken entry."""
    prices = {}
    for model, entry in table.items():
        if not isinstance(entry, dict):
            raise PricingError(f'prices."{model}" must be a table with {", ".join(PRICE_FIELDS)}')
        unknown = sorted(set(entry) - set(PRICE_FIELDS) - set(OPTIONAL_FIELDS))
        if unknown:
            raise PricingError(f'prices."{model}" has unknown fields {", ".join(unknown)}')
        missing = [field for field in PRICE_FIELDS if field not in entry]
        if missing:
            raise PricingError(f'prices."{model}" lacks {", ".join(missing)}')
        values = {field: parse_number(model, field, entry[field]) for field in PRICE_FIELDS}
        for field, default in OPTIONAL_FIELDS.items():
            values[field] = parse_number(model, field, entry.get(field, default))
        prices[model] = Price(**values)
    return Prices(prices, parse_fees(fees))


def price_for(prices: Prices, model: str) -> Price | None:
    """The Price of the longest prefix of model (without a [1m]-style suffix), or None if no prefix matches."""
    base = transcripts.CONTEXT_SUFFIX.sub("", model)
    matches = [prefix for prefix in prices if prefix and base.startswith(prefix)]
    if not matches:
        return None
    return prices[max(matches, key=len)]


def cost(prices: Prices, model: str, speed: str, *, new_input: int, cache_write_5m: int, cache_write_1h: int,
         cache_read: int, output: int) -> float | None:
    """The estimated cost in $ of these token counts, or None for a model without a price. Any speed other than
    standard counts as fast mode."""
    price = price_for(prices, model)
    if price is None:
        return None
    total = (new_input * price.input + cache_write_5m * price.cache_write_5m + cache_write_1h * price.cache_write_1h
             + cache_read * price.cache_read + output * price.output) / PER_TOKENS
    if speed != STANDARD_SPEED:
        total *= price.fast_multiplier
    return total


def web_search_cost(prices: Prices, searches: int) -> float:
    """The fee in $ for a number of web searches."""
    return searches * prices.web_search_per_1000 / 1000
