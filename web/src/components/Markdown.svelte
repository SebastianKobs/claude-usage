<!--
@component
Claude's answer or the user's prompt as markdown: marked's HTML after DOMPurify, put in by the attachment. Without the
libraries the text is shown as text. `breaks` keeps single line breaks, as typed in a prompt.
-->
<script lang="ts">
  import { markdown, markdownAvailable } from '../lib/markup';

  interface Props {
    text: string;
    breaks?: boolean;
  }

  let { text, breaks = false }: Props = $props();
</script>

{#if markdownAvailable()}
  <div class="chat-markdown" {@attach markdown(text, breaks)}></div>
{:else}
  <div class="chat-markdown chat-text">{text}</div>
{/if}
