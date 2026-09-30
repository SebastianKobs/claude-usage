# Permission prompts and desktop notifications

[← Back to the README](../README.md)

Two ways for the dashboard to tell you that a session needs you: a hook that reports Claude Code's permission prompts,
and desktop notifications.

- [The permission hook](#the-permission-hook)
  - [Setting it up](#setting-it-up)
  - [How it works](#how-it-works)
  - [Limits](#limits)
- [Desktop notifications](#desktop-notifications)
  - [What notifies](#what-notifies)
  - [How they are shown](#how-they-are-shown)
  - [Turning them off or removing them](#turning-them-off-or-removing-them)

## The permission hook

The permission dialog ("Do you want to allow …?") appears in no transcript. Without the hook, a call that waits for
your permission looks like a command still running, and the dashboard shows nothing for it. With the hook, the live
session gets a blue padlock and the dashboard can notify you.

### Setting it up

`make hook-line` (or `claude-usage hook-settings`) prints the settings block.

- Put it into `~/.claude/settings.json` for every project, or into one project's `.claude/settings.local.json`, which
  git ignores, for that project only.
- If the file already has `"hooks"`, add the `"PermissionRequest"` entry to them.
- Claude Code reads hooks when a session starts. In a session that is already running, accept the hook in `/hooks`.

> [!CAUTION]
> Never put it into a project's `.claude/settings.json`. That file is committed, and everyone who works on the project
> would run the hook, whether they use claude-usage or not.

### How it works

The hook runs in the background whenever a permission dialog opens: also in auto mode, in the VS Code extension and
for subagents.

- `curl` posts Claude Code's hook input to the dashboard over a Unix socket next to the store, `permission.sock`. The
  socket is yours alone, and no browser reaches it.
- The dashboard keeps only the session, the subagent, the tool, the permission mode and the time, in memory. It never
  keeps the command or any other input. A restart forgets them.
- While no dashboard runs, the hook gives up quietly after at most 2 s, and nothing is noted.

### Limits

- Two calls of the same tool at once can't be told apart: the newer one shows as waiting.
- Windows has no Unix sockets, so there the dashboard notes that it can't show permission prompts. Claude Code's own
  dialogs work as ever.

## Desktop notifications

While the dashboard runs it also shows desktop notifications, whether or not a page of it is open.

### What notifies

- **Claude asks you something:** a question, a plan to approve, or a permission prompt (with the hook set up).
- **A possible secret access rises to a higher level.**
- **Compacting now reaches a new state:** past your compact hint, soon, close, likely too late, or the cache expired.
  Each state notifies once between two compactions. With fewer than three finished stretches between compactions to
  compare with, only a pay-off within the longest of them notifies, so a compaction isn't followed by one.

Only changes notify, so a restart sends nothing for what was already so. Each kind has its icon in the live cards'
colors: blue for a wait, amber or red for a secret access, and the compact state's tone.

The notifications hold session titles, tool names and counts, never a prompt or a path, since the system keeps them
in its notification history.

### How they are shown

The dashboard finds the system's own notifier:

| System | Notifier | Notes |
|---|---|---|
| Windows and WSL | a toast from Windows PowerShell | Shows as "claude-usage", with its own icon (see below) |
| macOS | `osascript` | Shows under Script Editor, without icons |
| Linux | `notify-send` (from libnotify) | |
| anything else | `[notify] command` | A program of your own, with `{title}`, `{body}` and `{icon}` (the icon's file) in its words |

`make notify-test` shows one notification and names the method. Where no notifier is found, the dashboard says why at
start and under the live sessions.

**On Windows**, each toast registers the name "claude-usage" for your user, under
`HKCU\Software\Classes\AppUserModelId\ClaudeUsage.Dashboard` (no admin needed), so Settings → Notifications lists it
on its own. It also copies its icon to `%LOCALAPPDATA%\claude-usage\icons`, since a toast shows only local images.

### Turning them off or removing them

- `[notify] enabled = false` in your [config](configuration.md) turns them off.
- On Windows, to remove the registration and the icons, delete that registry key and that folder.
