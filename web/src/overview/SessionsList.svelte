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
  import type { SessionListItem } from '../api/api';
  import { getApp } from '../app/app.svelte';
  import { sessionHref, sessionName } from './costly';
  import { whole } from '../ui/format';
  import {
    SESSION_COLUMNS,
    sessionCells,
    sessionCount,
    sessionMatches,
    sessionProjects,
  } from '../ui/tables';
  import TableView from '../ui/TableView.svelte';

  const { payload, hype, pages } = getApp();

  const KEY = 'sessions';

  let project = $state('');
  let text = $state('');

  const all = $derived(payload.summary?.sessions ?? null);
  const shown = $derived(all ? all.filter((session) => sessionMatches(session, project, text)) : []);
  const projects = $derived(sessionProjects(all ?? [], project));
  const count = $derived(all ? sessionCount(shown.length, all.length) : '');
  // The columns after the last activity and the session's name, which the cells' first two hold.
  const figureColumns = SESSION_COLUMNS.slice(2);
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
          pages.forget(KEY);
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
          pages.forget(KEY);
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
  {#each figureColumns as column, position (column.label)}
    <td class="num">{values[position + 1]}</td>
  {/each}
{/snippet}
