// Tests for app/js/logic/validate.js. Owner: Claude (step 1).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { validateSources, validateSettings, validateQuestions, BankFileError } from '../app/js/logic/validate.js';

const source = (over = {}) => ({
  source_id: 'oestreicher-2020', display_name: 'Oestreicher, Reference and Access', author: 'Cheryl Oestreicher',
  title: 'Reference and Access for Archives and Manuscripts', year: 2020, reading_list: true,
  citation_url: 'https://example.org/catalog/oestreicher', ...over,
});

const check = (over = {}) => ({ result: 'Confirmed', by: 'Plexy', date: '2026-10-20', ...over });

const question = (over = {}) => ({
  id: 'Q-D3-0001', revision: 1, status: 'approved', domain: 'D3', rds_refs: ['D3 Task 1'],
  question: 'Question text', explanation: 'Explanation text', correct_choice: 'c',
  choices: [{ id: 'a', text: 'A' }, { id: 'b', text: 'B' }, { id: 'c', text: 'C' }, { id: 'd', text: 'D' }],
  source: { source_id: 'oestreicher-2020', locator: 'pp. 87-89', checked: '2026-10-20' },
  review: {
    fact_check: check(), answer_key_check: check(), originality_check: check(),
    instructional_review: { result: 'Approved', by: 'Jami', date: '2026-10-22' },
    approved: { by: 'Jami', date: '2026-10-22' },
  },
  ...over,
});

const bankOf = (questions, over = {}) => ({
  bank: { version: '2026.11.1', generated: '2026-11-02', content_type: 'approved', ...over }, questions,
});
const sources = validateSources({ sources: [source()] }).sources;
const reasonFor = (q, mode = 'approved') => validateQuestions(bankOf([q]), sources, mode).excluded[0]?.reason;

const settings = (over = {}) => ({
  content_mode: 'approved', release_status: 'development',
  practice_exam: { length: 100, time_limit_minutes: 180, minimum_per_domain: 10, allocation: null },
  score_goals: { green: 85, yellow: 75 }, ...over,
});
const allocation = { D1: 12, D2: 12, D3: 12, D4: 12, D5: 13, D6: 13, D7: 13, D8: 13 };

// ---------------- sources

test('a complete source is accepted', () => {
  const { sources: map, errors } = validateSources({ sources: [source()] });
  assert.equal(map.size, 1);
  assert.deepEqual(errors, []);
});

test('a source without a citation URL is rejected with a reason', () => {
  const { errors } = validateSources({ sources: [source({ citation_url: '' })] });
  assert.match(errors[0].reason, /citation_url/);
});

test('duplicate source IDs reject every copy', () => {
  const { sources: map, errors } = validateSources({ sources: [source(), source()] });
  assert.equal(map.size, 0);
  assert.equal(errors.length, 2);
});

test('an unreadable sources file throws BankFileError', () => {
  assert.throws(() => validateSources({ items: [] }), BankFileError);
});

// ---------------- settings

test('valid settings with no allocation have no errors', () => {
  assert.deepEqual(validateSettings(settings()).errors, []);
});

test('an allocation totaling 100 with every domain at the minimum is accepted', () => {
  const s = settings({ practice_exam: { ...settings().practice_exam, allocation } });
  assert.deepEqual(validateSettings(s).errors, []);
});

test('an allocation that does not total 100 is reported', () => {
  const s = settings({ practice_exam: { ...settings().practice_exam, allocation: { ...allocation, D8: 11 } } });
  assert.match(validateSettings(s).errors.join(), /totals 98, not 100/);
});

test('an allocation below the domain minimum is reported', () => {
  const s = settings({ practice_exam: { ...settings().practice_exam, allocation: { ...allocation, D1: 9, D2: 15 } } });
  assert.match(validateSettings(s).errors.join(), /D1 9, below the minimum of 10/);
});

test('score goals must have yellow below green', () => {
  assert.equal(validateSettings(settings({ score_goals: { green: 75, yellow: 85 } })).errors.length, 1);
});

test('an unknown content mode throws BankFileError', () => {
  assert.throws(() => validateSettings(settings({ content_mode: 'draft' })), BankFileError);
});

test('fixtures mode needs a fixture set', () => {
  assert.throws(() => validateSettings(settings({ content_mode: 'fixtures' })), BankFileError);
});

// ---------------- questions

test('a complete approved question is accepted', () => {
  const { questions, excluded } = validateQuestions(bankOf([question()]), sources, 'approved');
  assert.equal(questions.length, 1);
  assert.deepEqual(excluded, []);
});

test('correct_choice must match a choice, with a readable reason', () => {
  assert.equal(reasonFor(question({ correct_choice: 'e' })), "correct_choice 'e' doesn't match any choice");
});

test('questions must have exactly four choices', () => {
  assert.match(reasonFor(question({ choices: question().choices.slice(0, 3) })), /exactly four choices/);
});

test('choice IDs must be unique', () => {
  const choices = question().choices.map((c) => ({ ...c, id: c.id === 'b' ? 'a' : c.id }));
  assert.match(reasonFor(question({ choices })), /appears more than once/);
});

test('duplicate question IDs exclude every copy', () => {
  const { questions, excluded } = validateQuestions(bankOf([question(), question()]), sources, 'approved');
  assert.equal(questions.length, 0);
  assert.equal(excluded.length, 2);
  assert.match(excluded[0].reason, /appears 2 times/);
});

test('a source_id must exist in the sources list', () => {
  assert.match(reasonFor(question({ source: { ...question().source, source_id: 'missing' } })), /isn't in the sources list/);
});

test('the domain must be D1-D8 or G', () => {
  assert.match(reasonFor(question({ domain: 'D9' })), /isn't one of/);
  assert.equal(reasonFor(question({ domain: 'G' })), undefined);
});

test('revision must be a whole number of 1 or more', () => {
  assert.match(reasonFor(question({ revision: 0 })), /revision/);
  assert.match(reasonFor(question({ revision: 1.5 })), /revision/);
});

test('an incomplete review record excludes the question', () => {
  const review = { ...question().review, originality_check: check({ result: 'Corrected' }) };
  assert.match(reasonFor(question({ review })), /originality_check is "Corrected"/);
  assert.match(reasonFor(question({ review: undefined })), /review record/);
});

test('approved mode refuses fixture IDs, and fixtures mode refuses real IDs', () => {
  assert.match(reasonFor(question({ id: 'TEST-D3-001' })), /must start with "Q-"/);
  const fixtureBank = bankOf([question({ rds_refs: [] })], { content_type: 'fixture' });
  assert.match(validateQuestions(fixtureBank, sources, 'fixtures').excluded[0].reason, /must start with "TEST-"/);
});

test('fixture questions may not carry real RDS references', () => {
  const fixtureBank = bankOf([question({ id: 'TEST-D3-001' })], { content_type: 'fixture' });
  assert.match(validateQuestions(fixtureBank, sources, 'fixtures').excluded[0].reason, /RDS references/);
});

test('a bank whose content_type does not match the mode throws BankFileError', () => {
  assert.throws(() => validateQuestions(bankOf([], { content_type: 'fixture' }), sources, 'approved'), BankFileError);
});

test('a bank without a questions list throws BankFileError', () => {
  assert.throws(() => validateQuestions({ bank: {} }, sources, 'approved'), BankFileError);
});

test('supplemental evidence needs a web address and dates', () => {
  const s = { ...question().source, supplemental: [{ title: 'Agency page', url: 'not a url', source_date: 'Not shown', checked: '2026-10-20' }] };
  assert.match(reasonFor(question({ source: s })), /web address/);
});
