import { describe, it, expect } from 'vitest';
import { numberRules, positiveNumberRules } from '../utils';

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
