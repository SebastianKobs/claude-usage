<!--
@component
The page's error banner: each source's message on a line of its own, empty (and so hidden) while all is well.
-->
<script lang="ts">
  import type { BannerMessages } from '../lib/banner.svelte';

  let { messages }: { messages: BannerMessages } = $props();
</script>

<div class="banner" role="alert">{messages.text}</div>
