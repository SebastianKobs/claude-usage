<!--
@component
A prompt, Claude's reply or its thinking in the conversation: the head (who, the model and effort it was written at, and
when) and the text. A reply is markdown, a prompt is a slash command as typed, JSON pretty-printed and highlighted, or
markdown with its line breaks kept; thinking is plain text in a closed `details`. Any other kind shows as plain text.
-->
<script lang="ts">
  import type { ChatEntry } from '../lib/api';
  import { modelNote, promptBody, roleOf } from '../lib/entries';
  import { when } from '../lib/format';
  import Code from './Code.svelte';
  import Markdown from './Markdown.svelte';

  interface Props {
    entry: ChatEntry;
  }

  let { entry }: Props = $props();

  const text = $derived(entry.text ?? '');
  const note = $derived(modelNote(entry));
  const prompt = $derived(entry.kind === 'prompt' ? promptBody(text) : null);
</script>

<!-- the spaces between the names are in the markup, so the head reads right without the styles; one space
     between each, so two branches rather than an empty block between two spaces -->
{#snippet head()}
  {#if note}
    <strong>{roleOf(entry.kind)}</strong> <span class="muted">{note}</span>
    <span class="muted">{when(entry.timestamp)}</span>
  {:else}
    <strong>{roleOf(entry.kind)}</strong> <span class="muted">{when(entry.timestamp)}</span>
  {/if}
{/snippet}

{#if entry.kind === 'thinking'}
  <details class="chat-entry chat-thinking">
    <summary><span class="chat-head">{@render head()}</span></summary>
    <div class="chat-text">{text}</div>
  </details>
{:else}
  <div class="chat-entry {entry.kind === 'prompt' ? 'chat-user' : 'chat-assistant'}">
    <div class="chat-head">{@render head()}</div>
    {#if prompt?.kind === 'command'}
      <div class="chat-command"><code>{prompt.text}</code></div>
    {:else if prompt?.kind === 'json'}
      <Code code={prompt.code} language="json" />
    {:else if prompt}
      <Markdown text={prompt.text} breaks />
    {:else if entry.kind === 'text'}
      <Markdown {text} />
    {:else}
      <div class="chat-text">{text}</div>
    {/if}
  </div>
{/if}
