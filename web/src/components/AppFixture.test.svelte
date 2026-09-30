<!--
@component
The test bench for a component that reads the page's state: it puts `app` in the context and renders `component` with
`inputs` as its props, which the tests' `renderApp` makes. Only the tests use it. The prop isn't called `props`
because Testing Library's `rerender` takes a `props` key for its deprecated wrapper form.
-->
<script lang="ts">
  import type { Component } from 'svelte';
  import { setApp, type AppState } from '../lib/app.svelte';

  let {
    app,
    component,
    inputs = {},
  }: {
    app: AppState;
    // Any component: what it takes is the test's own business.
    component: Component<any>;
    inputs?: Record<string, unknown>;
  } = $props();

  // svelte-ignore state_referenced_locally
  setApp(app);
  const Rendered = $derived(component);
</script>

<Rendered {...inputs} />
