import { DofID, type LinearStaticSolver } from 'ts-fem';
import { createDimensionId } from './id';
import { createDimensionPointFromNode, type DimensionLine } from '@/types/dimension';
import type { UnitSystem } from './unitSystems';
import { unitSize } from './unitConversions';

const FT = unitSize.length('ft');
const IN = unitSize.length('in');
const KSI = unitSize.pressure('ksi');
const KIP_PER_FT = unitSize.force('kip') / FT;

/**
 * The same frame in the numbers each practice draws with. The SI one is the frame EduBeam has
 * always opened with and must not change. The US one is a 10 ft square of W12x26 in A992, close to
 * it in proportion and stiffness, so a first visit in feet reads 10 ft and 0.5 kip/ft rather than
 * 9.8425 ft and 0.6852 kip/ft.
 */
const starterFrames = {
  si: {
    span: 3,
    dimensionOffset: 1,
    section: { a: 1, iy: 8.356e-5, h: 1 },
    material: { e: 210000e6, g: 210000e6 / (2 * (1 + 0.2)), alpha: 12.0e-6, d: 4000 },
    load: [10000, 30000],
  },
  us: {
    span: 10 * FT,
    dimensionOffset: 3 * FT,
    // A large area keeps the members axially stiff, as in the SI frame
    section: { a: 1000 * IN ** 2, iy: 204 * IN ** 4, h: 12.2 * IN },
    material: {
      e: 29000 * KSI,
      g: 11200 * KSI,
      alpha: 6.5e-6 * unitSize.thermalExpansion('1/F'),
      d: 490 * (unitSize.mass('lb') / FT ** 3),
    },
    load: [0.5 * KIP_PER_FT, 1.5 * KIP_PER_FT],
  },
} as const;

/** The frame a first visit opens with, built into an empty solver. */
export const buildStarterModel = (
  solver: LinearStaticSolver,
  dimensions: DimensionLine[],
  system: UnitSystem = 'si'
) => {
  const domain = solver.domain;
  const frame = starterFrames[system];
  const span = frame.span;

  domain.createNode(1, [0, 0, 0], [DofID.Dx, DofID.Ry, DofID.Dz]);
  domain.createNode(2, [0, 0, -span], []);
  domain.createNode(3, [span, 0, -span], []);
  domain.createNode(4, [span, 0, 0], [DofID.Dx, DofID.Dz]);

  domain.nodes = new Map(domain.nodes);

  domain.createBeam2D(1, [1, 2], 1, 1, [false, true]);
  domain.createBeam2D(2, [2, 3], 1, 1);
  domain.createBeam2D(3, [4, 3], 1, 1);

  domain.elements = new Map(domain.elements);

  domain.createCrossSection(1, {
    ...frame.section,
    iz: 1.0,
    dyz: 999991.0,
    k: 1e32,
    j: 99999.0,
  });

  domain.createMaterial(1, { ...frame.material });

  solver.loadCases[0].createBeamElementTrapezoidalEdgeLoad(2, [0, frame.load[0]], [0, frame.load[1]], true);

  domain.materials = new Map(domain.materials);
  domain.crossSections = new Map(domain.crossSections);

  dimensions.push({
    id: createDimensionId(),
    points: [
      createDimensionPointFromNode(domain.nodes.get('1')!),
      createDimensionPointFromNode(domain.nodes.get('4')!),
    ],
    // In model units: a dimension without them is read as a legacy pixel offset and scaled by
    // whatever the zoom is when the viewer first sees it
    distance: frame.dimensionOffset,
    distanceUnit: 'world',
  });
};
