<!--
@component
A piece of code: a block, or inline for a short value in a line. highlight.js colors it where the language is known
(the attachment fills the element, which has no children of its own), else it is plain text.
-->
<script lang="ts">
  import { highlight } from '../lib/markup';

  interface Props {
    code: string;
    language?: string | null;
    inline?: boolean;
  }

  let { code, language = null, inline = false }: Props = $props();
</script>

{#snippet element()}
  <code class="hljs" {@attach highlight(code, language)}></code>
{/snippet}

{#if inline}
  {@render element()}
{:else}
  <pre class="code">{@render element()}</pre>
{/if}
