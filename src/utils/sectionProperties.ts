/**
 * Geometric properties of polygonal cross sections.
 *
 * Coordinates are section-local and right-handed with `x` out of the screen: `y` points to the
 * left and `z` downwards (the orientation the editor draws), both in metres. Every contour is a simple polygon;
 * the first contour is the outline, contours flagged `hole` are subtracted.
 */

export type SectionPoint = [number, number]; // [y, z]

export type SectionContour = {
  points: SectionPoint[];
  hole?: boolean;
};

export type SectionShape = {
  contours: SectionContour[];
};

export type SectionProperties = {
  /** area [m2] */
  a: number;
  /** centroid [m] */
  cy: number;
  cz: number;
  /** centroidal second moments of area [m4] */
  iy: number;
  iz: number;
  iyz: number;
  /** principal second moments of area [m4], i1 >= i2 */
  i1: number;
  i2: number;
  /** angle between the y axis and principal axis 1 [rad] */
  alpha: number;
  /** radii of gyration [m] */
  ry: number;
  rz: number;
  r1: number;
  r2: number;
  /** bounding box [m] */
  ymin: number;
  ymax: number;
  zmin: number;
  zmax: number;
  /** overall height (z extent) and width (y extent) [m] */
  h: number;
  b: number;
};

type RawIntegrals = { a: number; sy: number; sz: number; iy: number; iz: number; iyz: number };

/** Integrals of 1, z, y, z², y², yz over a single polygon via Green's theorem (signed by orientation). */
const integrateContour = (points: SectionPoint[]): RawIntegrals => {
  let a = 0;
  let sy = 0;
  let sz = 0;
  let iy = 0;
  let iz = 0;
  let iyz = 0;

  const n = points.length;
  for (let i = 0; i < n; i++) {
    const [y0, z0] = points[i];
    const [y1, z1] = points[(i + 1) % n];
    const cross = y0 * z1 - y1 * z0;

    a += cross;
    sy += (z0 + z1) * cross;
    sz += (y0 + y1) * cross;
    iy += (z0 * z0 + z0 * z1 + z1 * z1) * cross;
    iz += (y0 * y0 + y0 * y1 + y1 * y1) * cross;
    iyz += (y0 * z1 + 2 * y0 * z0 + 2 * y1 * z1 + y1 * z0) * cross;
  }

  return { a: a / 2, sy: sy / 6, sz: sz / 6, iy: iy / 12, iz: iz / 12, iyz: iyz / 24 };
};

/** Signed polygon area (positive for counter-clockwise in a y-right/z-up frame). */
export const contourArea = (points: SectionPoint[]) => integrateContour(points).a;

export const isContourValid = (contour: SectionContour) =>
  contour.points.length >= 3 && contour.points.every((p) => Number.isFinite(p[0]) && Number.isFinite(p[1]));

const orient = (a: SectionPoint, b: SectionPoint, c: SectionPoint) =>
  Math.sign((b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0]));

const onSegment = (a: SectionPoint, b: SectionPoint, p: SectionPoint) =>
  Math.min(a[0], b[0]) <= p[0] &&
  p[0] <= Math.max(a[0], b[0]) &&
  Math.min(a[1], b[1]) <= p[1] &&
  p[1] <= Math.max(a[1], b[1]);

/** Proper or touching intersection of segments ab and cd. */
const segmentsIntersect = (a: SectionPoint, b: SectionPoint, c: SectionPoint, d: SectionPoint) => {
  const o1 = orient(a, b, c);
  const o2 = orient(a, b, d);
  const o3 = orient(c, d, a);
  const o4 = orient(c, d, b);
  if (o1 !== o2 && o3 !== o4) return true;
  if (o1 === 0 && onSegment(a, b, c)) return true;
  if (o2 === 0 && onSegment(a, b, d)) return true;
  if (o3 === 0 && onSegment(c, d, a)) return true;
  if (o4 === 0 && onSegment(c, d, b)) return true;
  return false;
};

/**
 * `true` when any two non-adjacent edges of the contour cross or touch. Green's theorem only
 * holds for simple polygons, so self-intersecting contours must be rejected.
 */
export const isContourSelfIntersecting = (points: SectionPoint[]) => {
  const n = points.length;
  if (n < 4) return false;
  for (let i = 0; i < n; i++) {
    const a = points[i];
    const b = points[(i + 1) % n];
    for (let j = i + 2; j < n; j++) {
      if (i === 0 && j === n - 1) continue; // adjacent (closing edge)
      if (segmentsIntersect(a, b, points[j], points[(j + 1) % n])) return true;
    }
  }
  return false;
};

export const isShapeValid = (shape: SectionShape | null | undefined): shape is SectionShape => {
  if (!shape || !Array.isArray(shape.contours) || shape.contours.length === 0) return false;
  if (!shape.contours.every(isContourValid)) return false;
  if (shape.contours.some((c) => isContourSelfIntersecting(c.points))) return false;
  const p = computeSectionProperties(shape);
  return p.a > 0 && p.iy > 0 && p.iz > 0;
};

/**
 * Computes the section properties of `shape`. Contour orientation does not matter:
 * outlines always contribute positively and holes negatively.
 */
export const computeSectionProperties = (shape: SectionShape): SectionProperties => {
  const total: RawIntegrals = { a: 0, sy: 0, sz: 0, iy: 0, iz: 0, iyz: 0 };
  let ymin = Infinity;
  let ymax = -Infinity;
  let zmin = Infinity;
  let zmax = -Infinity;

  for (const contour of shape.contours) {
    if (contour.points.length < 3) continue;

    const raw = integrateContour(contour.points);
    if (raw.a === 0) continue;

    // Normalise the orientation so outlines add and holes subtract.
    const sign = (contour.hole ? -1 : 1) * Math.sign(raw.a);
    total.a += sign * raw.a;
    total.sy += sign * raw.sy;
    total.sz += sign * raw.sz;
    total.iy += sign * raw.iy;
    total.iz += sign * raw.iz;
    total.iyz += sign * raw.iyz;

    if (!contour.hole) {
      for (const [y, z] of contour.points) {
        ymin = Math.min(ymin, y);
        ymax = Math.max(ymax, y);
        zmin = Math.min(zmin, z);
        zmax = Math.max(zmax, z);
      }
    }
  }

  const a = total.a;
  const cy = a !== 0 ? total.sz / a : 0;
  const cz = a !== 0 ? total.sy / a : 0;

  // Parallel axis theorem: move to the centroid.
  const iy = total.iy - a * cz * cz;
  const iz = total.iz - a * cy * cy;
  let iyz = total.iyz - a * cy * cz;

  // Symmetric sections produce floating-point dust instead of an exact zero; clean it so the
  // principal angle is exactly 0 and the UI does not show values like 1e-24.
  if (Math.abs(iyz) < 1e-12 * (Math.abs(iy) + Math.abs(iz))) iyz = 0;

  const avg = (iy + iz) / 2;
  const radius = Math.sqrt(((iy - iz) / 2) ** 2 + iyz ** 2);
  const i1 = avg + radius;
  const i2 = avg - radius;
  const alpha = radius === 0 ? 0 : 0.5 * Math.atan2(-2 * iyz, iy - iz);

  const gyr = (i: number) => (a > 0 && i >= 0 ? Math.sqrt(i / a) : 0);

  if (!Number.isFinite(ymin)) ymin = ymax = zmin = zmax = 0;

  return {
    a,
    cy,
    cz,
    iy,
    iz,
    iyz,
    i1,
    i2,
    alpha,
    ry: gyr(iy),
    rz: gyr(iz),
    r1: gyr(i1),
    r2: gyr(i2),
    ymin,
    ymax,
    zmin,
    zmax,
    h: zmax - zmin,
    b: ymax - ymin,
  };
};

/** Translates the shape so that its centroid lies at the origin. */
export const centerShape = (shape: SectionShape): SectionShape => {
  const { cy, cz } = computeSectionProperties(shape);
  return {
    contours: shape.contours.map((c) => ({
      hole: c.hole,
      points: c.points.map(([y, z]) => [y - cy, z - cz] as SectionPoint),
    })),
  };
};

export const cloneShape = (shape: SectionShape): SectionShape => ({
  contours: shape.contours.map((c) => ({
    ...(c.hole ? { hole: true } : {}),
    points: c.points.map((p) => [p[0], p[1]] as SectionPoint),
  })),
});

// ---------------------------------------------------------------------------
// Parametric presets. All dimensions in metres; shapes are returned centred at the origin.
// ---------------------------------------------------------------------------

export type SectionPresetId =
  | 'rectangle'
  | 'iSection'
  | 'tSection'
  | 'lSection'
  | 'channel'
  | 'box'
  | 'circle'
  | 'pipe';

export type SectionPresetParam = 'b' | 'h' | 'tw' | 'tf' | 't' | 'd' | 'n';

export const sectionPresetParams: Record<SectionPresetId, SectionPresetParam[]> = {
  rectangle: ['b', 'h'],
  iSection: ['b', 'h', 'tw', 'tf'],
  tSection: ['b', 'h', 'tw', 'tf'],
  lSection: ['b', 'h', 't'],
  channel: ['b', 'h', 'tw', 'tf'],
  box: ['b', 'h', 't'],
  circle: ['d', 'n'],
  pipe: ['d', 't', 'n'],
};

export const sectionPresetDefaults: Record<SectionPresetParam, number> = {
  b: 0.1,
  h: 0.2,
  tw: 0.006,
  tf: 0.01,
  t: 0.005,
  d: 0.1,
  n: 32,
};

const rect = (y0: number, z0: number, y1: number, z1: number): SectionPoint[] => [
  [y0, z0],
  [y1, z0],
  [y1, z1],
  [y0, z1],
];

const circlePoints = (r: number, n: number): SectionPoint[] => {
  const pts: SectionPoint[] = [];
  const segments = Math.max(3, Math.round(n));
  for (let i = 0; i < segments; i++) {
    const t = (2 * Math.PI * i) / segments;
    pts.push([r * Math.cos(t), r * Math.sin(t)]);
  }
  return pts;
};

export const createPresetShape = (
  id: SectionPresetId,
  params: Partial<Record<SectionPresetParam, number>> = {}
): SectionShape => {
  const p = { ...sectionPresetDefaults, ...params };
  const { b, h, tw, tf, t, d, n } = p;
  const hb = b / 2;
  const hh = h / 2;

  let shape: SectionShape;

  switch (id) {
    case 'rectangle':
      shape = { contours: [{ points: rect(-hb, -hh, hb, hh) }] };
      break;
    case 'iSection': {
      const hw = tw / 2;
      shape = {
        contours: [
          {
            points: [
              [-hb, -hh],
              [hb, -hh],
              [hb, -hh + tf],
              [hw, -hh + tf],
              [hw, hh - tf],
              [hb, hh - tf],
              [hb, hh],
              [-hb, hh],
              [-hb, hh - tf],
              [-hw, hh - tf],
              [-hw, -hh + tf],
              [-hb, -hh + tf],
            ],
          },
        ],
      };
      break;
    }
    case 'tSection': {
      const hw = tw / 2;
      shape = {
        contours: [
          {
            points: [
              [-hb, -hh],
              [hb, -hh],
              [hb, -hh + tf],
              [hw, -hh + tf],
              [hw, hh],
              [-hw, hh],
              [-hw, -hh + tf],
              [-hb, -hh + tf],
            ],
          },
        ],
      };
      break;
    }
    case 'lSection':
      shape = {
        contours: [
          {
            points: [
              [0, 0],
              [t, 0],
              [t, h - t],
              [b, h - t],
              [b, h],
              [0, h],
            ],
          },
        ],
      };
      break;
    case 'channel':
      shape = {
        contours: [
          {
            points: [
              [0, 0],
              [b, 0],
              [b, tf],
              [tw, tf],
              [tw, h - tf],
              [b, h - tf],
              [b, h],
              [0, h],
            ],
          },
        ],
      };
      break;
    case 'box':
      shape = {
        contours: [{ points: rect(-hb, -hh, hb, hh) }, { points: rect(-hb + t, -hh + t, hb - t, hh - t), hole: true }],
      };
      break;
    case 'circle':
      shape = { contours: [{ points: circlePoints(d / 2, n) }] };
      break;
    case 'pipe':
      shape = {
        contours: [{ points: circlePoints(d / 2, n) }, { points: circlePoints(d / 2 - t, n), hole: true }],
      };
      break;
  }

  return centerShape(shape);
};

// ---------------------------------------------------------------------------
// Compact serialisation: [[points, holeFlag], ...]
// ---------------------------------------------------------------------------

export type SerializedShape = [SectionPoint[], 0 | 1][];

export const serializeShape = (shape: SectionShape): SerializedShape =>
  shape.contours.map((c) => [c.points.map((p) => [p[0], p[1]] as SectionPoint), c.hole ? 1 : 0]);

export const deserializeShape = (data: unknown): SectionShape | null => {
  if (!isSerializedShape(data)) return null;
  return {
    contours: data.map(([points, hole]) => ({
      points: points.map((p) => [p[0], p[1]] as SectionPoint),
      ...(hole ? { hole: true } : {}),
    })),
  };
};

export const MAX_SHAPE_CONTOURS = 64;
export const MAX_CONTOUR_POINTS = 512;

export const isSerializedShape = (data: unknown): data is SerializedShape =>
  Array.isArray(data) &&
  data.length > 0 &&
  data.length <= MAX_SHAPE_CONTOURS &&
  data.every(
    (row) =>
      Array.isArray(row) &&
      row.length === 2 &&
      Array.isArray(row[0]) &&
      row[0].length >= 3 &&
      row[0].length <= MAX_CONTOUR_POINTS &&
      row[0].every(
        (p: unknown) =>
          Array.isArray(p) &&
          p.length === 2 &&
          typeof p[0] === 'number' &&
          Number.isFinite(p[0]) &&
          typeof p[1] === 'number' &&
          Number.isFinite(p[1])
      ) &&
      (row[1] === 0 || row[1] === 1)
  );
