// The editor's menu: Comics, Art, Writing, Shop, Commissions, Site settings, and nothing else
// (content-editing-organised-editor AC-1, AC-2; design-organised-editor), with Site settings' four
// items (content-editing-site-settings AC-1).
import type { DefaultDocumentNodeResolver, StructureBuilder, StructureResolver } from 'sanity/structure';
import { PreviewPane } from './components/PreviewPane';
import { isPreviewable } from './lib/preview';
import { CHAPTER_TEMPLATE } from './components/ChaptersList';
import { chapterPaneTitle } from './lib/comic-pages';
import { SECTIONS } from './lib/editor-content';
import { SETTINGS_ITEMS } from './lib/site-settings';

/** The form, and the preview the Preview button opens beside it (content-editing-preview AC-1). */
const views = (S: StructureBuilder, type: string) =>
  isPreviewable(type) ? [S.view.form(), S.view.component(PreviewPane).id('preview').title('Preview')] : [S.view.form()];

export const defaultDocumentNode: DefaultDocumentNodeResolver = (S, { schemaType }) => S.document().views(views(S, schemaType));

const TITLES = `{ "series": *[_id in [$series, "drafts." + $series]][0].title, "chapter": *[_id in [$chapter, "drafts." + $chapter]][0]{ number, title } }`;

export const structure: StructureResolver = (S) =>
  S.list()
    .title('Kettlebird Creations')
    .items(
      SECTIONS.map((section) => {
        const id = section.title.toLowerCase().replace(/\s+/g, '-');
        // Site settings: four single items, each opened straight away and published on its own
        // (content-editing-site-settings AC-1; design-site-settings, Flow).
        if (!section.type) {
          return S.listItem()
            .id(id)
            .title(section.title)
            .child(
              S.list()
                .id(id)
                .title(section.title)
                .items(
                  SETTINGS_ITEMS.map(({ type, title }) =>
                    S.listItem().id(type).title(title).schemaType(type).child(S.document().schemaType(type).documentId(type).title(title).views(views(S, type))),
                  ),
                ),
            );
        }
        const ordering = (section.ordering ?? []).map(([field, direction]) => ({ field, direction }));
        let list = S.documentTypeList(section.type)
          .id(id)
          .title(section.title)
          .defaultOrdering(ordering)
          .initialValueTemplates([S.initialValueTemplateItem(section.type)]);
        // A series opens as a pane whose child is one of its chapters, so a chapter opens beside its
        // series (organised-editor AC-14; design-organised-editor, Series and chapters).
        if (section.type === 'comicSeries') {
          list = list.child((seriesId) =>
            S.document()
              .documentId(seriesId)
              .schemaType('comicSeries')
              .views(views(S, 'comicSeries'))
              .child(async (chapterId, { params, structureContext }) => {
                const client = structureContext.getClient({ apiVersion: '2024-01-01' });
                const titles = await client.fetch<{ series?: string; chapter?: { number: number; title?: string } | null }>(
                  TITLES, { series: seriesId, chapter: chapterId }, { perspective: 'raw' },
                );
                const chapter = S.document().documentId(chapterId).schemaType('comicChapter').views(views(S, 'comicChapter'));
                if (params.template === CHAPTER_TEMPLATE) {
                  return chapter
                    .initialValueTemplate(CHAPTER_TEMPLATE, { seriesId, number: Number(params.number) || 1 })
                    .title(chapterPaneTitle(titles.series, null));
                }
                return chapter.title(chapterPaneTitle(titles.series, titles.chapter ?? null));
              }),
          );
        }
        return S.listItem().id(id).title(section.title).schemaType(section.type).child(list);
      }),
    );
