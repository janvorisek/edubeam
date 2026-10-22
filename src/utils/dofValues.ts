import { DofID, type EnumDictionary } from 'ts-fem';

type InPlaneDof = DofID.Dx | DofID.Dz | DofID.Ry;

/**
 * Dx, Dz and Ry of a nodal load or prescribed displacement, a missing one read as zero.
 *
 * The dialogs always store all three, but share links and project files from before did not:
 * a settlement could be just `{ "2": 0.001 }`. The solver takes a missing component as zero, so
 * everything that draws or shows the values must too, or it shows NaN. The stored values are left
 * as they are, so old links still re-serialize exactly as they were written.
 */
export const inPlaneValues = (
  values: Readonly<EnumDictionary<DofID, number>> | readonly number[]
): Record<InPlaneDof, number> => ({
  [DofID.Dx]: values[DofID.Dx] ?? 0,
  [DofID.Dz]: values[DofID.Dz] ?? 0,
  [DofID.Ry]: values[DofID.Ry] ?? 0,
});
