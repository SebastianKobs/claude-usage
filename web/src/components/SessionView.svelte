<!--
@component
The session view's frame, read from the page's payload: nothing without an open session. With one it is a card of the
session's heading (with its close link), prompt and facts, what waits for the user, its tile rows, the gauge with the
calls above it (`ContextGauge`), the secret accesses (`SecretAccesses`, before the gauge), the context per turn
(`ContextPerTurn`, after the gauge) and its tables: usage by model, the main thread and subagents, by skill, by MCP
server, the API errors and the tools (`ToolsTable`: after the agents, or, with the main transcript there, after the
API errors, since the conversation then takes its place) and the conversation (`Conversation`: its frame, which
comes after the agents with a transcript, else last).
Another session gets a new view (folds, the conversation and all), which takes the page over while it is there: the
range's filters and summary step aside, focus goes to its heading, and closing it (the link or Escape, which clears
the address's hash) puts the page back.
-->
<script lang="ts">
  import { getApp } from '../lib/app.svelte';
  import { modelSlots } from '../lib/colors';
  import { sessionName } from '../lib/costly';
  import { eventRows } from '../lib/limits';
  import { opening } from '../lib/opening';
  import { sessionFacts } from '../lib/session';
  import { runtimeSource, sessionCostPer100Lines } from '../lib/tiles';
  import { modelRows, usageRows } from '../lib/usage';
  import AgentsTable from './AgentsTable.svelte';
  import ContextGauge from './ContextGauge.svelte';
  import ContextPerTurn from './ContextPerTurn.svelte';
  import Conversation from './Conversation.svelte';
  import EventsTable from './EventsTable.svelte';
  import KpiTiles from './KpiTiles.svelte';
  import RuntimeTiles from './RuntimeTiles.svelte';
  import SecretAccesses from './SecretAccesses.svelte';
  import SessionWaits from './SessionWaits.svelte';
  import ToolsTable from './ToolsTable.svelte';
  import UsageTable from './UsageTable.svelte';

  const { payload, hype } = getApp();

  const session = $derived(payload.session);
  const models = $derived(
    session ? modelRows(session.models, session.model_effort, modelSlots(session.models.map((row) => row.model))) : [],
  );
  const skills = $derived(session ? usageRows(session.skills, (row) => row.skill) : []);
  const servers = $derived(session ? usageRows(session.mcp_servers, (row) => row.mcp_server) : []);
  const errors = $derived(session ? eventRows(session.api_errors) : []);

  /** Closes the view on Escape, unless something in it already took the key (a dialog, a menu). */
  function onkeydown(event: KeyboardEvent): void {
    if (session && event.key === 'Escape' && !event.defaultPrevented) location.hash = '';
  }
</script>

<svelte:document {onkeydown} />

{#if session}
  {@const id = session.session_id}
  {@const runtime = session.runtime}
  <!-- keyed, so another session is a new view: its folds, the conversation and the opening all start over -->
  {#key id}
    <section
      id="drilldown"
      class="card"
      aria-labelledby="drilldown-title"
      {@attach opening({ hide: ['filters', 'summary'], focus: '#drilldown-title' })}
    >
      <div class="chart-head">
        <h2 id="drilldown-title" tabindex="-1">{sessionName(session)}</h2>
        <span class="spacer"></span>
        <!-- an empty hash is the page's own address: the router shows the overview again -->
        <!-- svelte-ignore a11y_invalid_attribute -->
        <a href="#" aria-keyshortcuts="Escape">Close</a>
      </div>
      {#if session.prompt}
        <div class="prompt">{session.prompt}</div>
      {/if}
      <div class="muted">{sessionFacts(session)}</div>
      <SessionWaits />
      <div class="kpis session-kpis">
        <KpiTiles
          totals={session}
          scope="this session"
          context={session.context}
          hintTokens={session.compact_hint_tokens}
          savings={session.compaction_savings}
        />
      </div>
      {#if runtime}
        <!-- the cost record Claude Code writes when its process ends, until then estimated from the transcripts -->
        <div class="kpis session-kpis" role="group" aria-label="Time and lines changed">
          <RuntimeTiles
            {runtime}
            from={runtimeSource(runtime.source)}
            costPer100Lines={sessionCostPer100Lines({ cost: session.cost, runtime })}
          />
        </div>
      {/if}
      <SecretAccesses />
      <ContextGauge />
      <ContextPerTurn />
      <UsageTable
        inline
        id="session-models"
        title={hype('By model')}
        nameLabel="Model"
        rows={models}
        empty="No usage in this range."
        pagerKey="{id}-models"
      />
      <AgentsTable agents={session.agents} pagerKey="{id}-agents" />
      {#if !session.transcript}
        <ToolsTable agents={session.agents} pagerKey="{id}-tools" />
      {/if}
      {#if session.transcript}
        <Conversation />
      {/if}
      <div class="grid-2">
        <div>
          <UsageTable
            inline
            id="session-skills"
            title={hype('By skill')}
            nameLabel="Skill"
            rows={skills}
            empty="No turns attributed to a skill."
            pagerKey="{id}-skills"
          />
        </div>
        <div>
          <UsageTable
            inline
            id="session-mcp-servers"
            title={hype('By MCP server')}
            nameLabel="MCP server"
            rows={servers}
            empty="No turns attributed to an MCP server."
            pagerKey="{id}-mcp-servers"
          />
        </div>
      </div>
      <EventsTable
        id="session-api-errors"
        title={hype('Rate limits and API errors')}
        rows={errors}
        empty="No API errors in this session."
        pagerKey="{id}-api-errors"
        withSession={false}
      />
      {#if session.transcript}
        <ToolsTable agents={session.agents} pagerKey="{id}-tools" />
      {/if}
      {#if !session.transcript}
        <Conversation />
      {/if}
    </section>
  {/key}
{/if}
