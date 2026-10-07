import { describe, it, expect } from 'vitest';
import { DofID } from 'ts-fem';
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
