---
id: requirements-writing
status: draft
derived-from:
  - concept:
---

# Writing requirements

<!-- Drafted by bootstrap from src/pages/writing.astro and src/pages/news.astro. -->

## REQ-writing-1: Works list

The writing page lists every written work in the CMS with its cover, title, genres, and excerpt. With no works it shows "Stories coming soon — check back shortly!"

## REQ-writing-2: Read elsewhere

A work with an external link shows "Read it →", which opens that link in a new tab. (Today these links go to AO3.)

## REQ-writing-3: News feed

The news page lists the 20 most recent gallery items and written works together, newest first. Art links to the portfolio; writing links to its external link, or to the writing page if it has none.

## Open questions

1. The schema has a `content` field for the full text, but the site never shows it. Should stories be readable on the site (the original plan had a page-flip reader), or stay on AO3?
2. The news page is generated from new art and writing; there is no way to post an announcement. Is that enough?
