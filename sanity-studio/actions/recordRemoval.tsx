// Records each removal from the site (content-editing-know-when-live AC-3). A deleted item leaves
// nothing to query, so when a published item disappears (Delete, or Unpublish) the editor writes
// the time to the hidden siteStatus item; its update also starts a site build. This listens rather
// than wrapping Delete and Unpublish because Sanity runs those inside their own dialogs and closes
// the item's pane straight after, so a wrapper can't reliably see them finish. It runs in the top
// bar, which is on every screen while the editor is open.
import { useEffect } from 'react';
import { useClient } from 'sanity';
import { CONTENT_TYPES, SITE_STATUS_ID } from '../lib/live-status';

const PUBLISHED = '*[_type in $types && !(_id in path("drafts.**"))]';

export function useRemovalRecord(): void {
  const client = useClient({ apiVersion: '2024-01-01' });
  useEffect(() => {
    const subscription = client
      .listen(PUBLISHED, { types: CONTENT_TYPES }, { events: ['mutation'], includeResult: false, visibility: 'query' })
      .subscribe((event) => {
        if (event.type !== 'mutation' || event.transition !== 'disappear') return;
        client
          .transaction()
          .createIfNotExists({ _id: SITE_STATUS_ID, _type: 'siteStatus' })
          .patch(SITE_STATUS_ID, (p) => p.set({ lastRemoval: event.timestamp }))
          .commit()
          .catch(() => undefined);
      });
    return () => subscription.unsubscribe();
  }, [client]);
}
