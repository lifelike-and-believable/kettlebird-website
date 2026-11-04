---
id: epic-story-reader
status: approved
derived-from:
  - requirements-writing#REQ-writing-4: bb1c119d11fb
  - requirements-writing#REQ-writing-2: 82afee9c0eac
  - requirements-writing#REQ-writing-3: 723e918bb64e
  - concept#decisions: 7e75b36787ba
  - persona-fan#goals: 2b047e4cae5d
  - persona-artist#goals: f3044c738f84
  - persona-artist#skills-and-tools: 4e28d5374320
---

# Read Star's stories on the site

<!-- docs/product/epics/story-reader.md. From concept decision 3 ("Stories are readable on the site,
and links to AO3 stay for readers who prefer it") and REQ-writing-4. Lead's choices (2026-11-04):
scrolling text, not a page-flip; chapters when a story needs them; Star pastes text in from AO3 or a
document, with no connection to AO3. -->

## Outcome

A fan who finds one of Star's stories can read it on the site, start to finish, in one comfortable column of text on a phone or a computer, chapter by chapter when it has chapters, with **Read on AO3** still there for anyone who prefers it. Star puts a story on the site by pasting it into the editor, chapter by chapter, and its paragraphs, italics, bold and scene breaks come through as written.

## Personas

- persona-fan: reading Star's stories is one of their goals, and they read mostly on phones; they know AO3, where a story is one long column with chapters and Previous/Next.
- persona-artist: Star writes on AO3 and in documents, isn't a developer, and wants new work online without extra steps; pasting is the step they already know.

## Stories

Proposed; each is written as its own story file, and approved, before work on it starts.

1. **Read a story.** As a fan, I want to open a story from the Writing page and read it on the site in one readable column, with its title, cover and genres, so that I can read Star's writing without leaving for another site. A story that's also on AO3 still offers **Read on AO3**. A story with no text on the site keeps working as it does now, linking to AO3.
2. **Read by chapter.** As a fan, I want a story with chapters to show its chapter list and let me move from one chapter to the next, so that I can read a long story the way I would on AO3 and come back to the chapter I was on.
3. **Put a story on the site.** As Star, I want to paste a story or a chapter into the editor from AO3 or a document and have its paragraphs, italics, bold and scene breaks kept, so that putting a story on the site is as quick as copying it. One-shots stay one piece of text; chapters are added one at a time, like comic chapters.
4. **Find and share a story.** As a fan, I want the news page and the Writing page to take me to a story on the site, and a shared link to a story or chapter to show its title and cover, so that a story I post about on social media lands readers on Star's site.

## Dependencies

- **Preview before publishing** (epic-content-editing story 5) gains stories and chapters as things Star can preview; story 3 adds them.
- **The online help** (lead, 2026-11-03): story 3's guide joins `/help`.
- **Sample text from Star:** one one-shot and one chaptered story, as pasted from AO3, to check what pasting keeps.

## Out of scope

- A page-flip for stories (lead, 2026-11-04: scrolling text).
- Fetching or syncing stories from AO3.
- **Later plans** (concept decision 8): comments, and remembering a reader's place between visits. A chapter's own address is enough to come back to it.
- Choosing fonts or text size on the page; the browser's own zoom and reader mode keep working.

## Open questions

1. AO3 work skins and notes (author's notes, summaries, tags beyond genres): keep the summary as the existing **Short description**, and drop the rest? A design question for story 3.
2. Content warnings: AO3 shows ratings and archive warnings. Does Star want them shown on the site, and where? A design question for stories 1 and 2.
