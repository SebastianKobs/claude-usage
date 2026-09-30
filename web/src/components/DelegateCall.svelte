<!--
@component
The hint to delegate exploration above the session view's gauge, in plain words: what the reading, searching and
listing cost so far and per reply, and that a subagent hands back only its summary. A heuristic, which its note says.
-->
<script lang="ts">
  import type { DelegateCall } from '../lib/gauge';

  let { call }: { call: DelegateCall } = $props();
</script>

<div class="card delegate-call" id="delegate-call" role="region" aria-labelledby="delegate-call-title">
  <strong id="delegate-call-title">{call.title}</strong>
  {#each call.lines as line (line)}
    <p>{line}</p>
  {/each}
  <p class="muted">{call.note}</p>
</div>
