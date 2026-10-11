// Loads settings, sources, and questions, and runs the checks in logic/validate.js.
// Owner: Claude (step 1). Contract: ARCHITECTURE.md, Section 3 ("Display").

import { validateSettings, validateSources, validateQuestions, BankFileError } from './logic/validate.js';

const DATA = new URL('../data/', import.meta.url);

async function getJson(path) {
  let response;
  try {
    response = await fetch(new URL(path, DATA), { cache: 'no-cache' });
  } catch {
    throw new BankFileError(path, "couldn't be downloaded. Check your connection and reload the page.");
  }
  if (!response.ok) throw new BankFileError(path, `couldn't be downloaded (status ${response.status}).`);
  try {
    return await response.json();
  } catch {
    throw new BankFileError(path, "isn't valid JSON, so it can't be read.");
  }
}

/**
 * Loads and checks all data for the current content mode.
 * @returns {Promise<object>} a Bank (ARCHITECTURE.md, Section 2)
 * @throws {BankFileError} if any file can't be downloaded or read
 */
export async function loadBank() {
  const { settings, errors: settingsErrors } = validateSettings(await getJson('settings.json'));
  const fixtures = settings.content_mode === 'fixtures';
  const sourcesPath = fixtures ? 'fixtures/sources.json' : 'sources.json';
  const questionsPath = fixtures ? `fixtures/questions-${settings.fixture_set}.json` : 'questions.json';

  const [rawSources, rawQuestions] = await Promise.all([getJson(sourcesPath), getJson(questionsPath)]);
  const { sources, errors: sourceErrors } = validateSources(rawSources);
  const { meta, questions, excluded } = validateQuestions(rawQuestions, sources, settings.content_mode);

  return {
    contentMode: settings.content_mode,
    meta,
    questions,
    questionsById: new Map(questions.map((q) => [q.id, q])),
    sources,
    settings,
    excluded,
    sourceErrors,
    settingsErrors,
  };
}
