# My Original CA Exam Prep App: Rough Description

Drafted by Plexy from Jami's May 2025 messages; edited by Jami. This is Jami's firsthand account; ORIGINAL_APP.md is the evidence inventory.

## Why I built it

I was studying for the Certified Archivist exam and wanted one place to practice with questions drawn from the ACA Reading List, domain by domain and resource by resource. I wanted to learn untimed first, then practice under time pressure once I'd mastered the content.

## Where it lived

- **April 30 – May 3, 2025: inside ChatGPT.** Chad built the first version as an app inside our chat. It never held more than a placeholder or two, even though Chad told me questions were imported.
- **May 6–7, 2025: my first Replit build.** I started from code Chad wrote, then worked with Replit's own assistant to fix bugs. I deleted it on May 7 and started over.
- **May 7–18, 2025: my second Replit build.** Plain HTML, CSS, and JavaScript. I pasted code from ChatGPT into the files myself, one change at a time. I paused the project after May 18.
- **The questions lived in Google Docs and spreadsheets the whole time,** because I didn't trust the app to keep them.

## What it could do

What was working by May 9, 2025 (most of this is in the recovered code; the confetti and the fade-in score message were added later that day, and I confirmed they "look great"):
- A home screen with four mode buttons: Learning, Test, Practice Exam, and Flash Cards. (They all ran the same quiz; the modes were never wired up.)
- One question at a time, with Previous and Next buttons. Previous was hidden on the first question.
- A progress bar showing how far I was through the quiz (with my two sample questions, it read "Progress: 1 of 2").
- A "Flag this question for review" checkbox that remembered its setting as I moved between questions.
- After answering: green for correct, red for my wrong choice, plus the correct answer, an explanation, and the source.
- A results screen with my score as a fraction and a percentage, colored by my own targets (green at 85% and up, yellow at 75–84%, red below 75%), a message based on the score, and a review list of flagged and missed questions with the correct answers and explanations.
- Confetti for high scores, and a score message that faded in.

What I planned but never got working:
- Real Test Mode and a 100-question, three-hour Practice Exam that mirrors the real exam
- Flash Card mode
- Filters: number of questions, domains, new questions only, previously missed only
- A study resources section and performance stats by domain on the home page
- Loading my full question bank. The May 9 build only had two sample questions in the code.

## How it looked

Clean and simple: a white card on a light gray page, Arial text, blue buttons, and a blue gradient progress bar. In my prototype, the answer choices were full-width buttons stacked one above the other. I wanted the desktop and phone layouts to match, and I wanted the selected answer to stand out clearly from the other choices.

## What I liked

- Building it one feature at a time, and seeing each piece work.
- The progress bar, the flag checkbox, and the end-of-quiz review of what I missed.
- The fun touches: the score message and the confetti.
- Organizing everything by domain and by Reading List resource.

## What frustrated me

- **Lost work.** Twice (May 1 and May 3), Chad reported that questions had been imported into the app, and they weren't there. The questions survived only because I'd saved them in Google Docs.
- **Replit was buggy,** and its assistant couldn't fix issues consistently.
- **Copying and pasting code by hand.** Every change meant pasting code into the right spot in the right file, which was easy to get wrong. Uploading ZIP files of updates didn't work well either, and once I had to start again from the first files.
- **Basic display bugs that took hours to fix,** like white text on a white background, so I couldn't even see the questions to answer them.
- **Assistants saying things were done or correct when they weren't,** including "verified" labels on questions that can't be traced back to specific pages in the sources.
- **Long chat sessions** that hit ChatGPT's limits, so work had to continue in a new chat.

## What I want this time

- Code saved in GitHub and questions in Drive until they're approved, so nothing gets lost
- Every feature tested before we move on
- Questions that are checked against the sources, with traceable citations
- The modes I wanted the first time actually working, especially a Practice Exam that mirrors the real exam
