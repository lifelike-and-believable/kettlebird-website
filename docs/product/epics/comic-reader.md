---
id: epic-comic-reader
status: approved
derived-from:
  - requirements-comics#REQ-comics-1: 394dc144346d
  - requirements-comics#REQ-comics-2: d738742f9302
  - requirements-comics#REQ-comics-3: 1c122b12d909
  - requirements-content-editing#REQ-content-editing-1: dedad51c8978
  - requirements-site#REQ-site-4: 5970ab67a115
  - persona-fan#goals: 2b047e4cae5d
  - persona-fan#frustrations: 078d5295ca3a
  - persona-artist#goals: f3044c738f84
---

# Comic reader

<!-- docs/product/epics/comic-reader.md. The first epic, from concept decision 1. -->

## Outcome

Fans can read any of Star's comics on the site, chapter by chapter, from the first page to the newest, a page at a time, on a phone or a computer, by touch, keyboard, or screen reader. Every series on the comics page leads to a reader, and pages and chapters Star publishes appear in it without a developer.

## Personas

- persona-fan: reading the comics is one of their goals, and today every series link goes nowhere, which is one of their frustrations. They usually arrive on a phone from a social post, often to read the newest page.
- persona-artist: Star wants new comic pages on the site as soon as they are finished, without asking a developer.

## Stories

Proposed; each is written as its own story file, and approved, before work on it starts.

1. **Start reading a series.** As a fan, I want to open a series from the comics page, see its chapters, and start at the first page of any chapter, so that I can read from the beginning or pick up a chapter I haven't read.
2. **Turn pages.** As a fan, I want to go to the next and previous page by tapping, swiping, clicking, or using the arrow keys, moving into the next chapter at the end of one, so that I can read at my own pace on any device.
3. **Jump to the newest page and share a page.** As a fan, I want each page to have its own address and a way to go straight to the newest page, so that I can follow a link from a social post to the right page, and pick up where a new update starts.
4. **Read with assistive technology.** As a fan using a screen reader, I want each page announced with its chapter, page number, and alt text, and focus kept in the reader as I turn pages, so that I can follow the story.
5. **Publish pages and chapters.** As Star, I want pages and chapters I add in the CMS to appear in the reader, in order, after the next deploy, so that new pages reach fans without a developer.

## Dependencies

- **CMS comparison (concept decision 6).** The reader reads series, chapters, and pages from the CMS. The comparison should finish before story 5 is specified, and before the reader's data loading is built, so it is not built twice. Stories 1 to 4 can be designed in parallel.
- **Sample pages.** Star's comics exist but are not in the CMS yet. The lead will provide sample pages, including at least one multi-chapter series, to design and test against. Moving the real comics into the CMS is Star's content work, not part of this epic.

## Out of scope

- Page-flip, two-page spreads, and panel-by-panel reading: the next epic, epic-comic-reader-flip-and-panels, builds on this one.
- **Later plans** (concept decision 8), each a future epic or story: comments on comics, paid comic pages, and remembering a reader's place between visits.
- Selling printed comics through the shop (the shop epic covers products).
