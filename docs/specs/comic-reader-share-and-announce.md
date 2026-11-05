---
status: implemented
tests-commit:
  - c2a96d8b8e552137c75bdc6c647280049930d273
unlocks:
  - tests/unit/comic-sharing-edges.test.ts (new): mutation testing showed nothing checked an ongoing series with exactly two pages or without a web address (AC-3), an address with /comics/ in its middle (AC-4), the logo's literal address (AC-5), or a turn read in the same millisecond (AC-7). Added; the criteria are unchanged.
  - tests/e2e/comic-share-and-announce.spec.ts: runs in a 900 × 800 window, narrower than the width at which pages pair (comic-reader-spread-and-flip AC-3), so it still checks one page at a time; Playwright's default 1280 × 720 now shows two. The criteria are unchanged.
---

# Comic reader: newest page, sharing, and announcing pages

<!-- Technical spec for story-comic-reader-newest-and-share (story 3) and
story-comic-reader-assistive-technology (story 4), from design-comic-share-and-announce (with its
mock-ups) and docs-reading-comics. A plan-feature spec without an id. -->

## Problem

Fans share pages from social posts, but the reader has no share button, a shared link shows no preview, a stale link to a removed page strands them, and the series page has no quick way to the newest page. Screen reader users hear nothing when a page turns, and focus falls back to the top of the page. These two stories finish the comic reader epic.

## User stories

- As a fan, I want each page to have its own address and a way to go straight to the newest page, so that I can follow a link from a social post to the right page, and pick up where a new update starts. (story-comic-reader-newest-and-share)
- As a fan using a screen reader, I want each page announced with its chapter, page number, and alt text, and focus kept in the reader as I turn pages, so that I can follow the story. (story-comic-reader-assistive-technology)

## Acceptance criteria

Source: S3.n and S4.n are the newest-and-share and assistive-technology stories' nth criteria; design and docs sections as named. S3.1, S3.2 (addresses), S4.3, S4.4 and S4.5 (names, keyboard, 200%, axe) are already met and tested by docs/specs/comic-reader-start-and-turn.md and docs/specs/comic-reader-sheet-and-controls.md; AC-8 re-checks axe on the pages this changes.

| # | Criterion | Verified by | Source |
|---|---|---|---|
| AC-1 | **Share this page**, a button under the controls (under the end note on the newest page, and on one-page series), hidden without a script. With a coarse primary pointer and `navigator.share`, it opens the share menu with the title "<series> · <place>" ("Kettle Tales · Chapter 2, page 1") and the page's canonical address; closing the menu (`AbortError`) changes nothing; any other share error copies instead. Otherwise it copies the canonical address (no `#`), reads **Link copied** for four seconds, and puts "Link copied" in a polite status message. | test: unit "share titles and addresses"; e2e "Share this page copies…", "on a touch screen…", "closing the share menu…", "placement…" | S3.3; design-comic-share-and-announce#flow, #layout, #states-and-errors |
| AC-2 | If copying fails, a box labelled **Copy this link:** appears under the button with the address, focused and selected. | test: e2e "when copying is refused…" | S3.3; design-comic-share-and-announce#flow |
| AC-3 | The series page shows **Read the newest page** beside **Start reading**, linking the newest page, only for series set to ongoing with more than one page; on a 360 × 640 phone both are on the first screen. | test: unit "read the newest page"; e2e "read the newest page" | S3.4; design-comic-share-and-announce#flow, #layout |
| AC-4 | **Page not found** (status 404) adds **Back to <series title>** before **Comics** when the address starts with `/comics/<series>/` for an existing series (reader pages, chapters, sheets), from a list of series built into the page; **Comics** only for other addresses and without a script. | test: unit "page not found"; e2e "page not found links to the series" | S3.5; design-comic-share-and-announce#flow |
| AC-5 | Reader and series pages have a canonical link and Open Graph and Twitter card tags, all absolute from the site address (`site` in the Astro configuration, `SITE_URL` or `https://newsite.kettlebird.com`). A reader page: title "<series> · <place>", description "<place line>." and the series description, type `article`; a series page: its title and description (or "<title>, a comic by Star Goldberg."). The image is the cover on a paper-coloured 1200 × 630 background from the image service, or the site's logo for a series without one; `summary_large_image`. | test: unit "link previews"; e2e "link previews and canonical addresses" | S3.6; design-comic-share-and-announce#flow, #addresses |
| AC-6 | A polite status element, empty in the built page, is filled half a second after load with "<chapter label>, page N of M." (or "Page N of M.") followed by the page's own alt text (never the fallback name) and, on the newest page, the end note. It's filled on arrival, after a turn and on back or forward, not on a reload. | test: unit "announcements"; e2e "each page is announced…" | S4.1; design-comic-share-and-announce#flow, #accessibility |
| AC-7 | After a turn with **First**, **Previous**, **Next** or **Newest**, that control has focus on the new page, without scrolling, even when it can't be used there (unusable controls have `tabindex="-1"`; Tab skips them, and Tab from one goes on in reading order). Only for a link navigation from the turn's page within 30 seconds; arrow keys and swipes don't move focus. | test: unit "focus after a turn"; e2e "focus stays on the control used", "unavailable controls take focus only from the script" | S4.2; design-comic-share-and-announce#accessibility |
| AC-8 | Reader, series and not-found pages have no serious or critical axe issues. | test: e2e "accessibility" | S4.5 |
| AC-9 | The reading tutorial reaches **Read the newest page**, and passes on the fixture build. | command: `node .rfr/checks/tutorial-run.mjs . --base-url <preview>` | docs-reading-comics |
| AC-10 | Announcements and focus work with NVDA on Firefox and Chrome, and VoiceOver on an iPhone and a Mac. | manual: the lead, after merge | design-comic-share-and-announce#accessibility |

## Scope

- In:
  - `src/lib/comics/sharing.ts` (new): share titles, absolute addresses, previews, **Read the newest page**, the series for a missing address, announcements, and when focus returns; pure functions.
  - `src/lib/comics/model.ts`: `social` on images. `src/lib/comics/source.ts`: the cover's 1200 × 630 image (`fit=fill`, paper background).
  - `astro.config.mjs`: `site`. `src/layouts/BaseLayout.astro`: optional canonical address and preview.
  - `src/pages/comics/[slug]/[chapter]/[page].astro`: **Share this page**, the copy box, the status element, `tabindex="-1"` on unusable controls, focus and announcement script; arrow keys and swipes follow links without counting as a turn.
  - `src/pages/comics/[slug].astro`: **Read the newest page**, preview tags. `src/pages/404.astro`: the series list and link.
  - Tests: `tests/unit/comic-sharing.test.ts`, `tests/e2e/comic-share-and-announce.spec.ts`; `docs/tutorials/reading-comics.md`.
- Out: marking where an update starts (needs Star to record updates); previews for contact sheets (unlisted) and other site pages.

## APIs and assumptions

- `navigator.share` exists on most phone browsers and some laptop ones; `matchMedia('(pointer: coarse)')` tells a touch-first device. `navigator.clipboard.writeText` needs a secure context and may be refused.
- `performance.getEntriesByType('navigation')[0].type` gives `navigate`, `reload`, `back_forward` or `prerender`.
- `focus({ preventScroll: true })` focuses without scrolling; an element with `tabindex="-1"` is focusable by script but not by Tab.
- Sanity's image service supports `w`, `h`, `fit=fill` and `bg` for the preview picture; social sites need absolute `https` image addresses.
- Vercel serves `404.html` with status 404 for any address that wasn't built; `astro preview` does the same.

## Non-functional requirements

- No script is needed to read, follow a shared link, or see a preview; only sharing and the not-found series link use one.
- The remembered turn lives in `sessionStorage`, for one tab only, and is cleared once read.

## Delivery

- Plan item: epic-comic-reader, stories 3 and 4. No set-up by the lead. When the site moves to kettlebird.com, `SITE_URL` (or the default) changes to it.

## Risks and decisions

- A turn is remembered from a click on a control (by mouse, touch or Enter); arrow keys and swipes navigate with `location.assign`, so they don't move focus.
- **Read the newest page** sits beside **Start reading** with a smaller gap than the other buttons on the site, so both fit on one line on a 390 px phone; on a 360 px phone it wraps under it, as the design allows.
- The 404 page's series list is built from the comics at build time, so a series added since the last build isn't linked until the next one; builds follow every publish.
