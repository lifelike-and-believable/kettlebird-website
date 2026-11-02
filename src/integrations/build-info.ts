// Writes /build-info.json so the editor and the 15-minute check can tell which content the live
// site was built from (content-editing-know-when-live AC-2). contentReadAt is Sanity's clock, taken
// before any page reads content, so a change published during the build counts as not yet live.
import { writeFile } from 'node:fs/promises';
import { createClient } from '@sanity/client';
import type { AstroIntegration } from 'astro';

export function buildInfo(): AstroIntegration {
  let contentReadAt = '';
  return {
    name: 'build-info',
    hooks: {
      'astro:build:start': async () => {
        const client = createClient({
          projectId: process.env.SANITY_PROJECT_ID ?? '1p6w5n0l',
          dataset: process.env.SANITY_DATASET ?? 'production',
          useCdn: false,
          apiVersion: '2024-01-01',
        });
        contentReadAt = await client.fetch<string>('now()');
      },
      'astro:build:done': async ({ dir, logger }) => {
        const info = { contentReadAt, builtAt: new Date().toISOString() };
        await writeFile(new URL('build-info.json', dir), JSON.stringify(info));
        logger.info(`build-info.json: content read at ${contentReadAt}`);
      },
    },
  };
}
