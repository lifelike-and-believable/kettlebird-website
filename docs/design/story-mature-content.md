---
id: design-story-mature-content
status: approved
derived-from:
  - story-story-reader-read-a-story: 6529740e68b4
  - story-story-reader-put-a-story-on-the-site: 4b2793fd6e8a
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

This amends design-story-reader, "What Star enters", "Layout", "Flow: a fan", "Flow: Star", "Preview" and "States and errors": a story's **Rating** (General, Teen, Mature, Explicit or Not rated) is replaced by one checkbox. One wording is used everywhere: **Mature or explicit**.

### In the editor (mock-up 1)

- **Mature or explicit content**, a checkbox where **Rating** was, between **Genres** and **Content notes**. Stored as a yes or no (`mature`); unticked on a new story.
- Its help text: "Tick it for sex scenes, graphic violence or other strong content. Readers are then asked before the text shows, and the story's card and page say so. Left unticked, readers go straight to the text. It covers the story and all its chapters."
- It's set on the story only: a chapter has no box of its own, and its page follows the story.
- It isn't required (Decisions, 3): unticked means readers aren't asked. The publish check "Choose a rating, or Not rated." goes, and so does "a rating" in the box listing what a story still needs.
- **Content notes** stay as they are; their help text says where they show now: "Anything a reader should know before starting, such as "Mild violence". Shown before the story."
- The rule of thumb, for the guide: tick the box for what would have been Mature or Explicit on AO3 (sex scenes, graphic violence, strong themes); write **Content notes** for anything else a reader may want to know first (some violence, swearing, a scary scene), ticked or not.

### On the site (mock-ups 2, 3, 4 and 6)

- **Ticked**:
  - the story's Writing card and the top of its page have a tag, **Mature or explicit**, in the colours the rating tag has today: beige on the Writing card, yellow on the story's page;
  - the story's page and each chapter page show **Before you read** with "This story has mature or explicit content.", the content notes under it if there are any, and **Continue to the story**. The text, or the chapter list, shows when the fan chooses it (mock-up 6 shows a story page with its chapter list hidden).
  - The browser remembers the choice for every ticked story on the site, as it does today for Mature and Explicit stories. It's the same remembered choice (`kb-continue-rated` in the browser's storage, kept as it is), so a fan who continued on a Mature or Explicit story before the change isn't asked again on that browser, and one Continue covers every ticked story after it.
  - Without scripts, the text shows under the box, as now.
- **Unticked**:
  - no tag;
  - with content notes, **Before you read** shows the notes alone (the "Not rated" line goes);
  - without content notes, no box: the text starts after the short description.
- Link previews and search engines carry no mature flag, as today: a shared link shows the title, short description and cover. That's unchanged by this design.

### Preview (mock-up 5)

**Preview** shows the text whether the box is ticked or not, with no **Continue to the story** step, as now. On a ticked story, **Before you read** shows "This story has mature or explicit content." and the notes, without the button, so Star sees the line readers will see; unticked, the notes alone, as on the site.

### Stories saved with a rating

No stories are on the site yet except one test story, which the lead will upload again (2026-11-07). Until it's gone, it still has a saved `rating` (such as `mature`), and two things would go wrong if the field were simply removed: the editor would show an "Unknown field" warning for it, and the editor's box would show unticked while the site still asks.

So:

- `rating` stays in the story's schema as a hidden field, so the editor shows no warning for it, and nothing shows it to Star.
- The build includes a one-off change, run once when it ships: on every story whose `rating` is `mature` or `explicit`, it ticks **Mature or explicit content**; on every story, it removes `rating`. After it, the editor and the site agree.
- Until it has run, the site counts a saved Mature or Explicit rating as ticked, so the gate can't drop away on the day the change ships. A saved General, Teen or Not rated shows no tag and no line.
- Once no story has a `rating`, a later change removes the hidden field and the site's fallback.

## Where it applies

| #   | Where                                                                                                      | After                                                                                                                                                                                                                                                    |
| --- | ---------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | The story's fields (`sanity-studio/schemas/objects/writtenWork.ts`, `sanity-studio/lib/editor-content.ts`) | **Mature or explicit content** (`mature`, a boolean) in place of **Rating**, with the help text above; `rating` kept as a hidden field.                                                                                                                  |
| 2   | The story's publish checks (`sanity-studio/lib/stories.ts`, `story-checks.ts`, `actions/publishStory.tsx`) | No rating check or message; the "still needs" box no longer lists a rating.                                                                                                                                                                              |
| 3   | The one-off change (a Sanity migration in `sanity-studio/migrations/`)                                     | Ticks the box where `rating` is Mature or Explicit, and removes `rating`.                                                                                                                                                                                |
| 4   | The site's stories (`src/lib/stories/source.ts`, `model.ts`)                                               | `mature` read from Sanity, with a saved Mature or Explicit rating counted as ticked; the tag, the box's line and the gate from it. `beforeYouRead` drops the "Not rated" line; `ratingLine`, `gateLine` and `RATING_TITLES` give way to the one wording. |
| 5   | The Writing card and story page (`WritingPage.astro`, `StoryPage.astro`)                                   | The **Mature or explicit** tag in place of "Rated …", in the same colours.                                                                                                                                                                               |
| 6   | **Before you read** (`BeforeYouRead.astro`) and the gate (`StoryGate.astro`)                               | The ticked line, with **Continue to the story** outside preview; the notes alone when unticked; no box without notes. Both files' comments say "ticked" where they say "Mature or Explicit"; the storage key is kept.                                    |
| 7   | Star's guide `publishing-stories.md` and the tutorials                                                     | As For the guide says.                                                                                                                                                                                                                                   |

## Mock-ups

Low-fidelity, in the style of the story reader's mock-ups. Source: `mockups/story-mature-content/mockups.html`.

| #   | What it shows                                                                            | File                                                         |
| --- | ---------------------------------------------------------------------------------------- | ------------------------------------------------------------ |
| 1   | The editor: a story's fields, with **Mature or explicit content** in place of **Rating** | `mockups/story-mature-content/1-editor.png`                  |
| 2   | The Writing page's card (beige tag) and the top of the story's page (yellow tag)         | `mockups/story-mature-content/2-card-and-page.png`           |
| 3   | A ticked story's chapter on a phone: **Before you read** and **Continue to the story**   | `mockups/story-mature-content/3-ticked-phone.png`            |
| 4   | An unticked story with content notes on a phone: the notes alone                         | `mockups/story-mature-content/4-unticked-notes-phone.png`    |
| 5   | Preview of a ticked story: the line and notes, no button, the text                       | `mockups/story-mature-content/5-preview-ticked.png`          |
| 6   | A ticked story in chapters on a phone: the tag, the box, the chapter list hidden         | `mockups/story-mature-content/6-ticked-story-page-phone.png` |

## States and errors

| Situation                                                                         | What happens                                                                                                                                                  |
| --------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| A new story                                                                       | The box is unticked.                                                                                                                                          |
| Ticked                                                                            | The tag on the card and page; **Before you read** with the line, any notes, and **Continue to the story**.                                                    |
| Ticked, the fan has continued on any ticked (or before, Mature or Explicit) story | The text shows straight away.                                                                                                                                 |
| Ticked, without scripts                                                           | The box, then the text under it.                                                                                                                              |
| Unticked, with content notes                                                      | **Before you read** with the notes only.                                                                                                                      |
| Unticked, no content notes                                                        | No box, no tag.                                                                                                                                               |
| Forgot to tick it                                                                 | The story is published without a gate; ticking it and publishing again adds the tag and the question. The help text says unticked means readers aren't asked. |
| The test story, before the one-off change                                         | The editor shows no warning and nothing about `rating`; the site counts its Mature or Explicit rating as ticked.                                              |
| The test story, after it                                                          | The box is ticked where it was Mature or Explicit; `rating` is gone.                                                                                          |
| Publishing a story with text or chapters                                          | Only the web address is checked, as before; the rating check is gone.                                                                                         |
| Preview, ticked                                                                   | The line and notes, no button, then the text.                                                                                                                 |
| Preview, unticked                                                                 | The notes alone, if any, then the text.                                                                                                                       |

## Accessibility

- **Mature or explicit content** is a labelled checkbox, reached with Tab and set with Space, its help text tied to it as the other fields' are.
- On the site, the tag is text, not only colour, and reads "Mature or explicit" (no slash for screen readers to say). **Before you read** stays a region named by its heading; "This story has mature or explicit content." is its first line, read before the button; **Continue to the story** is a button, and focus moves to the start of the text when it's chosen, as now.

## For the guide

Star's guide `publishing-stories.md` (not changed in this pull request):

- `summary:` "Starting a story, pasting its text, chapters, and ratings." loses "ratings" (or, once the Word upload's guide changes land, "Starting a story, uploading its text, and chapters."); it's an existing guide, so the help menu needs nothing new.
- "Start a new story" step 3 becomes "If the story has sex scenes, graphic violence or other strong content, tick **Mature or explicit content**. Readers are asked before the text shows, and the Writing page says so. Left unticked, readers go straight to the text."; step 4's "It shows under the rating." becomes "It shows before the story."
- The paragraph after the steps: a ticked story asks readers first (they see "This story has mature or explicit content.", your notes, and **Continue to the story**), once per browser for all ticked stories; unticked stories open straight to the text.
- "Ratings and content notes" becomes "Mature content and content notes": the table of ratings goes; the rule of thumb (tick it for what would have been Mature or Explicit on AO3; content notes for anything else a reader may want to know, such as some violence or swearing, ticked or not). The section's HTML comment, "a starting point, close to AO3's; Star to confirm or rewrite them", stays, now about the rule of thumb.
- "Check it, then publish": "The preview shows the text whatever the rating." becomes "The preview shows the text, ticked or not, with the line readers will see."
- "If something goes wrong": the row for "Choose a rating, or Not rated." goes; a row for a story published without the tick by mistake: tick it and publish again.

Elsewhere:

- `docs/tutorials/publishing-stories.md` steps 2, 5 and 11, and `docs/tutorials/reading-stories.md` (its set-up, steps 1, 2, 8 and 9, and the derived-from line naming the guide's "Ratings and content notes" section) say "Rating", "Rated Teen" and "rated Mature"; they follow the checkbox.
- design-story-import's "On the site" says "Mature and Explicit stories keep their text, pictures included, hidden until **Continue to the story**"; it reads as "ticked stories" for the spec.

## For the spec to check

- The field: label, help text, place, stored as `mature`, unticked by default, not required; **Rating** gone from the form, `rating` hidden with no "Unknown field" warning.
- The publish checks: no rating message; a story with text or chapters and a web address can be published unticked.
- The one-off change: ticks the box for `mature` and `explicit`, leaves it unticked for the others, removes `rating` everywhere, and can be run twice without harm.
- The site, ticked: the tag (beige on the card, yellow on the page, "Mature or explicit"); the box's line, notes and **Continue to the story**; the chapter list hidden on a story's page; the remembered choice, `kb-continue-rated`, shared with today's; without scripts, the text under the box; on a story's page and its chapter pages.
- The site, unticked: no tag; the notes alone in the box, no "Not rated"; no box without notes.
- A story saved with a Mature or Explicit rating counts as ticked; General, Teen and Not rated show nothing.
- Preview: ticked shows the line and notes without the button; unticked the notes alone; the text either way.
- Tests whose names or texts change (the story editor, organised editor, help, source, model, preview and e2e stories tests) recorded under `unlocks:`.

## Decisions at review

Proposed, for the lead to confirm or change:

1. The field is **Mature or explicit content**, a checkbox, unticked by default.
2. One wording everywhere: the tag reads **Mature or explicit**, and the box "This story has mature or explicit content." (Star wrote "mature/explicit"; the slash is read aloud by screen readers. Other tags: "Mature", "18+".)
3. The box isn't required, so an unticked story is published without a gate, and a forgotten tick can't be told from a decided no. The help text says unticked means readers aren't asked. The alternative is a required Yes or No with nothing chosen at first, so every story is decided before it's published, at the cost of one more choice per story.
4. Fans lose the General and Teen hints: unticked stories show no tag and no rating line, and content notes alone show in **Before you read**. That's Star's call: fewer gates, and Content notes for milder warnings.
5. The test story: `rating` hidden, a one-off change ticks the box where it was Mature or Explicit and removes `rating`, and the site counts an old Mature or Explicit as ticked until then. The simpler choice, dropping old ratings at once, is safe only if the test story is unpublished or uploaded again before the change ships.
6. The remembered Continue (`kb-continue-rated`) is kept, so fans who continued before aren't asked again, and one Continue covers every ticked story.
7. Tag colours as today: beige on the Writing card, yellow on the story's page.

## Persona walkthrough

Two walkthroughs, both 2026-11-07, for persona-artist and persona-fan, read against design-story-reader, Star's guide `publishing-stories.md`, the fans' tutorial, and the site's and editor's code (`BeforeYouRead.astro`, `StoryGate.astro`, `lib/stories/model.ts`, `WritingPage.astro`, `StoryPage.astro`, `writtenWork.ts`). The first was done while writing the design; the second by the persona-walkthrough agent. Nothing blocking. Addressed above:

- **For Star:**
  - whether a chapter needs its own box (the help text says it covers all chapters; chapters have none);
  - the test story: a removed `rating` would show as an "Unknown field" warning, and the editor's box would disagree with the site (now `rating` is hidden, a one-off change ticks the box and removes `rating`, and the site's fallback covers the gap);
  - an unticked box can't tell a decided no from a forgotten tick (the help text says unticked means readers aren't asked; a required Yes or No is offered under Decisions; a States row and a guide row say how to fix a forgotten tick);
  - where the box ends and Content notes begin (a rule of thumb for the guide, keeping "Star to confirm");
  - which colour the tag is on the card and the page (beige and yellow, as today);
  - what Preview shows for a ticked story (the line and notes without the button, mock-up 5).
- **For fans:**
  - the General and Teen hints go (under Decisions as Star's call, with Content notes for milder warnings);
  - "Mature/explicit" read as "slash", and two wordings for one thing (now "Mature or explicit" everywhere);
  - one remembered Continue covers all ticked stories, and older consents carry over (stated, with the key kept);
  - a ticked story's page with its chapter list hidden (mock-up 6);
  - link previews carry no mature flag (unchanged, and said).
- **For the build:** `beforeYouRead` drops the "Not rated" line, and the comments in `BeforeYouRead.astro` and `StoryGate.astro` change (in Where it applies).
