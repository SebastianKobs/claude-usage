<!--
@component
A compaction or an API error in the conversation: its line with the time, and under a compaction the comparison with
keeping the context (the verdict as a gain or a loss by its sign and arrow, then the break-even, the calls after and the
one-time cost).
-->
<script lang="ts">
  import type { ChatEntry } from '../lib/api';
  import { VERSUS_KEEPING_NOTE, verdictText, verdictTone, verdictWords } from '../lib/compact';
  import { markerText, versusKeepingParts } from '../lib/entries';
  import { when } from '../lib/format';

  interface Props {
    entry: ChatEntry;
  }

  let { entry }: Props = $props();

  const comparison = $derived(entry.versus_keeping ?? null);
  const tone = $derived(comparison ? verdictTone(comparison) : null);
</script>

<div class="chat-marker">
  {markerText(entry)}
  <span class="muted">{when(entry.timestamp)}</span>
  {#if comparison}
    <div class="muted" title={VERSUS_KEEPING_NOTE}>
      vs keeping:
      <span class={tone ? `verdict-${tone}` : undefined} title={verdictWords(comparison) ?? undefined}>
        {verdictText(comparison)}
      </span>
      · {versusKeepingParts(comparison)}
    </div>
  {/if}
</div>
