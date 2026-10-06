// For the tests of components that read the page's state: a page of their own per test, in context.

import { render } from '@testing-library/svelte';
import { flushSync, type Component } from 'svelte';
import { beforeEach } from 'vitest';
import AppFixture from './AppFixture.test.svelte';
import { AppState } from './app.svelte';
import type { PayloadParts } from './payload.svelte';

/** Renders `component` with `props` in the context of `app` (a new page where none is given). What comes back is
 *  Testing Library's, with `app` added and `rerender` taking the component's props, merged into the ones it has. */
function renderApp(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  component: Component<any>,
  props: Record<string, unknown> = {},
  app: AppState = new AppState(),
) {
  // Testing Library's other form, the props under a `props` key (for a prop that shares a name with its options)
  let current = Object.keys(props).length === 1 && 'props' in props ? (props.props as Record<string, unknown>) : props;
  const result = render(AppFixture, { props: { app, component, inputs: current } });
  return {
    ...result,
    app,
    rerender: (next: Record<string, unknown>) => {
      current = { ...current, ...next };
      return result.rerender({ inputs: current });
    },
  };
}

/** A page per test: `page.app` is the current one, `page.render` renders into it. Call it once in a test file, outside
 *  the tests, so its `beforeEach` runs before the file's own. */
export function pagePerTest() {
  let current = new AppState();
  beforeEach(() => {
    current = new AppState();
  });
  return {
    get app(): AppState {
      return current;
    },
    /** Sets parts of the payload and draws at once, as the page would have by the time a test looks. */
    set(parts: Partial<PayloadParts>): void {
      current.payload.set(parts);
      flushSync();
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    render: (component: Component<any>, props: Record<string, unknown> = {}) => renderApp(component, props, current),
  };
}
