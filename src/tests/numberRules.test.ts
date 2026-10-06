import { describe, it, expect } from 'vitest';
import { numberRules, positiveNumberRules, rangeRule } from '../utils';

const check = (rules: ((v: unknown) => unknown)[], v: unknown) =>
  rules.map((r) => r(v)).find((r) => r !== true) ?? true;

describe('numeric field rules', () => {
  it('accepts the number a `v-model.number` field holds', () => {
    expect(check(numberRules, 0.5)).toBe(true);
    expect(check(positiveNumberRules, 0.5)).toBe(true);
  });

  it('accepts strings, including a decimal comma', () => {
    expect(check(numberRules, '0,5')).toBe(true);
    expect(check(numberRules, '1e5')).toBe(true);
    expect(check(numberRules, ' 12 ')).toBe(true);
  });

  it('rejects empty, junk and non positive values', () => {
    expect(check(numberRules, '')).not.toBe(true);
    expect(check(numberRules, null)).not.toBe(true);
    expect(check(numberRules, '5abc')).not.toBe(true);
    expect(check(numberRules, NaN)).not.toBe(true);
    expect(check(positiveNumberRules, 0)).not.toBe(true);
    expect(check(positiveNumberRules, -3)).not.toBe(true);
  });
});

describe('a position along an element', () => {
  // A 3 m element measured in feet: 3 / 0.3048 = 9.842519685039372 ft
  const lengthInFeet = 3 / 0.3048;
  const withinElement = rangeRule(0, lengthInFeet, 'ft');

  it('takes the position in the display unit, so 9 ft fits a 3 m element', () => {
    expect(withinElement('9')).toBe(true);
    expect(withinElement('0')).toBe(true);
    expect(withinElement('10')).not.toBe(true);
    expect(withinElement('-0,1')).not.toBe(true);
  });

  it('accepts the far end as displayed, though it went through a conversion', () => {
    expect(withinElement(`${(3 / 0.3048) * (1 + 1e-15)}`)).toBe(true);
  });

  it('says the bound in the display unit', () => {
    expect(withinElement('10')).toContain('9.84252 ft');
  });
});
