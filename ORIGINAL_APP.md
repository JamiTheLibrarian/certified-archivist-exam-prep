# Original App Inventory

Prepared by Claude, October 11, 2026, from the original materials in Jami's Google Drive, two code versions recovered from a ChatGPT conversation, and findings from Plexy and Chad. Status: **final for Phase 1, open to additions** if more code turns up.

No original question text appears in this document. The question bank stays in Google Drive until questions are reviewed and approved. The recovered code is preserved in `archive/original-2025/`.

## Development history

| Dates | What happened | Evidence |
| --- | --- | --- |
| Apr 30 – May 3, 2025 | ChatGPT built a React quiz interface inside ChatGPT itself. Imported questions did not persist: on May 1 the app held one placeholder question, and on May 3 most imports were lost again. The prototype screenshot comes from this version. | CHAT, PROTO |
| Apr 30, 2025 | Jami asked for separate timed and untimed mode toggles. The two-button mockup in the prototype deck shows that request. | CHAT, PROTO |
| May 6, 2025 | With no app stored anywhere, Jami moved to Replit. ChatGPT supplied two complete code versions (1:10 PM and 1:49 PM). That evening Jami continued with Replit's own assistant. | CHAT, CODE-A, CODE-B |
| May 6, 2025, 11:02 PM | Jami dropped true/false and drag-and-drop questions "to better align with the format of the actual exam." | CHAT |
| May 7, 2025 | Replit's assistant wrote a Python script to import questions from the Domain 1 .docx file. | CHAT |
| May 8–9, 2025 | Later work (a `.replit` configuration, a progress bar, a `loadQuestion()` with Previous/Next navigation) is known only from ChatGPT's search excerpts. | Unverified |
| By Oct 2026 | Nothing from the Replit build survived. | Jami |

The final Replit build probably differed from both recovered versions, because work continued with Replit's assistant. The React code from April is redacted in the shared conversation and can't be recovered.

## How to read this inventory

Each feature is labeled with the strongest evidence available:

| Status | Meaning |
| --- | --- |
| In original code | Written into a recovered code version. Code shows the feature was built, not that it worked correctly |
| Demonstrated | Visible in the app screenshot in the prototype deck (the April React version). Shows the interface existed, not that its logic worked |
| Mocked up | Added on top of the screenshot in PowerPoint; shows design intent, not a working feature |
| Partial evidence | Supporting traces exist (data columns, notes, search excerpts), but the feature itself isn't shown |
| Requested | Listed only in the Interface Design Notes or asked for in the conversation |
| No evidence | Recalled in discussion, but not found in any surviving asset |
| Confirmed | Established by the conversation record or by Jami directly (used for history and technology) |
| Dropped | Deliberately removed during the original development |

### Evidence sources

| Code | Asset | Date |
| --- | --- | --- |
| CODE-A | Recovered code, version A: loads `domain1_mcq_questions.json` | May 6, 2025, 1:10 PM |
| CODE-B | Recovered code, version B: loads `questions.json`, with scoring and source display | May 6, 2025, 1:49 PM |
| CHAT | ChatGPT conversation "Certified Archivist Exam Help," read by Plexy from a share link | Apr 30 – May 7, 2025 |
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
| Learning Mode (untimed) | Demonstrated | PROTO, IDN | React version only; neither Replit version has modes |
| Separate timed and untimed mode buttons, active mode highlighted | Mocked up | PROTO, CHAT | Jami's April 30 design request, sketched in PowerPoint |
| Test Mode (timed, answers hidden) | Mocked up | PROTO, IDN | No timer exists in either code version |
| Per-question timer (on/off) | Requested | IDN | |

### Question display and feedback

| Feature | Status | Evidence | Notes |
| --- | --- | --- | --- |
| Multiple-choice question with stacked answer buttons | In original code | CODE-A, CODE-B, PROTO | |
| Answer choices shuffled | In original code | CODE-A, IDN | Version A only; its shuffle method doesn't mix choices evenly |
| Correct/incorrect feedback | In original code | CODE-A, CODE-B | Version A uses pop-up alerts; version B colors buttons |
| Green for correct, red for incorrect | In original code | CODE-B, IDN | The correct answer turns green and a wrong choice red; buttons lock after answering |
| Green check for a correct answer | Mocked up | PROTO | Separate image placed beside the selected answer |
| Selected answer highlighted | Demonstrated | PROTO | Dark navy highlight in the React version |
| Correct answer revealed after a wrong choice | In original code | CODE-A, CODE-B | |
| Source citation shown with the question | In original code | CODE-B, IDN | |
| Explanation shown after answering | Demonstrated | PROTO, IDN | React version only; neither Replit version shows explanations |
| True/false questions | Dropped | DOCS, CHAT | Jami removed them on May 6, 2025 to match the real exam; 10 exist for Domain 1 |
| Drag-and-drop (matching) questions | Dropped | DOCS, CHAT | Removed with true/false; 5 exist for Domain 1 |
| Scenario-based questions | No evidence | | Only one question in any document is written as a scenario |

### Navigation and progress

| Feature | Status | Evidence | Notes |
| --- | --- | --- | --- |
| Next button | In original code | CODE-A, CODE-B, PROTO | The only navigation in both code versions |
| End-of-quiz message | In original code | CODE-A, CODE-B | |
| Running score | In original code | CODE-B, PROTO | Version B shows "Score: x / total questions" |
| Previous and Submit buttons | Partial evidence | IDN, Chad's search | A May 9 `loadQuestion()` with Previous/Next is unverified |
| Progress indicator (e.g., "5 of 60") | Partial evidence | IDN, Chad's search | Only an HTML excerpt (around May 8) has been recalled |
| Real-time correct/incorrect tracker (study mode) | Requested | IDN | Overlaps with the running score |
| Flag for review | Requested | IDN | |

### Filtering and selection

| Feature | Status | Evidence | Notes |
| --- | --- | --- | --- |
| Filter by domain, with multiple domains at once | Partial evidence | IDN | IDN mentions preventing "multi-domain selection bugs," which suggests it was attempted |
| Filter by question type | Requested | IDN | Moot now that only multiple-choice remains |
| Filter by source (e.g., "Boles") | Requested | IDN | Depends on every question having a source |
| "Unasked questions only" filter | Requested | IDN | Requires saving history between sessions |
| Filter to previously missed questions | Requested | IDN | Requires saving history between sessions |

### Results and data

| Feature | Status | Evidence | Notes |
| --- | --- | --- | --- |
| Final results screen with overall percentage | Requested | IDN | The code shows only "Quiz Complete!" |
| Percentage for each domain | Requested | IDN | |
| Styled start, quiz, and score screens; matching desktop and mobile layouts | Requested | IDN | Only a quiz screen exists in the code |
| Loading questions from JSON files | In original code | CODE-A, CODE-B | The question files themselves are lost |
| Importing questions from Word documents | Partial evidence | CHAT, D1S | Replit's assistant wrote a Python import script on May 7; 15 Domain 1 questions are marked imported |
| Unique ID for each question | Partial evidence | D1S, IDN | IDs exist in the spreadsheet (D1.MCQ.001) but not in the code's data format |
| Export for offline storage | Requested | IDN | |
| Flashcards | No evidence | | The Flashcards folder is empty |

### Technology

| Item | Status | Evidence | Notes |
| --- | --- | --- | --- |
| React interface inside ChatGPT | Confirmed | CHAT | April version; code redacted |
| Static HTML, CSS, and JavaScript site | In original code | CODE-A, CODE-B | |
| Hosted in Replit | Confirmed | CHAT, Jami | Nothing from the Replit build survived |
| Python question-import script | Partial evidence | CHAT | Written by Replit's assistant; not recovered |

### Lessons from the original code

These are problems to avoid in the rebuild, not features to recreate:

- **Breakable answer buttons:** Version B writes each answer into the button's code inside quotation marks, so any answer containing an apostrophe would break that button.
- **Uneven shuffling:** Version A's shuffle method favors some orders over others. A proper shuffle is needed.
- **Inconsistent data fields:** The versions use different field names (`question_text` and `question`; `correct_choice` and `correct_answer`), and neither uses the spreadsheet's question IDs. One documented question format is needed.
- **Fragile question storage:** Questions were lost repeatedly in the React version, and the Replit build was lost entirely. The rebuild keeps everything in version control.
- **Matching answers by text:** Both versions identify the correct answer by comparing text, so two choices with identical wording, or a small edit to one, would break scoring. Matching by position or ID is more reliable.

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

1. TQD records 15 true/false and 7 drag-and-drop questions for Domain 2, but no Domain 2 documents for those types were found. (Jami dropped these question types on May 6, 2025; see the development history.)
2. The 15 imported questions are the only ones known to have been in the app. Whether more were added later can't be determined, since the code is lost.
3. It's unclear whether the per-source sections in the domain documents were all intended for the app or were also study notes.
4. According to the conversation, two PDFs uploaded on May 1, 2025 listed Domain 2 as 60 multiple-choice, 15 true/false, and 7 drag-and-drop questions. They are probably the source of TQD's Domain 2 figures. The PDFs have not been located.

## Missing assets

| Asset | Status | Next step |
| --- | --- | --- |
| Final Replit build | Lost | None; the rebuild starts fresh |
| React version from April 2025 | Redacted in the shared conversation | None |
| Later code (`.replit`, progress bar, May 9 navigation) and the May 7 ZIP files | Known only from search excerpts | Search ChatGPT history for the May 7–9 conversations; search for .zip files from May 2025 |
| Python import script | Not recovered | Low priority; the rebuild will import questions differently |
| App question data files (JSON) | Lost | Rebuild from the Drive documents |
| May 1, 2025 PDFs with Domain 2 counts | Not located | Search Drive and Downloads |
| Domain 2 true/false and drag-and-drop questions | Counted in TQD but not found | Low priority, since these types were dropped |
| Flashcards | Folder is empty | Confirm whether any were made |
| Other screens (start, test mode, results) | Never built, as far as the evidence shows | Design new, guided by the Interface Design Notes |

## Decisions needed: recreate, improve, or defer

A preliminary list for the last Phase 1 step. Each feature will be sorted into one of three categories: **Recreate** as the original intended, **Improve** on the original, or **Defer** to a future version, which keeps the first release manageable while preserving the original vision.

1. **Study modes:** Keep Learning Mode. Decide what Test Mode means: a per-question timer (original request), a full practice exam that mirrors the real one (100 questions, three hours, flag-and-review; see RESEARCH.md), or both. Jami's April 2025 request for separate timed and untimed buttons still stands as the design starting point.
2. **Question types: decided in May 2025.** Jami dropped true/false and drag-and-drop to match the real exam, which is multiple-choice only. Confirm this still holds.
3. **Answer feedback:** Version B's green/red coloring, a green check (mockup), or both? Should explanations return, as in the React version?
4. **Filters:** Which of domain, source, unasked, and previously missed belong in version 1? The last two require saving progress between visits, which is still an open decision.
5. **Results:** Keep overall and per-domain percentages. Decide how to present them, since ACA publishes no passing score.
6. **Navigation:** Add Previous, Submit, a progress indicator, and flag for review as requested?
7. **Data features:** Export, and whether flashcards return.
8. **Question bank:** Fix the answer-position pattern during review. Decide the order of domains for review (Plexy proposes starting with D7) and how many approved questions are needed before the app launches.
