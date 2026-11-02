// The series' Chapters list and Add chapter (AC-11; design mock-up 1).
import { AddIcon } from '@sanity/icons';
import { Button, Card, Stack, Text } from '@sanity/ui';
import { forwardRef, useEffect, useState, type ComponentProps } from 'react';
import { useClient, useFormValue, type StringInputProps } from 'sanity';
import { IntentLink } from 'sanity/router';
import { chapterRow, nextChapterNumber } from '../lib/comic-pages';
import { publishedId } from '../lib/upload-store';

interface Row { _id: string; number: number; title?: string; pageCount: number }
export const CHAPTER_TEMPLATE = 'comicChapter-in-series';

// Sanity UI's `as` doesn't pass IntentLink's own props through its types; bind them here.
const linkTo = (intent: string, params: ComponentProps<typeof IntentLink>['params']) =>
  forwardRef<HTMLAnchorElement, Omit<ComponentProps<'a'>, 'ref'>>(function Link(props, ref) {
    return <IntentLink {...props} ref={ref} intent={intent} params={params} />;
  });

const QUERY = `*[_type == "comicChapter" && series._ref == $series] { _id, number, title, "pageCount": count(pages) }`;

export function ChaptersList(_props: StringInputProps) {
  const id = useFormValue(['_id']) as string | undefined;
  const series = id ? publishedId(id) : undefined;
  const client = useClient({ apiVersion: '2024-01-01' });
  const [rows, setRows] = useState<Row[] | null>(null);

  useEffect(() => {
    if (!series) return;
    let alive = true;
    const load = () => client.fetch<Row[]>(QUERY, { series }, { perspective: 'raw' }).then((r) => alive && setRows(r));
    load();
    const sub = client.listen(QUERY, { series }, { visibility: 'query' }).subscribe(() => load());
    return () => { alive = false; sub.unsubscribe(); };
  }, [client, series]);

  // One row per chapter: the draft if there is one, published if a published version exists.
  const chapters = new Map<string, Row & { published: boolean }>();
  for (const row of rows ?? []) {
    const pid = publishedId(row._id);
    const existing = chapters.get(pid);
    const isDraft = row._id !== pid;
    if (!existing || isDraft) chapters.set(pid, { ...row, _id: pid, published: existing?.published || !isDraft });
    else existing.published = true;
  }
  const list = [...chapters.values()].sort((a, b) => a.number - b.number);
  const next = nextChapterNumber(list.map((c) => c.number));

  if (!series) return null;
  return (
    <Stack space={2}>
      {rows === null && <Text size={1} muted>Loading chapters…</Text>}
      {rows !== null && list.length === 0 && <Text size={1} muted>No chapters yet.</Text>}
      {list.map((c) => (
        <Card key={c._id} as={linkTo('edit', { id: c._id, type: 'comicChapter' })} padding={3} radius={2} border>
          <Text size={1}>{chapterRow({ ...c, pageCount: c.pageCount ?? 0 })}</Text>
        </Card>
      ))}
      <Button
        as={linkTo('create', [{ type: 'comicChapter', template: CHAPTER_TEMPLATE }, { seriesId: series, number: next }])}
        icon={AddIcon} text="Add chapter" mode="ghost"
      />
    </Stack>
  );
}
