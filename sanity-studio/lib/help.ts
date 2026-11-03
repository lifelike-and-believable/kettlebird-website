// Help in the editor: the top bar's menu and each item's link (docs/specs/content-editing-help-links.md
// AC-8 to AC-10; design-help-links). Pure. STUB: tests first.

export interface HelpLink {
  /** What the link says. */
  text: string;
  /** The site address, /help/… */
  path: string;
}

/** The Help menu: the six guides by title, then All help. */
export const HELP_MENU: HelpLink[] = [];

/** Each item type's link at the top of the item. */
export const ITEM_HELP: Record<string, HelpLink> = {};

/** The accessible name of a link that opens a new tab. */
export function newTabName(_text: string): string {
  throw new Error('not implemented');
}
