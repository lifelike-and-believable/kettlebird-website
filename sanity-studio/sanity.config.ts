import { defineConfig, defineLocaleResourceBundle } from 'sanity';
import { structureTool } from 'sanity/structure';

import { withChapters } from './actions/deleteSeries';
import { withPublishNote } from './actions/publishNote';
import { LiveStatus } from './components/LiveStatus';
import { CONTENT_TYPES } from './lib/live-status';
import { ThingsToAddBadge } from './badges/thingsToAdd';
import { withChapterChecks } from './actions/publishChapter';
import { CHAPTER_TEMPLATE } from './components/ChaptersList';
import { EMPTY_LIST, isItemType, SECTIONS } from './lib/editor-content';
import { signInProviders, STUDIO_TITLE } from './lib/studio-settings';
import schemaTypes from './schemas';
import { structure } from './structure';

export default defineConfig({
  name: 'kettlebirdStudio',
  // Served at /studio on the site (design-sign-in). Only Google and E-mail / password (AC-3, AC-4).
  title: STUDIO_TITLE,
  // Only SANITY_STUDIO_* settings reach the editor in the browser.
  projectId: process.env.SANITY_STUDIO_PROJECT_ID || '1p6w5n0l',
  dataset: process.env.SANITY_STUDIO_DATASET || 'production',
  auth: { providers: signInProviders },
  // Only the content editor, organised as Comics, Art, Writing, Shop, Commissions and Site settings
  // (content-editing-organised-editor AC-1); no query tool (sign-in AC-8).
  plugins: [structureTool({ structure })],
  // The state of the latest change at the top right of every screen; it also records removals
  // (content-editing-know-when-live AC-3, AC-4).
  studio: { components: { navbar: LiveStatus } },
  // An empty list, in Star's words; Sanity has one message for every list (organised-editor AC-12).
  i18n: {
    bundles: [
      defineLocaleResourceBundle({
        locale: 'en-US',
        namespace: 'structure',
        resources: { 'panes.document-list-pane.no-documents-of-type.text': EMPTY_LIST },
      }),
    ],
  },
  schema: {
    types: schemaTypes,
    // Add chapter on a series opens a chapter for that series with the next number (AC-11).
    // Each kind of item is created by its New … name (organised-editor AC-1, AC-11).
    templates: (prev) => [
      ...prev.map((template) => {
        const section = SECTIONS.find((s) => s.type === template.id);
        return section?.newLabel ? { ...template, title: section.newLabel } : template;
      }),
      {
        id: CHAPTER_TEMPLATE,
        title: 'Chapter in series',
        schemaType: 'comicChapter',
        parameters: [
          { name: 'seriesId', type: 'string' },
          { name: 'number', type: 'number' }
        ],
        value: ({ seriesId, number }: { seriesId: string; number: number }) => ({
          // Weak until published, so a chapter can be set up before its new series is on the site.
          series: { _type: 'reference', _ref: seriesId, _weak: true, _strengthenOnPublish: { type: 'comicSeries' } },
          number
        })
      }
    ]
  },
  document: {
    // "Create new" offers only the five kinds of item; a chapter starts from its series' Add chapter (AC-11).
    newDocumentOptions: (prev, { creationContext }) =>
      creationContext.type === 'global' ? prev.filter((item) => isItemType(item.templateId)) : prev,
    // "3 things to add before publishing", beside Publish (organised-editor AC-6).
    badges: (prev, context) => (isItemType(context.schemaType) ? [...prev, ThingsToAddBadge] : prev),
    // A chapter's Publish waits for uploads and warns about changed links and missing alt text.
    // A series' Delete deletes its chapters too (AC-16).
    // Every Publish is followed by a note that the site is updating (know-when-live AC-8).
    actions: (prev, context) => {
      let actions = prev;
      if (context.schemaType === 'comicChapter') actions = actions.map((action) => (action.action === 'publish' ? withChapterChecks(action) : action));
      if (context.schemaType === 'comicSeries') actions = actions.map((action) => (action.action === 'delete' ? withChapters(action) : action));
      if (CONTENT_TYPES.includes(context.schemaType)) actions = actions.map((action) => (action.action === 'publish' ? withPublishNote(action) : action));
      return actions;
    }
  }
});
