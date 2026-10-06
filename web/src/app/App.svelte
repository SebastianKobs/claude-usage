<!--
@component
The whole page, mounted on `<main>`: the header, the error banner, the session view, the range filter, the overview and
the footer. It makes the page's state (`app`), hands it to the components through context, and lets the loader fetch
what they draw. `loaderOptions` are for the tests (a fetcher, timers).
-->
<script lang="ts">
  import type { Attachment } from 'svelte/attachments';
  import { AppState, setApp } from './app.svelte';
  import { keepingView } from './kept';
  import { Loader, type LoaderOptions } from './loader';
  import { footerText, scopeText, updatedText } from './page';
  import Banner from './Banner.svelte';
  import ByModel from '../overview/ByModel.svelte';
  import CostPerSession from '../overview/CostPerSession.svelte';
  import LiveSessions from '../live/LiveSessions.svelte';
  import OverTime from '../overview/OverTime.svelte';
  import RangeFilter from './RangeFilter.svelte';
  import RateLimits from '../overview/RateLimits.svelte';
  import SectionGuard from '../ui/SectionGuard.svelte';
  import SessionsList from '../overview/SessionsList.svelte';
  import SessionView from '../session/SessionView.svelte';
  import SummaryTiles from '../tiles/SummaryTiles.svelte';
  import ThemePicker from './ThemePicker.svelte';
  import UsageTables from '../overview/UsageTables.svelte';

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

<div id="session-card"><SectionGuard name="Session view"><SessionView /></SectionGuard></div>

<div class="filters" id="filters" role="group" aria-label="Filters"><RangeFilter /></div>

<div id="summary" class:loading={payload.summaryLoading}>
  <div class="kpis stack" id="kpis"><SectionGuard name="Totals"><SummaryTiles rows="kpis" /></SectionGuard></div>
  <div class="kpis stack" id="runtime" role="group" aria-label="Time and lines changed">
    <SectionGuard name="Time and lines changed"><SummaryTiles rows="runtime" /></SectionGuard>
  </div>

  <div id="live-card"><SectionGuard name="Live sessions"><LiveSessions /></SectionGuard></div>

  <div id="trend-card"><SectionGuard name="Over time"><OverTime /></SectionGuard></div>

  <div id="chart-card"><SectionGuard name="By model"><ByModel /></SectionGuard></div>

  <div id="costly-card"><SectionGuard name="Cost per session"><CostPerSession /></SectionGuard></div>

  <div id="limits-card"><SectionGuard name="Rate limits"><RateLimits /></SectionGuard></div>

  <div id="usage-cards"><SectionGuard name="Usage tables"><UsageTables /></SectionGuard></div>

  <div id="sessions-card"><SectionGuard name="Sessions"><SessionsList /></SectionGuard></div>
</div>

<footer id="footer">{footerText(payload.summary, footerCopy())}</footer>
