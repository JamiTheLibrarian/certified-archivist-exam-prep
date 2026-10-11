# Architecture and Module Contracts

Draft by Claude, October 11, 2026, for review by Chad and approval by Jami before step 1's code is written (working agreement 12). It turns PROJECT_SPEC.md into concrete contracts: which module does what, the functions each one offers, the data they pass, and how errors are handled. When a contract changes, this file changes in the same commit.

## 1. Ground rules

- **Plain JavaScript modules** (`import` / `export`), loaded by the browser with no build step.
- **Logic and display are separate.** Files in `app/js/logic/` never touch the page or the browser directly. They take data in and return data out, so the automated tests can run them. Display files call the logic and draw the results.
- **Text goes on the page as text.** Display code sets `textContent`, never inserts question data as HTML. This prevents the original app's apostrophe bug and any accidental code injection.
- **Correctness is checked by choice ID,** never by comparing answer text.
- **Randomness is passed in.** Every logic function that shuffles or draws takes a `random` function (returning a number from 0 up to 1). The app passes `Math.random`; tests pass a predictable one.
- **Time is passed in.** Functions that need the current time take a `now` value (milliseconds), so tests can check deadlines without waiting.
- **Errors in content never crash the app.** Logic functions report data problems as values. They throw only when a whole file can't be read, or when code calls them incorrectly.

## 2. Data shapes

These are the objects modules pass to each other. Question, source, and settings records follow PROJECT_SPEC.md Sections 4 and 6.1.

### Bank

What `data.js` produces after loading and checking everything.

```js
{
  contentMode: "fixtures" | "approved",
  meta: { version, generated, content_type },
  questions: [Question],            // valid, unique, approved (or fixture) only
  questionsById: Map<id, Question>,
  sources: Map<source_id, Source>,
  settings: Settings,
  excluded: [{ id, reason }],       // questions left out, with readable reasons
  settingsErrors: [string]          // e.g. "allocation totals 98, not 100"
}
```

### Progress record

One per question, stored by question ID.

```js
{
  revision: 2,
  timesAnswered: 3,
  lastResult: "correct" | "incorrect",
  lastAnsweredAt: 1791760094381,    // milliseconds
  everMissed: true
}
```

### Learning session

Lives in memory only; not saved.

```js
{
  mode: "learning",
  questionIds: ["Q-D7-0001", ...],  // drawn order
  choiceOrder: { "Q-D7-0001": ["c", "a", "d", "b"] },
  answers: { "Q-D7-0001": "c" },    // locked once set
  flags: { "Q-D7-0001": true },
  currentIndex: 0
}
```

### Exam attempt

Saved to storage on every change (PROJECT_SPEC.md 6.4).

```js
{
  mode: "exam",
  id: "uuid",
  status: "in_progress" | "submitted" | "abandoned",
  timed: true,
  startedAt: 1791760094381,
  deadline: 1791770894381,          // null if untimed
  bankVersion: "2026.11.1",
  blueprint: { D1: 12, ... },       // as used for this attempt
  snapshot: { "Q-D1-0004": Question, ... },  // full copies, with revisions
  questionIds: [...],               // drawn order
  choiceOrder: { ... },
  answers: { ... },                 // changeable until submitted
  flags: { ... },
  currentIndex: 0,
  submittedAt: null
}
```

### Result

What scoring returns for either mode.

```js
{
  mode: "learning" | "exam",
  timed: true | false | null,       // null for learning
  total: 100,                       // exam: always the exam length; learning: questions in session
  answered: 94,
  correct: 72,
  unanswered: 6,
  percent: 72.0,                    // unrounded; exam: correct/total, learning: correct/answered
  band: "green" | "yellow" | "red",
  byDomain: { D1: { total, answered, correct, percent }, ... },
  review: [{ questionId, reasons: ["flagged", "incorrect", "unanswered"], answer, correctChoice }]
}
```

Each question appears in `review` once, with every reason that applies.

### Readiness

```js
{
  ready: false,
  problems: [
    { type: "blueprint_unset" },
    { type: "total", have: 65, need: 100 },
    { type: "domain", domain: "D6", have: 4, need: 12 }
  ]
}
```

Display code turns `problems` into the message in PROJECT_SPEC.md 6.2.

## 3. Modules

### Logic (`app/js/logic/`)

**`validate.js`**: checks raw file contents (PROJECT_SPEC.md 10.2)

| Function | Returns |
| --- | --- |
| `validateSources(raw)` | `{ sources: Map, errors: [{ id, reason }] }` |
| `validateSettings(raw)` | `{ settings, errors: [string] }` |
| `validateQuestions(raw, sources, contentMode)` | `{ meta, questions, excluded: [{ id, reason }] }` |

Throws `BankFileError` only if a file's overall structure is unreadable (for example, no `questions` array). Reasons are plain sentences naming the field, such as `"correct_choice 'e' doesn't match any choice"`. Duplicate IDs exclude every copy, since the app can't tell which is right.

**`random.js`**: shared helpers

| Function | Returns |
| --- | --- |
| `shuffle(array, random)` | A new shuffled array (Fisher–Yates, so every order is equally likely) |
| `pick(array, count, random)` | `count` distinct items |

**`blueprint.js`**: filtering, drawing, and readiness

| Function | Returns |
| --- | --- |
| `filterQuestions(questions, filters, progressView)` | Matching questions. `filters`: `{ domains, sourceIds, which: "all" \| "unasked" \| "missed" }` |
| `drawLearning(matches, count, random)` | Question IDs |
| `checkReadiness(questions, settings)` | Readiness object (Section 2) |
| `drawExam(questions, settings, random)` | Question IDs filling the blueprint; throws if called when not ready |

Only questions with a D1–D8 domain count toward the exam. General Knowledge-only questions appear in Learning Mode only.

**`scoring.js`**: scoring and bands

| Function | Returns |
| --- | --- |
| `scoreLearning(session, questionsById, settings)` | Result |
| `scoreExam(attempt, settings)` | Result, computed from `attempt.snapshot` only |
| `bandFor(percent, settings)` | `"green"` at 85 and above, `"yellow"` from 75 up to 85, otherwise `"red"`, using the unrounded percent |

**`progress.js`**: saved progress and attempts

`createProgressStore(storage, key)` returns an object with:

| Method | Does |
| --- | --- |
| `available` | `true` if storage works (checked by a test write) |
| `view()` | A read-only progress view, used by `filterQuestions`: `isUnasked(question)`, `isRecentlyMissed(question)` |
| `recordAnswer(question, isCorrect, now)` | Updates one record (Learning Mode) |
| `recordAttempt(attempt, questionsById, now)` | Updates history from a submitted attempt, once: answered questions only, and only where the snapshot's revision matches the current one |
| `reset()` | Clears study history, not the active attempt |
| `saveAttempt(attempt)` / `loadAttempt()` / `clearAttempt()` | The single active exam attempt |

`storage` is anything with `getItem`, `setItem`, and `removeItem`: the browser's `localStorage` in the app, or an in-memory stand-in in tests. Every write returns `{ ok: true }` or `{ ok: false, error }` and never throws; callers show the storage warning on failure. Real content and fixtures use different `key` values.

**`attempt.js`**: exam attempt lifecycle

| Function | Returns |
| --- | --- |
| `createAttempt(bank, ids, { timed }, random, now)` | A new attempt with snapshot, choice order, and deadline |
| `answer(attempt, questionId, choiceId)` / `toggleFlag(attempt, questionId)` | An updated attempt (the caller saves it) |
| `isExpired(attempt, now)` | `true` if timed and past the deadline |
| `submit(attempt, now)` | The attempt with `status: "submitted"`; refuses if already submitted |

### Display (`app/js/`)

| File | Responsibility | Built in |
| --- | --- | --- |
| `data.js` | Fetches the three JSON files for the current content mode, runs `validate.js`, returns a Bank | Step 1 |
| `ui.js` | Shared helpers: `el()` to build elements with text, `announce(message)` for screen readers, `showNotice()`, percent formatting | Step 1 |
| `main.js` | Starts the app, holds the shared `app` object, switches screens with `showScreen(name, params)`, shows the test-mode banner | Step 1 |
| `learning.js` | Learning Mode question screen (step 2) and setup screen (step 4) | Steps 2, 4 |
| `results.js` | Results screen and review list | Step 3 |
| `exam.js` | Practice Exam screens, review screen, timer, resume prompt | Steps 6, 7 |
| `home.js` | Home page | Step 8 |

Every screen module exports `render(container, app, params)`. The shared `app` object is:

```js
{ bank, progress, notices: [], random: Math.random, now: () => Date.now() }
```

## 4. Errors and notices

| Situation | Handled by | User sees |
| --- | --- | --- |
| A question fails checks | `validate.js` returns it in `excluded` | "2 questions were excluded because of data errors," with details in the developer console |
| A settings problem (e.g. allocation doesn't total 100) | `validate.js` returns `settingsErrors` | Practice Exam unavailable, with the reason |
| A data file can't be read | `data.js` catches `BankFileError` | A clear error screen instead of the app |
| Storage unavailable or full | `progress.js` returns `{ ok: false }` | The warnings in PROJECT_SPEC.md 7.6 |
| Saved attempt damaged | `progress.js` `loadAttempt()` returns `null` with an error | "This attempt can't be restored," with Abandon |
| Attempt submitted in another tab | `attempt.js` `submit()` refuses | "This exam has already been submitted" |

## 5. Tests and publishing

- **Tests** live in `tests/`, one file per logic module (for example, `tests/scoring.test.js`), using Node's built-in test runner. A root `package.json` containing `{ "type": "module" }` lets Node read the app's modules directly.
- **`.github/workflows/test.yml`** runs `node --test` on every push, showing a green check or red X on each commit.
- **`.github/workflows/pages.yml`** publishes only `app/`. When `settings.json` has `"content_mode": "approved"`, it removes `app/data/fixtures/` before publishing.

## 6. Handoff note template

Posted as a comment on the step's Issue when the builder finishes (working agreement 13):

```
## Handoff: Step N
**Files changed:** ...
**Functions now available:** ... (link to the ARCHITECTURE.md section if contracts changed)
**Depends on:** ...
**Tests:** which test files cover this step, and the commit where they pass
**Known limits:** anything left for a later step
```
