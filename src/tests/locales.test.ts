import { describe, it, expect } from 'vitest';
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { availableLocales } from '@/plugins/i18n';
import { examples } from '@/utils/examples';

type Messages = { [key: string]: string | Messages };

const localesDir = join(process.cwd(), 'src/locales');
const read = (code: string) => JSON.parse(readFileSync(join(localesDir, `${code}.json`), 'utf-8')) as Messages;

const flatten = (messages: Messages, prefix = ''): Record<string, string> =>
  Object.entries(messages).reduce<Record<string, string>>((flat, [key, value]) => {
    if (typeof value === 'string') flat[prefix + key] = value;
    else Object.assign(flat, flatten(value, `${prefix}${key}.`));
    return flat;
  }, {});

const placeholders = (message: string) => [...message.matchAll(/\{(\w+)\}/g)].map((m) => m[1]).sort();

const en = flatten(read('en'));

/** English is the fallback, so a missing key never breaks the page - it just shows up in English. */
describe.each(availableLocales.filter((l) => l.code !== 'en').map((l) => l.code))('the %s locale', (code) => {
  const messages = flatten(read(code));

  it('has every English key', () => {
    expect(Object.keys(en).filter((key) => !(key in messages))).toEqual([]);
  });

  it('has no key English does not', () => {
    expect(Object.keys(messages).filter((key) => !(key in en))).toEqual([]);
  });

  it('keeps the placeholders of the English text', () => {
    const changed = Object.keys(messages).filter(
      (key) => key in en && placeholders(messages[key]).join() !== placeholders(en[key]).join()
    );
    expect(changed).toEqual([]);
  });
});

/** A key the code asks for but no locale has is printed raw, as `settings.mouse.all` once was. */
describe('keys named in the code', () => {
  const sources = readdirSync(join(process.cwd(), 'src'), { recursive: true, encoding: 'utf-8' })
    .filter((path) => /\.(vue|ts)$/.test(path) && !path.startsWith('tests'))
    .map((path) => readFileSync(join(process.cwd(), 'src', path), 'utf-8'));

  const named = new Set(
    sources.flatMap((source) =>
      [...source.matchAll(/(?:\$t|\bt|\bte|\$te)\(\s*'([\w.-]+)'/g)]
        .map((m) => m[1])
        // `t('selection.' + type)` names a group, not a key
        .filter((key) => key.includes('.') && !key.endsWith('.'))
    )
  );

  it('finds some to check', () => expect(named.size).toBeGreaterThan(100));

  it('are all in English', () => {
    const groups = new Set(
      Object.keys(en).flatMap((key) => key.split('.').map((_, i, parts) => parts.slice(0, i + 1).join('.')))
    );
    expect([...named].filter((key) => !(key in en) && !groups.has(key))).toEqual([]);
  });

  it('include a title and blurb for every example', () => {
    const missing = examples.flatMap(({ id }) =>
      ['title', 'blurb'].map((part) => `examples.items.${id}.${part}`).filter((key) => !(key in en))
    );
    expect(missing).toEqual([]);
  });
});
