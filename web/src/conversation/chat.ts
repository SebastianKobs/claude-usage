// The conversation's frame: where it is fetched from, the picker's choices, the words around the entries, and keeping
// an entry's object where a refresh changed nothing in it.

import type { Agent, Chat, Reminders } from '../api/api';
import { whole } from '../ui/format';

/** One choice of the picker: a transcript, by the agent's id ('' for the main thread). */
export interface AgentChoice {
  value: string;
  label: string;
}

/** A workflow run's agents under one heading. */
export interface AgentGroup {
  group: string;
  options: AgentChoice[];
}

/** Where a transcript's conversation is read from. */
export function chatUrl(sessionId: string, agentId: string | null): string {
  const query = agentId ? `?agent=${encodeURIComponent(agentId)}` : '';
  return `/api/session/${encodeURIComponent(sessionId)}/chat${query}`;
}

/** What the order button's title says a click does. */
export function orderTitle(oldestFirst: boolean): string {
  return oldestFirst ? 'Oldest first: click for newest first' : 'Newest first: click for oldest first';
}

function choiceOf(agent: Agent): AgentChoice {
  const label =
    agent.agent_id === null
      ? 'Main thread'
      : `${agent.agent_type}${agent.description ? ` · ${agent.description}` : ''}`;
  return { value: agent.agent_id ?? '', label };
}

/** The picker's choices: one per transcript (the background calls have none), a workflow run's agents in one group
 *  per run, where its first agent is. */
export function agentChoices(agents: Agent[]): (AgentChoice | AgentGroup)[] {
  const items: (AgentChoice | AgentGroup)[] = [];
  const groups = new Map<string, AgentGroup>();
  for (const agent of agents) {
    if (agent.agent_type === '(background)') continue;
    if (agent.workflow_run === null) {
      items.push(choiceOf(agent));
      continue;
    }
    let group = groups.get(agent.workflow_run);
    if (!group) {
      group = { group: `workflow · ${agent.workflow_name || agent.workflow_run}`, options: [] };
      groups.set(agent.workflow_run, group);
      items.push(group);
    }
    group.options.push(choiceOf(agent));
  }
  return items;
}

/** Claude Code's token reminder comes before almost every call: summed in one line, not shown as a line each. Null
 *  without any. */
export function reminderNote(reminders: Reminders | undefined): string | null {
  if (!reminders?.calls) return null;
  return (
    `Claude Code's token reminder went with ${whole(reminders.calls)} calls, ` +
    `${whole(reminders.chars)} characters in all; each call's badge counts it (hover the badge).`
  );
}

/** What stands in place of a conversation that has no entries to show; null where there are some. */
export function chatNotice(chat: Chat): string | null {
  if (!chat.available) {
    return 'The transcript is gone: Claude Code deleted it after its cleanup period. The usage history stays.';
  }
  return chat.entries.length ? null : 'No conversation in this transcript yet.';
}

/** Whether two answers hold the same conversation. */
export function sameChat(left: Chat, right: Chat): boolean {
  return JSON.stringify(left) === JSON.stringify(right);
}

/** The new chat with each entry that is the same as the old chat's at its place being the old object, which keeps
 *  what draws it from drawing it again (the entry's open parts, its focus). The new chat itself is left as it is. */
export function reuseEntries(before: Chat | null, after: Chat): Chat {
  if (!before) return after;
  const entries = after.entries.map((entry, index) => {
    const old = before.entries[index];
    return old && JSON.stringify(old) === JSON.stringify(entry) ? old : entry;
  });
  return { ...after, entries };
}
