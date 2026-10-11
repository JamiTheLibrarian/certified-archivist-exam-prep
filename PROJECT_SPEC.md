# Project Specification: CA Exam Prep App, Version 1

Draft 2 by Claude, October 11, 2026, revised after review by Chad (technical) and Plexy (fact-check and annotated review), with two clarifications from Plexy's final check. Approved by Jami, October 11, 2026. Based on PROJECT_NOTES.md (October 11, 2026), PLEXY_DECISION_FEEDBACK.md, ORIGINAL_APP.md, ORIGINAL_APP_STORY.md, and RESEARCH.md.

## Decision status

Most of this specification follows from decisions Jami has already made (recorded in PROJECT_NOTES.md). The items below are new proposals from the specification process. Chad and Plexy support all of them; they become requirements once Jami approves.

| # | Proposal | Section |
| --- | --- | --- |
| P1 | Publish only `app/` using a GitHub Actions workflow | 3 |
| P2 | Fictional test questions, kept fully separate from real content | 4.5 |
| P3 | Answered questions stay locked when revisited in Learning Mode | 5.2 |
| P4 | A review screen listing all Practice Exam questions | 6.3 |
| P5 | An untimed Practice Exam option, for accessibility | 6.3 |
| P6 | Each Practice Exam attempt saves its own copy of its questions | 6.4 |
| P7 | Unanswered exam questions don't change saved study history | 7.3 |
| P8 | A single source list, `sources.json` | 4.3 |
| P9 | Every question checked as the app loads, with visible warnings | 10.2 |
| P10 | Automated tests that run on every commit | 12.2 |
| P11 | Brief confetti for high scores, off for reduced-motion settings | 8 |

Items marked **[Open]** still need a decision later (Section 14).

## 1. Purpose

An independent study aid for the Academy of Certified Archivists (ACA) exam. It helps candidates learn the material untimed, then practice under conditions that match the exam's published format: 100 multiple-choice questions with one correct answer each, three hours, flag-and-revisit, and no penalty for guessing.

The app is **not an official ACA product.** It matches the exam's published format, not its difficulty, and its scores don't predict a result. ACA develops its exam using psychometric and statistical standards, and the current official exam guidance reports results as categories (High Pass, Pass, Low Pass, Did Not Pass) without stating a numeric passing score.

### Principles carried over from the original app

These respond directly to what went wrong in 2025 (see ORIGINAL_APP_STORY.md and the lessons in ORIGINAL_APP.md):

- **Nothing gets lost.** All code and approved questions live in the repo. Unreviewed questions stay in Drive.
- **Nothing is called done until it's tested.** Every feature ships with a testing checklist and automated checks where possible.
- **Every question is traceable.** Each one has a specific, linked, checkable source.
- **Every button does what it says.** A mode or feature appears only when it works. When something isn't available, the app says why.

### A limit to state openly

Because this is a static website, the browser downloads the question file, including the answer keys. The app hides answers during the Practice Exam, but anyone who inspects the downloaded files can see them. That's acceptable for a self-study aid, and the app doesn't claim otherwise.

## 2. Scope

### In version 1

| Area | Included |
| --- | --- |
| Modes | Learning Mode; Practice Exam (timed or untimed) |
| Question type | Multiple-choice, four options, one correct answer |
| Learning Mode filters | Domain, source, number of questions, unasked, recently missed |
| Practice Exam | 100 questions from a fixed blueprint; three-hour timer or untimed; Previous/Next; flag for review; review screen; resumes after a refresh |
| Feedback | Immediate in Learning Mode; held until results in the Practice Exam |
| Results | Score, percentage, per-domain results, review of flagged, missed, and unanswered questions |
| Saved progress | Browser storage, keyed to question IDs and revisions, with a confirmed reset |
| Home page | Mode selection, readiness messages, official ACA links, study-aid disclaimer, question-bank version |
| Accessibility | Built in from the start (Section 9) |

### Deferred to a later version

Test Mode, Flash Cards, export, advanced performance analytics, and an "ever missed" view (the data is recorded in version 1).

### Out of scope

User accounts, a server or database, true/false and drag-and-drop questions (dropped in May 2025 to match the exam), and any use of recalled exam questions (barred by ACA's candidate nondisclosure agreement).

## 3. Technology

| Item | Choice | Reason |
| --- | --- | --- |
| Languages | Plain HTML, CSS, and JavaScript, with no framework and no build step | Matches the original app; every file can be read and committed through GitHub's website |
| JavaScript | Small modules, one per concern, with the logic kept separate from the display (Section 10) | Avoids one long script where a single error stops everything, as in the May 9 snapshot; lets the logic be tested automatically |
| Data | JSON files for questions, sources, and settings | Readable and reviewable; kept separate from code |
| Saved progress | The browser's `localStorage` | Works on a static site with no accounts |
| Hosting | GitHub Pages | Free, built into the repo |

**Publishing (P1).** GitHub Pages can publish a repository's root or a `docs/` folder directly. To publish only `app/`, the repo uses a small GitHub Actions workflow that uploads just that folder as the website. This keeps `archive/` and the project documents **out of the deployed website**. They remain visible in the public repository itself, which is why unapproved questions stay in Drive.

**Testing environment.** Browsers block a page opened straight from your computer from loading JSON files, so manual testing happens on the published GitHub Pages site. Until release, the site runs in test mode (Section 4.5) or shows an "In development" banner.

## 4. Question data

### 4.1 Where questions live

| Stage | Where | Who |
| --- | --- | --- |
| Unverified, Needs Revision, Verified | A working spreadsheet in Drive | Plexy checks facts; Jami reviews |
| Approved for Publication | `app/data/questions.json` in the repo | Converted from the spreadsheet after Jami's approval |

Only approved questions enter `questions.json`. A question marked Corrected during fact-checking is rechecked in its final wording before approval.

### 4.2 The question bank file

`app/data/questions.json` has exactly this structure:

```json
{
  "bank": {
    "version": "2026.11.1",
    "generated": "2026-11-02",
    "content_type": "approved"
  },
  "questions": [ ]
}
```

The `questions` array holds question records (4.3). The app computes all counts itself from valid questions; the header holds no counts that could drift out of date.

### 4.3 Question records

```json
{
  "id": "Q-D7-0001",
  "revision": 1,
  "status": "approved",
  "domain": "D7",
  "rds_refs": ["D7 Task 3", "D7 KS 2", "G KS 4"],
  "question": "Question text",
  "choices": [
    { "id": "a", "text": "First choice" },
    { "id": "b", "text": "Second choice" },
    { "id": "c", "text": "Third choice" },
    { "id": "d", "text": "Fourth choice" }
  ],
  "correct_choice": "c",
  "explanation": "Why the correct answer is correct.",
  "source": {
    "source_id": "oestreicher-2020",
    "locator": "Chapter 4, pp. 87-89",
    "checked": "2026-10-20",
    "supplemental": [
      { "title": "Agency page title", "url": "https://...", "source_date": "Not shown", "checked": "2026-10-20" }
    ]
  },
  "legacy_id": "D7.MCQ.012",
  "review": {
    "fact_check": { "result": "Confirmed", "by": "Plexy", "date": "2026-10-20" },
    "answer_key_check": { "result": "Confirmed", "by": "Plexy", "date": "2026-10-20" },
    "originality_check": { "result": "Confirmed", "by": "Plexy", "date": "2026-10-20" },
    "instructional_review": { "result": "Approved", "by": "Jami", "date": "2026-10-22" },
    "approved": { "by": "Jami", "date": "2026-10-22" }
  }
}
```

Rules:

- **`id`** starts with `Q-` and never changes once assigned, even if the question is rewritten. Progress is saved against it.
- **`revision` goes up by 1** for any substantive change: meaning, any choice (including wrong answers), the correct answer, the explanation, or the supporting evidence. Purely cosmetic fixes (typos, formatting) don't change it. A substantive revision needs all review checks and Jami's approval again. Saved progress for an older revision is ignored (Section 7.4).
- **`domain`** is the question's one primary domain. Questions that can appear in the Practice Exam must have a primary domain from D1–D8. General Knowledge isn't a ninth domain: it's a separate section of the RDS. A question can carry General Knowledge references in `rds_refs` alongside its D1–D8 domain. A question whose only fit is General Knowledge uses `"domain": "G"` and appears in Learning Mode only.
- **Correctness is matched by choice ID,** never by comparing answer text (a bug in every original version). Choice IDs must be unique within a question.
- **The app shuffles choice order** for display. Reviewers still remove wording and length clues in the questions themselves.
- **`legacy_id`** links back to the 2025 question it came from, if any.
- **`review`** records every publication check. Originality checks cover authorship and provenance, duplicates within the bank, and accessible published material. They don't, and can't, compare against the confidential live exam.
- **The app shows only questions with `status: "approved"`** and a complete review record.

### 4.4 Sources (P8)

`app/data/sources.json` lists each source once: author, title, edition or version, year, Reading List status, a citation URL, and a short display name (for example, "Oestreicher, *Reference and Access*"). **Every source has a citation URL:** an open-access link where one exists, otherwise a publisher or library catalog page. Questions refer to sources by `source_id`, which keeps the names consistent for the source filter.

Each question's `locator` gives the page or section, and `checked` gives the date it was checked. Legal and standards claims also carry `supplemental` evidence from the responsible agency or standards owner, with its source date (or "Not shown") and the date checked. Citations are clickable wherever they appear.

### 4.5 Fictional test questions (P2)

Two sets of fictional questions support development:

- **Small set:** about 16 questions (two per D1–D8 domain), for testing screens and scoring.
- **Full-size set:** 100 questions that fill the Practice Exam blueprint, for testing the complete exam: the draw, review screen, timer, and submission.

They're kept fully separate from real content:

- They live in `app/data/fixtures/`, with their own fictional `sources.json`.
- Their IDs start with `TEST-`, their header says `"content_type": "fixture"`, and their sources are clearly invented. They carry no real RDS references.
- The app uses them only when `settings.json` sets `"content_mode": "fixtures"`. In that mode, every screen shows a banner: **"Fictional test data, not exam preparation."**
- Test-mode progress is saved under a separate storage key, so it never mixes with real study history.
- They never count toward approved-question totals, readiness, or release.
- Once the app switches to `"content_mode": "approved"`, the publishing workflow leaves `app/data/fixtures/` out of the deployed website.

Release testing is always rerun on real approved content.

## 5. Learning Mode

### 5.1 Setup screen

| Option | Choices | Default |
| --- | --- | --- |
| Domains | Any combination of D1–D8 and General Knowledge | All |
| Sources | Any combination of sources that have approved questions | All |
| Questions | All matching, only unasked, or only recently missed | All matching |
| Number | 10, 25, 50, or all available | 25 |

The screen shows how many questions match before starting. If none match, it says so and suggests widening the filters, instead of starting an empty quiz. Questions are drawn at random from the matches, with no repeats within a session.

### 5.2 Answering

- One question at a time, with a progress bar and "Question 3 of 25."
- Four full-width answer buttons, in shuffled order.
- Choosing an answer locks the question and shows:
  - **"Correct"** or **"Incorrect,"** in text, with an icon and green or red color (never color alone).
  - The correct answer, if the choice was wrong.
  - The explanation.
  - The source: display name, locator, and link.
- **Previous and Next.** Previous is hidden on the first question. Going back shows an answered question exactly as answered, locked (P3). It can't be answered again in the same session, which fixes the original's double-counted scores. It can appear again in a new session.
- **"Flag for review" checkbox** above each question, remembered when moving back and forth.
- **"Finish"** on the last question, or at any point, with a confirmation if questions remain unanswered.

### 5.3 Saving

Each answer updates saved progress right away (Section 7).

## 6. Practice Exam

### 6.1 Blueprint

`app/data/settings.json` defines the blueprint:

```json
{
  "practice_exam": {
    "length": 100,
    "time_limit_minutes": 180,
    "minimum_per_domain": 10,
    "allocation": null
  }
}
```

- All 100 places are allocated among D1–D8, with at least 10 per domain. General Knowledge-only questions aren't used.
- **[Open] `allocation`** sets the exact count per domain (for example, four domains at 12 and four at 13). Jami chooses it after the Domain 7 pilot and a coverage review. The allocation must total exactly 100.
- While `allocation` is `null`, the Practice Exam is unavailable, and the readiness message says the blueprint hasn't been set yet.
- The app labels the blueprint as "our study design, not an official ACA weighting."
- Domain, source, and number filters don't apply. The Practice Exam always uses the blueprint.

### 6.2 Readiness

The Practice Exam button is always visible. Readiness is calculated from valid, unique, approved questions only (after the checks in Section 10.2). If the bank can't fill the blueprint, the app explains exactly what's missing instead of starting:

> Practice Exam is not yet available. The approved question bank has 65 of the 100 questions needed, and Domain 6 has 4 of the 12 it needs.

It checks both the total and each domain. It never repeats a question within an attempt or fills gaps with unapproved questions. If the approved bank has exactly enough questions, the home page notes that every attempt uses the same set.

### 6.3 Taking the exam

- **Timed or untimed (P5):** The start screen offers the standard three-hour timed exam or an untimed version with otherwise identical behavior. Results state which was taken. The untimed option provides an equivalent way to complete the exam for anyone who can't work within a time limit.
- **Starting:** Questions are drawn to match the blueprint and put in random order, and each question's choices are shuffled. The attempt is saved immediately. A timed attempt records a fixed deadline: start time plus three hours.
- **Timer:** Shows time remaining. When time runs out, the exam is submitted automatically with the answers given so far.
- **Answering:** Choosing an answer marks it as selected, with no right-or-wrong feedback. Answers can be changed until submission. Every answer change and flag is saved immediately.
- **Navigation:** Previous and Next, plus a **review screen (P4)** listing all 100 questions as answered, unanswered, or flagged, with any question one click away.
- **Flag for review** on every question.
- **Submitting:** "Submit exam" confirms first, stating how many questions are unanswered and flagged.
- **No clues before submission:** No answers, explanations, or source details appear until results.

### 6.4 Saved attempts and resuming (P6)

When an attempt starts, it saves its own copy of the 100 questions exactly as drawn: their text, choices, correct answers, explanations, sources, and revisions, along with the bank version and blueprint. The attempt is scored and reviewed from this copy. If the question bank is updated while an attempt is in progress, the attempt is unaffected, and no new answer key is ever applied to it silently.

If the page is refreshed or closed during an attempt, reopening the app offers **Resume** or **Abandon**. Resume restores answers, flags, question order, choice order, and position. A timed attempt keeps its **original deadline**; if the deadline passed while the page was closed, the attempt is submitted as it stood. If the saved copy can't be restored (for example, the stored data is damaged), the app says so plainly and offers to abandon the attempt, rather than guessing.

Each attempt has a unique ID and a status. Only one attempt can be in progress at a time. An attempt is scored and added to study history exactly once, even after repeated refreshes or with the app open in more than one tab. If another tab submits the attempt, the remaining tab shows that it's already been submitted.

## 7. Saved progress

### 7.1 What's stored

In `localStorage`, under one key for real content (for example, `caExamPrep.v1`) and a separate key for test mode:

- **For each question,** keyed by ID: the revision answered, how many times it's been answered, the most recent result (correct or incorrect), the date last answered, and whether it has ever been missed.
- **The active Practice Exam attempt,** if any (Section 6.4).

### 7.2 What the filters mean

- **Unasked:** never answered at its current revision. A question that was only viewed or skipped stays unasked.
- **Recently missed:** the most recent answer, at the current revision, was incorrect. Once answered correctly, it leaves this set. If missed again, it returns.
- "Ever missed" is stored for a future view, not shown in version 1.

### 7.3 When progress updates

- **Learning Mode:** when each question is answered.
- **Practice Exam:** at submission, using each question's final answer, counted once.
- **Unanswered exam questions (P7)** count as incorrect in the exam score but don't change saved study history, since they weren't answered. Their existing study history is unchanged: a question never answered stays unasked, and one answered in an earlier session keeps its previous record.

### 7.4 Revisions

If a question's current `revision` is higher than the saved one, its old progress is ignored. It shows as unasked again, so outdated answers never count as current mastery. (Active exam attempts are protected separately; see Section 6.4.)

An exam attempt started before a question was revised is still scored and reviewed from its own saved copy. When it's submitted, it updates study history only for questions whose saved revision matches the current one. It never overwrites history already recorded for a newer revision.

### 7.5 Reset

"Reset progress" on the home page asks for confirmation and clears study history. An active Practice Exam attempt is handled separately: it can be abandoned from the resume prompt.

### 7.6 When storage isn't available

Some browsers block storage (for example, certain private-browsing modes), and storage can fill up.

- **If storage is unavailable when the app opens,** a clear notice says progress won't be saved. Learning Mode still works for the current visit. The unasked and recently missed filters are shown as unavailable, with the reason.
- **Before a Practice Exam starts without storage,** the app warns that refreshing or closing the page will lose the attempt, and asks for confirmation.
- **If a save fails during use** (for example, storage is full), the app shows a warning immediately and never claims progress was saved. During a Practice Exam, the attempt continues in the open page, with the warning that it can't survive a refresh.

The home page notes that progress is saved only in this browser on this device.

## 8. Results

Shown at the end of either mode.

- **Practice Exam score:** "72 of 100 (72%)." The denominator is always 100. Unanswered questions receive no credit. This is the app's own scoring rule: ACA's guide confirms there's no penalty for guessing but doesn't state how unanswered questions are treated.
- **Learning Mode score:** correct out of answered, for example "18 of 20 answered (90%)," with skipped questions counted separately: "5 not answered."
- **Per-domain results:** count and percentage for each domain, for example "D4: 9 of 12 (75%)."
- **Personal goals:** the score is colored using the unrounded percentage: green at 85% and above, yellow from 75% up to but not including 85%, and red below 75%. A text label states these are personal study goals, not ACA passing scores. The thresholds live in `settings.json`. A short encouraging message matches the range.
- **Confetti (P11):** a brief celebration for green-range scores, turned off for anyone whose device is set to reduce motion.
- **Review list:** every question that was flagged, missed, or unanswered, listed once each, showing the final answer given (or "No answer"), the correct answer, the explanation, and the linked source.
- **Back to Home.**

## 9. Accessibility and usability

Built in from the first feature, not added before launch. Target: **WCAG 2.2 Level AA.**

- Everything works by keyboard, with visible focus outlines.
- Text and backgrounds meet AA contrast. (The original's white-on-white text bug is why this is checked every time.)
- Right and wrong are shown with text and icons, not only color.
- Screen readers announce feedback and changes in progress.
- **Timing:** the untimed Practice Exam (Section 6.3) is the equivalent option for anyone who can't work within the time limit. The timed exam shows time remaining and gives warnings at 30 and 5 minutes, without announcing itself constantly. Learning Mode isn't treated as the untimed equivalent, since its feedback works differently.
- Layouts work on phones and desktops, with answer buttons large enough to tap.
- Animations, including confetti, respect the device's reduce-motion setting.

This app doesn't reproduce ACA's own testing accommodations, which candidates request from ACA directly.

## 10. Files, folders, and data checks

### 10.1 Structure

The file layout, module contracts, and the builder for each file are defined in ARCHITECTURE.md, which takes precedence for those details. In summary:

```
app/
  index.html
  css/style.css
  js/
    main.js         Starts the app and switches screens
    data.js         Loads the data files and runs the checks
    ui.js           Shared display helpers
    learning.js     Learning Mode screens
    results.js      Results and review list
    exam.js         Practice Exam screens and timer
    home.js         Home page
    logic/          No display code, so these can be tested automatically
      validate.js   Checks questions, sources, and settings
      random.js     Fair shuffling and drawing
      filters.js    Learning Mode filters
      scoring.js    Scores sessions and attempts
      progress.js   Saved progress, attempts, and reset
      blueprint.js  Exam readiness and drawing
      attempt.js    Exam attempt lifecycle
  data/
    questions.json
    sources.json
    settings.json
    fixtures/       Fictional test data (Section 4.5)
tests/              Automated tests (Section 12.2)
.github/workflows/  Publishing and testing workflows
package.json        Lets the automated tests read the app's modules
```

### 10.2 Checking data on load (P9)

Before anything else, including readiness, the app checks:

- **Each question:** all required fields present; a unique question ID; a whole-number revision; exactly four choices with unique IDs; `correct_choice` matching one of them; a valid domain; a `source_id` found in `sources.json`; and a complete review record.
- **Each source:** required fields present, including a citation URL.
- **Settings:** a valid blueprint whose allocation, once set, totals exactly 100, with at least the minimum in each domain.

A question that fails is left out. The app records the question ID and the reason (for example, "Q-D7-0004: correct_choice 'e' doesn't match any choice"), and shows a visible notice: "2 questions were excluded because of data errors." Readiness and filters count only the questions that passed. If a whole data file can't be read, the app shows a clear error message instead of starting with missing content.

## 11. Home page

- Title and a one-line description.
- **Learning Mode** and **Practice Exam** buttons. The Practice Exam shows its readiness message if needed.
- A resume prompt if a Practice Exam attempt is in progress.
- **Study resources:** links to ACA's Guide to the Exam, Role Delineation Statement, and current Reading List. Links are rechecked before release.
- **Disclaimer:** "An independent study aid. Not affiliated with or endorsed by the Academy of Certified Archivists."
- Question bank version and date, and the number of approved questions.
- Any data-check or storage notices.
- "Progress is saved in this browser only," and **Reset progress.**

## 12. Testing and release

### 12.1 Every feature

Each feature follows the feature loop in PROJECT_PLAN.md: the builder provides a testing checklist, the other builder reviews the code, Jami tests on the published site on both desktop and phone (including keyboard use and contrast), and the Issue closes only when everything passes.

### 12.2 Automated tests (P10)

A GitHub Actions workflow runs automated tests on every commit, using tools built into GitHub's servers, so nothing needs installing. Each commit then shows a green check or a red X on GitHub. The tests cover:

- **Data:** the checks in Section 10.2, run against `questions.json`, `sources.json`, `settings.json`, and the fixtures, including duplicate IDs and missing sources.
- **Logic:** blueprint draws (correct domain counts, no repeats), readiness messages, scoring (each final answer counted once, unanswered questions, the Learning Mode denominator, color thresholds at boundary values like 84.9% and 85%), filters, and revision handling.

Tests start with the first build step and grow with each feature.

### 12.3 Milestones

| Milestone | Requirement |
| --- | --- |
| Development | Fictional test data or approved content; banner shown on every screen |
| Full Practice Exam | A blueprint allocation is set, and the approved bank fills it (at least 100 distinct valid questions) |
| Version 1 release | All release gates in PLEXY_DECISION_FEEDBACK.md pass: content approval, traceable evidence, coverage, exam behavior, scoring, storage and filters, usability and accessibility, positioning, and publication hygiene |
| [Open] Learning Mode beta | Undecided. If chosen, a smaller approved set, clearly labeled as a limited beta |

### 12.4 Before release

Plexy rechecks exam facts in RESEARCH.md and the official links. The question bank version and verification date are updated. The app switches to approved content, the fixtures are left out of the deployed website, and all automated and manual tests are rerun on real content.

## 13. Proposed build order

Each step is one feature loop, building on the one before. Accessibility and automated tests are part of every step.

1. **Foundation:** folder structure, publishing and testing workflows, test mode and banner, fictional data, and data checks with their tests.
2. **Learning Mode, core:** one question at a time, shuffled choices, feedback, explanation, source, Previous/Next, flag, progress bar.
3. **Results:** scores, per-domain results, personal-goal colors, confetti, review list.
4. **Learning Mode setup:** domain, source, and number filters.
5. **Saved progress:** storage, unasked and recently missed filters, revisions, reset, storage warnings.
6. **Practice Exam, core:** blueprint draw, readiness message, delayed feedback, review screen, submission.
7. **Practice Exam timing and resuming:** timed and untimed options, saved attempts, resume, deadline handling.
8. **Home page:** study links, disclaimer, bank version, notices.
9. **Final accessibility and phone check,** then release preparation.

## 14. Open items

| # | Item | Decide when |
| --- | --- | --- |
| 1 | Approve proposals P1–P11 (top of this document) | With this specification |
| 2 | Practice Exam allocation for the 20 places beyond the minimum | After the Domain 7 pilot and coverage review |
| 3 | Learning Mode beta before the full release | After the pilot shows approval speed |
| 4 | Which builder takes which steps | Phase 3 |
