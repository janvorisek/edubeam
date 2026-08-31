/**
 * The teaching models edubeam ships with.
 *
 * One definition per example, shared by the in-app Examples panel and the gallery on the
 * documentation site, so the two can never drift apart. Titles and blurbs stay English
 * here, matching how the material and cross section libraries name their presets.
 */
import { DofID, LinearStaticSolver } from 'ts-fem';

/** Overlays that make each example's point on first sight. */
export interface ExampleViewerFlags {
  showLoads: boolean;
  showReactions: boolean;
  showDeformedShape: boolean;
  showNormalForce: boolean;
  showShearForce: boolean;
  showMoments: boolean;
}

export interface ExampleDefinition {
  id: string;
  title: string;
  blurb: string;
  viewer: ExampleViewerFlags;
  /** Populates an empty solver that already carries the shared material and section. */
  build: (solver: LinearStaticSolver) => void;
}

/** Cross section stiff in shear, so the examples show pure bending behaviour. */
const EXAMPLE_CROSS_SECTION = {
  a: 1,
  iy: 8.356e-5,
  iz: 1.0,
  dyz: 999991.0,
  h: 1,
  k: 1e32,
  j: 99999.0,
};

const EXAMPLE_MATERIAL = {
  e: 210000e6,
  g: 210000e6 / (2 * (1 + 0.2)),
  alpha: 12.0e-6,
  d: 4000,
};

export const EXAMPLE_MATERIAL_LABEL = 1;
export const EXAMPLE_CROSS_SECTION_LABEL = 1;

const DEFAULT_OVERLAYS: ExampleViewerFlags = {
  showLoads: true,
  showReactions: true,
  showDeformedShape: true,
  showNormalForce: false,
  showShearForce: false,
  showMoments: true,
};

export const examples: ExampleDefinition[] = [
  {
    id: 'welcome',
    title: 'Indeterminate beam',
    blurb: 'Statically indeterminate 3 m fixed–roller beam under 10 kN/m UDL.',
    viewer: { ...DEFAULT_OVERLAYS, showShearForce: true },
    build: (solver) => {
      const domain = solver.domain;
      domain.createNode('A', [0, 0, 0], [DofID.Dx, DofID.Dz, DofID.Ry]);
      domain.createNode('B', [3, 0, 0], [DofID.Dz]);
      domain.createBeam2D('E1', ['A', 'B'], EXAMPLE_MATERIAL_LABEL, EXAMPLE_CROSS_SECTION_LABEL);
      solver.loadCases[0].createBeamElementUniformEdgeLoad('E1', [0, 10000], true);
    },
  },
  {
    id: 'cantilever',
    title: 'Cantilever',
    blurb: '4 m cantilever resisting an 18 kN downward nodal load, highlighting curvature and tip deflection.',
    viewer: { ...DEFAULT_OVERLAYS },
    build: (solver) => {
      const domain = solver.domain;
      domain.createNode('A', [0, 0, 0], [DofID.Dx, DofID.Dz, DofID.Ry]);
      domain.createNode('B', [4, 0, 0], []);
      domain.createBeam2D('E1', ['A', 'B'], EXAMPLE_MATERIAL_LABEL, EXAMPLE_CROSS_SECTION_LABEL);
      solver.loadCases[0].createNodalLoad('B', { [DofID.Dx]: 0, [DofID.Dz]: -18000, [DofID.Ry]: 0 });
    },
  },
  {
    id: 'pratt',
    title: 'Pratt truss',
    blurb: 'Simple Pratt truss with 8 kN joint loads showing axial force distribution and displacements.',
    // Axial force labels crowd the small preview cards, so the truss leads with its deflected shape.
    viewer: { ...DEFAULT_OVERLAYS, showMoments: false },
    build: (solver) => {
      const domain = solver.domain;
      const nodes: [string, number[], DofID[]][] = [
        ['A', [0, 0, 0], [DofID.Dx, DofID.Dz]],
        ['B', [3, 0, 0], []],
        ['C', [6, 0, 0], []],
        ['D', [9, 0, 0], [DofID.Dz]],
        ['E', [1.5, 0, -1.8], []],
        ['F', [4.5, 0, -1.8], []],
        ['G', [7.5, 0, -1.8], []],
      ];

      nodes.forEach(([label, coords, dofs]) => domain.createNode(label, coords, dofs));

      const elements: [string, string, string][] = [
        ['E1', 'A', 'B'],
        ['E2', 'B', 'C'],
        ['E3', 'C', 'D'],
        ['E4', 'E', 'F'],
        ['E5', 'F', 'G'],
        ['E6', 'A', 'E'],
        ['E7', 'E', 'B'],
        ['E8', 'B', 'F'],
        ['E9', 'F', 'C'],
        ['E10', 'C', 'G'],
        ['E11', 'G', 'D'],
      ];

      elements.forEach(([label, start, end]) =>
        domain.createBeam2D(label, [start, end], EXAMPLE_MATERIAL_LABEL, EXAMPLE_CROSS_SECTION_LABEL)
      );

      ['E', 'F', 'G'].forEach((label) => {
        solver.loadCases[0].createNodalLoad(label, { [DofID.Dx]: 0, [DofID.Dz]: 8000, [DofID.Ry]: 0 });
      });
    },
  },
  {
    id: 'continuous',
    title: 'Three-span continuous beam',
    blurb: '5+6+5 m spans with UDL + point + UDL to compare curvature and support rotations.',
    viewer: { ...DEFAULT_OVERLAYS, showShearForce: true },
    build: (solver) => {
      const domain = solver.domain;
      domain.createNode('A', [0, 0, 0], [DofID.Dx, DofID.Dz]);
      domain.createNode('B', [5, 0, 0], []);
      domain.createNode('C', [11, 0, 0], []);
      domain.createNode('D', [16, 0, 0], [DofID.Dz]);

      domain.createBeam2D('E1', ['A', 'B'], EXAMPLE_MATERIAL_LABEL, EXAMPLE_CROSS_SECTION_LABEL);
      domain.createBeam2D('E2', ['B', 'C'], EXAMPLE_MATERIAL_LABEL, EXAMPLE_CROSS_SECTION_LABEL);
      domain.createBeam2D('E3', ['C', 'D'], EXAMPLE_MATERIAL_LABEL, EXAMPLE_CROSS_SECTION_LABEL);

      solver.loadCases[0].createBeamElementUniformEdgeLoad('E1', [0, 8000], true);
      solver.loadCases[0].createNodalLoad('C', { [DofID.Dx]: 0, [DofID.Dz]: -20000, [DofID.Ry]: 0 });
      solver.loadCases[0].createBeamElementUniformEdgeLoad('E3', [0, 6000], true);
    },
  },
  {
    id: 'portal',
    title: 'Portal frame load case',
    blurb: '8 m beam on 6 m columns under roof UDL and lateral + vertical knee loads for sway and bending checks.',
    viewer: { ...DEFAULT_OVERLAYS },
    build: (solver) => {
      const domain = solver.domain;
      domain.createNode('A', [0, 0, 0], [DofID.Dx, DofID.Dz, DofID.Ry]);
      domain.createNode('B', [0, 0, -6], []);
      domain.createNode('C', [8, 0, -6], []);
      domain.createNode('D', [8, 0, 0], [DofID.Dz]);

      domain.createBeam2D('E1', ['A', 'B'], EXAMPLE_MATERIAL_LABEL, EXAMPLE_CROSS_SECTION_LABEL);
      domain.createBeam2D('E2', ['B', 'C'], EXAMPLE_MATERIAL_LABEL, EXAMPLE_CROSS_SECTION_LABEL);
      domain.createBeam2D('E3', ['C', 'D'], EXAMPLE_MATERIAL_LABEL, EXAMPLE_CROSS_SECTION_LABEL);

      solver.loadCases[0].createBeamElementUniformEdgeLoad('E2', [0, 10000], true);
      solver.loadCases[0].createNodalLoad('C', { [DofID.Dx]: -8000, [DofID.Dz]: 10000, [DofID.Ry]: 0 });
    },
  },
  {
    id: 'temperature',
    title: 'Temperature load',
    blurb: 'Simply supported 8 m beam with uniform and non-uniform temperature load.',
    viewer: { ...DEFAULT_OVERLAYS },
    build: (solver) => {
      const domain = solver.domain;
      domain.createNode('A', [0, 0, 0], [DofID.Dx, DofID.Dz]);
      domain.createNode('B', [8, 0, 0], [DofID.Dz]);

      domain.createBeam2D('E1', ['A', 'B'], EXAMPLE_MATERIAL_LABEL, EXAMPLE_CROSS_SECTION_LABEL);

      solver.loadCases[0].createBeamTemperatureLoad('E1', [20, -10, 0]);
    },
  },
];

export const getExample = (id: string) => examples.find((example) => example.id === id) ?? null;

/** Adds the material and cross section every example refers to. */
export const createExampleLibrary = (solver: LinearStaticSolver) => {
  solver.domain.createCrossSection(EXAMPLE_CROSS_SECTION_LABEL, EXAMPLE_CROSS_SECTION);
  solver.domain.createMaterial(EXAMPLE_MATERIAL_LABEL, EXAMPLE_MATERIAL);
};

/** Builds and solves one example into a fresh solver, for previews and the docs gallery. */
export const buildExampleSolver = (example: ExampleDefinition) => {
  const solver = new LinearStaticSolver();

  createExampleLibrary(solver);
  example.build(solver);
  solver.solve();

  return solver;
};
