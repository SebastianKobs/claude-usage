// The page's bundle: it mounts the app on `<main>`, which dashboard.html leaves empty. The app fetches what it draws
// (app/loader.ts) and everything it shows is a component, in a folder per section of the page.
import { mount } from 'svelte';
import App from './app/App.svelte';
// The stylesheets, which the build joins into css/app.css in this order: each theme sets the color roles (light
// always, dark for "auto" on a dark system and when picked, the gimmicks over dark's palette), then the layout.
import './styles/themes/light.css';
import './styles/themes/dark.css';
import './styles/themes/fun.css';
import './styles/themes/hacker.css';
import './styles/themes/startup.css';
import './styles/themes/rgb.css';
import './styles/common.css';

const target = document.querySelector('main');
// A page built for another bundle: better to fail loudly than show nothing.
if (!target) throw new Error('The page has no <main> to mount the app on');
mount(App, { target });
