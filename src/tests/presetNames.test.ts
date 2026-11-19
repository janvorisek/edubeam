import { describe, it, expect } from 'vitest';
import { i18n } from '@/plugins/i18n';
import { materialPresets } from '@/utils/materialPresets';
import { crossSectionPresets } from '@/utils/crossSectionPresets';
import { presetDisplayName, presetNameParts } from '@/utils/presetNames';

/** The library showed "Steel (S235)" and "IPE 200 (approx)" in English whatever the app language. */
const shown = (name: string, locale: string) => presetDisplayName(name, (key) => i18n.global.t(key, {}, { locale }));

const presets = [...materialPresets, ...crossSectionPresets];

/** What may stay as written: designations, which carry a digit or are capital-letter codes. */
const isDesignation = (text: string) => /\d/.test(text) || /^[A-Z]+$/.test(text);

describe('library names', () => {
  it('stay exactly as they were in English', () => {
    for (const { name } of presets) expect(shown(name, 'en')).toBe(name);
  });

  it('are translated in other languages, designations kept', () => {
    expect(shown('Steel (S235)', 'cs')).toBe('Ocel (S235)');
    expect(shown('IPE 200 (approx)', 'cs')).toBe('IPE 200 (přibl.)');
    expect(shown('Rect 100x10 mm', 'de')).toBe('Rechteck 100x10 mm');
    expect(shown('Cast iron (gray)', 'fr')).toBe('Fonte (grise)');
    expect(shown('W12x26', 'cs')).toBe('W12x26');
    expect(shown("Concrete (f'c = 4 ksi)", 'es')).toBe("Hormigón (f'c = 4 ksi)");
  });

  it('cover every word of every library entry', () => {
    const untranslated = presets
      .map(({ name }) => ({ name, parts: presetNameParts(name) }))
      .filter(({ parts }) => {
        const base = parts.base !== undefined || parts.baseText.split(' ').every(isDesignation);
        const bracket = parts.bracket === null || parts.qualifier !== undefined || isDesignation(parts.bracket);
        return !(base && bracket);
      })
      .map(({ name }) => name);

    expect(untranslated).toEqual([]);
  });
});
