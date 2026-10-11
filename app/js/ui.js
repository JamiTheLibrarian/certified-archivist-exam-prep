// Shared display helpers. Owner: Claude (step 1). Contract: ARCHITECTURE.md, Section 3.
// Text is always added as text, never as HTML, so question content can't break the page.

/**
 * Builds an element. `props` may include className, id, attrs (an object of attributes),
 * and on (an object of event handlers, which should be paired with a signal: see `listen`).
 * Children can be elements, strings, numbers, or null (skipped).
 */
export function el(tag, props = {}, ...children) {
  const node = document.createElement(tag);
  if (props.className) node.className = props.className;
  if (props.id) node.id = props.id;
  for (const [name, value] of Object.entries(props.attrs || {})) {
    if (value === false || value === null || value === undefined) continue;
    node.setAttribute(name, value === true ? '' : String(value));
  }
  for (const child of children.flat()) {
    if (child === null || child === undefined || child === false) continue;
    node.append(child instanceof Node ? child : document.createTextNode(String(child)));
  }
  return node;
}

/** Adds an event listener that is removed automatically when the screen's signal aborts. */
export function listen(target, type, handler, signal) {
  target.addEventListener(type, handler, { signal });
}

/** Runs `fn` every `ms` milliseconds until the screen's signal aborts. */
export function every(ms, fn, signal) {
  const id = setInterval(fn, ms);
  signal.addEventListener('abort', () => clearInterval(id), { once: true });
  return id;
}

/** Reads a message aloud to screen-reader users without moving their focus. */
export function announce(message) {
  const region = document.getElementById('announcer');
  if (!region) return;
  region.textContent = '';
  setTimeout(() => { region.textContent = message; }, 50);
}

/**
 * Builds a notice. kind: "info", "warning", or "error". `details` is an optional list of lines.
 */
export function notice({ kind = 'info', text, details = [] }) {
  return el('div', { className: `notice notice-${kind}`, attrs: { role: kind === 'error' ? 'alert' : 'status' } },
    el('p', {}, text),
    details.length ? el('ul', {}, details.map((d) => el('li', {}, d))) : null);
}

/**
 * Formats a percentage for display without ever rounding up across a score boundary:
 * 85 shows as "85%", 84.96 as "84.9%".
 */
export function formatPercent(percent) {
  if (!Number.isFinite(percent)) return '—';
  const truncated = Math.floor(percent * 10) / 10;
  return Number.isInteger(truncated) ? `${truncated}%` : `${truncated.toFixed(1)}%`;
}

/** Joins two-part counts in plain language: plural(1, "question") → "1 question". */
export function plural(n, word, pluralWord = `${word}s`) {
  return `${n} ${n === 1 ? word : pluralWord}`;
}

/** Domain names from the current Role Delineation Statement (see RESEARCH.md). */
export const DOMAIN_NAMES = {
  D1: 'Selection and Appraisal',
  D2: 'Arrangement and Description',
  D3: 'Reference Services and Access',
  D4: 'Preservation and Protection',
  D5: 'Outreach, Advocacy, and Marketing',
  D6: 'Managing Archival Programs',
  D7: 'Professional, Ethical, and Legal Responsibilities',
  D8: 'Cultural Competency',
  G: 'General Knowledge',
};
