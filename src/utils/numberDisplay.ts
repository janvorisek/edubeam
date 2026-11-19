/**
 * Result values for display: the mantissa is written by an Intl formatter, so the decimal
 * separator follows the app language, and the exponent style is the user's choice.
 */

export type ResultNumberStyle = 'auto' | 'scientific' | 'engineering';

const SUPERSCRIPTS: Record<string, string> = {
  '-': '⁻',
  '0': '⁰',
  '1': '¹',
  '2': '²',
  '3': '³',
  '4': '⁴',
  '5': '⁵',
  '6': '⁶',
  '7': '⁷',
  '8': '⁸',
  '9': '⁹',
};

const superscript = (exponent: number) =>
  String(exponent)
    .split('')
    .map((c) => SUPERSCRIPTS[c] ?? c)
    .join('');

/** In the automatic style, this range reads better as a plain number than as a power of ten. */
const PLAIN_MIN = 1e-3;
const PLAIN_MAX = 1e5;

const splitValue = (value: number, style: ResultNumberStyle): { mantissa: number; exponent: number } => {
  if (value === 0 || !Number.isFinite(value)) return { mantissa: value, exponent: 0 };

  const magnitude = Math.abs(value);

  if (style === 'auto' && magnitude >= PLAIN_MIN && magnitude < PLAIN_MAX) {
    return { mantissa: value, exponent: 0 };
  }

  // engineering keeps the exponent a multiple of three, so it reads as a unit prefix
  const step = style === 'scientific' ? 1 : 3;
  const exponent = Math.floor(Math.log10(magnitude) / step) * step;

  return { mantissa: value / 10 ** exponent, exponent };
};

/** For HTML contexts: `-1,53 · 10<sup>-6</sup>`. */
export const formatResultAsHTML = (value: number, style: ResultNumberStyle, format: Intl.NumberFormat): string => {
  const { mantissa, exponent } = splitValue(value, style);

  if (exponent === 0) return format.format(mantissa);

  return `${format.format(mantissa)} &middot; 10<sup>${exponent}</sup>`;
};

/** For plain text and SVG labels, where markup is not an option: `-1,53·10⁻⁶`. */
export const formatResultAsText = (value: number, style: ResultNumberStyle, format: Intl.NumberFormat): string => {
  const { mantissa, exponent } = splitValue(value, style);

  if (exponent === 0) return format.format(mantissa);

  return `${format.format(mantissa)}·10${superscript(exponent)}`;
};

/**
 * A number formatter for display that writes a value rounding to zero as 0: plain Intl writes
 * -0.001 to two decimals as "-0.00", and round-off in a result is often a tiny negative number.
 * `signDisplay: 'negative'` is from 2023; a browser without it gets the formatter as before.
 */
export const createDisplayNumberFormat = (locale: string, options: Intl.NumberFormatOptions): Intl.NumberFormat => {
  try {
    return new Intl.NumberFormat(locale, { ...options, signDisplay: 'negative' });
  } catch {
    return new Intl.NumberFormat(locale, options);
  }
};

/** `value.toFixed(digits)`, but a value that rounds to zero is written 0, never "-0.00". */
export const toFixedDisplay = (value: number, digits: number): string => {
  const text = value.toFixed(digits);
  return Number(text) === 0 ? (0).toFixed(digits) : text;
};

/**
 * A displacement or rotation label on the drawing: written by the labels' formatter, so it has the
 * language's decimal separator, with a power of ten outside 0.01-1000, where two decimals would
 * show nothing or too much (the range formatScientificNumber used).
 */
export const formatDisplacementLabel = (value: number, format: Intl.NumberFormat): string => {
  const magnitude = Math.abs(value);
  if (value === 0 || (magnitude >= 0.01 && magnitude <= 1000)) return format.format(value);

  return formatResultAsText(value, 'scientific', format);
};
