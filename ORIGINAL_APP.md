# Original App Inventory

Prepared by Claude, October 11, 2026, from the original materials in Jami's Google Drive, code recovered from two ChatGPT conversations, and findings from Plexy and Chad. Status: **final for Phase 1, open to additions** if more code turns up.

No original question text appears in this document. The question bank stays in Google Drive until questions are reviewed and approved. The recovered code is preserved in `archive/original-2025/`.

## Development history

| Dates | What happened | Evidence |
| --- | --- | --- |
| Apr 30 – May 3, 2025 | ChatGPT built a React quiz interface inside ChatGPT itself. Imported questions did not persist: on May 1 the app held one placeholder question, and on May 3 most imports were lost again. The prototype screenshot comes from this version. | CHAT1, PROTO |
| Apr 30, 2025 | Jami asked for separate timed and untimed mode toggles. The two-button mockup in the prototype deck shows that request. | CHAT1, PROTO |
| May 6, 2025 | With no app stored anywhere, Jami moved to Replit. ChatGPT supplied two complete code versions (1:10 PM and 1:49 PM). That evening Jami continued with Replit's own assistant. | CHAT1, CODE-A, CODE-B |
| May 6, 2025, 11:02 PM | Jami dropped true/false and drag-and-drop questions "to better align with the format of the actual exam." | CHAT1 |
| May 7, 2025 | Replit's assistant wrote a Python script to import questions from the Domain 1 .docx file. That night Jami deleted the first Replit build and started over. | CHAT1, CHAT2 |
| May 7, 2025, 10:50 PM | Jami listed the features she wanted: four modes (Learning, Test, a 100-question timed Practice Exam, and Flash Cards), filters, and a home page with study resources and performance stats. | CHAT2 |
| May 7–8, 2025 | ChatGPT sent a `.replit` configuration (11:24 PM) and ZIP files of starter code (May 7, 11:02 PM; May 8, 12:40 and 12:45 AM). The ZIP links have expired. | CHAT2 |
| May 9, 2025 | Jami built the home page, progress bar, flag for review, Previous button, results screen with review list, and score colors, pasting her files to ChatGPT along the way. | CHAT2, SNAP |
| May 18, 2025 | Jami pasted her latest style.css, the last dated record of the build. | CHAT2, SNAP |
| By Oct 2026 | Nothing from the Replit build survived. | Jami |

The React code from April is redacted in the shared conversation and can't be recovered. Fixes made after Jami's last paste on May 9 (a corrected script, a fade-in score message, confetti) are known only from the conversation, not from code.

## How to read this inventory

Each feature is labeled with the strongest evidence available:

| Status | Meaning |
| --- | --- |
| In original code | Written into recovered code (SNAP is Jami's actual Replit build; CODE-A and CODE-B are ChatGPT's proposals). Code shows the feature was built, not that it worked correctly |
| Demonstrated | Visible in the app screenshot in the prototype deck (the April React version). Shows the interface existed, not that its logic worked |
| Mocked up | Added on top of the screenshot in PowerPoint; shows design intent, not a working feature |
| Partial evidence | Supporting traces exist (data columns, notes, search excerpts), but the feature itself isn't shown |
| Requested | Listed in the Interface Design Notes or in Jami's May 7 feature list, but not found in code |
| Placeholder | Present on screen but with no working behavior behind it |
| No evidence | Recalled in discussion, but not found in any surviving asset |
| Confirmed | Established by the conversation record or by Jami directly (used for history and technology) |
| Dropped | Deliberately removed during the original development |

### Evidence sources

| Code | Asset | Date |
| --- | --- | --- |
| SNAP | Jami's own Replit files, pasted into ChatGPT: index.html (May 9, 11:25 AM), script.js (May 9, 1:47 PM), style.css (May 18, 9:54 AM) | May 9–18, 2025 |
| CODE-A | Code from ChatGPT, version A: loads `domain1_mcq_questions.json` | May 6, 2025, 1:10 PM |
| CODE-B | Code from ChatGPT, version B: loads `questions.json`, with scoring and source display | May 6, 2025, 1:49 PM |
| CHAT1 | ChatGPT conversation "Certified Archivist Exam Help," read by Plexy from a share link | Apr 30 – May 7, 2025 |
| CHAT2 | ChatGPT conversation "CA Exam Quiz Part 2," read by Plexy from a share link | May 7–9 and May 18, 2025 |
| PROTO | Quiz Prototype.pptx: one slide with an app screenshot plus three PowerPoint overlays: a highlight shape on the Learning Mode button, a "Test Mode (Timed)" button image, and a green check mark | Apr 30, 2025 |
| IDN | Interface Design Notes: a list of interface requests made during development | May 6, 2025 |
| D1S | Domain 1 MCQs Spreadsheet: structured question data with an "Imported to App?" column | May 2025 |
| DOCS | Eight domain question documents, plus Domain 1 true/false and drag-and-drop documents | Apr–May 2025 |
| VA | Verified Answers for Domains 1 through 8 | May 5, 2025 |
| TQD | Total Questions By Domain spreadsheet | May 7, 2025 |
| TQR | Full_Question_Totals_by_Resource spreadsheet and CSV | May 2–3, 2025 |

## Feature inventory

### Home page and modes

| Feature | Status | Evidence | Notes |
| --- | --- | --- | --- |
| Home page with mode selection | In original code | SNAP | |
| Four mode buttons: Learning, Test, Practice Exam, Flash Card | Placeholder | SNAP, CHAT2 | All four start the same quiz; the code ignores the mode chosen |
| Learning Mode (explanations after each answer) | In original code | SNAP, PROTO | This is how the quiz behaves in every mode |
| Test Mode (timed, answers hidden) | Requested | CHAT2, IDN, PROTO | No timer exists in any code |
| Practice Exam (100 questions, timed) | Requested | CHAT2 | Jami's May 7 list; matches the real exam format (see RESEARCH.md) |
| Flash Card mode | Requested | CHAT2 | A button only; the Flashcards folder is empty |
| Separate timed and untimed mode buttons, active mode highlighted | Mocked up | PROTO, CHAT1 | Jami's April 30 design request |
| Per-question timer (on/off) | Requested | IDN | |
| Study resource links | Placeholder | SNAP | Links go nowhere |
| Performance stats (overall and by domain) | Placeholder | SNAP | Always shows "0%" |

### Question display and feedback

| Feature | Status | Evidence | Notes |
| --- | --- | --- | --- |
| Multiple-choice question with stacked answer buttons | In original code | SNAP, CODE-A, CODE-B | |
| Selected answer highlighted | In original code | SNAP, PROTO | |
| Green for correct, red for incorrect | In original code | SNAP, CODE-B | Buttons lock after answering |
| Feedback message with the correct answer | In original code | SNAP, CODE-A, CODE-B | "Correct!" or "Incorrect" plus the right answer |
| Explanation shown after answering | In original code | SNAP, PROTO | |
| Source shown after answering | In original code | SNAP, CODE-B | |
| Answer choices shuffled | In original code (version A only) | CODE-A, IDN | Not in Jami's May 9 build; version A's method doesn't mix choices evenly |
| Green check for a correct answer | Mocked up | PROTO | Overlay in the prototype deck |
| True/false questions | Dropped | DOCS, CHAT1 | Removed May 6, 2025 to match the real exam; 10 exist for Domain 1 |
| Drag-and-drop (matching) questions | Dropped | DOCS, CHAT1 | Removed with true/false; 5 exist for Domain 1 |
| Scenario-based questions | No evidence | | Only one question in any document is written as a scenario |

### Navigation and progress

| Feature | Status | Evidence | Notes |
| --- | --- | --- | --- |
| Next and Previous buttons | In original code | SNAP | Previous is hidden on the first question |
| Progress bar | In original code | SNAP | Fills as you move through the quiz |
| Progress count ("3 of 60") | In original code | SNAP | |
| Flag for review | In original code | SNAP, IDN | A checkbox above each question, remembered when moving back and forth |
| Running score during the quiz | In original code | CODE-B, PROTO | Not in the May 9 build, which shows the score only at the end |
| Submit button | Requested | IDN | The last Next leads to results |

### Filtering and selection

| Feature | Status | Evidence | Notes |
| --- | --- | --- | --- |
| Filter by domain, with multiple domains at once | Requested | CHAT2, IDN | IDN mentions "multi-domain selection bugs," but no filter exists in the code |
| Filter by source (e.g., "Boles") | Requested | CHAT2, IDN | Depends on every question having a source |
| "Unasked questions only" filter | Requested | IDN | Requires saving history between sessions |
| Filter to previously missed questions | Requested | IDN | Requires saving history between sessions |

### Results and data

| Feature | Status | Evidence | Notes |
| --- | --- | --- | --- |
| Results screen with score and percentage | In original code | SNAP | |
| Score colored by Jami's targets | In original code | SNAP, CHAT2 | Green at 85% and up, yellow at 75–84%, red below 75%. These were personal goals, not ACA passing scores, which ACA doesn't publish |
| Encouraging message by score range | In original code | SNAP | Requires an element missing from the pasted HTML; added later that day |
| Review list of flagged and missed questions | In original code | SNAP | Shows your answer, the correct answer, the explanation, and the source |
| Back to Home button | In original code | SNAP | |
| Percentage for each domain | Requested | IDN, SNAP | Only an empty placeholder list exists |
| Saving progress between visits | No evidence | | Not in any code |
| Responsive layout for phones | In original code | SNAP | Buttons widen on small screens |
| Questions written into the code | In original code | SNAP | The May 9 build has two sample questions and loads no question file |
| Loading questions from JSON files | In original code (ChatGPT versions only) | CODE-A, CODE-B | Not in Jami's May 9 build; the question files are lost |
| Importing questions from Word documents | Partial evidence | CHAT1, D1S | Replit's assistant wrote a Python import script for the first build. Separately, 15 Domain 1 questions are marked imported, but into which app is unclear |
| Unique ID for each question | Partial evidence | D1S, IDN | IDs exist in the spreadsheet (D1.MCQ.001) but in no code |
| Export for offline storage | Requested | IDN | |

### Technology

| Item | Status | Evidence | Notes |
| --- | --- | --- | --- |
| React interface inside ChatGPT | Confirmed | CHAT1 | April version; code redacted |
| Static HTML, CSS, and JavaScript site | In original code | SNAP, CODE-A, CODE-B | |
| Hosted in Replit as a static site | Confirmed | CHAT1, CHAT2, Jami | `.replit` ran a single echo command; nothing from the build survived |
| Python question-import script | Partial evidence | CHAT1 | First Replit build only; not recovered |

### Lessons from the original code

These are problems to avoid in the rebuild, not features to recreate:

- **Modes that didn't do anything:** Four mode buttons led to the same quiz. Each mode in the rebuild needs its own defined behavior before its button appears.
- **Questions that kept getting lost:** Imports vanished from the React version, the May 9 build had only two questions in its code, and the whole Replit build was lost. The rebuild keeps questions in one data file under version control.
- **Files out of sync:** In the snapshot, the script refers to page elements the HTML doesn't have, and a syntax error stops the script from running at all. Committing every change keeps the files consistent.
- **Scores that can be counted twice:** In the May 9 build, going back with Previous lets you answer a question again, and each correct answer adds to the score.
- **Breakable answer buttons:** ChatGPT's version B writes each answer into the button's code inside quotation marks, so any answer with an apostrophe would break it.
- **Uneven shuffling:** Version A's shuffle method favors some orders over others.
- **Matching answers by text:** Every version decides correctness by comparing answer text, so a small wording edit could break scoring. Matching by position or ID is more reliable.
- **Inconsistent data fields:** The versions use different field names (`question_text` and `question`; `correct_choice`, `correct_answer`, and `correct`), and none uses the spreadsheet's question IDs. One documented question format is needed.

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

1. TQD records 15 true/false and 7 drag-and-drop questions for Domain 2, but no Domain 2 documents for those types were found. (Jami dropped these question types on May 6, 2025.)
2. 15 Domain 1 questions are marked as imported, but it's unclear whether that refers to the app inside ChatGPT (where questions were imported in early May and later lost) or the first Replit build. The "Imported to App?" column was already in the spreadsheet on May 6, about an hour after Replit was set up. The May 9 build used two sample questions; whether questions were loaded later can't be determined.
3. It's unclear whether the per-source sections in the domain documents were all intended for the app or were also study notes.
4. According to the conversation, two PDFs uploaded on May 1, 2025 listed Domain 2 as 60 multiple-choice, 15 true/false, and 7 drag-and-drop questions. They are probably the source of TQD's Domain 2 figures. The PDFs have not been located.

## Missing assets

| Asset | Status | Next step |
| --- | --- | --- |
| Final Replit build | Lost | None; the rebuild starts fresh |
| Fixes after May 9, 1:47 PM (corrected script, fade-in message, confetti) | Known only from the conversation | None needed; the rebuild won't reuse this code |
| React version from April 2025 | Redacted in the shared conversation | None |
| ZIP files of starter code (May 7–8) | Download links expired | None |
| Python import script | Not recovered | None; the rebuild will import questions differently |
| App question data files (JSON) | Lost | Rebuild from the Drive documents |
| May 1, 2025 PDFs with Domain 2 counts | Not located | Search Drive and Downloads |
| Domain 2 true/false and drag-and-drop questions | Counted in TQD but not found | Low priority, since these types were dropped |
| Flashcards | Folder is empty | Confirm whether any were made |

## Decisions needed: recreate, improve, or defer

A preliminary list for the last Phase 1 step. Each feature will be sorted into one of three categories: **Recreate** as the original intended, **Improve** on the original, or **Defer** to a future version, which keeps the first release manageable while preserving the original vision.

1. **Modes:** Jami's May 7, 2025 list named four: Learning, Test, a 100-question timed Practice Exam, and Flash Cards. The Practice Exam already matches the real exam (100 questions, three hours, flag-and-review; see RESEARCH.md). Decide which modes are in version 1 and how Test Mode differs from the Practice Exam.
2. **Question types: decided in May 2025.** Jami dropped true/false and drag-and-drop to match the real exam, which is multiple-choice only. Confirm this still holds.
3. **Answer feedback:** The May 9 build's design (green/red, the correct answer, explanation, and source after each answer) is a strong base to recreate. Decide whether Test and Practice Exam modes hold feedback until the end.
4. **Filters:** Which of domain, source, unasked, and previously missed belong in version 1? The last two require saving progress between visits, which is still an open decision.
5. **Results:** Recreate the score, percentage, and review list of flagged and missed questions. Decide whether to keep Jami's 85/75 color targets, presented as personal goals rather than pass/fail, and add per-domain results.
6. **Home page:** Real study resource links (for example, to ACA's RDS and Reading List pages) and working performance stats, or defer them?
7. **Data features:** Export, and whether Flash Card mode is in version 1.
8. **Question bank:** Fix the answer-position pattern during review. Decide the order of domains for review (Plexy proposes starting with D7) and how many approved questions are needed before the app launches.
