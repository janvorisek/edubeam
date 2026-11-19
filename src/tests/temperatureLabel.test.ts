import { describe, it, expect } from 'vitest';
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

/**
 * Read as files rather than imported: the build compiles locale JSON into message functions, so an
 * import gives an abstract syntax tree where the string used to be.
 */
const LOCALES = join(process.cwd(), 'src/locales');

const languages = readdirSync(LOCALES)
  .filter((name) => name.endsWith('.json'))
  .map(
    (name) =>
      [
        name.replace('.json', ''),
        JSON.parse(readFileSync(join(LOCALES, name), 'utf-8')).loads as Record<string, string>,
      ] as const
  );

const of = (language: string) => languages.find(([name]) => name === language)![1];

const plain = (marked: string) => marked.replace(/<\/?sub>/g, '');

/** The letter a subscripted symbol carries: ΔT<sub>c</sub> is c. */
const subscript = (marked: string) => marked.match(/<sub>(\w)<\/sub>/)?.[1];

/**
 * The three temperatures of a section are named as a set, and which set depends on the language: a
 * fibre is bottom or top in English and dolní or horní in Czech, so the axis between them is the
 * centroid in one and the střednice in the other. Taking one letter from one language and two from
 * another - a ΔTs between a ΔTb and a ΔTt - is a set that belongs to neither.
 */
const expectedAxial = (fibres: string) => (fibres.includes('d') && fibres.includes('h') ? 's' : 'c');

describe('the letters of a temperature load', () => {
  it('names the axis from the same set as the fibres, in every language', () => {
    for (const [language, loads] of languages) {
      const fibres = plain(loads.temperatureDeltaTbt).replace(/ΔT|-/g, '');

      expect(subscript(loads.temperatureDeltaTs), language).toBe(expectedAxial(fibres));
    }
  });

  it('uses the English set where a language has no settled one of its own', () => {
    // every language but Czech names the fibres b and t, so the axis is c with them
    expect(plain(of('en').temperatureDeltaTs)).toBe('ΔTc');
    expect(plain(of('de').temperatureDeltaTs)).toBe('ΔTc');
    expect(plain(of('cs').temperatureDeltaTs)).toBe('ΔTs');
  });

  it('is the same letter in the drawing as in the dialog', () => {
    // the drawing cannot show markup, so it has a plain twin rather than a different name
    for (const [language, loads] of languages) {
      expect(loads.temperatureDeltaTsNoHTML, language).toBe(plain(loads.temperatureDeltaTs));
      expect(loads.temperatureDeltaTbtNoHTML, language).toBe(plain(loads.temperatureDeltaTbt));
    }
  });

  it('is there in every language, in both forms', () => {
    for (const [language, loads] of languages) {
      expect(loads.temperatureDeltaTs, language).toBeTruthy();
      expect(loads.temperatureDeltaTsNoHTML, language).toBeTruthy();
      expect(loads.temperatureDeltaTbtNoHTML, language).toBeTruthy();
    }
  });

  it('carries no markup in the plain form, in any language', () => {
    for (const [language, loads] of languages) {
      expect(loads.temperatureDeltaTsNoHTML, language).not.toContain('<');
      expect(loads.temperatureDeltaTbtNoHTML, language).not.toContain('<');
    }
  });

  it('opens the explanation with the symbol it explains', () => {
    for (const [language, loads] of languages) {
      expect(loads.temperatureBending.startsWith(loads.temperatureDeltaTs), language).toBe(true);
      expect(loads.temperatureAxial.startsWith(loads.temperatureDeltaTbt), language).toBe(true);
    }
  });
});
