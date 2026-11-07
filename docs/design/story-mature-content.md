---
id: design-story-mature-content
status: draft
derived-from:
  - story-story-reader-read-a-story: 8c8226a23162
  - story-story-reader-put-a-story-on-the-site: d1c236216e8c
  - design-story-reader#what-star-enters: cb3b54ba7c25
  - design-story-reader#layout: 97cf455208c8
  - design-story-reader#flow-a-fan: 7ec1e88c8148
  - design-story-reader#flow-star: 8f4a733f5f05
  - persona-artist#goals: f3044c738f84
  - persona-fan#goals: 2b047e4cae5d
---

# Mature or explicit content, in place of ratings: design

<!-- docs/design/story-mature-content.md. A design amendment from a change request by Star (2026-11-07): replace
the story's ratings with a single "mature/explicit content" checkbox. Mock-ups are in
docs/design/mockups/story-mature-content/: PNG images, mockups.html (their source, in the style of the story
reader's mock-ups) and render.mjs. -->

## Personas

- persona-artist: Star asked for this (2026-11-07). Five ratings is a choice to make on every story, and the only one that changes what readers see is whether the story asks before showing its text. One checkbox asks the one question that matters.
- persona-fan: still sees, before the text, whether a story has mature or explicit content and what Star's notes say, and is still asked before such a story's text shows.

## The change

This amends design-story-reader, "What Star enters", "Layout", "Flow: a fan", "Flow: Star", "Preview" and "States and errors": a story's **Rating** (General, Teen, Mature, Explicit or Not rated) is replaced by one checkbox.

### In the editor (mock-up 1)

- **Mature or explicit content**, a checkbox where **Rating** was, between **Genres** and **Content notes**. Stored as a yes or no (`mature`); unticked on a new story.
- Its help text: "Tick it for strong violence, sex or themes. It covers the story and all its chapters. Readers are asked before the text shows, and the story's card and page say so."
- It's set on the story only: a chapter has no box of its own, and its page follows the story.
- It isn't required: an unticked story is a story without mature or explicit content. The publish check "Choose a rating, or Not rated." goes, and so does "a rating" in the box listing what a story still needs.
- **Content notes** stay as they are; their help text says where they show now: "Anything a reader should know before starting, such as "Mild violence". Shown before the story."

### On the site (mock-ups 2, 3 and 4)

- **Ticked**:
  - the story's Writing card and the top of its page have a tag, **Mature/explicit**, in the yellow the rating tag has today;
  - the story's page and each chapter page show **Before you read** with "This story has mature or explicit content.", the content notes under it if there are any, and **Continue to the story**. The text (or the chapter list) shows when the fan chooses it, and the browser remembers, for every such story on the site, as Mature and Explicit stories do today (the same remembered choice, so a fan who has already continued isn't asked again). Without scripts, the text shows under the box, as now.
- **Unticked**:
  - no tag;
  - with content notes, **Before you read** shows the notes alone (no line above them);
  - without content notes, no box: the text starts after the short description.
- **Preview** shows the text whether the box is ticked or not, with no **Continue to the story** step, as now.
- Search engines and link previews get nothing new: a shared link shows the title, short description and cover, as now.

### Stories saved with a rating

No stories are on the site yet except one test story, which the lead will upload again (2026-11-07). So nothing is carried over in the editor: the old **Rating** field goes, and a story saved with a rating shows the checkbox unticked until Star ticks it.

To be safe while that test story is still there, the site treats a story whose saved rating is Mature or Explicit as ticked, so its gate can't drop away on the day the change ships. A story saved with General, Teen or Not rated shows no tag and no rating line. When the change ships, the lead or Star ticks the box on the test story if it's still there, so the editor and the site agree. The spec removes the safety net (and the stored ratings) once no story has one.

## Where it applies

| # | Where | After |
|---|---|---|
| 1 | The story's fields (`sanity-studio/schemas/objects/writtenWork.ts`, `sanity-studio/lib/editor-content.ts`) | **Mature or explicit content** (`mature`, a boolean) in place of **Rating**, with the help text above. |
| 2 | The story's publish checks (`sanity-studio/lib/stories.ts`, `story-checks.ts`, `actions/publishStory.tsx`) | No rating check or message; the "still needs" box no longer lists a rating. |
| 3 | The site's stories (`src/lib/stories/source.ts`, `model.ts`) | `mature` read from Sanity (and an old Mature or Explicit rating counted as ticked); the tag, the box's line and the gate from it. |
| 4 | The Writing card and story page (`WritingPage.astro`, `StoryPage.astro`) | The **Mature/explicit** tag in place of "Rated …". |
| 5 | **Before you read** (`BeforeYouRead.astro`) | The ticked line and **Continue to the story**; the notes alone when unticked; no box without notes. |
| 6 | Star's guide `publishing-stories.md` and the tutorials | As For the guide says. |

## Mock-ups

Low-fidelity, in the style of the story reader's mock-ups. Source: `mockups/story-mature-content/mockups.html`.

| # | What it shows | File |
|---|---|---|
| 1 | The editor: a story's fields, with **Mature or explicit content** in place of **Rating** | `mockups/story-mature-content/1-editor.png` |
| 2 | The Writing page's card and the top of the story's page, with the **Mature/explicit** tag | `mockups/story-mature-content/2-card-and-page.png` |
| 3 | A ticked story's chapter on a phone: **Before you read** and **Continue to the story** | `mockups/story-mature-content/3-ticked-phone.png` |
| 4 | An unticked story with content notes on a phone: the notes alone | `mockups/story-mature-content/4-unticked-notes-phone.png` |

## States and errors

| Situation | What happens |
|---|---|
| A new story | The box is unticked. |
| Ticked | The tag on the card and page; **Before you read** with the line, any notes, and **Continue to the story**. |
| Ticked, the fan has continued on another such story | The text shows straight away. |
| Ticked, without scripts | The box, then the text under it. |
| Unticked, with content notes | **Before you read** with the notes only. |
| Unticked, no content notes | No box, no tag. |
| A story saved with a Mature or Explicit rating (the test story) | The site treats it as ticked; the editor shows the box unticked until Star ticks it or uploads the story again. |
| Publishing a story with text or chapters | Only the web address is checked, as before; the rating check is gone. |
| Preview | The text, ticked or not. |

## Accessibility

- **Mature or explicit content** is a labelled checkbox, reached with Tab and set with Space, its help text tied to it as the other fields' are.
- On the site, the tag is text, not only colour. **Before you read** stays a region named by its heading; "This story has mature or explicit content." is its first line, read before the button; **Continue to the story** is a button, and focus moves to the start of the text when it's chosen, as now.

## For the guide

Star's guide `publishing-stories.md` (not changed in this pull request):
- `summary:` "Starting a story, pasting its text, chapters, and ratings." loses "ratings" (or, once the Word upload's guide changes land, "Starting a story, uploading its text, and chapters."); it's an existing guide, so the help menu needs nothing new.
- "Start a new story" step 3 becomes "If the story has strong violence, sex or themes, tick **Mature or explicit content**. Readers are asked before the text shows, and the Writing page says so."; step 4's "It shows under the rating." becomes "It shows before the story."
- The paragraph after the steps: a ticked story asks readers first (they see "This story has mature or explicit content.", your notes, and **Continue to the story**); unticked stories open straight to the text.
- "Ratings and content notes" becomes "Mature content and content notes": the table of ratings goes; what to tick it for, and that content notes show before the story whether it's ticked or not; for milder things a reader may want to know (some violence, swearing), write them in **Content notes**, since there's no Teen rating any more.
- "Check it, then publish": "The preview shows the text whatever the rating." becomes "The preview shows the text, ticked or not."
- "If something goes wrong": the row for "Choose a rating, or Not rated." goes.

Elsewhere:
- `docs/tutorials/publishing-stories.md` steps 2, 5 and 11, and `docs/tutorials/reading-stories.md` (its set-up, steps 1, 2, 8 and 9, and the derived-from line naming the guide's "Ratings and content notes" section) say "Rating", "Rated Teen" and "rated Mature"; they follow the checkbox.
- design-story-import's "On the site" says "Mature and Explicit stories keep their text, pictures included, hidden until **Continue to the story**"; it reads as "stories marked mature or explicit" for the spec.

## For the spec to check

- The field: label, help text, place, stored as `mature`, unticked by default, not required; **Rating** gone from the form.
- The publish checks: no rating message; a story with text or chapters and a web address can be published unticked.
- The site, ticked: the tag on the card and page; the box's line, notes and **Continue to the story**; the remembered choice shared with today's; without scripts, the text under the box; on a story's page and its chapter pages.
- The site, unticked: no tag; the notes alone in the box; no box without notes.
- A story saved with a Mature or Explicit rating counts as ticked; General, Teen and Not rated show nothing.
- Preview shows the text, ticked or not.
- Tests whose names or texts change (the story editor, organised editor, help, source, model, preview and e2e stories tests) recorded under `unlocks:`.

## Decisions at review

Proposed, for the lead to confirm or change:
1. The field is **Mature or explicit content**, a checkbox, unticked by default and not required.
2. The tag reads **Mature/explicit**, Star's own words. Screen readers say it as "Mature slash explicit". (Other wordings: "Mature or explicit", "Mature", "18+".)
3. The box's line reads "This story has mature or explicit content."
4. Unticked stories show no tag and no rating line; content notes alone still show in **Before you read**.
5. A story saved with a Mature or Explicit rating counts as ticked on the site until no story has one, so the test story can't lose its gate. The simpler choice, dropping old ratings at once, is safe only if the test story is unpublished or uploaded again before the change ships.
6. A fan who continued on a Mature or Explicit story before the change isn't asked again on that browser.

## Persona walkthrough

One walkthrough, 2026-11-07, for persona-artist and persona-fan, read against design-story-reader, Star's guide `publishing-stories.md`, the fans' tutorial, and the site's and editor's code (`BeforeYouRead.astro`, `StoryGate.astro`, `lib/stories/model.ts`, `writtenWork.ts`). Nothing blocking. Addressed above:
- **Misleading, for Star:**
  - whether a chapter needs its own box (now: the help text says the box covers all the story's chapters, and chapters have none);
  - the test story showing the box unticked in the editor while the site still asks (now: the lead or Star ticks it when the change ships; the States table says what each shows meanwhile);
  - with General and Teen gone, where to warn about milder things (now: the guide points to **Content notes**, which show whether the box is ticked or not).
- **Misleading, for fans:**
  - a story that was "Rated Teen" now shows nothing above its text unless it has notes; fans who know AO3 lose that hint (accepted as Star's choice; the guide asks Star to use content notes for it);
  - "Mature/explicit" is read as "Mature slash explicit" by screen readers (understandable; another wording is listed under Decisions).
- **Unchanged and checked:** a fan who has continued once isn't asked again on that browser, for any such story, as today; without scripts the text shows under the box; preview never asks.
