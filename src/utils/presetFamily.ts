import type { LengthUnit } from './unitConversions';

/** Which practice a library entry comes from: EN and metric tables, or AISC and ASTM. */
export type PresetFamily = 'metric' | 'us';

export const presetFamily = (unit: LengthUnit): PresetFamily => (unit === 'ft' || unit === 'in' ? 'us' : 'metric');

/** The entries of the family in use first, each family in its own order. */
export const familyFirst = <T extends { readonly family: PresetFamily }>(
  presets: readonly T[],
  family: PresetFamily
) => [...presets.filter((preset) => preset.family === family), ...presets.filter((preset) => preset.family !== family)];
