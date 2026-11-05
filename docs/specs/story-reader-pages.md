---
status: draft
---

# Stories on the site

<!-- Technical spec for the reader side of epic-story-reader: story-story-reader-read-a-story,
story-story-reader-read-by-chapter and story-story-reader-find-and-share-a-story, from
design-story-reader (How it works, Page addresses, Flow: a fan, Preview, Layout, States and errors,
Accessibility) and docs-publishing-stories. The editor side is story-reader-editor (implemented). -->

## Problem

Star can now put a story's text and chapters in the editor, but fans can't read them: the Writing page only links to stories elsewhere, and AO3, where they were, is offline. This spec gives each story with text its own page on the site, with chapters, ratings, sharing and news, and lets Star preview a story and a chapter before publishing.

## User stories

- As a fan, I want to open a story from the Writing page and read it on the site in one readable column, with its title, cover and genres, so that I can read Star's writing without leaving for another site. (story-story-reader-read-a-story)
- As a fan, I want a story with chapters to show its chapter list and let me move from one chapter to the next, so that I can read a long story the way I would on AO3 and come back to the chapter I was on. (story-story-reader-read-by-chapter)
- As a fan, I want the news page and the Writing page to take me to a story on the site, and a shared link to a story or chapter to show its title and cover, so that a story I post about on social media lands readers on Star's site. (story-story-reader-find-and-share-a-story)

## Acceptance criteria

Source: S1.n, S2.n and S4.n are the nth criteria of the read-a-story, read-by-chapter and find-and-share-a-story stories; design and docs sections as named.

| # | Criterion | Verified by | Source |
|---|---|---|---|
| AC-1 | A published story has a page at `/writing/<web address>` when it has a web address and either its own **Text** or at least one published chapter with text. Other stories have no page and work as now. A chapter is shown only when it is published and has text; its page is `/writing/<story>/<chapter number>`. | test: unit "pages"; e2e "story pages" | S1.1, S1.5, S2.2, S2.5; design-story-reader#how-it-works, #page-addresses, #states-and-errors |
| AC-2 | The Writing page lists stories newest first by their latest date: the story's **Date posted** or its newest shown chapter's, whichever is later. A card for a story with a page has **Read**, and its title and cover link to the page; it shows the genres, the rating ("Rated Teen"; nothing for Not rated or no rating) and, for a story in chapters, "In progress · 3 chapters" (or "Complete · …"; "1 chapter"). A story with a page and a **Link to read it** offers **Also on AO3** (Ko-fi, Tumblr, Wattpad; "Also elsewhere" for another site). A story without a page keeps **Read it →**, opening its link. | test: unit "writing page"; e2e "writing page" | S1.1, S1.4, S1.5; design-story-reader#flow-a-fan, #how-it-works |
| AC-3 | A one-shot's page shows, in order: the title (the only `h1`), the cover, the tags (genres, rating, status), the short description, **Before you read** (AC-5), the text in an `article`, then **Back to Writing** and **Also on …** when it has a link. | test: e2e "story pages" | S1.2, S1.4; design-story-reader#flow-a-fan, #layout |
| AC-4 | Text keeps paragraphs, *italics* and **bold**, and line breaks inside a paragraph. A scene break, or a paragraph that is only symbols (the editor's rule, story-reader-editor AC-4), shows as a centred ⁂: an `<hr>` named "Scene break". Any other text is escaped; no other HTML reaches the page. | test: unit "text" | S1.3; design-story-reader#how-it-works, #accessibility, #for-the-spec-to-check |
| AC-5 | **Before you read** is a bordered region named by its heading, before the text on the story's page and on every chapter page: "Rated Teen" (General, Teen, Mature, Explicit), then the content notes as written, keeping their line breaks. With Not rated (or no rating) and no notes there's no box; with Not rated and notes it says "Not rated" and the notes. | test: unit "before you read"; e2e "story pages" | design-story-reader#layout, #how-it-works |
| AC-6 | On a Mature or Explicit story, the story's page and its chapter pages hide the text and chapter list until the fan chooses **Continue to the story**, a button in the box under "This story is rated Mature." (or Explicit). Choosing it shows the text and moves focus to its start, and the browser remembers it (`localStorage`) for every Mature or Explicit story on the site. Without scripts, the text shows under the box. | test: unit "gate"; e2e "mature" | design-story-reader#how-it-works, #flow-a-fan, #accessibility, #for-the-spec-to-check |
| AC-7 | A story in chapters shows, after the box: **Start reading** (its first chapter) and, when it is In progress with two or more chapters, **Read the newest chapter**; then an `h2` **Chapters** (`id="chapters"`) over an ordered list of its chapters, each "Chapter 2: Over the Ridge" (or "Chapter 3") linking to it, with its date. | test: unit "chapters"; e2e "story pages" | S2.1, S2.4; design-story-reader#flow-a-fan, #accessibility |
| AC-8 | A chapter page shows the story's title as a link to the story, then the chapter's label as the `h1`, **Before you read**, the text, and the same navigation above and below the text: **Previous chapter**, **Chapters** (`/writing/<story>#chapters`) and **Next chapter**, as `nav` landmarks named "Chapters" and "Chapters, end of chapter". The first chapter has no **Previous chapter**. On the newest chapter, the end shows "That's the newest chapter. More to come." in place of **Next chapter** (or "The end." when the story is Complete), and the top has no **Next chapter**. | test: unit "chapters"; e2e "chapter pages" | S2.2, S2.3; design-story-reader#flow-a-fan, #accessibility |
| AC-9 | Tab titles are "The Long Road · Writing · Kettlebird Creations" and "Chapter 2: Over the Ridge · The Long Road · Kettlebird Creations". A shared story or chapter link shows the story's title (and the chapter's label), the short description (or "The Long Road, a story by Star Goldberg."), and the cover on a paper background, or the site's logo without one, with a canonical address, as comic pages do. | test: unit "sharing"; e2e "story pages" | S4.2; design-story-reader#page-addresses, #flow-a-fan |
| AC-10 | The news page links a story with a page to its page (others as now). A chapter whose date is later than its story's **Date posted** is its own entry, "The Long Road · Chapter 3" (or "… · Chapter 3: Title"), linking to the chapter, with the story's cover. Entries are newest first, at most 20. | test: unit "news"; e2e "news" | S4.1, S4.3; design-story-reader#flow-a-fan, #for-the-spec-to-check |
| AC-11 | An address under `/writing/<story>/…` that doesn't exist, for a story that does, shows **Page not found** with **Back to The Long Road**; every Page not found also links to **Writing**. | test: unit "not found"; e2e "story pages" | S4.4; design-story-reader#states-and-errors |
| AC-12 | **Preview** on a story with a page shows the story's page (text or chapter list) with the draft in place, whatever the rating; on a story without one, the Writing page as now. **Preview** on a chapter shows its chapter page; a chapter of a story never published uses the story's draft and notes "The story isn't published yet; it's shown as it will be." A chapter with no text says "Add the chapter's text to preview it."; a story with no web address, "Add a web address so readers can find this story. The preview needs it too." The chapter's help link now sits beside **Preview**. **View on site** opens the story's page, or the chapter's, when it has one. | test: unit "preview"; e2e "preview" | design-story-reader#preview-rows-for-design-previews-table, #flow-star |
| AC-13 | The reading column is at most 65 characters wide (`65ch`), centred, 1.125rem text, line height 1.7. Story and chapter pages have no serious or critical axe issues, and don't scroll sideways at 360 px wide or at 320 px with text at 200%. | test: e2e "accessibility", "reflow" | S1.2, S1.6; design-story-reader#layout, #accessibility |
| AC-14 | No draft, and no story text from a draft, reaches the built site. The fixture build reads stories from `tests/fixtures/stories.ts`. | command: `node scripts/check-no-drafts.mjs`; test: e2e (fixture build) | epic-story-reader |
| AC-15 | A manual tutorial (`docs/tutorials/reading-stories.md`, `runner: manual`) walks through a one-shot, a story in chapters, a Mature story with and without scripts, sharing a chapter link, and the news page, with a screen reader and in reader mode. | manual: the lead | S1.6 |

## Scope

- In:
  - **Site:**
    - `src/lib/stories/model.ts` (new, pure): the story model, addresses, which stories and chapters show, labels, the card line, the latest date, **Before you read**, the gate, chapter navigation, **Also on …**, tab titles.
    - `src/lib/stories/text.ts` (new, pure): story text to HTML.
    - `src/lib/stories/sharing.ts` (new, pure): link previews, news entries, the story for a missing address.
    - `src/lib/stories/source.ts` (new): stories with their chapters from Sanity at build time, or the fixtures.
    - `src/pages/writing/[slug].astro`, `src/pages/writing/[slug]/[chapter].astro` (new); `src/components/stories/` (new): `StoryPage.astro`, `ChapterPage.astro`, `BeforeYouRead.astro`, `StoryText.astro`, `ChapterNav.astro`, `StoryGate` script.
    - `src/components/pages/WritingPage.astro` and `src/pages/writing.astro`: the cards from the story model.
    - `src/pages/news.astro`: entries from `sharing.ts`.
    - `src/components/pages/NotFoundPage.astro`: **Back to <story>** and **Writing**.
    - `src/lib/preview/` and `src/pages/preview/[kind]/[id].astro`: the story and chapter previews.
    - `tests/fixtures/stories.ts` (new), `tests/fixtures/drafts.ts`: stories and drafts for the fixture build.
  - **Editor:** `sanity-studio/lib/preview.ts` (a chapter is previewable), `lib/live-status.ts` (**View on site** for stories and chapters).
  - **Docs:** `docs/user/publishing-stories.md`: drop "Stories on the site arrive with a later update…", now that they have. `docs/tutorials/reading-stories.md` (new).
  - **Tests:** `tests/unit/stories-*.test.ts`, `tests/e2e/stories.spec.ts`.
- Out: comments, kudos or bookmarks; a reading-position memory; search; an RSS feed.

## APIs and assumptions

- Stories are read at build time like comics (`output: 'static'`); a publish starts a site build (content-editing-know-when-live), so a new story or chapter is on the site when the status says **Live**.
- The story's text is Portable Text with blocks of style `normal`, spans with `em`/`strong` marks, and `sceneBreak` objects (story-reader-editor AC-3). The site renders it with its own small function rather than a library, so nothing but those three ever reaches the page.
- `localStorage` may be unavailable (private windows, blocked storage): the gate then asks each time, and never fails to show the text after **Continue to the story**.
- Link previews use the comics' approach (`src/lib/comics/sharing.ts`): Sanity's image service for a 1200 × 630 cover on paper, or the logo.

## Non-functional requirements

- Pages are built ahead of time; no story page is made on request.
- A story page with a long text (about 100,000 words) builds and loads as one page: no script is needed to read it.

## Delivery

- Plan item: epic-story-reader, stories 1, 2 and 4, and story 3's preview rows.

## Risks and decisions

- **The gate is a convenience, not a lock.** The text is in the page so that it works without scripts and in reader mode, as the design says; the gate asks first, as AO3 does.
- **The Writing page reads the stories source**, not the old query, so cards know about chapters; the news page keeps its query for art and adds entries from the stories source.
- **A chapter's date** is its **Date posted**, filled in on first publish (story-reader-editor AC-6); a chapter with no date sorts as its story's date.
