<!--
@component
The overview's usage tables, read from the page's payload: usage by agent type and by model (each model with its effort
levels under it) side by side, by project across the page, and by skill and by MCP server side by side. Without a
summary each is its heading only.
-->
<script lang="ts">
  import { getApp } from '../app/app.svelte';
  import { modelSlots } from '../charts/colors';
  import { modelRows, usageRows } from './usage';
  import UsageTable from './UsageTable.svelte';

  const { payload, hype } = getApp();

  const summary = $derived(payload.summary);
  const agents = $derived(summary ? usageRows(summary.agent_type, (row) => row.agent_type) : null);
  // The slots are those of the by-model chart, so a model has the same color in both.
  const slots = $derived(summary ? modelSlots([...new Set(summary.day_model.map((row) => row.model))]) : null);
  const models = $derived(summary && slots ? modelRows(summary.model, summary.model_effort, slots) : null);
  const projects = $derived(summary ? usageRows(summary.project, (row) => row.project) : null);
  const skills = $derived(summary ? usageRows(summary.skill, (row) => row.skill) : null);
  const servers = $derived(summary ? usageRows(summary.mcp_server, (row) => row.mcp_server) : null);
</script>

<div class="grid-2 stack">
  <UsageTable
    id="by-agent"
    title={hype('By agent type')}
    nameLabel="Agent type"
    rows={agents}
    empty="No usage in this range."
  />
  <UsageTable id="by-model" title={hype('By model')} nameLabel="Model" rows={models} empty="No usage in this range." />
</div>
<UsageTable
  id="by-project"
  title={hype('By project')}
  nameLabel="Project"
  rows={projects}
  empty="No usage in this range."
/>
<div class="grid-2 stack">
  <UsageTable
    id="by-skill"
    title={hype('By skill')}
    note="turns Claude Code attributes to a skill while it runs"
    nameLabel="Skill"
    rows={skills}
    empty="No turns attributed to a skill in this range."
  />
  <UsageTable
    id="by-mcp-server"
    title={hype('By MCP server')}
    note="turns Claude Code attributes to an MCP server's tools"
    nameLabel="MCP server"
    rows={servers}
    empty="No turns attributed to an MCP server in this range."
  />
</div>
