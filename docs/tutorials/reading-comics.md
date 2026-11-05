---
id: tutorial-reading-comics
status: approved
runner: web
derived-from:
  - docs-reading-comics#start-a-comic: 5469a681fb3f
  - docs-reading-comics#turn-pages: b0976c6d3152
  - docs-reading-comics#when-you-reach-the-end: 13d6837fff63
  - docs-reading-comics#reading-on-a-wide-screen: cd9318e73dd0
---

# Tutorial: read a comic from the start into its second chapter

<!-- docs/tutorials/reading-comics.md. Runs against a build with the fixture comics
(KETTLEBIRD_FIXTURES=1): node .rfr/checks/tutorial-run.mjs . --base-url <url>. Until Star's comics
are in the CMS, the live site has no comics to read, so the runner uses the fixture build. The runner's
browser is laptop-sized, so pages pair up (docs/specs/comic-reader-spread-and-flip.md). -->

You'll read on a laptop, where pages show two side by side. You'll open a comic, start at its first page, turn pages, look at a chapter's pages, move to the next chapter, go back to the start, and reach the newest page.

## Steps

1. Open `/comics`. You see **Comics**.
2. Click **Kettle Tales**. You see **Start reading**.
3. You see **Chapter 2: The Long Road**.
4. Click **Start reading**. You see **Chapter 1: The Kettle · Page 1 of 3**.
5. Click **Next**. You see **Chapter 1: The Kettle · Pages 2–3 of 3**.
6. Click **All pages**. You see **2 · You were here**.
7. Click **Chapter 1 of 4 · All chapters**. You see **you're here**.
8. Click **Chapter 2: The Long Road**. You see **Kettle Tales · Chapter 2: The Long Road**.
9. Click **Page 1: The fox sets out at dawn.** You see **Chapter 2: The Long Road · Page 1 of 2**.
10. Click **Previous**. You see **Chapter 1: The Kettle · Pages 2–3 of 3**.
11. Click **First**. You see **Chapter 1: The Kettle · Page 1 of 3**.
12. Click **Newest**. You see **You're all caught up!**
13. You see **New pages are on the way.**
14. Click **Back to series**. You see **Read the newest page**.
15. Click **Read the newest page**. You see **Chapter 4: Homeward · Page 1 of 1**.

## What you found

**Next** carries you through a chapter, two facing pages at a time on a laptop, **All pages** shows a chapter's pages with yours marked, the chapter list opens another chapter's pages, **First** goes back to the start, and **Newest** (or **Read the newest page** on the comic's page) takes you to the newest page, which tells you more is on the way.
