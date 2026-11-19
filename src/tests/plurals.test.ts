import { describe, it, expect } from 'vitest';
import { i18n } from '@/plugins/i18n';

/** "node 2, 3" read wrong: a message naming a list of labels is worded for one label or for several. */
const say = (locale: string, key: string, named: Record<string, string>, count: number) =>
  i18n.global.t(key, named, { locale, plural: count });

describe('messages naming a list of labels', () => {
  it('use the singular for one label and the plural for several', () => {
    expect(say('en', 'validators.materialInUse', { elements: '3' }, 1)).toBe(
      'Material is used by element 3. Reassign it before deleting the material.'
    );
    expect(say('en', 'validators.materialInUse', { elements: '3, 4' }, 2)).toBe(
      'Material is used by elements 3, 4. Reassign them before deleting it.'
    );
  });

  it('do so in other languages too', () => {
    expect(say('cs', 'solveDiagnostics.issues.hingeMechanismShort', { nodes: '2' }, 1)).toBe(
      'Klouby v uzlu 2 umožňují konstrukci pohyb.'
    );
    expect(say('cs', 'solveDiagnostics.issues.hingeMechanismShort', { nodes: '2, 3' }, 2)).toBe(
      'Klouby v uzlech 2, 3 umožňují konstrukci pohyb.'
    );
    expect(say('de', 'validators.crossSectionInUse', { elements: '1, 2' }, 2)).toMatch(
      /^Der Querschnitt wird von den Elementen 1, 2/
    );
    // A language without plural forms has one message for both
    expect(say('ja', 'solveDiagnostics.issues.hingeMechanismShort', { nodes: '2, 3' }, 2)).toBe(
      '節点 2, 3 のヒンジにより、構造物が動いてしまいます。'
    );
  });
});
