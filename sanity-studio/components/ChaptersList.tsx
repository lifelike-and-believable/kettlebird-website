// A series' or a story's Chapters list and Add chapter (comic-publish-pages AC-11; story-reader-editor
// AC-6, AC-7). A chapter opens as the pane's child, beside it, with its row highlighted
// (organised-editor AC-14). On a one-shot story, Add chapter first moves its text into Chapter 1.
import { AddIcon } from '@sanity/icons';
import { Button, Card, Stack, Text } from '@sanity/ui';
import { forwardRef, useEffect, useState, type ComponentProps, type ComponentType } from 'react';
import { useClient, useDocumentOperation, useFormValue, type StringInputProps } from 'sanity';
import { useRouter } from 'sanity/router';
import { usePaneRouter, type ChildLinkProps } from 'sanity/structure';
import { chapterRow, nextChapterNumber } from '../lib/comic-pages';
import { firstChapterFrom, storyChapterRow, type Block } from '../lib/stories';
import { publishedId } from '../lib/upload-store';

interface Row { _id: string; number: number; title?: string; pageCount?: number }
export const CHAPTER_TEMPLATE = 'comicChapter-in-series';
export const STORY_CHAPTER_TEMPLATE = 'storyChapter-in-story';

/** What differs between a series' chapters and a story's. */
const KINDS = {
  comicSeries: {
    query: `*[_type == "comicChapter" && series._ref == $parent] { _id, number, title, "pageCount": count(pages) }`,
    template: CHAPTER_TEMPLATE,
    row: (c: Row & { published: boolean }) => chapterRow({ ...c, pageCount: c.pageCount ?? 0 }),
  },
  writtenWork: {
    query: `*[_type == "storyChapter" && story._ref == $parent] { _id, number, title }`,
    template: STORY_CHAPTER_TEMPLATE,
    row: (c: Row & { published: boolean }) => storyChapterRow(c),
  },
} as const;

type Panes = { id: string; params?: Record<string, string> }[][];

// Sanity UI's `as` doesn't pass ChildLink's own props through its types; bind them here.
const linkTo = (ChildLink: ComponentType<ChildLinkProps>, props: Omit<ChildLinkProps, 'children'>) =>
  forwardRef<HTMLAnchorElement, Omit<ComponentProps<'a'>, 'ref'>>(function Link({ children, ...rest }, ref) {
    // ChildLink renders Sanity's own link and passes other props to its <a>; its type lists only its own.
    const Link = ChildLink as ComponentType<ChildLinkProps & Omit<ComponentProps<'a'>, 'children'>>;
    return <Link {...rest} {...props} ref={ref}>{children}</Link>;
  });

const newChapterId = () => (crypto.randomUUID ? crypto.randomUUID() : `${Date.now().toString(36)}${Math.random().toString(36).slice(2)}`);

export function ChaptersList(_props: StringInputProps) {
  const id = useFormValue(['_id']) as string | undefined;
  const type = (useFormValue(['_type']) as string | undefined) === 'writtenWork' ? 'writtenWork' : 'comicSeries';
  const kind = KINDS[type];
  const storyText = useFormValue(['content']) as Block[] | undefined;
  const storyUpload = useFormValue(['textUpload']) as Record<string, unknown> | undefined;
  const parent = id ? publishedId(id) : undefined;
  const client = useClient({ apiVersion: '2024-01-01' });
  const ops = useDocumentOperation(parent ?? 'none', type);
  const router = useRouter();
  const [rows, setRows] = useState<Row[] | null>(null);
  const [moving, setMoving] = useState(false);
  const { ChildLink, routerPanesState, groupIndex } = usePaneRouter();
  const openId = routerPanesState[groupIndex + 1]?.[0]?.id;
  // A fresh id for each new chapter, so a second Add chapter doesn't reopen the first.
  const [newId, setNewId] = useState(newChapterId);

  useEffect(() => {
    if (!parent) return;
    let alive = true;
    const load = () => client.fetch<Row[]>(kind.query, { parent }, { perspective: 'raw' }).then((r) => alive && setRows(r));
    load();
    const sub = client.listen(kind.query, { parent }, { visibility: 'query' }).subscribe(() => load());
    return () => { alive = false; sub.unsubscribe(); };
  }, [client, parent, kind]);

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
  // AC-7: a one-shot's Add chapter moves its text into Chapter 1.
  const first = type === 'writtenWork' && rows !== null && list.length === 0 ? firstChapterFrom(storyText, storyUpload) : null;

  if (!parent) return null;

  const moveIntoChapterOne = async () => {
    if (!first?.content) return;
    setMoving(true);
    const chapterId = newChapterId();
    try {
      await client.create({
        _id: `drafts.${chapterId}`,
        _type: 'storyChapter',
        // Weak until published, so a chapter can be set up before its new story is on the site.
        story: { _type: 'reference', _ref: parent, _weak: true, _strengthenOnPublish: { type: 'writtenWork' } },
        number: first.number,
        content: first.content,
        // story-import-word AC-19: the upload line moves with the text.
        // Without its Undo copy: the story's upload may already be published, and Undo would bring back pictures removed since.
        ...(first.textUpload ? { textUpload: { ...first.textUpload, previous: undefined } } : {}),
      });
      ops.patch.execute([{ unset: ['content', 'textUpload'] }]);
      const panes = (routerPanesState as Panes).slice(0, groupIndex + 1).concat([[{ id: chapterId, params: { moved: '1' } }]]);
      router.navigate({ ...router.state, panes });
    } finally {
      setMoving(false);
    }
  };

  return (
    <Stack space={2}>
      {rows === null && <Text size={1} muted>Loading chapters…</Text>}
      {rows !== null && list.length === 0 && <Text size={1} muted>No chapters yet.</Text>}
      {list.map((c) => (
        <Card key={c._id} as={linkTo(ChildLink, { childId: c._id })} padding={3} radius={2} border
          tone={openId === c._id ? 'primary' : 'default'} aria-current={openId === c._id ? 'true' : undefined}>
          <Text size={1}>{kind.row(c)}</Text>
        </Card>
      ))}
      {first?.moved ? (
        <Button onClick={moveIntoChapterOne} disabled={moving} icon={AddIcon} text="Add chapter" mode="ghost" />
      ) : (
        <Button
          as={linkTo(ChildLink, { childId: newId, childParameters: { template: kind.template, number: String(next) } })}
          onClick={() => setTimeout(() => setNewId(newChapterId()))}
          icon={AddIcon} text="Add chapter" mode="ghost"
        />
      )}
    </Stack>
  );
}
