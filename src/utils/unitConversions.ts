/**
 * Display units and their size in SI. The model is stored in m, N, Pa, kg and K; every quantity on
 * screen is that value divided by the size of one display unit. All factors are exact by
 * definition (international foot and pound, standard gravity), so a model drawn in feet survives
 * the round trip through metres.
 */

const IN = 0.0254; // m
const FT = 0.3048; // m
const LB = 0.45359237; // kg
const G0 = 9.80665; // m/s², defines kgf and lbf
const LBF = LB * G0; // N

export const lengthUnits = { m: 1, cm: 0.01, mm: 0.001, in: IN, ft: FT } as const satisfies Record<string, number>;

/**
 * kip is 1000 lbf. Tonf is the metric tonne-force of the Thai and Latin American practice, not the
 * US short ton.
 */
export const forceUnits = {
  N: 1,
  kN: 1e3,
  MN: 1e6,
  kgf: G0,
  Tonf: 1000 * G0,
  lbf: LBF,
  kip: 1000 * LBF,
} as const satisfies Record<string, number>;

export const pressureUnits = {
  Pa: 1,
  kPa: 1e3,
  MPa: 1e6,
  GPa: 1e9,
  ksc: G0 / 0.01 ** 2, // kgf/cm²
  psi: LBF / IN ** 2,
  ksi: (1000 * LBF) / IN ** 2,
  psf: LBF / FT ** 2,
  ksf: (1000 * LBF) / FT ** 2,
} as const satisfies Record<string, number>;

export const massUnits = { kg: 1, lb: LB } as const satisfies Record<string, number>;

/**
 * Every temperature in the model is a difference (a load is a change from the stress-free state),
 * so a degree Fahrenheit is 5/9 K with no offset.
 */
export const temperatureUnits = { C: 1, F: 5 / 9 } as const satisfies Record<string, number>;

/** A coefficient of thermal expansion is per degree, the inverse of a temperature difference. */
export const thermalExpansionUnits = { '1/K': 1, '1/F': 9 / 5 } as const satisfies Record<string, number>;

export type LengthUnit = keyof typeof lengthUnits;
export type ForceUnit = keyof typeof forceUnits;
export type PressureUnit = keyof typeof pressureUnits;
export type MassUnit = keyof typeof massUnits;
export type TemperatureUnit = keyof typeof temperatureUnits;
export type ThermalExpansionUnit = keyof typeof thermalExpansionUnits;
export type AreaUnit = `${LengthUnit}2`;
export type SecondMomentUnit = `${LengthUnit}4`;

const isUnitOf = <T extends Record<string, number>>(table: T, unit: unknown): unit is keyof T =>
  typeof unit === 'string' && Object.hasOwn(table, unit);

export const isLengthUnit = (u: unknown): u is LengthUnit => isUnitOf(lengthUnits, u);
export const isForceUnit = (u: unknown): u is ForceUnit => isUnitOf(forceUnits, u);
export const isPressureUnit = (u: unknown): u is PressureUnit => isUnitOf(pressureUnits, u);
export const isMassUnit = (u: unknown): u is MassUnit => isUnitOf(massUnits, u);
export const isTemperatureUnit = (u: unknown): u is TemperatureUnit => isUnitOf(temperatureUnits, u);
export const isThermalExpansionUnit = (u: unknown): u is ThermalExpansionUnit => isUnitOf(thermalExpansionUnits, u);

const poweredLength = (unit: unknown, power: 2 | 4) =>
  typeof unit === 'string' && unit.endsWith(`${power}`) && isLengthUnit(unit.slice(0, -1));

export const isAreaUnit = (u: unknown): u is AreaUnit => poweredLength(u, 2);
export const isSecondMomentUnit = (u: unknown): u is SecondMomentUnit => poweredLength(u, 4);

/** Size of one display unit in SI, e.g. `unitSize.force('kip')` is 4448.22 N. */
export const unitSize = {
  length: (u: LengthUnit) => lengthUnits[u],
  area: (u: AreaUnit) => lengthUnits[u.slice(0, -1) as LengthUnit] ** 2,
  secondMoment: (u: SecondMomentUnit) => lengthUnits[u.slice(0, -1) as LengthUnit] ** 4,
  force: (u: ForceUnit) => forceUnits[u],
  pressure: (u: PressureUnit) => pressureUnits[u],
  mass: (u: MassUnit) => massUnits[u],
  temperature: (u: TemperatureUnit) => temperatureUnits[u],
  thermalExpansion: (u: ThermalExpansionUnit) => thermalExpansionUnits[u],
};

/**
 * A value in SI as a number of display units. Rounded to 15 significant digits, more than any
 * field or label shows, so that a model value which was itself typed in that unit reads back as
 * typed: 3.5 ft is stored as 1.0668 m, and 1.0668 / 0.3048 is 3.4999999999999996.
 */
export const fromSI = (value: number, size: number) => Number((value / size).toPrecision(15));

/** A unit as plain text, for a field suffix: the degree sign is not part of the stored code. */
const UNIT_TEXT: Readonly<Partial<Record<string, string>>> = { C: '°C', F: '°F', '1/F': '1/°F' };

export const unitText = (unit: string) => UNIT_TEXT[unit] ?? unit;

/**
 * A moment is a force times a lever arm, written the way each practice writes it: kNm and Nmm in
 * the European tables, kip·ft where run-together letters would be unreadable.
 */
export const momentLabel = (force: ForceUnit, length: LengthUnit) =>
  force.endsWith('N') ? `${force}${length}` : `${force}·${length}`;
