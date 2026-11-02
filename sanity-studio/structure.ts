// The editor's menu: Comics, Art, Writing, Shop, Commissions, Site settings, and nothing else
// (content-editing-organised-editor AC-1, AC-2, AC-10; design-organised-editor).
import type { StructureResolver } from 'sanity/structure';
import { SiteSettingsNote } from './components/SiteSettingsNote';
import { SECTIONS } from './lib/editor-content';

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
        return S.listItem()
          .id(id)
          .title(section.title)
          .schemaType(section.type)
          .child(
            S.documentTypeList(section.type)
              .id(id)
              .title(section.title)
              .defaultOrdering(ordering)
              .initialValueTemplates([S.initialValueTemplateItem(section.type)]),
          );
      }),
    );
