---
id: concept
status: approved
---

# Kettlebird Creations website

<!-- Drafted by bootstrap from README.md, docs/PROJECT_PLAN.md, docs/CONTENT_STRATEGY.md,
docs/TECHNICAL_ARCHITECTURE.md, and the code in src/, then revised with the lead's answers to the
open questions (2026-11-01). The planning docs are partly out of date; where they disagree with the
code, this follows the code. The tools in use today (Astro, Sanity, Ko-fi, AO3, email) are how the
site works now, not commitments: requirements say what must be true for users, and a better tool can
replace any of these. -->

## Problem

Star Goldberg (Kettlebird Creations) is a writer and illustrator working toward graphic novels. Their work is spread across Tumblr, Bluesky, Instagram, Ko-fi, and AO3 (docs/PROJECT_PLAN.md, "Project Overview"; social links in src/layouts/BaseLayout.astro). Someone who finds one piece has no single place to see the rest, judge Star's range before commissioning, read the comics, or buy prints. Star is not a developer and needs to keep that place current without asking one (docs/Technical_Specification.md, overview).

## Audience

- **Fans and readers** who want to browse the art, read comics and stories, and support Star by buying merch (docs/CONTENT_STRATEGY.md, readership and Ko-fi measures).
- **Prospective commission clients** who need to see examples, prices, and how to order (src/pages/commissions.astro; docs/PROJECT_PLAN.md, commission questions).
- **Star, as the site's content editor** (sanity-studio/; docs/CONTENT_STRATEGY.md, update schedule).

## Vision

One home for everything Star makes, in a hand-drawn, textured style that feels like their work. Visitors can browse the portfolio, read comics and stories on the site, buy merch without leaving it, and request a commission, on any device and with assistive technology. Star publishes new work and updates the site's own text, including whether commissions are open, without code changes or help from a developer.

## Non-goals

- **Accounts, comments, or a client portal.** Listed only as "Phase 2 possibilities" in docs/TECHNICAL_ARCHITECTURE.md.
- **Content outside Star's commission limits** (NSFW, hateful content, and others listed in docs/CONTENT_STRATEGY.md).

## Decisions

Answered by the lead on 2026-11-01.

1. **Comics** are read on the site, and the comic reader is the first piece of unfinished work.
2. **Selling** moves onto the site, with a cart and checkout.
3. **Stories** are readable on the site, and links to AO3 stay for readers who prefer it.
4. **Commissions** can be requested through a form on the site, and email stays available.
5. **Editing:** Star can change the commission status, the about page, the home page's artist text, and the social links without a developer.
6. **CMS:** Sanity is compared with alternatives before more is built on it.
7. **Hosting:** Vercel is production.
