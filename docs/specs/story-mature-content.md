---
status: implemented
tests-commit: eb914f546cd1010d813e35558e2823f188e264fd
unlocks:
  - tests/unit/story-editor.test.ts: the story's fields have Mature or explicit content (`mature`) in place of Rating, and the publish checks no longer ask for a rating (story-mature-content AC-1, AC-2), as design-story-mature-content says.
  - tests/unit/organised-editor.test.ts: the story's field texts and the "needed only sometimes" fields: Rating gives way to Mature or explicit content, which is never needed (AC-1, AC-2).
  - tests/unit/stories-model.test.ts: "Rated …" lines give way to the tag and the box's line (AC-5, AC-6).
  - tests/unit/stories-source.test.ts: the query reads `mature` too, and the model has `mature` in place of `rating` (AC-4).
  - tests/unit/stories-preview.test.ts: the draft's mature content in place of its rating (AC-8).
  - tests/unit/help.test.ts, tests/unit/story-import.test.ts: the guide's summary no longer names ratings (AC-10).
  - tests/e2e/stories.spec.ts: the cards, Before you read and the gate use the new wording (AC-5, AC-6, AC-7).
  - tests/unit/story-editor.test.ts: "keeps the stored names … shown" now lets the old `rating` be the one hidden field, as AC-1 says, until the one-off change. The criterion is unchanged.
  - tests/unit/story-mature.test.ts: AC-2's check that the editor's texts never name a rating also read editor-content.ts, whose hidden-fields list must name `rating` (AC-1); that file's texts are checked by AC-1 instead. The criteria are unchanged.
  - tests/unit/stories-edges.test.ts: its sample story is unticked (`mature: false`), as every story now says whether it's ticked (AC-4); the type check asks for it. The criteria are unchanged.
  - tests/unit/story-mature.test.ts, tests/unit/story-editor.test.ts, tests/unit/organised-editor.test.ts, tests/unit/stories-source.test.ts: the test story, the only one saved with a rating, is deleted (the lead, 2026-11-07), so the hidden `rating`, the site's fallback for it and the one-off change are removed, and AC-1, AC-3 and AC-4 say so; their checks follow.
  - tests/fixtures/stories.ts, tests/fixtures/drafts.ts: fixture stories are ticked (`mature`) or not in place of their ratings; Night Market is ticked; the draft of The Kettle's Song is ticked.
---

# Stories: mature or explicit content, in place of ratings

<!-- Technical spec for design-story-mature-content (approved 2026-11-07, with its decisions as proposed: a checkbox,
unticked by default and not required; "Mature or explicit" everywhere; General and Teen go; the test story's rating
hidden, a one-off change, and the site's fallback until it runs; the remembered Continue kept; tag colours as
today). Amends story-reader-editor (AC-1, AC-2) and story-reader-pages (AC-2, AC-3, AC-5, AC-6, AC-12). A
plan-feature spec without an id. -->

## Problem

A story has five ratings to choose from, and Star must choose one before publishing, but only one thing about the rating changes what readers see: whether the story asks before showing its text. Star asked for one checkbox instead (2026-11-07).

## User stories

- As Star, I want to tick one box for a story with mature or explicit content, so that readers are asked first without my choosing among five ratings. (design-story-mature-content#personas; story-story-reader-read-a-story)
- As a fan, I want to know before the text whether a story has mature or explicit content, and what Star's notes say, so that I can decide whether to read it. (design-story-mature-content#personas)

## Acceptance criteria

Source: design-story-mature-content sections as named. "Ticked" means the story's `mature` is true.

| # | Criterion | Verified by | Source |
|---|---|---|---|
| AC-1 | A story's form has, in this order: **Title**, **Web address**, **Short description**, **Cover**, **Genres**, **Mature or explicit content**, **Content notes**, **Status**, **Text**, **Chapters**, **Date posted**, **Link to read it**. **Mature or explicit content** is a checkbox (`mature`, a boolean, unticked on a new story) with the design's help text: "Tick it for sex scenes, graphic violence or other strong content. Readers are then asked before the text shows, and the story's card and page say so. Left unticked, readers go straight to the text. It covers the story and all its chapters." A chapter has no such field. | test: unit "fields"; manual (tutorial) | #in-the-editor |
| AC-2 | No rating is asked for: a story with text or chapters needs only its web address to be published ("Add a web address so readers can find this story."); the box of what a story still needs never lists a rating; a new story published with its first chapter needs only that too. | test: unit "publish checks" | #in-the-editor |
| AC-3 | No story is saved with a rating (the test story, the only one, is deleted: the lead, 2026-11-07), so the schema has no `rating` field, the site no fallback for one, and there's no one-off change. | test: unit "no old ratings left" | #stories-saved-with-a-rating |
| AC-4 | The site reads `mature` from Sanity; a story is ticked when it's true. The site's model has `mature` (true or false) in place of `rating`. | test: unit "source" | #on-the-site |
| AC-5 | A ticked story's Writing card and the top of its page have the tag **Mature or explicit** (the card's beige, the page's yellow, as the rating tag's colours were); an unticked story has no such tag, and no "Rated …" shows anywhere. | test: unit "tag"; e2e "tag" | #on-the-site |
| AC-6 | **Before you read**: ticked, "This story has mature or explicit content." then the content notes, if any; unticked with content notes, the notes alone; unticked without notes, no box. No "Not rated" line. | test: unit "before you read"; e2e "before you read" | #on-the-site |
| AC-7 | A ticked story's page (its text, or its chapter list) and each chapter page show **Before you read** with **Continue to the story** first, and the text when it's chosen, focus on the text; the choice is remembered in the browser's storage under `kb-continue-rated` for every ticked story, so a fan who continued before this change isn't asked again; without scripts, the text shows under the box. An unticked story opens straight to its text. | test: e2e "the gate" | #on-the-site |
| AC-8 | **Preview** of a ticked story shows the line and notes without **Continue to the story**, then the text; of an unticked story, the notes alone if any, then the text. | test: unit "preview"; e2e "preview" | #preview |
| AC-9 | The pages pass the site's accessibility check (axe), and the tag is text. | test: e2e "accessibility" | #accessibility |
| AC-10 | Star's guide `publishing-stories.md` says what the design's For the guide lists, its `summary:` is "Starting a story, uploading its text, and chapters.", and it no longer mentions ratings; the tutorials `publishing-stories.md` and `reading-stories.md` follow the checkbox. | test: unit "guide"; manual: review of the guide | #for-the-guide |

## Scope

- In:
  - `sanity-studio/lib/editor-content.ts` (the field's text), `sanity-studio/schemas/objects/writtenWork.ts` (the checkbox), `sanity-studio/lib/stories.ts` (no rating check), `story-checks.ts`, `actions/publishStory.tsx`.
  - `src/lib/stories/model.ts` (`mature`, `MATURE_TAG`, `MATURE_LINE`, `beforeYouRead`, `asksFirst`), `source.ts`; `WritingPage.astro`, `StoryPage.astro`, `BeforeYouRead.astro`, `StoryGate.astro`; the preview's stories (`src/lib/preview/load.ts`, if it names `rating`).
  - Fixtures; guides and tutorials as above.
  - Tests: `tests/unit/story-mature.test.ts`, `tests/e2e/story-mature.spec.ts`, and the unlocks above.
- Out: link previews and search engines (unchanged).

## APIs and assumptions

- No story is saved with a rating once the test story is deleted; Sanity Studio 5.1 would show an "Unknown field" warning for one.

## Non-functional requirements

- No change to page weight or scripts: the gate's script is the same.

## Delivery

- Plan item: design-story-mature-content (PR 173).
- The lead deletes the test story (2026-11-07); no one-off change is needed (AC-3).

## Risks and decisions

- The hidden `rating`, the site's fallback and the one-off change were removed once the test story was being deleted (the lead, 2026-11-07).
- New pure logic (`isMature`, `beforeYouRead`) is mutation tested.
