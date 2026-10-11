# Original App Inventory

Prepared by Claude, October 11, 2026, from the original materials in Jami's Google Drive, with findings from Plexy and Chad, and revised after their review. Status: **reviewed; pending the Replit check**. The original source code has not been located; this document will be updated after Jami checks Replit.

No original question text appears in this document. The question bank stays in Google Drive until questions are reviewed and approved.

## How to read this inventory

No code survives, so no feature can be confirmed as fully implemented. The one exception is the prototype screenshot itself, which shows a running app. Each feature is labeled with the strongest evidence available:

| Status | Meaning |
| --- | --- |
| Demonstrated | Visible in the app screenshot in the prototype deck. This shows the interface existed at one point, not that the logic behind it worked correctly |
| Mocked up | Added on top of the screenshot in PowerPoint; shows design intent, not a working feature |
| Partial evidence | Supporting traces exist (data columns, notes), but the feature itself isn't shown |
| Requested | Listed only in the Interface Design Notes |
| No evidence | Recalled in discussion, but not found in any surviving asset |

### Evidence sources

| Code | Asset | Date |
| --- | --- | --- |
| PROTO | Quiz Prototype.pptx: one slide with an app screenshot plus three PowerPoint overlays: a highlight shape on the Learning Mode button, a "Test Mode (Timed)" button image, and a green check mark | Apr 30, 2025 |
| IDN | Interface Design Notes: a list of interface requests made during development | May 6, 2025 |
| D1S | Domain 1 MCQs Spreadsheet: structured question data with an "Imported to App?" column | May 2025 |
| DOCS | Eight domain question documents, plus Domain 1 true/false and drag-and-drop documents | Apr–May 2025 |
| VA | Verified Answers for Domains 1 through 8 | May 5, 2025 |
| TQD | Total Questions By Domain spreadsheet | May 7, 2025 |
| TQR | Full_Question_Totals_by_Resource spreadsheet and CSV | May 2–3, 2025 |

## Feature inventory

### Study modes

| Feature | Status | Evidence | Notes |
| --- | --- | --- | --- |
| Learning Mode (untimed) | Demonstrated | PROTO, IDN | The screenshot shows a single plain "Learning Mode (Untimed)" button |
| Two-button mode selector with the active mode highlighted | Mocked up | PROTO (overlays) | The highlight and the second button were both added in PowerPoint |
| Test Mode (timed, answers hidden) | Mocked up | PROTO (overlay), IDN | Only a button image; no timed screen is shown |
| Per-question timer (on/off) | Requested | IDN | |

### Question display and feedback

| Feature | Status | Evidence | Notes |
| --- | --- | --- | --- |
| Multiple-choice card with four stacked answer buttons | Demonstrated | PROTO | |
| Selected answer highlighted | Demonstrated | PROTO | Dark navy highlight |
| Green check for a correct answer | Mocked up | PROTO (overlay) | Separate image placed beside the selected answer |
| Green/red coloring for correct and incorrect answers | Requested | IDN | |
| Explanation shown after answering | Demonstrated | PROTO, IDN | IDN describes it as optional in study mode |
| Correct answer and source citation shown after answering | Requested | IDN | Listed as optional displays |
| Answer choices shuffled each time | Requested | IDN | |
| True/false questions | Partial evidence | DOCS, IDN | Content exists for Domain 1 only; app support not shown |
| Drag-and-drop (matching) questions | Partial evidence | DOCS, IDN | Content exists for Domain 1 only; app support not shown |
| Scenario-based questions | No evidence | | Not found in any asset |

### Navigation and progress

| Feature | Status | Evidence | Notes |
| --- | --- | --- | --- |
| Next button | Demonstrated | PROTO | "Next Question" |
| Previous and Submit buttons | Requested | IDN | |
| Running score | Demonstrated | PROTO | Shows "Score: 1 / 1" |
| Real-time correct/incorrect tracker (study mode) | Requested | IDN | Overlaps with the running score |
| Progress indicator (e.g., "5 of 60") | Requested | IDN | |
| Flag for review | Requested | IDN | Checkbox above each question |

### Filtering and selection

| Feature | Status | Evidence | Notes |
| --- | --- | --- | --- |
| Filter by domain, with multiple domains at once | Partial evidence | IDN | IDN mentions preventing "multi-domain selection bugs," which suggests it was attempted |
| Filter by question type | Requested | IDN | |
| Filter by source (e.g., "Boles") | Requested | IDN | Depends on every question having a source |
| "Unasked questions only" filter | Requested | IDN | Requires saving history between sessions |
| Filter to previously missed questions | Requested | IDN | Requires saving history between sessions |

### Results and data

| Feature | Status | Evidence | Notes |
| --- | --- | --- | --- |
| Final results screen with overall percentage | Requested | IDN | |
| Percentage for each domain | Requested | IDN | |
| Styled start, quiz, and score screens; matching desktop and mobile layouts | Requested | IDN | Only the quiz screen appears in PROTO |
| Importing question data into the app | Partial evidence | D1S | 15 Domain 1 questions are marked "Imported to App" |
| Unique ID for each question | Partial evidence | D1S, IDN | IDs exist in the format D1.MCQ.001 |
| Export for offline storage | Requested | IDN | |
| Flashcards | No evidence | | The Flashcards folder is empty |

### Technology

| Item | Status | Evidence | Notes |
| --- | --- | --- | --- |
| Web app | Partial evidence | PROTO | The screenshot looks like a browser-based app |
| HTML, CSS, JavaScript, JSON | No evidence | | Recalled in discussion; no code or data files survive |
| Built in Replit | No evidence | | Recalled in discussion; a lead to investigate, not an established fact. Jami is checking |

## Question bank inventory

### Counts

Multiple-choice counts are Plexy's tally of the domain documents (October 11, 2026). The total of 1,229 is a count of answer keys. Plexy counted 1,228 separate question blocks; the one-question difference is in Domain 1 and should be resolved when the questions are converted to structured data.

| Domain (name used in the documents) | Multiple-choice | True/false | Drag-and-drop |
| --- | --- | --- | --- |
| D1: Selection, Appraisal, and Acquisition | 115 | 10 | 5 |
| D2: Arrangement and Description | 70 | Not found | Not found |
| D3: Reference Services and Access | 90 | | |
| D4: Preservation and Protection | 210 | | |
| D5: Outreach, Advocacy, and Promotion | 200 | | |
| D6: Managing Archives | 185 | | |
| D7: Professional, Ethical, and Legal Responsibilities | 205 | | |
| D8: Cultural Competency | 154 | | |
| **Total** | **1,229** | **10** | **5** |

Other figures, for context:

- **Structured data:** The Domain 1 spreadsheet has 116 ID slots, but only 30 rows are filled in (D1.MCQ.001–.030). The first 15 are marked as imported into the app.
- **"Verified" questions:** The Verified Answers document covers 15 Domain 1 questions.
- **Superseded counts:** TQD (190 / 25 / 12, covering Domains 1–2 only) is out of date. TQR (1,049 / 119 / 57) is a set of planning targets by source, not a count of written questions.

### Answer-position pattern

The correct answer is almost always B or C. Tally by Plexy:

| Domain | A | B | C | D |
| --- | --- | --- | --- | --- |
| D1 | 2 | 36 | 76 | 1 |
| D2 | 2 | 30 | 37 | 1 |
| D3 | 1 | 29 | 58 | 2 |
| D4 | 8 | 51 | 150 | 1 |
| D5 | 4 | 74 | 122 | 0 |
| D6 | 2 | 19 | 164 | 0 |
| D7 | 4 | 65 | 135 | 1 |
| D8 | 4 | 41 | 107 | 2 |
| **Total** | **27** | **345** | **849** | **8** |

About 69% of correct answers are C and 28% are B. Domain 6 is the most skewed, at 89% C. Fixing this takes two separate tasks:

1. **Shuffling answer choices in the app** removes the predictable A/B/C/D position.
2. **Editing the questions** removes the other clues, since the correct answer is often also the longest or most detailed option.

### Known quality issues

- **Missing sources and explanations:** In D8, none of the 154 questions cite a source and 137 have no explanation. In D7, 75 have no source and 60 have no explanation. Every Domain 1 question has a source. Questions without a source in the other domains: D2 15, D3 13, D4 15, D5 15, D6 15.
- **Untraceable verification:** The "Verified" tables in the documents are self-assessments written alongside the questions. Their citations are shortened labels with no page numbers or links.
- **At least one wrong answer key:** A FOIA question names the wrong agency as overseeing government-wide FOIA policy, and the correct agency isn't among the choices. Legal questions (mostly D7) carry the most risk.
- **Missing answer keys:** The EAD question document has none.
- **Duplicates:** About six exact duplicates, plus near-duplicates in D1 (for example, D1.MCQ.001 and .016; .010, .014, and .019).
- **Weak distractors:** Many wrong answers are obviously wrong, which makes questions easier than the real exam.
- **Outdated domain names:** The documents use the names from the 2024 and 2025 Study Guides and need mapping to current RDS IDs (see RESEARCH.md).
- **Unchecked page citations:** Specific page ranges (for example, in the Boles-based questions) need checking against the books.
- **Originality:** About 20 questions explicitly ask what a specific source says (for example, what the ACA Study Guide emphasizes). Most others are simply grouped by source. Every question still needs the originality check before publication.

### Review statuses

To carry into PROJECT_SPEC.md: every question has one of four statuses: **Unverified**, **Needs Revision**, **Verified** (facts checked by Plexy), or **Approved for Publication** (instructional quality approved by Jami). All surviving questions start as Unverified, and only approved questions enter the public repository.

### Review standards to adopt

Beyond factual accuracy, the review should check each question for answer-position balance, an answer that stands out by length or detail, implausible distractors, and wording that gives away the answer.

### Unresolved discrepancies

1. TQD records 15 true/false and 7 drag-and-drop questions for Domain 2, but no Domain 2 documents for those types were found.
2. The 15 imported questions are the only ones known to have been in the app. Whether more were added later is unknown without the code.
3. It's unclear whether the per-source sections in the domain documents were all intended for the app or were also study notes.

## Missing assets

| Asset | Status | Next step |
| --- | --- | --- |
| Original source code | Not located; the Domain 1 folder inside "Quiz Code" is empty | Jami checks Replit |
| App question data files (JSON or CSV used by the app) | Not located | Check Replit |
| Flashcards | Folder is empty | Confirm whether any were made |
| Domain 2 true/false and drag-and-drop questions | Counted in TQD but not found | Search Drive or confirm they were never written |
| Other screens (start, test mode, results) | Only the Learning Mode screen survives | Check Replit; otherwise design new |

## Decisions needed: recreate, improve, or defer

A preliminary list for the last Phase 1 step. Nothing here is decided. Each feature will be sorted into one of three categories: **Recreate** as the original intended, **Improve** on the original, or **Defer** to a future version, which keeps the first release manageable while preserving the original vision.

1. **Study modes:** Keep Learning Mode as shown. Decide what Test Mode means: a per-question timer (original request), a full practice exam that mirrors the real one (100 questions, three hours, flag-and-review; see RESEARCH.md), or both.
2. **Question types:** Multiple-choice only for version 1, or also true/false and drag-and-drop, given that only 15 such questions exist?
3. **Answer feedback:** Green check only (mockup), or green/red coloring for every answer (requested)?
4. **Filters:** Which of domain, type, source, unasked, and previously missed belong in version 1? The last two require saving progress between visits, which is still an open decision.
5. **Results:** Keep overall and per-domain percentages. Decide how to present them, since ACA publishes no passing score.
6. **Navigation:** Add Previous, Submit, a progress indicator, and flag for review as requested?
7. **Data features:** Export, and whether flashcards return.
8. **Question bank:** Fix the answer-position pattern during review. Decide the order of domains for review (Plexy proposes starting with D7) and how many approved questions are needed before the app launches.
