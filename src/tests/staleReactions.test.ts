import { describe, it, expect, beforeEach } from 'vitest';
import { createPinia, setActivePinia } from 'pinia';
import { mount } from '@vue/test-utils';
import { createVuetify } from 'vuetify';
import { LinearStaticSolver, DofID } from '@edubeam/fem';
import SVGNode from '@/components/svg/Node.vue';

/**
 * EDUBEAM-APP-FS: a node with a support but no element, connected after the last solve, is drawn
 * with that solve's results before the next one runs. Its supports have no equations in them yet,
 * and reading their reactions threw inside the solver.
 */
describe('reactions of a support the last solve did not number', () => {
  beforeEach(() => setActivePinia(createPinia()));

  it('draw nothing instead of throwing, until the next solve', () => {
    const solver = new LinearStaticSolver();
    const d = solver.domain;
    d.createMaterial('m', { e: 210e9, g: 81e9, alpha: 1.2e-5, d: 7850 });
    d.createCrossSection('cs', { a: 2.85e-3, iy: 1.943e-5, h: 0.2, k: 1e32 });
    d.createNode('A', [0, 0, 0], [DofID.Dx, DofID.Dz, DofID.Ry]);
    d.createNode('B', [3, 0, 0]);
    d.createNode('C', [6, 0, 0], [DofID.Dz]);
    d.createBeam2D('AB', ['A', 'B'], 'm', 'cs');
    solver.loadCases[0].createNodalLoad('B', { [DofID.Dz]: 10e3 });
    solver.solve();

    // Connected after the solve, which is still marked done
    d.createBeam2D('BC', ['B', 'C'], 'm', 'cs');

    const draw = () =>
      mount(SVGNode, {
        props: {
          node: d.getNode('C'),
          scale: 50,
          showLabel: true,
          showSupports: true,
          showDeformedShape: false,
          showReactions: true,
          loadCase: solver.loadCases[0],
          multiplier: 1,
          convertForce: (f: number) => f / 1e3,
          convertMoment: (m: number) => m / 1e3,
        },
        global: { plugins: [createVuetify()] },
      });

    expect(draw).not.toThrow();
    expect(draw().findAll('text.reaction')).toHaveLength(0);

    // And once solved again, it has its reaction
    solver.codeNumberGenerated = false;
    solver.solve();
    expect(draw().findAll('text.reaction').length).toBeGreaterThan(0);
  });
});
