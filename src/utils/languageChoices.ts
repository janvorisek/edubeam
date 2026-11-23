import { availableLocales, languageTag } from '@/plugins/i18n';
import { browserAppLocales } from '@/utils';

export type AppLanguage = (typeof availableLocales)[number];

/**
 * The languages in the order a picker lists them: English, then the ones the browser asks for, in its
 * order, then the rest by name. English heads the list because it is the language people fall back
 * to; the browser's choices follow because they are the likely pick.
 */
export const languageChoices = (
  browserLanguages: readonly string[] = navigator.languages ?? [navigator.language]
): { readonly suggested: readonly AppLanguage[]; readonly others: readonly AppLanguage[] } => {
  const suggestedCodes = [...new Set(['en', ...browserAppLocales(browserLanguages)])];
  const byCode = (code: string) => availableLocales.find((l) => l.code === code)!;
  // One collation for every script, so Latin names sort A–Z and the other scripts follow in a fixed order
  const collator = new Intl.Collator('en');

  return {
    suggested: suggestedCodes.map(byCode),
    others: availableLocales
      .filter((l) => !suggestedCodes.includes(l.code))
      .sort((a, b) => collator.compare(a.name, b.name)),
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
