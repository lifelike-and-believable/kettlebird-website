---
id: design-comic-start-reading
status: approved
derived-from:
  - story-comic-reader-start-reading: f51774d257cd
  - design-cms#decision: 889c200357ba
  - persona-fan#context-of-use: 38883e5abc09
---

# Start reading a series: design

<!-- docs/design/comic-start-reading.md. Design for story-comic-reader-start-reading. The user
documentation is written from this, so controls are named as they will appear. -->

## Flow

1. On **Comics** (`/comics`), the fan sees a card for each series and chooses one.
2. The series page opens at `/comics/<series>`. It shows the cover, title, status, type, and description, a **Start reading** button, and the chapter list.
3. The fan chooses **Start reading**, or a chapter in the list.
4. The page reader opens at that chapter's first page and shows the page image with a line saying where they are, for example "Chapter 2: The Long Road · Page 1 of 24".
5. **Back to series** returns to the series page.

**Release with story 2.** This story's reader shows one page and has no way forward; turning pages is story 2. The two are built separately but go live together, so fans never reach a page they cannot read past. (Until then there is no comic content in the CMS, so nothing is visible on the live site.)

## Page addresses

Each page gets a stable address now, because fans will share them and story 3 builds on them. Every series uses the same shape, with or without visible chapters, so adding a chapter later never breaks a shared link:

- `/comics/<series>/<chapter number>/<page number>`, for example `/comics/kettle-tales/2/1`, or `/comics/one-shot/1/1` for a series without visible chapters.

`<series>` is the series' **Web address**, which the editor suggests from the title when the series is created. It is required and unique, and it does not change when the title is edited later; the help text says that changing it breaks links people have shared. Chapter numbers are the numbers Star gives chapters (below); page numbers start at 1 and follow page order within the chapter.

The **Comics** listing links only to series that have a web address, so no card can lead to a missing page.

## Layout

**Series page**

- Wide screens: the cover on the left (about a third of the width), and on the right the title (main heading), then the status and type as labelled tags ("Ongoing", "Original"), the description, and **Start reading**. The **Chapters** list runs under both, full width.
- Phones: everything in one column: title, cover (no taller than a third of the screen), tags, **Start reading**, description, then **Chapters**. On a small phone (360 by 640 pixels) **Start reading** is visible without scrolling; the tests check this size.
- **Chapters** is a numbered list. Each item is one link: "Chapter 2: The Long Road", with "24 pages" beneath in smaller text. A chapter without a title reads "Chapter 2".
- The page uses the site's existing header, footer, paper texture, and series-card colours, so it reads as part of the comics section.

**Page reader (first page only, in this story)**

- A slim bar above the page: **Back to series** (left) and the location line (right, or under it on phones): "Chapter 2: The Long Road · Page 1 of 24", or "Page 1 of 12" for a series without visible chapters. The location line is the page's main heading.
- The page image as large as fits in the space below the site header and the bar: the full width on phones, and the remaining window height on wide screens, centred, never cropped.
- The page is served at a size that suits the screen, not as Star's print-resolution original, so it loads quickly on a phone connection.

## What Star enters

The comic schema changes (design-cms, "Consequences") so that the site can show chapters. No content exists yet, so nothing is migrated.

- A **Series** has its title, cover, description, type, and status, as now.
- A **Chapter** belongs to one series and has a **Number**, a **Title** (optional), and its **Pages**, in order. The editor fills in the next number for a new chapter; Star can change it, and reordering never renumbers published chapters. A chapter numbered 0 shows its title alone, for a "Prologue". The title field's help text says: "Just the name, for example The Long Road. The site adds 'Chapter 2' for you."
- Each page in a chapter is an image with its **Alt text** and its panel regions (used by the second comic epic).
- **A series without visible chapters** is a series with a single chapter that has no title. The site shows no chapter list for it. The editor's help text on a series says: "If your comic doesn't have chapters, add one chapter and leave its title empty. You can add more chapters later, and links people have shared keep working."

How Star adds chapters and many pages at once is designed with story 5 (publishing).

## States and errors

- **Series with no pages yet:** the series page shows the cover, title, tags, and description, and in place of **Start reading** and the list: "Pages coming soon." No reader link exists.
- **Chapter with no pages yet:** not shown to visitors at all, so Star can set up a chapter before its pages are ready. **Start reading** opens the first chapter that has pages.
- **Series without a cover:** the cover area shows a paper-textured panel with the series title, matching the comics page's card.
- **Page without alt text:** the editor shows a warning on the page ("Add alt text so people using screen readers can follow the story") but still lets Star publish; whether to require it is an open question in the content-editing requirements. On the site, the image's alternative text falls back to "Chapter 2, page 1", so a screen reader still says where the reader is.
- **Page still loading, or failed to load:** the space the page will fill shows the paper texture and the words "Loading page… If it doesn't appear, try refreshing." The page image covers these words once it has loaded, so this needs no script and works on a slow connection. If the image fails, the words stay visible with **Back to series** above.
- **Address that does not exist** (an unknown series, chapter, or page number): the site's "page not found" page, with a link to **Comics**.
- **Layout while loading:** the page image reserves its space, so the layout does not jump while it loads.

## Accessibility

- The series page has one main heading (the title) and a **Chapters** subheading; the chapter list is a real numbered list of links. The reader page's main heading is the location line, and the page image sits in the main content area that the site's skip link moves to.
- **Start reading** is a link styled as a button, because it goes to another page.
- Status and type are written words, never colour alone, and each is read with its label ("Status: Ongoing", "Type: Original"); the labels are visually hidden on the tags.
- Every link and button is reachable by keyboard in reading order, with the site's visible focus ring.
- The reader's browser tab title is "Chapter 2, page 1 · Kettle Tales · Kettlebird Creations", so a screen reader announces the location on arrival.
- The cover image's alternative text is empty, and the no-cover placeholder is hidden from screen readers, because the title is next to them; screen readers never read the title twice.
- Text and tags meet WCAG 2.1 AA contrast on the paper background.

## Persona walkthrough

A walkthrough for persona-fan, and for persona-artist on "What Star enters" (2026-11-01), found no blocking problems and eleven others. All were addressed above: one address shape for every series, so adding chapters never breaks shared links; stories 1 and 2 going live together; required, stable web addresses; a loading message that needs no script; fitting the page below the header; a checked phone layout; reader-page headings and labelled tags; chapter numbers Star sets, with help text so titles aren't doubled; clearer help text for series without chapters; a warning for missing alt text; and hiding empty chapters.

## Open questions

1. Should the chapter list show a thumbnail of each chapter's first page? It helps fans find a chapter by memory, at the cost of loading more images on the series page. Proposed: not in this story.
