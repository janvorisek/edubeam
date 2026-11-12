/**
 * What a number field holds, read the same way everywhere.
 *
 * A number as people write it - a decimal point or comma, spaces between digit groups, 1e3 or 1E+3
 * - and plain arithmetic on such numbers: + - * / and ^, with parentheses, so 6/2 or 3*1.5 can be
 * typed as they are worked out. Nothing else: no names, no functions, and anything that does not read
 * as a whole is NaN, never the part of it that does. The fields used to drop the characters they did
 * not know, which turned 1/2 into 12.
 */

/** Spaces, including the no-break and thin ones copied out of formatted numbers. */
const SPACE = /[\s\u00a0\u2009\u202f]/g;

/** Signs people paste: the minus sign, the multiplication signs × and ·, and ÷. */
const normalize = (text: string) =>
  text
    .replace(SPACE, '')
    .replace(/\u2212/g, '-')
    .replace(/[\u00d7\u00b7]/g, '*')
    .replace(/\u00f7/g, '/');

/** A number: digits with at most one decimal mark (point or comma), and an optional exponent. */
const NUMBER = /^(?:\d+(?:[.,]\d*)?|[.,]\d+)(?:[eE][+-]?\d+)?/;

/** Parses `text`; NaN when it is empty, or anything but a number or arithmetic on numbers. */
export const parseNumberInput = (text: string): number => {
  const source = normalize(text);
  if (source === '') return NaN;

  let at = 0;
  const peek = () => source[at];

  // expression := term (('+' | '-') term)*
  // term       := unary (('*' | '/') unary)*
  // unary      := ('+' | '-') unary | power   the power binds first, so -2^2 is -4, as on paper
  // power      := atom ('^' unary)?           right associative, and 2^-1 is a half
  // atom       := number | '(' expression ')'
  const expression = (): number => {
    let value = term();
    while (peek() === '+' || peek() === '-') {
      const op = source[at++];
      const rhs = term();
      value = op === '+' ? value + rhs : value - rhs;
    }
    return value;
  };

  const term = (): number => {
    let value = unary();
    while (peek() === '*' || peek() === '/') {
      const op = source[at++];
      const rhs = unary();
      value = op === '*' ? value * rhs : value / rhs;
    }
    return value;
  };

  const unary = (): number => {
    if (peek() === '-') {
      at++;
      return -unary();
    }
    if (peek() === '+') {
      at++;
      return unary();
    }
    return power();
  };

  const power = (): number => {
    const base = atom();
    if (peek() !== '^') return base;
    at++;
    return base ** unary();
  };

  const atom = (): number => {
    if (peek() === '(') {
      at++;
      const value = expression();
      if (peek() !== ')') return NaN;
      at++;
      return value;
    }

    const match = NUMBER.exec(source.slice(at));
    if (!match) return NaN;
    at += match[0].length;
    return Number(match[0].replace(',', '.'));
  };

  const value = expression();

  // Left over input means it did not read as a whole; a division by zero is no number either.
  return at === source.length && Number.isFinite(value) ? value : NaN;
};

/** Characters a number field can hold; the keystroke filter lets nothing else be typed. */
export const isNumberInputCharacter = (char: string) => /^[\d.,eE+\-*/^()\s\u00d7\u00b7\u00f7\u2212]$/.test(char);
