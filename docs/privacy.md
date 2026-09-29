# Privacy and security

[← Back to the README](../README.md)

What claude-usage keeps, what it only reads when you ask, and who else can reach it.

- [What is stored](#what-is-stored)
- [What is only read on request](#what-is-only-read-on-request)
- [Who can reach the dashboard](#who-can-reach-the-dashboard)
- [Who can read the transcripts](#who-can-read-the-transcripts)
- [The store's files](#the-stores-files)
- [The permission hook's socket](#the-permission-hooks-socket)

## What is stored

| Stored | Never stored |
|---|---|
| Token counts, model names, effort levels | Prompt text |
| Tool names and result sizes | Replies, tool inputs and tool results |
| Session titles and project paths | The contents of any file |
| Times, compactions, API errors, lines added and removed | |

## What is only read on request

While a transcript still exists, the session view reads from the file, for that one request only:

- the session's first prompt;
- on request, the whole conversation: prompts, replies, tool inputs and results, each cut to a few thousand
  characters;
- the paths of possible secret accesses, never their contents.

None of it goes into the store.

## Who can reach the dashboard

- **Loopback only.** The server answers only on loopback addresses, and only to loopback host names, which blocks
  DNS rebinding.
- **A token per start.** Loopback keeps other machines out, not other users of this one. So the API answers only a
  browser holding the token of this start: the link the dashboard prints carries it, and opening the link puts it into
  a cookie. The page and its scripts hold no data and load without it.
- **Where the token lives:** only in the server's memory, your browser's cookie, and `make start`'s log, which is
  yours alone (mode 600).

## Who can read the transcripts

The token keeps other users out of the dashboard, not out of the files it reads. So at start the dashboard warns, in
the terminal and in `make start`'s output, when other users can read files in the projects folder, or when some of them
belong to another user. It names the fix:

- `chmod 700` on the folder;
- on a Windows drive under WSL, where chmod does nothing, the mount option.

Claude Code keeps its own folder yours alone, so by default there is nothing to warn about.

## The store's files

The store holds no prompts, but it does hold titles and project paths.

- The store, its WAL files and its backups are yours alone (mode 600, whatever your umask).
- A store from an older version is closed to others the next time it is opened.
- A new folder for it is yours alone too (700); an existing one keeps its mode.

## The permission hook's socket

The [permission hook](notifications.md#the-permission-hook) can't know the token, so it posts to the dashboard's Unix
socket instead of the API. Only you can connect to it, no browser reaches it, and it answers no data.
