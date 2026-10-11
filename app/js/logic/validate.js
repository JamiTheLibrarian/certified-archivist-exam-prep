// Checks the contents of questions.json, sources.json, and settings.json.
// Owner: Claude (step 1). Contract: ARCHITECTURE.md, Section 3; rules: PROJECT_SPEC.md, Section 10.2.
//
// These functions never touch the page or the browser. Problems with individual records
// are returned as readable reasons. They throw BankFileError only when a whole file's
// structure can't be read.

export const EXAM_DOMAINS = ['D1', 'D2', 'D3', 'D4', 'D5', 'D6', 'D7', 'D8'];
export const ALL_DOMAINS = [...EXAM_DOMAINS, 'G'];
export const CONTENT_MODES = ['fixtures', 'approved'];
export const FIXTURE_SETS = ['small', 'full'];

const DATE = /^\d{4}-\d{2}-\d{2}$/;
const URL_PATTERN = /^https?:\/\/\S+$/;
const REVIEW_CHECKS = ['fact_check', 'answer_key_check', 'originality_check'];

/** Thrown when a data file's overall structure can't be read. */
export class BankFileError extends Error {
  constructor(file, message) {
    super(`${file}: ${message}`);
    this.name = 'BankFileError';
    this.file = file;
  }
}

const isObject = (v) => v !== null && typeof v === 'object' && !Array.isArray(v);
const isText = (v) => typeof v === 'string' && v.trim() !== '';
const isDate = (v) => typeof v === 'string' && DATE.test(v) && !Number.isNaN(Date.parse(v));

// ---------------------------------------------------------------- sources

/**
 * Checks sources.json.
 * @returns {{ sources: Map<string, object>, errors: {id: string, reason: string}[] }}
 */
export function validateSources(raw) {
  if (!isObject(raw) || !Array.isArray(raw.sources)) {
    throw new BankFileError('sources.json', 'expected an object with a "sources" list');
  }
  const sources = new Map();
  const errors = [];
  const seen = new Map();

  raw.sources.forEach((s, index) => {
    const id = isObject(s) && isText(s.source_id) ? s.source_id : `(source ${index + 1})`;
    seen.set(id, (seen.get(id) || 0) + 1);
  });

  raw.sources.forEach((s, index) => {
    const id = isObject(s) && isText(s.source_id) ? s.source_id : `(source ${index + 1})`;
    const reason = sourceProblem(s, seen.get(id));
    if (reason) errors.push({ id, reason });
    else sources.set(id, s);
  });

  return { sources, errors };
}

function sourceProblem(s, copies) {
  if (!isObject(s)) return 'is not a source record';
  if (!isText(s.source_id)) return 'is missing source_id';
  if (copies > 1) return `source_id appears ${copies} times`;
  for (const field of ['display_name', 'author', 'title']) {
    if (!isText(s[field])) return `is missing ${field}`;
  }
  if (!Number.isInteger(s.year)) return 'year must be a whole number';
  if (typeof s.reading_list !== 'boolean') return 'reading_list must be true or false';
  if (!isText(s.citation_url) || !URL_PATTERN.test(s.citation_url)) {
    return 'citation_url must be a web address starting with http:// or https://';
  }
  return null;
}

// ---------------------------------------------------------------- settings

/**
 * Checks settings.json.
 * Problems that only affect the Practice Exam (for example, an allocation that doesn't total 100)
 * are returned as errors; the rest of the app can still run.
 * @returns {{ settings: object, errors: string[] }}
 */
export function validateSettings(raw) {
  if (!isObject(raw)) throw new BankFileError('settings.json', 'expected an object');
  if (!CONTENT_MODES.includes(raw.content_mode)) {
    throw new BankFileError('settings.json', `content_mode must be "fixtures" or "approved"`);
  }
  if (raw.content_mode === 'fixtures' && !FIXTURE_SETS.includes(raw.fixture_set)) {
    throw new BankFileError('settings.json', `fixture_set must be "small" or "full" in fixtures mode`);
  }

  const errors = [];
  const exam = raw.practice_exam;
  if (!isObject(exam)) {
    errors.push('practice_exam settings are missing');
  } else {
    if (!Number.isInteger(exam.length) || exam.length < 1) errors.push('practice_exam.length must be a positive whole number');
    if (!Number.isInteger(exam.time_limit_minutes) || exam.time_limit_minutes < 1) {
      errors.push('practice_exam.time_limit_minutes must be a positive whole number');
    }
    if (!Number.isInteger(exam.minimum_per_domain) || exam.minimum_per_domain < 0) {
      errors.push('practice_exam.minimum_per_domain must be a whole number');
    }
    if (exam.allocation !== null) errors.push(...allocationProblems(exam));
  }

  const goals = raw.score_goals;
  if (!isObject(goals) || typeof goals.green !== 'number' || typeof goals.yellow !== 'number') {
    errors.push('score_goals needs numbers for green and yellow');
  } else if (!(goals.yellow < goals.green && goals.yellow >= 0 && goals.green <= 100)) {
    errors.push('score_goals must have yellow below green, both from 0 to 100');
  }

  return { settings: raw, errors };
}

function allocationProblems(exam) {
  const a = exam.allocation;
  if (!isObject(a)) return ['practice_exam.allocation must be null or a count for each domain'];
  const problems = [];
  const extra = Object.keys(a).filter((k) => !EXAM_DOMAINS.includes(k));
  if (extra.length) problems.push(`allocation has unknown domains: ${extra.join(', ')}`);
  let total = 0;
  for (const d of EXAM_DOMAINS) {
    const n = a[d];
    if (!Number.isInteger(n)) {
      problems.push(`allocation needs a whole number for ${d}`);
      continue;
    }
    if (n < exam.minimum_per_domain) problems.push(`allocation gives ${d} ${n}, below the minimum of ${exam.minimum_per_domain}`);
    total += n;
  }
  if (problems.length === 0 && total !== exam.length) {
    problems.push(`allocation totals ${total}, not ${exam.length}`);
  }
  return problems;
}

// ---------------------------------------------------------------- questions

/**
 * Checks questions.json (or a fixture set).
 * Invalid or duplicate questions are left out and listed in `excluded` with a reason.
 * @param {object} raw          the parsed file
 * @param {Map} sources         from validateSources
 * @param {string} contentMode  "approved" or "fixtures"
 * @returns {{ meta: object, questions: object[], excluded: {id: string, reason: string}[] }}
 */
export function validateQuestions(raw, sources, contentMode) {
  const file = contentMode === 'fixtures' ? 'fixture questions' : 'questions.json';
  if (!isObject(raw) || !isObject(raw.bank) || !Array.isArray(raw.questions)) {
    throw new BankFileError(file, 'expected an object with "bank" and "questions"');
  }
  const meta = raw.bank;
  const expectedType = contentMode === 'fixtures' ? 'fixture' : 'approved';
  if (meta.content_type !== expectedType) {
    throw new BankFileError(file, `bank.content_type is "${meta.content_type}", expected "${expectedType}"`);
  }
  if (!isText(meta.version)) throw new BankFileError(file, 'bank.version is missing');
  if (!isDate(meta.generated)) throw new BankFileError(file, 'bank.generated must be a date (YYYY-MM-DD)');

  const counts = new Map();
  raw.questions.forEach((q) => {
    if (isObject(q) && isText(q.id)) counts.set(q.id, (counts.get(q.id) || 0) + 1);
  });

  const questions = [];
  const excluded = [];
  raw.questions.forEach((q, index) => {
    const id = isObject(q) && isText(q.id) ? q.id : `(question ${index + 1})`;
    const copies = counts.get(id) || 0;
    const reason = copies > 1 ? `id appears ${copies} times` : questionProblem(q, sources, contentMode);
    if (reason) excluded.push({ id, reason });
    else questions.push(q);
  });

  return { meta, questions, excluded };
}

function questionProblem(q, sources, contentMode) {
  if (!isObject(q)) return 'is not a question record';
  if (!isText(q.id)) return 'is missing id';

  const prefix = contentMode === 'fixtures' ? 'TEST-' : 'Q-';
  if (!q.id.startsWith(prefix)) return `id must start with "${prefix}" in ${contentMode} mode`;

  if (!Number.isInteger(q.revision) || q.revision < 1) return 'revision must be a whole number of 1 or more';
  if (q.status !== 'approved') return `status is "${q.status}", not "approved"`;
  if (!ALL_DOMAINS.includes(q.domain)) return `domain "${q.domain}" isn't one of D1–D8 or G`;
  if (!Array.isArray(q.rds_refs) || !q.rds_refs.every(isText)) return 'rds_refs must be a list of text';
  if (contentMode === 'fixtures' && q.rds_refs.length > 0) return 'fixture questions must not carry real RDS references';
  if (!isText(q.question)) return 'is missing question text';

  if (!Array.isArray(q.choices) || q.choices.length !== 4) return 'must have exactly four choices';
  const choiceIds = new Set();
  for (const [i, c] of q.choices.entries()) {
    if (!isObject(c) || !isText(c.id) || !isText(c.text)) return `choice ${i + 1} needs an id and text`;
    if (choiceIds.has(c.id)) return `choice id '${c.id}' appears more than once`;
    choiceIds.add(c.id);
  }
  if (!choiceIds.has(q.correct_choice)) return `correct_choice '${q.correct_choice}' doesn't match any choice`;
  if (!isText(q.explanation)) return 'is missing an explanation';

  const s = q.source;
  if (!isObject(s)) return 'is missing source';
  if (!isText(s.source_id)) return 'is missing source.source_id';
  if (!sources.has(s.source_id)) return `source_id '${s.source_id}' isn't in the sources list`;
  if (!isText(s.locator)) return 'is missing source.locator (page or section)';
  if (!isDate(s.checked)) return 'source.checked must be a date (YYYY-MM-DD)';
  if (s.supplemental !== undefined) {
    if (!Array.isArray(s.supplemental)) return 'source.supplemental must be a list';
    for (const sup of s.supplemental) {
      if (!isObject(sup) || !isText(sup.title) || !isText(sup.url) || !URL_PATTERN.test(sup.url)) {
        return 'each supplemental source needs a title and a web address';
      }
      if (!isText(sup.source_date)) return 'each supplemental source needs a source_date (or "Not shown")';
      if (!isDate(sup.checked)) return 'each supplemental source needs a checked date (YYYY-MM-DD)';
    }
  }

  // Fixtures are invented and never reviewed; real questions must have a complete review record.
  if (contentMode === 'approved') return reviewProblem(q.review);
  return null;
}

function reviewProblem(r) {
  if (!isObject(r)) return 'is missing its review record';
  for (const check of REVIEW_CHECKS) {
    const c = r[check];
    if (!isObject(c)) return `review is missing ${check}`;
    if (c.result !== 'Confirmed') return `review.${check} is "${c.result}", not "Confirmed"`;
    if (!isText(c.by) || !isDate(c.date)) return `review.${check} needs who checked it and a date`;
  }
  const ir = r.instructional_review;
  if (!isObject(ir) || ir.result !== 'Approved' || !isText(ir.by) || !isDate(ir.date)) {
    return 'review.instructional_review must be "Approved", with who and a date';
  }
  const ap = r.approved;
  if (!isObject(ap) || !isText(ap.by) || !isDate(ap.date)) return 'review.approved needs who approved it and a date';
  return null;
}
