// The browser check's dashboard: tests/demo.py builds its made-up transcripts and serves them, once for every test.

import { spawn, type ChildProcessByStdio } from 'node:child_process';
import { dirname, join } from 'node:path';
import { createInterface } from 'node:readline';
import type { Readable } from 'node:stream';
import { fileURLToPath } from 'node:url';

const CHECKOUT = dirname(dirname(dirname(fileURLToPath(import.meta.url))));
// a folder and port of its own, so a `make demo` running beside it is left alone
const DEMO_DIR = join(CHECKOUT, 'tests', '.tmp', 'browser-demo');
const PORT = process.env.BROWSER_CHECK_PORT ?? '8797';

type Demo = ChildProcessByStdio<null, Readable, null>;

/** Builds the demo and serves it until the check ends: its link, with this start's token, goes to the tests as
 *  DEMO_LINK, and the function returned stops it. */
export default async function startDemo(): Promise<() => Promise<void>> {
  const demo: Demo = spawn(process.env.PYTHON ?? 'python3', ['-m', 'demo', '--out', DEMO_DIR, '--port', PORT], {
    cwd: CHECKOUT,
    env: { ...process.env, PYTHONPATH: join(CHECKOUT, 'tests') },
    stdio: ['ignore', 'pipe', 'inherit'],
  });
  const exited = new Promise<void>((resolve) => demo.once('exit', () => resolve()));
  process.env.DEMO_LINK = await servedLink(demo);
  return async () => {
    demo.kill('SIGINT'); // as Ctrl+C: the demo stops its dashboard before it exits, which SIGTERM would skip
    await exited;
  };
}

/** The link the demo prints once its dashboard serves; read on to the end, so the pipe never fills. */
function servedLink(demo: Demo): Promise<string> {
  return new Promise((resolve, reject) => {
    createInterface({ input: demo.stdout }).on('line', (line) => {
      const [first, link] = line.split(' ');
      if (first === 'Serving' && link) resolve(link);
    });
    demo.once('exit', (code) => reject(new Error(`the demo stopped before it served (exit code ${code})`)));
  });
}
