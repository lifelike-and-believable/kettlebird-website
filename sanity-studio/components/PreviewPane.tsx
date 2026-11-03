// The preview beside the form: the site's own page for this item, with its unpublished changes in
// place, at computer or phone width (design-preview; docs/specs/content-editing-preview.md AC-2, AC-6,
// AC-10, AC-11). The site page comes from /preview/<type>/<id> with a one-hour preview key.
import { Box, Button, Card, Flex, Stack, Text } from '@sanity/ui';
import { createPreviewSecret } from '@sanity/preview-url-secret/create-secret';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useClient } from 'sanity';
import { usePaneRouter } from 'sanity/structure';
import {
  pageFromPath,
  PREVIEW_TEXT as T,
  previewUrl,
  regionName,
  scaleToFit,
  SECRET_RENEW_MS,
  SETTLE_MS,
  WIDTHS,
} from '../lib/preview';

type Width = keyof typeof WIDTHS;
type Doc = { _id: string; _type: string; _rev?: string; pages?: { _key?: string }[] } | null | undefined;
interface Props {
  documentId: string;
  schemaType: { name: string };
  document: { displayed: Doc; draft: Doc; published: Doc };
}
interface PageInfo { name: string; notes: string[]; message?: string }

const WIDTH_KEY = 'kettlebird-preview-width';
const savedWidth = (): Width => {
  try {
    return localStorage.getItem(WIDTH_KEY) === 'phone' ? 'phone' : 'computer';
  } catch {
    return 'computer';
  }
};

export function PreviewPane({ documentId, schemaType, document }: Props) {
  const client = useClient({ apiVersion: '2024-01-01' });
  const { routerPanesState, groupIndex } = usePaneRouter();
  const [secret, setSecret] = useState<string>();
  const [failed, setFailed] = useState(false);
  const [width, setWidth] = useState<Width>(savedWidth);
  const [opened, setOpened] = useState(false);
  const [rev, setRev] = useState(document.displayed?._rev);
  const [loading, setLoading] = useState(true);
  const [info, setInfo] = useState<PageInfo>();
  const [announce, setAnnounce] = useState('');
  const [published, setPublished] = useState(false);
  const [available, setAvailable] = useState(0);
  const stage = useRef<HTMLDivElement>(null);
  const frame = useRef<HTMLIFrameElement>(null);
  const hadDraft = useRef(Boolean(document.draft));

  // A one-hour key, renewed while the preview is open.
  const renew = useCallback(() => {
    createPreviewSecret(client, 'kettlebird-studio', window.location.href)
      .then(({ secret: s }: { secret: string }) => {
        setSecret(s);
        setFailed(false);
      })
      .catch(() => setFailed(true));
  }, [client]);
  useEffect(() => {
    renew();
    const timer = setInterval(renew, SECRET_RENEW_MS);
    return () => clearInterval(timer);
  }, [renew]);

  // Catch up once the draft has been saved and Star has paused.
  useEffect(() => {
    const next = document.displayed?._rev;
    if (next === rev) return;
    const timer = setTimeout(() => setRev(next), SETTLE_MS);
    return () => clearTimeout(timer);
  }, [document.displayed?._rev, rev]);

  // After Publish: the green line, until the next change.
  useEffect(() => {
    if (hadDraft.current && !document.draft && document.published) setPublished(true);
    if (document.draft) setPublished(false);
    hadDraft.current = Boolean(document.draft);
  }, [document.draft, document.published]);

  // Fit the computer width to the space.
  useEffect(() => {
    const el = stage.current;
    if (!el) return;
    const observer = new ResizeObserver(() => setAvailable(el.clientWidth));
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // The chapter page open in the form pane beside this one.
  const formParams = (routerPanesState[groupIndex] ?? []).find((pane) => pane.params?.view !== 'preview')?.params;
  const page = schemaType.name === 'comicChapter' ? pageFromPath(formParams?.path, document.displayed?.pages) : undefined;
  const id = documentId.replace(/^drafts\./, '');
  const src = secret ? `${previewUrl(window.location.origin, schemaType.name, id, { secret, page, opened })}&rev=${encodeURIComponent(rev ?? '')}` : undefined;
  useEffect(() => setLoading(true), [src]);

  const onLoad = () => {
    const doc = frame.current?.contentDocument;
    const data = doc?.getElementById('kb-preview')?.textContent;
    setLoading(false);
    if (!data) {
      setFailed(true);
      return;
    }
    setFailed(false);
    setInfo(JSON.parse(data) as PageInfo);
    setAnnounce('');
    setTimeout(() => setAnnounce(T.announced), 50);
  };

  const choose = (w: Width) => {
    setWidth(w);
    try {
      localStorage.setItem(WIDTH_KEY, w);
    } catch {
      // Remembering the width is a convenience only.
    }
  };

  const pageWidth = WIDTHS[width];
  const scale = width === 'computer' && available ? scaleToFit(available - 24, pageWidth) : 1;
  const name = info?.name ?? 'this item';

  return (
    <Flex direction="column" height="fill">
      <Card padding={2} borderBottom>
        <Flex align="center" justify="space-between" gap={2} wrap="wrap">
          <Text size={1}>
            Preview of <strong>{name.replace(/^the /, 'the ')}</strong>
            {!loading && !failed && <span style={{ color: 'var(--card-muted-fg-color)' }}> · {T.updated}</span>}
          </Text>
          <Flex gap={1}>
            {schemaType.name === 'galleryItem' && (
              <Button mode={opened ? 'default' : 'ghost'} text={T.showOpened} aria-pressed={opened} onClick={() => setOpened(!opened)} />
            )}
            <Button mode={width === 'computer' ? 'default' : 'ghost'} text={T.computer} aria-pressed={width === 'computer'} onClick={() => choose('computer')} />
            <Button mode={width === 'phone' ? 'default' : 'ghost'} text={T.phone} aria-pressed={width === 'phone'} onClick={() => choose('phone')} />
          </Flex>
        </Flex>
      </Card>
      <Card padding={2} tone={published ? 'positive' : 'primary'} borderBottom>
        <Text size={1} weight="semibold">{published ? T.published : T.ribbon}</Text>
      </Card>
      {info && info.notes.length > 0 && !failed && (
        <Card padding={2} tone="caution" borderBottom>
          <Stack space={2}>{info.notes.map((n) => <Text key={n} size={1}>{n}</Text>)}</Stack>
        </Card>
      )}
      <section aria-label={regionName(name)} style={{ flex: 1, minHeight: 0, display: 'flex' }}>
        <div ref={stage} style={{ flex: 1, overflow: 'auto', background: 'var(--card-code-bg-color)', padding: 12 }}>
          {failed ? (
            <Box padding={4}>
              <Stack space={3}>
                <Text>{T.cantLoad}</Text>
                <Box><Button text={T.tryAgain} onClick={renew} /></Box>
                <Text size={1} muted>{T.saved}</Text>
              </Stack>
            </Box>
          ) : (
            src && (
              <div style={{ width: pageWidth * scale, height: '100%', margin: width === 'phone' ? '0 auto' : 0 }}>
                <iframe
                  ref={frame}
                  title={regionName(name)}
                  src={src}
                  onLoad={onLoad}
                  style={{
                    width: pageWidth,
                    height: `calc(100% / ${scale})`,
                    border: 0,
                    background: 'white',
                    transform: `scale(${scale})`,
                    transformOrigin: 'top left',
                    opacity: loading ? 0.5 : 1,
                  }}
                />
              </div>
            )
          )}
        </div>
      </section>
      <div role="status" aria-live="polite" style={{ position: 'absolute', width: 1, height: 1, overflow: 'hidden', clip: 'rect(0 0 0 0)' }}>
        {announce}
      </div>
    </Flex>
  );
}
