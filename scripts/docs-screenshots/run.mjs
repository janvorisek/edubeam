// Regenerates the app screenshots used by the documentation (docs/public/screenshots).
//
//   npm run dev                                # in one terminal
//   npm run docs:screenshots                   # in another; APP=<url> to point elsewhere
//   npm run docs:screenshots -- ui-            # only shots whose name starts with "ui-"
//   npm run docs:screenshots -- --lang cs      # the Czech docs, in screenshots/cs/
//   npm run docs:screenshots -- --lang all     # every language of the docs
//   npm run docs:screenshots -- --missing      # only shots that do not exist yet, e.g. after a crash
//
// English shots go to screenshots/, every other language to screenshots/<docs language>/, with the
// app in that language. Buttons are found by their labels in src/locales, so no shot names one.
// Every shot starts from a fresh browser context, so the output depends only on the app and the
// model files in ./models. Shots are written as WebP, encoded by Chromium itself, so no image
// tooling is needed besides Playwright.
import { chromium } from 'playwright';
import { access, mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { setMessages, shots } from './shots.mjs';

const here = dirname(fileURLToPath(import.meta.url));
const APP = process.env.APP ?? 'http://localhost:5173/';
const SCREENSHOTS = resolve(here, '../../docs/public/screenshots');

/** Docs language → app language. The docs say zh where the app says cn. */
const APP_LANGUAGE = {
  en: 'en',
  cs: 'cs',
  de: 'de',
  es: 'es',
  fr: 'fr',
  pl: 'pl',
  pt: 'pt',
  ru: 'ru',
  uk: 'uk',
  zh: 'cn',
};

const args = process.argv.slice(2);
const langAt = args.indexOf('--lang');
const langArg = langAt >= 0 ? args.splice(langAt, 2)[1] : 'en';
if (langArg !== 'all' && !(langArg in APP_LANGUAGE)) {
  throw new Error(`--lang takes ${Object.keys(APP_LANGUAGE).join(', ')} or all (Hindi docs use the English shots)`);
}
const missingAt = args.indexOf('--missing');
const onlyMissing = missingAt >= 0;
if (onlyMissing) args.splice(missingAt, 1);
const languages = langArg === 'all' ? Object.keys(APP_LANGUAGE) : [langArg];
const filter = args[0] ?? '';
// Seeded as already seen, or the What's New dialog covers every shot.
const { version } = JSON.parse(await readFile(resolve(here, '../../package.json'), 'utf8'));

const browser = await chromium.launch();

/** Opens the app with onboarding done and, optionally, a model from ./models loaded and fitted. */
async function openApp({
  width = 1280,
  height = 800,
  lang = 'en',
  model,
  app = {},
  viewer = {},
  firstVisit = false,
  url = '',
}) {
  const context = await browser.newContext({ viewport: { width, height }, deviceScaleFactor: 2 });
  context.setDefaultTimeout(5000);
  context.setDefaultNavigationTimeout(60000);
  const page = await context.newPage();
  await page.addInitScript(
    ([lang, app, viewer, version, firstVisit]) => {
      // Seed storage only on the first load, so reloads inside a shot behave like a returning user.
      if (sessionStorage.getItem('docs-seeded')) return;
      sessionStorage.setItem('docs-seeded', '1');
      localStorage.clear();
      if (firstVisit) return;
      const settings = { onboardingFinished: true, lastSeenChangelogVersion: version, locale: lang, ...app };
      localStorage.setItem('app', JSON.stringify(settings));
      if (Object.keys(viewer).length > 0) localStorage.setItem('viewer', JSON.stringify(viewer));
    },
    [lang, app, viewer, version, firstVisit]
  );
  await page.goto(new URL(url, APP).href);
  await page.waitForSelector('#viewerControls', { timeout: 60000 });
  await page.waitForTimeout(800);
  if (model) {
    await page.setInputFiles('input[type=file]', resolve(here, 'models', `${model}.json`));
    await page.waitForTimeout(600);
  }
  await page.mouse.move(width - 2, height / 2);
  return { context, page };
}

/** The union of the boxes of the given selectors (or a box), grown by `pad` CSS pixels. */
async function clipOf(page, target, pad = 0) {
  const boxes = [];
  for (const t of Array.isArray(target) ? target : [target]) {
    if (typeof t === 'object') boxes.push(t);
    else {
      const box = await page.locator(t).first().boundingBox();
      if (!box) throw new Error(`Nothing to clip: ${t}`);
      boxes.push(box);
    }
  }
  const vp = page.viewportSize();
  const x = Math.max(0, Math.min(...boxes.map((b) => b.x)) - pad);
  const y = Math.max(0, Math.min(...boxes.map((b) => b.y)) - pad);
  const right = Math.min(vp.width, Math.max(...boxes.map((b) => b.x + b.width)) + pad);
  const bottom = Math.min(vp.height, Math.max(...boxes.map((b) => b.y + b.height)) + pad);
  return { x, y, width: right - x, height: bottom - y };
}

async function toWebp(png) {
  const page = await browser.newPage();
  const dataUrl = await page.evaluate(async (b64) => {
    const img = new Image();
    img.src = `data:image/png;base64,${b64}`;
    await img.decode();
    const canvas = document.createElement('canvas');
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
    canvas.getContext('2d').drawImage(img, 0, 0);
    return canvas.toDataURL('image/webp', 0.9);
  }, png.toString('base64'));
  await page.close();
  return Buffer.from(dataUrl.split(',')[1], 'base64');
}

const exists = (file) =>
  access(file).then(
    () => true,
    () => false
  );

const helpers = { clipOf };
let failed = 0;

for (const docsLanguage of languages) {
  const lang = APP_LANGUAGE[docsLanguage];
  const out = docsLanguage === 'en' ? SCREENSHOTS : resolve(SCREENSHOTS, docsLanguage);
  await mkdir(out, { recursive: true });
  setMessages(JSON.parse(await readFile(resolve(here, `../../src/locales/${lang}.json`), 'utf8')));

  for (const shot of shots.filter((s) => s.name.startsWith(filter))) {
    const file = resolve(out, `${shot.name}.webp`);
    if (onlyMissing && (await exists(file))) continue;
    const { context, page } = await openApp({ ...shot, lang });
    try {
      await shot.setup?.(page, helpers);
      await page.waitForTimeout(shot.settle ?? 500);
      const clip = shot.clip ? await clipOf(page, await shot.clip(page, helpers), shot.pad ?? 8) : undefined;
      const png = await page.screenshot({ clip });
      await writeFile(file, await toWebp(png));
      console.log(`✓ ${docsLanguage}/${shot.name}`);
    } catch (e) {
      failed++;
      console.error(`✗ ${docsLanguage}/${shot.name}: ${e.message.split('\n')[0]}`);
    } finally {
      await context.close();
    }
  }
}

await browser.close();
process.exitCode = failed > 0 ? 1 : 0;
