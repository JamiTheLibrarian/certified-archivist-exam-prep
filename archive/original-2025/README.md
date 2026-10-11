# Original App Code, 2025

Historical record of the original CA Exam Prep App's code. **This is not the code for the rebuild.** It is kept for provenance only, and nothing here runs. The question files the May 6 versions load are not included, because unreviewed questions stay in Google Drive. The May 9 snapshot contains two sample questions written into its code, kept as part of the historical record; they are unreviewed and not part of the rebuild's question bank.

## Development history

| Dates | Where the app lived | What survives |
| --- | --- | --- |
| Apr 30 – May 3, 2025 | A React interface built by ChatGPT inside ChatGPT itself | Only the prototype screenshot in Drive; the code is redacted in the shared conversation |
| May 6–7, 2025 | A first Replit build, started from ChatGPT's code and continued with Replit's own assistant; deleted by Jami on May 7 | The two ChatGPT versions below |
| May 7–18, 2025 | A second Replit build, started fresh on May 7 | Jami's own files as she pasted them into ChatGPT on May 9 and May 18 (snapshot below); the final build is lost |

## Versions

| Folder | Sent | Source | Completeness |
| --- | --- | --- | --- |
| 2025-05-06-1310-version-a | May 6, 2025, 1:10 PM ET | ChatGPT conversation "Certified Archivist Exam Help" (Apr 30 – May 7, 2025) | Complete as written by ChatGPT |
| 2025-05-06-1349-version-b | May 6, 2025, 1:49 PM ET | Same conversation | Complete as written by ChatGPT; questions-format-example.txt is ChatGPT's sample format and ends in "..." |
| 2025-05-09-replit-snapshot | index.html May 9, 11:25 AM ET; script.js May 9, 1:47 PM ET; style.css May 18, 9:54 AM ET | ChatGPT conversation "CA Exam Quiz Part 2" (May 7–9 and May 18, 2025), where Jami pasted her Replit files | Complete copies of each file at those moments, but the three files are from different times and don't fully match (see below) |

Extracted verbatim by Plexy (Perplexity) on October 11, 2026, from share links of the conversations; indentation was normalized only where code sat inside a numbered list. Saved to these folders by Claude the same day without changes.

## Notes on the Replit snapshot

This is the best evidence of what was actually in Replit, because these are Jami's own files rather than code ChatGPT proposed. As a set, though, it doesn't run:

- `script.js` has a syntax error (a stray backtick after the score-color block). ChatGPT pointed it out the same day; the fixed version was never pasted back.
- `script.js` looks for elements with the ids `prev-button` and `score-message`, which this earlier copy of `index.html` doesn't have. They were added later that day.
- The quiz uses two sample questions written into `script.js`; it doesn't load a question file.

The `.replit` configuration, sent by ChatGPT on May 7, 2025 at 11:24 PM ET, contained one line:

```
run = "echo 'This project runs a static HTML site. Open index.html manually in the preview pane.'"
```

## Not recovered

- Later fixes from May 9, 2025 (the corrected `script.js`, the fade-in score message, confetti)
- The ZIP archives of starter files (May 7–8, 2025); the download links have expired
- The Python import script Replit's assistant wrote on May 7, 2025
- The final Replit build

See ORIGINAL_APP.md at the top of the repository for what this code shows about the original app.
