---
status: implemented
tests-commit:
  - dfa2995c439320069212242f4c58bc51010a6245
unlocks:
  - tests/e2e/help.spec.ts: the check that a help page shows none of its guide's comments looked for any HTML comment, and the site's own header has one; it now looks for the guide's comment itself. The criterion is unchanged. It also checks /help's page title, after the pull request's deployment showed it read "Help · Help · Kettlebird Creations".
  - tests/unit/help-edges.test.ts (new): mutation testing showed nothing checked a guide without front matter, a title or a summary, front matter that isn't at the start, addresses that only contain a guide's file name, one wrapper per table, or help addresses with something before or after them; the pull request's deployment then showed a table with an empty first header cell named ", open, closed". Added; the criteria are unchanged.
---

# Help where I'm working

<!-- Technical spec for story-content-editing-help-links, from design-help-links (with its mock-ups)
and docs-getting-started. A plan-feature spec without an id. -->

## Problem

Star's guides are files in the code repository, which Star doesn't use, so they reach Star only when someone sends them. The story puts them on the site as help pages and links them from the editor: a **Help** menu in the top bar and a link at the top of each item to the part of a guide about it.

## User stories

- As Star, I want the guide for what I'm editing one click away in the editor, so that I can check how something works without asking anyone or knowing where the guides are kept. (story-content-editing-help-links)

## Acceptance criteria

Source: S7.n is the story's nth criterion; design and docs sections as named.

| # | Criterion | Verified by | Source |
|---|---|---|---|
| AC-1 | The six guides (getting-started, editing-your-site, publishing-comics, site-settings, previewing, going-live) are built from `docs/user/<name>.md` into `/help/<name>`, in that order, ahead of time like the rest of the public site. `reading-comics.md` isn't built. | test: unit "guides"; e2e "help pages" | S7.1; design-help-links#how-it-works |
| AC-2 | A help page has the site's header and footer; "Help for your site's editor" and **All help** (to `/help`) above the guide and **All help** again at the end; the guide's title as the only `h1`; **On this page**, a navigation landmark of that name listing its `##` sections as links; then the guide's text. Front matter and comments in the file don't appear, in the page or its source. | test: unit "rendering"; e2e "help pages" | S7.1; design-help-links#the-help-page |
| AC-3 | `/help` lists the six guides in that order, each a link with its title and its `summary` from the file's front matter. | test: unit "guides"; e2e "help pages" | design-help-links#the-help-page |
| AC-4 | Section ids are made as GitHub makes them (github-slugger), so `site-settings.md#open-or-close-commissions` and every link already in the guides work. A link to another guide (`x.md`, `x.md#y`) becomes `/help/x` (`/help/x#y`). A link to a guide that isn't built, or to a section that doesn't exist, fails the build with the guide, the link and the reason. | test: unit "links" | S7.3; design-help-links#how-it-works, #states-and-errors |
| AC-5 | A table is wrapped in a box that scrolls sideways within itself, takes focus with Tab (`tabindex="0"`), shows its focus, and is a region named by its header cells ("What you see, what it means, what to do"). At 360 px wide the page doesn't scroll sideways; at 200% text it still reads. | test: unit "rendering"; e2e "help pages on a phone" | S7.1, S7.8; design-help-links#the-help-page, #accessibility |
| AC-6 | Help pages carry `<meta name="robots" content="noindex">` and, from `vercel.json`, `X-Robots-Tag: noindex, nofollow` on `/help` and `/help/…`. No page outside `/help` links to `/help`, and no help page links to `/studio` (the editor's address stays text). | test: unit "headers", "no public link"; e2e "help pages" | S7.2; design-help-links#how-it-works |
| AC-7 | The help pages have no serious or critical axe issues. | test: e2e "accessibility" | S7.8; design-help-links#accessibility |
| AC-8 | The editor's top bar has **Help**, a button with the word "Help" at every width, just left of the live status. It opens a menu of the six guides by title, then **All help**; each item is a link to `/help/…` that opens in a new tab (`target="_blank"`, `rel="noopener"`), named "<title> (opens in a new tab)". Arrow keys move through the menu and Escape closes it, returning focus to **Help** (Sanity UI's `MenuButton`). | test: unit "help menu"; manual (tutorial) | S7.5, S7.7, S7.8; design-help-links#help-in-the-top-bar |
| AC-9 | Each of the ten item types has, at the top left of the item on **Preview**'s line, a link "Help: <heading> ↗" to the design's section, opening in a new tab, named "Help: <heading> (opens in a new tab)", with the arrow hidden from screen readers. It wraps beside **Hide preview** when the form is narrow; the preview pane has none. | test: unit "item help"; manual (tutorial) | S7.6, S7.7, S7.8; design-help-links#help-at-the-top-of-each-item |
| AC-10 | Every address in the **Help** menu and every item's link names a built guide and an existing section, or the site's build fails. | test: unit "item help"; command: `npm run build` | design-help-links#states-and-errors, #for-the-spec-to-check |
| AC-11 | A manual tutorial (`docs/tutorials/help-links.md`, `runner: manual`) walks through **Help**, an item's link, and a help page on a phone. | manual: the lead or Star | docs-getting-started |

## Scope

- In:
  - **Site:**
    - `src/lib/help/guides.ts` (new, pure): the guide list and order; reading a guide's front matter (`summary`); rendering its Markdown to HTML (remark-parse, remark-gfm, remark-rehype without raw HTML, so comments are dropped; github-slugger ids on headings; links between guides rewritten and checked; tables wrapped); its title and sections.
    - `src/pages/help/index.astro` and `src/pages/help/[guide].astro` (new, built ahead of time), reading `docs/user/` at build time, with `BaseLayout`'s `noindex`. `src/components/HelpPage.astro` (new) for the shared frame and styles.
    - `vercel.json`: `X-Robots-Tag` on `/help` and `/help/(.*)`.
    - `package.json`: `unified`, `remark-parse`, `remark-gfm`, `remark-rehype`, `rehype-stringify`, `github-slugger` and `unist-util-visit` as direct dependencies, at the versions already installed through Astro.
  - **Editor:**
    - `sanity-studio/lib/help.ts` (new, pure): the menu's guides and titles, each item type's heading and address, and the link names.
    - `sanity-studio/components/HelpMenu.tsx` (new), placed by `LiveStatus` between Sanity's own top bar and the status.
    - `sanity-studio/components/PreviewButton.tsx`: the item's help link at the left of **Preview**'s line, for every item type (so `withPreviewInput` is used for all ten, as now).
  - **Docs:** `docs/user/getting-started.md`: the **?** button is described by where it is ("near your account circle"), not "further right" (see Risks). `docs/tutorials/help-links.md` (new).
  - **Tests:** `tests/unit/help*.test.ts`, `tests/e2e/help.spec.ts`; `tests/unit/sign-in.test.ts` gains the `/help` checks.
- Out: a search box; help pages for fans; help inside the editor's own panes.

## APIs and assumptions

Checked with a trial render of the six guides (2026-11-03):

- remark-rehype without `allowDangerousHtml` drops HTML, including `<!-- … -->` comments; no guide uses HTML otherwise, and every link in the guides is to another guide (`x.md` or `x.md#y`).
- github-slugger 2.0.0 gives GitHub's ids, including for headings with punctuation ("Commissions, your about page, the home page and your links" → `commissions-your-about-page-the-home-page-and-your-links`).
- Sanity 5.1: `studio.components.navbar` receives `renderDefault`; `LiveStatus` already draws Sanity's top bar and then the status. Sanity's own **Help and resources** ("?") menu is inside that default bar, beside the account circle, and moves into Sanity's side menu on narrow screens; no setting removes it. Sanity UI 3.1 `MenuButton` and `MenuItem` (with `as="a"`) give the menu keyboard behaviour.
- The editor is served from the site at `/studio`, so `/help/…` addresses are on the same site; the local editor (`sanity dev`) opens them on the deployed site's address instead.

## Non-functional requirements

- No page is made on request; the help pages add a few small static pages.
- No change to what visitors see on the public pages.

## Delivery

- Plan item: epic-content-editing, story 7. No set-up by the lead.

## Risks and decisions

- The status sits after Sanity's own top bar, which ends with the account circle, so **Help** (just left of the status) is right of the **?** and the account circle, not left of them as the guide says. The guide now places the **?** "near your account circle". (design-know-when-live said the status sits before the account circle; it has sat after it since that story was built.)
- The guides are rendered by a small unified pipeline rather than an Astro content collection: it's a pure function, so link checks and table wrapping are unit-tested, and `docs/user/` stays outside `src/`.
- A broken link between guides fails the site's build, which blocks every publish until it's fixed; the guide PRs run the same build in CI first, so it shows there.
