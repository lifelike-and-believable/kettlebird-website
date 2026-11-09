// The editor's parts for portfolio subfolders (docs/specs/portfolio-folders.md AC-18 to AC-21;
// design-portfolio-folders mock-ups 7 and 8): a subfolder's Section, read-only once published; its Grid
// size, with a line saying what the grid shows; its list row's count; and a piece's Subfolders, one choice
// for each section the piece is in.
import { Card, Select, Stack, Text } from '@sanity/ui';
import { useEffect, useState, type ComponentType } from 'react';
import { set, unset, useClient, useFormValue, type ArrayOfObjectsInputProps, type NumberInputProps, type PreviewProps, type StringInputProps } from 'sanity';
import { gridHint, leaveNote, sectionTitle, subfolderChoices } from '../lib/editor-content';

const API = { apiVersion: '2024-01-01' };
const publishedId = (id: string | undefined) => (id ?? '').replace(/^drafts\./, '');
const COUNT = 'count(*[_type == "galleryItem" && !(_id in path("drafts.**")) && $id in subfolders[]._ref && $section in category])';

/** A subfolder's published pieces, kept up to date. */
function usePieceCount(id: string | undefined, section: string | undefined): number | undefined {
  const client = useClient(API);
  const [count, setCount] = useState<number>();
  useEffect(() => {
    if (!id || !section) return undefined;
    const params = { id: publishedId(id), section };
    const read = () => client.fetch<number>(COUNT, params).then(setCount).catch(() => undefined);
    void read();
    const sub = client.listen('*[_type == "galleryItem" && $id in subfolders[]._ref]', params).subscribe(() => void read());
    return () => sub.unsubscribe();
  }, [client, id, section]);
  return count;
}

/** AC-19: the section, shown as set once the subfolder is published. */
export function SectionInput(props: StringInputProps) {
  const id = publishedId(useFormValue(['_id']) as string | undefined);
  const client = useClient(API);
  const [published, setPublished] = useState<string | null>();
  useEffect(() => {
    if (!id) return;
    client.fetch<string | null>('*[_id == $id][0].section', { id }, { perspective: 'raw' }).then(setPublished).catch(() => setPublished(null));
  }, [client, id]);
  if (!published) return props.renderDefault(props);
  return (
    <Card padding={3} radius={2} tone="transparent" border>
      <Text size={1} muted>{`${sectionTitle(published)} (set)`}</Text>
    </Card>
  );
}

/** AC-18: Grid size, and what it shows of this subfolder's pieces. */
export function GridSizeInput(props: NumberInputProps) {
  const id = useFormValue(['_id']) as string | undefined;
  const name = (useFormValue(['name']) as string | undefined) || 'This subfolder';
  const section = useFormValue(['section']) as string | undefined;
  const count = usePieceCount(id, section);
  return (
    <Stack space={3}>
      {props.renderDefault(props)}
      {count !== undefined && <Text size={1} muted>{gridHint(name, count, props.value ?? 2)}</Text>}
    </Stack>
  );
}

/** AC-18: the list row, "Fan Work · 2 × 2 · 4 pieces", with the count read when it shows. The prepared subtitle
 * is text (subfolderPreview); this replaces it with the full line once the count is known. */
export function subfolderPreviewWith(detail: (value: { section?: string; gridSize?: number; order?: string; count: number }) => string | undefined): ComponentType<PreviewProps> {
  return function SubfolderPreview(props: PreviewProps) {
    const value = props as PreviewProps & { subfolderId?: string; section?: string; gridSize?: number; order?: string };
    const count = usePieceCount(value.subfolderId, value.section);
    if (count === undefined) return props.renderDefault(props);
    return props.renderDefault({ ...props, subtitle: detail({ section: value.section, gridSize: value.gridSize, order: value.order, count }) });
  };
}

interface SubfolderDoc { _id: string; name: string; section: string }
type Ref = { _key: string; _type: 'reference'; _ref: string; _weak: true };

/** AC-20, AC-21: a piece's Subfolders: Loose or one published subfolder for each section it's in. */
export function PieceSubfoldersInput(props: ArrayOfObjectsInputProps) {
  const client = useClient(API);
  const categories = (useFormValue(['category']) as string[] | undefined) ?? [];
  const value = (props.value as Ref[] | undefined) ?? [];
  const [subfolders, setSubfolders] = useState<SubfolderDoc[]>([]);
  useEffect(() => {
    // Published subfolders only (S1): a piece can't point at one that isn't on the site.
    const query = '*[_type == "portfolioSubfolder" && !(_id in path("drafts.**"))] | order(name asc) { _id, name, section }';
    const read = () => client.fetch<SubfolderDoc[]>(query).then(setSubfolders).catch(() => undefined);
    void read();
    const sub = client.listen('*[_type == "portfolioSubfolder"]').subscribe(() => void read());
    return () => sub.unsubscribe();
  }, [client]);

  const chosenIds = value.map((r) => r._ref);
  const choices = subfolderChoices(categories, subfolders, chosenIds);
  // Chosen subfolders in sections the piece no longer has: they go when it's published.
  const leaving = subfolders.filter((s) => chosenIds.includes(s._id) && !categories.includes(s.section));

  const choose = (section: string, id: string) => {
    const others = value.filter((r) => subfolders.find((s) => s._id === r._ref)?.section !== section);
    const next = id ? [...others, { _key: id, _type: 'reference' as const, _ref: id, _weak: true as const }] : others;
    props.onChange(next.length ? set(next) : unset());
  };

  return (
    <Stack space={3}>
      {choices.map((choice) => (
        <Stack key={choice.section} space={2}>
          <Text size={1} weight="medium">{choice.title}</Text>
          <Select value={choice.chosen ?? ''} disabled={props.readOnly || !choice.options.length} onChange={(e) => choose(choice.section, e.currentTarget.value)}>
            <option value="">{choice.empty ?? 'Loose'}</option>
            {choice.options.map((o) => <option key={o.id} value={o.id}>{o.name}</option>)}
          </Select>
        </Stack>
      ))}
      {leaving.map((s) => (
        <Card key={s._id} padding={3} radius={2} tone="caution" border>
          <Text size={1}>{leaveNote(sectionTitle(s.section), s.name)}</Text>
        </Card>
      ))}
    </Stack>
  );
}
