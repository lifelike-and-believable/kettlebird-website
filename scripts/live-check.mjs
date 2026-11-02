// The 15-minute check (content-editing-know-when-live AC-9): compares the latest change in Sanity's
// public dataset with the live site's /build-info.json and, for the workflow, says whether the site
// is more than 15 minutes behind and what the issue should say.
//
//   node scripts/live-check.mjs    writes behind=<minutes> and the issue body to $GITHUB_OUTPUT
import { appendFileSync } from 'node:fs';
import { pathToFileURL } from 'node:url';

const MINUTE = 60_000;
// Stryker disable all: settings and the network part (main), which the workflow's own runs check.
const PROJECT = process.env.SANITY_PROJECT_ID ?? '1p6w5n0l';
const DATASET = process.env.SANITY_DATASET ?? 'production';
const SITE = process.env.SITE_URL ?? 'https://newsite.kettlebird.com';
const DEPLOYMENTS = 'https://vercel.com/lifelikedevteam/kettlebird-website/deployments';
const QUERY = `{
  "latest": *[_type in $types && !(_id in path("drafts.**"))] | order(_updatedAt desc)[0]._updatedAt,
  "removedAt": *[_id == "siteStatus"][0]._updatedAt
}`;
// Stryker restore all
export const TYPES = [
  'comicSeries', 'comicChapter', 'galleryItem', 'writtenWork', 'product', 'commissionType',
  'commissionSettings', 'aboutPage', 'homePage', 'contactSettings',
];

/** Whole minutes since the latest change, or 0 when the site has read the content after it. */
export function minutesBehind({ lastChangeAt, contentReadAt, now }) {
  if (!lastChangeAt || Date.parse(contentReadAt) >= Date.parse(lastChangeAt)) return 0;
  return Math.floor((now.getTime() - Date.parse(lastChangeAt)) / MINUTE);
}

export function issueBody({ lastChangeAt, contentReadAt, builtAt, behind, site }) {
  return [
    `The site hasn't picked up a change published ${behind} minutes ago, so Star's editor says "Didn't go live".`,
    '',
    `- Latest change in Sanity: ${lastChangeAt}`,
    `- Content the live site was built from: ${contentReadAt} (built ${builtAt})`,
    `- The site's build info: ${site}/build-info.json`,
    '',
    `Check the latest builds at ${DEPLOYMENTS}, fix or redeploy, and this issue closes itself once the site catches up.`,
    'If no build started at all, check the Sanity webhook "Rebuild site" and the Vercel deploy hook "Sanity publish".',
  ].join('\n');
}

// Stryker disable all
async function main() {
  const params = new URLSearchParams({ query: QUERY, $types: JSON.stringify(TYPES) });
  const sanity = await fetch(`https://${PROJECT}.api.sanity.io/v2024-01-01/data/query/${DATASET}?${params}`);
  if (!sanity.ok) throw new Error(`Sanity answered ${sanity.status}`);
  const { result } = await sanity.json();
  const lastChangeAt = [result.latest, result.removedAt].filter(Boolean).sort((a, b) => Date.parse(a) - Date.parse(b)).at(-1) ?? null;
  const site = await fetch(`${SITE}/build-info.json`, { cache: 'no-store' });
  if (!site.ok) throw new Error(`The site's build-info.json answered ${site.status}`);
  const { contentReadAt, builtAt } = await site.json();
  const behind = minutesBehind({ lastChangeAt, contentReadAt, now: new Date() });
  console.log(`Latest change ${lastChangeAt}; site read content at ${contentReadAt}; ${behind} minutes behind.`);
  const out = process.env.GITHUB_OUTPUT;
  if (out) {
    appendFileSync(out, `behind=${behind}\n`);
    appendFileSync(out, `body<<END_OF_BODY\n${issueBody({ lastChangeAt, contentReadAt, builtAt, behind, site: SITE })}\nEND_OF_BODY\n`);
  }
}

if (import.meta.url === pathToFileURL(process.argv[1] ?? '').href) await main();
