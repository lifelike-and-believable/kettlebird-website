// The one-off change for stories saved with a rating (docs/specs/story-mature-content.md AC-3): ticks Mature or
// explicit content where the rating was Mature or Explicit, and removes the rating. Run once from the editor's
// folder, after a dry run: npx sanity migration run mature-from-rating, then again with --no-dry-run.
import { at, defineMigration, set, unset } from 'sanity/migrate';
import { matureFromRating } from '../../lib/stories';

export default defineMigration({
  title: 'Mature or explicit content from ratings',
  documentTypes: ['writtenWork'],
  migrate: {
    document(doc) {
      const change = matureFromRating(doc as { mature?: unknown; rating?: unknown });
      return [...(change.setMature ? [at('mature', set(true))] : []), ...(change.unsetRating ? [at('rating', unset())] : [])];
    },
  },
});
