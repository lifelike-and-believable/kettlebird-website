---
id: story-comic-reader-newest-and-share
status: approved
derived-from:
  - epic-comic-reader#outcome: b4076be3edb8
  - requirements-comics#REQ-comics-2: d738742f9302
  - persona-fan#goals: 2b047e4cae5d
  - persona-fan#context-of-use: 38883e5abc09
  - persona-fan#frustrations: 078d5295ca3a
---

# Jump to the newest page and share a page

<!-- docs/product/stories/comic-reader/newest-and-share.md. Story 3 of epic-comic-reader. Page
addresses are already fixed by design-comic-start-reading; this story makes them usable. -->

As a fan, I want each page to have its own address and a way to go straight to the newest page, so that I can follow a link from a social post to the right page, and pick up where a new update starts.

## Acceptance criteria

- Opening a page's address (for example `/comics/kettle-tales/2/4`) shows that page in the reader, with the right location line.
- The address in the browser changes to match the page as the fan turns pages, so copying it at any moment shares the page they are on.
- The reader has a **Share this page** button that copies the page's address, and says "Link copied" when it has; on a phone it opens the phone's own share menu where one exists.
- The series page has a **Read the newest page** link, shown only for an ongoing series with more than one page, that opens the series' last page.
- A link to a page that no longer exists (for example, a page Star removed) opens the site's "page not found" page with a link to the series.
- A shared link shows the series' cover, title, and the page's location as its preview on social sites.
