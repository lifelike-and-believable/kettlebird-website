// The open chapter's comic's Two pages side by side, as it is now, draft or published
// (docs/specs/comic-reader-comic-settings.md AC-7). Undefined until it's known.
import { useEffect, useState } from 'react';
import { useClient, useFormValue } from 'sanity';

export function useComicTwoUp(): boolean | undefined {
  const client = useClient({ apiVersion: '2024-01-01' });
  const seriesId = (useFormValue(['series']) as { _ref?: string } | undefined)?._ref;
  const [twoUp, setTwoUp] = useState<boolean>();
  useEffect(() => {
    if (!seriesId) return undefined;
    const ids = [seriesId, `drafts.${seriesId}`];
    const query = '*[_id in $ids]{ _id, twoUp }';
    const read = () =>
      client.fetch<{ _id: string; twoUp?: boolean }[]>(query, { ids }, { perspective: 'raw' }).then((docs) => {
        const current = docs.find((d) => d._id.startsWith('drafts.')) ?? docs[0];
        setTwoUp(current?.twoUp === true);
      });
    read().catch(() => setTwoUp(undefined));
    const sub = client.listen(query, { ids }).subscribe(() => void read().catch(() => undefined));
    return () => sub.unsubscribe();
  }, [client, seriesId]);
  return twoUp;
}
