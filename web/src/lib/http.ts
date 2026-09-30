// Asking the server for JSON: what the loader and the conversation fetch through.

/** The server's answer to `path`, parsed. Rejects with the reason the server gave, or the status. */
export async function fetchJson<T>(path: string): Promise<T> {
  const response = await fetch(path, { cache: 'no-store' });
  let body: { error?: string };
  try {
    body = (await response.json()) as { error?: string };
  } catch {
    throw new Error(`${path}: HTTP ${response.status}, not JSON`);
  }
  // Refused (no token, or a foreign host name): the reason alone, the same for every request.
  if (response.status === 403) throw new Error(body.error || 'HTTP 403');
  if (!response.ok) throw new Error(`${path}: ${body.error || `HTTP ${response.status}`}`);
  return body as T;
}
