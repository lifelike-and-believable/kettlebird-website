// A comic's Largest page width, with a line saying how wide the comic's pictures are, which the editor doesn't
// otherwise show (docs/specs/comic-reader-page-size.md AC-3; design-comic-page-width mock-up 8).
import { Card, Stack, Text } from '@sanity/ui';
import { useEffect, useState } from 'react';
import { useClient, useFormValue, type NumberInputProps } from 'sanity';
import { picturesSizesLine } from '../lib/comic-pages';
import { publishedId } from '../lib/upload-store';

const QUERY = `*[_type == "comicChapter" && series._ref == $series].pages[] { spread, "width": asset->metadata.dimensions.width }`;

export function LargestPageWidthInput(props: NumberInputProps) {
  const id = useFormValue(['_id']) as string | undefined;
  const client = useClient({ apiVersion: '2024-01-01' });
  const [line, setLine] = useState<string>();
  useEffect(() => {
    if (!id) return undefined;
    const series = publishedId(id);
    const read = () =>
      client.fetch<{ spread?: boolean; width?: number }[]>(QUERY, { series }).then((pages) => setLine(picturesSizesLine(pages ?? [])));
    read().catch(() => setLine(undefined));
    const sub = client.listen(`*[_type == "comicChapter" && series._ref == $series]`, { series }).subscribe(() => void read().catch(() => undefined));
    return () => sub.unsubscribe();
  }, [client, id]);
  return (
    <Stack space={3}>
      {line && (
        <Card padding={3} radius={2} tone="primary" border>
          <Text size={1}>{line}</Text>
        </Card>
      )}
      {props.renderDefault(props)}
    </Stack>
  );
}
