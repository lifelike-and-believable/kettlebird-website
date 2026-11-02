// Site settings, until content-editing story 4 builds it (content-editing-organised-editor AC-10).
import { Card, Text } from '@sanity/ui';
import { SITE_SETTINGS_NOTE } from '../lib/editor-content';

export function SiteSettingsNote() {
  return (
    <Card padding={4}>
      <Text>{SITE_SETTINGS_NOTE}</Text>
    </Card>
  );
}
