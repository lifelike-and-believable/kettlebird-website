---
id: design-story-reader
status: draft
derived-from:
  - story-story-reader-read-a-story: 8c8226a23162
  - story-story-reader-read-by-chapter: 8d31c3859be5
  - story-story-reader-put-a-story-on-the-site: cbb4a5ee657e
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
paste handling), with a trial paste of Google Docs, Word and AO3-style text (2026-11-04). -->

## Personas

- persona-fan: reads mostly on phones and knows AO3, where a story is one long column, chapters have Previous and Next, and the rating and warnings come before the text. The story page follows that shape, so nothing about it needs learning.
- persona-artist: Star writes in documents and on AO3, which is offline for the foreseeable future (lead, 2026-11-04), so the site becomes the stories' home. Star pastes text in, chapter by chapter, the way comic chapters are added, and chooses a rating and notes as on AO3.

## Decisions from the lead

- Scrolling text, not a page-flip; chapters when a story needs them; Star pastes text in (2026-11-04).
- A story shows a rating and optional content notes, above the text and on its Writing card (2026-11-04).

## How it works

- **A story with text on the site has its own page**, at `/writing/<story>`. A story without text keeps working as now: its card on the Writing page links to its **Link to read it**, and it has no page.
- **A story is one of two kinds**, decided by what Star fills in:
  - **A one-shot**: the story's own **Text**. Its page shows the text.
  - **A story in chapters**: chapters added under the story, like comic chapters under a series. Its page shows the chapter list, and each chapter has its own page at `/writing/<story>/<chapter number>`.
  A story can't have both: if it has chapters, its own **Text** is hidden in the editor, and the item says so.
- **Text keeps Star's formatting**: paragraphs, italics and bold. A scene break is a line on its own, shown on the site as a centred `⁂`:
  - a line Star types with only symbols on it, such as `* * *`, `***`, `~` or `---`;
  - a horizontal line in pasted text (Word, AO3), which the editor turns into a scene break instead of dropping it;
  - **Scene break**, a button in the text's toolbar.
  Empty paragraphs (Google Docs adds them between paragraphs when pasting) are left out on the site.
- **The rating and content notes** come before the text, on the story's page and on every chapter page, in a box headed with the rating. The rating also shows on the Writing card.
- **Link to read it** becomes optional extra: when a story has text on the site, its card and page offer it as **Also on AO3** (the link's site name, or "Also elsewhere" for other sites), below the main way in. AO3 being offline doesn't break anything on the site; the link is Star's to remove.

## Page addresses

- `/writing/<story>`: the story. `<story>` is the story's **Web address**, suggested from the title when the story is created, like a series'; it doesn't change when the title does.
- `/writing/<story>/<chapter number>`: a chapter, for stories in chapters. Numbers are the ones Star gives chapters, so a chapter's address stays the same when chapters are added after it.
- A one-shot has no chapter addresses; `/writing/<story>/1` for a one-shot shows **Page not found**.

## Flow: a fan

1. On the Writing page, a story with text on the site has **Read**, and its title and cover are links to its page. Its card shows the rating beside the genres (mock-up 1).
2. **A one-shot** opens at its page: title, cover, genres and rating, the short description, then the rating and notes box, then the text, then **Back to Writing** and, if it has one, **Also on AO3** (mock-ups 2 and 3).
3. **A story in chapters** opens at its page: the same top, then **Chapters**, a numbered list with each chapter's title and date, then **Start reading** (chapter 1) (mock-up 4).
4. **A chapter page** shows the story's title (a link to the story), "Chapter 2: The Long Road", the rating and notes box, the text, and at the end **Previous chapter**, **Chapters** and **Next chapter**. The same three are at the top, small. The first chapter has no **Previous chapter**; the last has no **Next chapter**, and says "That's the newest chapter." instead (mock-up 5).
5. **Sharing**: a story or chapter link shows the story's title (and "Chapter 2: The Long Road"), its short description and its cover, as comic pages do (mock-up 8).
6. **News**: a story with text links to its page; a chapter published after its story shows as its own entry, "Kettle Tales · Chapter 3", linking to that chapter (mock-up 8).

## Flow: Star

1. In **Writing**, Star chooses **New story** and types the **Title**; the **Web address** fills itself in (mock-up 6).
2. Star chooses a **Rating** and, if wanted, writes **Content notes**.
3. **A one-shot**: Star pastes the whole story into **Text**. Italics and bold come through; a horizontal line becomes a scene break; `* * *` lines show as scene breaks on the site. **Scene break** in the toolbar adds one (mock-up 6).
4. **A story in chapters**: Star chooses **Add chapter** under **Chapters**. A chapter opens beside the story with the next number filled in. Star types a **Title** if the chapter has one and pastes its text into **Text** (mock-up 7). Chapters are listed in number order, each **On the site** or **Not published yet**, as comic chapters are.
5. **Preview** works on a story and on a chapter: the story's page, or the chapter's page (design-preview, extended to the two new kinds).
6. Star chooses **Publish**. A new story is published with its first chapter, as a new series is. The status says when it's live; **View on site** opens the story's page, or the chapter's.
7. "Help: Put a story on the site" at the top of a story and of a chapter opens Star's guide to stories in the online help (design-help-links).

## What Star enters

**Writing** (a story) (mock-up 6): the organised editor's fields, with these changes, in this order:

| Field | Help text | Required |
|---|---|---|
| Title | The story's title. | Yes |
| Web address | The end of the story's link, like /writing/the-long-road. Filled in from the title; changing it later breaks links people have shared. | Yes, once the story has text or chapters |
| Short description | A sentence or two, shown on the Writing page and when the story is shared. | |
| Cover | Shown beside the story on the Writing page and at the top of its page. | |
| Genres | Shown as tags. | |
| Rating | General, Teen, Mature, Explicit, or Not rated. Shown before the story and on the Writing page. | Yes, once the story has text or chapters |
| Content notes | Anything a reader should know before starting, such as "Mild violence". Shown before the story. | |
| Text | For a one-shot: paste or type the whole story. Leave empty for a story in chapters. | |
| Chapters | For a story in chapters. Each chapter has its own page. | |
| Date posted | The Writing page shows newest first. | |
| Link to read it | Optional: the story elsewhere, such as on AO3. Shown as "Also on AO3". | |

**A chapter** (mock-up 7), opened beside its story:

| Field | Help text | Required |
|---|---|---|
| Chapter | Its number. Changing it later breaks links people have shared. | Yes, unique in the story |
| Title | Optional, like "The Long Road". | |
| Text | Paste or type the chapter. | Yes |
| Date posted | Shown in the chapter list and on the news page. Filled in when first published. | |

The **Text** field's toolbar has **Italic**, **Bold** and **Scene break**, and nothing else (no headings, lists or links), so pasted text can't bring in formatting the site doesn't show.

## Layout

- **The reading column**: at most about 65 characters wide, centred, 1.125rem text with generous line spacing, in the site's body font, on the paper background. On a phone, 16px from each edge, and no sideways scrolling.
- **The top of a story page** (mock-ups 2 to 4): on a computer, cover on the left (the series page's size), title, genres and rating tags, and the short description on the right. On a phone, title first, then a small cover, tags and description, then the text, so the first words of the story are on the first screen when there's no cover.
- **The rating and notes box**: a bordered box before the text: "Rated Teen" on its first line, then the notes. With "Not rated" and no notes, there's no box.
- **Scene breaks**: `⁂`, centred, with space above and below; screen readers hear "Scene break".
- **Chapter navigation**: buttons in the site's style (the reader's **Previous**/**Next** look), full width on a phone, a row on a computer.

## States and errors

| Situation | What happens |
|---|---|
| A story has text and chapters | The editor hides **Text** and says "This story has chapters, so its text is in them. To make it a one-shot, remove its chapters." The site shows the chapters. |
| A story with text or chapters has no web address or rating | **Publish** can't be pressed, with the field's message ("Add a web address so readers can find this story." / "Choose a rating, or Not rated."). |
| Two chapters share a number | "Chapter 2 already exists in this story. Choose another number.", as for comics. |
| A chapter with no text | **Publish** can't be pressed: "Add the chapter's text." |
| A chapter isn't published yet | It isn't in the list or the navigation on the site; Previous and Next skip it. |
| An address for a missing story or chapter | **Page not found**, with **Back to <story>** when the story exists, and **Writing** (as design-comic-share-and-announce does for comics). |
| A pasted table, image or heading | Kept as plain paragraphs of its text; images are left out. The guide says so. |

## Accessibility

- One `h1` (the story's title, or on a chapter page the chapter's title with the story's name above it as a link), with the chapter list as a list and its heading an `h2`.
- The rating and notes box is a region named "Before you read".
- Scene breaks are `<hr>` elements, named "Scene break".
- Chapter navigation is a `nav` named "Chapters"; it's the same at the top and bottom, so the bottom one is named "Chapters, end of chapter".
- The page passes axe, works at 200% text and 360px wide, and keeps working in the browser's reader mode (the text is in `main`, in an `article`).

## Mock-ups

| # | Shows | File |
|---|---|---|
| 1 | The Writing page: a story on the site (Read, rating) and one only elsewhere | `mockups/story-reader/1-writing-page.png` |
| 2 | A one-shot on a phone: top of the page, the rating and notes box, the first paragraphs | `mockups/story-reader/2-one-shot-phone.png` |
| 3 | A one-shot on a computer, with a scene break and the end of the story | `mockups/story-reader/3-one-shot-computer.png` |
| 4 | A story in chapters: its page with the chapter list | `mockups/story-reader/4-chapters.png` |
| 5 | A chapter on a phone: navigation at the top and the end | `mockups/story-reader/5-chapter-phone.png` |
| 6 | The editor: a one-shot, with Rating, Content notes and pasted Text | `mockups/story-reader/6-editor-one-shot.png` |
| 7 | The editor: a chapter open beside its story, with the Chapters list | `mockups/story-reader/7-editor-chapter.png` |
| 8 | A shared chapter link, and the news page's entries for a story and a chapter | `mockups/story-reader/8-share-and-news.png` |

## For the guide

A new guide, **Putting stories on the site** (`docs/user/publishing-stories.md`), joins the online help (CLAUDE.md, lead 2026-11-03), with the item links for stories and chapters. The editing guide's **Writing** section points to it. It covers pasting from a document, scene breaks, ratings and notes, chapters, and what pasting leaves out.

## For the spec to check

- The paste rule that turns a horizontal line into a scene break, against block-tools 5.0.0 (the trial showed `<hr>` is otherwise dropped).
- Which symbol-only lines count as scene breaks: at least three characters, all from `*`, `~`, `-`, `#`, `=`, `•`, `·` and spaces, or the single characters `~`, `#` and `⁂`.
- The story's existing hidden `content` field becomes **Text**; nothing entered in it is lost.
- Chapter dates and the news page's ordering with chapters mixed in.
