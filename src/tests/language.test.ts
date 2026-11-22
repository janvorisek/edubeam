import { describe, it, expect, afterEach } from 'vitest';
import { availableLocales, i18n, setLocale } from '@/plugins/i18n';
import { suggestLanguage } from '@/utils';
import { docsUrl } from '@/utils/docs';

/**
 * The app once spoke Thai and Turkish with English help pages. The guide on the website is in every
 * language of the app, so help links in each one open the guide in that language.
 */
describe('the help links of every language', () => {
  it.each(availableLocales.filter((l) => l.code !== 'en').map((l) => l.code))(
    'link %s help to its own docs',
    (locale) => {
      i18n.global.locale.value = locale;
      // Slovak has no guide of its own and opens the Czech one
      const docsLocale = locale === 'cn' ? 'zh' : locale === 'sk' ? 'cs' : locale;
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

  it('opens Slovak for a Slovak browser', () => {
    expect(suggestLanguage(['sk-SK', 'cs', 'en'])).toBe('sk');
    expect(suggestLanguage(['sk'])).toBe('sk');
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
