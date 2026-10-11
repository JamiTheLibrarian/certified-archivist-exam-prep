# CA Exam Prep App: Project Plan

Oct 11, 2026 · Jami Murphy

## Overview

Jami, Claude, Chad (ChatGPT), and Plexy (Perplexity) are rebuilding Jami's CA Exam Prep App in a GitHub repository Jami owns. Jami directs the project and makes every commit; Claude and Chad write, review, and explain; Plexy researches and checks facts.

Work through the checklist below in order, ticking each box as it's done. A step marked **Jami** is yours; steps marked Claude, Chad, or Plexy are what to ask that assistant for.

## Who does what

| Team member | Role | Responsibilities |
| --- | --- | --- |
| Jami | Project owner and subject expert | Describes the original app; makes final decisions and settles disagreements; has final say on instructional quality; uploads and commits all files; creates GitHub Issues; tests each feature; final check on exam content accuracy |
| Claude | Spec author and builder | Drafts PROJECT\_SPEC.md; writes code for features assigned to Claude, with a testing checklist for each; reviews Chad's code; helps design questions; explains how its code works; reads the repo directly if it's public (cannot commit) |
| Chad (ChatGPT) | Reviewer and builder | Reads the repo through its GitHub integration; reviews the spec and Claude's code; writes code for features assigned to Chad, with a testing checklist for each; helps design questions; explains technical decisions in plain English |
| Plexy (Perplexity) | Researcher and fact-checker | Researches exam details, using official ACA pages and documents first and third-party sites as background only; checks each question's facts, answer key (one correct answer, every wrong option truly wrong), and originality against published materials; reports each item as Confirmed, Corrected, or Couldn't verify, with its source; researches technical options; no code |

The exact split of features between Claude and Chad gets decided in Phase 3, once the spec shows what needs building. The rule: one assistant per feature, so we never edit the same code at once.

Plexy leads factual accuracy: are questions, explanations, and exam details supported by authoritative sources? Jami leads instructional quality: are questions clear, fairly challenging, and useful for study? Plexy can't see the real exam, so a fact-check confirms agreement with published sources, not with actual exam questions.

## Working agreements

Jami, Claude, and Chad agreed on these rules on October 11, 2026; Plexy joined the same day and follows them too.

1. Reconstruct the original app before writing any code.
2. PROJECT\_SPEC.md defines requirements and features.
3. PROJECT\_NOTES.md tracks progress, decisions (with reasons), and open questions.
4. GitHub Issues track each feature, bug, and improvement.
5. Commit directly to main for now, with a short message saying what changed and who wrote it, e.g. "Add timed practice mode (Claude)". Revisit branches after the first stable version.
6. One assistant per feature, to avoid conflicting changes.
7. Builders always start from the latest committed files.
8. Test each feature before starting the next.
9. Every exam fact records its source link, the source's publication or update date, and the date it was checked.
10. An Issue is closed only when the feature is built, reviewed, tested, and, if it includes exam content, fact-checked.
11. Keep what worked in the original rather than redesigning for its own sake.

| File | Purpose | Created when |
| --- | --- | --- |
| README.md | Short public description of the app | Already exists |
| PROJECT\_NOTES.md | Decisions, progress, open questions; paste into any chat to catch an assistant up | Phase 0 |
| RESEARCH.md | Plexy's research: each fact with its source link, source date, and date checked | Phase 1 |
| PROJECT\_SPEC.md | What the app does and how it's built, including the question-bank format | Phase 2 |
| Question bank data file (e.g. questions.json) | All exam questions, kept separate from the code | First question feature |
| CHANGELOG.md | What changed in each version | First working version |
| PROJECT_PLAN.md | Roles, workflow, and reference checklist (progress is tracked in Issue #1) | Phase 0 |
| ORIGINAL_APP.md | Inventory of the original app: features with evidence, question-bank counts and issues, missing assets, and decisions to make | Phase 1 |


## Checklist

Work top to bottom; finish each phase before starting the next.

### Phase 0: Set up the repository

- [x] **Jami:** Create the GitHub repository with a README
- [x] **Jami:** Decide whether the repo stays public or private for now (public lets Claude read it directly)
- [x] **Jami:** Create PROJECT\_NOTES.md and paste in the Working agreements above
- [x] **Jami:** Send the repo link to Claude and Chad

### Phase 1: Reconstruct the original app

- [x] **Jami:** Gather anything that survives: screenshots, old code, files, links
- [x] **Jami:** Write a rough description: features, look, where it lived, what you liked, what frustrated you
- [x] **Plexy:** Research the current Role Delineation Statement (domains, tasks, knowledge statements), Reading List, eligibility, and exam format, noting the version of each document
- [x] **Jami:** Commit Plexy's research as RESEARCH.md
- [x] **Jami:** Share the description, assets, and RESEARCH.md with Claude and Chad
- [ ] **Claude and Chad:** Ask follow-up questions to fill gaps
- [ ] **Jami:** Sort features into "recreate as is" and "improve"

### Phase 2: Write the specification

- [ ] **Plexy (optional):** Compare options for hosting the app and saving progress
- [ ] **Claude:** Draft PROJECT\_SPEC.md: purpose, features, technology, requirements, and a question-bank format (a separate data file; each question tagged with domain, difficulty, answer, explanation, source, and review status)
- [ ] **Jami:** Paste the draft into Chad's chat for review and Plexy's chat for fact-checking
- [ ] **Chad:** Review and suggest changes
- [ ] **Plexy:** Fact-check the exam details in the draft and cite sources
- [ ] **Claude:** Revise based on Chad's review, Plexy's fact-check, and Jami's feedback
- [ ] **Jami:** Approve and commit PROJECT\_SPEC.md

### Phase 3: Plan the build

- [ ] **Claude and Chad:** Propose which features each assistant builds, and in what order
- [ ] **Jami:** Approve the split and record it in PROJECT\_NOTES.md
- [ ] **Jami:** Create one GitHub Issue per feature, noting who builds it

### Phase 4: Build, one feature at a time

- [ ] Run the Feature loop below for each Issue, in the agreed order

### Phase 5: Launch

- [ ] **Plexy:** Re-verify exam details against ACA's current pages and update RESEARCH.md
- [ ] **Jami:** Test the whole app start to finish
- [ ] **Claude or Chad:** Walk Jami through publishing it (likely GitHub Pages, confirmed in the spec)
- [ ] **Jami:** Create CHANGELOG.md recording version 1.0
- [ ] **Jami:** Link the app from your portfolio website

## Feature loop

Repeat these steps for every feature in Phase 4. Copy the list into the feature's GitHub Issue to tick off there.

1. **Jami:** Open the Issue and tell the assigned builder which feature is next.
2. **Jami:** Share the latest committed files it touches (or the repo link, if the builder can read it).
3. **Builder (Claude or Chad):** Write the code, explain in plain English what it does, and give Jami a short testing checklist.
4. **Plexy:** If the feature includes exam content, check the questions as a batch (facts, answer key, originality) and report each as Confirmed, Corrected, or Couldn't verify.
5. **Other builder:** Review the code before it's committed, whenever practical, and flag problems.
6. **Builder:** Fix anything raised in the review or fact-check.
7. **Jami:** Upload the files to GitHub and commit, e.g. "Add score tracking (Chad)".
8. **Jami:** Test the feature using the checklist. Anything broken becomes a new Issue for the builder.
9. **Jami:** Note the result and any decisions in PROJECT\_NOTES.md, then close the Issue.

## Open decisions

These get settled during Phases 1 and 2 and recorded in the spec.

- [ ] Which features from the original app to keep, and which to improve
- [ ] What the app is built with, and where it will be published
- [ ] Who the app is for: Jami's own study, or other exam candidates too
- [ ] Where questions come from: original questions written to the exam's published domains, rather than copied from copyrighted study materials
- [ ] Which version of the Role Delineation Statement, and which domain names, the app follows
- [ ] Whether progress is saved between visits, and how
