"""The report as text: totals per group, and one session's drilldown, for `report` without --json."""
from typing import Any

from claude_usage import queries


def whole(value: int | None) -> str:
    """A count with thousands separators, or "–"."""
    if value is None:
        return "–"
    return f"{value:,}"



def money(value: float | None) -> str:
    """A cost in dollars, or "–" for no price."""
    if value is None:
        return "–"
    return f"${value:,.2f}"



def size(byte_count: int) -> str:
    """A byte count as B, KB or MB."""
    if byte_count < 1000:
        return f"{byte_count} B"
    if byte_count < 1_000_000:
        return f"{byte_count / 1000:.1f} KB"
    return f"{byte_count / 1_000_000:.1f} MB"



def duration(milliseconds: int) -> str:
    """A duration as hours and minutes, minutes and seconds, or seconds."""
    seconds = round(milliseconds / 1000)
    hours, rest = divmod(seconds, 3600)
    minutes, seconds = divmod(rest, 60)
    if hours:
        return f"{hours} h {minutes} min" if minutes else f"{hours} h"
    if minutes:
        return f"{minutes} min {seconds} s" if seconds else f"{minutes} min"
    return f"{seconds} s"



def runtime_text(runtime: dict[str, Any]) -> str:
    """A session's run totals as one line: from its cost-state record, or marked as estimated from the transcripts
    (which don't show the retries)."""
    estimated = runtime["source"] == "transcripts"
    label = "Run (estimated from the transcripts; tool time includes waiting for permission)" if estimated else "Run"
    retries = ("" if runtime["api_ms_without_retries"] is None
               else f" ({duration(runtime['api_ms_without_retries'])} without retries)")
    return (f"{label}: {duration(runtime['duration_ms'])} wall-clock, API {duration(runtime['api_ms'])}{retries}, "
            f"tools {duration(runtime['tool_ms'])}, lines +{runtime['lines_added']:,} / -{runtime['lines_removed']:,}")



def table(headers: list[str], rows: list[list[str]], right_aligned: set[int]) -> str:
    """A plain-text table; the columns in right_aligned are aligned right (numbers)."""
    widths = [max(len(str(cell)) for cell in column) for column in zip(headers, *rows)]
    lines = []
    for index, row in enumerate([headers, *rows]):
        cells = [str(cell).rjust(width) if column in right_aligned else str(cell).ljust(width)
                 for column, (cell, width) in enumerate(zip(row, widths))]
        lines.append("  ".join(cells).rstrip())
        if index == 0:
            lines.append("  ".join("-" * width for width in widths))
    return "\n".join(lines)



def usage_cells(row: dict[str, Any]) -> list[str]:
    """Turns, input, cache read, output and cost of a usage row."""
    return [whole(row["turns"]), whole(queries.input_total(row)), whole(row["cache_read"]), whole(row["output"]),
            money(row["cost"])]



USAGE_HEADERS = ["Turns", "Input", "Cache read", "Output", "Cost"]



def totals_text(payload: dict[str, Any]) -> str:
    """The report of totals per group as a text table with a total row."""
    group = payload["by"]
    # None: the turns without a skill or MCP server
    rows = [["(none)" if row[group] is None else str(row[group]), *usage_cells(row)] for row in payload["rows"]]
    rows.append(["Total", *usage_cells(payload["totals"])])
    scope = "all time" if payload["since"] is None else f"since {payload['since']}"
    lines = [f"Usage by {group}, {scope}" + (f", project {payload['project_filter']}"
                                            if payload["project_filter"] else ""),
             "", table([group, *USAGE_HEADERS], rows, set(range(1, 6)))]
    if payload["totals"]["web_searches"]:
        lines.append(f"\nIncluding {payload['totals']['web_searches']:,} web searches.")
    if payload["totals"]["unpriced_turns"]:
        lines.append(f"\n{payload['totals']['unpriced_turns']:,} turns of models without a price have no cost.")
    return "\n".join(lines)



def session_text(detail: dict[str, Any]) -> str:
    """The drilldown of one session as text."""
    lines = [f"{detail['title'] or 'Untitled session'}  ({detail['session_id']})",
             f"{detail['project']} · {detail['git_branch'] or '-'} · {detail['first_ts']} – {detail['last_ts']}"]
    if detail["prompt"]:
        lines.append(f"Prompt: {detail['prompt']}")
    agent_rows = []
    tool_rows = []
    for agent in detail["agents"]:
        name = agent["agent_type"] if agent["agent_id"] is None else f"{agent['agent_type']} ({agent['agent_id']})"
        agent_rows.append([name, ", ".join(agent["models"]) or "-", whole(agent["turns"]),
                           f"{whole(agent['context_first'])} -> {whole(agent['context_last'])}",
                           whole(agent["input_total"]), whole(agent["output"]), money(agent["cost"])])
        tool_rows.extend([name, tool["tool"], whole(tool["calls"]), whole(tool["result_chars"])]
                         for tool in agent["tools"])
    lines += ["", table(["Agent", "Models", "Turns", "Context first -> last", "Input total", "Output", "Cost"],
                        agent_rows, {2, 3, 4, 5, 6})]
    if tool_rows:
        lines += ["", table(["Agent", "Tool", "Calls", "Result chars"], tool_rows, {2, 3})]
    model_rows = []
    for model in detail["models"]:
        model_rows.append([model["model"], *usage_cells(model)])
        efforts = sorted((row for row in detail["model_effort"]
                          if row["model"] == model["model"] and row["effort"] is not None),
                         key=lambda row: queries.effort_order(row["effort"]))
        model_rows.extend([f"  {row['effort']}", *usage_cells(row)] for row in efforts)
    if model_rows:
        lines += ["", table(["Model / effort", *USAGE_HEADERS], model_rows, set(range(1, 6)))]
    for key, group, header in (("skills", "skill", "Skill"), ("mcp_servers", "mcp_server", "MCP server")):
        if detail[key]:
            lines += ["", table([header, *USAGE_HEADERS], [[row[group], *usage_cells(row)] for row in detail[key]],
                                set(range(1, 6)))]
    if detail["api_errors"]:
        error_rows = [[event["ts"] or "-", event["error"], str(event["status"] or "-"), event["limit_type"] or "-",
                       event["resets_at"] or "-", event["agent_type"]] for event in detail["api_errors"]]
        lines += ["", table(["API error at", "Error", "Status", "Quota", "Resets", "Agent"], error_rows, set())]
    searches = f", {whole(detail['web_searches'])} web searches" if detail["web_searches"] else ""
    lines += ["", f"Total: {whole(detail['turns'])} turns, {whole(detail['output'])} output tokens{searches}, "
                  f"{money(detail['cost'])}"]
    if detail["runtime"]:
        lines.append(runtime_text(detail["runtime"]))
    return "\n".join(lines)

