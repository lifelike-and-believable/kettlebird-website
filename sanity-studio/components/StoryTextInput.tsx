// A story's or a chapter's Text, filled by uploading a Word document (docs/specs/story-import-word.md;
// design-story-import): Upload a Word document and the drop space, reading, the read-only text, the upload line with
// Undo this upload, the note, the messages, the replace question and Pictures with their alt text. On a story with
// chapters, a note replaces it (story-reader-editor AC-8); on a chapter just made from a one-shot, a note says where
// the text came from until it's published (AC-7). The Word reader loads only when a document is chosen (AC-17).
import { CloseIcon, UploadIcon } from '@sanity/icons';
import { Badge, Box, Button, Card, Checkbox, Dialog, Flex, Stack, Text, TextInput } from '@sanity/ui';
import { useCallback, useEffect, useId, useRef, useState, type DragEvent, type ReactNode } from 'react';
import { set, useClient, useDocumentOperation, useEditState, useFormValue, type PortableTextInputProps } from 'sanity';
import { usePaneRouter } from 'sanity/structure';
import { HAS_CHAPTERS_NOTE, MOVED_NOTE } from '../lib/stories';
import { publishedId } from '../lib/upload-store';
import {
  ACCEPT,
  dropEmpty,
  DROP_OVER,
  fileProblem,
  FROM_WORD,
  readingLine,
  readProblem,
  replaceQuestion,
  UNDO_QUESTION,
  UPLOAD_BUTTON,
  UPLOAD_HINT,
  UPLOAD_NEW,
  uploadLine,
  uploadNote,
  type TextOf,
} from '../lib/word/messages';
import {
  ALT_MARK,
  ALT_MISSING_LINE,
  altCountLine,
  altLabel,
  DECORATIVE_LABEL,
  editedSince,
  matchPictures,
  needsAlt,
  pictureAssets,
  pictureHash,
  undoFrom,
  undoSnapshot,
  type PictureSettings,
} from '../lib/word/pictures';

const HAS_CHAPTERS = 'count(*[_type == "storyChapter" && story._ref == $id]) > 0';

interface Span { _type: string; text?: string; marks?: string[] }
interface TextBlock {
  _type: string;
  _key: string;
  children?: Span[];
  image?: { asset?: { _ref?: string } };
  alt?: string;
  decorative?: boolean;
  fromWord?: boolean;
  wordAlt?: string;
  wordDecorative?: boolean;
  hash?: string;
  edited?: boolean;
}
interface TextUpload {
  fileName?: string;
  addedAt?: string;
  note?: string[];
  noteClosed?: boolean;
  previous?: string;
  discarded?: string[];
}
type Question = { title: string; lines: string[]; cancel: string; confirm: string; answer: (yes: boolean) => void };

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

const Note = ({ children, tone = 'primary', role = 'note' }: { children: ReactNode; tone?: 'primary' | 'critical' | 'caution'; role?: string }) => (
  <Card tone={tone} padding={3} radius={2} border role={role}>
    {children}
  </Card>
);

const randomKey = () => Math.random().toString(36).slice(2, 10);

/** A thumbnail address from an image asset's id: image-<id>-<w>x<h>-<ext>. */
function thumbnail(ref: string | undefined, config: { projectId?: string; dataset?: string }, width = 480): string | undefined {
  const match = ref && /^image-([^-]+)-(\d+x\d+)-(\w+)$/.exec(ref);
  if (!match || !config.projectId || !config.dataset) return undefined;
  return `https://cdn.sanity.io/images/${config.projectId}/${config.dataset}/${match[1]}-${match[2]}.${match[3]}?w=${width}`;
}

/** The text as readers will get it, read-only. */
function ReadOnlyText({ blocks, config }: { blocks: TextBlock[]; config: { projectId?: string; dataset?: string } }) {
  let picture = 0;
  return (
    <Card padding={4} radius={2} border tone="transparent" data-testid="story-text-read-only">
      <Stack space={4}>
        {blocks.map((block) => {
          if (block._type === 'sceneBreak') {
            return (
              <Card key={block._key} padding={2} radius={2} tone="primary">
                <Text size={1} align="center" muted>Scene break</Text>
              </Card>
            );
          }
          if (block._type === 'storyPicture') {
            picture += 1;
            const src = thumbnail(block.image?.asset?._ref, config);
            return (
              <Box key={block._key}>
                {src ? <img src={src} alt={block.decorative ? '' : block.alt || `Picture ${picture}`} style={{ maxWidth: '100%', maxHeight: 320, display: 'block', margin: '0 auto' }} /> : null}
                <Text size={0} muted align="center">Picture {picture}</Text>
              </Box>
            );
          }
          return (
            <Text key={block._key} size={2}>
              {(block.children ?? []).map((span, i) => {
                const parts = (span.text ?? '').split('\n').flatMap((line, j) => (j ? [<br key={`br${j}`} />, line] : [line]));
                let node: ReactNode = parts;
                if (span.marks?.includes('strong')) node = <strong>{node}</strong>;
                if (span.marks?.includes('em')) node = <em>{node}</em>;
                return <span key={i}>{node}</span>;
              })}
            </Text>
          );
        })}
      </Stack>
    </Card>
  );
}

/** Pictures: each picture's Alt text and Decorative (AC-13). */
function PicturesList({ blocks, onChange, config }: { blocks: TextBlock[]; onChange: PortableTextInputProps['onChange']; config: { projectId?: string; dataset?: string } }) {
  const pictures = blocks.filter((b) => b._type === 'storyPicture');
  if (!pictures.length) return null;
  const missing = needsAlt(pictures);
  const edit = (key: string, field: 'alt' | 'decorative', value: string | boolean) =>
    onChange([set(value, [{ _key: key }, field]), set(true, [{ _key: key }, 'edited']), ...(field === 'alt' ? [set(false, [{ _key: key }, 'fromWord'])] : [])]);
  return (
    <Stack space={3} as="section" aria-label="Pictures">
      <Flex align="center" gap={2}>
        <Text size={1} weight="semibold">Pictures</Text>
        <Text size={1} muted={missing === 0}>{altCountLine(missing)}</Text>
      </Flex>
      {pictures.map((p, i) => {
        const needs = !p.decorative && !p.alt?.trim();
        const src = thumbnail(p.image?.asset?._ref, config, 240);
        return (
          <Card key={p._key} padding={3} radius={2} border tone={needs ? 'caution' : 'default'}>
            <Flex gap={3} align="flex-start">
              {src ? <img src={src} alt="" style={{ width: 96, height: 96, objectFit: 'contain', flex: 'none' }} /> : null}
              <Stack space={3} flex={1}>
                <Flex gap={2} align="center">
                  <Text size={1} weight="semibold">Picture {i + 1}</Text>
                  {needs && <Badge tone="caution">{ALT_MARK}</Badge>}
                  {p.fromWord && p.alt && <Badge tone="primary">{FROM_WORD}</Badge>}
                </Flex>
                <AltField label={altLabel(i + 1)} value={p.alt ?? ''} disabled={!!p.decorative} onCommit={(v) => edit(p._key, 'alt', v)} />
                <DecorativeBox checked={!!p.decorative} onChange={(v) => edit(p._key, 'decorative', v)} />
                {needs && <Text size={1}>{ALT_MISSING_LINE}</Text>}
              </Stack>
            </Flex>
          </Card>
        );
      })}
    </Stack>
  );
}

function AltField({ label, value, disabled, onCommit }: { label: string; value: string; disabled: boolean; onCommit: (v: string) => void }) {
  const id = useId();
  const [text, setText] = useState(value);
  useEffect(() => setText(value), [value]);
  return (
    <Stack space={2}>
      <Text as="label" htmlFor={id} size={1}>{label}</Text>
      <TextInput id={id} value={text} disabled={disabled} onChange={(e) => setText(e.currentTarget.value)} onBlur={() => text !== value && onCommit(text)} />
    </Stack>
  );
}

function DecorativeBox({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  const id = useId();
  return (
    <Flex align="center" gap={2}>
      <Checkbox id={id} checked={checked} onChange={(e) => onChange(e.currentTarget.checked)} />
      <Text as="label" htmlFor={id} size={1}>{DECORATIVE_LABEL}</Text>
    </Flex>
  );
}

export function StoryTextInput(props: PortableTextInputProps) {
  const type = useFormValue(['_type']) as string | undefined;
  const id = useFormValue(['_id']) as string | undefined;
  const number = useFormValue(['number']) as number | undefined;
  const title = useFormValue(['title']) as string | undefined;
  const upload = useFormValue(['textUpload']) as TextUpload | undefined;
  const pid = id ? publishedId(id) : undefined;
  const isStory = type === 'writtenWork';
  const of: TextOf = isStory ? 'story' : 'chapter';
  const hasChapters = useHasChapters(isStory ? pid : undefined);
  const { params } = usePaneRouter();
  const editState = useEditState(pid ?? 'none', type ?? 'storyChapter');
  const ops = useDocumentOperation(pid ?? 'none', type ?? 'storyChapter');
  const client = useClient({ apiVersion: '2024-01-01' });
  const config = client.config();
  const moved = !isStory && params?.moved === '1' && !editState.published;
  const blocks = (Array.isArray(props.value) ? props.value : []) as TextBlock[];
  const publishedUpload = (editState.published?.textUpload as TextUpload | undefined)?.addedAt;
  // Published once the published version has this upload, whatever has been changed since (AC-16).
  const published = !!upload?.addedAt && publishedUpload === upload.addedAt;

  const [reading, setReading] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [over, setOver] = useState(false);
  const [question, setQuestion] = useState<Question | null>(null);
  const fileInput = useRef<HTMLInputElement>(null);
  const button = useRef<HTMLButtonElement>(null);

  const ask = (q: Omit<Question, 'answer'>) =>
    new Promise<boolean>((resolve) => setQuestion({ ...q, answer: (yes) => { setQuestion(null); resolve(yes); button.current?.focus(); } }));

  const patch = useCallback((value: { content?: unknown[]; textUpload?: TextUpload }) => {
    const setOps: Record<string, unknown> = {};
    const unsetOps: string[] = [];
    for (const [k, v] of Object.entries(value)) {
      if (v === undefined || (Array.isArray(v) && v.length === 0 && k === 'content')) unsetOps.push(k);
      else setOps[k] = v;
    }
    ops.patch.execute([...(Object.keys(setOps).length ? [{ set: setOps }] : []), ...(unsetOps.length ? [{ unset: unsetOps }] : [])]);
  }, [ops]);

  const addFile = async (file: File, onlyOne: boolean) => {
    setMessage(null);
    const problem = fileProblem(file, of);
    if (problem) return setMessage(problem);
    setReading(readingLine(file.name));
    try {
      const { readWordDocument, WordProblem } = await import('../lib/word/upload');
      let doc;
      try {
        doc = readWordDocument(new Uint8Array(await file.arrayBuffer()), {
          parseXml: (xml) => new DOMParser().parseFromString(xml, 'application/xml'),
          parseHtml: (html) => new DOMParser().parseFromString(html, 'text/html'),
          titles: isStory ? { story: title } : { number, title },
        });
      } catch (e) {
        return setMessage(readProblem(e instanceof WordProblem && e.kind !== 'unreadable' ? e.kind : 'unreadable', file.name));
      }
      const hashes = await Promise.all(doc.pictures.map((p) => pictureHash(p.data)));
      const previous: PictureSettings[] = blocks
        .filter((b) => b._type === 'storyPicture')
        .map((b) => ({
          hash: b.hash ?? '',
          alt: b.alt,
          decorative: !!b.decorative,
          fromWord: !!b.fromWord,
          wordAlt: b.wordAlt,
          wordDecorative: !!b.wordDecorative,
          edited: !!b.edited,
        }));
      // The nth picture block in the text is doc.pictures[picture]; match in the text's order.
      const order = doc.blocks.filter((b) => b._type === 'storyPicture').map((b) => (b as unknown as { picture: number }).picture);
      const match = matchPictures(previous, order.map((i) => ({ hash: hashes[i], wordAlt: doc.pictures[i].wordAlt, wordDecorative: doc.pictures[i].decorative })));
      if (blocks.length) {
        const q = replaceQuestion({
          what: isStory ? {} : { number },
          now: { fileName: upload?.fileName, addedAt: upload?.addedAt, paragraphs: blocks.filter((b) => b._type === 'block').length, pictures: blocks.filter((b) => b._type === 'storyPicture').length },
          next: { fileName: file.name, paragraphs: doc.counts.paragraphs, pictures: doc.counts.pictures, kept: match.kept, changed: match.changed, fresh: match.fresh },
          today: new Date(),
        });
        if (!(await ask(q))) return;
      }
      // Upload each picture once, re-saved.
      const { resavePicture } = await import('../lib/word/resave');
      const assets = new Map<number, string>();
      const failed = [...doc.failed];
      const unique = [...new Set(order)];
      for (const [n, i] of unique.entries()) {
        setReading(readingLine(file.name, n + 1, unique.length));
        const same = unique.slice(0, n).find((j) => hashes[j] === hashes[i]);
        if (same !== undefined && assets.has(same)) {
          assets.set(i, assets.get(same)!);
          continue;
        }
        try {
          const blob = await resavePicture(doc.pictures[i].data, doc.pictures[i].type);
          const asset = await client.assets.upload('image', blob, { filename: `${file.name.replace(/\.docx$/i, '')} picture ${n + 1}` });
          assets.set(i, asset._id);
        } catch {
          failed.push({ number: doc.pictures[i].number, reason: 'upload' });
        }
      }
      let pictureAt = 0;
      // The pictures that came in, in the text's order, with where their alt text came from after matching (AC-11).
      const added: typeof doc.pictures = [];
      const content = doc.blocks.flatMap((b) => {
        if (b._type !== 'storyPicture') return [b];
        const i = (b as unknown as { picture: number }).picture;
        const settings = match.pictures[pictureAt++];
        const asset = assets.get(i);
        if (!asset) return [];
        added.push({ ...doc.pictures[i], alt: settings.alt, fromWord: settings.fromWord });
        return [{
          _type: 'storyPicture',
          _key: b._key ?? randomKey(),
          image: { _type: 'image', asset: { _type: 'reference', _ref: asset } },
          alt: settings.alt,
          decorative: settings.decorative,
          fromWord: settings.fromWord,
          wordAlt: settings.wordAlt,
          wordDecorative: settings.wordDecorative,
          hash: settings.hash,
          // "Changed since the upload" starts again with each upload (AC-16).
          edited: false,
        }];
      });
      const kept = new Set(pictureAssets(content as never));
      const dropped = pictureAssets(blocks as never).filter((a) => !kept.has(a));
      const { previous: _p, ...uploadNow } = upload ?? {};
      const note = uploadNote({ fileName: file.name, doc: { ...doc, pictures: added, failed, counts: { ...doc.counts, pictures: added.length } }, what: of, onlyOne });
      patch({
        content,
        textUpload: {
          fileName: file.name,
          addedAt: new Date().toISOString(),
          note,
          noteClosed: false,
          previous: undoSnapshot(blocks, Object.keys(uploadNow).length ? { ...uploadNow, discarded: undefined } : undefined),
          // A published upload's discarded pictures were removed when it was published.
          discarded: [...(published ? [] : (upload?.discarded ?? [])), ...dropped],
        },
      });
    } catch {
      setMessage(readProblem('unreadable', file.name));
    } finally {
      setReading(null);
    }
  };

  const onFiles = (files: FileList | null) => {
    // One document at a time: nothing while one is being read, or while the text can't be changed (AC-17).
    if (!files?.length || reading || props.readOnly) return;
    void addFile(files[0], files.length > 1);
  };

  const undo = async () => {
    const back = undoFrom(upload?.previous);
    if (!back) return;
    if (editedSince(blocks) && !(await ask({ ...UNDO_QUESTION, lines: [] }))) return;
    const restored = new Set(pictureAssets(back.content as never));
    const dropped = pictureAssets(blocks as never).filter((a) => !restored.has(a));
    const discarded = [...(upload?.discarded ?? []), ...dropped];
    patch({ content: back.content, textUpload: { ...(back.upload as TextUpload | undefined), discarded } });
  };

  const onDrop = (e: DragEvent) => {
    e.preventDefault();
    setOver(false);
    onFiles(e.dataTransfer.files);
  };

  if (isStory && hasChapters) {
    // The text stays visible if any is left, so nothing is hidden from Star.
    return (
      <Stack space={3}>
        <Note><Text size={1}>{HAS_CHAPTERS_NOTE}</Text></Note>
        {blocks.length > 0 && <ReadOnlyText blocks={blocks} config={config} />}
      </Stack>
    );
  }

  const line = upload?.fileName && upload.addedAt ? uploadLine({ fileName: upload.fileName, addedAt: upload.addedAt, published, today: new Date() }) : null;
  const showNote = !!upload?.note?.length && !upload.noteClosed && !published;

  return (
    <Stack space={3}>
      {moved && <Note><Text size={1}>{MOVED_NOTE}</Text></Note>}
      {message && (
        <Note tone="critical" role="alert"><Text size={1}>{message}</Text></Note>
      )}
      <Flex align="center" gap={3} wrap="wrap">
        <Button
          ref={button}
          icon={UploadIcon}
          text={blocks.length ? UPLOAD_NEW : UPLOAD_BUTTON}
          mode={blocks.length ? 'ghost' : 'default'}
          tone="primary"
          disabled={!!reading || props.readOnly}
          onClick={() => fileInput.current?.click()}
        />
        <Text size={1} muted>{UPLOAD_HINT}</Text>
        <input ref={fileInput} type="file" accept={ACCEPT} hidden onChange={(e) => { onFiles(e.currentTarget.files); e.currentTarget.value = ''; }} />
      </Flex>
      {reading && (
        <Note role="status"><Text size={1}>{reading}</Text></Note>
      )}
      {line && (
        <Flex align="center" gap={2} wrap="wrap">
          <Text size={1} muted>{line.text}</Text>
          {line.undo && upload?.previous && (
            <>
              <Text size={1} muted>·</Text>
              <Button mode="bleed" padding={1} fontSize={1} text={line.undo} onClick={() => void undo()} disabled={!!reading} />
            </>
          )}
        </Flex>
      )}
      {showNote && (
        <Card tone="positive" padding={3} radius={2} border role="status">
          <Flex gap={2} align="flex-start">
            <Stack space={2} flex={1}>
              {upload!.note!.map((l, i) => <Text key={i} size={1}>{l}</Text>)}
            </Stack>
            <Button icon={CloseIcon} mode="bleed" padding={2} aria-label="Close the note" onClick={() => patch({ textUpload: { ...upload, noteClosed: true } })} />
          </Flex>
        </Card>
      )}
      <Box onDragOver={(e) => { e.preventDefault(); setOver(true); }} onDragLeave={() => setOver(false)} onDrop={onDrop}>
        {blocks.length ? (
          <ReadOnlyText blocks={blocks} config={config} />
        ) : (
          <Card padding={5} radius={2} border tone={over ? 'primary' : 'transparent'} style={{ borderStyle: 'dashed' }}>
            <Text size={1} align="center" muted={!over}>{over ? DROP_OVER : dropEmpty(of)}</Text>
          </Card>
        )}
      </Box>
      <PicturesList blocks={blocks} onChange={props.onChange} config={config} />
      {question && (
        <Dialog id="story-text-question" header={question.title} onClose={() => question.answer(false)} width={1}
          footer={
            <Flex gap={2} justify="flex-end" padding={3}>
              <Button text={question.cancel} mode="ghost" autoFocus onClick={() => question.answer(false)} />
              <Button text={question.confirm} tone="critical" onClick={() => question.answer(true)} />
            </Flex>
          }>
          <Stack space={3} padding={4}>
            {question.lines.map((l) => <Text key={l} size={1}>{l}</Text>)}
          </Stack>
        </Dialog>
      )}
    </Stack>
  );
}
