import { visionTool } from '@sanity/vision';
import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';

import { withChapters } from './actions/deleteSeries';
import { withChapterChecks } from './actions/publishChapter';
import { CHAPTER_TEMPLATE } from './components/ChaptersList';
import schemaTypes from './schemas';

export default defineConfig({
  name: 'kettlebirdStudio',
  title: 'Kettlebird Creations Studio',
  // Only SANITY_STUDIO_* settings reach the editor in the browser.
  projectId: process.env.SANITY_STUDIO_PROJECT_ID || '1p6w5n0l',
  dataset: process.env.SANITY_STUDIO_DATASET || 'production',
  basePath: '/studio',
  plugins: [structureTool(), visionTool()],
  schema: {
    types: schemaTypes,
    // Add chapter on a series opens a chapter for that series with the next number (AC-11).
    templates: (prev) => [
      ...prev,
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
    // A chapter's Publish waits for uploads and warns about changed links and missing alt text.
    // A series' Delete deletes its chapters too (AC-16).
    actions: (prev, context) => {
      if (context.schemaType === 'comicChapter') return prev.map((action) => (action.action === 'publish' ? withChapterChecks(action) : action));
      if (context.schemaType === 'comicSeries') return prev.map((action) => (action.action === 'delete' ? withChapters(action) : action));
      return prev;
    }
  }
});
