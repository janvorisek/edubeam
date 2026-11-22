import { describe, it, expect } from 'vitest';
import { LinearStaticSolver, DofID, type Beam2D } from '@edubeam/fem';
import { applyNodeLcsAngle } from '@/utils/nodalLcs';
import { nodeEquilibrium, shownNodeEquilibrium } from '@/utils/nodeEquilibrium';

const model = () => {
  const solver = new LinearStaticSolver();
  const d = solver.domain;
  d.createMaterial('m', { e: 210e9, g: 81e9, alpha: 1.2e-5, d: 7850 });
  d.createCrossSection('cs', { a: 1e-2, iy: 1e-5, h: 0.2, k: 1e32 });
  return { solver, d, lc: solver.loadCases[0] };
};

/** Every node of the solved model balances: the sums are round-off against the forces at it. */
const expectAllBalanced = (solver: LinearStaticSolver) => {
  for (const label of solver.domain.nodes.keys()) {
    const eq = nodeEquilibrium(solver, label);
    expect(eq, `node ${label}`).not.toBeNull();
    expect(Math.abs(eq.sum.x), `ΣFx at ${label}`).toBeLessThan(1e-6);
    expect(Math.abs(eq.sum.z), `ΣFz at ${label}`).toBeLessThan(1e-6);
    expect(Math.abs(eq.sum.m), `ΣM at ${label}`).toBeLessThan(1e-6);
  }
};

describe("a node's equilibrium", () => {
  // A 2 m cantilever fixed at A with 10 kN down at its tip B
  const cantilever = () => {
    const { solver, d, lc } = model();
    d.createNode('A', [0, 0, 0], [DofID.Dx, DofID.Dz, DofID.Ry]);
    d.createNode('B', [2, 0, 0]);
    d.createBeam2D('1', ['A', 'B'], 'm', 'cs');
    lc.createNodalLoad('B', { [DofID.Dz]: 10e3 });
    solver.solve();
    return solver;
  };

  it('at a free tip: the member holds the load up', () => {
    const tip = shownNodeEquilibrium(cantilever(), 'B');
    const [member] = tip.members;

    expect(tip.load.components).toEqual([{ direction: [0, 1], value: 10e3 }]);
    expect(member.force[0]).toBeCloseTo(0, 6);
    expect(member.force[1]).toBeCloseTo(-10e3, 6);
    expect(member.n).toBe(0);
    expect(member.m).toBe(0);
    // The diagram's V, the same 10 kN all along; on the end's face positive V points up, against the fibres
    expect(member.atStart).toBe(false);
    expect(member.v).toBeCloseTo(10e3, 6);
    expect(member.shearDirection).toEqual([0, -1]);
    expect(tip.reaction).toBeNull();
    expect(tip.sum).toEqual({ x: 0, z: 0, m: 0 });
  });

  it('at a fixed end: the member pulls down and turns, the support answers', () => {
    const fixed = shownNodeEquilibrium(cantilever(), 'A');
    const [member] = fixed.members;

    expect(member.along).toEqual([1, 0]);
    expect(member.force[1]).toBeCloseTo(10e3, 6);
    expect(Math.abs(member.m)).toBeCloseTo(20e3, 6);
    // Up, and counter-clockwise against the load's clockwise 20 kNm (positive, as the solver's Ry)
    expect(fixed.reaction.force[1]).toBeCloseTo(-10e3, 6);
    expect(fixed.reaction.m).toBeCloseTo(20e3, 6);
    // Hogging, as the diagram has it, and on the start's face positive V points down to the fibres
    expect(member.m).toBeCloseTo(-20e3, 6);
    expect(member.momentTurn).toBe(1);
    expect(member.v).toBeCloseTo(10e3, 6);
    expect(member.shearDirection).toEqual([0, 1]);
  });

  it("gives each end the diagrams' values, which are what the node feels through the cut", () => {
    const solver = cantilever();
    const beam = solver.domain.getElement('1') as Beam2D;
    const lc = solver.loadCases[0];
    const [atA] = nodeEquilibrium(solver, 'A').members;
    const [atB] = nodeEquilibrium(solver, 'B').members;

    expect(atA.m).toBeCloseTo(beam.computeBendingMomentAt(lc, 0), 6);
    expect(atB.m).toBeCloseTo(beam.computeBendingMomentAt(lc, 2), 6);
    expect(atB.v).toBeCloseTo(beam.computeShearForceAt(lc, 2), 6);
  });

  it('counts tension as the member pulling on the node, at either end', () => {
    const { solver, d, lc } = model();
    d.createNode('A', [0, 0, 0], [DofID.Dx, DofID.Dz]);
    d.createNode('B', [3, 0, 0], [DofID.Dz]);
    d.createBeam2D('1', ['A', 'B'], 'm', 'cs');
    lc.createNodalLoad('B', { [DofID.Dx]: 5e3 });
    solver.solve();

    expect(shownNodeEquilibrium(solver, 'A').members[0].n).toBeCloseTo(5e3, 6);
    expect(shownNodeEquilibrium(solver, 'B').members[0].n).toBeCloseTo(5e3, 6);
    expect(shownNodeEquilibrium(solver, 'B').members[0].along).toEqual([-1, 0]);
  });

  it('balances at every node of a frame with inclined members, member loads, a hinge and temperature', () => {
    const { solver, d, lc } = model();
    d.createNode('1', [0, 0, 0], [DofID.Dx, DofID.Dz, DofID.Ry]);
    d.createNode('2', [0, 0, -4]);
    d.createNode('3', [3, 0, -5]);
    d.createNode('4', [6, 0, -4]);
    d.createNode('5', [6, 0, 0], [DofID.Dx, DofID.Dz]);
    d.createBeam2D('a', ['1', '2'], 'm', 'cs');
    d.createBeam2D('b', ['2', '3'], 'm', 'cs');
    d.createBeam2D('c', ['3', '4'], 'm', 'cs', [true, false]);
    d.createBeam2D('d', ['4', '5'], 'm', 'cs');
    lc.createNodalLoad('2', { [DofID.Dx]: 8e3, [DofID.Ry]: 3e3 });
    lc.createBeamElementUniformEdgeLoad('b', [0, 4e3], false);
    lc.createBeamConcentratedLoad('c', [0, 6e3, 0, 1], true);
    lc.createBeamTemperatureLoad('d', [10, 15, -5]);
    solver.solve();

    expectAllBalanced(solver);
    // The hinged end of c carries no moment into node 3
    const top = nodeEquilibrium(solver, '3');
    const hinged = top.members.find((m) => m.label === 'c');
    expect(hinged.hinged).toBe(true);
    expect(Math.abs(hinged.m)).toBeLessThan(1e-6);
  });

  it('balances at a turned roller, with a load given in its own axes', () => {
    const { solver, d, lc } = model();
    d.createNode('A', [0, 0, 0], [DofID.Dx, DofID.Dz]);
    const b = d.createNode('B', [4, 0, -2], [DofID.Dz]);
    applyNodeLcsAngle(b, 30);
    d.createNode('C', [2, 0, -3]);
    d.createBeam2D('1', ['A', 'C'], 'm', 'cs');
    d.createBeam2D('2', ['C', 'B'], 'm', 'cs');
    lc.createNodalLoad('B', { [DofID.Dx]: 4e3, [DofID.Dz]: 2e3 }, true);
    lc.createNodalLoad('C', { [DofID.Dz]: 10e3 });
    solver.solve();

    expectAllBalanced(solver);
    // The roller pushes along its own z only
    const roller = nodeEquilibrium(solver, 'B').reaction;
    expect(roller.components).toHaveLength(1);
    const [rx, rz] = roller.components[0].direction;
    expect(rx).toBeCloseTo(-Math.sin(Math.PI / 6), 9);
    expect(rz).toBeCloseTo(Math.cos(Math.PI / 6), 9);
  });

  it('balances under a prescribed settlement', () => {
    const { solver, d, lc } = model();
    d.createNode('A', [0, 0, 0], [DofID.Dx, DofID.Dz]);
    d.createNode('B', [4, 0, 0], [DofID.Dz]);
    d.createNode('C', [8, 0, 0], [DofID.Dz]);
    d.createBeam2D('1', ['A', 'B'], 'm', 'cs');
    d.createBeam2D('2', ['B', 'C'], 'm', 'cs');
    lc.createPrescribedDisplacement('B', { [DofID.Dz]: 0.01 });
    solver.solve();

    expectAllBalanced(solver);
  });

  it('has nothing to show before a solve, or for a node no member reaches', () => {
    const { solver, d } = model();
    d.createNode('A', [0, 0, 0], [DofID.Dx, DofID.Dz, DofID.Ry]);
    d.createNode('B', [2, 0, 0]);
    d.createNode('lonely', [5, 0, 5]);
    d.createBeam2D('1', ['A', 'B'], 'm', 'cs');
    expect(nodeEquilibrium(solver, 'A')).toBeNull();

    solver.solve();
    expect(nodeEquilibrium(solver, 'lonely')).toBeNull();
    expect(nodeEquilibrium(solver, 'missing')).toBeNull();
  });
});
