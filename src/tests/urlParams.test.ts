import { describe, expect, it } from 'vitest';
import { isViewerModeParam } from '@/utils/urlParams';

describe('isViewerModeParam', () => {
  it('turns viewer mode on for the documented ?viewer=1 and the other values that always did', () => {
    for (const value of ['1', 'true', 'yes', 'on', 'TRUE', '2']) expect(isViewerModeParam(value)).toBe(true);
  });

  it('leaves it off without the parameter, for an empty value, and for the explicit off values', () => {
    expect(isViewerModeParam(null)).toBe(false);
    for (const value of ['', '0', 'false', 'no', 'off', 'False', ' 0 ']) expect(isViewerModeParam(value)).toBe(false);
  });
});
