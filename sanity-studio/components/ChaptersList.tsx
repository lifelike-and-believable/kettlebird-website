// The series' Chapters list and Add chapter (comic-publish-pages AC-11; design mock-up 1). A chapter
// opens as this series pane's child, beside it, with its row highlighted (organised-editor AC-14).
import { AddIcon } from '@sanity/icons';
import { Button, Card, Stack, Text } from '@sanity/ui';
import { forwardRef, useEffect, useState, type ComponentProps, type ComponentType } from 'react';
import { useClient, useFormValue, type StringInputProps } from 'sanity';
import { usePaneRouter, type ChildLinkProps } from 'sanity/structure';
import { chapterRow, nextChapterNumber } from '../lib/comic-pages';
import { publishedId } from '../lib/upload-store';

interface Row { _id: string; number: number; title?: string; pageCount: number }
export const CHAPTER_TEMPLATE = 'comicChapter-in-series';

// Sanity UI's `as` doesn't pass ChildLink's own props through its types; bind them here.
const linkTo = (ChildLink: ComponentType<ChildLinkProps>, props: Omit<ChildLinkProps, 'children'>) =>
  forwardRef<HTMLAnchorElement, Omit<ComponentProps<'a'>, 'ref'>>(function Link({ children, ...rest }, ref) {
    // ChildLink renders Sanity's own link and passes other props to its <a>; its type lists only its own.
    const Link = ChildLink as ComponentType<ChildLinkProps & Omit<ComponentProps<'a'>, 'children'>>;
    return <Link {...rest} {...props} ref={ref}>{children}</Link>;
  });

const newChapterId = () => (crypto.randomUUID ? crypto.randomUUID() : `${Date.now().toString(36)}${Math.random().toString(36).slice(2)}`);

const QUERY = `*[_type == "comicChapter" && series._ref == $series] { _id, number, title, "pageCount": count(pages) }`;

export function ChaptersList(_props: StringInputProps) {
  const id = useFormValue(['_id']) as string | undefined;
  const series = id ? publishedId(id) : undefined;
  const client = useClient({ apiVersion: '2024-01-01' });
  const [rows, setRows] = useState<Row[] | null>(null);
  const { ChildLink, routerPanesState, groupIndex } = usePaneRouter();
  const openId = routerPanesState[groupIndex + 1]?.[0]?.id;
  // A fresh id for each new chapter, so a second Add chapter doesn't reopen the first.
  const [newId, setNewId] = useState(newChapterId);

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
        <Card key={c._id} as={linkTo(ChildLink, { childId: c._id })} padding={3} radius={2} border
          tone={openId === c._id ? 'primary' : 'default'} aria-current={openId === c._id ? 'true' : undefined}>
          <Text size={1}>{chapterRow({ ...c, pageCount: c.pageCount ?? 0 })}</Text>
        </Card>
      ))}
      <Button
        as={linkTo(ChildLink, { childId: newId, childParameters: { template: CHAPTER_TEMPLATE, number: String(next) } })}
        onClick={() => setTimeout(() => setNewId(newChapterId()))}
        icon={AddIcon} text="Add chapter" mode="ghost"
      />
    </Stack>
  );
}
