import { DofID, type LinearStaticSolver } from 'ts-fem';
import { createDimensionId } from './id';
import { createDimensionPointFromNode, type DimensionLine } from '@/types/dimension';

/** The frame a first visit opens with, built into an empty solver. */
export const buildStarterModel = (solver: LinearStaticSolver, dimensions: DimensionLine[]) => {
  const domain = solver.domain;

  domain.createNode(1, [0, 0, 0], [DofID.Dx, DofID.Ry, DofID.Dz]);
  domain.createNode(2, [0, 0, -3], []);
  domain.createNode(3, [3, 0, -3], []);
  domain.createNode(4, [3, 0, 0], [DofID.Dx, DofID.Dz]);

  domain.nodes = new Map(domain.nodes);

  domain.createBeam2D(1, [1, 2], 1, 1, [false, true]);
  domain.createBeam2D(2, [2, 3], 1, 1);
  domain.createBeam2D(3, [4, 3], 1, 1);

  domain.elements = new Map(domain.elements);

  domain.createCrossSection(1, {
    a: 1,
    iy: 8.356e-5,
    iz: 1.0,
    dyz: 999991.0,
    h: 1,
    k: 1e32,
    j: 99999.0,
  });

  domain.createMaterial(1, {
    e: 210000e6,
    g: 210000e6 / (2 * (1 + 0.2)),
    alpha: 12.0e-6,
    d: 4000 /*kg/m3!!!*/,
  });

  solver.loadCases[0].createBeamElementTrapezoidalEdgeLoad(2, [0, 10000], [0, 30000], true);

  domain.materials = new Map(domain.materials);
  domain.crossSections = new Map(domain.crossSections);

  dimensions.push({
    id: createDimensionId(),
    points: [
      createDimensionPointFromNode(domain.nodes.get('1')!),
      createDimensionPointFromNode(domain.nodes.get('4')!),
    ],
    distance: 1,
  });
};
