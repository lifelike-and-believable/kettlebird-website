---
id: design-clear-placeholders
status: approved
derived-from:
  - story-content-editing-clear-placeholders: 719357d790bf
  - persona-fan#frustrations: 078d5295ca3a
  - persona-artist#frustrations: ef88538c418e
---

# Clear the placeholders: design

<!-- docs/design/clear-placeholders.md. Design for story-content-editing-clear-placeholders. Four mock-ups
in docs/design/mockups/clear-placeholders/ (before and after of each page that changes, rendered
from mockups.html). -->

## What changes, page by page

| Page | Today | After |
|---|---|---|
| **Home** (mock-up 1) | "About the artist" block with "[Insert Portrait Here]" and a Lorem ipsum paragraph | The block is left out until Star fills in the home page's artist text and portrait in Site settings (story-content-editing-site-settings). The tiles, logo, and social links stay. |
| **About** (mock-up 2) | "[Portrait coming soon]" post-it; "Bio coming soon — Star is working on it!"; "Artist statement coming soon." | The portrait frame, the **Hello!** section, and **The Work** section are left out until Star fills them in. **At a glance**, the social links, and **Get in touch** stay; they are real. |
| **Portfolio** (mock-up 3) | With no art in the CMS, 18 built-in sample items, several titled after other studios' shows, with stock images | With no art in the CMS, the empty state: "No artwork yet — check back soon!" and a second line, "Until then, see Star's newest work on Bluesky, Tumblr, or Instagram", with those three linked, so a fan who came from social media isn't left at a dead end. |
| **Commissions** | "Full terms of service coming soon." under the process steps | Left out until the terms of service exist (an open question in the commissions requirements). |
| **Files** | `public/assets/images/logo-primary_Placeholder.jpg`, unused by any page | Deleted. The site already uses the real logo (`kblogo.png`). |

**Empty states stay; placeholder copy goes.** The difference: an empty state tells a visitor that content of a kind hasn't been posted yet, which stays true until Star posts some ("Comics in progress — pages coming soon!", "Stories coming soon — check back shortly!", a series' "Pages coming soon."). Placeholder copy stands in for text or images the site itself should have and doesn't (lorem ipsum, "[Insert Portrait Here]", "Bio coming soon", "Full terms of service coming soon"). This story removes every case of the second kind; the comics, writing, shop, and news pages have only the first kind and don't change.

## Layout after the change

- **Home:** the page ends after the social links. No gap is left where the block was.
- **About** (mock-ups 2 and 4): on wide screens, the left column (**At a glance**, social links) sits beside **Get in touch**; on phones they stack: heading, **At a glance**, social links, **Get in touch**. The page heading, "About the Artist", stays.
- **Portfolio:** the **Index** filter bar is hidden when there are no items, since there is nothing to filter, and the empty state sits under the page heading.

## What Star sees, and can add

Before Star is invited, the parts this story leaves out are listed in Star's getting-started documentation (written with story-content-editing-sign-in): "Your site is ready for these, and shows nothing until you add them: a portrait, your bio, your artist statement, and the home page's short artist text." So Star knows what's waiting for them, rather than finding out by noticing what's missing.

## States

- **Empty CMS:** every page builds and shows the states above (REQ-site-5). Tested with the empty fixture build.
- **Once Star adds content** through Site settings (a later story), each left-out part appears again as designed there.

## Open questions

1. The facts that stay on the about page (pronouns, "Vancouver, BC", what Star makes and loves) and the email address are hard-coded today. They need Star's confirmation before Star is invited; they move into Site settings with that story, so Star can correct them without a developer.

## Persona walkthrough

A walkthrough for persona-fan and persona-artist (2026-11-01) found nothing blocking. Addressed here: the commissions page's terms-of-service placeholder (and the rule separating empty states from placeholder copy); a way on from an empty portfolio; a phone mock-up of the about page; telling Star what's waiting for their content; and confirming the remaining facts with Star (open question 1). Mock-ups corrected: the about heading and all four social links.

## Accessibility

- Left-out parts are removed from the page, not hidden visually, so screen readers never announce empty or placeholder sections.
- The portfolio's empty state is ordinary text under the main heading.
