// Renders the mock-ups for docs/design/comic-reader-phone-bar.md.
// 1. Screenshots the reader from the fixture build, today and with proposed.css injected, into shots/.
// 2. Lays them out in mockups.html (iPhone frames with Safari's toolbars drawn) and saves <name>.png.
// Needs the fixture build running: npm run build:fixtures && HOST=127.0.0.1 PORT=4399 node dist/server/entry.mjs
// Then: BASE=http://127.0.0.1:4399 node render.mjs
//
// Safari model (iPhone 15, 393 × 852 points): with its toolbars showing, the page sees 659 px of height
// (the status bar takes 59 and the bottom toolbar 134), but 100vh is about 745 px, the height with the
// toolbars collapsed. So a screenshot at 393 × 745 shows where today's page puts things, and the frame
// covers what falls under the toolbar. For "after", 100svh is replaced by 659px (Chromium has no toolbars).
import { chromium } from "playwright";
import { readFileSync, mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const dir = path.dirname(fileURLToPath(import.meta.url));
const BASE = process.env.BASE ?? "http://127.0.0.1:4399";
const css = readFileSync(path.join(dir, "proposed.css"), "utf8");
const SVH = 659;
const LVH = 745;
mkdirSync(path.join(dir, "shots"), { recursive: true });

const browser = await chromium.launch();
const measures = {};

async function shot(
  name,
  {
    width,
    height,
    after,
    panels = false,
    path: url = "/comics/single-sheets/1/1",
    clip,
    text200 = false,
    svh = height,
  },
) {
  const ctx = await browser.newContext({
    viewport: { width, height },
    deviceScaleFactor: 2,
    hasTouch: true,
    isMobile: true,
  });
  const page = await ctx.newPage();
  await page.addInitScript((on) => {
    if (on) localStorage.setItem("kb-panels", "1");
    else localStorage.removeItem("kb-panels");
  }, panels);
  await page.goto(BASE + url);
  if (after)
    await page.addStyleTag({ content: css.replaceAll("100svh", `${svh}px`) });
  if (text200)
    await page.addStyleTag({ content: "html { font-size: 200% !important; }" });
  await page.evaluate(() => document.fonts.ready);
  await page.evaluate(() =>
    document.querySelector(".reader")?.scrollIntoView({ block: "start" }),
  );
  await page.waitForTimeout(500);
  measures[name] = await page.evaluate(() => {
    const rd = document.querySelector(".reader").getBoundingClientRect();
    const bar = document.querySelector(".reader__bar").getBoundingClientRect();
    const nav = [...document.querySelectorAll("nav.reader__controls")]
      .map((n) => n.getBoundingClientRect())
      .find((r) => r.height > 0);
    return {
      bar: Math.round(bar.height),
      controlsEnd: Math.round(nav.bottom - rd.top),
    };
  });
  if (clip === "bar") {
    await page
      .locator(".reader__bar")
      .screenshot({ path: path.join(dir, "shots", `${name}.png`) });
  } else {
    await page.screenshot({ path: path.join(dir, "shots", `${name}.png`) });
  }
  await ctx.close();
}

// Whole screens, iPhone 15 in Safari (the page as laid out under 100vh = 745).
await shot("today-15", { width: 393, height: LVH, after: false, svh: SVH });
await shot("after-15", { width: 393, height: LVH, after: true, svh: SVH });
await shot("after-15-panels", {
  width: 393,
  height: LVH,
  after: true,
  panels: true,
  svh: SVH,
});
// Bars close up: the narrowest phone, a common one, and text at 200%.
await shot("bar-today-320", {
  width: 320,
  height: 568,
  after: false,
  clip: "bar",
});
await shot("bar-after-320", {
  width: 320,
  height: 568,
  after: true,
  clip: "bar",
});
await shot("bar-today-393", {
  width: 393,
  height: 659,
  after: false,
  clip: "bar",
});
await shot("bar-after-393", {
  width: 393,
  height: 659,
  after: true,
  clip: "bar",
});
await shot("bar-after-393-on", {
  width: 393,
  height: 659,
  after: true,
  panels: true,
  clip: "bar",
});
await shot("bar-today-393-200", {
  width: 393,
  height: 659,
  after: false,
  clip: "bar",
  text200: true,
});
await shot("bar-after-393-200", {
  width: 393,
  height: 659,
  after: true,
  clip: "bar",
  text200: true,
});
// Unchanged from 700 px up.
await shot("bar-after-768", {
  width: 768,
  height: 1024,
  after: true,
  clip: "bar",
});
console.log(JSON.stringify(measures, null, 1));

// Lay out and save the mock-ups.
const names = {
  m1: "1-today-iphone",
  m2: "2-after-iphone",
  m3: "3-after-panel-by-panel",
  m4: "4-bars-close-up",
};
const page = await browser.newPage({
  viewport: { width: 1600, height: 1200 },
  deviceScaleFactor: 1,
});
await page.goto("file://" + path.join(dir, "mockups.html"));
await page.evaluate(() => document.fonts.ready);
await page.waitForFunction(() =>
  [...document.images].every((i) => i.complete && i.naturalWidth > 0),
);
for (const [id, name] of Object.entries(names))
  await page
    .locator("#" + id)
    .screenshot({ path: path.join(dir, name + ".png") });
await browser.close();
