// A chapter's Open on, with a note when its comic shows one page at a time
// (docs/specs/comic-reader-comic-settings.md AC-7; design mock-up 15). The choice stays changeable.
import { Card, Stack, Text } from '@sanity/ui';
import type { StringInputProps } from 'sanity';
import { OPEN_ON_OFF_NOTE } from '../lib/comic-pages';
import { useComicTwoUp } from './useComicTwoUp';

export function OpenOnInput(props: StringInputProps) {
  const twoUp = useComicTwoUp();
  return (
    <Stack space={3}>
      {twoUp === false && (
        <Card padding={3} radius={2} tone="primary" border>
          <Text size={1}>{OPEN_ON_OFF_NOTE}</Text>
        </Card>
      )}
      {props.renderDefault(props)}
    </Stack>
  );
}
