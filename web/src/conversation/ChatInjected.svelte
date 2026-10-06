<!--
@component
Hidden context that went into a request: attachments, meta records, skill text or the compact summary, as a closed
`details` whose summary counts the pieces and their characters, and each piece under its kind with how much of it shows.
-->
<script lang="ts">
  import type { ChatEntry } from '../api/api';
  import { cutNote, injectedCount, injectedKind } from './entries';
  import { when } from '../ui/format';

  interface Props {
    entry: ChatEntry;
  }

  let { entry }: Props = $props();
</script>

<details class="chat-tool chat-injected">
  <summary>
    <strong>Added to the context</strong>
    {injectedCount(entry.items)}
    <span class="muted">{when(entry.timestamp)}</span>
  </summary>
  {#each entry.items as item (item)}
    <div class="label">{injectedKind(item.kind)}{cutNote(item.text, item.chars)}</div>
    <pre class="code">{item.text}</pre>
  {/each}
</details>
