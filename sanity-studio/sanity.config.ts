import { defineConfig, defineLocaleResourceBundle, type SchemaTypeDefinition } from 'sanity';
import { structureTool } from 'sanity/structure';

import { withChapters, withStoryChapters } from './actions/deleteSeries';
import { withStoryChapterChecks, withStoryLinkCheck } from './actions/publishStory';
import { SceneBreakPlugins } from './components/SceneBreakOnEnter';
import { withPublishNote } from './actions/publishNote';
import { withSubfolderDelete, withSubfolderTidy } from './actions/subfolders';
import { LiveStatus } from './components/LiveStatus';
import { CONTENT_TYPES } from './lib/live-status';
import { ThingsToAddBadge } from './badges/thingsToAdd';
import { ThingsToFixBadge } from './badges/thingsToFix';
import { FixSummary } from './components/FixSummary';
import { isSettingsType, SETTINGS_ACTIONS } from './lib/site-settings';
import { withChapterChecks } from './actions/publishChapter';
import { withUnusedPictures } from './actions/unusedPictures';
import { CHAPTER_TEMPLATE, STORY_CHAPTER_TEMPLATE } from './components/ChaptersList';
import { EMPTY_LIST, isItemType, SECTIONS } from './lib/editor-content';
import { signInProviders, STUDIO_TITLE } from './lib/studio-settings';
import schemaTypes from './schemas';
import { defaultDocumentNode, structure } from './structure';
import { withHelpLinkInput, withPreviewInput } from './components/PreviewButton';
import { ITEM_HELP } from './lib/help';
import { isPreviewable } from './lib/preview';

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
  plugins: [structureTool({ structure, defaultDocumentNode })],
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
    // Site settings' items show what to fix at the top (content-editing-site-settings AC-4).
    types: (schemaTypes as SchemaTypeDefinition[])
      .map((type) => (isSettingsType(type.name) ? ({ ...type, components: { input: FixSummary } } as SchemaTypeDefinition) : type))
      // Preview at the top of every item that has one (content-editing-preview AC-1).
      // An item with a help link but no preview yet has the link alone (story-reader-editor AC-11).
      .map((type): SchemaTypeDefinition => {
        const wrap = isPreviewable(type.name) ? withPreviewInput : ITEM_HELP[type.name] ? withHelpLinkInput : null;
        if (!wrap) return type;
        const inner = (type as { components?: { input?: never } }).components?.input;
        return { ...type, components: { ...(type as { components?: object }).components, input: wrap(inner) } } as SchemaTypeDefinition;
      }),
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
      },
      // Add chapter on a story (story-reader-editor AC-6).
      {
        id: STORY_CHAPTER_TEMPLATE,
        title: 'Chapter in story',
        schemaType: 'storyChapter',
        parameters: [
          { name: 'storyId', type: 'string' },
          { name: 'number', type: 'number' }
        ],
        value: ({ storyId, number }: { storyId: string; number: number }) => ({
          story: { _type: 'reference', _ref: storyId, _weak: true, _strengthenOnPublish: { type: 'writtenWork' } },
          number
        })
      }
    ]
  },
  // A symbol-only line becomes a scene break on Enter, in a story's or a chapter's Text (story-reader-editor AC-5).
  form: { components: { portableText: { plugins: SceneBreakPlugins } } },
  document: {
    // "Create new" offers only the five kinds of item; a chapter starts from its series' Add chapter (AC-11).
    newDocumentOptions: (prev, { creationContext }) =>
      creationContext.type === 'global' ? prev.filter((item) => isItemType(item.templateId)) : prev,
    // "3 things to add before publishing", beside Publish (organised-editor AC-6).
    badges: (prev, context) => {
      if (isItemType(context.schemaType)) return [...prev, ThingsToAddBadge];
      if (isSettingsType(context.schemaType)) return [...prev, ThingsToFixBadge];
      return prev;
    },
    // A chapter's Publish waits for uploads and warns about changed links and missing alt text.
    // A series' Delete deletes its chapters too (AC-16).
    // Every Publish is followed by a note that the site is updating (know-when-live AC-8).
    actions: (prev, context) => {
      // Site settings' items can't be deleted, duplicated or unpublished (content-editing-site-settings AC-1).
      if (isSettingsType(context.schemaType)) {
        return prev.filter((action) => action.action && SETTINGS_ACTIONS.includes(action.action)).map((action) => (action.action === 'publish' ? withPublishNote(action) : action));
      }
      let actions = prev;
      if (context.schemaType === 'comicChapter') actions = actions.map((action) => (action.action === 'publish' ? withChapterChecks(action) : action));
      if (context.schemaType === 'comicSeries') actions = actions.map((action) => (action.action === 'delete' ? withChapters(action) : action));
      // Pictures from Word documents that nothing uses are removed on publish and delete (story-import-word AC-18).
      // First, so the warnings' dialogs wrap it and nothing is removed if Star cancels.
      if (context.schemaType === 'storyChapter' || context.schemaType === 'writtenWork') {
        actions = actions.map((action) => (action.action === 'publish' || action.action === 'delete' ? withUnusedPictures(action) : action));
      }
      // Stories and their chapters (story-reader-editor AC-9, AC-10).
      if (context.schemaType === 'storyChapter') actions = actions.map((action) => (action.action === 'publish' ? withStoryChapterChecks(action) : action));
      if (context.schemaType === 'writtenWork') {
        actions = actions.map((action) =>
          action.action === 'publish' ? withStoryLinkCheck(action) : action.action === 'delete' ? withStoryChapters(action) : action,
        );
      }
      // Portfolio subfolders (portfolio-folders AC-21, AC-22).
      if (context.schemaType === 'galleryItem') actions = actions.map((action) => (action.action === 'publish' ? withSubfolderTidy(action) : action));
      if (context.schemaType === 'portfolioSubfolder') actions = actions.map((action) => (action.action === 'delete' ? withSubfolderDelete(action) : action));
      if (CONTENT_TYPES.includes(context.schemaType)) actions = actions.map((action) => (action.action === 'publish' ? withPublishNote(action) : action));
      return actions;
    }
  }
});
