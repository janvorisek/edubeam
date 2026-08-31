import { describe, it, expect } from 'vitest';
import { LinearStaticSolver, DofID } from 'ts-fem';
import { findMechanismIssues, validateSolverModel } from '@/utils/validateSolverModel';

const codes = (issues: { code: string }[]) => issues.map((issue) => issue.code);

/** Two-node beam, `bcs` applied to the first node only. */
const buildBeam = (bcs: DofID[]) => {
  const ls = new LinearStaticSolver();
  const d = ls.domain;
  d.createMaterial('m', { d: 7850, e: 210e9, g: 80e9, alpha: 12e-6 });
  d.createCrossSection('cs', { a: 0.01, iy: 8e-5, h: 0.2, k: 1e32 });
  d.createNode('1', [0, 0, 0], bcs);
  d.createNode('2', [3, 0, 0], []);
  d.createBeam2D('B1', ['1', '2'], 'm', 'cs');
  return ls;
};

describe('validateSolverModel stability checks', () => {
  it('accepts a properly restrained cantilever', () => {
    const diagnostics = validateSolverModel(buildBeam([DofID.Dx, DofID.Dz, DofID.Ry]));

    expect(diagnostics.errors).toEqual([]);
    expect(diagnostics.warnings).toEqual([]);
  });

  it('reports a globally under-restrained model', () => {
    const diagnostics = validateSolverModel(buildBeam([DofID.Dz]));

    expect(codes(diagnostics.errors)).toContain('INSUFFICIENT_SUPPORTS');
  });

  it('reports a disconnected part that carries no supports of its own', () => {
    const ls = buildBeam([DofID.Dx, DofID.Dz, DofID.Ry]);
    const d = ls.domain;
    // A second, entirely separate beam floating next to the cantilever.
    d.createNode('3', [0, 0, -5], []);
    d.createNode('4', [3, 0, -5], []);
    d.createBeam2D('B2', ['3', '4'], 'm', 'cs');

    const diagnostics = validateSolverModel(ls);
    const issue = diagnostics.errors.find((e) => e.code === 'UNSUPPORTED_STRUCTURE_PART');

    expect(issue).toBeDefined();
    expect(issue?.message).toContain('3, 4');
  });

  it('warns about a support that no element connects to', () => {
    const ls = buildBeam([DofID.Dx, DofID.Dz, DofID.Ry]);
    ls.domain.createNode('lonely', [9, 0, 0], [DofID.Dx, DofID.Dz]);

    const diagnostics = validateSolverModel(ls);

    expect(codes(diagnostics.warnings)).toContain('SUPPORTED_NODE_NOT_CONNECTED');
  });

  it('warns about an unused node without calling it a support', () => {
    const ls = buildBeam([DofID.Dx, DofID.Dz, DofID.Ry]);
    ls.domain.createNode('spare', [9, 0, 0], []);

    const diagnostics = validateSolverModel(ls);

    expect(codes(diagnostics.warnings)).toContain('NODE_NOT_CONNECTED');
  });
});

describe('rigid body stability', () => {
  /** The default portal frame: column, beam, column. */
  const buildFrame = (bcs: Record<string, DofID[]>) => {
    const ls = new LinearStaticSolver();
    const d = ls.domain;
    d.createCrossSection(1, { a: 1, iy: 8.356e-5, iz: 1.0, dyz: 999991.0, h: 1, k: 1e32, j: 99999.0 });
    d.createMaterial(1, { e: 210000e6, g: 210000e6 / (2 * 1.2), alpha: 12e-6, d: 4000 });
    d.createNode('1', [0, 0, 0], bcs['1'] ?? []);
    d.createNode('2', [0, 0, -3], bcs['2'] ?? []);
    d.createNode('3', [3, 0, -3], bcs['3'] ?? []);
    d.createNode('4', [3, 0, 0], bcs['4'] ?? []);
    d.createBeam2D('1', ['1', '2'], 1, 1);
    d.createBeam2D('2', ['2', '3'], 1, 1);
    d.createBeam2D('3', ['4', '3'], 1, 1);
    ls.loadCases[0].createBeamElementTrapezoidalEdgeLoad('2', [0, 10000], [0, 30000], true);
    return ls;
  };

  it('accepts a properly supported frame', () => {
    const diagnostics = validateSolverModel(
      buildFrame({ '1': [DofID.Dx, DofID.Dz, DofID.Ry], '4': [DofID.Dx, DofID.Dz] })
    );

    expect(diagnostics.errors).toEqual([]);
  });

  it('catches three parallel restraints that let the frame slide', () => {
    // Three vertical rollers: three restraints, still a mechanism. The load is vertical
    // so the solver returns small, believable displacements — only geometry reveals this.
    const ls = buildFrame({ '1': [DofID.Dz], '2': [DofID.Dz], '4': [DofID.Dz] });
    ls.solve();

    expect(Math.max(...(ls.loadCases[0].r.toArray() as number[]).map(Math.abs))).toBeLessThan(1);
    expect(findMechanismIssues(ls)).toEqual([]);

    const issue = validateSolverModel(ls).errors.find((e) => e.code === 'RIGID_BODY_MECHANISM');

    expect(issue).toBeDefined();
    expect(issue?.message).toContain('slide horizontally');
  });

  it('catches restraints whose lines of action meet in one point', () => {
    // Pin at node 1 plus a horizontal roller at node 4, which sits at the same level:
    // all three reaction lines pass through node 1, so the frame pivots about it.
    const ls = buildFrame({ '1': [DofID.Dx, DofID.Dz], '4': [DofID.Dx] });
    const issue = validateSolverModel(ls).errors.find((e) => e.code === 'RIGID_BODY_MECHANISM');

    expect(issue).toBeDefined();
    expect(issue?.message).toContain('rotate freely');
  });

  it('accepts a fixed support on its own', () => {
    const diagnostics = validateSolverModel(buildFrame({ '1': [DofID.Dx, DofID.Dz, DofID.Ry] }));

    expect(diagnostics.errors).toEqual([]);
  });

  it('counts a skewed support along its own axis', () => {
    // Two rollers on a 45° incline plus a vertical one still cannot slide.
    const ls = buildFrame({ '1': [DofID.Dz], '4': [DofID.Dz] });
    const skewed = ls.domain.nodes.get('2')!;
    skewed.bcs.add(DofID.Dz);
    skewed.updateLcs({ locx: [Math.SQRT1_2, 0, Math.SQRT1_2], locy: [0, 1, 0] });

    expect(validateSolverModel(ls).errors).toEqual([]);
  });
});

describe('findMechanismIssues', () => {
  it('stays quiet for a stable structure', () => {
    const ls = buildBeam([DofID.Dx, DofID.Dz, DofID.Ry]);
    ls.loadCases[0].createNodalLoad('2', [0, 0, -1000, 0, 0, 0]);
    ls.solve();

    expect(findMechanismIssues(ls)).toEqual([]);
  });

  it('names the node and direction that runs away', () => {
    // A cross section this soft is not a structure any more: the tip displacement blows
    // past any believable value while the solve itself still succeeds.
    const ls = new LinearStaticSolver();
    const d = ls.domain;
    d.createMaterial('m', { d: 7850, e: 210e9, g: 80e9, alpha: 12e-6 });
    d.createCrossSection('cs', { a: 1e-10, iy: 1e-16, h: 0.2, k: 1e32 });
    d.createNode('1', [0, 0, 0], [DofID.Dx, DofID.Dz, DofID.Ry]);
    d.createNode('2', [3, 0, 0], []);
    d.createBeam2D('B1', ['1', '2'], 'm', 'cs');
    ls.loadCases[0].createNodalLoad('2', [0, 0, -1000, 0, 0, 0]);
    ls.solve();

    const issues = findMechanismIssues(ls);

    expect(codes(issues)).toEqual(['UNSTABLE_STRUCTURE']);
    expect(issues[0].message).toContain('node 2 vertically (Dz)');
    // Restrained DOFs hold prescribed values and must never be reported as runaway.
    expect(issues[0].message).not.toContain('node 1');
  });

  it('leaves a singular system to the solver, which rejects it outright', () => {
    // Three restraints, but all of them vertical: the beam slides horizontally.
    const ls = new LinearStaticSolver();
    const d = ls.domain;
    d.createMaterial('m', { d: 7850, e: 210e9, g: 80e9, alpha: 12e-6 });
    d.createCrossSection('cs', { a: 0.01, iy: 8e-5, h: 0.2, k: 1e32 });
    d.createNode('1', [0, 0, 0], [DofID.Dz, DofID.Ry]);
    d.createNode('2', [3, 0, 0], [DofID.Dz]);
    d.createBeam2D('B1', ['1', '2'], 'm', 'cs');
    ls.loadCases[0].createNodalLoad('2', [1000, 0, 0, 0, 0, 0]);

    // The store turns this exact message into a SINGULAR_STIFFNESS_MATRIX diagnostic.
    expect(() => ls.solve()).toThrowError(/singular/i);
  });
});
