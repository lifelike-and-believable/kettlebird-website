---
status: draft
---

# Site settings

<!-- Technical spec for story-content-editing-site-settings, from design-site-settings (with its
mock-ups) and docs-site-settings. A plan-feature spec without an id. -->

## Problem

The commission banner, the about page, the home page's artist text, the contact email and the social links are written into the site's code, so every change needs a developer. The story moves them into the editor as four items Star publishes on their own.

## User stories

- As Star, I want to change whether commissions are open, my about page (bio, statement, portrait, quick facts), the home page's artist text, and my social links, so that I can keep the site current myself. (story-content-editing-site-settings)

## Acceptance criteria

Source: S4.n is the story's nth criterion; design and docs sections as named.

| # | Criterion | Verified by | Source |
|---|---|---|---|
| AC-1 | **Site settings** in the editor's menu lists four items, in order: **Commissions**, **About page**, **Home page**, **Contact and social links**. Each opens its one item straight away. They can't be deleted, duplicated or unpublished (their only actions are Publish, Discard changes and Restore), and they aren't offered in "Create new". The "coming in the next update" note is gone. | test: unit "menu"; manual | S4.1; design-site-settings#flow, #for-the-spec-to-check |
| AC-2 | Each item has the design's fields, names, help text and **Required** marks: Commissions (Commissions are… Open/Closed, Note when closed), About page (Portrait with its alt text and crop, Hello! (your bio), The Work (your artist statement), At a glance), Home page (Artist text), Contact and social links (Contact email, Social links). | test: unit "fields" | S4.1; design-site-settings#fields |
| AC-3 | Validation, with the design's messages: a link must be a complete http or https address with no spaces; a link needs a name and a name needs a link; the contact email is required and must look like an email address; a fact needs both its label and its value; the note is at most 120 characters. A missing portrait alt text is a warning that doesn't block **Publish**. | test: unit "rules" | S4.5; design-site-settings#states-and-errors |
| AC-4 | While an item has errors, **Publish** is blocked, a box at the top reads "Fix this before publishing:" with one line per problem (a link's problem starts with its name, like "Instagram: the link isn't a web address"), and a badge beside **Publish** reads "1 thing to fix before publishing" (or "N things"). Other items publish as usual. | test: unit "summary"; manual | design-site-settings#states-and-errors |
| AC-5 | Facts and links are edited in Sanity's dialog; their rows read "Label · Value" and "Name · Link", can be dragged (also by keyboard) and removed; the add buttons read **+ Add a fact** and **+ Add a link**. | test: unit "fields" (labels, previews); manual | S4.4; design-site-settings#fields, #for-the-spec-to-check; docs-site-settings |
| AC-6 | Each item starts with today's site: commissions open with no note; the four quick facts; no portrait, bio, statement or home text; the contact email; the four social links, with Ko-fi named "Ko-fi ☕". Until an item is published, or if it's missing, the site uses these same values. | test: unit "starting values" | design-site-settings#fields (starting values), #states-and-errors |
| AC-7 | Commissions page. **Open:** a green banner "Commissions are open. Email me to get started." with **Contact me**, then the page as now. **Closed:** an orange banner "Commissions are closed." and the note; "These are the kinds of commission I take, for when they open again."; the types and prices; no How it works, Ready to order? or commission email buttons; at the end "Commissions are closed for now. To hear when they open, follow me on the social links at the bottom of the page." (left out with no links). The dot is hidden from screen readers. | test: unit "commissions view"; e2e "commissions" | S4.2; design-site-settings#what-changes-on-the-site, #accessibility |
| AC-8 | About page: the portrait (with its alt text, or as decoration without it), **Hello!**, **The Work** and **At a glance** appear only when filled in; **About the Artist** and **Get in touch** always appear. Get in touch reads "For commission inquiries, collaboration ideas, or just to say hi:" while open and "To ask about collaborations, or just to say hi:" while closed. Headings keep their order. | test: unit "about view"; e2e "about" | S4.3; design-site-settings#what-changes-on-the-site, #accessibility |
| AC-9 | Home page: the artist text, under the social links, with the portrait beside it if there is one; nothing when the text is empty. | test: unit "home view"; e2e "home" | S4.3; design-site-settings#what-changes-on-the-site |
| AC-10 | Social links come from the one list, in order, on the home page's row, every page's footer and the about page; they open in a new tab; their colours go green, yellow, orange, pink and repeat; with no links, the home row and the footer's **Connect** heading are left out. | test: unit "links"; e2e "links" | S4.4; design-site-settings#what-changes-on-the-site |
| AC-11 | The contact email is used by every email button and link: the footer's Contact, the about page's Get in touch, and the Commissions page's buttons. | test: e2e "email" | design-site-settings#what-changes-on-the-site |
| AC-12 | Text is plain; blank lines separate paragraphs; text made only of spaces counts as empty. | test: unit "text" | design-site-settings#fields |
| AC-13 | Publishing any of the four items starts a site update and counts as the latest change; **View on site** opens the Commissions page, the about page, or the home page (for Home page, and for Contact and social links). | test: unit "live status" | design-site-settings#flow, #for-the-spec-to-check; design-know-when-live |

## Scope

- In:
  - `src/lib/site-settings.ts` (new): starting values, reading the four items with fallbacks, paragraphs, link colours, and what each page shows; no Sanity imports. `src/lib/site-settings-source.ts` (new): fetching them, or `tests/fixtures/site-settings.ts` under `KETTLEBIRD_FIXTURES=1`.
  - `src/pages/commissions.astro`, `src/pages/about.astro`, `src/pages/index.astro`, `src/layouts/BaseLayout.astro` (footer).
  - `sanity-studio/lib/site-settings.ts` (new): field text, messages, rules, the fix summary and badge text; no `sanity` imports. `sanity-studio/schemas/objects/{commissionSettings,aboutPage,homePage,contactSettings}.ts` (new). `sanity-studio/components/AddItemButton.tsx` (new), `sanity-studio/components/FixSummary.tsx` (new), `sanity-studio/badges/thingsToFix.tsx` (new). `structure.ts`, `sanity.config.ts`, `lib/editor-content.ts` (the note goes), `lib/live-status.ts` and `scripts/live-check.mjs` (the four types).
  - Tests: `tests/unit/site-settings.test.ts`, `tests/e2e/site-settings.spec.ts`; `docs/tutorials/site-settings.md` (`runner: manual`).
- Out: preview before publishing (story 5); editing the commission types themselves (already in **Commissions**); the about page's layout beyond the parts listed.

## What the lead sets up (once)

- **Sanity webhook "Rebuild site":** add the four new types to its filter, so publishing them starts a build: `_type in ["comicSeries", "comicChapter", "galleryItem", "writtenWork", "product", "commissionType", "commissionSettings", "aboutPage", "homePage", "contactSettings", "siteStatus"]`.

## APIs and assumptions

- A singleton is a document with a fixed `_id` equal to its type, opened with `S.document().schemaType(t).documentId(t)`; document actions can be filtered per type, and `newDocumentOptions` already offers only the five kinds of item.
- An array's add button can be replaced through the input's `arrayFunctions` (`ArrayInputFunctionsProps`: `onValueCreate`, `onItemAppend`).
- Sanity's array items open in a dialog by default, and drag handles work by keyboard.
- Assumptions that could be wrong:
  - The dialog's close button is labelled **Done**, as the design and guide say. If Sanity 5 labels it otherwise, the guide changes to match (checked in the tutorial).
  - The live API returns published documents only to the site's anonymous client, so drafts never reach the site.

## Non-functional requirements

- The site reads the four items once per build, not once per page.
- No change to what visitors see when Star publishes the items unchanged, except the Ko-fi button's name on the about page (design-site-settings, starting values).

## Delivery

- Plan item: epic-content-editing, story 4. Needs the lead's webhook change (above) before publishing these items updates the site on its own.

## Risks and decisions

- The four items' `_id`s are their type names: `commissionSettings`, `aboutPage`, `homePage`, `contactSettings`.
- The fix summary names a link or fact by its name or label, so "Instagram: the link isn't a web address" rather than a position.
- Starting values live in one place (`src/lib/site-settings.ts`) and the editor's initial values are copied from them, so the site's fallback and a new item agree; a unit test checks they match.
