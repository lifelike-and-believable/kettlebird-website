---
id: tutorial-reading-comics
status: approved
runner: web
derived-from:
  - docs-reading-comics#start-a-comic: 56a68bb5670f
  - docs-reading-comics#turn-pages: b0976c6d3152
  - docs-reading-comics#when-you-reach-the-end: 13d6837fff63
---

# Tutorial: read a comic from the start into its second chapter

<!-- docs/tutorials/reading-comics.md. Runs against a build with the fixture comics
(KETTLEBIRD_FIXTURES=1): node .rfr/checks/tutorial-run.mjs . --base-url <url>. Until Star's comics
are in the CMS, the live site has no comics to read, so the runner uses the fixture build. -->

You'll open a comic, start at its first page, turn pages into the next chapter, and reach the newest page.

## Steps

1. Open `/comics`. You see **Comics**.
2. Click **Kettle Tales**. You see **Start reading**.
3. You see **Chapter 2: The Long Road**.
4. Click **Start reading**. You see **Chapter 1: The Kettle · Page 1 of 3**.
5. Click **Next page**. You see **Chapter 1: The Kettle · Page 2 of 3**.
6. Click **Next page**. You see **Chapter 1: The Kettle · Page 3 of 3**.
7. Click **Next page**. You see **Chapter 2: The Long Road · Page 1 of 2**.
8. Click **Previous page**. You see **Chapter 1: The Kettle · Page 3 of 3**.
9. Click **Back to series**. You see **Chapters**.
10. Click **Chapter 4: Homeward**. You see **You're all caught up!**
11. You see **New pages are on the way.**

## What you found

The comic's page lists its chapters, **Start reading** opens the first page, **Next page** carries you from one chapter into the next, and the newest page tells you more is on the way.
