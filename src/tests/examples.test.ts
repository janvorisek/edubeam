import { describe, it, expect } from 'vitest';
import { DofID } from '@edubeam/fem';
import { getExample, buildExampleSolver } from '@/utils/examples';

/**
 * Global z points down, so a downward load is a positive Fz. The cantilever's "18 kN downward"
 * load and the continuous beam's point load were entered as negative values and pushed up,
 * against the description and against the uniform loads beside them.
 */
describe('example loads', () => {
  it('loads the cantilever downward, as its description says', () => {
    const solver = buildExampleSolver(getExample('cantilever')!);
    const [tip] = solver.loadCases[0].nodalLoadList;

    expect(tip.values[DofID.Dz]).toBe(18000);
  });

  it('loads the continuous beam downward throughout', () => {
    const [loadCase] = buildExampleSolver(getExample('continuous')!).loadCases;

    for (const load of loadCase.nodalLoadList) expect(load.values[DofID.Dz]).toBeGreaterThan(0);
    for (const load of loadCase.elementLoadList) expect(load.values[1]).toBeGreaterThan(0);
  });
});

/**
 * The truss example was called a Pratt truss, but its diagonals alternate and it has no verticals:
 * a Warren truss. The id stays `pratt`, as links and the docs gallery name it; only the title changed.
 */
describe('the truss example', () => {
  it('is a Warren truss: no vertical members', () => {
    const { domain } = buildExampleSolver(getExample('pratt')!);
    const vertical = [...domain.elements.values()].filter((element) => {
      const [a, b] = element.nodes.map((label) => domain.getNode(label).coords);
      return Math.abs(a[0] - b[0]) < 1e-9;
    });

    expect(vertical).toEqual([]);
  });

  // Importing i18n reads every locale, which under a full parallel run can take longer than the default 5 s
  it('is titled one', async () => {
    const { i18n } = await import('@/plugins/i18n');
    expect(i18n.global.t('examples.items.pratt.title', {}, { locale: 'en' })).toBe('Warren truss');
  }, 20_000);
});
