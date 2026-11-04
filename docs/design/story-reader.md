---
id: design-story-reader
status: approved
derived-from:
  - story-story-reader-read-a-story: 8c8226a23162
  - story-story-reader-read-by-chapter: 8d31c3859be5
  - story-story-reader-put-a-story-on-the-site: d1c236216e8c
  - story-story-reader-find-and-share-a-story: ee6200751bf0
  - epic-story-reader#outcome: 5b8ea42e2e6b
  - design-organised-editor#sections-and-fields: 20d25885468d
  - design-comic-publish-pages#flow: 954976ba8278
  - design-comic-share-and-announce#flow: 48fe43854297
  - design-preview#flow: 257ebbac18cb
  - design-help-links#states-and-errors: 87eb5e47ae2f
  - persona-fan#goals: 2b047e4cae5d
  - persona-artist#skills-and-tools: 4e28d5374320
---

# Read Star's stories on the site: design

<!-- docs/design/story-reader.md. Design for all four stories of epic-story-reader. Mock-ups are in
docs/design/mockups/story-reader/ (PNG images, and mockups.html, the source they are rendered from with
render.mjs). Checked against Sanity Studio 5.1.0 and @portabletext/block-tools 5.0.0 (the editor's
paste handling), with a trial paste of Google Docs, Word and AO3-style text (2026-11-04). Revised after
a persona walkthrough. -->

## Personas

- persona-fan: reads mostly on phones and knows AO3, where a story is one long column, chapters have Previous and Next, and the rating and warnings come before the text. The story page follows that shape, so nothing about it needs learning.
- persona-artist: Star writes in documents and posted on AO3, which is offline for the foreseeable future (lead, 2026-11-04), so the site becomes the stories' home. Star pastes text in from Google Docs or Word, chapter by chapter, the way comic chapters are added, and chooses a rating and notes as on AO3.

## Decisions from the lead

- Scrolling text, not a page-flip; chapters when a story needs them; Star pastes text in (2026-11-04).
- A story shows a rating and optional content notes, before the text and on its Writing card (2026-11-04).
- Stories rated Mature or Explicit ask before showing their text, once per browser (2026-11-04).

## How it works

- **A story with text on the site has its own page**, at `/writing/<story>`. A story without text keeps working as now: its card on the Writing page has **Read it**, which opens its **Link to read it**, and it has no page.
- **A story is one of two kinds**, decided by what Star fills in:
  - **A one-shot**: the story's own **Text**. Its page shows the text.
  - **A story in chapters**: chapters added under the story, like comic chapters under a series. Its page shows the chapter list, and each chapter has its own page at `/writing/<story>/<chapter number>`.
- **Turning a one-shot into chapters**: on a one-shot, **Add chapter** opens Chapter 1 with the story's text already in it, and the story's own **Text** becomes empty: "Your story's text is now in Chapter 1." (mock-up 7). From then on the story's **Text** is replaced by a note: "This story has chapters, so its text is in them." Nothing is lost, and the site shows the chapters once Chapter 1 is published.
- **Text keeps Star's formatting**: paragraphs, italics and bold. A **scene break** is its own block, shown in the editor as a "Scene break" bar and on the site as a centred `⁂`. Star gets one by:
  - **Scene break** in the text's toolbar;
  - typing or pasting a line with only symbols on it, such as `* * *`, `***`, `~`, `#` or `---`, which becomes a scene break when pasted or when Star leaves the line;
  - pasting a horizontal line (Word, Google Docs), which becomes a scene break instead of being dropped;
  - pasting two or more empty lines in a row (how Google Docs keeps a gap), which become one scene break.
  A single empty line between paragraphs (Google Docs adds them when pasting) is left out.
- **The rating and notes** come before the text, on the story's page and on every chapter page, in a box headed **Before you read** (below). The rating also shows on the Writing card.
- **Mature and Explicit**: the story's page and its chapter pages first show the **Before you read** box with "This story is rated Mature." and **Continue to the story**; the text appears when the fan chooses it, and the browser remembers the choice for every Mature or Explicit story on the site. Without scripts, the text shows under the box.
- **A story's status**: **In progress** or **Complete**, for stories in chapters, shown on the card and the story's page, and at the end of the newest chapter.
- **Link to read it** stays optional. On a story with text on the site, its card and page offer it as **Also on AO3** (or "Also on Ko-fi", "Also on Tumblr", "Also on Wattpad"; another site gives "Also elsewhere"). With AO3 offline, Star can remove AO3 links; the guide says so.

## Page addresses

- `/writing/<story>`: the story. `<story>` is the story's **Web address**, filled in from the title, like a series'; it doesn't change when the title does. A story made before this change gets one from its title the first time Star opens it to add text.
- `/writing/<story>/<chapter number>`: a chapter. Numbers are the ones Star gives chapters, so a chapter's address stays the same when chapters are added after it. A one-shot has no chapter addresses.
- Changing a published chapter's number, or a published story's web address, shows the comics' shared-link warning (design-comic-publish-pages mock-up 9) before publishing.
- Browser tab titles: "The Long Road · Writing · Kettlebird Creations"; "Chapter 2: Over the Ridge · The Long Road · Kettlebird Creations".

## Flow: a fan

1. On the Writing page, a story with text on the site has **Read**, and its title and cover are links to its page. Its card shows the genres, the rating and, for a story in chapters, its status and chapter count ("In progress · 3 chapters") (mock-up 1). A new chapter moves its story to the top, as if posted that day.
2. **A one-shot** opens at its page: title, cover, genres, rating, the short description, the **Before you read** box, then the text, then **Back to Writing** and, if it has one, **Also on …** (mock-ups 2 and 3).
3. **A story in chapters** opens at its page: the same top, then **Start reading** (chapter 1) and, for a story in progress with two or more chapters, **Read the newest chapter**, then **Chapters**, a numbered list with each chapter's title and date (mock-ups 4 and 9).
4. **A chapter page** shows the story's title (a link to the story) above "Chapter 2: Over the Ridge", the **Before you read** box, the text, and **Previous chapter**, **Chapters** and **Next chapter** at the top and the end. **Chapters** goes to the list on the story's page. The first chapter has no **Previous chapter**. On the newest chapter, **Next chapter** is replaced by "That's the newest chapter. More to come." for a story in progress, or "The end." for a complete one (mock-up 5).
5. **Mature or Explicit**: the fan sees the box and **Continue to the story** first (mock-up 10).
6. **Sharing**: a story or chapter link shows the story's title (and the chapter), its short description and its cover, or the site's logo without one, as comic pages do (mock-up 8).
7. **News**: a story with text links to its page; a chapter published after its story shows as its own entry, "The Long Road · Chapter 3", linking to that chapter (mock-up 8).

## Flow: Star

1. In **Writing**, Star chooses **New story** and types the **Title**; the **Web address** fills itself in (mock-up 6).
2. Star chooses a **Rating** and, if wanted, writes **Content notes**.
3. **A one-shot**: Star pastes the whole story into **Text**. Italics and bold come through; scene breaks become **Scene break** bars, so Star sees in the editor what the site will show (mock-up 6).
4. **A story in chapters**: Star chooses **Add chapter** under **Chapters**. A chapter opens beside the story with the next number filled in. Star types a **Title** if the chapter has one and pastes its text (mock-up 7). Chapters are listed in number order, each **On the site** or **Not published yet**. Star sets the story's **Status** to **Complete** when the last chapter is out.
5. **Preview** works on a story and on a chapter (design-preview, with two new rows, below).
6. Star chooses **Publish**. A new story is published with its first chapter, as a new series is. The status says when it's live; **View on site** opens the story's page, or the chapter's.
7. **Deleting a story** with chapters works as for comics: **Delete**, then "Delete The Long Road and its 3 chapters? They come off the site, and links people have shared to them stop working." (design-comic-publish-pages, mock-up 11).
8. At the top of a story, "Help: Start a new story ↗"; at the top of a chapter, "Help: Add a chapter to a story ↗" (design-help-links). These replace a story's "Help: Writing".

## Preview (rows for design-preview's table)

| What Star is editing | What the preview shows |
|---|---|
| A story | The story's page from the top: its card's details (title, cover, rating, description) as they show there, and the text or the chapter list. |
| A chapter | The chapter's page. A chapter of a story that has never been published uses the story's draft too, with "The story isn't published yet; it's shown as it will be.", as for comic chapters. |

The preview shows the text whatever the rating, with no **Continue to the story** step.

## What Star enters

**Writing** (a story) (mock-up 6), every field, in order:

| Field | Help text | Required |
|---|---|---|
| Title | The story's title. | Yes |
| Web address | It's the last part of the story's link: kettlebird.com/writing/the-kettles-song. Filled in from the title. Changing it after people have shared links breaks them. | Yes, once the story has text or chapters |
| Short description | A sentence or two, shown on the Writing page and when the story is shared. | |
| Cover | Shown beside the story on the Writing page and at the top of its page. | |
| Genres | Shown as tags. Type one, then press Enter. | |
| Rating | Shown before the story and on the Writing page. Mature and Explicit stories ask readers before showing the text. | Yes, once the story has text or chapters |
| Content notes | Anything a reader should know before starting, such as "Mild violence". Shown before the story. | |
| Status | For a story in chapters: In progress or Complete. | |
| Text | For a one-shot: paste or type the whole story. For a story in chapters, add chapters instead. | |
| Chapters | For a story in chapters. Each chapter has its own page. | |
| Date posted | The Writing page shows newest first. | |
| Link to read it | Optional: the story somewhere else, such as AO3. Without text on the site, the Writing page's Read it opens it; with text, it's shown as "Also on AO3". | |

**A chapter** (mock-up 7), opened beside its story:

| Field | Help text | Required |
|---|---|---|
| Chapter | Its number. Changing it after people have shared links breaks them. | Yes, unique in the story |
| Title | Optional, like "Over the Ridge". Without one, it's "Chapter 3". | |
| Text | Paste or type the chapter. | Yes |
| Date posted | Shown in the chapter list and on the news page. Filled in when it's first published. | |

The **Text** toolbar has **Italic**, **Bold** and **Scene break**, and nothing else (no headings, lists or links), so pasted text can't bring in formatting the site doesn't show.

## Layout

- **The reading column**: at most about 65 characters wide, centred, 1.125rem text with generous line spacing, in the site's body font, on the paper background. On a phone, 16px from each edge, and no sideways scrolling.
- **The top of a story page** (mock-ups 2 to 4 and 9): on a computer, cover on the left (the series page's size), and title, tags (genres, rating, status) and the short description on the right. On a phone, title first, then a small cover beside the tags and description.
- **Before you read**: a bordered box before the text, headed **Before you read**, then "Rated Teen" and, on the next line, the content notes as Star wrote them. With **Not rated** and no notes there's no box; with **Not rated** and notes, the box says "Not rated" and the notes.
- **Scene breaks**: `⁂`, centred, with space above and below.
- **Chapter navigation**: buttons in the site's style; at the top, small, in one row; at the end, full width on a phone and in a row on a computer. Both have the same names.
- **A chapter without a title** is "Chapter 3" everywhere: its page, the list, the news page and the link preview.

## States and errors

| Situation | What happens |
|---|---|
| **Add chapter** on a one-shot | Chapter 1 opens with the story's text in it; "Your story's text is now in Chapter 1." (mock-up 7). |
| A story with chapters | **Text** is replaced by "This story has chapters, so its text is in them. To make it a one-shot again, move the text back and remove the chapters." |
| A story with text or chapters has no web address or rating | **Publish** can't be pressed: "Add a web address so readers can find this story." / "Choose a rating, or Not rated." |
| Two chapters share a number | "Chapter 2 already exists in this story. Choose another number." |
| A chapter with no text | **Publish** can't be pressed: "Add the chapter's text." |
| A published chapter's number, or a story's web address, changes | The shared-link warning before publishing. |
| A chapter isn't published yet | It isn't in the list or the navigation on the site; Previous and Next skip it. |
| A story with chapters is deleted | The comics' delete confirmation, naming its chapters. |
| An address for a missing story or chapter | **Page not found**, with **Back to <story>** when the story exists, and **Writing**; Page not found's built-in list includes stories, as it includes comics. |
| A pasted table, image or heading | Kept as plain paragraphs of its text; images are left out. The guide says so. |

## Accessibility

- One `h1`: the story's title, or on a chapter page the chapter's title, with the story's name above it as a link. The chapter list is a list under an `h2` **Chapters** (`id="chapters"`).
- **Before you read** is a region named by its heading. **Continue to the story** is a button that reveals the text and moves focus to its start.
- Scene breaks are `<hr>` elements named "Scene break".
- Chapter navigation is a `nav` named "Chapters" at the top and "Chapters, end of chapter" at the end, with the same link names in both.
- The page passes axe, works at 200% text and 360px wide, and keeps working in the browser's reader mode (the text is in `main`, in an `article`).

## Mock-ups

| # | Shows | File |
|---|---|---|
| 1 | The Writing page: a story in chapters (Read, rating, status), a one-shot, and a story only elsewhere | `mockups/story-reader/1-writing-page.png` |
| 2 | A one-shot on a phone: top of the page, Before you read, the first paragraphs | `mockups/story-reader/2-one-shot-phone.png` |
| 3 | The same one-shot on a computer: a scene break and the end of the story | `mockups/story-reader/3-one-shot-computer.png` |
| 4 | A story in chapters on a computer: Start reading, Read the newest chapter, the chapter list | `mockups/story-reader/4-chapters.png` |
| 5 | A chapter on a phone: navigation at the top and the end, the newest chapter of a story in progress | `mockups/story-reader/5-chapter-phone.png` |
| 6 | The editor: a one-shot, every field, with pasted Text and a scene break | `mockups/story-reader/6-editor-one-shot.png` |
| 7 | The editor: Add chapter on a one-shot, Chapter 1 open beside the story with the text moved in | `mockups/story-reader/7-editor-chapter.png` |
| 8 | A shared chapter link, and the news page's entries for a story and a chapter | `mockups/story-reader/8-share-and-news.png` |
| 9 | A story in chapters on a phone: the top and the chapter list | `mockups/story-reader/9-chapters-phone.png` |
| 10 | A Mature story on a phone: Before you read and Continue to the story | `mockups/story-reader/10-mature-phone.png` |

## For the guide

A new guide, **Putting stories on the site** (`docs/user/publishing-stories.md`), joins the online help (CLAUDE.md, lead 2026-11-03):
- summary: "Starting a story, pasting its text, chapters, and ratings.";
- in `GUIDE_NAMES` and the **Help** menu after **Publishing comic pages and chapters**;
- sections including **Start a new story** (the story's help link) and **Add a chapter to a story** (the chapter's), plus pasting, scene breaks, ratings and notes, turning a one-shot into chapters, and removing dead AO3 links.

The editing guide's **Writing** section points to it, and its "Help: Writing" link for stories is replaced as above.

## For the spec to check

- The paste and typing rules that make scene breaks (horizontal lines, symbol-only lines, runs of two or more empty lines), against block-tools 5.0.0; the trial showed `<hr>` is otherwise dropped and empty lines are kept as empty blocks.
- Which symbol-only lines count: three or more characters, all from `*`, `~`, `-`, `#`, `=`, `•`, `·` and spaces, or a single `~`, `#` or `⁂`. The site applies the same rule, in case any slip through.
- The story's existing hidden `content` field becomes **Text**; nothing entered in it is lost.
- Remembering **Continue to the story** in the browser, and the page without scripts.
- The Writing page's order with chapters (a story's latest date), and the news page with chapters mixed in.
