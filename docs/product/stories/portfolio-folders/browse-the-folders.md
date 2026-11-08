---
id: story-portfolio-folders-browse-the-folders
status: approved
derived-from:
  - epic-portfolio-folders#outcome: 0a70fc8bd1ef
  - persona-fan#goals: 2b047e4cae5d
  - persona-fan#skills-and-tools: 6df01b6c2a65
---

# Browse the folders

<!-- docs/product/stories/portfolio-folders/browse-the-folders.md. Story 1 of epic-portfolio-folders. -->

As a fan, I want to look through the Portfolio's folders with each piece shown large and uncropped, so that I see Star's art as they made it.

## Acceptance criteria

- The page keeps its title "Portfolio" and its subtitle, then shows one folder per section that has pieces, in this order: Featured, Original Work, Fan Work, Past Clients, Work in Progress. There are no filter buttons.
- Each folder looks like a kraft-paper file folder with a tab holding its name in a typewriter face, as in Star's concept; the tabs alternate sides down the page, and the folders overlap a little, as a stack.
- A folder's pieces show in one row, each at its own shape (not cropped to a square), all at the row's height. The widest pieces are taken to be 16:9: on a phone, the row is as tall as a 16:9 piece filling the screen's width, so a taller piece is narrower and shows beside part of the next; on a computer, the row is large, as in Star's concept. The row scrolls sideways; pieces cut off at the row's ends show that there is more.
- The row has the site's arrow buttons (design-arrows) to scroll it, as well as touch, trackpad and keyboard scrolling; an arrow that can't scroll further can't be used and says so to screen readers.
- Choosing a piece opens it as now: its dialog, and full screen from there (epic-portfolio-full-screen).
- Pictures are fetched at the size they show, and those off screen load as they come near, so the page stays quick on a phone connection.
- A section with no pieces has no folder; with no pieces at all, the page shows its empty message, as now.
- The page passes the site's accessibility check; each folder is a labelled region named by its tab, and every piece has its alt text.
