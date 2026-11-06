---
id: design-comic-page-width
status: approved
derived-from:
  - design-comic-spread-and-flip#settings-per-comic: 64a1be41076a
  - design-comic-sheet-and-controls#layout: ee5c53db8ba2
  - persona-artist#goals: f3044c738f84
  - persona-fan#context-of-use: 38883e5abc09
  - requirements-comics#REQ-comics-2: d738742f9302
---

# How a comic's pages fit on a computer: design

<!-- docs/design/comic-page-width.md. A design amendment asked for by the lead (2026-11-06): on a computer, Star can
set how big a comic's pages show, even if that puts the bottom of the page and the controls below the window; a
narrower window shrinks the page to fit. The lead's example is https://www.theglassscientists.com/comic/page-01.
At review the lead set the form (2026-11-06): pages fit the height, the width or the screen, never wider than
their picture's own pixels unless the editor sets a largest width; fans can choose a size for themselves, with a
compact control, and Star's choice is the comic's default; Fit the height opens at the bar, as now; two pages side
by side take the size too. Mock-ups are in docs/design/mockups/comic-page-width/: PNG images, mockups.html (the
frames and the editor), proposed.css (the change as a stylesheet), and render.mjs, which screenshots the fixture
build's reader today and with the change. -->

## Personas

- persona-artist: Star draws pages to be read at a size, and wants the site to show the work as drawn (#goals). Today, on a laptop, a page is shrunk until it fits the window with the bar and controls: about 470 px wide in a 1440 × 900 window, where lettering drawn for print is small.
- persona-fan: on a computer, a fan has a mouse wheel or trackpad and a window to scroll (#context-of-use). Many webcomics show a page at a fixed width and let the reader scroll down it to the next-page button; for a fan, a bigger page that needs a scroll beats a small one that doesn't, though some fans would rather see the whole page at once.

## The change

This amends design-comic-spread-and-flip, "Settings per comic", which has two tick boxes in **How it reads**; design-comic-sheet-and-controls, Layout, "the page and the controls both fit on the first screen", which stays true on phones and tablets and, on a computer, when the page size is **Fit the screen**; and design-comic-reader-phone-bar, whose tools group gains a button on computers.

**Two new settings in How it reads**, under **Page-flip** (mock-ups 8 and 9):
- **Page size on a computer**, one of three, with **Fit the screen** chosen for every comic today and for a new comic. Its help text: "How big pages show on a laptop or desktop, one at a time or two side by side. Readers on a computer can choose another size for themselves. Phones and tablets always fit the screen." The choices:
  - **Fit the screen**: "The whole page and the buttons show at once, without scrolling, as now. On a 1440 × 900 laptop a page is about 470 pixels wide."
  - **Fit the width**: "Each page shows as wide as its picture, or as Largest page width, narrowed to fit the window. Readers scroll down each page to the buttons."
  - **Fit the height**: "Each page's height matches the window's, never wider than its picture or Largest page width. Readers scroll up to Back to series and the page number, and down to the buttons."
- **Largest page width**: a whole number of screen pixels, from 400 to 3200, empty by default. Its help text: "In screen pixels. A number wider than a page's picture enlarges the picture, and it may look soft. Leave it empty to show each page no wider than its picture. A two-page spread shows up to twice this. Fit the screen ignores it."
- Under it, a line worked out from the comic's pages tells Star her pictures' sizes, which the editor doesn't otherwise show: "This comic's pages are 800 pixels wide, and its spread 1600. On sharp (high-density) screens, a picture looks sharpest at half its width or less." When pages differ, it gives the range ("600 to 2400 pixels wide"); with no pages yet, it isn't shown.
- Anything else in **Largest page width** (under 400, over 3200, not a whole number, "900px") can't be published: "Choose a whole number of pixels between 400 and 3200, or leave it empty." (mock-up 9).
- Like the other settings, they go live when the comic itself is published; publishing a chapter doesn't publish them. Until then the comic shows Sanity's own mark for unpublished changes, as any item does (design-know-when-live, "Drafts"), and the guide says to publish the comic.
- A chapter's preview at **Computer** uses the comic's settings as they are now, published or not, like the other settings. The line under the settings says what it is: "Preview a chapter to see how it reads. The preview at Computer is a 1280 × 800 laptop, shown smaller to fit beside the editor." It shows how the page and controls fall, not the page's real size on screen.

**A page's largest width** is the comic's **Largest page width** (twice it for a two-page spread), or, when that's empty, the width of the page's own picture in pixels, which the site already knows for every page, up to 3200. A spread's picture is about twice as wide as a page's, so it gets about twice the room without a separate rule. These are screen pixels (CSS pixels), as the lead chose: on a high-density screen, such as most laptops sold today, a page shown at its picture's width spreads each of the picture's pixels over four of the screen's, so it's no bigger than the picture but not as sharp as the screen can show. A picture twice the width it shows at is sharp on those screens; the editor's line and the guide say so.

**A fan's page size** (mock-up 12):
- On a computer, the bar's tools gain one button, **Page size**, a picture only at every width (a page with arrows out to its corners), before **Panel by panel**. Its name shows under it on hover and keyboard focus, as the bar's tools do on phones, and it's 44 × 44 px, so the bar stays on one line from 700 px wide (mock-up 12). Phones and tablets don't show it, and it's hidden until the page's script runs, like **Panel by panel**.
- It opens a short menu of four, one ticked:
  - "Comic's choice: Fit the width" (naming the comic's setting), "Follows this comic's setting": the default;
  - **Fit the screen**, "The whole page and the buttons at once. For every comic";
  - **Fit the width**, "As wide as the page's picture, or the window if narrower. For every comic";
  - **Fit the height**, "As tall as the window. For every comic";
  - and a line under them: "Kept on this computer."
- Choosing one applies it at once, closes the menu, puts focus back on the button and says "Page size: Fit the height." in the reader's announcement line (the one that says page turns). The page stays on the same page and panel; the window scrolls to the bar.
- A fan's own choice is kept in this browser for every comic until they choose **Comic's choice** again. It applies before the page first shows, so a page never jumps from one size to another on opening. While it's in use, the button has a small dot, and its name says so: "Page size: Fit the screen, your choice" (mock-up 12), so a fan, or Star checking her own comic, can see that what's showing isn't the comic's setting.
- The menu is a menu of radio items (`role="menu"`, `menuitemradio`). Opening it, by click, Enter, Space or Down, moves focus to the ticked item; Up and Down move focus without choosing; Enter or Space chooses; Escape, Tab or a click outside closes it and puts focus back on the button. While it's open, the arrow keys don't turn pages. In a short window it scrolls within itself.
- While **Panel by panel** is on, the panel view fits the window whatever the size: the menu says "Panel by panel always fits the screen. Your choice applies when it's off." in place of its last line, and choosing says "Page size: Fit the height. Applies when Panel by panel is off." and doesn't scroll (mock-up 12).

**On a computer** (mock-ups 1 to 7, 10 and 11):
- "A computer" is a device with a mouse or trackpad (CSS `(hover: hover) and (pointer: fine)`), at any window width. Phones and tablets, held either way, fit the screen, as now.
- The page size in use is the fan's choice if they made one, or else the comic's.
- **Fit the screen** (mock-up 1): today's reader, unchanged.
- **Fit the width** (mock-ups 2 to 4, 6 and 7): the page is as wide as its largest width, narrowed to the window less a margin, and its height follows its shape: the fixture's 800 × 1200 page shows at 800 × 1200 in a 1440 × 900 window, running below it (mock-ups 2 and 3); with **Largest page width** 1200 it shows at 1200 × 1800 (mock-up 4); in an 800 × 700 window it shrinks to 752 (mock-up 6). On a 2560 × 1440 monitor an 800-pixel page is still 800 wide, a third of the window: the picture's width is the limit, as the help text says.
- **Fit the height** (mock-up 5): the page's height is the window's, as wide as that makes it up to its largest width and the window's width: 600 × 900 in a 1440 × 900 window, about 430 wide in a 1366 × 640 window (a 1366 × 768 laptop, less the browser's own bars), 240 × 360 in a 576 × 360 window. Each page opens at the bar, as now, so the page number shows; the page's bottom (the bar's height, 68 px) and the controls are a scroll down. It can be smaller than **Fit the width** for the same comic, and the help text says it's never wider than the picture.
- **Two pages side by side** (mock-up 11) takes the size too, where pairs show today (a window at least 1000 px wide, held sideways). **Fit the width**: each page as wide as its largest width, the pair narrowed to the window (696 each at 1440 × 900 for the fixture's 800-pixel pages); **Fit the height**: each page as tall as the window (600 × 900 each). The pages meet at the spine as now, and a spread across both follows the same rule with its own largest width.
- Browser zoom shrinks the window's width in CSS pixels, so a zoomed-in fan gets a page that fits the window, still bigger than today's (mock-up 10: a 1280 laptop at 200% shows the page 592 px wide, against about 300 today).
- **The reader's column**, and the bar and buttons in it, is the width of the chapter's widest page as shown (spreads aside; twice it for pairs), never narrower than 600 px or wider than the window. It stays the same through a chapter, so **Back to series**, the page number and **Next** don't move from page to page even when Star's pictures differ in size, and the bar doesn't wrap onto more lines for a narrow page. A page narrower than the column is centred in it (mock-up 2).
- **A two-page spread shown alone** follows the same size with its own largest width, centred, breaking out of the column, never wider than the window less a margin (mock-up 7: 1408 wide in a 1440 window, under an 800 px bar).
- In both new sizes, each page opens with the bar at the top of the window, as now, whether reached with **Next** or **Previous**, and the arrow keys turn pages without scrolling, as now.
- The page's edge arrows (on hover) run the page's height, and their arrow stays in the middle of the window as the page scrolls (mock-up 10), so it's always in view.
- While a page loads, "Loading page…" shows at the top of the page's space, not its middle, which may be below the window.
- The page's picture is asked for at the size it shows, at the screen's density, so it's as sharp as the picture allows: the reader's image sizes, the next page fetched ahead, and the picture widths the site makes (today up to 1600) all follow, with picture widths up to 3200, and never wider than the picture itself.

**Panel by panel** is unchanged: the panel view fits the window, so each panel shows whole on the screen. Turning it on in a comic read at **Fit the width** or **Fit the height** changes the page area to the window's size; turning it off goes back.

**Keyboard:** after a turn made with **Next** or **Previous** from the keyboard, focus returns to that control on the new page without scrolling to it (as now, so the page opens at the bar). On a tall page that control is below the window: pressing Enter turns again, and Tab or scrolling brings it into view. The arrow keys need no focus.

**The page-flip** on a page taller than the window turns the part that's in view; this needs checking on a computer before it's built, since headless browsers don't run it (For the spec to check).

**Unchanged:** phones and tablets; **Fit the screen**; panel by panel; the controls, **All pages**, and addresses.

## Where it applies

| # | Where | After |
|---|---|---|
| 1 | The comic's editor, **How it reads** (the series schema) | **Page size on a computer** (three choices, **Fit the screen** by default) and **Largest page width** (a whole number, 400 to 3200, empty by default); the line with the pictures' sizes; the error; the preview line. |
| 2 | The reader's bar on a computer (`src/components/pages/ReaderPage.astro`) | **Page size**, its menu, its dot and name for a fan's own choice; the choice kept in the browser and applied before the page shows; the arrow keys ignored while the menu is open. |
| 3 | The reader on a computer (`ReaderPage.astro`) | With **Fit the width** or **Fit the height**: each page, pair or spread by the size and its largest width; the column by the chapter's widest page; the edge arrows and loading message in view; the turn hint hidden (it's for phones). |
| 4 | The picture's size (`readerSizes` in `src/lib/comics/panels.ts`, the next-page fetch in `ReaderPage.astro`, `PAGE_WIDTHS` in `src/lib/comics/source.ts`) | Asked for at the size the page shows; picture widths up to 3200, never wider than the picture. |
| 5 | A chapter's preview (`src/lib/preview/load.ts`) | Uses the comic's settings as they are now, like **Two pages side by side** and **Page-flip**. |
| 6 | Star's guide `publishing-comics.md`; the fans' guide `reading-comics.md` | The new settings, and the fan's **Page size** (For the guides). |

## Mock-ups

Screenshots of the fixture build's reader (Single Sheets: one page at a time, pages 800 × 1200 pixels, a 1600 × 1200 spread at page 3; Open Book: two pages side by side), today and with the change. Source: `mockups/comic-page-width/mockups.html`.

| # | What it shows | File |
|---|---|---|
| 1 | **Fit the screen** (the default): today's reader, a laptop (1440 × 900), the page 467 × 700 | `mockups/comic-page-width/1-fit-screen.png` |
| 2 | **Fit the width**, no largest width: the page at its picture's 800 px, running below the window; the bar lines up with it | `mockups/comic-page-width/2-fit-width.png` |
| 3 | **Fit the width**, the whole page scrolled: the controls under the page, the window's bottom marked | `mockups/comic-page-width/3-fit-width-scrolled.png` |
| 4 | **Fit the width** with **Largest page width** 1200: the page enlarged to 1200 | `mockups/comic-page-width/4-largest-width.png` |
| 5 | **Fit the height**: the page 600 × 900, opening at the bar; and the whole reader | `mockups/comic-page-width/5-fit-height.png` |
| 6 | **Fit the width**, a desktop window narrower than the page (800 × 700): the page shrinks to 752 px | `mockups/comic-page-width/6-narrower-window.png` |
| 7 | **Fit the width**, a two-page spread: its picture's 1600, here narrowed to the window at 1408, under the chapter's 800 px bar | `mockups/comic-page-width/7-spread.png` |
| 8 | The editor: **How it reads** with **Page size on a computer**, **Largest page width** and the pictures' sizes | `mockups/comic-page-width/8-editor.png` |
| 9 | The editor: the error for a width that isn't allowed | `mockups/comic-page-width/9-editor-notes.png` |
| 10 | **Fit the width**: a laptop zoomed to 200%, and the edge arrow on a 1200 px page in a 1280 × 720 window | `mockups/comic-page-width/10-zoom-and-edge.png` |
| 11 | Two pages side by side in each size (Open Book, 1440 × 900) | `mockups/comic-page-width/11-pairs.png` |
| 12 | A fan's **Page size**: closed; its name on hover; open from the keyboard; open with **Panel by panel** on; a fan's own choice (the dot); a 700 px window, the bar on one line | `mockups/comic-page-width/12-fan-control.png` |

## States and errors

| Situation | What happens |
|---|---|
| **Fit the screen** (every comic today), no fan's choice | As now. **Largest page width** has no effect. |
| **Fit the width**, a computer | The page (or each page of a pair) as wide as its largest width, narrowed to the window; its height follows. |
| **Fit the height**, a computer | The page as tall as the window, up to its largest width and the window's width; it opens at the bar. |
| A fan's choice | Used for every comic in that browser, over the comic's, until they choose **Comic's choice**. |
| A fan's choice with storage blocked | Applies to the page in view; the next page uses the comic's choice. |
| No **Largest page width** | Each page up to its own picture's width in pixels, at most 3200. |
| A **Largest page width** wider than a page's picture | The picture is enlarged to it, and may look soft; the help text says so. |
| A chapter's pictures of different sizes | Each page at its own size, centred in a column as wide as the chapter's widest; the bar and buttons don't move. |
| A picture narrower than 400 | Shown at its own width, in a column at least 600 wide. |
| A window narrower than the page, or browser zoom | The page fits the window's width. |
| A phone or tablet | As now; no **Page size** button. |
| No script | No **Page size** button; the comic's choice, as set before the page shows. |
| A spread alone | The same size, with its own largest width (its picture's, or twice **Largest page width**), centred, within the window. |
| Panel by panel on | The panel view fits the window, as now; a fan's choice made then applies when it's turned off. |
| A page still loading | "Loading page…" at the top of its space. |
| A **Largest page width** outside 400 to 3200, or not a whole number | The editor won't publish it, with the error above. |

## Accessibility

- **Page size** is a picture button named "Page size" (or "Page size: Fit the screen, your choice"), with its name shown on hover and keyboard focus; voice control users say "Page size". Its menu is named "Page size on this computer", with radio items each named and described; focus moves to the ticked item on opening, Up and Down move it, Enter or Space chooses, Escape returns focus to the button. The choice is announced in the reader's announcement line, and the arrow keys don't turn pages while the menu is open.
- Nothing moves out of reach: the controls are under the page in the Tab order as now, and Tab brings each into view; the arrow keys and edge arrows turn pages without scrolling.
- After a keyboard turn, focus is on the same control on the new page, out of view on a tall page (Keyboard, above); Enter turns again.
- Zooming in keeps the page within the window's width, bigger than today's; a fan who finds a tall page hard to follow can choose **Fit the screen**.
- Pages are bigger, so their lettering is easier to read; screen reader users hear the same page descriptions and announcements.
- The editor's settings have labels, help text and an error message in words.

## For the guides

Star's guide `publishing-comics.md`:
- **Turn them on for a comic** (under Two-page spreads): add **Page size on a computer** and **Largest page width**:
  - what each choice does, with a short table of the page size each gives in common browser windows (about 1366 × 640 and 1440 × 780 on laptops, 1920 × 960 on a desktop, the screen less the browser's own bars) for pictures 800, 1600 and 2400 pixels wide;
  - that pages can run below the window and readers scroll;
  - that it's the comic's default, and fans on a computer can choose another size for themselves with **Page size** in the reader's bar; that a dot on that button means a choice of her own is showing in her browser, and **Comic's choice** clears it;
  - that an empty **Largest page width** keeps pages no wider than their pictures, so uploading bigger pictures gives bigger pages, and that the line under the setting says how wide her pictures are;
  - that on sharp screens, pictures twice the width they show at look best;
  - that a number wider than the pictures enlarges them;
  - to keep a chapter's pages the same size, so they read evenly;
  - that narrower windows, zoom, phones and tablets shrink or ignore them; that two pages side by side take the size too; that **Fit the screen** is as now; that they go live when the comic is published; and that the preview at **Computer** is a 1280 × 800 laptop, shown smaller.
- The intro of **Two-page spreads**, and **Panels**, which say pages on a laptop are fitted to the window: add "unless the comic fits the width or the height".

The fans' guide `reading-comics.md`: on a computer, **Page size** chooses how big pages show: the comic's choice, or fit the screen, the width or the height for every comic, kept on that computer; a dot on the button means your own choice is in use, and **Comic's choice** goes back.

## For the spec to check

- The series has **Page size on a computer** (three choices, **Fit the screen** by default and for comics without it) and an optional **Largest page width**, a whole number from 400 to 3200, with the labels, help, pictures' sizes line and error above; out-of-range, 0, negative, decimal and "900px" values are refused.
- The pictures' sizes line: one size, a range, a spread's size, and no pages.
- **Page size** in the bar on a computer only (not with a touch screen at 1024 × 768 and 1366 × 1024, nor on a phone, nor without script); the bar on one line at 700, 1000 and 1440 wide in each size; its menu, names and notes, the comic's choice named; the keyboard (focus to the ticked item on opening, Up and Down without choosing, Enter and Space choosing, Escape and Tab closing with focus back on the button, arrow keys not turning pages while open); the announcement; the choice applied at once, on the same page and panel, kept across comics and reloads, applied before the page first shows (no change of size after first paint), and cleared by **Comic's choice**; the dot and the button's name for a fan's own choice; with **Panel by panel** on, the note, the announcement and no scroll; with storage blocked, the page in view only.
- On a computer (a mouse), the fixture's 800 × 1200 pages, one at a time:
  - **Fit the width**, no largest width, at 1440 × 900: the page is 800 × 1200, the bar lines up with it, and the controls are below the window; with **Largest page width** 1200, 1200 × 1800; at 800 × 700, 699 × 700 and 576 × 360 the page fits the window's width; at 2560 × 1440 it's 800;
  - **Fit the height** at 1440 × 900: the page is 600 × 900 and opens with the bar at the window's top, its bottom 68 px below the window; at 576 × 360 it's 240 × 360;
  - **Fit the screen**: everything the reader's existing tests check passes unchanged;
  - nothing scrolls sideways, with overlay and classic scrollbars.
- Two pages side by side (Open Book) at 1440 × 900: **Fit the width**, each page 696 wide, meeting at the spine; **Fit the height**, each 600 × 900; a spread across both by the same rule; at 800 × 700 (one page at a time, as now), the single page by the size.
- A spread alone, in each size: up to its picture's width (or twice **Largest page width**), within the window, centred, with no sideways scrolling; the bar keeps the chapter's width.
- A chapter with pictures of different widths (a fixture chapter with 600 and 1200 pixel pages): the bar's width and the buttons' places are the same on every page; the column is never under 600.
- A picture wider than 3200: shown at most 3200 wide.
- Panel by panel on: the page area fits the window, as now; the list's note; a choice made then applies when it's off.
- The picture asked for, the next page fetched ahead and the picture widths, in each size, with and without **Largest page width**, on 1× and 2× screens; never wider than the picture.
- The edge arrow is in the window on a 1200 px page at 1280 × 720; "Loading page…" is at the top of the page's space.
- After a keyboard turn, focus is on the control on the new page, and the page opens at the bar.
- A chapter's preview at **Computer** uses the comic's settings, published or not, and shows no fan's choice.
- Manual: the page-flip on a page taller than the window, in Chrome and Safari on a computer.

## Decisions at review

Settled by the lead (2026-11-06):
- pages fit the screen, the width or the height; the default largest width is each picture's own pixels, in screen pixels, overridable in the editor;
- fans can choose a size for themselves with a compact control on computers, and Star's choice is the comic's default;
- **Fit the height** opens at the bar, as now;
- two pages side by side take the size too;
- a fan's choice is kept for every comic, with the dot showing it's in use.

## Persona walkthrough

Three walkthroughs for persona-artist and persona-fan, all 2026-11-06.

The first, of the earlier version (a page width in pixels), found two blocking problems, eight misleading ones and seven slower ones, all addressed then; those that still apply are carried here: the scaled preview and the editor's states in mock-ups; pictures fetched at the size they show; browser zoom; the settings going live with the comic; keyboard focus; the edge arrow and loading message in view; the page-flip as a manual check; touch laptops and tablets; the turn hint; the guide's other passages.

The second, of the three sizes, measured the mock-up stylesheet in the fixture build at 14 window sizes, with pictures from 300 to 4000 pixels wide. It found nothing blocking, ten misleading problems and eight slower ones, all addressed: Star sees her pictures' widths in the editor; the help text says what each size does with the picture's width, that **Largest page width** can enlarge, and that **Fit the height** can be smaller; the column is the chapter's widest page, so the buttons don't move; **Fit the screen** is exactly as now; sharp screens are stated plainly; the default stops at 3200; the preview's frame is named; the guide gets a table of sizes.

The third, of the fan's **Page size**, pairs and **Fit the height** at the bar, measured the stylesheet and the control in the fixture build from 600 to 1440 px wide. It found two blocking problems, seven misleading ones and seven slower ones. Addressed above:
- **Blocking:**
  - the button with its word made the bar wrap onto two lines in narrow columns and at 700 to 716 px, moving the page down and changing **Fit the screen** (the button is now a picture with its name on hover and focus, and the bar stays on one line from 700 px; mock-ups re-rendered with it);
  - the list's keyboard model couldn't work with plain radio buttons, and the arrow keys would have turned the page while it was open (now a menu of radio items with focus, keys and closing spelled out, and the arrow keys left alone while it's open).
- **Misleading:**
  - a fan's own choice silently replaced the comic's, which would also mislead Star checking her comic (now a dot and the button's name, and Star's guide says how to clear it);
  - "As wide as the window allows" wasn't true for small pictures (reworded);
  - with **Panel by panel** on, a choice was announced and scrolled but changed nothing visible (now its own note and announcement, without the scroll);
  - "1366 × 768 laptop" mixed screen and window sizes (now window sizes, and the guide's table too);
  - the name on hover wasn't in the mock-up stylesheet (now it is);
  - "Comic's choice: Fit the width" and "Fit the width" read the same (the notes now say "Follows this comic's setting" and "For every comic");
  - missing frames for the control's states (mock-up 12 now shows six).
- **Slower:** the button and Fit the screen's pictures were nearly the same (the button's arrows now point out); the menu in a short window (it scrolls within itself); no script (the button stays hidden); which line announces (the reader's announcement line); the control being at the top of a tall page (as the bar is, and the page opens there); Star's guide naming the fan's button (it does).
