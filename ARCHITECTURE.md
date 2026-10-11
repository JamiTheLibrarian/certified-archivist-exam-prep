# Architecture and Module Contracts

Draft 2 by Claude, October 11, 2026, revised after Chad's review. For approval by Jami before step 1's code is written (working agreement 12). It turns PROJECT_SPEC.md into concrete contracts: which module does what, who builds it, the functions each one offers, the data they pass, and how errors are handled. When a contract changes, this file changes in the same commit.

## 1. Ground rules

- **Plain JavaScript modules** (`import` / `export`), loaded by the browser with no build step.
- **Logic and display are separate.** Files in `app/js/logic/` never touch the page or the browser directly. They take data in and return data out, so the automated tests can run them. Display files call the logic and draw the results.
- **Each file has one builder** (Section 3), matching the step assignments. Step 1 defines the shared conventions (the `app` object, screen lifecycle, helpers); it doesn't implement modules assigned to Chad.
- **Text goes on the page as text.** Display code sets `textContent` and never inserts question data as HTML. This prevents the original app's apostrophe bug and any accidental code injection.
- **Correctness is checked by choice ID,** never by comparing answer text.
- **Randomness is passed in.** Every logic function that shuffles or draws takes a `random` function (returning a number from 0 up to 1). The app passes `Math.random`; tests pass a predictable one.
- **Time is passed in.** Functions that need the current time take a `now` value (milliseconds), so tests can check deadlines without waiting.
- **Errors in content or storage never crash the app.** Logic functions report problems as values. They throw only when a whole file can't be read, or when code calls them incorrectly.

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
  updatedAt: 1791760194381,         // last change, used to detect other tabs
  submittedAt: null
}
```

### Result

What scoring returns for either mode.

```js
{
  mode: "learning" | "exam",
  timed: true | false | null,       // null for learning
  total: 100,                       // questions in the session or exam
  answered: 94,
  correct: 72,
  unanswered: 6,
  completionPercent: 94.0,          // answered / total
  accuracyPercent: 76.6,            // correct / answered (0 if none answered)
  scorePercent: 72.0,               // the headline score; see below
  band: "green" | "yellow" | "red", // from scorePercent
  byDomain: { D1: { total, answered, correct, accuracyPercent, scorePercent }, ... },
  review: [{ questionId, reasons: ["flagged", "incorrect", "unanswered"], answer, correctChoice }]
}
```

- **Practice Exam:** `scorePercent` is `correct / total`, so unanswered questions count against it (PROJECT_SPEC.md 8).
- **Learning Mode:** `scorePercent` equals `accuracyPercent` (correct out of answered), and the results screen always shows completion alongside it: "18 of 20 answered correctly (90%). You answered 20 of 25 questions."
- All percentages are unrounded; display code rounds for display only.
- Each question appears in `review` once, with every reason that applies.

### Readiness

```js
{
  ready: false,
  problems: [
    { type: "blueprint_unset" },
    { type: "settings_error", message: "allocation totals 98, not 100" },
    { type: "total", have: 65, need: 100 },
    { type: "domain", domain: "D6", have: 4, need: 12 }
  ]
}
```

Display code turns `problems` into the message in PROJECT_SPEC.md 6.2.

### Operation result

Functions that can fail for expected reasons return this instead of throwing:

```js
{ ok: true, value }                  // success, with the result
{ ok: false, error: "code", detail } // e.g. error: "not_active"
```

## 3. Modules

### Logic (`app/js/logic/`)

| File | Builder | Step |
| --- | --- | --- |
| `validate.js` | Claude | 1 |
| `random.js` | Claude | 1 |
| `filters.js` | Claude | 4 |
| `scoring.js` | Chad | 3 |
| `progress.js` | Chad | 5 |
| `blueprint.js` | Chad | 6 |
| `attempt.js` | Chad | 6–7 |

**`validate.js`** (Claude): checks raw file contents (PROJECT_SPEC.md 10.2)

| Function | Returns |
| --- | --- |
| `validateSources(raw)` | `{ sources: Map, errors: [{ id, reason }] }` |
| `validateSettings(raw)` | `{ settings, errors: [string] }` |
| `validateQuestions(raw, sources, contentMode)` | `{ meta, questions, excluded: [{ id, reason }] }` |

Throws `BankFileError` only if a file's overall structure is unreadable (for example, no `questions` array). Reasons are plain sentences naming the field, such as `"correct_choice 'e' doesn't match any choice"`. Duplicate IDs exclude every copy, since the app can't tell which is right.

**`random.js`** (Claude): shared helpers

| Function | Returns |
| --- | --- |
| `shuffle(array, random)` | A new shuffled array (Fisher–Yates, so every order is equally likely) |
| `pick(array, count, random)` | `count` distinct items |

**`filters.js`** (Claude): Learning Mode selection

| Function | Returns |
| --- | --- |
| `filterQuestions(questions, filters, progressView)` | Matching questions. `filters`: `{ domains, sourceIds, which: "all" \| "unasked" \| "missed" }`. `progressView` is optional until step 5; without it, only `"all"` is allowed |
| `drawLearning(matches, count, random)` | Question IDs |

**`scoring.js`** (Chad): scoring and bands

| Function | Returns |
| --- | --- |
| `scoreLearning(session, questionsById, settings)` | Result |
| `scoreExam(attempt, settings)` | Result, computed from `attempt.snapshot` only |
| `bandFor(percent, settings)` | `"green"` at 85 and above, `"yellow"` from 75 up to 85, otherwise `"red"`, using the unrounded percent |

**`progress.js`** (Chad): saved progress and attempts

`createProgressStore(storage, key)` returns an object with:

| Method | Does |
| --- | --- |
| `available` | `true` if storage works (checked by a test write) |
| `view()` | A read-only view for `filterQuestions`: `isUnasked(question)`, `isRecentlyMissed(question)` |
| `recordAnswer(question, isCorrect, now)` | Updates one record (Learning Mode) |
| `recordAttempt(attempt, questionsById, now)` | Updates history from a submitted attempt (see "Recording attempts once" below) |
| `reset()` | Clears study history, not the active attempt |
| `saveAttempt(attempt)` | Saves the active attempt (see "Multiple tabs" below) |
| `loadAttempt()` | The active attempt, or `{ ok: false, error: "damaged" }` |
| `clearAttempt()` | Removes the active attempt |

`storage` is anything with `getItem`, `setItem`, and `removeItem`: the browser's `localStorage` in the app, or an in-memory stand-in in tests. Every write returns an operation result and never throws. Real content and fixtures use different `key` values.

*Recording attempts once.* The store keeps a list of the IDs of attempts already recorded (the most recent 50 are enough), saved in the same storage write as the history it changes. `recordAttempt` checks the list first. If the attempt's ID is there, it changes nothing and returns `{ ok: true, value: { alreadyRecorded: true } }`. Otherwise it updates history (answered questions only, and only where the snapshot's revision matches the current question's revision) and adds the ID, in one write.

**`blueprint.js`** (Chad): exam readiness and drawing

| Function | Returns |
| --- | --- |
| `checkReadiness(questions, settings, settingsErrors)` | Readiness object (Section 2) |
| `drawExam(questions, settings, random)` | Question IDs filling the blueprint; throws if called when not ready |

Only questions with a D1–D8 domain count toward the exam. General Knowledge-only questions appear in Learning Mode only.

**`attempt.js`** (Chad): exam attempt lifecycle

| Function | Returns |
| --- | --- |
| `createAttempt(bank, ids, { timed }, random, now)` | A new attempt with snapshot, choice order, and deadline |
| `answer(attempt, questionId, choiceId, now)` | Operation result with the updated attempt |
| `toggleFlag(attempt, questionId, now)` | Operation result with the updated attempt |
| `isExpired(attempt, now)` | `true` if timed and past the deadline |
| `submit(attempt, now)` | Operation result with the submitted attempt |

*Checks before every change.* `answer`, `toggleFlag`, and `submit` refuse, returning `{ ok: false }` and leaving the attempt unchanged, when:

| Error | Meaning |
| --- | --- |
| `not_active` | The attempt's status isn't `in_progress` |
| `expired` | Timed, and past the deadline (except `submit`, which is allowed so time-out can submit) |
| `not_in_attempt` | The question ID isn't one of this attempt's questions |
| `invalid_choice` | The choice ID isn't one of that question's choices |

Each successful change sets `updatedAt` to `now`.

### Multiple tabs

Browser storage is shared by every tab of the app, so the saved attempt is the single source of truth.

- **Before every change,** `exam.js` reloads the attempt from storage. If the stored attempt has a different ID or isn't `in_progress`, the change is dropped, and the tab shows: "This exam was submitted or ended in another tab."
- **When another tab saves,** the browser notifies this tab (the `storage` event). `exam.js` reloads the attempt and redraws, so both tabs show the same answers.
- **Submitting** reloads the stored attempt, refuses if it's already submitted, then saves the submitted version. `recordAttempt` is then called, and its attempt-ID check ensures history is updated only once, even if two tabs submit at nearly the same moment.

Browser storage can't fully lock between tabs, so two tabs changing answers within the same instant could lose one change. That's an accepted limit for a study aid. The reload-before-change rule makes it very unlikely in practice.

### Storage capacity

A 100-question attempt with its saved copies is roughly 100–300 KB, well under the usual browser limit of about 5 MB, so this should rarely occur. If it does:

- **Before starting,** `exam.js` saves the new attempt once. If that fails, it shows the warning from PROJECT_SPEC.md 7.6 and asks for confirmation before starting without saving.
- **If a save fails during the exam,** a warning stays visible on every exam screen: "Your answers aren't being saved. You can keep working and submit as usual, but refreshing or closing this page will lose the exam." The attempt continues in memory, saving is retried with each change, and the warning clears if saving succeeds again.
- **Submission and results** always work from the in-memory attempt, so an unsaved exam can still be completed and scored.

### Display (`app/js/`)

| File | Responsibility | Builder | Step |
| --- | --- | --- | --- |
| `data.js` | Fetches the three JSON files for the current content mode, runs `validate.js`, returns a Bank | Claude | 1 |
| `ui.js` | Shared helpers: `el()` to build elements with text, `announce(message)` for screen readers, `showNotice()`, `every(ms, fn, signal)` for timers, percent formatting | Claude | 1 |
| `main.js` | Starts the app, holds the shared `app` object, switches screens, shows the test-mode banner and notices | Claude | 1 |
| `learning.js` | Learning Mode question screen (step 2) and setup screen (step 4) | Claude | 2, 4 |
| `results.js` | Results screen and review list | Chad | 3 |
| `exam.js` | Practice Exam screens, review screen, timer, resume prompt | Chad | 6, 7 |
| `home.js` | Home page | Claude | 8 |

The shared `app` object:

```js
{
  bank,                 // Bank
  progress,             // progress store; a stand-in that saves nothing until step 5
  notices: [],          // messages shown at the top of every screen
  random: Math.random,
  now: () => Date.now(),
  showScreen            // showScreen(name, params)
}
```

Until step 5 exists, step 1 provides a stand-in progress store with `available: false`, so earlier steps work without saved progress. Chad's step 5 replaces it.

### Screen lifecycle

Every screen module exports one function:

```js
export function render(container, app, params, signal) { ... }
```

- **`signal`** is an `AbortSignal` created by `showScreen` for each screen. Every event listener a screen adds uses it (`addEventListener(type, fn, { signal })`), and every timer is started through `ui.every(ms, fn, signal)`.
- **`showScreen(name, params)`** aborts the previous screen's signal, which removes all of that screen's listeners and stops its timers at once, then clears the container and calls the new screen's `render`.
- Screens don't keep references to elements from other screens, and don't start timers or listeners any other way.

This prevents duplicate countdowns and stale screens when moving between screens, including when an exam is resumed.

## 4. Errors and notices

| Situation | Handled by | User sees |
| --- | --- | --- |
| A question fails checks | `validate.js` returns it in `excluded` | "2 questions were excluded because of data errors," with details in the developer console |
| A settings problem (e.g. allocation doesn't total 100) | `validate.js` returns `settingsErrors` | Practice Exam unavailable, with the reason |
| A data file can't be read | `data.js` catches `BankFileError` | A clear error screen instead of the app |
| Storage unavailable | `progress.js` reports `available: false` | The notices in PROJECT_SPEC.md 7.6 |
| A save fails (e.g. storage full) | Operation result `{ ok: false }` | A warning that stays until saving works again (Section 3, "Storage capacity") |
| Saved attempt damaged | `loadAttempt()` returns `{ ok: false, error: "damaged" }` | "This attempt can't be restored," with Abandon |
| A refused exam change | `attempt.js` returns an error code | For `not_active` or `expired`: the matching message; other codes indicate a bug and are logged to the console |
| Attempt ended in another tab | `exam.js` reload check | "This exam was submitted or ended in another tab" |

## 5. Tests and publishing

- **Tests** live in `tests/`, one file per logic module (for example, `tests/scoring.test.js`), using Node's built-in test runner. A root `package.json` containing `{ "type": "module" }` lets Node read the app's modules directly. Each builder writes the tests for their own modules.
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
