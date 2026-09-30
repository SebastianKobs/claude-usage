<!--
@component
The call to compact above the session view's gauge, in plain words, with a button that copies `/compact` for pasting
into Claude Code. Where the clipboard is missing or refused, it shows the command selected in a field to copy by hand.
-->
<script lang="ts">
  import type { CompactCall } from '../lib/gauge';

  let { call }: { call: CompactCall } = $props();

  const COMMAND = '/compact';
  let copied = $state<'no' | 'yes' | 'by hand'>('no');

  async function copy(): Promise<void> {
    try {
      await navigator.clipboard.writeText(COMMAND);
      copied = 'yes';
    } catch {
      // no clipboard (an insecure page, an old browser) or refused by the browser
      copied = 'by hand';
    }
  }

  /** Selects the command, so a copy shortcut takes it. */
  function select(field: HTMLInputElement): void {
    field.select();
  }
</script>

<div class="card compact-call" id="compact-call" role="region" aria-labelledby="compact-call-title">
  <strong id="compact-call-title">{call.title}</strong>
  {#each call.lines as line (line)}
    <p>{line}</p>
  {/each}
  <div class="compact-call-actions">
    <button type="button" id="compact-copy" onclick={copy}>Copy /compact</button>
    <span class="compact-call-status" role="status">
      {#if copied === 'yes'}
        Copied: paste it into Claude Code.
      {:else if copied === 'by hand'}
        Copy it from here:
        <input
          type="text"
          readonly
          value={COMMAND}
          aria-label="The command to copy"
          class="compact-call-field"
          {@attach select}
        />
      {/if}
    </span>
  </div>
</div>
