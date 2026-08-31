import { i18n } from '../plugins/i18n';

/**
 * Documentation site (VitePress). The app itself lives on run.edubeam.app.
 */
export const DOCS_BASE = 'https://edubeam.app';

/** Locales the documentation is translated to. Everything else falls back to English. */
const DOCS_LOCALES = new Set(['cs', 'de', 'es', 'fr', 'hi', 'pl', 'pt', 'ru', 'uk', 'zh']);

/** App locale codes that differ from the documentation ones. */
const DOCS_LOCALE_ALIASES: Record<string, string> = { cn: 'zh' };

/**
 * Builds an absolute link into the documentation for the currently selected language,
 * tagged so the traffic coming from the app can be told apart in analytics.
 *
 * @param path documentation path without locale prefix, e.g. `/essentials/loads#nodal-loads`
 * @param campaign utm_campaign value, usually the help topic key
 */
export function docsUrl(path: string, campaign = 'help') {
  const locale = i18n.global.locale.value;
  const docsLocale = DOCS_LOCALE_ALIASES[locale] ?? locale;
  const prefix = DOCS_LOCALES.has(docsLocale) ? `/${docsLocale}` : '';

  const [pathname, hash] = path.split('#');
  // The docs are built without `cleanUrls`, so pages are served with the extension.
  const page = pathname.endsWith('.html') || pathname.endsWith('/') ? pathname : `${pathname}.html`;

  const url = new URL(`${DOCS_BASE}${prefix}${page}`);
  url.searchParams.set('utm_source', 'edubeam-app');
  url.searchParams.set('utm_medium', 'help');
  url.searchParams.set('utm_campaign', campaign);
  if (hash) url.hash = hash;

  return url.toString();
}

/** Opens a documentation page in a new tab and reports the click to analytics. */
export function openDocs(path: string, campaign = 'help') {
  trackDocsClick(campaign);
  window.open(docsUrl(path, campaign), '_blank', 'noopener');
}

/** Fire-and-forget analytics event, no-op when gtag is not loaded (dev builds). */
export function trackDocsClick(campaign: string) {
  const gtag = (window as unknown as { gtag?: (...args: unknown[]) => void }).gtag;
  if (typeof gtag === 'function') gtag('event', 'help_docs_click', { topic: campaign });
}
