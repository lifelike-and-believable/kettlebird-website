---
id: design-comic-turn-pages
status: approved
derived-from:
  - story-comic-reader-turn-pages: 8d3e174e5578
  - design-comic-start-reading#page-addresses: 108059c3ef86
  - persona-fan#context-of-use: 38883e5abc09
---

# Turn pages: design

<!-- docs/design/comic-turn-pages.md. Design for story-comic-reader-turn-pages. Builds on the reader
page in design-comic-start-reading and goes live with it. -->

## Flow

1. The fan is on a page in the reader (from design-comic-start-reading).
2. They choose **Next page**, swipe left, or press the right arrow key. The next page opens at its own address, with the location line updated.
3. **Previous page**, swiping right, or the left arrow key does the reverse.
4. At the end of a chapter, **Next page** opens the first page of the next chapter that has pages. The location line shows the new chapter: "Chapter 3: Homeward · Page 1 of 18".
5. At the last page of the series, **Next page** is replaced by an end note and **Back to series**; **Previous page** stays.

## How a page turn works

Each page is its own address (design-comic-start-reading, "Page addresses"), and **Next page** and **Previous page** are ordinary links to those addresses. So:

- turning works with no script at all, and the browser's back button steps back through pages read;
- the address bar always shows the page the fan is on (story 3 relies on this);
- swiping and the arrow keys are a small script that follows the same links;
- once the current page has finished loading, the next page's image is fetched in the background at the same screen size, so the turn feels instant. It is not fetched when the fan's browser asks to save data, so a fan on a metered connection who reads one page pays for one page.

The page opens with the reader bar at the top of the window, so the fan never has to scroll back up to find the new page.

## Layout

- **Phones:** **Previous page** and **Next page** sit side by side directly under the page image, each at least 48 pixels tall, with **Next page** on the right and slightly more prominent. The same pair is not repeated above the page, to keep the page as large as possible.
- **Wide screens:** the same pair under the page, centred, plus large, quiet arrows at the left and right edges of the page that show on hover, for mouse users. They are a convenience only: keyboard and screen reader users use the pair under the page.
- The location line in the reader bar stays as designed in story 1.

## States and errors

- **First page of the series:** no **Previous page**; **Next page** alone, on the right.
- **A series with a single page:** no **Previous page**, and the end note in place of **Next page**.
- **First page of a later chapter:** **Previous page** goes to the last page of the chapter before (skipping chapters with no pages).
- **Last page of the series:** in place of **Next page**, the end note **You're all caught up!** with a second line that depends on the series' status, then **Back to series**:
  - Ongoing: "New pages are on the way."
  - On hiatus: "This comic is on a break."
  - Complete: "That's the end of the story."
- **Arrow keys turn pages only when it is safe:** they are ignored when focus is in a text field, when a modifier key is held (so Alt+Left still means "back" in the browser), and while the page is zoomed in, when arrows pan the view. Screen readers in browse mode keep the arrow keys for themselves, so they never reach the page.
- **Swipes turn pages only when it is safe:** a swipe that is mostly up or down is scrolling, and any swipe while the page is pinch-zoomed is panning; neither turns the page.
- **Next page image still loading:** the loading message from story 1 shows until it appears.

## Accessibility

- **Previous page** and **Next page** are links with those exact names, reached with Tab in reading order. The edge arrows on wide screens are hidden from screen readers and are not tab stops, so nothing is announced twice.
- Pages change without animation, so reduced-motion settings need nothing extra here. (The page-flip in the second comic epic will respect reduced motion.)
- Focus behaviour after a turn, and announcing the new page, belong to story 4 (assistive technology).
- Touch targets are at least 48 by 48 pixels.

## Persona walkthrough

A walkthrough for persona-fan (2026-11-01) of this note and the reading-comics help page found no blocking problems and twelve others. Addressed here: **Previous page** stays on the last page; arrow keys and swipes never turn pages while zoomed, with a modifier key, or in a text field; the edge arrows are mouse-only so nothing is announced twice; one end note matching the story, with a status line; a single-page series; and no background fetch when the browser asks to save data. Status labels and the "page not found" wording are now in design-comic-start-reading; the rest were documentation fixes.
