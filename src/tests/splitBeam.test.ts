import { describe, it, expect } from 'vitest';
import {
  BeamConcentratedLoad,
  BeamElementTrapezoidalEdgeLoad,
  BeamElementUniformEdgeLoad,
  BeamTemperatureLoad,
  DofID,
  LinearStaticSolver,
  type Beam2D,
  type Node,
} from '@edubeam/fem';
import { splitBeamAtNode, splitRatioAlongBeam } from '@/utils/splitBeam';

const E = 210e9;
const IY = 1e-5;
const H = 0.2;
const ALPHA = 1.2e-5;

/** A 6 m beam from A to B, split later at C, 2 m from A. */
const beam = (supportA: DofID[]) => {
  const solver = new LinearStaticSolver();
  const domain = solver.domain;
  domain.createMaterial('m', { e: E, g: 81e9, alpha: ALPHA, d: 7850 });
  domain.createCrossSection('cs', { a: 1e-2, iy: IY, h: H, k: 1e32 });
  domain.createNode('A', [0, 0, 0], supportA);
  domain.createNode('B', [6, 0, 0], [DofID.Dz]);
  domain.createBeam2D('1', ['A', 'B'], 'm', 'cs');
  return solver;
};

const split = (solver: LinearStaticSolver) => {
  solver.domain.createNode('C', [2, 0, 0], []);
  splitBeamAtNode(solver, solver.domain.getElement('1') as Beam2D, 'C');
};

const reaction = (solver: LinearStaticSolver, label: string, dof: DofID) => {
  const r = (solver.domain.getNode(label) as Node).getReactions(solver.loadCases[0], true);
  const i = r.dofs.findIndex((d) => d === dof);
  const values = r.values as unknown as { get?: (index: number[]) => number } & number[];
  return values.get ? values.get([i]) : values[i];
};

const reactions = (solver: LinearStaticSolver) => {
  // The DOF numbering is cached, and the split adds a node; the app's solve resets it the same way.
  solver.codeNumberGenerated = false;
  solver.solve();
  return [reaction(solver, 'A', DofID.Dz), reaction(solver, 'B', DofID.Dz)];
};

describe('splitting a beam', () => {
  it('finds the split point by projecting the node onto the beam', () => {
    expect(splitRatioAlongBeam([0, 0, 0], [6, 0, 0], [2, 0, 0])).toBeCloseTo(1 / 3, 12);
    expect(splitRatioAlongBeam([0, 0, 0], [6, 0, 0], [2, 0, 0.05])).toBeCloseTo(1 / 3, 12);
    expect(splitRatioAlongBeam([0, 0, 0], [6, 0, 0], [-1, 0, 0])).toBe(0);
  });

  /**
   * Simply supported, L = 6 m. Hand calculation of the reactions (positive z is down, so a downward
   * load is pushed back by a negative reaction):
   *   12 kN at 4.5 m:          R_A = 12 · 1.5 / 6 = 3 kN,  R_B = 9 kN
   *   2 kN/m uniform:          R_A = R_B = 6 kN
   *   0 → 6 kN/m trapezoidal:  18 kN at 4 m, R_A = 18 · 2 / 6 = 6 kN,  R_B = 12 kN
   * In all: R_A = 15 kN, R_B = 27 kN, before and after the split.
   */
  it('keeps every load, so the reactions match the hand calculation before and after', () => {
    const solver = beam([DofID.Dx, DofID.Dz]);
    const lc = solver.loadCases[0];
    lc.createBeamConcentratedLoad('1', [0, 12e3, 0, 4.5], true);
    lc.createBeamConcentratedLoad('1', [0, 0, 0, 1], true);
    lc.createBeamElementUniformEdgeLoad('1', [0, 2e3], true);
    lc.createBeamElementTrapezoidalEdgeLoad('1', [0, 0], [0, 6e3], true);

    const [beforeA, beforeB] = reactions(solver);
    expect(beforeA).toBeCloseTo(-15e3, 3);
    expect(beforeB).toBeCloseTo(-27e3, 3);

    split(solver);

    expect(solver.domain.elements.has('1')).toBe(false);
    const [afterA, afterB] = reactions(solver);
    expect(afterA).toBeCloseTo(-15e3, 3);
    expect(afterB).toBeCloseTo(-27e3, 3);

    const loads = lc.elementLoadList;
    const point = loads.filter((l): l is BeamConcentratedLoad => l instanceof BeamConcentratedLoad);
    // The 12 kN at 4.5 m lies on the second part, 2.5 m from its start; the one at 1 m stays put.
    expect(point.map((l) => [l.target, l.values[3]])).toEqual(
      expect.arrayContaining([
        ['1b', 2.5],
        ['1a', 1],
      ])
    );

    const uniform = loads.filter((l) => l instanceof BeamElementUniformEdgeLoad);
    expect(uniform.map((l) => l.target).sort()).toEqual(['1a', '1b']);

    const trapezoidal = loads.filter(
      (l): l is BeamElementTrapezoidalEdgeLoad => l instanceof BeamElementTrapezoidalEdgeLoad
    );
    expect(trapezoidal.map((l) => [l.target, l.startValues[1], l.endValues[1]])).toEqual([
      ['1a', 0, 2e3],
      ['1b', 2e3, 6e3],
    ]);
  });

  /**
   * A propped cantilever (fixed at A, roller at B) warmed 20 °C more at the bottom than at the top.
   * Free, it would bend to the curvature κ = α ΔT / h = 1.2e-5 · 20 / 0.2 = 1.2e-3 1/m and lift its
   * tip by κL²/2. The roller pushes that back: R_B · L³ / (3EI) = κL² / 2, so
   * R_B = 3 E I κ / (2L) = 3 · 210e9 · 1e-5 · 1.2e-3 / 12 = 630 N.
   */
  it('keeps a temperature load on both parts', () => {
    const solver = beam([DofID.Dx, DofID.Dz, DofID.Ry]);
    solver.loadCases[0].createBeamTemperatureLoad('1', [0, 20, 0]);

    const [, before] = reactions(solver);
    expect(Math.abs(before)).toBeCloseTo(630, 6);

    split(solver);

    const temperature = solver.loadCases[0].elementLoadList.filter((l) => l instanceof BeamTemperatureLoad);
    expect(temperature.map((l) => l.target).sort()).toEqual(['1a', '1b']);

    const [, after] = reactions(solver);
    expect(after).toBeCloseTo(before, 6);
  });

  it('gives each part the end hinge it inherits', () => {
    const solver = beam([DofID.Dx, DofID.Dz]);
    (solver.domain.getElement('1') as Beam2D).hinges = [true, true];

    split(solver);

    expect((solver.domain.getElement('1a') as Beam2D).hinges).toEqual([true, false]);
    expect((solver.domain.getElement('1b') as Beam2D).hinges).toEqual([false, true]);
  });
});
