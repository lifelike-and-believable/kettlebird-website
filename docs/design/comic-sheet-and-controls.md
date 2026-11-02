---
id: design-comic-sheet-and-controls
status: draft
derived-from:
  - story-comic-reader-contact-sheet: 7f9684183ed2
  - story-comic-reader-play-controls: 7b554943ac4c
  - design-comic-turn-pages#layout: a26d566f95d8
  - design-comic-turn-pages#states-and-errors: d45ab0902ca3
  - design-comic-start-reading#page-addresses: 108059c3ef86
  - persona-fan#goals: 2b047e4cae5d
  - persona-fan#skills-and-tools: 6df01b6c2a65
  - persona-fan#context-of-use: 38883e5abc09
---

# Contact sheet and player-style controls: design

<!-- docs/design/comic-sheet-and-controls.md. Design for story-comic-reader-contact-sheet (story 6)
and story-comic-reader-play-controls (story 7), both asked for by Star. Mock-ups are in
docs/design/mockups/comic-sheet-and-controls/ (PNG images, and mockups.html, the source they are
rendered from with render.mjs, built to match the reader page). This changes the page-turn buttons in
design-comic-turn-pages (see "Other documents"). -->

## Personas

- persona-fan: fans read on phones, in short sessions, often arriving from a link in the middle of a series (#skills-and-tools, #context-of-use), and want to catch up when a new page appears (#goals). So **Newest** is one tap from any page, the contact sheet makes a chapter scannable at a glance, and every control is big enough for a thumb.

## Flow

**Turning pages** (story 7)

1. Under the page, four controls: **First**, **Previous**, **Next** and **Newest** (mock-up 1).
2. **Previous** and **Next** turn one page, exactly as **Previous page** and **Next page** did, including across chapters.
3. **First** opens page 1 of the series' first chapter that has pages. **Newest** opens the series' newest page: the last page of its last chapter that has pages.
4. On the first page of the series, **First** and **Previous** can't be used (mock-up 2). On the newest page, **Next** and **Newest** can't be used, and the end note shows under the controls as now (mock-up 3).

**Seeing a chapter's pages** (story 6)

1. In the reader bar, **All pages** opens the contact sheet for the chapter the fan is in (mock-ups 1 and 4).
2. The sheet shows every page of that chapter as a small picture, in order, numbered, three a row on a phone and as many as fit on wider screens. The page the fan came from is marked "You were here", and the sheet opens scrolled to it (mock-ups 5 and 6).
3. Choosing a picture opens that page in the reader. **← Back to page 4** (the page they came from), or the browser's back button, returns them where they were.

## Addresses

- Each reader page has its own sheet, at its address plus `/pages`: from `/comics/kettle-tales/2/4`, the sheet is `/comics/kettle-tales/2/4/pages`. Because the address says which page the fan came from, the sheet can mark it, scroll to it and link back to it without any script, and each sheet is a plain page the site builds ahead of time, like the reader's.
- **All pages** links to the sheet with `#page-4`, so it opens scrolled to the marked picture.
- A picture links to that page's reader address (`/comics/kettle-tales/2/7`). The controls link to the first and newest pages' reader addresses.

## Mock-ups

Built to match the reader as it is: its fonts, colours, borders and reader bar. Comic pages are grey placeholders. The reader mock-ups open scrolled past the site header, as the reader does. Source: `mockups/comic-sheet-and-controls/mockups.html`.

| # | What it shows | File |
|---|---|---|
| 1 | Reader on a phone, a middle page: the four controls, and **All pages** in the bar | `mockups/comic-sheet-and-controls/1-reader-phone.png` |
| 2 | The first page of the series: **First** and **Previous** can't be used | `mockups/comic-sheet-and-controls/2-first-page.png` |
| 3 | The newest page: **Next** and **Newest** can't be used; the end note | `mockups/comic-sheet-and-controls/3-newest-page.png` |
| 4 | Reader on a laptop, with **Newest** focused by keyboard and its full name shown | `mockups/comic-sheet-and-controls/4-reader-laptop.png` |
| 5 | Contact sheet on a phone, opened from page 4 | `mockups/comic-sheet-and-controls/5-sheet-phone.png` |
| 6 | Contact sheet on a laptop | `mockups/comic-sheet-and-controls/6-sheet-laptop.png` |

## Layout

**The controls**

- One row under the page, in the order **First**, **Previous**, **Next**, **Newest**, at most 640 px wide and centred, as the old pair was.
- Each control is a bordered box at least 56 px tall, with a drawn arrowhead icon above a short caption: two arrowheads pointing left for **First**, one for **Previous**, one pointing right for **Next**, two for **Newest**, as Star asked. The icons are drawn (SVG), not typed characters, because phones draw characters like ⏭ as colourful emoji of their own.
- **Next** is the widest (1.6 times the others) and yellow, as **Next page** was, because it's used most. The others are beige.
- The captions are always visible, on phones too, where there's no hovering: "First", "Previous", "Next", "Newest". On hover or keyboard focus, the full name shows in a small label under the control: "First page", "Previous page", "Next page", "Newest page" (mock-up 4).
- A control that can't be used stays in its place, with a dashed, faded border and faded icon, so the others never move (mock-ups 2 and 3).
- On wide screens, the quiet arrows at the page's left and right edges stay, for **Previous** and **Next** (design-comic-turn-pages).

**All pages**

- In the reader bar: on a phone, at the right of the first line, beside **Back to series**, with the location line under them; on wider screens, at the right of the bar, after the location line. A bordered button with a small grid icon and the words "All pages", at least 44 px tall.

**The contact sheet**

- The site header, then a bar with **← Back to page 4** on the left and **Back to series** on the right.
- The heading: the series and chapter, "Kettle Tales · Chapter 2: The Long Road", then the number of pages, "12 pages".
- The pictures: three a row on a phone (about 110 px wide on a 390 px phone), as many as fit on wider screens (each at least 150 px). Each picture keeps the page's shape, with a thin border, and its page number under it.
- The marked picture has a thick border with a yellow inner line, and "4 · You were here" under it.
- On wider screens, the bar's two links repeat under the pictures, so a long chapter doesn't mean scrolling back up.
- Pictures are small images made for the sheet (about 300 px wide, or less on a phone), loaded as they come into view, never the full pages.

## States and errors

- **First page of the series:** **First** and **Previous** can't be used.
- **Newest page:** **Next** and **Newest** can't be used. Under the controls, the end note from design-comic-turn-pages: **You're all caught up!**, the line for the series' status, and **Back to series**.
- **A series with one page:** all four controls can't be used; the end note shows.
- **A chapter with one page:** no **All pages** in the bar, and no sheet for that page.
- **First page of a later chapter:** **Previous** goes to the last page of the chapter before, as now; **First** still goes to the series' first page.
- **A picture still loading:** its box shows the paper colour and its page number until the picture appears.
- **Keys:** the left and right arrow keys turn pages as now. Home goes to the first page and End to the newest, with the same rules as the arrow keys: not while focus is in a text field, a modifier key is held, or the page is zoomed in. Home and End do nothing on the contact sheet, where they scroll as usual.

## Accessibility

- The controls stay links (`<a href>`), in a navigation region named "Page navigation", reached with Tab in order. Their names are the full names, "First page", "Previous page", "Next page", "Newest page", not the captions, so a screen reader says what each does. The icons are hidden from screen readers.
- A control that can't be used is not a link: it's text marked `aria-disabled="true"` with the same name, so a screen reader hears "First page, dimmed" (or "unavailable") and Tab skips it.
- The full-name label on hover and focus is for sighted keyboard and mouse users; it's not announced twice.
- **All pages** is a link named "All pages in this chapter".
- On the sheet: a list of links, each named by its page number and the page's alt text, "Page 4: Rain on the road", or "Page 4" without alt text. The marked one also has `aria-current="page"`, and its "You were here" is part of its name.
- The sheet's heading is a level-one heading, so it's announced on arrival.
- Focus is visible on every control and picture (the site's focus ring), and all targets are at least 44 px; the controls are 56 px tall.

## Other documents

- **design-comic-turn-pages:** this replaces its **Previous page** and **Next page** pair (Layout, and the first-page and single-page states) with the four controls. Swipes, the edge arrows on wide screens, the arrow keys and the end note are unchanged. Its own text isn't edited, so its history stays readable; the spec for this design says which parts it replaces.
- **story-comic-reader-newest-and-share (story 3):** **Newest** is the reader's part of "go straight to the newest page". The series page's **Read the newest page** link, sharing a page, and link previews stay with story 3.
- **docs-reading-comics (the fans' guide):** its page-turning section will name the four controls and add the contact sheet; that's the next document after this design.

## For the spec to check

- Every reader page has its sheet at `<page address>/pages`, built ahead of time; a chapter with one page has none.
- The controls' order, names, captions, icons (SVG, hidden from screen readers), the full-name label on hover and focus, **Next**'s width and colour, sizes, and the unusable states (not links, `aria-disabled`, same place).
- **First** and **Newest** go to the series' first and newest pages, skipping empty chapters; Home and End do the same, with the arrow keys' rules.
- On the sheet: the order, numbers, the marked picture (`aria-current`, "You were here"), the scroll position, **← Back to page N**, picture sizes (small images, loaded lazily), three a row on a 360 or 390 px phone, link names with alt text.
- No horizontal scrolling on a 320 px phone with text at 200%, on the reader or the sheet.

## Open questions

1. **The caption under Previous.** "Previous" is the longest caption; on a 320 px phone it's tight. If it doesn't fit there, "Back" is the alternative. The spec will check, and the mock-ups use "Previous".
