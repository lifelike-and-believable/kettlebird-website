---
status: implemented
tests-commit:
  - 7ed9b82beae4543280dea80674a1a0740e997fba
---

# Sign in at the site

<!-- Technical spec for story-content-editing-sign-in, from design-sign-in (with its mock-ups) and
docs-getting-started. A plan-feature spec without an id. -->

## Problem

Star has no editor to sign in to: the Studio only runs on a developer's computer, and the old hosted editor edits a project the site doesn't read. The story puts the editor on the site at `/studio`, behind Sanity's sign-in, with one invitation and nothing to install.

## User stories

- As Star, I want to open `/studio` on my own site and sign in, after one email invitation, so that I have one place to go and nothing else to learn. (story-content-editing-sign-in)

## Acceptance criteria

Source: S1.n is the story's nth criterion; design and docs sections as named.

| # | Criterion | Verified by | Source |
|---|---|---|---|
| AC-1 | The deployed site's build also builds the editor into `dist/studio`, with `/studio` as its base path, so `/studio` on the site opens it. | command: `npm run build:site`, then `dist/studio/index.html` exists (CI build job); manual: the tutorial | S1.1; design-sign-in#how-the-editor-is-served |
| AC-2 | Any address under `/studio` that isn't a file opens the editor (a bookmarked document path keeps working). | test: unit "site headers and routing" (the rewrite in `vercel.json`); manual | design-sign-in#how-the-editor-is-served |
| AC-3 | The editor's title is **Kettlebird Creations**, on the sign-in screen, at the top left, and in the browser tab before signing in. | test: unit "editor settings"; command: the CI build job checks `dist/studio/index.html`'s title; manual | design-sign-in#layout; docs-getting-started#sign-in |
| AC-4 | The sign-in screen offers only **Google** and **E-mail / password**; any other provider Sanity offers (GitHub) is left out. | test: unit "editor settings"; manual | design-sign-in#how-the-editor-is-served; docs-getting-started#accept-your-invitation |
| AC-5 | Responses under `/studio` tell search engines not to index them (`X-Robots-Tag: noindex, nofollow`). | test: unit "site headers and routing" | design-sign-in#how-the-editor-is-served |
| AC-6 | No page of the site can be framed by another site; the site may frame its own pages (`X-Frame-Options: SAMEORIGIN` and `Content-Security-Policy: frame-ancestors 'self'`). | test: unit "site headers and routing" | design-sign-in#how-the-editor-is-served |
| AC-7 | No public page links to `/studio`: not the header, the footer, or any page. | test: unit "no link to the editor" (scans the built site) | S1.6; design-sign-in#layout |
| AC-8 | The editor has no tools beyond the content editor (the Vision query tool is removed), so Star sees only what the mock-ups show. | test: unit "editor settings" | design-sign-in#mock-ups (mock-up 4); persona walkthrough of docs-getting-started |
| AC-9 | Signing in, staying signed in until **Sign out**, and a non-member seeing no content behave as the design describes. | manual: tutorial `docs/tutorials/signing-in.md` | S1.2, S1.3, S1.4; design-sign-in#states-and-errors |

## Scope

- In:
  - `sanity-studio/lib/studio-settings.ts` (new): the title and the sign-in provider filter, with no `sanity` imports, so the site's Vitest can test them (AC-3, AC-4).
  - `sanity-studio/sanity.config.ts`: uses them; drops `visionTool` (AC-8).
  - `sanity-studio/package.json`: drops `@sanity/vision`.
  - `package.json`: `build:studio` (installs the Studio's dependencies, builds it into `dist/studio`, and sets the built page's tab title and icon links with `scripts/studio-page.mjs`) and `build:site` (the site, then the editor) (AC-1, AC-3).
  - `sanity-studio/sanity.cli.ts`: `project.basePath: '/studio'`, which sets both the built files' paths and the editor's routes; the config's own `basePath` is removed, since Sanity adds it on top.
  - `vercel.json`: `buildCommand` becomes `npm run build:site`; the `/studio` rewrite; `X-Robots-Tag` for `/studio`; the frame headers (AC-1, AC-2, AC-5, AC-6).
  - `.github/workflows/build.yml`: the build job runs `npm run build:site` and checks `dist/studio/index.html` (AC-1).
  - Tests: `tests/unit/sign-in.test.ts`; `docs/tutorials/signing-in.md` (`runner: manual`).
- Out:
  - Inviting Star, renaming the Sanity project, allowing the site's address in Sanity's CORS settings, and turning off GitHub in Sanity's project settings: the lead does these (below).
  - The move to `kettlebird.com` and the redirect from the `vercel.app` address (done with the domain move).
  - The organised menu (content-editing story 3).

## APIs and assumptions

- APIs used (checked in the installed `sanity` 5.1.0 types): `defineConfig({ title, basePath, auth: { providers } })`, where `providers` may be a function of Sanity's default providers (`AuthConfig.providers`); `sanity build <outputDir> --yes`.
- Vercel serves files from the output directory before applying `rewrites`, so the rewrite only catches editor paths with no file.
- Assumptions that could be wrong:
  - Sanity's default provider names are `google`, `github` and `sanity` (E-mail / password). If a name differs, AC-4's filter would drop a wanted provider; the manual tutorial checks the screen.
  - Sanity's invitation acceptance page may still offer GitHub, since that page isn't the Studio. The guide tells Star not to choose it; turning GitHub off in the project's settings, if Sanity allows it, removes it there too.
  - Sign-in survives a reload with Sanity's default `dual` login method (cookie, with browser storage as the fallback). Safari's seven-day limit on site storage may sign Star out after a week away; the guide covers signing in again.
  - A signed-in non-member sees Sanity's "no access" screen and no documents. The datasets are public, so published content can be read through the API anyway, as it can on the site; drafts can't.

## What the lead does in Sanity (sanity.io/manage, project Kettlebird Website)

1. Rename the project to **Kettlebird Creations**.
2. Under **API**, **CORS origins**, add `https://kettlebird-website.vercel.app` with **Allow credentials** (and `https://kettlebird.com` on the day of the move).
3. If the project's settings allow it, turn off GitHub as a sign-in method.
4. Under **Members**, invite Star with the **Editor** role, once the editor is live (and, if possible, once the organised menu has shipped).

## Non-functional requirements

- The Vercel build takes longer by one Studio build (about a minute); the site's own pages are unchanged.
- The editor's scripts load only under `/studio`; no public page loads them.

## Delivery

- Plan item: epic-content-editing, story 1 (sign in).
- Ships before Star is invited. The getting-started guide (docs-getting-started) names the `vercel.app` address until the domain move.

## Risks and decisions

- The `X-Frame-Options` change from `DENY` to `SAMEORIGIN` loosens framing for the site's own pages only, as the design requires for the preview story.
- The Studio's dependencies are installed during every Vercel build. If that becomes slow, the Studio can move into the root `package.json` workspaces later.
