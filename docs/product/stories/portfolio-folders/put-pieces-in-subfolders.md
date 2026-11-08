---
id: story-portfolio-folders-put-pieces-in-subfolders
status: draft
derived-from:
  - epic-portfolio-folders#outcome: 0a70fc8bd1ef
  - epic-portfolio-folders#decisions-from-the-lead-2026-11-08: e4efe797da18
  - persona-artist#goals: f3044c738f84
  - persona-artist#skills-and-tools: 4e28d5374320
---

# Put pieces in subfolders

<!-- docs/product/stories/portfolio-folders/put-pieces-in-subfolders.md. Story 3 of epic-portfolio-folders. -->

As Star, I want to make subfolders in a folder and put pieces in them, in the editor, so that the Portfolio groups my work the way I think of it.

## Acceptance criteria

- **Art** has subfolders as items of their own. A subfolder has a **Name** (shown on its thumbnail and on the folder's tab when it's open), the **Folder** it's in (one of the Portfolio sections), and a **Grid size** for its thumbnail, chosen from a few options (such as 2 × 2 and 3 × 3). Name and folder are required.
- A piece has an optional field for its subfolders: for each Portfolio section the piece is in, at most one subfolder of that section. A piece can be in Fan Work's Murderbot subfolder and loose in Featured. A subfolder of a section the piece isn't in can't be chosen.
- Taking a piece out of a section also takes it out of that section's subfolder, and the editor says so.
- A subfolder with no pieces doesn't show on the site; deleting a subfolder leaves its pieces loose in their folder.
- Renaming a subfolder renames it everywhere at once.
- The fields' help texts say what a subfolder is and where it shows, in plain words, as the other fields do; the piece's row in the **Art** list shows its subfolders after its sections.
- Star's guide `editing-your-site.md` says how to make a subfolder, choose its grid size, put pieces in it, rename it and delete it; it's an existing guide, so the help menu needs nothing new.
- Publishing a subfolder or a piece's subfolder shows on the site with the next update, as any change does (design-know-when-live).
