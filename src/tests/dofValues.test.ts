import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import { createPinia, setActivePinia } from 'pinia';
import { DofID, LinearStaticSolver } from 'ts-fem';
import { inPlaneValues } from '@/utils/dofValues';
import NodalLoad from '@/components/svg/NodalLoad.vue';
import PrescribedDisplacement from '@/components/svg/PrescribedDisplacement.vue';

/**
 * Share links from before the dialogs stored all three components carry loads like the ones in
 * the frozen link of serializeModel.test.ts: a force `{ 0: 5000, 2: -10000 }` with no moment and a
 * settlement `{ 2: 0.001 }` with no Dx. The solver reads a missing component as zero, but the
 * canvas drew the force with a moment labelled NaN and the settlement as "(NaN; 1)".
 */
describe('inPlaneValues', () => {
  it('reads a missing Dx, Dz or Ry as zero', () => {
    expect(inPlaneValues({ [DofID.Dz]: 0.001 })).toEqual({ 0: 0, 2: 0.001, 4: 0 });
  });

  it('reads keyed values and the older six-entry arrays alike', () => {
    expect(inPlaneValues({ [DofID.Dx]: 1, [DofID.Dz]: 2, [DofID.Ry]: 3 })).toEqual({ 0: 1, 2: 2, 4: 3 });
    expect(inPlaneValues([0, 0, -1000, 0, 0, 0])).toEqual({ 0: 0, 2: -1000, 4: 0 });
  });
});

describe('loads from old links on the canvas', () => {
  const build = () => {
    setActivePinia(createPinia());
    const ls = new LinearStaticSolver();
    ls.domain.createNode('1', [0, 0, 0], [DofID.Dx, DofID.Dz, DofID.Ry]);
    return ls;
  };

  it('draws a force without a moment component as a force only', () => {
    const ls = build();
    const nload = ls.loadCases[0].createNodalLoad('1', { [DofID.Dx]: 5000, [DofID.Dz]: -10000 });

    const html = mount(NodalLoad, { props: { nload, scale: 1 } }).html();

    expect(html).not.toContain('NaN');
    expect(html).not.toMatch(/class="[^"]*\b(cw|ccw)\b/);
  });

  it('labels a settlement without a Dx component by its Dz alone', () => {
    const ls = build();
    const nload = ls.loadCases[0].createPrescribedDisplacement('1', { [DofID.Dz]: 0.001 });

    const html = mount(PrescribedDisplacement, {
      props: { nload, scale: 1, multiplier: 1, convertDisplacement: (d: number) => d },
    }).html();

    expect(html).not.toContain('NaN');
    expect(html).not.toContain(';');
  });
});
