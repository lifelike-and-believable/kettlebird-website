import { createClient } from '@sanity/client';
import imageUrlBuilder from '@sanity/image-url';
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type SanityImageSource = any;

export const sanityClient = createClient({
  projectId: import.meta.env.SANITY_PROJECT_ID ?? '1p6w5n0l',
  dataset: import.meta.env.SANITY_DATASET ?? 'production',
  // The live API, not the cache, so a build right after Publish sees the change (content-editing-know-when-live AC-2).
  useCdn: false,
  apiVersion: '2024-01-01',
});

const builder = imageUrlBuilder(sanityClient);

export function urlFor(source: SanityImageSource) {
  return builder.image(source);
}
