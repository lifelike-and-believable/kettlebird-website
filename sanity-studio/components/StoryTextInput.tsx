// A story's or a chapter's Text: pasting goes through the story clean-up (AC-4); on a story with
// chapters, a note replaces it (AC-8); on a chapter just made from a one-shot, a note says where the
// text came from until the chapter is published (AC-7). docs/specs/story-reader-editor.md.
import { Card, Stack, Text } from '@sanity/ui';
import { useCallback, useEffect, useState } from 'react';
import { useClient, useEditState, useFormValue, type PortableTextInputProps } from 'sanity';
import { usePaneRouter } from 'sanity/structure';
import { HAS_CHAPTERS_NOTE, MOVED_NOTE } from '../lib/stories';
import { pasteHtml } from '../lib/story-paste';
import { publishedId } from '../lib/upload-store';

const parseHtml = (html: string) => new DOMParser().parseFromString(html, 'text/html');
const escape = (text: string) => text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
/** Plain text as one paragraph per line, so its symbol lines and gaps are cleaned as HTML's are. */
const textAsHtml = (text: string) => text.split(/\r?\n/).map((line) => `<p>${escape(line)}</p>`).join('');

const HAS_CHAPTERS = 'count(*[_type == "storyChapter" && story._ref == $id]) > 0';

function useHasChapters(storyId: string | undefined): boolean {
  const client = useClient({ apiVersion: '2024-01-01' });
  const [has, setHas] = useState(false);
  useEffect(() => {
    if (!storyId) return;
    let alive = true;
    const load = () => client.fetch<boolean>(HAS_CHAPTERS, { id: storyId }, { perspective: 'raw' }).then((v) => alive && setHas(v));
    load();
    const sub = client.listen(`*[_type == "storyChapter" && story._ref == $id]`, { id: storyId }, { visibility: 'query' }).subscribe(() => load());
    return () => { alive = false; sub.unsubscribe(); };
  }, [client, storyId]);
  return has;
}

const Note = ({ text }: { text: string }) => (
  <Card tone="primary" padding={3} radius={2} border role="note">
    <Text size={1}>{text}</Text>
  </Card>
);

export function StoryTextInput(props: PortableTextInputProps) {
  const type = useFormValue(['_type']) as string | undefined;
  const id = useFormValue(['_id']) as string | undefined;
  const pid = id ? publishedId(id) : undefined;
  const isStory = type === 'writtenWork';
  const hasChapters = useHasChapters(isStory ? pid : undefined);
  const { params } = usePaneRouter();
  const chapterState = useEditState(pid ?? 'none', 'storyChapter');
  const moved = !isStory && params?.moved === '1' && !chapterState.published;

  const onPaste = useCallback<NonNullable<PortableTextInputProps['onPaste']>>(({ event }) => {
    const html = event.clipboardData?.getData('text/html');
    const text = event.clipboardData?.getData('text/plain');
    if (!html && !text) return undefined;
    return { insert: pasteHtml(html || textAsHtml(text ?? ''), parseHtml) as never };
  }, []);

  if (isStory && hasChapters) {
    // The text stays visible if any is left, so nothing is hidden from Star.
    return (
      <Stack space={3}>
        <Note text={HAS_CHAPTERS_NOTE} />
        {Array.isArray(props.value) && props.value.length > 0 && props.renderDefault({ ...props, onPaste })}
      </Stack>
    );
  }
  return (
    <Stack space={3}>
      {moved && <Note text={MOVED_NOTE} />}
      {props.renderDefault({ ...props, onPaste })}
    </Stack>
  );
}
