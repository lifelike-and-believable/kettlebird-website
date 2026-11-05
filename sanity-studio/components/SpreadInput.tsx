// The Two-page spread tick box, with the note about a page it leaves alone or the question about a
// wide picture under it (docs/specs/comic-reader-spread-and-flip.md AC-10; design mock-ups 9 and 11).
import { Card, Stack, Text } from '@sanity/ui';
import { useFormValue, type BooleanInputProps } from 'sanity';
import { imageSize, pageNote } from '../lib/comic-pages';
import type { OpenOn } from '../lib/pairing';

type Page = { _key?: string; spread?: boolean; asset?: { _ref?: string } };

export function SpreadInput(props: BooleanInputProps) {
  const pages = (useFormValue(['pages']) as Page[] | undefined) ?? [];
  const openOn = useFormValue(['openOn']) as OpenOn | undefined;
  const item = props.path[props.path.length - 2];
  const key = typeof item === 'object' && item && '_key' in item ? item._key : undefined;
  const index = pages.findIndex((p) => p._key === key);
  const note =
    index >= 0
      ? pageNote(pages.map((p) => ({ spread: p.spread, ...imageSize(p.asset?._ref) })), openOn, index + 1)
      : undefined;
  return (
    <Stack space={3}>
      {props.renderDefault(props)}
      {note && (
        <Card padding={3} radius={2} tone="primary" border>
          <Text size={1}>{note}</Text>
        </Card>
      )}
    </Stack>
  );
}

/** A page's tile in the pages grid, marked so PagesInput can make a spread twice as wide. */
export function PageGridItem(props: { value?: unknown; renderDefault: (props: never) => React.ReactNode }) {
  const spread = Boolean((props.value as Page | undefined)?.spread);
  return <div data-kb-spread={spread ? '' : undefined}>{props.renderDefault(props as never)}</div>;
}
