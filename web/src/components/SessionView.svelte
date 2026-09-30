<!--
@component
The session view's frame, read from the page's payload: nothing without an open session. With one it is a card of the
session's heading (with its close link), prompt and facts, what waits for the user, its tile rows, and its tables: usage
by model, the main thread and subagents, by skill, by MCP server and the API errors. The parts that have not moved to
components yet (the secret accesses, the call to compact, the gauge and context chart, the tools and the conversation)
are drawn by the old scripts into three empty slots, `#session-top`, `#session-mid` and `#session-end`, which stay the
same nodes while the session's data is refreshed. Another session gets a new view (folds, slots and all), which takes
the page over while it is there: the range's filters and summary step aside, focus goes to its heading, and closing it
(the link or Escape, which clears the address's hash) puts the page back.
-->
<script lang="ts">
  import { modelSlots } from '../lib/colors';
  import { sessionName } from '../lib/costly';
  import { eventRows } from '../lib/limits';
  import { opening } from '../lib/opening';
  import { payload } from '../lib/payload.svelte';
  import { hype } from '../lib/prefs.svelte';
  import { sessionFacts } from '../lib/session';
  import { runtimeSource, sessionCostPer100Lines } from '../lib/tiles';
  import { modelRows, usageRows } from '../lib/usage';
  import AgentsTable from './AgentsTable.svelte';
  import EventsTable from './EventsTable.svelte';
  import KpiTiles from './KpiTiles.svelte';
  import RuntimeTiles from './RuntimeTiles.svelte';
  import SessionWaits from './SessionWaits.svelte';
  import UsageTable from './UsageTable.svelte';

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
  <!-- keyed, so another session is a new view: its folds, slots and the opening all start over -->
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
      <div class="legacy-slot" id="session-top"></div>
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
      <div class="legacy-slot" id="session-mid"></div>
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
      <div class="legacy-slot" id="session-end"></div>
    </section>
  {/key}
{/if}
