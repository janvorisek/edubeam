import { describe, it, expect, afterEach } from 'vitest';
import { i18n, availableLocales } from '@/plugins/i18n';
import { selectionSubtitle } from '@/utils/selectionDetails';

describe('the selection panel subtitle', () => {
  it('drops a subtitle that only repeats the heading', () => {
    expect(selectionSubtitle('Prescribed displacement', 'Prescribed displacement')).toBeNull();
    expect(selectionSubtitle('Nodal load', 'Nodal load')).toBeNull();
  });

  it('keeps one that says more, as an element load does', () => {
    expect(selectionSubtitle('Element load', 'Trapezoidal load')).toBe('Trapezoidal load');
  });

  it('has nothing to say without a subtitle', () => {
    expect(selectionSubtitle('Node', null)).toBeNull();
    expect(selectionSubtitle('Node', undefined)).toBeNull();
    expect(selectionSubtitle('Node', '')).toBeNull();
  });
});

/** The duplication the rule exists for is in every language, so no locale is quietly exempt. */
describe('the entity names behind it', () => {
  const original = i18n.global.locale.value;
  afterEach(() => (i18n.global.locale.value = original));

  const say = (locale: string, key: string) => {
    i18n.global.locale.value = locale;
    return i18n.global.t(key);
  };

  it('has locales to check', () => expect(availableLocales.length).toBeGreaterThan(1));

  for (const { code } of availableLocales) {
    it(`${code}: says a nodal load and a prescribed displacement only once`, () => {
      for (const [type, key] of [
        ['nodal-load', 'loads.nodalLoad'],
        ['prescribedbc-load', 'loads.prescribedDisplacement'],
      ] as const) {
        const title = say(code, `selection.${type}`);
        const subtitle = say(code, key);

        expect(title, `selection.${type}`).not.toBe(`selection.${type}`);
        expect(subtitle, key).not.toBe(key);
        expect(selectionSubtitle(title, subtitle)).toBeNull();
      }
    });

    it(`${code}: keeps the kind of an element load`, () => {
      const title = say(code, 'selection.element-load');
      expect(title).not.toBe('selection.element-load');

      for (const kind of ['udl', 'concentrated', 'trapezoidal', 'temperature'] as const) {
        const name = say(code, `loadType.${kind}`);
        // th has no trapezoidal load yet; an untranslated kind is not this rule's business.
        if (name === `loadType.${kind}`) continue;

        expect(selectionSubtitle(title, name), `${kind} over selection.element-load`).toBe(name);
      }
    });
  }
});
