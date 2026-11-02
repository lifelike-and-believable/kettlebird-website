// The editor's menu: Comics, Art, Writing, Shop, Commissions, Site settings, and nothing else
// (content-editing-organised-editor AC-1, AC-2, AC-10; design-organised-editor).
import type { StructureResolver } from 'sanity/structure';
import { CHAPTER_TEMPLATE } from './components/ChaptersList';
import { SiteSettingsNote } from './components/SiteSettingsNote';
import { chapterPaneTitle } from './lib/comic-pages';
import { SECTIONS } from './lib/editor-content';

const TITLES = `{ "series": *[_id in [$series, "drafts." + $series]][0].title, "chapter": *[_id in [$chapter, "drafts." + $chapter]][0]{ number, title } }`;

export const structure: StructureResolver = (S) =>
  S.list()
    .title('Kettlebird Creations')
    .items(
      SECTIONS.map((section) => {
        const id = section.title.toLowerCase().replace(/\s+/g, '-');
        if (!section.type) {
          return S.listItem()
            .id(id)
            .title(section.title)
            .child(S.component(SiteSettingsNote).id(id).title(section.title));
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
              .child(async (chapterId, { params, structureContext }) => {
                const client = structureContext.getClient({ apiVersion: '2024-01-01' });
                const titles = await client.fetch<{ series?: string; chapter?: { number: number; title?: string } | null }>(
                  TITLES, { series: seriesId, chapter: chapterId }, { perspective: 'raw' },
                );
                const chapter = S.document().documentId(chapterId).schemaType('comicChapter');
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
