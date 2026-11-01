---
id: story-comic-reader-start-reading
status: approved
derived-from:
  - epic-comic-reader#outcome: b4076be3edb8
  - requirements-comics#REQ-comics-1: 394dc144346d
  - requirements-comics#REQ-comics-3: 1c122b12d909
  - persona-fan#goals: 2b047e4cae5d
  - persona-fan#frustrations: 078d5295ca3a
---

# Start reading a series

<!-- docs/product/stories/comic-reader/start-reading.md. Story 1 of epic-comic-reader. -->

As a fan, I want to open a series from the comics page, see its chapters, and start at the first page of any chapter, so that I can read from the beginning or pick up a chapter I haven't read.

## Acceptance criteria

- Choosing a series on the comics page opens that series' own page; no series card leads to a missing page.
- The series page shows the series' title, cover, description, and status (ongoing, complete, or hiatus).
- The series page lists the chapters in order, each with its number and title, and how many pages it has.
- A **Start reading** button opens the first page of the first chapter.
- Choosing a chapter opens that chapter's first page.
- A series that has no chapters yet shows **Start reading**, which opens its first page, and no chapter list.
- A series with no pages yet says that pages are coming soon, and offers no **Start reading** button.
- The page that opens shows the comic page image with its alt text, and says which chapter and page it is, for example "Chapter 2, page 1".
- The series page and the first page work on a phone and a computer, and every link and button can be reached and used with a keyboard.

## Notes

- Turning to the next page is story 2 (turn-pages); this story only has to open the right first page.
- Page addresses and the newest-page link are story 3; this story's addresses may change when that story is designed.
