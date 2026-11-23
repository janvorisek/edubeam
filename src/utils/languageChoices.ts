import { availableLocales, languageTag } from '@/plugins/i18n';
import { browserAppLocales } from '@/utils';

export type AppLanguage = (typeof availableLocales)[number];

/**
 * Total speakers, first and second language, in millions (Ethnologue 2023, rounded): the order of the
 * languages the browser does not ask for. `cn` is Mandarin Chinese.
 */
export const SPEAKERS: Readonly<Record<string, number>> = {
  en: 1452,
  cn: 1118,
  hi: 602,
  es: 548,
  fr: 274,
  pt: 257,
  ru: 255,
  id: 199,
  de: 134,
  ja: 123,
  tr: 88,
  vi: 85,
  ko: 82,
  it: 68,
  th: 61,
  pl: 41,
  uk: 33,
  ro: 24,
  el: 13.4,
  hu: 12.6,
  cs: 11,
  sk: 7,
};

/**
 * The languages in the order a picker lists them: the ones the browser asks for, in its order, then the
 * language in use if the browser did not name it (some report en-US alone, whatever the reader set), then
 * the rest by number of speakers, so English and the widely spoken ones come before the smaller ones.
 */
export const languageChoices = (
  current: string,
  browserLanguages: readonly string[] = navigator.languages ?? [navigator.language]
): { readonly suggested: readonly AppLanguage[]; readonly others: readonly AppLanguage[] } => {
  const suggestedCodes = [...new Set([...browserAppLocales(browserLanguages), current])].filter((code) =>
    availableLocales.some((l) => l.code === code)
  );

  return {
    suggested: suggestedCodes.map((code) => availableLocales.find((l) => l.code === code)!),
    others: availableLocales
      .filter((l) => !suggestedCodes.includes(l.code))
      .sort((a, b) => (SPEAKERS[b.code] ?? 0) - (SPEAKERS[a.code] ?? 0)),
  };
};

/** Lowercase and without accents, so "magy", "romana" and "ελληνικα" find their language. */
const folded = (text: string) => text.normalize('NFD').replace(/\p{M}/gu, '').toLocaleLowerCase();

const displayName = (code: string, inLanguage: string): string | undefined => {
  try {
    return new Intl.DisplayNames([languageTag(inLanguage)], { type: 'language' }).of(languageTag(code));
  } catch {
    return undefined;
  }
};

/**
 * Whether a language answers a search: by its own name, its name in English and in the language the
 * app speaks now, or its code. Someone stuck in a language they cannot read types "english" or "en".
 */
export const languageMatches = (language: AppLanguage, query: string, uiLocale: string): boolean => {
  const wanted = folded(query.trim());
  if (!wanted) return true;

  return [language.name, language.code, displayName(language.code, 'en'), displayName(language.code, uiLocale)]
    .filter((name): name is string => !!name)
    .some((name) => folded(name).includes(wanted));
};
