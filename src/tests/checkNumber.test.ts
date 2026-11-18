import { describe, it, expect } from 'vitest';
import { checkNumber } from '@/utils';

const keydown = (init: Record<string, unknown>) => {
  const e = { preventDefault: () => (e.prevented = true), stopPropagation: () => {}, prevented: false, ...init };
  return e;
};

describe('the number fields’ keystroke filter', () => {
  // EDUBEAM-APP-FQ and FR: Chrome's autofill and some input methods send a keydown with no key
  it('lets an event with no key through instead of throwing', () => {
    const e = keydown({ key: undefined });
    expect(() => checkNumber(e as unknown as KeyboardEvent)).not.toThrow();
    expect(e.prevented).toBe(false);
  });

  it('still stops a letter and lets a digit and a full-width comma through', () => {
    const letter = keydown({ key: 'a' });
    checkNumber(letter as unknown as KeyboardEvent);
    expect(letter.prevented).toBe(true);

    for (const key of ['5', '，', '．']) {
      const e = keydown({ key });
      checkNumber(e as unknown as KeyboardEvent);
      expect(e.prevented, key).toBe(false);
    }
  });
});
