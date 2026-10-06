// The page's bundle: it mounts the app on `<main>`, which dashboard.html leaves empty. The app fetches what it draws
// (app/loader.ts) and everything it shows is a component, in a folder per section of the page.
import { mount } from 'svelte';
import App from './app/App.svelte';

const target = document.querySelector('main');
// A page built for another bundle: better to fail loudly than show nothing.
if (!target) throw new Error('The page has no <main> to mount the app on');
mount(App, { target });
