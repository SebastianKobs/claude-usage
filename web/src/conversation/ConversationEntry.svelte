<!--
@component
One entry of the conversation, by its kind: a compaction or an API error (`ChatMarker`), hidden context
(`ChatInjected`), a tool call (`ChatToolCall`), anything else, a prompt, a reply, thinking or a kind not known yet, as
a message (`ChatMessage`). The last entry of each API call carries its usage, which follows it (`ChatUsage`).
-->
<script lang="ts">
  import type { ChatEntry } from '../api/api';
  import ChatInjected from './ChatInjected.svelte';
  import ChatMarker from './ChatMarker.svelte';
  import ChatMessage from './ChatMessage.svelte';
  import ChatToolCall from './ChatToolCall.svelte';
  import ChatUsage from './ChatUsage.svelte';

  interface Props {
    entry: ChatEntry;
  }

  let { entry }: Props = $props();
</script>

{#if entry.kind === 'compaction' || entry.kind === 'error'}
  <ChatMarker {entry} />
{:else if entry.kind === 'injected'}
  <ChatInjected {entry} />
{:else if entry.kind === 'tool'}
  <ChatToolCall {entry} />
{:else}
  <ChatMessage {entry} />
{/if}
{#if entry.usage}
  <ChatUsage usage={entry.usage} hint={entry.compact_hint} />
{/if}
