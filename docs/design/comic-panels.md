---
id: design-comic-panels
status: approved
derived-from:
  - story-comic-reader-flip-and-panels-read-panel-by-panel: 0cd610fa0545
  - story-comic-reader-flip-and-panels-panels-found: 61aa1e576413
  - story-comic-reader-flip-and-panels-correct-the-panels: 0e8299e7679c
  - story-comic-reader-flip-and-panels-comic-settings: 91b08e4f2d65
  - epic-comic-reader-flip-and-panels#decisions-from-the-lead: 6c4beced64ec
  - epic-comic-reader-flip-and-panels#open-questions: 6ac1fe3cee57
  - design-comic-spread-and-flip#how-it-works: c145d0b6b751
  - design-comic-spread-and-flip#the-page-flip: 2ad0e062a153
  - design-comic-publish-pages#flow: 954976ba8278
  - design-preview#flow: 257ebbac18cb
  - persona-fan#context-of-use: 38883e5abc09
  - persona-artist#skills-and-tools: 4e28d5374320
---

# Panel-by-panel reading, found and corrected panels: design

<!-- docs/design/comic-panels.md. Design for stories 3, 4 and 5 of epic-comic-reader-flip-and-panels.
Mock-ups are in docs/design/mockups/comic-panels/ (PNG images, and mockups.html, the source they are
rendered from with render.mjs). -->

## Personas

- persona-fan: reads on a phone, in short sessions. Small panels and lettering mean pinching and zooming, and losing the thread. Panel by panel, each panel fills the screen and the next one is a tap away.
- persona-artist: Star draws pages in a regular grid most of the time, with the odd splash page and borderless panel. Star won't mark every panel by hand, but will fix the few the site gets wrong, by working on the picture, as in a drawing program.

## Decisions

- **Panels are found in the editor, as soon as a page uploads** (answers the epic's open question). The story asks for panels "before the page is published", and finding them in Star's browser means Star sees them, and can fix them, before anything goes live. The site's build never changes panels. Pages uploaded before this feature have none until Star asks for them (**Find panels**, below).
- **Panel by panel is for one page at a time.** On a wide screen showing two pages, the reader works as now and the **Panel by panel** button isn't shown; the fan's choice is kept for when the window is narrow again. Stepping through panels with a facing page beside them would split the reader's attention, and a laptop's pages are big enough to read.
- **Star's panels always win.** Once Star changes a page's panels, confirms them, or chooses to show the page whole, nothing finds panels on that page again. **Find panels again** is offered only while a page's panels are still the site's own.
- **Publishing waits for panels**, as it waits for uploads, so a page goes live with the panels the site found. The wait is capped, so finding panels never stops a page from being published.

## How it works

- **What a panel is.** A rectangle on the page, in reading order. A page has either panels, or none and is shown whole. Panels are stored with the page (its existing `panels` list, in percentages of the picture), with a note of who set them: found by the site, or set by Star.
- **Finding panels.** After a page uploads, the editor looks for the light gutters between panels on a small copy of the picture. It cuts the page into rows wherever a gutter runs right across it, then each row into columns wherever a gutter runs right down it, then each of those pieces into rows again, and so on, until no piece splits. So a tall panel beside two stacked ones is found as three. The panels are numbered in the order the cuts give: top to bottom, and left to right within a row. On a spread, the spine is a gutter only if Star left a light gap there. It takes about a second a page and runs a few pages at a time, while Star carries on.
- **When none are usable.** If the page doesn't split (a splash, borderless art, a single panel), or splits into slivers (more than 12 panels, or one under 3% of the page), it gets no panels, and is shown whole in panel-by-panel reading. The page panel says so.
- **Publishing waits for it, briefly.** While panels are being found, **Publish** shows "Finding panels on 3 pages…" and can't be pressed, as it does for uploads. If it takes more than 20 seconds, **Publish** works again and those pages go live whole; their panels, when found, are a change to publish next time, and the editor says so. Finding panels never stops a page from being published.
- **Older pages.** A chapter whose pages were uploaded before panels existed shows "12 pages have no panels yet. Find them, then check them before you publish." with **Find panels** (mock-up 13). Choosing it finds them on those pages only, showing "Finding panels: 4 of 12 done."; Star then checks and publishes as usual.

## Flow: a fan

1. On a phone, the reader bar has **Panel by panel** beside **All pages** (mock-up 1). It shows on every page of a chapter where Star has panels on at least one page.
2. Choosing it zooms into the page's first panel, enlarged to fit the space between the bar and the controls (mock-up 2). The bar reads "Chapter 2: The Long Road · Page 4 of 12 · panel 1 of 5". The button is pressed (dark), and the choice is remembered on that browser.
3. **Next**, swiping left or the right arrow key moves to the next panel: the view slides and zooms from one panel to the next, in about 0.3 seconds (mock-up 3). After the page's last panel, it turns to the next page (with the page-flip, if Star has turned it on for the comic) and opens on its first panel.
4. **Previous**, swiping right or the left arrow key goes back a panel; from a page's first panel, to the last panel of the page before.
5. A page without panels shows whole, "Page 6 of 12 · whole page", and one turn moves past it (mock-up 4).
6. Choosing **Panel by panel** again shows the whole page, at the panel the fan was on; the button is no longer pressed.
7. **First**, **Newest**, **All pages** and links still go to pages; in panel by panel they open at the page's first panel.
8. Holding the phone sideways, a wide panel fills more of the screen, and the controls are a short scroll below, as for a spread (mock-up 5); swipes and the arrow keys still turn.
9. While the page is pinch-zoomed, swipes and arrow keys move around the page instead of turning, as now.

## Flow: Star

1. Star uploads pages as now. Each new tile in the grid shows "Finding panels…", then the count, "5 panels", or "Shown whole" (mock-up 6).
2. Star opens a page. The picture on the left has the panels drawn on it as numbered boxes, and under **Two-page spread** the **Panels** section says "5 panels, found by the site. Check that they match your page." with **They're right** (mock-up 7). Choosing it, or changing anything, makes the panels Star's.
3. Clicking a box selects it, with handles at its corners and edges, and a bar just above it: **Earlier**, **Later**, **Remove** (mock-up 8). Selecting changes nothing.
   - Drag the box to move it; drag a handle to resize it.
   - **Earlier** and **Later** move it one place in the reading order; the numbers on every box follow.
   - **Remove** deletes it.
4. Dragging on the picture where there's no box draws a new one, numbered after the last (mock-up 9). **Add panel** does the same from the keyboard: a box in the middle of the page, ready to move.
5. **Set the reading order** numbers the boxes from scratch: Star clicks them in the order they're read (or tabs to each and presses Enter), and the section counts "3 of 5 numbered" (mock-up 10). **Finish order** keeps the order so far, with the rest after it in their old order; **Cancel** or Escape leaves the order as it was.
6. **Show this page whole** removes all the boxes, so panel by panel always shows the page whole (mock-up 11).
7. **Undo** undoes the last change to the panels (Ctrl+Z or ⌘Z on the picture does the same), back to when the page was opened. Nothing asks first, because everything can be undone.
8. After the first change, the section reads "5 panels, set by you." From then on, panels are never found on that page again. While the panels are still the site's, **Find panels again** looks again, for example if Star thinks it missed some. (A replaced picture's panels are found again by themselves while they're the site's; see States and errors.)
9. **Preview** on **Phone** shows the reader at the page that's open, with **Panel by panel** working as it does for fans (mock-up 12). As in any chapter's preview (design-comic-spread-and-flip, "Settings per comic"), **Previous** and **Next** turn within the chapter, so **Next** steps through the panels and on to the chapter's next page, and stops at its last panel.
10. Changes are saved as Star works and go live when the chapter is published, like any other change.

## Page addresses

- No new addresses: panels belong to a page, and each page keeps its own address. A panel isn't part of a shared link, so a link always opens a page as the person opening it reads (whole, or at its first panel).
- While reading panel by panel, each step replaces the page's history entry rather than adding one, with the panel number in it: a refresh returns to the same panel, and the back button leaves the page, as now.

## What Star enters

The page panel's **Panels** section, under **Two-page spread**, replaces "Panels: Filled in automatically later".

| Part | What it says or does |
|---|---|
| Status line | "5 panels, found by the site. Check that they match your page." (with **They're right**) · "5 panels, set by you." · "Finding panels…" · "No panels found: this page shows whole. Draw panels on it if it has some." · "Shown whole: panel by panel shows this page as one." · "Couldn't look for panels on this page. Draw them, or leave it whole." |
| On the picture | Each panel a numbered box. Drag to move; handles to resize; drag on an empty area to draw. A selected box has **Earlier**, **Later**, **Remove** just above it. |
| Buttons | **Add panel** · **Set the reading order** · **Show this page whole** · **Undo** · **Find panels again** (only while the panels are the site's). With no boxes, **Set the reading order** and **Show this page whole** can't be used. |
| Keyboard help | "Tab to a panel. Arrow keys move it. Shift with Right or Down makes it wider or taller; with Left or Up, narrower or shorter. [ and ] move it earlier or later. Delete removes it. Ctrl+Z undoes." (shown under the buttons) |

## The panel view (reader)

- **Fitting:** the panel is scaled to fit the page area (the same space a whole page has now), centred, with a margin of 4% of the page's width around it in the page area's colour, so its border shows. Nothing of the page outside the panel is visible.
- **Moving between panels:** the view pans and zooms from one panel's frame to the next, about 0.3 seconds, never more than 0.4. Under reduced motion, the view changes at once.
- **Spreads:** a two-page spread's panels are stepped through the same way, on its single picture.
- **Turning pages:** the last panel to the next page plays the narrow page-flip (design-comic-spread-and-flip) between the two panel views, when the comic has the page-flip on (story-comic-reader-flip-and-panels-comic-settings); otherwise the next page's first panel shows at once.
- **The controls** keep their places and captions. Their full names say "Next panel" and "Previous panel" when the next step is a panel on the same page, and "Next page" and "Previous page" when it's a page.

## Layout

- **Panel by panel** sits in the reader bar beside **All pages**, the same height, with an icon of a page with one panel highlighted. Pressed, it's dark with light text (mock-up 2).
- The page area is the same size as for a whole page. While panel by panel is on, the location line always takes two lines on a phone ("… · panel 2 of 5" or "… · whole page"), so the page area and the controls don't move from panel to panel or page to page.
- In the editor, the picture on the left of the page panel is the drawing area, as large as the panel allows; the boxes are drawn in the site's blue (2 px), the selected one thicker with white-filled handles, each number in a filled circle at the box's top-left corner.

## States and errors

| Situation | What happens |
|---|---|
| Finding panels fails (the picture can't be read) | The tile says "Couldn't look for panels"; the page panel says "Couldn't look for panels on this page. Draw them, or leave it whole." Publishing is unaffected. |
| Finding panels takes more than 20 seconds | **Publish** works again; those pages go live whole. When their panels are found, the chapter has a change to publish, and the page's status says "Panels found after publishing. Publish again to use them." |
| A box drawn smaller than 3% of the page | Not kept; the status line says "That box was too small to be a panel." |
| Boxes overlap | Allowed: some layouts overlap. Reading follows the numbers. |
| A box dragged past the picture's edge | Stops at the edge. |
| A page's picture replaced | Its panels are found again if they were the site's; if they were Star's, they're kept and the section says "The picture changed. Check that your panels still match." |
| No script | The reader shows whole pages, as now; **Panel by panel** isn't shown. |
| Two pages side by side (a wide screen, in a comic with that setting on) | **Panel by panel** isn't shown; pages pair as now. Whenever the reader shows one page at a time, on any screen, it's offered. |

## Accessibility

- **Panel by panel** is a toggle button (`aria-pressed`), named "Panel by panel".
- Arriving on a page announces it as now, then the panel it opens at: "Panel 1 of 5.", or "Panel 5 of 5." when stepping back from the next page. Switching panel by panel on announces "Panel by panel. Panel 2 of 5."; switching it off announces "Whole page". Each step to another panel on the same page announces "Panel 3 of 5." The alt text describes the whole page, so it's read on arrival, not at each panel.
- The panel view is the same image with its alt text; screen reader users lose nothing by staying in whole-page reading, and the button says what it does.
- In the editor, each box is a button in reading order, named "Panel 2 of 5" (and "selected" when selected), reachable with Tab. Arrow keys move the focused box by 1%; Shift with an arrow key changes its width or height by 1% (Right and Down grow it, Left and Up shrink it); [ and ] move it in the order; Delete removes it; Ctrl+Z or ⌘Z undoes; in **Set the reading order**, Enter numbers the focused box and Escape cancels. The section's actions are buttons. A live status line says what changed ("Panel 2 moved earlier. Now panel 1 of 5.").
- The drawing area's boxes have a 3:1 contrast with any page, using a white outline around the blue line.

## Persona walkthrough

A walkthrough for persona-fan and persona-artist (2026-11-05), which opened every mock-up, found four blocking problems and fourteen others. Addressed here:

- **Blocking:**
  - **Find panels again** only while the panels are the site's, so Star's corrections are never replaced;
  - **Publish** waits for panels, with a cap, so pages go live with them;
  - cutting rows and columns repeatedly, so a tall panel beside stacked ones is found;
  - mock-up 12 redrawn with the page open, and **Next** stopping at the last panel in the preview.
- **Others:**
  - the location line keeps two lines while panel by panel is on, so the controls don't move;
  - nothing outside the panel shows;
  - the selection bar just above the box;
  - the shown-whole state and the buttons that can't be used without boxes;
  - **Finish order**, **Cancel** and the keyboard way to set the order;
  - **Undo**;
  - which edge keyboard resizing moves;
  - **They're right**;
  - the older-pages banner and its progress;
  - history and announcements in panel by panel;
  - the controls below a sideways panel;
  - pinch-zoom;
  - "Couldn't look for panels" on the tile.

## Mock-ups

| # | Shows | File |
|---|---|---|
| 1 | A phone, whole page, with **Panel by panel** in the bar | `mockups/comic-panels/1-phone-button.png` |
| 2 | Panel by panel on: panel 2 of 5 fills the page area | `mockups/comic-panels/2-panel-view.png` |
| 3 | Moving from panel 2 to 3: the view pans and zooms | `mockups/comic-panels/3-panel-move.png` |
| 4 | A page without panels, shown whole in panel by panel | `mockups/comic-panels/4-whole-page.png` |
| 5 | A phone held sideways: a wide panel; the controls a short scroll below | `mockups/comic-panels/5-sideways.png` |
| 6 | The editor's pages grid: "Finding panels…", "5 panels", "Shown whole" | `mockups/comic-panels/6-editor-grid.png` |
| 7 | A page open: panels found by the site, numbered on the picture, with **They're right** | `mockups/comic-panels/7-editor-found.png` |
| 8 | A panel selected: handles, **Earlier**, **Later**, **Remove** | `mockups/comic-panels/8-editor-selected.png` |
| 9 | Drawing a new panel | `mockups/comic-panels/9-editor-draw.png` |
| 10 | Setting the reading order: "3 of 5 numbered", **Finish order** and **Cancel** | `mockups/comic-panels/10-editor-order.png` |
| 11 | A splash page shown whole | `mockups/comic-panels/11-editor-whole.png` |
| 12 | The preview on **Phone**, panel by panel, beside the open page | `mockups/comic-panels/12-preview.png` |
| 13 | A chapter of older pages: "12 pages have no panels yet." with **Find panels**, and finding them, "4 of 12 done" | `mockups/comic-panels/13-editor-older-pages.png` |

## For the guide

- **Star's comics guide** (`docs/user/publishing-comics.md`): "Describe each page" loses the "Filled in automatically later" line, and a new section, **Panels**, says how they're found, how to check and correct them on the picture (with the keyboard way), how to show a page whole, how to find them on older pages, and how to preview panel by panel. It's a section of an existing guide, so the online help gains no new guide.
- **The fans' guide** (`docs/user/reading-comics.md`): a section, **Read panel by panel**: the button, turning, pages without panels, how to go back to whole pages, that it's for one page at a time, and that it's remembered.

## For the spec to check

- Finding panels on real pages: Star's sample pages (grid, splash, borderless, a spread), timed in a browser on a modest laptop.
- That nothing outside the editor changes panels, and that Star's panels are never replaced without **Find panels again**.
- The panel view's fit, margin and pan, and its turn into the next page's first panel, on a 360 × 640 phone; reduced motion.
- The history entry for the panel (back and refresh).
- Every editor action by mouse and by keyboard, **Undo**, and the live status line.
- **Publish** waiting for panels, and its 20-second cap.
- The cutting rule on layouts with a tall panel beside stacked ones, and on spreads.
- The preview on **Phone** in panel by panel.
