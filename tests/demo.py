"""A demo for the docs' screenshots: four made-up projects with about 60 sessions over the 30 days the store keeps,
three of them live, written with the builders in helpers.py relative to the time it is built for, and a dashboard
serving it. Never real data: the screenshots in docs/images/ are published.

    make demo [DEMO_PORT=8799]
    PYTHONPATH=tests python3 -m demo [--out DIR] [--port PORT] [--seed N] [--no-serve]

The live sessions show every icon a live card has. The featured one waits for an answer, named a secret it sent out
and one it got back, and is past the compact hint after two compactions. One has a subagent at work. One waits for
permission, which only a prompt from the hook shows, so the tool posts one to the dashboard's socket as the hook
would. Serve reads the demo's own config through XDG_CONFIG_HOME (30 days, no desktop notifications), though a
checkout's config.local.toml still wins over it.
"""
import argparse
import http.client
import json
import os
import random
import shlex
import shutil
import socket
import subprocess
import sys
from collections.abc import Sequence
from dataclasses import dataclass
from datetime import UTC
from datetime import datetime
from datetime import timedelta
from http import HTTPStatus
from pathlib import Path
from typing import Any

from claude_usage import config
from claude_usage import permissions
from claude_usage import server
from claude_usage import tool_kinds

from helpers import HAIKU
from helpers import TMP_DIR
from helpers import ProjectsDir
from helpers import Transcript
from helpers import create_result
from helpers import edit_result
from helpers import text_block
from helpers import thinking_block
from helpers import tool_use_block
from helpers import usage

CHECKOUT = Path(__file__).resolve().parent.parent       # serve runs this checkout's package
DEMO_DIR = TMP_DIR / "demo"                             # short enough for the socket's path, and `make clean` goes
MARKER = ".claude-usage-demo"                           # build replaces only a folder it made
DEFAULT_PORT = 8799                                     # next to the dashboard's 8765, not on it
SEED = 11
INTERRUPTED = 130
STOP_TIMEOUT = 10                                       # seconds serve gets to stop before it is killed
CONFIG_TEXT = "# the demo dashboard's config (tests/demo.py)\nretention_days = 30\n\n[notify]\nenabled = false\n"
DAYS = 30
VERSION = "2.1.283"
OPUS = "claude-opus-5-5"
SONNET = "claude-sonnet-5"
OVERHEAD = 22_000                   # a main thread's first context: system prompt, tools and CLAUDE.md
AGENT_OVERHEAD = 14_000

FEATURED_SESSION = "5e55a0e1-7d1c-4b8e-a2f4-3c9d0b6e1f20"
BUSY_SESSION = "b0551e55-2a6f-4c3d-8e1b-7f0a9c2d4e61"
PERMISSION_SESSION = "7a0c4b11-9e2d-4f3a-b8c6-1d5e7f9a2b03"

PROJECT_WEIGHTS = {"/home/dev/webshop": 0.4, "/home/dev/api-gateway": 0.27, "/home/dev/infra": 0.2,
                   "/home/dev/docs-site": 0.13}
MODEL_WEIGHTS = {OPUS: 0.55, SONNET: 0.37, HAIKU: 0.08}
EFFORTS = {OPUS: ["medium", "high", "high", "high", "xhigh", "max"], SONNET: ["low", "medium", "medium", "high"],
           HAIKU: [None]}
SKILLS = [None, None, "code-review", "dataviz", "simplify"]
RATE_LIMITED = (6, 17)              # the past sessions, by number, that hit the five-hour limit
FILES = ["src/cart/service.py", "src/cart/models.py", "src/payments/stripe.py", "src/api/routes.py",
         "tests/test_cart.py", "web/src/Checkout.tsx", "web/src/hooks/useCart.ts", "README.md"]
CODE_LINE = "    result = compute_total(items, discount=discount, currency=currency)  # keep rounding in one place\n"
PROMPTS = ["Add a coupon field to the checkout", "Why does the cart total round wrong?", "Refactor the payment client",
           "Write tests for the discount rules", "Fix the flaky login test", "Split the routes module",
           "Update the docs for the new API", "Make the build pass again", "Add retry to the webhook handler",
           "Clean up the Terraform module for the queue"]
TITLES = ["Cart: coupon codes", "Webhook retries", "Docs for the v2 API", "Fix rounding in the cart total",
          "Queue autoscaling", "Split the routes module", "Flaky login test", "Payment client refactor",
          "Changelog for 2.4", "Terraform state import", "Auth middleware tests", "Product search filters",
          "Order e-mails", "Inventory sync job", "Faster product images", "Session cookie hardening",
          "Migrate to the new ORM", "CI cache for node_modules", "Search: typo tolerance", "Refund API",
          "Dark mode for the shop", "Kubernetes probes", "OpenAPI spec cleanup", "Price rounding tests",
          "Admin: bulk edit", "Helm chart values", "Onboarding guide", "Retry budget for the client",
          "Cart: guest checkout", "Webhook signature check", "API rate-limit headers", "Tax rules per country",
          "Terraform: VPC peering", "Wishlist sync", "Postgres index review", "Email templates in MJML",
          "Fix the timezone bug in reports", "Stripe: 3-D Secure flow", "Upgrade to React 20", "Sitemap generator",
          "Log sampling for the gateway", "Blue-green deploy script", "Feature flags cleanup", "Coupon expiry job",
          "Image CDN fallback", "GraphQL pagination", "Password reset flow", "Load test for the gateway",
          "Nightly backup check", "Order status webhooks", "Docs: search index", "Cart: saved for later",
          "Secrets in the CI pipeline", "Gateway: circuit breaker", "Shipping cost estimates", "Docs: versioned pages",
          "Terraform: cost tags", "Product reviews moderation", "Retry on 429 in the SDK", "A11y pass on checkout",
          "Split the monolith config", "Cron jobs to Kubernetes", "Invoice PDF export", "Search ranking tweaks",
          "Stale cache after deploy", "Docs: API examples"]


class DemoError(Exception):
    """The demo couldn't be built or served; the message says why."""


@dataclass(frozen=True)
class DemoPaths:
    """Where a demo lives: its projects folder, the store its dashboard keeps, and the config folder serve reads."""
    root: Path

    @property
    def projects(self) -> Path:
        """The made-up ~/.claude/projects."""
        return self.root / "projects"

    @property
    def store(self) -> Path:
        """The demo dashboard's store; the permission socket goes next to it."""
        return self.root / "usage.sqlite"

    @property
    def config_home(self) -> Path:
        """What serve gets as XDG_CONFIG_HOME."""
        return self.root / "config"


@dataclass(frozen=True)
class SessionSpec:
    """One past session to write: where, when, with which model, and what happens in it."""
    number: int
    project: str
    title: str
    start: datetime
    model: str
    effort: str | None
    prompts: int
    compact_at: int | None          # compact after the reply that takes the context past this
    subagents: int
    ultracode: bool
    workflow: bool
    rate_limit: bool
    skill: str | None


def config_file(paths: DemoPaths) -> Path:
    """The config file serve reads with the demo's config folder."""
    return config.user_config_file({"XDG_CONFIG_HOME": str(paths.config_home)})


def code_text(chars: int) -> str:
    """Code-looking text of this many characters, for tool results and written files."""
    return (CODE_LINE * (chars // len(CODE_LINE) + 1))[:chars]


class Totals:
    """What a session's transcripts used per model, as [new input, cache writes, cache reads, output], for its
    cost-state."""

    def __init__(self) -> None:
        self.by_model: dict[str, list[int]] = {}

    def add(self, model: str, new_input: int, cache_write: int, cache_read: int, output: int) -> None:
        """Count one call."""
        entry = self.by_model.setdefault(model, [0, 0, 0, 0])
        for index, value in enumerate((new_input, cache_write, cache_read, output)):
            entry[index] += value


class Writer:
    """One transcript being written call by call: the context it carries, which grows by what each call added, the
    call ids, and the run totals its cost-state reports."""

    def __init__(self, transcript: Transcript, model: str, effort: str | None, totals: Totals, rng: random.Random,
                 overhead: int = OVERHEAD, cache: str = "1h") -> None:
        self.transcript = transcript
        self.model = model
        self.effort = effort
        self.totals = totals
        self.rng = rng
        self.overhead = overhead
        self.cache = cache                  # the main thread writes the 1-hour cache, agents the 5-minute one
        self.context = 0
        self.last_output = 0
        self.added_chars = 0.0              # what the next call sends beyond the last context and reply
        self.after_compact: int | None = None
        self.count = 0
        self.tag = f"{transcript.session_id[:8]}-{transcript.agent_id or 'main'}"
        self.skill: str | None = None
        self.api_ms = 0
        self.tool_ms = 0
        self.lines_added = 0
        self.lines_removed = 0

    @property
    def clock(self) -> datetime:
        """When the next record is written."""
        return self.transcript.clock

    def wait(self, seconds: float) -> None:
        """Move the clock on."""
        self.transcript.at(self.clock + timedelta(seconds=seconds))

    def next_id(self) -> str:
        """A new id, unique in the demo."""
        self.count += 1
        return f"{self.tag}-{self.count}"

    def call(self, blocks: list[dict[str, Any]], output: int, **fields: Any) -> None:
        """An API call: it reads the last context from the cache and writes what was added since, or after a
        compaction reads only the fixed overhead and writes the rest."""
        new_input = self.rng.randint(3, 14)
        growth = int(self.added_chars / tool_kinds.CHARS_PER_TOKEN)
        self.added_chars = 0.0
        if self.context == 0:
            cache_read, cache_write = 0, self.overhead + growth
        elif self.after_compact is not None:
            cache_read, cache_write = self.overhead, self.after_compact - self.overhead
            self.after_compact = None
        else:
            cache_read, cache_write = self.context, self.last_output + growth
        call_usage = usage(new=new_input, cache_1h=cache_write if self.cache == "1h" else 0,
                           cache_5m=cache_write if self.cache == "5m" else 0, cache_read=cache_read, output=output)
        seconds = max(2.0, output / self.rng.uniform(55, 80) + self.rng.uniform(1.0, 3.0))
        self.api_ms += int(seconds * 1000)
        self.wait(seconds)
        if self.effort is not None:
            fields = {"effort": self.effort, **fields}
        self.transcript.assistant(self.next_id(), blocks, call_usage, model=self.model, **fields)
        self.context = new_input + cache_read + cache_write
        self.last_output = output
        self.totals.add(self.model, new_input, cache_write, cache_read, output)

    def tool(self, name: str, tool_input: dict[str, Any], result: str, seconds: float = 2.0,
             is_error: bool | None = None, answered: bool = True, **result_fields: Any) -> str:
        """A call of one tool and, unless not answered yet, its result; returns the tool_use id."""
        tool_id = f"toolu_{self.next_id()}"
        attribution = {}
        if name.startswith("mcp__"):
            _, server_name, tool = name.split("__")
            attribution = {"attributionMcpServer": server_name, "attributionMcpTool": tool}
        elif self.skill is not None:
            attribution = {"attributionSkill": self.skill}
        self.call([thinking_block(), tool_use_block(tool_id, name, tool_input)], self.rng.randint(90, 420),
                  **attribution)
        if answered:
            self.wait(seconds)
            self.tool_ms += int(seconds * 1000)
            self.result(tool_id, result, is_error, **result_fields)
        return tool_id

    def result(self, tool_id: str, text: str, is_error: bool | None = None, **fields: Any) -> None:
        """A tool's result, which the next call adds to the context."""
        self.transcript.tool_result(tool_id, text, is_error=is_error, **fields)
        self.added_chars += len(text) + 140

    def prompt(self, text: str, gap: float) -> None:
        """A prompt of the user's, gap seconds after the last record."""
        self.wait(gap)
        self.transcript.user(text)
        self.added_chars += len(text) + 90

    def reply(self, text: str = "Done: the change is in and the tests pass.") -> None:
        """The call that answers the prompt."""
        self.call([thinking_block(), text_block(text)], self.rng.randint(400, 1800))

    def compact(self) -> None:
        """A /compact: its boundary record and summary, and a next call that starts from the summary."""
        duration_ms = self.rng.randint(45_000, 95_000)
        self.wait(duration_ms / 1000)
        self.transcript.compaction(record_id=f"cmp-{self.next_id()}", trigger="manual",
                                   pre_tokens=self.context + self.last_output + self.rng.randint(0, 800),
                                   post_tokens=self.rng.randint(7_000, 12_000), duration_ms=duration_ms)
        self.transcript.user("This session is being continued from a previous conversation.", isCompactSummary=True)
        self.after_compact = self.rng.randint(40_000, 50_000)


def work_step(writer: Writer, project: str, heavy: bool = False) -> None:
    """One tool call of everyday coding work, picked at random: reading, searching, editing, testing, git."""
    rng = writer.rng
    path = f"{project}/{rng.choice(FILES)}"
    choice = rng.random()
    if choice < 0.30:
        writer.tool("Read", {"file_path": path},
                    code_text(rng.randint(3000, 9000) if heavy else rng.randint(1500, 5000)))
    elif choice < 0.42:
        writer.tool("Grep", {"pattern": rng.choice(["def checkout", "apply_discount", "useCart", "TODO"]),
                             "path": "src", "output_mode": "content", "-n": True}, code_text(rng.randint(600, 2400)))
    elif choice < 0.48:
        writer.tool("Glob", {"pattern": "src/**/*.py"}, code_text(rng.randint(200, 700)))
    elif choice < 0.62:
        added = rng.randint(2, 14)
        removed = rng.randint(0, 6)
        writer.lines_added += added
        writer.lines_removed += removed
        lines = [f"+line {index}" for index in range(added)] + [f"-line {index}" for index in range(removed)]
        writer.tool("Edit", {"file_path": path, "old_string": "total = 0", "new_string": "total = Decimal(0)"},
                    f"The file {path} has been updated.", toolUseResult=edit_result([*lines, " context"]))
    elif choice < 0.72:
        command = rng.choice(["pytest -q tests/test_cart.py", "npm run lint", "python -m pytest -x -q",
                              "npm test -- --watch=false"])
        writer.tool("Bash", {"command": command, "description": "Run the tests"}, code_text(rng.randint(400, 3000)),
                    seconds=rng.uniform(4, 40))
    elif choice < 0.80:
        command = rng.choice(["git status --short", "git diff --stat", "git log --oneline -10", "git diff src/cart"])
        writer.tool("Bash", {"command": command, "description": "Check the working tree"},
                    code_text(rng.randint(200, 2500)))
    elif choice < 0.87:
        command = rng.choice(["sed -n '40,120p' src/cart/service.py", "rg -n 'discount' src", "ls -la src/cart",
                              "head -50 web/src/Checkout.tsx"])
        writer.tool("Bash", {"command": command, "description": "Look at the code"}, code_text(rng.randint(500, 3000)))
    elif choice < 0.93:
        writer.tool("mcp__codebase__search_graph", {"query": rng.choice(["checkout", "discount", "cart total"])},
                    code_text(rng.randint(400, 1600)))
    elif choice < 0.97:
        content = code_text(rng.randint(800, 2500))
        writer.lines_added += content.count("\n")
        writer.tool("Write", {"file_path": f"{project}/src/cart/rounding.py", "content": content},
                    "File created successfully.", toolUseResult=create_result(content))
    else:
        writer.tool("Bash", {"command": "npm run build", "description": "Build"},
                    "error: type mismatch in Checkout.tsx", is_error=True, seconds=12)


def spawn_subagent(projects: ProjectsDir, main: Writer, project: str, agent_id: str, agent_type: str, model: str,
                   steps: int, description: str, busy: bool = False) -> Writer:
    """The main thread calls Agent, and the subagent explores and hands back its summary; a busy one is still in a
    Bash call, so the main thread's Agent call has no result either."""
    tool_id = f"toolu_{main.next_id()}"
    main.call([thinking_block(), tool_use_block(tool_id, "Agent", {"subagent_type": agent_type,
                                                                   "description": description,
                                                                   "prompt": "Look into it and report back."})],
              main.rng.randint(200, 500))
    transcript = projects.subagent(main.transcript.session_id, agent_id, project=project, version=VERSION,
                                   meta={"agentType": agent_type, "description": description, "toolUseId": tool_id})
    agent = Writer(transcript.at(main.clock + timedelta(seconds=1)), model, None if model == HAIKU else main.effort,
                   main.totals, main.rng, overhead=AGENT_OVERHEAD, cache="5m")
    transcript.user("Look into it and report back.")
    for _ in range(steps):
        work_step(agent, project, heavy=True)
    if busy:
        agent.tool("Bash", {"command": "pytest -q tests/integration", "description": "Run the integration tests"},
                   "", answered=False)
        return agent
    agent.reply("Found it: the discount is applied twice, once in the cart and once at checkout.")
    main.transcript.at(agent.clock)
    main.result(tool_id, code_text(main.rng.randint(1500, 3500)))
    return agent


def run_workflow(projects: ProjectsDir, main: Writer, project: str) -> None:
    """A Workflow run of three review agents, each handing its result back with StructuredOutput."""
    session_id = main.transcript.session_id
    tool_id = f"toolu_{main.next_id()}"
    main.call([thinking_block(), tool_use_block(tool_id, "Workflow", {"script": "…"})], 300)
    run_id = f"wf_{session_id[:6]}review"
    end = main.clock
    for number, phase in enumerate(["Review", "Review", "Verify"]):
        transcript = projects.workflow_agent(session_id, run_id, f"w{number}{session_id[:4]}", project=project,
                                             meta={"workflowPhase": phase, "description": f"review part {number + 1}"},
                                             name="review-changes", version=VERSION)
        agent = Writer(transcript.at(main.clock + timedelta(seconds=1 + number)), SONNET, "high", main.totals,
                       main.rng, overhead=12_000, cache="5m")
        transcript.user("Review this part of the diff.")
        for _ in range(main.rng.randint(4, 8)):
            work_step(agent, project)
        agent.tool("StructuredOutput", {"findings": []}, "Structured output provided successfully")
        end = max(end, agent.clock)
    main.transcript.at(end)
    main.result(tool_id, code_text(1800))


def new_session(projects: ProjectsDir, session_id: str, project: str, start: datetime, model: str,
                effort: str | None, rng: random.Random) -> Writer:
    """A main transcript that starts, as many do, with a record without cwd."""
    transcript = projects.session(session_id, project=project, version=VERSION).at(start)
    transcript.queue_operation()
    return Writer(transcript, model, effort, Totals(), rng)


def cost_state(main: Writer, start: datetime, background: tuple[int, int]) -> None:
    """The cost-state Claude Code writes when the process ends: the transcripts' totals, plus background Haiku calls
    (new input, output) for titles and classifiers, which no transcript holds."""
    main.wait(2)
    main.transcript.record("system", subtype="turn_duration", uuid=f"end-{main.transcript.session_id}")
    model_usage = {model: (*values, 0.0) for model, values in main.totals.by_model.items()}
    new_input, cache_write, cache_read, output = main.totals.by_model.get(HAIKU, [0, 0, 0, 0])
    model_usage[HAIKU] = (new_input + background[0], cache_write, cache_read, output + background[1], 0.0)
    main.transcript.cost_state(model_usage, start=start,
                               totalDuration=int((main.clock - start).total_seconds() * 1000),
                               totalAPIDuration=int(main.api_ms * 1.04), totalAPIDurationWithoutRetries=main.api_ms,
                               totalToolDuration=main.tool_ms, totalLinesAdded=main.lines_added,
                               totalLinesRemoved=main.lines_removed)


def past_specs(now: datetime, rng: random.Random) -> list[SessionSpec]:
    """The finished sessions: two to four a weekday, at most one a weekend day, the last 30 days up to 8 hours ago."""
    specs = []
    titles = list(TITLES)
    rng.shuffle(titles)
    midnight = now.astimezone().replace(hour=0, minute=0, second=0, microsecond=0)     # the store's days are local
    number = 0
    for days_ago in range(DAYS - 1, -1, -1):
        day = midnight - timedelta(days=days_ago)
        weekend = day.weekday() >= 5
        for slot in range(rng.choice([0, 1]) if weekend else rng.choice([2, 2, 3, 3, 4])):
            number += 1
            start = day + timedelta(hours=6 + slot * 3 + rng.uniform(0, 2))
            if start > now - timedelta(hours=8):
                continue
            model = rng.choices(list(MODEL_WEIGHTS), weights=list(MODEL_WEIGHTS.values()))[0]
            effort = rng.choice(EFFORTS[model])
            specs.append(SessionSpec(
                number=number, project=rng.choices(list(PROJECT_WEIGHTS), weights=list(PROJECT_WEIGHTS.values()))[0],
                title=titles.pop() if titles else rng.choice(TITLES), start=start, model=model, effort=effort,
                prompts=rng.randint(6, 26) if model == OPUS else rng.randint(4, 16),
                compact_at=rng.randint(220_000, 260_000) if model == OPUS else None,
                subagents=rng.randint(0, 3) if model != HAIKU else 0,
                ultracode=model == OPUS and effort == "xhigh" and rng.random() < 0.6,
                workflow=rng.random() < 0.12, rate_limit=number in RATE_LIMITED, skill=rng.choice(SKILLS)))
    return specs


def past_session(projects: ProjectsDir, spec: SessionSpec, rng: random.Random) -> None:
    """A finished session: prompts, each with some work and a reply, and what the spec adds."""
    session_id = f"{spec.number:08x}-4c1d-4e2a-9b7f-{spec.number:012x}"
    main = new_session(projects, session_id, spec.project, spec.start, spec.model, spec.effort, rng)
    for index in range(spec.prompts):
        main.prompt(rng.choice(PROMPTS), 1 if index == 0 else rng.uniform(20, 240))
        if index == 0:
            main.transcript.ai_title(spec.title)
        if spec.ultracode and index == spec.prompts // 2:
            main.transcript.ultracode(f"ultra-on-{session_id}")
            main.effort = "xhigh"
        if spec.ultracode and index == spec.prompts // 2 + 3:
            main.transcript.ultracode(f"ultra-off-{session_id}", reminder=None)
            main.effort = spec.effort
        main.skill = spec.skill if index % 4 == 1 else None
        for _ in range(rng.randint(3, 9)):
            work_step(main, spec.project)
        if spec.subagents and index % max(1, spec.prompts // spec.subagents) == 1:
            spawn_subagent(projects, main, spec.project, f"a{spec.number}x{index}",
                           rng.choice(["Explore", "general-purpose"]), HAIKU if rng.random() < 0.6 else SONNET,
                           rng.randint(6, 14), "Find where the total is set")
        if spec.workflow and index == 2:
            run_workflow(projects, main, spec.project)
        if spec.rate_limit and index == spec.prompts - 2:
            main.wait(30)
            main.transcript.api_error(f"limit-{session_id}", resets_at=main.clock + timedelta(minutes=48))
            main.wait(48 * 60)
        main.reply()
        if spec.compact_at is not None and main.context > spec.compact_at:
            main.compact()
    cost_state(main, spec.start, (rng.randint(20_000, 60_000), rng.randint(1_500, 4_000)))
    set_mtimes(session_files(projects, session_id, spec.project))


def featured_session(projects: ProjectsDir, now: datetime, rng: random.Random) -> None:
    """The session the session view's screenshots show, ending 50 s before now: two compactions, subagents, a
    workflow run and ultracode in its first stretch, a secret named twice in its third, past the compact hint, and a
    question waiting for the user."""
    project = "/home/dev/webshop"
    main = new_session(projects, FEATURED_SESSION, project, now - timedelta(hours=5), OPUS, "high", rng)
    main.prompt("Build the split-payment step for the checkout", 1)
    main.transcript.ai_title("Checkout: split payment step")
    compact_at = (255_000, 240_000)
    stretch = 0
    prompt_number = 0
    while stretch < 2 or main.after_compact is not None or main.context <= 212_000:
        prompt_number += 1
        for _ in range(rng.randint(3, 7)):
            work_step(main, project, heavy=prompt_number % 3 == 0)
        if stretch == 0 and prompt_number == 3:
            spawn_subagent(projects, main, project, "b1", "Explore", HAIKU, 12, "Map the checkout flow")
        if stretch == 0 and prompt_number == 5:
            run_workflow(projects, main, project)
        if stretch == 0 and prompt_number == 8:
            main.transcript.ultracode("ultra-on-featured")
            main.effort = "xhigh"
        if stretch == 0 and prompt_number == 11:
            main.transcript.ultracode("ultra-off-featured", reminder=None)
            main.effort = "high"
        if stretch == 2 and prompt_number == 6:
            main.tool("Bash", {"command": "cat .env", "description": "Check the Stripe settings"},
                      "STRIPE_KEY=sk_test_demo_not_a_real_key\nDATABASE_URL=postgres://demo@localhost/shop\n")
            main.tool("Bash", {"command": "scp .env deploy@staging.example.com:/srv/webshop/",
                               "description": "Copy the settings to staging"}, "")
        main.reply()
        if stretch < 2 and main.context > compact_at[stretch]:
            main.compact()
            stretch += 1
            prompt_number = 0
        main.prompt(rng.choice(PROMPTS), rng.uniform(15, 90))
    spawn_subagent(projects, main, project, "b2", "general-purpose", SONNET, 9, "Check the refund path")
    main.prompt("Should the split also cover gift cards?", 25)
    for _ in range(3):
        work_step(main, project)
    main.tool("AskUserQuestion", {"questions": [{"question": "Should gift cards count toward the split?",
                                                 "header": "Gift cards", "multiSelect": False,
                                                 "options": [{"label": "Yes"}, {"label": "No"}]}]}, "", answered=False)
    end_at(session_files(projects, FEATURED_SESSION, project), now - timedelta(seconds=50))


def busy_session(projects: ProjectsDir, now: datetime, rng: random.Random) -> None:
    """A session whose subagent is still running the integration tests, quiet for 37 minutes."""
    project = "/home/dev/api-gateway"
    main = new_session(projects, BUSY_SESSION, project, now - timedelta(hours=1), SONNET, "medium", rng)
    main.prompt("Add rate limiting to the public routes", 1)
    main.transcript.ai_title("Rate limiting for public routes")
    for _ in range(3):
        for _ in range(rng.randint(4, 8)):
            work_step(main, project)
        main.reply()
        main.prompt(rng.choice(PROMPTS), rng.uniform(20, 80))
    for _ in range(4):
        work_step(main, project)
    spawn_subagent(projects, main, project, "c1", "general-purpose", SONNET, 7, "Run and fix the integration tests",
                   busy=True)
    end_at(session_files(projects, BUSY_SESSION, project), now - timedelta(minutes=37))


def permission_session(projects: ProjectsDir, now: datetime, rng: random.Random) -> None:
    """A session whose Bash call waits for permission since 15 minutes; only a prompt from the hook shows that."""
    project = "/home/dev/infra"
    main = new_session(projects, PERMISSION_SESSION, project, now - timedelta(hours=1), OPUS, "medium", rng)
    main.prompt("Clean up the Terraform module for the queue", 1)
    main.transcript.ai_title("Terraform: queue module cleanup")
    for _ in range(2):
        for _ in range(rng.randint(5, 9)):
            work_step(main, project)
        main.reply()
        main.prompt(rng.choice(PROMPTS), rng.uniform(20, 60))
    work_step(main, project)
    main.tool("Bash", {"command": "terraform plan -out plan.bin", "description": "Plan the change"}, "",
              answered=False)
    end_at(session_files(projects, PERMISSION_SESSION, project), now - timedelta(minutes=15))


def session_files(projects: ProjectsDir, session_id: str, project: str) -> list[Path]:
    """A session's main transcript and every file in its folder: subagents, workflow runs and their meta files."""
    main = projects.project_dir(project) / f"{session_id}.jsonl"
    folder = main.with_suffix("")
    return [main, *(sorted(path for path in folder.rglob("*") if path.is_file()) if folder.exists() else [])]


def is_transcript(path: Path) -> bool:
    """A file of records with times: not a meta file, a run's name or its journal."""
    return path.suffix == ".jsonl" and path.name != "journal.jsonl"


def record_time(record: dict[str, Any]) -> datetime | None:
    """A record's timestamp; None for records without one (titles, cost-states)."""
    stamp = record.get("timestamp")
    return datetime.fromisoformat(stamp) if stamp else None


def last_time(path: Path) -> datetime | None:
    """The latest record time in a transcript."""
    times = [record_time(json.loads(line)) for line in path.read_text(encoding="utf-8").splitlines()]
    return max((time for time in times if time is not None), default=None)


def end_at(files: list[Path], end: datetime) -> None:
    """Move every record time of a session so its latest is end: a live session is written from a guessed start,
    since how long it runs comes out of its random work. Then set the mtimes, since liveness goes by them."""
    latest = max(time for time in (last_time(path) for path in files if is_transcript(path)) if time is not None)
    shift = end - latest
    for path in filter(is_transcript, files):
        lines = []
        for line in path.read_text(encoding="utf-8").splitlines():
            record = json.loads(line)
            moment = record_time(record)
            if moment is not None:
                record["timestamp"] = f"{moment + shift:%Y-%m-%dT%H:%M:%S}.000Z"
            if "startTime" in record:
                record["startTime"] += int(shift.total_seconds() * 1000)
            lines.append(json.dumps(record, ensure_ascii=False))
        path.write_text("".join(f"{line}\n" for line in lines), encoding="utf-8")
    set_mtimes(files)


def set_mtimes(files: list[Path]) -> None:
    """Give each transcript its last record's time as mtime and the other files the session's last: the dashboard
    counts a session live by its files' mtimes, which writing them just now would make of every one."""
    ends = {path: last_time(path) for path in files if is_transcript(path)}
    session_end = max(time for time in ends.values() if time is not None)
    for path in files:
        stamp = (ends.get(path) or session_end).timestamp()
        os.utime(path, (stamp, stamp))


def clear(paths: DemoPaths) -> None:
    """An empty demo folder with its marker: an earlier demo is removed, anything else is left alone."""
    root = paths.root
    if root.exists() and any(root.iterdir()):
        if not (root / MARKER).exists():
            raise DemoError(f"{root} isn't a demo folder (it has no {MARKER}), so it is left alone")
        socket_path = permissions.socket_path(paths.store)
        if server.HAS_UNIX_SOCKETS and socket_path.exists() and server.socket_answers(socket_path):
            raise DemoError(f"a demo dashboard still runs on {root}; stop it first")
        shutil.rmtree(root)
    root.mkdir(parents=True, exist_ok=True)
    (root / MARKER).write_text("made by tests/demo.py; building again replaces this folder\n", encoding="utf-8")


def build(root: Path, now: datetime, seed: int = SEED) -> DemoPaths:
    """The demo in root for the time now: the same now and seed write the same files. Raises DemoError for a folder
    that isn't an earlier demo, one whose dashboard still runs, or a record that came out after now."""
    paths = DemoPaths(root)
    clear(paths)
    rng = random.Random(seed)
    projects = ProjectsDir(paths.projects)
    for spec in past_specs(now, rng):
        past_session(projects, spec, rng)
    featured_session(projects, now, rng)
    busy_session(projects, now, rng)
    permission_session(projects, now, rng)
    latest = max(time for time in map(last_time, filter(is_transcript, paths.projects.rglob("*"))) if time)
    if latest > now:
        raise DemoError(f"a record came out at {latest:%Y-%m-%d %H:%M}, after {now:%Y-%m-%d %H:%M}")
    config_file(paths).parent.mkdir(parents=True, exist_ok=True)
    config_file(paths).write_text(CONFIG_TEXT, encoding="utf-8")
    return paths


def hook_input(session_id: str, tool: str) -> dict[str, Any]:
    """What Claude Code gives the PermissionRequest hook, as far as the dashboard reads it."""
    return {"hook_event_name": permissions.HOOK_EVENT, "session_id": session_id, "tool_name": tool,
            "permission_mode": "default"}


class UnixConnection(http.client.HTTPConnection):
    """An HTTP connection over a Unix socket, as the hook's curl --unix-socket makes it."""

    def __init__(self, path: Path, timeout: float = 5.0) -> None:
        super().__init__("localhost", timeout=timeout)
        self.socket_path = path

    def connect(self) -> None:
        """Connect to the socket instead of a host and port."""
        self.sock = socket.socket(socket.AF_UNIX, socket.SOCK_STREAM)
        self.sock.settimeout(self.timeout)
        self.sock.connect(str(self.socket_path))


def post_prompt(socket_path: Path, given: dict[str, Any]) -> None:
    """Post a hook input to a dashboard's prompt socket, as the permission hook does; raises DemoError where no
    dashboard answers or it refuses the input."""
    connection = UnixConnection(socket_path)
    try:
        connection.request("POST", server.PROMPT_PATH, body=json.dumps(given).encode("utf-8"),
                           headers={"Content-Type": "application/json"})
        response = connection.getresponse()
        response.read()
    except (OSError, http.client.HTTPException) as exc:
        raise DemoError(f"can't post a permission prompt to {socket_path}: {exc}") from exc
    finally:
        connection.close()
    if response.status != HTTPStatus.NO_CONTENT:
        raise DemoError(f"the dashboard refused the permission prompt ({response.status} {response.reason})")


def serve_command(paths: DemoPaths, port: int) -> tuple[list[str], dict[str, str]]:
    """The command that serves the demo, and its environment: the checkout's dashboard on the demo's transcripts and
    store, reading the demo's config."""
    command = [sys.executable, "-m", "claude_usage", "serve", "--projects-dir", str(paths.projects),
               "--store", str(paths.store), "--port", str(port)]
    return command, {**os.environ, "XDG_CONFIG_HOME": str(paths.config_home)}


def start_dashboard(paths: DemoPaths, port: int) -> tuple["subprocess.Popen[str]", str]:
    """Start serving the demo, echoing what serve prints up to its link; returns the process and the link. Serve runs
    in a session of its own, so Ctrl+C reaches only this tool, which then stops it (stop_dashboard). Raises
    DemoError if serve stops before it serves."""
    command, environment = serve_command(paths, port)
    process = subprocess.Popen(command, cwd=CHECKOUT, env=environment, stdout=subprocess.PIPE, text=True,
                               encoding="utf-8", start_new_session=True)
    for line in process.stdout or ():
        print(line, end="", flush=True)
        if line.startswith("Serving "):
            return process, line.split()[1]
    code = stop_dashboard(process)
    raise DemoError(f"the dashboard stopped before it served (exit code {code})")


def relay_dashboard(process: "subprocess.Popen[str]") -> int:
    """Echo what serve prints until it stops; returns its exit code."""
    for line in process.stdout or ():
        print(line, end="", flush=True)
    return stop_dashboard(process)


def stop_dashboard(process: "subprocess.Popen[str]") -> int:
    """Stop serve (SIGTERM stops it like Ctrl+C), killing it if it doesn't within STOP_TIMEOUT; returns its exit
    code. Stopping it again is harmless."""
    if process.poll() is None:
        process.terminate()
        try:
            process.wait(timeout=STOP_TIMEOUT)
        except subprocess.TimeoutExpired:
            process.kill()
            process.wait()
    if process.stdout is not None:
        process.stdout.close()
    return process.returncode


def parse_args(argv: Sequence[str] | None) -> argparse.Namespace:
    """The command line; argparse exits 2 on bad arguments and 0 for --help."""
    parser = argparse.ArgumentParser(prog="demo", description="Made-up transcripts and a dashboard serving them, for "
                                                               "the docs' screenshots. Never real data.")
    parser.add_argument("--out", type=Path, default=DEMO_DIR, metavar="DIR",
                        help=f"the demo's folder, replaced if it holds an earlier demo (default {DEMO_DIR})")
    parser.add_argument("--port", type=int, default=DEFAULT_PORT, help=f"the dashboard's port (default {DEFAULT_PORT})")
    parser.add_argument("--seed", type=int, default=SEED, help=f"another seed builds other sessions (default {SEED})")
    parser.add_argument("--no-serve", action="store_true", help="build the demo and print how to serve it")
    return parser.parse_args(argv)


def main(argv: Sequence[str] | None = None) -> int:
    """Build the demo, then serve it until Ctrl+C with a permission prompt posted; returns the exit code."""
    try:
        args = parse_args(argv)
    except SystemExit as exc:              # --help (0) or bad arguments (2)
        return exc.code if isinstance(exc.code, int) else 2
    process = None
    try:
        paths = build(args.out, datetime.now(UTC).replace(microsecond=0), args.seed)
        print(f"Built the demo in {paths.root}: made-up transcripts, never real data.", flush=True)
        command, _ = serve_command(paths, args.port)
        if args.no_serve:
            print(f"Serve it with: cd {shlex.quote(str(CHECKOUT))} && "
                  f"XDG_CONFIG_HOME={shlex.quote(str(paths.config_home))} {shlex.join(command)}")
            return 0
        process, _ = start_dashboard(paths, args.port)
        try:
            post_prompt(permissions.socket_path(paths.store), hook_input(PERMISSION_SESSION, "Bash"))
            print("Posted a permission prompt for the Terraform session, as the hook would: its card has a padlock.",
                  flush=True)
        except DemoError as exc:
            print(f"demo: {exc}; the padlock won't show", file=sys.stderr)
        return relay_dashboard(process)
    except (DemoError, OSError) as exc:
        print(f"demo: {exc}", file=sys.stderr)
        return 1
    except KeyboardInterrupt:
        return INTERRUPTED
    finally:
        if process is not None:
            stop_dashboard(process)


if __name__ == "__main__":
    sys.exit(main())
