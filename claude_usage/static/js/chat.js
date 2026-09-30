// A session's conversation, entry by entry: the frame (loading from the transcript on request, never stored, the
// refresh, the order, Close, the picker) is the Conversation component (web/src/components/Conversation.svelte), which
// draws each entry through chatEntry below until the entries are components too. All text as text.
"use strict";

// --- conversation --------------------------------------------------------------------------------------------

const CHAT_ROLES = {prompt: "You", text: "Claude", thinking: "Thinking"};

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

// An API call's tokens and cost, under its last entry: a badge, the cost in bold at its start
// A reminder at a milestone past a hint already shown: a chip at the end of the usage badge, one short line
function compactChip(hint) {
  if (hint.kind === "auto_reminder") {
    const share = percent(hint.context, hint.auto_compact);
    return el("span", {class: "compact-chip compact-chip-auto", role: "note",
                       text: `⚠ ${share} of auto-compact (${compact(hint.auto_compact)})`});
  }
  if (hint.kind === "pays_reminder") {
    return el("span", {class: "compact-chip compact-chip-pays", role: "note",
                       text: `⚠ ${compact(hint.context)} · compacting pays after ~${hint.pays_off_in} replies`});
  }
  return el("span", {class: "compact-chip", role: "note",
                     text: `ℹ ${compact(hint.context)} · ${hint.times}× your ${compact(hint.threshold)} hint`});
}

// A call that wrote the cache again instead of reading it: a neutral chip, the cause in words and what it cost
function rebuildChip(rebuild) {
  const cost = rebuild.extra_cost === null ? "" : ` · +${money(rebuild.extra_cost)}`;
  const why = `${compact(rebuild.lost)} tokens written to the cache again: ${REBUILD_CAUSES[rebuild.cause]}`;
  return el("span", {class: "rebuild-chip", role: "note", title: why,
                     text: `↻ cache rebuilt (${rebuild.cause}) · ${compact(rebuild.lost)}${cost}`});
}

// what the call added beyond the previous one's context and output, signed
function growthText(growth) { return ` (${signed(growth)})`; }

// the context's change since the previous call, split into the previous reply (sent again) and what was added
// from outside (tool results, prompts, attachments), so the parts add up: " (+6.3K: reply 0.4K, added 5.9K)"
function contextChange(usage) {
  if (usage.growth === null || usage.growth === undefined) return "";
  if (!usage.reply) return growthText(usage.growth);
  const added = usage.growth < 0 ? signed(usage.growth) : compact(usage.growth);
  return ` (${signed(usage.reply + usage.growth)}: reply ${compact(usage.reply)}, added ${added})`;
}

function usageLine(usage, hint) {
  const growth = contextChange(usage);
  const parts = [`context ${compact(usage.context)}${growth}`, `in ${compact(usage.new_input)}`];
  if (usage.cache_write) parts.push(`cache write ${compact(usage.cache_write)}`);
  if (usage.cache_read) parts.push(`cache read ${compact(usage.cache_read)}`);
  parts.push(`out ${compact(usage.output)}`);
  if (usage.web_searches) parts.push(`${whole(usage.web_searches)} web searches`);
  if (usage.speed !== "standard") parts.push("fast mode");
  const reminder = hint && hint.kind.endsWith("_reminder") ? compactChip(hint) : null;
  // a reminder tints the whole badge in its status color, so it reads at a glance while scrolling
  const tints = {auto_reminder: " chat-usage-remind-auto", pays_reminder: " chat-usage-remind-pays"};
  const tint = !reminder ? "" : tints[hint.kind] || " chat-usage-remind";
  // the cost first, so each call's price reads at a glance while scrolling
  const title = usage.reminder_chars
    ? `The context includes Claude Code's token reminder (${whole(usage.reminder_chars)} characters)` : null;
  return el("div", {class: `chat-usage${tint}`, title},
            el("strong", {text: usage.cost === null ? "no price" : money(usage.cost)}),
            el("span", {text: ` · ${parts.join(" · ")}`}), reminder,
            usage.rebuild ? rebuildChip(usage.rebuild) : null);
}

// A hint to compact where a call's context first crosses a threshold: soft at the configured heuristic, sterner
// where compacting likely pays for itself (learnt from past compactions), strongest near the point where Claude Code
// auto-compacts. The icon and label carry the meaning, not the color.
function compactHint(hint) {
  if (hint.kind === "pays") {
    return el("div", {class: "compact-hint compact-pays", role: "note"},
      el("strong", {text: "⚠ Compacting pays on average"}),
      ` Context ${compact(hint.context)}, and every reply reads all of it again. /compact would shrink it to about ` +
      `${compact(hint.after)}. That costs ~${money(hint.one_time)} once, and the cheaper replies pay it back ` +
      `within about ${hint.pays_off_in} replies. ` +
      (hint.ahead_from === "longer"
        ? `After your past compactions, a stretch this long went on for about ${hint.calls_ahead} more on average.`
        : `After your past compactions you went on for about ${hint.calls_ahead} replies on average.`));
  }
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
  return el("div", {}, shown, usageLine(entry.usage, hint), announced);
}

// A compaction's line: how it was triggered, the context before and after (the next call's, which carries the
// system prompt, tools and CLAUDE.md again, once known), and how long the summary took
function compactionText(entry) {
  const marker = entry.compaction || {};
  const parts = [entry.text];
  if (marker.trigger) parts.push(marker.trigger);
  if (marker.pre_tokens !== null && marker.pre_tokens !== undefined) {
    const after = entry.versus_keeping ? `next call ${compact(entry.versus_keeping.after)}`
                                       : `${compact(marker.post_tokens)} tokens`;
    parts.push(`${compact(marker.pre_tokens)} → ${after}`);
  }
  if (marker.duration_ms) parts.push(`took ${duration(marker.duration_ms)}`);
  return parts.join(" · ");
}

// --- a compaction against keeping the context (turns.versus_keeping) ------------------------------------------

// the verdict as an element: a gain or loss in its tone, with the words in its title
function verdictBadge(comparison) {
  const tone = verdictTone(comparison);
  return el("span", {class: tone ? `verdict-${tone}` : null, title: verdictWords(comparison),
                     text: verdictText(comparison)});
}

function versusKeepingLine(comparison) {
  const parts = [breakevenText(comparison), `${whole(comparison.calls_after)} calls after`,
                 `cost ${oneTimeText(comparison)} once`];
  return el("div", {class: "muted", title: VERSUS_KEEPING_NOTE}, "vs keeping: ", verdictBadge(comparison),
            ` · ${parts.filter(Boolean).join(" · ")}`);
}

// the kinds of hidden context that aren't an attachment type
const INJECTED_KINDS = {meta: "meta record", skill: "skill text", summary: "compact summary"};

function injectedKind(kind) { return INJECTED_KINDS[kind] || kind.replaceAll("_", " "); }

// Hidden context Claude Code added to the next request (attachments, meta records, skill text, the compact
// summary), collapsed: the model got it, the transcript doesn't show it as a turn
function injectedBlock(entry, time) {
  const chars = entry.items.reduce((sum, item) => sum + item.chars, 0);
  const count = entry.items.length === 1 ? "1 item" : `${whole(entry.items.length)} items`;
  return el("details", {class: "chat-tool chat-injected"},
    el("summary", {}, el("strong", {text: "Added to the context"}), ` ${count} · ${whole(chars)} characters `, time),
    ...entry.items.flatMap(item => [
      el("div", {class: "label", text: `${injectedKind(item.kind)}${cutNote(item.text, item.chars)}`}),
      el("pre", {class: "code", text: item.text})]));
}

function chatBlock(entry) {
  const time = el("span", {class: "muted", text: when(entry.timestamp)});
  if (entry.kind === "compaction" || entry.kind === "error") {
    return el("div", {class: "chat-marker"},
              entry.kind === "error" ? `⚠ API error: ${entry.text}` : compactionText(entry), " ", time,
              entry.versus_keeping ? versusKeepingLine(entry.versus_keeping) : null);
  }
  if (entry.kind === "injected") return injectedBlock(entry, time);
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
