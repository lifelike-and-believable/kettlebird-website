// Help in the editor: the top bar's menu and each item's link (docs/specs/content-editing-help-links.md
// AC-8 to AC-10; design-help-links). Pure. The site's build checks every address here against the
// guides it builds (src/pages/help/index.astro), so a renamed section fails the build.

export interface HelpLink {
  /** What the link says. */
  text: string;
  /** The site address, /help/… */
  path: string;
}

/** The Help menu: the six guides by title, then All help. */
export const HELP_MENU: HelpLink[] = [
  { text: "Getting started with your site's editor", path: '/help/getting-started' },
  { text: 'Editing your art, writing, shop and commissions', path: '/help/editing-your-site' },
  { text: 'Publishing comic pages and chapters', path: '/help/publishing-comics' },
  { text: 'Putting stories on the site', path: '/help/publishing-stories' },
  { text: 'Commissions, your about page, the home page and your links', path: '/help/site-settings' },
  { text: 'See it before you publish', path: '/help/previewing' },
  { text: 'When your change is live', path: '/help/going-live' },
  { text: 'All help', path: '/help' },
];

const item = (heading: string, path: string): HelpLink => ({ text: `Help: ${heading}`, path });

/** Each item type's link at the top of the item. */
export const ITEM_HELP: Record<string, HelpLink> = {
  comicSeries: item('Start a new comic', '/help/publishing-comics#start-a-new-comic'),
  comicChapter: item('Add a chapter', '/help/publishing-comics#add-a-chapter'),
  galleryItem: item('Art', '/help/editing-your-site#art'),
  writtenWork: item('Start a new story', '/help/publishing-stories#start-a-new-story'),
  storyChapter: item('Add a chapter to a story', '/help/publishing-stories#add-a-chapter-to-a-story'),
  product: item('Shop', '/help/editing-your-site#shop'),
  commissionType: item('Commissions', '/help/editing-your-site#commissions'),
  commissionSettings: item('Open or close commissions', '/help/site-settings#open-or-close-commissions'),
  aboutPage: item('Your about page', '/help/site-settings#your-about-page'),
  homePage: item('The home page', '/help/site-settings#the-home-page'),
  contactSettings: item('Your contact email and social links', '/help/site-settings#your-contact-email-and-social-links'),
};

/** The accessible name of a link that opens a new tab. */
export function newTabName(text: string): string {
  return `${text} (opens in a new tab)`;
}
