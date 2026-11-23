import { describe, it, expect } from 'vitest';
import { availableLocales } from '@/plugins/i18n';
import { languageChoices, languageMatches } from '@/utils/languageChoices';
import { languageFlags } from '@/utils/languageFlags';

const codes = (languages: readonly { code: string }[]) => languages.map((l) => l.code);
const language = (code: string) => availableLocales.find((l) => l.code === code)!;

describe('the order of the language pickers', () => {
  it('lists English, then the browser languages in its order, then the rest', () => {
    const { suggested, others } = languageChoices(['hu-HU', 'de-AT', 'en-US', 'nl']);

    expect(codes(suggested)).toEqual(['en', 'hu', 'de']);
    expect(others).toHaveLength(availableLocales.length - 3);
    expect(codes(others)).not.toContain('en');
  });

  it('suggests only English to a browser the app does not speak', () => {
    expect(codes(languageChoices(['nl-NL', 'sv']).suggested)).toEqual(['en']);
  });

  it('sorts the rest by name, Latin script first', () => {
    const others = languageChoices([]).others.map((l) => l.name);

    expect(others.slice(0, 3)).toEqual(['Bahasa Indonesia', 'Čeština', 'Deutsch']);
    expect(others.indexOf('Polski')).toBeLessThan(others.indexOf('Ελληνικά'));
    expect(others.indexOf('Ελληνικά')).toBeLessThan(others.indexOf('Русский'));
  });
});

describe('the language search', () => {
  it('finds a language by its own name, without its accents', () => {
    expect(languageMatches(language('ro'), 'romana', 'en')).toBe(true);
    expect(languageMatches(language('el'), 'ελληνικα', 'en')).toBe(true);
    expect(languageMatches(language('hu'), 'MAGY', 'en')).toBe(true);
  });

  it('finds a language by its English name or its code, from any interface language', () => {
    expect(languageMatches(language('el'), 'greek', 'ja')).toBe(true);
    expect(languageMatches(language('en'), 'english', 'th')).toBe(true);
    expect(languageMatches(language('cs'), 'cs', 'ko')).toBe(true);
  });

  it('finds a language by its name in the interface language', () => {
    expect(languageMatches(language('de'), 'němčina', 'cs')).toBe(true);
  });

  it('leaves out what does not match, and keeps everything for an empty search', () => {
    expect(languageMatches(language('de'), 'greek', 'en')).toBe(false);
    expect(availableLocales.every((l) => languageMatches(l, '  ', 'en'))).toBe(true);
  });
});

describe('the language flags', () => {
  it('has a flag for every language of the app', () => {
    expect(availableLocales.filter((l) => !languageFlags[l.code]).map((l) => l.code)).toEqual([]);
  });
});
