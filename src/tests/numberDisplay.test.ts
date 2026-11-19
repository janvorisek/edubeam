import { describe, it, expect } from 'vitest';
import {
  createDisplayNumberFormat,
  formatDisplacementLabel,
  formatResultAsHTML,
  formatResultAsText,
  toFixedDisplay,
} from '@/utils/numberDisplay';

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

/** Labels showed "-0.00" for a value just below zero, which is round-off as often as not. */
describe('negative zero', () => {
  const labels = createDisplayNumberFormat('en', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  it('writes a label that rounds to zero as 0', () => {
    expect(labels.format(-0.001)).toBe('0.00');
    expect(labels.format(-0)).toBe('0.00');
    expect(labels.format(-0.005)).toBe('-0.01');
    expect(labels.format(-1.5)).toBe('-1.50');
    expect(createDisplayNumberFormat('cs', { maximumFractionDigits: 2 }).format(-0.001)).toBe('0');
  });

  it('writes a result of -0 as 0', () => {
    const results = createDisplayNumberFormat('en', { maximumSignificantDigits: 5 });
    expect(formatResultAsText(-0, 'auto', results)).toBe('0');
    expect(formatResultAsText(-2.5, 'auto', results)).toBe('-2.5');
  });

  it('writes fixed decimals that round to zero as 0', () => {
    expect(toFixedDisplay(-0.001, 2)).toBe('0.00');
    expect(toFixedDisplay(-1e-17, 3)).toBe('0.000');
    expect(toFixedDisplay(-0.006, 2)).toBe('-0.01');
  });
});

/** The prescribed displacement labels wrote "0.01" with a point in Czech, beside drawing labels written "12,00". */
describe('displacement labels', () => {
  const cs = createDisplayNumberFormat('cs', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const en = createDisplayNumberFormat('en', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  it("use the language's decimal separator", () => {
    expect(formatDisplacementLabel(0.01, cs)).toBe('0,01');
    expect(formatDisplacementLabel(-12, cs)).toBe('-12,00');
    expect(formatDisplacementLabel(0.01, en)).toBe('0.01');
  });

  it('write a power of ten where two decimals would not do', () => {
    expect(formatDisplacementLabel(0.0015, cs)).toBe('1,50·10⁻³');
    expect(formatDisplacementLabel(25000, en)).toBe('2.50·10⁴');
    expect(formatDisplacementLabel(0, cs)).toBe('0,00');
  });
});
