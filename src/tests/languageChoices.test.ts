import { describe, it, expect } from 'vitest';
import { availableLocales } from '@/plugins/i18n';
import { languageChoices, languageMatches, SPEAKERS } from '@/utils/languageChoices';
import { languageFlags } from '@/utils/languageFlags';

const codes = (languages: readonly { code: string }[]) => languages.map((l) => l.code);
const language = (code: string) => availableLocales.find((l) => l.code === code)!;

describe('the order of the language pickers', () => {
  it("lists the browser's languages first, in its order", () => {
    expect(codes(languageChoices('cs', ['cs-CZ', 'en-US', 'de']).suggested)).toEqual(['cs', 'en', 'de']);
    expect(codes(languageChoices('en', ['en-US', 'cs']).suggested)).toEqual(['en', 'cs']);
  });

  it('adds the language in use after them when the browser does not report it', () => {
    // Some browsers, and privacy settings, report en-US whatever the reader set
    expect(codes(languageChoices('cs', ['en-US']).suggested)).toEqual(['en', 'cs']);
  });

  it('lists the rest by number of speakers, English first among them', () => {
    const { suggested, others } = languageChoices('cs', ['cs-CZ', 'nl']);

    expect(codes(suggested)).toEqual(['cs']);
    expect(codes(others).slice(0, 5)).toEqual(['en', 'cn', 'hi', 'es', 'fr']);
    expect(codes(others).at(-1)).toBe('sk');
    expect(others).toHaveLength(availableLocales.length - 1);
  });

  it('knows the speakers of every language of the app, so a new one is not dropped to the end', () => {
    expect(availableLocales.filter((l) => !(SPEAKERS[l.code] > 0)).map((l) => l.code)).toEqual([]);
  });

  it('ranks every language of the app by its speakers', () => {
    const ranked = languageChoices('en', []).others.map((l) => l.code);

    expect(ranked).toHaveLength(availableLocales.length - 1);
    expect(ranked.indexOf('id')).toBeLessThan(ranked.indexOf('cs'));
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
