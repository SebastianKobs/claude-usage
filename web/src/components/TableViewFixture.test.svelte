<!--
@component
TableView's test bench: rows of a name and a number, the number in a `num` cell, a row with `sub` a sub-row of the one
above, a row with `group` a group head. `withHeading`, `withIntro` and `empty` turn on the heading, the note and the
text for no rows, `withRowClass` a class "flagged" on the rows whose name ends in 1, `withTitle` a title on the Amount
column. Only the tests use it.
-->
<script lang="ts" module>
  /** A row of the bench. */
  export interface BenchRow {
    id: string;
    name: string;
    amount: number;
    sub?: boolean;
    group?: boolean;
  }
</script>

<script lang="ts">
  import TableView from './TableView.svelte';

  let {
    rows,
    tableKey = 'bench',
    noun,
    withSub = false,
    withGroup = false,
    withHeading = false,
    withIntro = false,
    withRowClass = false,
    withTitle = false,
    empty,
    labelledby,
  }: {
    rows: BenchRow[];
    tableKey?: string;
    noun?: string;
    withSub?: boolean;
    withGroup?: boolean;
    withHeading?: boolean;
    withIntro?: boolean;
    withRowClass?: boolean;
    withTitle?: boolean;
    empty?: string;
    labelledby?: string;
  } = $props();
</script>

<TableView
  key={tableKey}
  {noun}
  columns={[{ label: 'Name' }, { label: 'Amount', numeric: true, title: withTitle ? 'what it comes to' : undefined }]}
  {rows}
  rowKey={(row) => row.id}
  {cells}
  sub={withSub ? (row) => row.sub === true : undefined}
  group={withGroup ? (row) => row.group === true : undefined}
  rowClass={withRowClass ? (row) => (row.name.endsWith('1') ? 'flagged' : undefined) : undefined}
  heading={withHeading ? heading : undefined}
  intro={withIntro ? intro : undefined}
  {empty}
  {labelledby}
/>

{#snippet heading()}
  <h3 id="bench-title">Bench</h3>
{/snippet}

{#snippet intro()}
  <p class="note">About the bench</p>
{/snippet}

{#snippet cells(row: BenchRow)}
  <td>{row.name}</td>
  <td class="num">{row.amount}</td>
{/snippet}
