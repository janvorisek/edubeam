import { describe, it, expect, afterEach } from 'vitest';
import { readdirSync } from 'node:fs';
import { join } from 'node:path';
import { availableLocales, i18n, setLocale } from '@/plugins/i18n';
import { suggestLanguage } from '@/utils';
import { docsUrl } from '@/utils/docs';

/**
 * The app once spoke Thai and Turkish with English help pages, while the Hindi docs sent readers to an
 * English app. Every language is now both, and a new one has to be added to both.
 */
describe('the languages of the app and the docs', () => {
  const docsLanguages = readdirSync(join(process.cwd(), 'docs'), { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && /^[a-z]{2}$/.test(entry.name))
    .map((entry) => entry.name);
  // The docs say zh where the app says cn.
  const appLanguages = availableLocales.map((l) => (l.code === 'cn' ? 'zh' : l.code));

  it('are the same', () => {
    expect([...docsLanguages].sort()).toEqual([...appLanguages].sort());
  });

  it.each(availableLocales.filter((l) => l.code !== 'en').map((l) => l.code))(
    'link %s help to its own docs',
    (locale) => {
      i18n.global.locale.value = locale;
      const docsLocale = locale === 'cn' ? 'zh' : locale;
      expect(new URL(docsUrl('/essentials/loads')).pathname.startsWith(`/${docsLocale}/`)).toBe(true);
      i18n.global.locale.value = 'en';
    }
  );
});

describe('the language of a first visit', () => {
  it('matches the browser language whatever its region', () => {
    expect(suggestLanguage(['cs-CZ', 'en-US'])).toBe('cs');
    expect(suggestLanguage(['pt-BR'])).toBe('pt');
    expect(suggestLanguage(['de-CH', 'en'])).toBe('de');
    expect(suggestLanguage(['th'])).toBe('th');
  });

  it('takes the first language the app speaks', () => {
    expect(suggestLanguage(['nl-NL', 'fr-FR', 'en'])).toBe('fr');
  });

  it('opens Simplified Chinese as cn and leaves Traditional in English', () => {
    expect(suggestLanguage(['zh-CN'])).toBe('cn');
    expect(suggestLanguage(['zh'])).toBe('cn');
    expect(suggestLanguage(['zh-SG'])).toBe('cn');
    expect(suggestLanguage(['zh-TW'])).toBe('en');
    expect(suggestLanguage(['zh-HK', 'ja'])).toBe('ja');
  });

  it('falls back to English', () => {
    expect(suggestLanguage([])).toBe('en');
    expect(suggestLanguage(['not a tag', 'nl'])).toBe('en');
  });
});

describe('setLocale', () => {
  afterEach(() => setLocale('en'));

  it('tells the browser the page language', async () => {
    await setLocale('cs');
    expect(document.documentElement.lang).toBe('cs');
  });

  it('tags cn as Simplified Chinese', async () => {
    await setLocale('cn');
    expect(document.documentElement.lang).toBe('zh-Hans');
  });

  it('gives Chinese the Vuetify strings of Simplified Chinese', async () => {
    await setLocale('cn');
    expect(i18n.global.t('$vuetify.close')).toBe('关闭');
  });
});
