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

Fans can read any of Star's comics on the site, chapter by chapter, from the first page to the newest, on a phone or a computer, by touch, keyboard, or screen reader. They can read a page at a time with a page-flip, or follow it panel by panel. Every series on the comics page leads to a reader, and pages and chapters Star publishes appear in it without a developer.

## Personas

- persona-fan: reading the comics is one of their goals, and today every series link goes nowhere, which is one of their frustrations. They usually arrive on a phone from a social post, often to read the newest page.
- persona-artist: Star wants new comic pages on the site as soon as they are finished, without asking a developer, presented in a way that feels like their own work.

## Stories

Proposed; each is written as its own story file, and approved, before work on it starts.

1. **Start reading a series.** As a fan, I want to open a series from the comics page, see its chapters, and start at the first page of any chapter, so that I can read from the beginning or pick up a chapter I haven't read.
2. **Turn pages.** As a fan, I want to go to the next and previous page by tapping, swiping, clicking, or using the arrow keys, moving into the next chapter at the end of one, so that I can read at my own pace on any device.
3. **Page-flip.** As a fan, I want turning a page to look like turning a page in a printed comic, so that reading on the site feels like reading Star's book. When my system asks for reduced motion, pages change without the animation (REQ-site-4).
4. **Read panel by panel.** As a fan on a phone, I want to step through a page one panel at a time, each panel enlarged to fit my screen, and switch back to the whole page whenever I like, so that I can read small panels without pinching and zooming.
5. **Jump to the newest page and share a page.** As a fan, I want each page to have its own address and a way to go straight to the newest page, so that I can follow a link from a social post to the right page, and pick up where a new update starts.
6. **Read with assistive technology.** As a fan using a screen reader, I want each page announced with its chapter, page number, and alt text, and focus kept in the reader as I turn pages or panels, so that I can follow the story.
7. **Publish pages and chapters.** As Star, I want pages and chapters I add in the CMS to appear in the reader, in order, after the next deploy, so that new pages reach fans without a developer.
8. **Mark panels.** As Star, I want to mark where the panels are on a page, in reading order, so that panel-by-panel reading follows my layout. A page without marked panels is shown whole.

## Dependencies

- **CMS comparison (concept decision 6).** The reader reads series, chapters, pages, and panel regions from the CMS. The comparison should finish before stories 7 and 8 are specified, and before the reader's data loading is built, so it is not built twice. Stories 1 to 6 can be designed in parallel.
- **Sample pages.** Star's comics exist but are not in the CMS yet. The lead will provide sample pages, including at least one multi-chapter series and pages with varied panel layouts, to design and test against. Moving the real comics into the CMS is Star's content work, not part of this epic.

## Out of scope

- **Later plans** (concept decision 8), each a future epic or story: comments on comics, paid comic pages, and remembering a reader's place between visits.
- Selling printed comics through the shop (the shop epic covers products).

## Open questions

1. Is this one epic or two? With eight stories it may be too large to ship and demonstrate at once. A natural split: page reading first (stories 1, 2, 5, 6, 7), then page-flip and panel-by-panel (stories 3, 4, 8).
2. Panel regions: should Star mark them by hand (story 8), or should the site try to detect panels automatically, with Star correcting them?
3. Does page-flip show one page or a two-page spread on wide screens?
