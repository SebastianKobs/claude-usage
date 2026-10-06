<!--
@component
A tool call in the conversation, as a closed `details`: its summary line names the tool, what it did and how it went
(no result yet, failed) and when; opened, the input (a Bash command, an Edit's diff or a Write's file with their own
views, else the input's fields) and the result under it. Changing the entry updates these nodes in place, so what the
reader opened stays open.
-->
<script lang="ts">
  import type { ChatEntry } from '../api/api';
  import {
    resultLabel,
    toolInput,
    toolResult,
    toolStatus,
    toolSummary,
    type FieldLine,
  } from './entries';
  import { when } from '../ui/format';
  import Code from './Code.svelte';

  interface Props {
    entry: ChatEntry;
  }

  let { entry }: Props = $props();

  // the summary line's words after the tool's name: what it did, then how it went (which has its own separator)
  const line = $derived(`${toolSummary(entry) ? ` ${toolSummary(entry)}` : ''}${toolStatus(entry)}`);
  const input = $derived(toolInput(entry));
  const result = $derived(entry.result === null ? null : toolResult(entry));
</script>

{#snippet fieldList(lines: FieldLine[])}
  {#if lines.length > 0}
    <dl class="tool-fields">
      {#each lines as line (line)}
        <dt>{line.label}</dt>
        <dd>
          {#if line.shape === 'json'}
            <Code code={line.value} language="json" inline={line.inline} />
          {:else if line.shape === 'block'}
            <pre class="code">{line.value}</pre>
          {:else}
            {line.value}
          {/if}
        </dd>
      {/each}
    </dl>
  {/if}
{/snippet}

<details class="chat-tool">
  <summary><strong>{entry.tool}</strong>{line} <span class="muted">{when(entry.timestamp)}</span></summary>
  <div>
    {#if input.kind === 'bash'}
      {#if input.description}
        <div class="tool-description">{input.description}</div>
      {/if}
      <div class="label">{input.label}</div>
      <Code code={input.command} language="bash" />
    {:else if input.kind === 'edit'}
      <div class="tool-description">{input.path}</div>
      <div class="label">{input.label}</div>
      <Code code={input.diff} language="diff" />
    {:else if input.kind === 'write'}
      <div class="tool-description">{input.path}</div>
      <div class="label">{input.label}</div>
      <Code code={input.content} language={input.language} />
    {:else}
      <div class="label">{input.label}</div>
    {/if}
    {@render fieldList(input.rest)}
  </div>
  {#if result}
    <div class="label">{resultLabel(entry)}</div>
    {#if result.kind === 'code'}
      <Code code={result.code} language={result.language} />
    {:else}
      <pre class="code">{result.text}</pre>
    {/if}
  {/if}
</details>
