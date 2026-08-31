import { describe, it, expect, afterEach } from 'vitest';
import { docsUrl } from '@/utils/docs';
import { i18n } from '@/plugins/i18n';
import { helpTopics } from '@/utils/helpTopics';
import { availableLocales } from '@/plugins/i18n';

const setLocale = (locale: string) => (i18n.global.locale.value = locale);

afterEach(() => setLocale('en'));

describe('docsUrl', () => {
  it('points at the English docs and tags the campaign', () => {
    expect(docsUrl('/essentials/loads', 'loads')).toBe(
      'https://edubeam.app/essentials/loads.html?utm_source=edubeam-app&utm_medium=help&utm_campaign=loads'
    );
  });

  it('keeps the anchor after the query', () => {
    expect(docsUrl('/essentials/loads#nodal-loads', 'nodalLoads')).toBe(
      'https://edubeam.app/essentials/loads.html?utm_source=edubeam-app&utm_medium=help&utm_campaign=nodalLoads#nodal-loads'
    );
  });

  it('prefixes locales the docs are translated to', () => {
    setLocale('cs');
    expect(docsUrl('/essentials/results')).toContain('https://edubeam.app/cs/essentials/results.html');
  });

  it('maps app locale codes that differ from the docs ones', () => {
    setLocale('cn');
    expect(docsUrl('/essentials/results')).toContain('https://edubeam.app/zh/essentials/results.html');
  });

  it('falls back to English for untranslated locales', () => {
    setLocale('th');
    expect(docsUrl('/essentials/results')).toContain('https://edubeam.app/essentials/results.html');
  });
});

describe('helpTopics', () => {
  const keys = Object.values(helpTopics).flatMap((topic) => [topic.title, topic.body]);

  it.each(availableLocales.map((l) => l.code))('is fully translated in %s', (locale) => {
    const missing = keys.filter((key) => !i18n.global.te(key, locale));
    expect(missing, `missing in ${locale}`).toEqual([]);
  });

  it('resolves every topic to real text, not the key', () => {
    for (const key of keys) expect(i18n.global.t(key), key).not.toBe(key);
  });
});
