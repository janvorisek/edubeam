import type { DimensionPoint } from '@/types/dimension';
import { parseFloat2 } from '@/utils';

/** The four fields of the dimension edit panel: both ends, horizontal and vertical. */
export type DimensionFields = { x1: string; v1: string; x2: string; v2: string };

/**
 * How a coordinate in metres reaches a field and comes back: the display length unit, then the
 * axis convention, which only flips the vertical sign. Both are passed in so this stays a plain
 * function of its inputs.
 */
export type DimensionFieldUnits = {
  toDisplay: (metres: number) => number;
  toMetres: (display: number) => number;
  vertical: (value: number) => number;
};

/** The numbers the fields show for two resolved points, in the order x1, v1, x2, v2. */
export const dimensionFieldValues = (
  points: readonly [Pick<DimensionPoint, 'x' | 'y'>, Pick<DimensionPoint, 'x' | 'y'>],
  units: DimensionFieldUnits
) => ({
  x1: units.toDisplay(points[0].x),
  v1: units.vertical(units.toDisplay(points[0].y)),
  x2: units.toDisplay(points[1].x),
  v2: units.vertical(units.toDisplay(points[1].y)),
});

/**
 * The points the fields describe, or null while any field is empty. Editing any field pins both
 * ends where the fields say they are, so neither stays snapped to a node.
 */
export const dimensionPointsFromFields = (
  current: readonly [DimensionPoint, DimensionPoint],
  fields: Readonly<DimensionFields>,
  units: DimensionFieldUnits
): [DimensionPoint, DimensionPoint] | null => {
  if (!fields.x1 || !fields.v1 || !fields.x2 || !fields.v2) return null;

  const horizontal = (field: string) => units.toMetres(parseFloat2(field));
  const vertical = (field: string) => units.toMetres(units.vertical(parseFloat2(field)));

  return [
    { ...current[0], x: horizontal(fields.x1), y: vertical(fields.v1), sourceNodeLabel: null },
    { ...current[1], x: horizontal(fields.x2), y: vertical(fields.v2), sourceNodeLabel: null },
  ];
};

/**
 * Whether a field already says the number, so a sync must not rewrite it: "1." or "-0" would be
 * rewritten as "1" and "0" under the typing hand, and a value typed in feet comes back from metres
 * a rounding error off.
 */
export const fieldMeans = (field: string, value: number) => {
  if (field === '') return false;

  const typed = parseFloat2(field);
  return Math.abs(typed - value) <= 1e-9 * Math.max(Math.abs(typed), Math.abs(value), 1);
};
