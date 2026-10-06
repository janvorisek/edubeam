import { describe, it, expect } from 'vitest';
import { LinearStaticSolver, DofID } from 'ts-fem';
import { MouseMode } from '@/mouse';
import { clearForFirstBeam, currentFirstBeamStep, firstBeamState, type FirstBeamStepId } from '@/utils/firstBeam';
import { validateSolverModel } from '@/utils/validateSolverModel';
import { buildExampleSolver, examples } from '@/utils/examples';

/** Solves the way the project store does, and asks which step the task is on. */
const stepOf = (
  solver: LinearStaticSolver,
  mouseMode = MouseMode.NONE,
  seen: FirstBeamStepId[] = [],
  settingsOpen = false
) => {
  solver.codeNumberGenerated = false;
  // Like the store: an unfinished model is not solved either.
  const diagnostics = validateSolverModel(solver);
  const errors = diagnostics.errors.length + diagnostics.incomplete.length;
  if (errors === 0 && solver.domain.elements.size > 0) solver.solve();
  else solver.loadCases[0].solved = false;

  return currentFirstBeamStep(firstBeamState(solver, mouseMode, errors, settingsOpen, new Set(seen))).id;
};

const emptySolver = () => {
  const solver = buildExampleSolver(examples[0]);
  clearForFirstBeam(solver);
  return solver;
};

const drawBeam = (solver: LinearStaticSolver) => {
  solver.domain.createNode('1', [0, 0, 0], []);
  solver.domain.createNode('2', [4, 0, 0], []);
  const mat = [...solver.domain.materials.keys()][0];
  const cs = [...solver.domain.crossSections.keys()][0];
  solver.domain.createBeam2D('1', ['1', '2'], mat, cs);
};

describe('the first beam task', () => {
  it('starts from an empty model that can still take a beam', () => {
    const solver = emptySolver();

    expect(solver.domain.nodes.size).toBe(0);
    expect(solver.loadCases[0].elementLoadList).toEqual([]);
    expect(solver.domain.materials.size).toBeGreaterThan(0);
    expect(solver.domain.crossSections.size).toBeGreaterThan(0);
    expect(stepOf(solver)).toBe('tool');
  });

  it('brings back a material and a cross section when the model has none', () => {
    const solver = new LinearStaticSolver();
    clearForFirstBeam(solver);

    expect(solver.domain.materials.size).toBe(1);
    expect(solver.domain.crossSections.size).toBe(1);
  });

  it('moves on once the drawing tool is picked', () => {
    expect(stepOf(emptySolver(), MouseMode.ADD_ELEMENT)).toBe('draw');
  });

  it('asks for supports until the beam can stand', () => {
    const solver = emptySolver();
    drawBeam(solver);
    expect(stepOf(solver, MouseMode.ADD_ELEMENT)).toBe('supports');

    solver.domain.nodes.get('1')!.bcs = new Set([DofID.Dx, DofID.Dz]);
    expect(stepOf(solver)).toBe('supports');

    solver.domain.nodes.get('2')!.bcs = new Set([DofID.Dz]);
    expect(stepOf(solver)).toBe('load');
  });

  it('ends with the display options and fit to screen, then the results', () => {
    const solver = emptySolver();
    drawBeam(solver);
    solver.domain.nodes.get('1')!.bcs = new Set([DofID.Dx, DofID.Dz]);
    solver.domain.nodes.get('2')!.bcs = new Set([DofID.Dz]);
    solver.loadCases[0].createBeamElementUniformEdgeLoad('1', [0, 10000], true);

    expect(stepOf(solver, MouseMode.NONE, [])).toBe('display');
    expect(stepOf(solver, MouseMode.NONE, [], true)).toBe('fit');
    // Closing the panel again does not send anyone back to open it.
    expect(stepOf(solver, MouseMode.NONE, ['display'], false)).toBe('fit');
    expect(stepOf(solver, MouseMode.NONE, ['display', 'fit'])).toBe('results');

    solver.domain.nodes.get('2')!.bcs = new Set();
    expect(stepOf(solver, MouseMode.NONE, ['display', 'fit'])).toBe('supports');
  });
});
