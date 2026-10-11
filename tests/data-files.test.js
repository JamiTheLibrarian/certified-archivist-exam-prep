// Checks the real data files in the repository, so a bad edit shows a red X on the commit.
// Owner: Claude (step 1).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { validateSources, validateSettings, validateQuestions, EXAM_DOMAINS } from '../app/js/logic/validate.js';

const read = (path) => JSON.parse(readFileSync(new URL(`../app/data/${path}`, import.meta.url), 'utf8'));

test('settings.json is valid', () => {
  const { errors } = validateSettings(read('settings.json'));
  assert.deepEqual(errors, []);
});

test('approved sources and questions are all valid', () => {
  const { sources, errors } = validateSources(read('sources.json'));
  assert.deepEqual(errors, []);
  const { excluded } = validateQuestions(read('questions.json'), sources, 'approved');
  assert.deepEqual(excluded, [], 'every approved question must pass every check');
});

for (const set of ['small', 'full']) {
  test(`fixture set "${set}" is valid and clearly fictional`, () => {
    const { sources, errors } = validateSources(read('fixtures/sources.json'));
    assert.deepEqual(errors, []);
    for (const s of sources.values()) assert.match(s.citation_url, /^https:\/\/example\.org\//);
    const { questions, excluded } = validateQuestions(read(`fixtures/questions-${set}.json`), sources, 'fixtures');
    assert.deepEqual(excluded, []);
    assert.ok(questions.every((q) => q.id.startsWith('TEST-') && /^Fictional test question/.test(q.question)));
  });
}

test('the full fixture set has at least 13 questions in every exam domain', () => {
  const { sources } = validateSources(read('fixtures/sources.json'));
  const { questions } = validateQuestions(read('fixtures/questions-full.json'), sources, 'fixtures');
  for (const d of EXAM_DOMAINS) {
    assert.ok(questions.filter((q) => q.domain === d).length >= 13, `${d} needs at least 13 fixture questions`);
  }
});
