import { unitSize } from './unitConversions';
import type { PresetFamily } from './presetFamily';

/** A library material in SI: E and G [Pa], α [1/K], density [kg/m³]. */
export type MaterialPreset = {
  readonly family: PresetFamily;
  readonly name: string;
  readonly e: number;
  readonly g: number;
  readonly alpha: number;
  readonly d: number;
};

const metricMaterials: readonly MaterialPreset[] = [
  {
    family: 'metric',
    name: 'Steel (S235)',
    e: 210e9,
    g: 81e9,
    alpha: 12e-6,
    d: 7850,
  },
  {
    family: 'metric',
    name: 'Aluminum (6061-T6)',
    e: 69e9,
    g: 26e9,
    alpha: 23e-6,
    d: 2700,
  },
  {
    family: 'metric',
    name: 'Concrete (C25/30)',
    e: 30e9,
    g: 12e9,
    alpha: 10e-6,
    d: 2400,
  },
  {
    family: 'metric',
    name: 'Timber (C24)',
    e: 11e9,
    g: 0.69e9,
    alpha: 3e-6,
    d: 500,
  },
  {
    family: 'metric',
    name: 'Steel (S275)',
    e: 210e9,
    g: 81e9,
    alpha: 12e-6,
    d: 7850,
  },
  {
    family: 'metric',
    name: 'Steel (S355)',
    e: 210e9,
    g: 81e9,
    alpha: 12e-6,
    d: 7850,
  },
  {
    family: 'metric',
    name: 'Stainless steel (304)',
    e: 193e9,
    g: 74e9,
    alpha: 17e-6,
    d: 8000,
  },
  {
    family: 'metric',
    name: 'Stainless steel (316)',
    e: 193e9,
    g: 74e9,
    alpha: 16e-6,
    d: 8000,
  },
  {
    family: 'metric',
    name: 'Cast iron (gray)',
    e: 110e9,
    g: 43e9,
    alpha: 11e-6,
    d: 7200,
  },
  {
    family: 'metric',
    name: 'Aluminum (7075-T6)',
    e: 71.7e9,
    g: 26.9e9,
    alpha: 23.6e-6,
    d: 2810,
  },
  {
    family: 'metric',
    name: 'Aluminum (5083)',
    e: 72e9,
    g: 27e9,
    alpha: 23.5e-6,
    d: 2650,
  },
  {
    family: 'metric',
    name: 'Copper',
    e: 110e9,
    g: 44e9,
    alpha: 17e-6,
    d: 8960,
  },
  {
    family: 'metric',
    name: 'Brass (C360)',
    e: 100e9,
    g: 37e9,
    alpha: 19e-6,
    d: 8500,
  },
  {
    family: 'metric',
    name: 'Bronze (C932)',
    e: 105e9,
    g: 40e9,
    alpha: 17e-6,
    d: 8800,
  },
  {
    family: 'metric',
    name: 'Titanium (Grade 2)',
    e: 105e9,
    g: 41e9,
    alpha: 8.6e-6,
    d: 4510,
  },
  {
    family: 'metric',
    name: 'Titanium (Ti-6Al-4V)',
    e: 114e9,
    g: 44e9,
    alpha: 8.6e-6,
    d: 4430,
  },
  {
    family: 'metric',
    name: 'Concrete (C30/37)',
    e: 33e9,
    g: 13.5e9,
    alpha: 10e-6,
    d: 2400,
  },
  {
    family: 'metric',
    name: 'Concrete (C40/50)',
    e: 37e9,
    g: 15e9,
    alpha: 10e-6,
    d: 2400,
  },
  {
    family: 'metric',
    name: 'Concrete (lightweight)',
    e: 15e9,
    g: 6e9,
    alpha: 8e-6,
    d: 1800,
  },
  {
    family: 'metric',
    name: 'Timber (GL24h)',
    e: 11.5e9,
    g: 0.72e9,
    alpha: 3e-6,
    d: 450,
  },
  {
    family: 'metric',
    name: 'Timber (GL32h)',
    e: 13.5e9,
    g: 0.84e9,
    alpha: 3e-6,
    d: 470,
  },
  {
    family: 'metric',
    name: 'Glass (soda-lime)',
    e: 70e9,
    g: 29e9,
    alpha: 9e-6,
    d: 2500,
  },
  {
    family: 'metric',
    name: 'GFRP (quasi-isotropic)',
    e: 25e9,
    g: 9e9,
    alpha: 6e-6,
    d: 1900,
  },
  {
    family: 'metric',
    name: 'CFRP (quasi-isotropic)',
    e: 70e9,
    g: 5e9,
    alpha: 0.5e-6,
    d: 1600,
  },
  {
    family: 'metric',
    name: 'HDPE',
    e: 0.8e9,
    g: 0.3e9,
    alpha: 120e-6,
    d: 950,
  },
  {
    family: 'metric',
    name: 'PVC (rigid)',
    e: 3.0e9,
    g: 1.1e9,
    alpha: 80e-6,
    d: 1400,
  },
  {
    family: 'metric',
    name: 'PMMA (acrylic)',
    e: 3.2e9,
    g: 1.2e9,
    alpha: 70e-6,
    d: 1180,
  },
  {
    family: 'metric',
    name: 'Polycarbonate',
    e: 2.3e9,
    g: 0.9e9,
    alpha: 65e-6,
    d: 1200,
  },
];

const KSI = unitSize.pressure('ksi');
const PER_F = unitSize.thermalExpansion('1/F');
const PCF = unitSize.mass('lb') / unitSize.length('ft') ** 3;

/** A material as the US references give it: E and G in ksi, α in 1/°F, unit weight in lb/ft³. */
const us = (name: string, eKsi: number, gKsi: number, alphaPerF: number, pcf: number): MaterialPreset => ({
  family: 'us',
  name,
  e: eKsi * KSI,
  g: gKsi * KSI,
  alpha: alphaPerF * PER_F,
  d: pcf * PCF,
});

/**
 * Structural steels share E = 29 000 ksi and G = 11 200 ksi (AISC 360). Concrete takes
 * Ec = 57 000 √f'c psi (ACI 318) and G = Ec / 2(1 + 0.2).
 */
const usMaterials: readonly MaterialPreset[] = [
  us('Steel (ASTM A992)', 29000, 11200, 6.5e-6, 490),
  us('Steel (ASTM A36)', 29000, 11200, 6.5e-6, 490),
  us('Steel (ASTM A572 Gr. 50)', 29000, 11200, 6.5e-6, 490),
  us('Steel HSS (ASTM A500 Gr. C)', 29000, 11200, 6.5e-6, 490),
  us("Concrete (f'c = 4 ksi)", 3605, 1502, 5.5e-6, 150),
  us("Concrete (f'c = 5 ksi)", 4031, 1680, 5.5e-6, 150),
];

export const materialPresets: readonly MaterialPreset[] = [...metricMaterials, ...usMaterials];
