---
id: epic-comic-reader
status: approved
derived-from:
  - requirements-comics#REQ-comics-1: 394dc144346d
  - requirements-comics#REQ-comics-2: d738742f9302
  - requirements-content-editing#REQ-content-editing-1: dedad51c8978
  - requirements-site#REQ-site-4: 5970ab67a115
  - persona-fan#goals: 2b047e4cae5d
  - persona-fan#frustrations: 078d5295ca3a
  - persona-artist#goals: f3044c738f84
---

# Comic reader

<!-- docs/product/epics/comic-reader.md. The first epic, from concept decision 1. -->

## Outcome

Fans can read any of Star's comics on the site, from the first page to the newest, on a phone or a computer, by touch, keyboard, or screen reader. Every series on the comics page leads to a reader, and a page Star publishes appears in it without a developer.

## Personas

- persona-fan: reading the comics is one of their goals, and today every series link goes nowhere, which is one of their frustrations. They usually arrive on a phone from a social post, often to read the newest page.
- persona-artist: Star wants new comic pages on the site as soon as they are finished, without asking a developer.

## Stories

Proposed; each is written as its own story file, and approved, before work on it starts.

1. **Start reading a series.** As a fan, I want to open a series from the comics page and start at its first page, so that I can read it from the beginning.
2. **Turn pages.** As a fan, I want to go to the next and previous page by tapping, swiping, clicking, or using the arrow keys, so that I can read at my own pace on any device.
3. **Jump to the newest page and share a page.** As a fan, I want each page to have its own address and a way to go straight to the newest page, so that I can follow a link from a social post to the right page, and pick up where a new update starts.
4. **Read with assistive technology.** As a fan using a screen reader, I want each page announced with its page number and alt text, and focus kept in the reader as I turn pages, so that I can follow the story.
5. **Publish a page.** As Star, I want a comic page I add in the CMS to appear in the reader, in page order, after the next deploy, so that new pages reach fans without a developer.

## Dependencies

- **CMS comparison (concept decision 6).** The reader reads series and pages from the CMS. The comparison should finish before story 5 is specified, and before the reader's data loading is built, so it is not built twice. Stories 1 to 4 can be designed in parallel.

## Out of scope

- Panel-by-panel reading using the CMS's panel regions. It can be a later story once page-by-page reading works.
- Remembering a reader's place between visits (bookmarks, "resume"). Story 3's page addresses and newest-page link cover the main need; local saving can follow.
- Comments, likes, or subscriptions (concept non-goal: accounts and comments).
- Page-flip animation. The original plan's page-flip reader was for stories, not comics.
- Selling comics or gating pages behind payment.

## Open questions

1. Page at a time, or a vertical scroll of the whole chapter? A design question; page at a time matches the CMS's page model and the stories above.
2. Do any series have chapters? The CMS has series and pages only. If chapters are needed, story 1 should open at a chapter.
3. Is there comic content in the CMS today to build and test against, or should the reader be built against sample pages Star provides?
