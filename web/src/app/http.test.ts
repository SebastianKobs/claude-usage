import { afterEach, describe, expect, test, vi } from 'vitest';
import { fetchJson } from './http';

function answer(status: number, body: string): void {
  vi.stubGlobal(
    'fetch',
    vi.fn(async () => new Response(body, { status })),
  );
}

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('fetchJson', () => {
  test('asks for the path without the cache and returns the parsed answer', async () => {
    answer(200, '{"a":1}');
    await expect(fetchJson('/api/x')).resolves.toEqual({ a: 1 });
    expect(fetch).toHaveBeenCalledWith('/api/x', { cache: 'no-store' });
  });

  test('says the status where the answer is not JSON', async () => {
    answer(502, '<html>');
    await expect(fetchJson('/api/x')).rejects.toThrow('/api/x: HTTP 502, not JSON');
  });

  test('gives a refusal (403) as the server gave it, without the path', async () => {
    answer(403, '{"error":"open the link serve printed"}');
    await expect(fetchJson('/api/x')).rejects.toThrow(/^open the link serve printed$/);
  });

  test('gives a 403 without a reason as HTTP 403', async () => {
    answer(403, '{}');
    await expect(fetchJson('/api/x')).rejects.toThrow(/^HTTP 403$/);
  });

  test('names the path and the server\'s reason for another failure', async () => {
    answer(500, '{"error":"boom"}');
    await expect(fetchJson('/api/x')).rejects.toThrow('/api/x: boom');
  });

  test('names the status where a failure gives no reason', async () => {
    answer(404, '{}');
    await expect(fetchJson('/api/x')).rejects.toThrow('/api/x: HTTP 404');
  });
});
