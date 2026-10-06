import { describe, it, expect } from 'vitest';
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

/**
 * How a label is centred on the point it names.
 *
 * The drawing is one scaled group: every label is written at a font size of a few hundredths of a
 * unit and blown up by the view's scale. At that size the baseline properties come apart, and each
 * engine in its own way - measured on the same markup, as a fraction of an em away from centre:
 *
 *                              Blink    WebKit    Gecko
 *   dominant-baseline central   0.00     -0.43     0.00
 *   dominant-baseline middle   -0.16     -0.16    +0.93
 *   dy 0.35em                  -0.07     -0.05    -0.07
 *
 * So `central` hangs the node names above their rings in Safari and `middle` drops them below in
 * Firefox, while a plain `dy` - a length like any other, scaled with everything else - lands in the
 * same place everywhere. Hence the rule: the drawing shifts its labels with `dy`, and leaves the
 * baseline properties alone. (`dominant-baseline="baseline"` is the default spelled out and moves
 * nothing, so it is not what this is about.)
 *
 * Nothing here lays anything out, so this reads the sources: the behaviour itself was measured in
 * all three engines, and this only keeps the attribute from creeping back.
 */
describe('centring a label on its anchor', () => {
  const root = join(process.cwd(), 'src/components');

  const templates = readdirSync(root, { recursive: true, encoding: 'utf-8' })
    .filter((path) => path.endsWith('.vue'))
    .map((path) => ({ path, source: readFileSync(join(root, path), 'utf-8') }));

  it('finds the drawing to check', () => {
    expect(templates.length).toBeGreaterThan(20);
  });

  it('never centres text with a baseline property', () => {
    const offenders = templates
      .filter(({ source }) => /(dominant|alignment)-baseline="(central|middle)"/.test(source))
      .map(({ path }) => path);

    expect(offenders).toEqual([]);
  });

  it('centres it with a shift the renderers agree on', () => {
    const shifting = templates.filter(({ source }) => source.includes('dy="0.35em"'));

    // the labels of the drawing itself, at least: nodes, elements and what is applied to them
    expect(shifting.length).toBeGreaterThan(8);
  });
});
