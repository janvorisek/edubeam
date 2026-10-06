import { materialPresets } from './materialPresets';
import { crossSectionPresets } from './crossSectionPresets';
import type { PresetFamily } from './presetFamily';
import { sectionPresetDefaults, type SectionPresetParam } from './sectionProperties';

const IN = 0.0254; // m
const FT = 0.3048; // m

const preset = <T extends { readonly name: string }>(list: readonly T[], name: string) => {
  const found = list.find((p) => p.name === name);
  if (!found) throw new Error(`No library entry named ${name}`);
  return found;
};

/**
 * What the add-material dialog starts with, in SI. In metric units it is the steel it always was;
 * in US units it is A992, the grade of nearly every wide-flange beam, so the fields read 29 000 ksi
 * and 490 lb/ft³ rather than 30 457.9 ksi and 62.43 lb/ft³.
 */
export const newMaterialDefaults = (family: PresetFamily) => {
  if (family === 'us') {
    const { e, g, alpha, d } = preset(materialPresets, 'Steel (ASTM A992)');
    return { e, g, alpha, d };
  }

  return { e: 210000e6, g: 210000e6 / (2 * (1 + 0.2)), alpha: 12e-6, d: 1000 };
};

/** What the add-section dialog starts with, in SI: a W12x26 in US units, round numbers otherwise. */
export const newCrossSectionDefaults = (family: PresetFamily) => {
  if (family === 'us') {
    const { a, iy, h } = preset(crossSectionPresets, 'W12x26');
    return { a, iy, h };
  }

  return { a: 1, iy: 0.0001, h: 1 };
};

/**
 * The parametric section editor's starting dimensions, in metres: whole and fractional inches in US
 * units (a 4 x 8 in I-shape with ¼ in web), the metric ones otherwise.
 */
export const newSectionPresetDefaults = (family: PresetFamily): Record<SectionPresetParam, number> =>
  family === 'us'
    ? { b: 4 * IN, h: 8 * IN, tw: 0.25 * IN, tf: 0.375 * IN, t: 0.25 * IN, d: 4 * IN, n: sectionPresetDefaults.n }
    : sectionPresetDefaults;

/**
 * Where a new point load starts along an element of the given length, in metres: a whole number
 * of the unit near midspan, at most 5 m or 15 ft in, and never closer to the start than a tenth.
 */
export const newPointLoadPosition = (lengthMetres: number, family: PresetFamily) => {
  const unit = family === 'us' ? FT : 1;
  const cap = family === 'us' ? 15 : 5;
  const length = lengthMetres / unit;

  return Math.max(Math.min(Math.floor(length / 2), cap), length / 10) * unit;
};
