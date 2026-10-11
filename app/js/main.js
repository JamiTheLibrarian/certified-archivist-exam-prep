// Starts the app, holds the shared `app` object, and switches screens.
// Owner: Claude (step 1). Contract: ARCHITECTURE.md, Section 3 ("Screen lifecycle").

import { loadBank } from './data.js';
import { el, notice, plural, DOMAIN_NAMES } from './ui.js';
import { BankFileError, ALL_DOMAINS } from './logic/validate.js';

// Each later step adds its screen here, e.g. `learning: renderLearning` (step 2).
const screens = {
  start: renderStart, // temporary; replaced by the home page in step 8
};

// Stand-in until step 5 builds the real progress store: it saves nothing and says so.
const placeholderProgress = {
  available: false,
  view: () => null,
  recordAnswer: () => ({ ok: false, error: 'not_built' }),
  recordAttempt: () => ({ ok: false, error: 'not_built' }),
  reset: () => ({ ok: false, error: 'not_built' }),
  saveAttempt: () => ({ ok: false, error: 'not_built' }),
  loadAttempt: () => ({ ok: false, error: 'none' }),
  clearAttempt: () => ({ ok: false, error: 'not_built' }),
};

export const app = {
  bank: null,
  progress: placeholderProgress,
  notices: [],
  random: Math.random,
  now: () => Date.now(),
  showScreen,
};

let currentScreen = null;

/** Switches screens: stops the old screen's listeners and timers, then draws the new one. */
export function showScreen(name, params = {}) {
  const render = screens[name];
  if (!render) throw new Error(`No screen named "${name}"`);
  currentScreen?.abort();
  currentScreen = new AbortController();

  const container = document.getElementById('screen');
  container.replaceChildren();
  drawNotices();
  render(container, app, params, currentScreen.signal);

  // Move focus to the new screen's heading so keyboard and screen-reader users start at the top.
  const heading = container.querySelector('h1, h2');
  if (heading) {
    heading.setAttribute('tabindex', '-1');
    heading.focus({ preventScroll: true });
  }
}

function drawNotices() {
  document.getElementById('notices').replaceChildren(...app.notices.map(notice));
}

function drawBanner(bank) {
  const banner = document.getElementById('banner');
  if (bank.contentMode === 'fixtures') {
    banner.replaceChildren(el('p', {}, 'Fictional test data, not exam preparation.'));
    banner.hidden = false;
  } else if (bank.settings.release_status !== 'released') {
    banner.replaceChildren(el('p', {}, 'In development. Features and questions are still being tested.'));
    banner.hidden = false;
  }
}

function collectNotices(bank) {
  const bad = bank.excluded.length;
  if (bad) {
    app.notices.push({
      kind: 'warning',
      text: `${plural(bad, 'question was', 'questions were')} excluded because of data errors.`,
      details: bank.excluded.map((x) => `${x.id}: ${x.reason}`),
    });
    console.warn('Excluded questions:', bank.excluded);
  }
  if (bank.sourceErrors.length) {
    app.notices.push({
      kind: 'warning',
      text: `${plural(bank.sourceErrors.length, 'source was', 'sources were')} excluded because of data errors.`,
      details: bank.sourceErrors.map((x) => `${x.id}: ${x.reason}`),
    });
    console.warn('Excluded sources:', bank.sourceErrors);
  }
  if (bank.settingsErrors.length) console.warn('Settings problems:', bank.settingsErrors);
}

// Temporary start screen for step 1: shows what loaded, so the foundation can be checked.
function renderStart(container, { bank }) {
  const byDomain = Object.fromEntries(ALL_DOMAINS.map((d) => [d, 0]));
  for (const q of bank.questions) byDomain[q.domain] += 1;

  container.append(
    el('h1', {}, 'Certified Archivist Exam Prep'),
    el('p', { className: 'lede' }, 'Practice questions for the Academy of Certified Archivists exam, organized by domain and Reading List source.'),
    el('p', { className: 'disclaimer' }, 'An independent study aid. Not affiliated with or endorsed by the Academy of Certified Archivists.'),

    el('section', { attrs: { 'aria-labelledby': 'bank-heading' } },
      el('h2', { id: 'bank-heading' }, 'Question bank'),
      el('p', {}, `Version ${bank.meta.version}, generated ${bank.meta.generated}. ${plural(bank.questions.length, 'question')} loaded from ${plural(bank.sources.size, 'source')}.`),
      el('table', { className: 'counts' },
        el('caption', {}, 'Questions by domain'),
        el('thead', {}, el('tr', {}, el('th', { attrs: { scope: 'col' } }, 'Domain'), el('th', { attrs: { scope: 'col' } }, 'Questions'))),
        el('tbody', {}, ALL_DOMAINS.map((d) =>
          el('tr', {}, el('th', { attrs: { scope: 'row' } }, `${d}: ${DOMAIN_NAMES[d]}`), el('td', {}, byDomain[d])))))),

    el('section', { attrs: { 'aria-labelledby': 'next-heading' } },
      el('h2', { id: 'next-heading' }, 'Study modes'),
      el('p', {}, 'Learning Mode and the Practice Exam are being built. This page will become the home page once they are ready.')),
  );

  if (bank.settingsErrors.length) {
    container.append(el('section', { attrs: { 'aria-labelledby': 'settings-heading' } },
      el('h2', { id: 'settings-heading' }, 'Practice Exam settings'),
      el('p', {}, 'The Practice Exam will be unavailable until these settings are fixed:'),
      el('ul', {}, bank.settingsErrors.map((e) => el('li', {}, e)))));
  }
}

function renderFatal(error) {
  const container = document.getElementById('screen');
  container.replaceChildren(
    el('h1', {}, "The question bank couldn't be loaded"),
    el('p', {}, error.message),
    el('p', {}, 'Reload the page to try again. If the problem continues, the data file needs to be fixed before the app can start.'),
  );
}

async function start() {
  try {
    app.bank = await loadBank();
  } catch (error) {
    if (error instanceof BankFileError) {
      renderFatal(error);
      return;
    }
    throw error;
  }
  drawBanner(app.bank);
  collectNotices(app.bank);
  showScreen('start');
}

start();
