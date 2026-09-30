<!--
@component
The overview's sessions card, read from the page's payload: every session of the range, newest first, with what each
used in it, in a paged table named by its heading. A project picker (the range's projects with their session counts,
which stay the whole range's while a filter holds some back; a picked project stays on offer in a range without it)
and a text filter (every word, in any case, in the title, project or id) narrow the rows, and the count says how many
are shown. The choice lives here, so a new summary keeps it and typing keeps its focus; changing it starts the table at
its first page. The pager shares the heading's row past ten sessions, above the filters. Without a summary the card is
its heading and the filters only.
-->
<script lang="ts">
  import type { SessionListItem } from '../lib/api';
  import { sessionHref, sessionName } from '../lib/costly';
  import { whole } from '../lib/format';
  import { tablePages } from '../lib/paging.svelte';
  import { payload } from '../lib/payload.svelte';
  import { hype } from '../lib/prefs.svelte';
  import {
    SESSION_COLUMNS,
    sessionCells,
    sessionCount,
    sessionMatches,
    sessionProjects,
  } from '../lib/tables';
  import TableView from './TableView.svelte';

  const KEY = 'sessions';

  let project = $state('');
  let text = $state('');

  const all = $derived(payload.summary?.sessions ?? null);
  const shown = $derived(all ? all.filter((session) => sessionMatches(session, project, text)) : []);
  const projects = $derived(sessionProjects(all ?? [], project));
  const count = $derived(all ? sessionCount(shown.length, all.length) : '');
</script>

<section class="card" aria-labelledby="sessions-title">
  {#if all}
    <TableView
      key={KEY}
      columns={SESSION_COLUMNS}
      rows={shown}
      rowKey={(session) => session.session_id}
      {cells}
      {heading}
      {intro}
      empty={all.length ? 'No sessions match the filter.' : 'No sessions in this range.'}
      labelledby="sessions-title"
    />
  {:else}
    {@render heading()}
    {@render intro()}
  {/if}
</section>

{#snippet heading()}
  <h2 id="sessions-title"><span>{hype('Sessions')}</span> <span class="muted">what each used in the range</span></h2>
{/snippet}

{#snippet intro()}
  <div class="table-filters" role="search" aria-label="Filter the sessions">
    <select
      id="sessions-project"
      aria-label="Project"
      bind:value={
        () => project,
        (picked) => {
          project = picked;
          tablePages.forget(KEY);
        }
      }
    >
      <option value="">All projects</option>
      {#each projects as choice (choice.project)}
        <option value={choice.project}>{choice.project} ({whole(choice.count)})</option>
      {/each}
    </select>
    <input
      type="search"
      id="sessions-search"
      aria-label="Filter by title, project or session id"
      placeholder="Title, project or id"
      autocomplete="off"
      spellcheck="false"
      bind:value={
        () => text,
        (typed) => {
          text = typed;
          tablePages.forget(KEY);
        }
      }
    />
    <span class="muted" id="sessions-count" aria-live="polite">{count}</span>
  </div>
{/snippet}

{#snippet cells(session: SessionListItem)}
  {@const values = sessionCells(session)}
  <td class="num">{values[0]}</td>
  <td><a href={sessionHref(session)}>{sessionName(session)}</a><span class="sub">{session.project}</span></td>
  {#each values.slice(1) as value, position (position)}
    <td class="num">{value}</td>
  {/each}
{/snippet}
