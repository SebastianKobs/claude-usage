<!--
@component
The test bench for `SectionGuard`: two guarded sections, Tiles and Chart, each drawing a line that throws while its name
is in `failing`, as it is first drawn or when `failing` changes. Only the tests use it.
-->
<script lang="ts">
  import SectionGuard from './SectionGuard.svelte';

  let { failing }: { failing: string[] } = $props();

  /** The section's line, or the error of a section that can't be drawn. */
  function drawn(name: string): string {
    if (failing.includes(name)) throw new Error(`no ${name}`);
    return `${name} drawn`;
  }
</script>

<SectionGuard name="Tiles"><p>{drawn('Tiles')}</p></SectionGuard>
<SectionGuard name="Chart"><p>{drawn('Chart')}</p></SectionGuard>
