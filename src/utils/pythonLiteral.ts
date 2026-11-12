/**
 * Reads the Python literals the desktop EduBeam wrote into its session files: the attribute values
 * there are `repr()`s - `{'Y': True, 'x': False}`, `['1', '2']`, `u'Z'` - which that program read
 * back with `eval`. Only literals are understood (dicts, lists, tuples, strings, numbers, True,
 * False, None); anything else is an error, never code.
 */
export type PyValue = null | boolean | number | string | PyValue[] | { [key: string]: PyValue };

export class PythonLiteralError extends Error {
  constructor(message: string, source: string, at: number) {
    super(`${message} at ${at} in ${JSON.stringify(source.length > 80 ? `${source.slice(0, 80)}…` : source)}`);
    this.name = 'PythonLiteralError';
  }
}

const ESCAPES: Readonly<Record<string, string>> = {
  '\\': '\\',
  "'": "'",
  '"': '"',
  n: '\n',
  r: '\r',
  t: '\t',
  '0': '\0',
};

const NUMBER = /^[+-]?(?:\d+\.?\d*|\.\d+)(?:[eE][+-]?\d+)?[lL]?/;

export const parsePythonLiteral = (source: string): PyValue => {
  let at = 0;

  const fail = (message: string): never => {
    throw new PythonLiteralError(message, source, at);
  };

  const skipSpace = () => {
    while (at < source.length && /\s/.test(source[at])) at++;
  };

  const expect = (char: string) => {
    skipSpace();
    if (source[at] !== char) fail(`Expected "${char}"`);
    at++;
  };

  const readString = (): string => {
    // u'' and b'' are Python 2's unicode and byte strings; r'' takes backslashes as they are.
    let raw = false;
    while (/[uUbBrR]/.test(source[at])) {
      if (source[at] === 'r' || source[at] === 'R') raw = true;
      at++;
    }

    const quote = source[at];
    if (quote !== "'" && quote !== '"') fail('Expected a string');
    at++;

    let out = '';
    while (at < source.length && source[at] !== quote) {
      const char = source[at++];
      if (char !== '\\' || raw) {
        out += char;
        continue;
      }

      const next = source[at++];
      if (next === 'x' || next === 'u') {
        const length = next === 'x' ? 2 : 4;
        const hex = source.slice(at, at + length);
        if (!/^[0-9a-fA-F]+$/.test(hex) || hex.length !== length) fail('Invalid escape');
        out += String.fromCharCode(parseInt(hex, 16));
        at += length;
      } else {
        out += ESCAPES[next] ?? `\\${next}`;
      }
    }

    if (source[at] !== quote) fail('Unterminated string');
    at++;
    return out;
  };

  const readSequence = (close: string): PyValue[] => {
    const items: PyValue[] = [];
    skipSpace();
    while (source[at] !== close) {
      items.push(readValue());
      skipSpace();
      if (source[at] === ',') at++;
      else if (source[at] !== close) fail(`Expected "," or "${close}"`);
      skipSpace();
    }
    at++;
    return items;
  };

  const readDict = (): { [key: string]: PyValue } => {
    const dict: { [key: string]: PyValue } = {};
    skipSpace();
    while (source[at] !== '}') {
      const key = readValue();
      if (key === null || typeof key === 'object') fail('Unsupported dictionary key');
      expect(':');
      dict[String(key)] = readValue();
      skipSpace();
      if (source[at] === ',') at++;
      else if (source[at] !== '}') fail('Expected "," or "}"');
      skipSpace();
    }
    at++;
    return dict;
  };

  const readValue = (): PyValue => {
    skipSpace();
    const char = source[at];

    if (char === '{') {
      at++;
      return readDict();
    }
    if (char === '[') {
      at++;
      return readSequence(']');
    }
    if (char === '(') {
      at++;
      return readSequence(')');
    }
    if (char === "'" || char === '"' || /^[uUbBrR]+['"]/.test(source.slice(at, at + 3))) return readString();

    for (const [word, value] of [
      ['True', true],
      ['False', false],
      ['None', null],
    ] as const) {
      if (source.startsWith(word, at) && !/\w/.test(source[at + word.length] ?? '')) {
        at += word.length;
        return value;
      }
    }

    const number = NUMBER.exec(source.slice(at));
    if (number) {
      at += number[0].length;
      return Number(number[0].replace(/[lL]$/, ''));
    }

    return fail('Unexpected input');
  };

  const value = readValue();
  skipSpace();
  if (at !== source.length) fail('Unexpected input after the value');
  return value;
};
