<!--
@component
The session view's conversation: its own framed section, whose head (the picker of the main thread or a subagent, the
order, the buttons that load and close it) stays in view while scrolling through it, and the conversation loading into
`#chat`, read from the transcript when asked, never stored. Nothing is fetched until "Show conversation"; then the
picker loads that transcript's, and the order button flips the preference and moves the entries, which keep their
nodes. It lists newest first, a call's entries together. A skip button leaves the long list for the note at its end.
The session's refreshes (a new `payload.session` of the same session) read the conversation shown again, drawn only
if it changed: an unchanged entry keeps its object and so its nodes, one that changed (a call that got its result)
updates its own nodes in place, so what the reader opened and what has focus stay, and where the reader has scrolled
into it, the entry at the top of the window stays there. The entries are components (`ConversationEntry`). Close drops
the conversation, and a load under way with it.
-->
<script lang="ts">
  import { tick, untrack } from 'svelte';
  import type { Chat, ChatEntry } from '../api/api';
  import { getApp } from '../app/app.svelte';
  import {
    agentChoices,
    chatNotice,
    chatUrl,
    orderTitle,
    reminderNote,
    reuseEntries,
    sameChat,
  } from './chat';
  import { fetchJson } from '../app/http';
  import { keepScroll, scrollAnchor } from '../ui/scroll';
  import { chatRows } from '../ui/tables';
  import ConversationEntry from './ConversationEntry.svelte';

  const { payload, hype, preferences } = getApp();

  // The picked transcript by the agent's id, '' for the main thread.
  let agentId = $state('');
  // Whether the conversation was asked for and not closed since, loading or loaded.
  let shown = $state(false);
  // $state.raw: replaced whole by each read, never changed in place, and large.
  let chat = $state.raw<Chat | null>(null);
  // What stands alone in the place of a conversation: loading, or why loading failed.
  let note = $state<string | null>(null);
  let loadButton = $state<HTMLButtonElement>();
  let chatNode = $state<HTMLElement>();
  let endNode = $state<HTMLElement>();
  // The newest read's number: a read only counts while it is still the newest (quick switches, a close, a refresh).
  let request = 0;

  const choices = $derived(agentChoices(payload.session?.agents ?? []));
  const notice = $derived(chat ? chatNotice(chat) : null);
  const reminders = $derived(chat ? reminderNote(chat.reminders) : null);
  // Each entry's row kept as the same object while its entry and place are the same: an order change or a refresh
  // then hands the row's component nothing new, where a new object would update the entry again.
  const rowOf = new WeakMap<ChatEntry, { key: string; entry: ChatEntry }>();
  const rows = $derived.by(() => {
    if (!chat) return [];
    return chatRows(chat.entries, preferences.oldestFirst).map((row) => {
      const kept = rowOf.get(row.entry);
      if (kept?.key === row.key) return kept;
      rowOf.set(row.entry, row);
      return row;
    });
  });

  /** The conversation of the picked transcript, loaded in place of what is shown. */
  async function load(): Promise<void> {
    const session = payload.session;
    if (!session) return;
    const token = ++request;
    chat = null;
    note = 'Loading…';
    try {
      const answer = await fetchJson<Chat>(chatUrl(session.session_id, agentId || null));
      if (token !== request) return;
      chat = answer;
      note = null;
    } catch (error) {
      if (token === request) note = error instanceof Error ? error.message : String(error);
    }
  }

  /** Asks for the conversation. */
  function show(): void {
    shown = true;
    void load();
  }

  /** Another transcript picked: its conversation replaces the one shown, if one is. The choice is taken from the event,
   *  since the binding may not have seen it yet. */
  function pick(event: Event & { currentTarget: HTMLSelectElement }): void {
    agentId = event.currentTarget.value;
    if (shown) void load();
  }

  /** Drops the conversation, and a load still under way, and returns focus to the button that shows it. */
  function close(): void {
    request++;
    chat = null;
    note = null;
    shown = false;
    loadButton?.focus();
  }

  /** Reads the conversation shown again. A failure leaves it; an answer like it changes nothing; else the entries
   *  that changed are drawn again, the reader's place kept. */
  async function refresh(): Promise<void> {
    const session = payload.session;
    if (!shown || !chat || !session) return;
    const token = ++request;
    let next: Chat;
    try {
      next = await fetchJson<Chat>(chatUrl(session.session_id, agentId || null));
    } catch {
      return; // the conversation shown stays; the next refresh tries again
    }
    if (token !== request || !chat || sameChat(chat, next)) return;
    // with its start in view, new entries (on top, newest first) just show; scrolled into it, the reader stays put
    const anchor =
      chatNode && chatNode.getBoundingClientRect().top < 0
        ? scrollAnchor(chatNode.querySelectorAll('[data-key]'))
        : null;
    chat = reuseEntries(chat, next);
    await tick();
    keepScroll(anchor, anchor?.node);
  }

  // A new session object, for the same session, comes each time the page saw it change.
  $effect(() => {
    void payload.session;
    untrack(() => {
      void refresh();
    });
  });

  // Destroyed with a load under way: its answer is drawn nowhere.
  $effect(() => () => {
    request++;
  });
</script>

<section class="chat-section" id="chat-section" aria-labelledby="chat-heading">
  <div class="chart-head chat-section-head">
    <h3 id="chat-heading">{hype('Conversation')}</h3>
    <span class="muted">read from the transcript when you ask, never stored</span>
    <span class="spacer"></span>
    <select id="chat-agent" aria-label="Conversation of" bind:value={agentId} onchange={pick}>
      {#each choices as item ('group' in item ? `group ${item.group}` : `option ${item.value}`)}
        {#if 'group' in item}
          <optgroup label={item.group}>
            {#each item.options as option (option.value)}
              <option value={option.value}>{option.label}</option>
            {/each}
          </optgroup>
        {:else}
          <option value={item.value}>{item.label}</option>
        {/if}
      {/each}
    </select>
    <!-- an arrow as for any sort: down for newest first (descending), turned up for oldest first -->
    <button
      type="button"
      id="chat-order"
      aria-pressed={preferences.oldestFirst}
      aria-label="Oldest first"
      title={orderTitle(preferences.oldestFirst)}
      onclick={() => (preferences.oldestFirst = !preferences.oldestFirst)}
      ><span class="chat-order-arrow" aria-hidden="true">↓</span></button
    >
    <button type="button" id="chat-load" bind:this={loadButton} onclick={show}
      >{chat ? 'Reload' : 'Show conversation'}</button
    >
    <button type="button" id="chat-close" hidden={!shown} onclick={close}>Close</button>
  </div>
  <div id="chat" bind:this={chatNode}>
    {#if note !== null}
      <div class="empty">{note}</div>
    {:else if notice !== null}
      <div class="empty">{notice}</div>
    {:else if chat}
      <button type="button" class="skip-link" onclick={() => endNode?.focus()}>Skip the conversation</button>
      {#if reminders !== null}
        <div class="chat-reminders muted">{reminders}</div>
      {/if}
      <div class="chat">
        {#each rows as row (row.key)}
          <div class="chat-row" data-key={row.key}><ConversationEntry entry={row.entry} /></div>
        {/each}
      </div>
    {/if}
  </div>
</section>
<div
  id="chat-end"
  class="chat-end"
  tabindex="-1"
  role="note"
  aria-label="End of the conversation"
  bind:this={endNode}
></div>
