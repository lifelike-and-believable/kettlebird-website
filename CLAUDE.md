# Working on this repository

The process is rules-for-robots (`.rfr/`, `docs/product/process.yml`): stories, designs with mock-ups, user guides, specs with tests first, each approved by the lead's merge.

## Standing decisions from the lead

- **Every new guide for Star joins the site's online help** (2026-11-03). A guide added to `docs/user/` for Star also gets:
  - a `summary:` line in its front matter;
  - its name in `GUIDE_NAMES` (`src/lib/help/guides.ts`), in the order Star needs it;
  - its title and address in the editor's **Help** menu (`HELP_MENU`, `sanity-studio/lib/help.ts`);
  - links from the item types it covers (`ITEM_HELP`), when it's the guide for them.

  A feature's design says where its guide sits in the help. Fans' guides (like `reading-comics.md`) go in `FAN_GUIDES` instead. `tests/unit/help-every-guide.test.ts` fails if a guide is in neither list.
