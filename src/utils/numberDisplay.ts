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
