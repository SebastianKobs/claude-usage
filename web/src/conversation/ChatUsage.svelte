<!--
@component
A call's tokens and cost under its last entry of the conversation: the price in bold, then the context (with what it
grew by) and the parts of the request, and at its end a chip where the context passed a milestone of a hint to compact
it had already given (the whole badge takes the reminder's tint) and one where the cache was written again. The first
hint of each kind is a block after the badge, which says more.
-->
<script lang="ts">
  import type { CallUsage, CompactHint } from '../api/api';
  import {
    compactChip,
    costText,
    hintBlock,
    isReminder,
    rebuildChip,
    reminderTitle,
    usageParts,
    usageTint,
  } from './entries';

  interface Props {
    usage: CallUsage;
    hint?: CompactHint;
  }

  let { usage, hint }: Props = $props();

  // The space before a chip, so the badge reads right without the styles. It is a text node of its own, since the
  // template trims a space at the edge of a block, and one between the blocks would be left at the badge's end.
  const GAP = ' ';

  const chip = $derived(hint && isReminder(hint) ? compactChip(hint) : null);
  const rebuild = $derived(usage.rebuild ? rebuildChip(usage.rebuild) : null);
  const block = $derived(hintBlock(hint));
</script>

<div class={['chat-usage', usageTint(hint)]} title={reminderTitle(usage) ?? undefined}>
  <strong>{costText(usage)}</strong><span>{` · ${usageParts(usage).join(' · ')}`}</span>{#if chip}{GAP}<span
      class={['compact-chip', chip.tone]}
      role="note">{chip.text}</span
    >{/if}{#if rebuild}{GAP}<span class="rebuild-chip" role="note" title={rebuild.title}>{rebuild.text}</span>{/if}
</div>
{#if block}
  <div class={['compact-hint', block.tone]} role="note"><strong>{block.label}</strong> {block.text}</div>
{/if}
