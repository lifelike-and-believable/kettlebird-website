// Help in the editor's top bar, just left of the live status: a menu of Star's guides, each opening
// in a new tab (docs/specs/content-editing-help-links.md AC-8; design-help-links, mock-ups 4 and 7).
// Always a button with the word "Help", so it isn't mistaken for Sanity's own "?" menu.
import { ChevronDownIcon } from '@sanity/icons';
import { Button, Menu, MenuButton, MenuDivider, MenuItem } from '@sanity/ui';
import { HELP_MENU, newTabName } from '../lib/help';

export function HelpMenu() {
  const guides = HELP_MENU.slice(0, -1);
  const all = HELP_MENU[HELP_MENU.length - 1];
  const item = (link: (typeof HELP_MENU)[number]) => (
    <MenuItem
      key={link.path}
      as="a"
      href={link.path}
      target="_blank"
      rel="noopener"
      aria-label={newTabName(link.text)}
      text={link.text}
      iconRight={<span aria-hidden="true">↗</span>}
    />
  );
  return (
    <MenuButton
      id="kettlebird-help"
      button={<Button mode="ghost" text="Help" iconRight={ChevronDownIcon} />}
      menu={
        <Menu>
          {guides.map(item)}
          <MenuDivider />
          {item(all)}
        </Menu>
      }
      popover={{ placement: 'bottom-end', portal: true }}
    />
  );
}
