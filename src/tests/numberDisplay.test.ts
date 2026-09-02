import { describe, it, expect } from 'vitest';
import { formatResultAsHTML, formatResultAsText } from '@/utils/numberDisplay';

const en = new Intl.NumberFormat('en', { maximumSignificantDigits: 5 });
const cs = new Intl.NumberFormat('cs', { maximumSignificantDigits: 5 });

describe('result number display', () => {
  it('writes the decimal separator of the language', () => {
    expect(formatResultAsText(0.0015, 'scientific', en)).toBe('1.5·10⁻³');
    expect(formatResultAsText(0.0015, 'scientific', cs)).toBe('1,5·10⁻³');
  });

  it('keeps the engineering exponent a multiple of three', () => {
    expect(formatResultAsText(15000, 'engineering', en)).toBe('15·10³');
    expect(formatResultAsText(15000, 'scientific', en)).toBe('1.5·10⁴');
    expect(formatResultAsText(-0.000001529, 'engineering', en)).toBe('-1.529·10⁻⁶');
  });

  it('leaves the everyday range plain in the automatic style', () => {
    expect(formatResultAsText(12.345, 'auto', en)).toBe('12.345');
    expect(formatResultAsText(0.0000123, 'auto', en)).toBe('12.3·10⁻⁶');
    expect(formatResultAsText(1234567, 'auto', en)).toBe('1.2346·10⁶');
  });

  it('writes zero as zero in every style', () => {
    for (const style of ['auto', 'scientific', 'engineering'] as const) {
      expect(formatResultAsText(0, style, en)).toBe('0');
    }
  });

  it('marks the exponent up for HTML', () => {
    expect(formatResultAsHTML(0.0015, 'scientific', cs)).toBe('1,5 &middot; 10<sup>-3</sup>');
    expect(formatResultAsHTML(12.3, 'auto', cs)).toBe('12,3');
  });
});
