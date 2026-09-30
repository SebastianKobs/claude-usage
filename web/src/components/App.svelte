<!--
@component
The whole page, mounted on `<main>`: the header, the error banner, the session view, the range filter, the overview and
the footer. It makes the page's state (`app`), hands it to the components through context, and lets the loader fetch
what they draw. `loaderOptions` are for the tests (a fetcher, timers).
-->
<script lang="ts">
  import type { Attachment } from 'svelte/attachments';
  import { AppState, setApp } from '../lib/app.svelte';
  import { keepingView } from '../lib/kept';
  import { Loader, type LoaderOptions } from '../lib/loader';
  import { footerText, scopeText, updatedText } from '../lib/page';
  import Banner from './Banner.svelte';
  import ByModel from './ByModel.svelte';
  import CostPerSession from './CostPerSession.svelte';
  import LiveSessions from './LiveSessions.svelte';
  import OverTime from './OverTime.svelte';
  import RangeFilter from './RangeFilter.svelte';
  import RateLimits from './RateLimits.svelte';
  import SessionsList from './SessionsList.svelte';
  import SessionView from './SessionView.svelte';
  import SummaryTiles from './SummaryTiles.svelte';
  import ThemePicker from './ThemePicker.svelte';
  import UsageTables from './UsageTables.svelte';

  let { app = new AppState(), loaderOptions = {} }: { app?: AppState; loaderOptions?: LoaderOptions } = $props();

  // The page's state is the one this component was made with: a new `app` would need a new page.
  // svelte-ignore state_referenced_locally
  setApp(app);
  // svelte-ignore state_referenced_locally
  const { payload, preferences, hype, footerCopy } = app;
  // svelte-ignore state_referenced_locally
  const loader = new Loader(app, { keep: keepingView, ...loaderOptions });

  // The polling timers are the only effect: they start with the page and stop with it.
  $effect(() => {
    loader.start();
    return () => loader.stop();
  });

  // The theme goes on the root element, where the themes' stylesheets look for it. An attachment, so it follows the
  // preference and takes the attribute away again for "auto", where the system's scheme decides.
  const theme: Attachment<Document> = (document) => {
    const { dataset } = document.documentElement;
    if (preferences.theme === null) delete dataset.theme;
    else dataset.theme = preferences.theme;
    return () => {
      delete dataset.theme;
    };
  };
</script>

<!-- The tab's visibility and the address's hash are events, not state: the loader decides what they mean. -->
<svelte:document onvisibilitychange={() => loader.visibilityChanged()} {@attach theme} />
<svelte:window onhashchange={() => loader.hashChanged()} />

<header>
  <h1>{hype('Claude usage')}</h1>
  <span id="scope" class="muted">{scopeText(payload.summary)}</span>
  <span class="spacer"></span>
  <span id="updated" class="muted">{updatedText(payload.liveAt)}</span>
  <ThemePicker />
</header>

<Banner messages={app.messages} />

<div id="session-card"><SessionView /></div>

<div class="filters" id="filters" role="group" aria-label="Filters"><RangeFilter /></div>

<div id="summary" class:loading={payload.summaryLoading}>
  <div class="kpis stack" id="kpis"><SummaryTiles rows="kpis" /></div>
  <div class="kpis stack" id="runtime" role="group" aria-label="Time and lines changed">
    <SummaryTiles rows="runtime" />
  </div>

  <div id="live-card"><LiveSessions /></div>

  <div id="trend-card"><OverTime /></div>

  <div id="chart-card"><ByModel /></div>

  <div id="costly-card"><CostPerSession /></div>

  <div id="limits-card"><RateLimits /></div>

  <div id="usage-cards"><UsageTables /></div>

  <div id="sessions-card"><SessionsList /></div>
</div>

<footer id="footer">{footerText(payload.summary, footerCopy())}</footer>
