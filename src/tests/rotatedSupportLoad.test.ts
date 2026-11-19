import { describe, it, expect } from 'vitest';
import { LinearStaticSolver, DofID, type LoadCase, type Node } from '@edubeam/fem';
import { applyNodeLcsAngle } from '@/utils/nodalLcs';

/**
 * A beam 4 m long, pinned at A, on a roller at B turned 45° (it can push only along its own z), with
 * a horizontal 10 kN force at B. Moments about A: the roller's vertical part times 4 m is zero, so the
 * roller carries nothing and the pin takes the whole 10 kN. The solver used to apply the force in the
 * roller's turned axes, where most of it went straight into the support.
 */
const solveBeam = () => {
  const solver = new LinearStaticSolver();
  const domain = solver.domain;
  domain.createMaterial('m', { e: 210e9, g: 81e9, alpha: 1.2e-5, d: 7850 });
  domain.createCrossSection('cs', { a: 1e-2, iy: 1e-5, h: 0.2, k: 1e32 });
  domain.createNode('A', [0, 0, 0], [DofID.Dx, DofID.Dz]);
  const b = domain.createNode('B', [4, 0, 0], [DofID.Dz]);
  applyNodeLcsAngle(b, 45);
  domain.createBeam2D('1', ['A', 'B'], 'm', 'cs');
  solver.loadCases[0].createNodalLoad('B', { [DofID.Dx]: 10e3, [DofID.Dz]: 0, [DofID.Ry]: 0 });
  solver.solve();
  return { solver, a: domain.getNode('A'), b };
};

/** A support reaction, in the global axes or in the node's own (as the results table shows a turned one). */
const reaction = (node: Node, lc: LoadCase, dof: DofID, global: boolean) => {
  const r = node.getReactions(lc, global);
  const i = r.dofs.findIndex((d) => d === dof);
  if (i === -1) return 0;
  const values = r.values as unknown as { get?: (index: number[]) => number } & number[];
  return values.get ? values.get([i]) : values[i];
};

describe('a load on a turned support', () => {
  it('acts in the global axes: the roller carries nothing and the pin all of it', () => {
    const { solver, a, b } = solveBeam();
    const lc = solver.loadCases[0];

    expect(reaction(a, lc, DofID.Dx, true)).toBeCloseTo(-10e3, 3);
    expect(reaction(a, lc, DofID.Dz, true)).toBeCloseTo(0, 3);
    // The roller's one reaction, along its own z
    expect(reaction(b, lc, DofID.Dz, false)).toBeCloseTo(0, 3);

    // All of it runs through the beam as tension: N = 10 kN along its length
    const beam = solver.domain.getElement('1');
    expect(beam.computeNormalForceAt(lc, 0.5)).toBeCloseTo(10e3, 3);
  });
});
