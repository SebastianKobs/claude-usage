<!--
@component
TableView's test bench: rows of a name and a number, the number in a `num` cell, a row with `sub` a sub-row of the one
above. Only the tests use it.
-->
<script lang="ts" module>
  /** A row of the bench. */
  export interface BenchRow {
    id: string;
    name: string;
    amount: number;
    sub?: boolean;
  }
</script>

<script lang="ts">
  import TableView from './TableView.svelte';

  let {
    rows,
    tableKey = 'bench',
    noun,
    withSub = false,
  }: { rows: BenchRow[]; tableKey?: string; noun?: string; withSub?: boolean } = $props();
</script>

<TableView
  key={tableKey}
  {noun}
  columns={[{ label: 'Name' }, { label: 'Amount', numeric: true }]}
  {rows}
  rowKey={(row) => row.id}
  {cells}
  sub={withSub ? (row) => row.sub === true : undefined}
/>

{#snippet cells(row: BenchRow)}
  <td>{row.name}</td>
  <td class="num">{row.amount}</td>
{/snippet}
