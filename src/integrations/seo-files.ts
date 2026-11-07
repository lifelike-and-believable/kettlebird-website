// Writes robots.txt, sitemap-index.xml and sitemap-0.xml beside the built pages (site-search AC-2, AC-3),
// from the site's address and the pages the build made.
import { writeFile } from 'node:fs/promises';
import type { AstroIntegration } from 'astro';
import { robotsTxt, sitemapIndex, sitemapPaths, sitemapXml } from '../lib/seo';

export function seoFiles(): AstroIntegration {
  let site = '';
  return {
    name: 'seo-files',
    hooks: {
      'astro:config:done': ({ config }) => {
        site = config.site ?? '';
      },
      'astro:build:done': async ({ dir, pages, logger }) => {
        const paths = sitemapPaths(pages.map((p) => p.pathname));
        await writeFile(new URL('robots.txt', dir), robotsTxt(site));
        await writeFile(new URL('sitemap-index.xml', dir), sitemapIndex(site));
        await writeFile(new URL('sitemap-0.xml', dir), sitemapXml(site, paths));
        logger.info(`robots.txt and the sitemap (${paths.length} pages) for ${site}`);
      },
    },
  };
}
