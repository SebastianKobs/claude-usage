<!--
@component
The session view's card of calls that named a possible secret location, read from the page's payload: nothing without an
open session that has any. Where a call sent its input out the card is open (`alert`: edged in the critical color, the
heading with a `!` mark, no toggle); otherwise it is folded to a one-line summary with a button that shows them, edged
in the warning color where a call returned a result or may still (`warning`), a plain card for the rest (`quiet`). The
body stays mounted while folded (`hidden`), so the table's page and focus survive, and so does the fold state while the
session refreshes: it is this component's own, and the session view keys its parts by session, so another session
starts folded.
-->
<script lang="ts">
  import { getApp } from '../app/app.svelte';
  import {
    SECRET_COLUMNS,
    secretAlertHeading,
    secretRows,
    secretSummary,
    secretTone,
    type SecretRow,
  } from './secrets';
  import TableView from '../ui/TableView.svelte';

  const { payload } = getApp();

  const session = $derived(payload.session);
  const accesses = $derived(session?.secret_accesses ?? []);
  const tone = $derived(session ? secretTone(session) : null);
  const folded = $derived(tone === 'warning' || tone === 'quiet' ? tone : null);
  const rows = $derived(secretRows(accesses));
  let open = $state(false);
</script>

{#if session && tone === 'alert'}
  <div id="secret-alert" class="card secret-alert" role="region" aria-labelledby="secret-alert-title">
    <h3 class="secret-alert-head" id="secret-alert-title">
      <span class="secret-alert-icon" aria-hidden="true">!</span>{secretAlertHeading(accesses)}
    </h3>
    {@render body(session.session_id, false)}
  </div>
{:else if session && folded}
  <div
    id="secret-alert"
    class={['card', 'secret-folded', folded === 'warning' && 'secret-warning']}
    role="region"
    aria-labelledby="secret-alert-title"
  >
    <div class="secret-folded-line">
      <h3 class="secret-folded-head" id="secret-alert-title">{secretSummary(accesses, folded)}</h3>
      <button type="button" class="link-button" aria-expanded={open} onclick={() => (open = !open)}
        >{open ? 'Hide them' : 'Show them'}</button
      >
    </div>
    {@render body(session.session_id, !open)}
  </div>
{/if}

{#snippet body(sessionId: string, folded: boolean)}
  <div hidden={folded}>
    <p>
      These tool calls named a path that matches a possible secret location. Most severe first: sent to an MCP server or
      a network program, then returned into the conversation (and so to the API), then blocked, failed or empty. Check
      that each was meant.
    </p>
    <TableView
      key={`${sessionId}-secrets`}
      columns={SECRET_COLUMNS}
      {rows}
      rowKey={(row) => row.key}
      {cells}
      labelledby="secret-alert-title"
    />
    <p class="muted">
      Matched against [secrets] patterns in the config: file tools by their path, commands by their words with the
      variables they set (quoted text only where it holds a path), and scripts this transcript wrote and then ran by
      their text. Variables from earlier calls and other scripts are unknown. A result counts whatever it held: a test
      that only mentions a path returns output too.
    </p>
  </div>
{/snippet}

{#snippet cells(row: SecretRow)}
  <td>{row.time}</td>
  <td>{row.agent}</td>
  <td>{row.tool}</td>
  <td
    ><span class="secret-path">{row.path}</span
    >{#if row.via}<span class="secret-via">{row.via}</span>{/if}</td
  >
  <td>{row.pattern}</td>
  <td><span class="secret-severity secret-severity-{row.severity}" aria-hidden="true"></span>{row.reach}</td>
{/snippet}
