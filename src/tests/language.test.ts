import { describe, it, expect, afterEach } from 'vitest';
import { i18n, setLocale } from '@/plugins/i18n';
import { suggestLanguage } from '@/utils';

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
    expect(suggestLanguage(['zh-HK', 'ja'])).toBe('en');
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
