// A session's conversation in its view: loaded from the transcript on request, never stored, all text as text.
"use strict";

// --- conversation --------------------------------------------------------------------------------------------

const CHAT_ROLES = {prompt: "You", text: "Claude", thinking: "Thinking"};
let chatRequest = 0;

// The picker (main thread or a subagent) and the button that loads the conversation into #chat
function chatControls(detail) {
  const agents = detail.agents.filter(agent => agent.agent_type !== "(background)");
  const picker = el("select", {id: "chat-agent", "aria-label": "Conversation of"},
    ...agents.map(agent => el("option", {value: agent.agent_id || "",
      text: agent.agent_id === null ? "Main thread"
                                    : `${agent.agent_type}${agent.description ? " · " + agent.description : ""}`})));
  const button = el("button", {type: "button", id: "chat-load", text: "Show conversation"});
  button.addEventListener("click", () => loadChat(detail.session_id, picker.value || null, button));
  picker.addEventListener("change", () => {
    if (button.textContent !== "Show conversation") loadChat(detail.session_id, picker.value || null, button);
  });
  return el("div", {class: "chart-head"}, themed("h3", "Conversation"),
            el("span", {class: "muted", text: "read from the transcript when you ask, never stored"}),
            el("span", {class: "spacer"}), picker, button);
}

async function loadChat(sessionId, agentId, button) {
  const container = document.getElementById("chat");
  const request = ++chatRequest;                          // switching agents quickly: only the newest renders
  container.replaceChildren(el("div", {class: "empty", text: "Loading…"}));
  const query = agentId ? `?agent=${encodeURIComponent(agentId)}` : "";
  try {
    const chat = await fetchJson(`/api/session/${encodeURIComponent(sessionId)}/chat${query}`);
    if (request !== chatRequest) return;
    renderChat(container, chat);
    button.textContent = "Reload";
  } catch (error) {
    if (request === chatRequest) container.replaceChildren(el("div", {class: "empty", text: error.message}));
  }
}

// into the container loadChat started with, never into a session view opened since
function renderChat(container, chat) {
  if (!chat.available) {
    container.replaceChildren(el("div", {class: "empty",
      text: "The transcript is gone: Claude Code deleted it after its cleanup period. The usage history stays."}));
    return;
  }
  if (!chat.entries.length) {
    container.replaceChildren(el("div", {class: "empty", text: "No conversation in this transcript yet."}));
    return;
  }
  container.replaceChildren(el("div", {class: "chat"}, ...chat.entries.map(chatEntry)));
}

function cutNote(shown, total) {
  return total > shown.length ? ` · first ${whole(shown.length)} of ${whole(total)} characters` : "";
}

// --- tool calls: the input field by field, code highlighted -------------------------------------------------

// file extensions and the highlight.js language of their content (only languages in the vendored bundle)
const CODE_LANGUAGES = {
  py: "python", js: "javascript", mjs: "javascript", cjs: "javascript", jsx: "javascript", ts: "typescript",
  tsx: "typescript", json: "json", sh: "bash", bash: "bash", zsh: "bash", php: "php", rb: "ruby", go: "go",
  rs: "rust", java: "java", kt: "kotlin", swift: "swift", c: "c", h: "c", cpp: "cpp", hpp: "cpp", cs: "csharp",
  css: "css", scss: "scss", less: "less", html: "xml", xml: "xml", svg: "xml", vue: "xml", md: "markdown",
  yml: "yaml", yaml: "yaml", toml: "ini", ini: "ini", cfg: "ini", sql: "sql", lua: "lua", pl: "perl", r: "r",
  graphql: "graphql", diff: "diff", patch: "diff", mk: "makefile",
};
const FILE_NAMES = {Makefile: "makefile", Dockerfile: "bash", ".bashrc": "bash", ".zshrc": "bash"};

function languageOfFile(path) {
  if (!path) return null;
  const name = path.split("/").pop();
  if (FILE_NAMES[name]) return FILE_NAMES[name];
  const dot = name.lastIndexOf(".");
  return dot > 0 ? CODE_LANGUAGES[name.slice(dot + 1).toLowerCase()] || null : null;
}

// A code block, highlighted when the language is known. The one place markup goes into the page: highlight.js
// escapes the text it is given (<, >, & and quotes), and its spans only carry classes. Without the library or a
// known language the text goes in as text. inline gives the code element alone, for a short value in a line.
function highlighted(code, language, inline = false) {
  const block = el("code", {class: "hljs"});
  if (language && typeof hljs !== "undefined" && hljs.getLanguage(language)) {
    block.innerHTML = hljs.highlight(code, {language, ignoreIllegals: true}).value;
  } else {
    block.textContent = code;
  }
  return inline ? block : el("pre", {class: "code"}, block);
}

// --- Claude's answers as markdown -----------------------------------------------------------------------------

// What the sanitized markdown may contain: the elements marked produces, no images (the page loads nothing), no
// styles or event attributes, and links only to http, https and mailto
const MARKDOWN_TAGS = ["p", "br", "strong", "em", "del", "code", "pre", "ul", "ol", "li", "blockquote", "hr", "a",
                       "h1", "h2", "h3", "h4", "h5", "h6", "table", "thead", "tbody", "tr", "th", "td"];
const MARKDOWN_ATTRIBUTES = ["href", "title", "class", "align", "start"];
// classes only name a fenced block's language: others could dress transcript text up as the page's own notes
const MARKDOWN_CLASS = /^language-[\w+-]+$/;
const MARKDOWN_LINKS = /^(?:https?|mailto):/i;
let markdownReady = false;

function setupMarkdown() {
  if (markdownReady) return true;
  if (typeof marked === "undefined" || typeof DOMPurify === "undefined" || !DOMPurify.isSupported) return false;
  // a task list's checkbox becomes a character, as the sanitized markdown has no form elements
  DOMPurify.addHook("uponSanitizeElement", node => {
    if (node.tagName === "INPUT" && node.getAttribute("type") === "checkbox") {
      node.replaceWith(node.ownerDocument.createTextNode(node.hasAttribute("checked") ? "☑" : "☐"));
    }
  });
  // links open in a new tab and pass nothing on
  DOMPurify.addHook("afterSanitizeAttributes", node => {
    if (node.hasAttribute("class") && !(node.tagName === "CODE" && MARKDOWN_CLASS.test(node.getAttribute("class")))) {
      node.removeAttribute("class");
    }
    if (node.tagName === "A") {
      node.setAttribute("target", "_blank");
      node.setAttribute("rel", "noopener noreferrer");
    }
  });
  markdownReady = true;
  return true;
}

// Claude's text as markdown. The second place markup goes into the page: marked turns the text into HTML (raw
// HTML in the text included), DOMPurify keeps only MARKDOWN_TAGS and MARKDOWN_ATTRIBUTES, and fenced code is then
// highlighted like the tool calls. Without the libraries the text goes in as text. breaks keeps single line
// breaks, as typed in a prompt.
function markdown(text, breaks = false) {
  const container = el("div", {class: "chat-markdown"});
  if (!setupMarkdown()) {
    container.classList.add("chat-text");
    container.textContent = text;
    return container;
  }
  container.innerHTML = DOMPurify.sanitize(marked.parse(text, {gfm: true, breaks, async: false}), {
    ALLOWED_TAGS: MARKDOWN_TAGS, ALLOWED_ATTR: MARKDOWN_ATTRIBUTES, ALLOWED_URI_REGEXP: MARKDOWN_LINKS});
  for (const code of container.querySelectorAll("pre > code")) {
    const language = (code.className.match(/\blanguage-([\w+-]+)/) || [])[1];
    code.parentElement.replaceWith(highlighted(code.textContent, CODE_LANGUAGES[language] || language));
  }
  return container;
}

// Claude Code stores a slash command as <command-name>/x</command-name> with its <command-args>
const COMMAND_TAG = /<command-name>([^<]*)<\/command-name>/;
const COMMAND_ARGS = /<command-args>([^<]*)<\/command-args>/;

// A prompt: a slash command as the command typed, a prompt that is JSON as a whole highlighted, anything else as
// markdown with its line breaks kept
function promptBody(text) {
  const command = text.match(COMMAND_TAG);
  if (command) {
    const args = (text.match(COMMAND_ARGS) || [])[1] || "";
    return el("div", {class: "chat-command"}, el("code", {text: `${command[1].trim()} ${args.trim()}`.trim()}));
  }
  const trimmed = text.trim();
  if (trimmed.startsWith("{") || trimmed.startsWith("[")) {
    try {
      return highlighted(JSON.stringify(JSON.parse(trimmed), null, 2), "json");
    } catch (error) {
      // not JSON after all: markdown below
    }
  }
  return markdown(text, true);
}

function fieldMap(entry) {
  return Object.fromEntries((entry.tool_fields || []).map(field => [field.name, field]));
}

function fieldLabel(label, field) {
  return el("div", {class: "label", text: `${label}${cutNote(field.value, field.chars)}`});
}

// fields as a list: JSON highlighted, several lines as a block, the rest inline
function fieldList(fields) {
  if (!fields.length) return null;
  return el("dl", {class: "tool-fields"}, ...fields.flatMap(field => [
    el("dt", {text: `${field.name}${cutNote(field.value, field.chars)}`}),
    el("dd", {}, fieldValue(field))]));
}

function fieldValue(field) {
  const multiline = field.value.includes("\n");
  if (field.is_json) return highlighted(field.value, "json", !multiline);
  return multiline ? el("pre", {class: "code", text: field.value}) : field.value;
}

// Old and new text of an Edit as one diff: every old line with "-", every new one with "+"
function diffText(before, after) {
  const lines = text => (text ? text.split("\n") : []);
  return [...lines(before).map(line => `- ${line}`), ...lines(after).map(line => `+ ${line}`)].join("\n");
}

function toolInput(entry, fields) {
  const rest = names => (entry.tool_fields || []).filter(field => !names.includes(field.name));
  if (entry.tool === "Bash" && fields.command) {
    return el("div", {},
      fields.description ? el("div", {class: "tool-description", text: fields.description.value}) : null,
      fieldLabel("Command", fields.command), highlighted(fields.command.value, "bash"),
      fieldList(rest(["command", "description"])));
  }
  if (entry.tool === "Edit" && fields.file_path && (fields.old_string || fields.new_string)) {
    const before = fields.old_string || {value: "", chars: 0};
    const after = fields.new_string || {value: "", chars: 0};
    const cut = before.chars > before.value.length || after.chars > after.value.length;
    return el("div", {},
      el("div", {class: "tool-description", text: fields.file_path.value}),
      el("div", {class: "label", text: `Change${cut ? " · cut to the first 4,000 characters of each side" : ""}`}),
      highlighted(diffText(before.value, after.value), "diff"),
      fieldList(rest(["file_path", "old_string", "new_string"])));
  }
  if (entry.tool === "Write" && fields.file_path && fields.content) {
    return el("div", {},
      el("div", {class: "tool-description", text: fields.file_path.value}),
      fieldLabel("Content", fields.content), highlighted(fields.content.value, languageOfFile(fields.file_path.value)),
      fieldList(rest(["file_path", "content"])));
  }
  return el("div", {}, el("div", {class: "label", text: "Input"}), fieldList(entry.tool_fields || []));
}

// A result: a whole JSON document pretty-printed and highlighted, a Read by its file's language, else as text
function toolResult(entry, fields) {
  const complete = entry.result_chars <= entry.result.length;
  const trimmed = entry.result.trim();
  if (complete && (trimmed.startsWith("{") || trimmed.startsWith("["))) {
    try {
      return highlighted(JSON.stringify(JSON.parse(trimmed), null, 2), "json");
    } catch (error) {
      // not JSON after all: shown as text below
    }
  }
  if (entry.tool === "Read" && fields.file_path && !entry.is_error) {
    return highlighted(entry.result, languageOfFile(fields.file_path.value));
  }
  return el("pre", {class: "code", text: entry.result});
}

// An API call's tokens and cost, under its last entry: a badge, the cost in bold at its end
// A reminder at a milestone past a hint already shown: a chip at the end of the usage badge, one short line
function compactChip(hint) {
  if (hint.kind === "auto_reminder") {
    const share = percent(hint.context, hint.auto_compact);
    return el("span", {class: "compact-chip compact-chip-auto", role: "note",
                       text: `⚠ ${share} of auto-compact (${compact(hint.auto_compact)})`});
  }
  return el("span", {class: "compact-chip", role: "note",
                     text: `ℹ ${compact(hint.context)} · ${hint.times}× your ${compact(hint.threshold)} hint`});
}

function usageLine(usage, hint) {
  const parts = [`context ${compact(usage.context)}`, `in ${compact(usage.new_input)}`];
  if (usage.cache_write) parts.push(`cache write ${compact(usage.cache_write)}`);
  if (usage.cache_read) parts.push(`cache read ${compact(usage.cache_read)}`);
  parts.push(`out ${compact(usage.output)}`);
  if (usage.web_searches) parts.push(`${whole(usage.web_searches)} web searches`);
  if (usage.speed !== "standard") parts.push("fast mode");
  const reminder = hint && hint.kind.endsWith("_reminder") ? compactChip(hint) : null;
  // a reminder tints the whole badge in its status color, so it reads at a glance while scrolling
  const tint = !reminder ? "" : hint.kind === "auto_reminder" ? " chat-usage-remind-auto" : " chat-usage-remind";
  return el("div", {class: `chat-usage${tint}`}, el("span", {text: `${parts.join(" · ")} · `}),
            el("strong", {text: usage.cost === null ? "no price" : money(usage.cost)}), reminder);
}

// A hint to compact where a call's context first crosses a threshold: soft at the configured heuristic, stronger
// near the point where Claude Code auto-compacts. The icon and label carry the meaning, not the color.
function compactHint(hint) {
  if (hint.kind === "auto") {
    return el("div", {class: "compact-hint compact-auto", role: "note"},
      el("strong", {text: "⚠ Compact soon"}),
      ` Context ${compact(hint.context)}: ${percent(hint.context, hint.auto_compact)} of the ` +
      `${compact(hint.auto_compact)} where Claude Code auto-compacts. /compact now to choose what to keep.`);
  }
  const cost = hint.reread_cost ? `: this turn cost ${money(hint.reread_cost)} in cache reads` : "";
  return el("div", {class: "compact-hint", role: "note"},
    el("strong", {text: "ℹ Consider compacting"}),
    ` Context ${compact(hint.context)}, over the ${compact(hint.threshold)} hint (a heuristic, [chat] ` +
    `compact_hint_tokens in config.toml). Every turn re-reads it${cost}. /compact, or /clear when the task changes.`);
}

// an entry, followed by its API call's usage when it is the call's last one, and a compact hint where one is due
function chatEntry(entry) {
  const shown = chatBlock(entry);
  if (!entry.usage) return shown;
  const hint = entry.compact_hint;
  // the first hint of each kind is a block with its advice; the reminders after it are chips in the badge
  const announced = hint && !hint.kind.endsWith("_reminder") ? compactHint(hint) : null;
  return el("div", {class: "chat-step"}, shown, usageLine(entry.usage, hint), announced);
}

function chatBlock(entry) {
  const time = el("span", {class: "muted", text: when(entry.timestamp)});
  if (entry.kind === "compaction" || entry.kind === "error") {
    return el("div", {class: "chat-marker"}, entry.kind === "error" ? `⚠ API error: ${entry.text}` : entry.text,
              " ", time);
  }
  if (entry.kind === "tool") {
    const status = entry.result === null ? " · no result yet" : entry.is_error ? " · ⚠ failed" : "";
    const fields = fieldMap(entry);
    // a Bash call says what it does in its description; the command follows in the body
    const summary = entry.tool === "Bash" && fields.description ? fields.description.value : entry.summary;
    return el("details", {class: "chat-tool"},
      el("summary", {}, el("strong", {text: entry.tool}), summary ? ` ${summary}` : "", status, " ", time),
      toolInput(entry, fields),
      entry.result === null ? null
        : el("div", {class: "label", text: `Result${cutNote(entry.result, entry.result_chars)}`}),
      entry.result === null ? null : toolResult(entry, fields));
  }
  const model = [entry.model, entry.effort ? `effort ${entry.effort}` : null].filter(Boolean).join(" · ");
  const head = el("div", {class: "chat-head"}, el("strong", {text: CHAT_ROLES[entry.kind] || entry.kind}),
                  model && entry.kind !== "prompt" ? el("span", {class: "muted", text: model}) : null, time);
  if (entry.kind === "thinking") {
    return el("details", {class: "chat-entry chat-thinking"}, el("summary", {}, head),
              el("div", {class: "chat-text", text: entry.text}));
  }
  const body = entry.kind === "text" ? markdown(entry.text)
             : entry.kind === "prompt" ? promptBody(entry.text) : el("div", {class: "chat-text", text: entry.text});
  return el("div", {class: `chat-entry ${entry.kind === "prompt" ? "chat-user" : "chat-assistant"}`}, head, body);
}
