<!--
@component
Time and lines changed, from Claude Code's cost records: the sessions that ended in the range, or one session's. Four
separate measures (the API and tool times overlap the wall-clock time and each other), so stat tiles, not a chart.
`from` says whose totals they are; a session's totals estimated from its transcripts (`source` "transcripts") have no
retries, and their tool time includes waiting for permission. `costPer100Lines` is null without lines or a price.
-->
<script lang="ts">
  import type { RuntimeTotals, SessionRuntime } from '../lib/api';
  import { duration, whole } from '../lib/format';
  import { runtimeNotes } from '../lib/tiles';
  import StatTile from './StatTile.svelte';

  let {
    runtime,
    from,
    costPer100Lines,
  }: { runtime: RuntimeTotals | SessionRuntime; from: string; costPer100Lines: number | null } = $props();

  const estimated = $derived('source' in runtime && runtime.source === 'transcripts');
  const notes = $derived(runtimeNotes(runtime, from, costPer100Lines, estimated));
</script>

<StatTile label="Session time" value={duration(runtime.duration_ms)} note={notes.session} />
<StatTile label="Waiting on the API" value={duration(runtime.api_ms)} note={notes.api} />
<StatTile label="Running tools" value={duration(runtime.tool_ms)} note={notes.tools} />
<StatTile
  label="Lines changed"
  value={`+${whole(runtime.lines_added)} / −${whole(runtime.lines_removed)}`}
  note={notes.lines}
/>
