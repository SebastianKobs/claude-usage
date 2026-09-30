// The page's bundle. It loads before the classic scripts (a module script runs in document order with
// deferred ones) and grows section by section as the page moves to Svelte (refactor.md, Phase 3); until the app
// takes over the page, the bridge hands the old scripts what moved.
import { bridge } from './legacy.svelte';

bridge(window);
