---
status: implemented
tests-commit:
  - 487c4b0486ec2cb6f5fc8131012edb836cbdfb76
unlocks:
  - tests/unit/know-when-live.test.ts: the AC-3 and AC-4 wiring checks looked for a `withRemovalRecord` action wrapper in sanity.config.ts. Sanity runs Delete and Unpublish inside their own dialogs and closes the pane straight after, so a wrapper can't reliably see them finish; removals are recorded by a listener in the top bar instead (see Risks and decisions). The checks now look for that listener. The criterion is unchanged.
---

# Know when it's live

<!-- Technical spec for story-content-editing-know-when-live, from design-know-when-live (with its
mock-ups) and docs-going-live. A plan-feature spec without an id. -->

## Problem

Publishing in the editor changes Sanity, but the site is built ahead of time, so nothing reaches fans until someone redeploys, and nothing tells Star whether it has. The story makes publishing start a site update and shows Star where the latest change is.

## User stories

- As Star, I want publishing to update the site on its own and the editor to tell me when my change is live, or that it failed, so that I never wonder whether fans can see it. (story-content-editing-know-when-live)

## Acceptance criteria

Source: S6.n is the story's nth criterion; design and docs sections as named.

| # | Criterion | Verified by | Source |
|---|---|---|---|
| AC-1 | Publishing, unpublishing or deleting a published item starts a site build, with no other step: a Sanity webhook calls a Vercel deploy hook for those changes, and never for drafts. | manual: the lead's setup (below), then `docs/tutorials/going-live.md` | S6.1; design-know-when-live#how-it-works |
| AC-2 | Each production build reads Sanity's live API (not its cache) and publishes `/build-info.json` with `contentReadAt` (Sanity's clock, taken before any content is read) and `builtAt`; the file is served with `Cache-Control: no-store`. | test: unit "build info" (the integration, the header, the live client); command: CI build checks the file exists | S6.3; design-know-when-live#how-it-works |
| AC-3 | Deleting or unpublishing an item records the time on a hidden `siteStatus` item (`lastRemoval`), so the latest change, deletions included, can be read from the public dataset. | test: unit "latest change"; manual | design-know-when-live#how-it-works (see Risks and decisions) |
| AC-4 | The editor's top bar shows, on every screen, the state of the latest change, worked out from Sanity and `/build-info.json`: "Updating the site…" (with "(N changes)" when more than one is waiting), "Still updating, taking longer than usual…" after 5 minutes, "Didn't go live" after 15, "Live · 2:41 pm" with **View on site**, "Removed from the site · 2:41 pm", or "Can't check the site right now". It checks again every 15 seconds and never shows Live without seeing the site's file. | test: unit "live status"; manual | S6.2, S6.3; design-know-when-live#flow, #states-and-errors; docs-going-live |
| AC-5 | Times read "2:41 pm" today, "Yesterday, 2:41 pm", or "31 Oct, 2:41 pm", in Star's time zone. | test: unit "times" | design-know-when-live#layout |
| AC-6 | **View on site** opens, in a new tab, the page of the latest change: a chapter's first page, a series' page, the portfolio, the writing page, the shop, or the commissions page. | test: unit "view on site" | design-know-when-live#layout; docs-going-live#where-view-on-site-goes |
| AC-7 | **Didn't go live** opens the explanation: "Your change is saved, but the site didn't update. The person who looks after the site is told automatically and will fix it. You don't need to do anything, and you can keep working; publishing more is fine. Wait until this says Live before telling people it's up." It closes with **Close** or Escape. | test: unit "live status"; manual | S6.4; design-know-when-live#states-and-errors |
| AC-8 | After **Publish**, a note says "Published. Updating the site; the status at the top right says when it's live." | test: unit "live status" (the wording); manual | design-know-when-live#flow |
| AC-9 | Every 15 minutes, a scheduled workflow compares the latest change with the live site's `/build-info.json`. If the site is more than 15 minutes behind, it opens one issue labelled `site-not-live` (which emails the lead) with the times and a link to Vercel's deployments; when the site catches up, it closes it. | test: unit "behind check"; command: the workflow's own run | S6.4; design-know-when-live#how-it-works |
| AC-10 | Several changes in a row all reach the site: Vercel queues a deploy hook called during a build, and the status waits for a build that read the content after the latest change. | manual: `docs/tutorials/going-live.md` | S6.5; design-know-when-live#states-and-errors |

## Scope

- In:
  - `src/lib/sanity.ts`: `useCdn: false`, so builds read the live API (AC-2).
  - `src/integrations/build-info.ts` (new): an Astro integration that asks Sanity for `now()` when the build starts and writes `dist/build-info.json` when it ends (AC-2).
  - `vercel.json`: `Cache-Control: no-store` for `/build-info.json` (AC-2).
  - `sanity-studio/lib/live-status.ts` (new): the pure logic: status from the latest change and the build info, the labels, the times, and the View on site path; no `sanity` imports (AC-4 to AC-8).
  - `sanity-studio/schemas/objects/siteStatus.ts` (new, not in the menu) and `sanity-studio/actions/recordRemoval.tsx` (new): when a published item disappears (Delete or Unpublish), the editor records `lastRemoval` (AC-3).
  - `sanity-studio/components/LiveStatus.tsx` (new): the top bar status, **View on site**, and the explanation; `sanity-studio/actions/publishNote.tsx` (new): the note after Publish; `sanity.config.ts` wiring (AC-4 to AC-8).
  - `scripts/live-check.mjs` and `.github/workflows/site-live.yml` (new): the 15-minute check (AC-9).
  - Tests: `tests/unit/know-when-live.test.ts`; `docs/tutorials/going-live.md` (`runner: manual`).
- Out: the move to kettlebird.com (the check and the editor use the site they're served from); the about, home and site-settings pages (content-editing story 4), whose View on site paths come with them.

## What the lead sets up (once)

1. **Vercel:** the project's **Settings**, **Git**, **Deploy Hooks**: create a hook named `Sanity publish` on branch `main`, and copy its URL.
2. **Sanity:** sanity.io/manage, the project, **API**, **Webhooks**, **Create webhook**: name `Rebuild site`; URL: the deploy hook's URL; dataset `production`; trigger on **Create**, **Update** and **Delete**; filter `_type in ["comicSeries", "comicChapter", "galleryItem", "writtenWork", "product", "commissionType", "siteStatus"]`; HTTP method `POST`; leave **Drafts** off (it's off by default) so drafts never trigger a build.
3. Optionally, in GitHub, label `site-not-live` exists (the workflow creates it if not) and the lead watches the repository's issues.

## APIs and assumptions

- Sanity webhooks (GROQ-powered) fire on create, update and delete of published documents, skip drafts unless asked, and can POST to any URL; the free plan includes them.
- Vercel deploy hooks start a production build of the branch's latest commit; a hook called during a build queues another build, so the last change is never lost.
- GROQ `now()` returns Sanity's server time; a published document's `_updatedAt` is its last publish.
- The Studio's `studio.components.navbar` renders on every screen; `useDocumentOperationEvent` reports a successful Publish while the item's pane is open; a listener on published items reports a `disappear` transition for each Delete or Unpublish.
- The editor is served from the site, so it reads `/build-info.json` from its own origin.
- Assumptions that could be wrong:
  - Studio asset hashes stay the same across content-only builds (so an open editor carries on). Vite names files by content, so they should.
  - GitHub runs `*/15` schedules within a few minutes of the time; a late run only delays the issue.

## Non-functional requirements

- The editor checks every 15 seconds while open; one small GROQ query and one tiny file each time.
- Status changes are announced politely to screen readers (`aria-live="polite"`); the status is text with an icon, never colour alone.

## Delivery

- Plan item: epic-content-editing, story 6. Needs the lead's setup (above) before AC-1 and AC-10 can be checked.

## Risks and decisions

- **Deletions are recorded, not looked up.** The design has the editor ask Sanity for the latest change, deletions included. A deleted document leaves nothing to query, and Sanity's history API needs a token the scheduled check doesn't have. So the editor writes the time to a hidden `siteStatus` item, which the public dataset, the editor and the check can all read; the status uses that item's `_updatedAt`, Sanity's clock, so Star's computer clock doesn't matter. The top bar listens for published items disappearing rather than wrapping Delete and Unpublish, because Sanity runs those inside their own dialogs and closes the pane straight after. A removal made while no editor is open (for example from Sanity's API) isn't recorded; only the editor is used. Two open editors record the same removal twice, which starts one extra build.
- `useCdn: false` makes builds slightly slower to read; builds are small.
- `contentReadAt` is taken before the first page reads content, so a change published during a build counts as not yet live, and the queued build picks it up: the status can be late, never early.
