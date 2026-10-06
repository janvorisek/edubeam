import {
  isAreaUnit,
  isForceUnit,
  isLengthUnit,
  isMassUnit,
  isPressureUnit,
  isSecondMomentUnit,
  isTemperatureUnit,
  isThermalExpansionUnit,
  type AreaUnit,
  type ForceUnit,
  type LengthUnit,
  type MassUnit,
  type PressureUnit,
  type SecondMomentUnit,
  type TemperatureUnit,
  type ThermalExpansionUnit,
} from './unitConversions';

/** Every display unit a person chooses, as the app store keeps them. */
export type UnitChoice = {
  /** Geometry: node coordinates, element lengths, load positions. */
  Length: LengthUnit;
  /** Cross-section dimensions, which are a hundred times smaller than the frame they belong to. */
  SectionLength: LengthUnit;
  /** Displacement results and prescribed displacements, a thousand times smaller again. */
  Displacement: LengthUnit;
  Area: AreaUnit;
  AreaM2: SecondMomentUnit;
  Mass: MassUnit;
  Force: ForceUnit;
  Pressure: PressureUnit;
  Temperature: TemperatureUnit;
  ThermalExpansion: ThermalExpansionUnit;
  moment: { force: ForceUnit; length: LengthUnit };
};

export type UnitSystem = 'si' | 'us';

/**
 * The units each practice draws and designs in. US customary follows the AISC manual: geometry in
 * feet, sections in inches, kip, kip·ft, ksi and kip/ft.
 */
export const unitSystems = {
  si: {
    Length: 'm',
    SectionLength: 'm',
    Displacement: 'm',
    Area: 'm2',
    AreaM2: 'm4',
    Mass: 'kg',
    Force: 'kN',
    Pressure: 'MPa',
    Temperature: 'C',
    ThermalExpansion: '1/K',
    moment: { force: 'kN', length: 'm' },
  },
  us: {
    Length: 'ft',
    SectionLength: 'in',
    Displacement: 'in',
    Area: 'in2',
    AreaM2: 'in4',
    Mass: 'lb',
    Force: 'kip',
    Pressure: 'ksi',
    Temperature: 'F',
    ThermalExpansion: '1/F',
    moment: { force: 'kip', length: 'ft' },
  },
} as const satisfies Record<UnitSystem, UnitChoice>;

/** The system the choice is exactly, or null for a mix of the two. */
export const matchUnitSystem = (choice: UnitChoice): UnitSystem | null =>
  (Object.keys(unitSystems) as UnitSystem[]).find((system) => {
    const preset = unitSystems[system];

    return (
      choice.Length === preset.Length &&
      choice.SectionLength === preset.SectionLength &&
      choice.Displacement === preset.Displacement &&
      choice.Area === preset.Area &&
      choice.AreaM2 === preset.AreaM2 &&
      choice.Mass === preset.Mass &&
      choice.Force === preset.Force &&
      choice.Pressure === preset.Pressure &&
      choice.Temperature === preset.Temperature &&
      choice.ThermalExpansion === preset.ThermalExpansion &&
      choice.moment.force === preset.moment.force &&
      choice.moment.length === preset.moment.length
    );
  }) ?? null;

/**
 * Time zones of the United States. A browser language alone says little: en-US is the default
 * English of most operating systems worldwide, so a student in Prague or Bangkok may well have it.
 */
const US_TIME_ZONES = [
  'America/New_York',
  'America/Detroit',
  'America/Indiana/',
  'America/Kentucky/',
  'America/Chicago',
  'America/Menominee',
  'America/North_Dakota/',
  'America/Denver',
  'America/Boise',
  'America/Phoenix',
  'America/Los_Angeles',
  'America/Anchorage',
  'America/Juneau',
  'America/Sitka',
  'America/Yakutat',
  'America/Nome',
  'America/Metlakatla',
  'America/Adak',
  'Pacific/Honolulu',
];

/** A trailing slash stands for a whole group, such as the eleven zones of Indiana. */
const isUsTimeZone = (timeZone: string) =>
  US_TIME_ZONES.some((zone) => (zone.endsWith('/') ? timeZone.startsWith(zone) : timeZone === zone));

/**
 * US customary for a browser that is both set to a US locale (en-US, es-US, …) and in a US time
 * zone, SI everywhere else. It only picks the units of a first visit; a returning person keeps
 * the units they had.
 */
export const suggestUnitSystem = (languages: readonly string[], timeZone: string): UnitSystem => {
  const first = languages[0];
  if (!first || !isUsTimeZone(timeZone)) return 'si';

  try {
    return new Intl.Locale(first).maximize().region === 'US' ? 'us' : 'si';
  } catch {
    return 'si';
  }
};

/** The suggestion for this browser. */
export const suggestBrowserUnitSystem = (): UnitSystem =>
  suggestUnitSystem(navigator.languages ?? [navigator.language], Intl.DateTimeFormat().resolvedOptions().timeZone);

/**
 * Units read back from local storage, with anything this version does not know replaced from the
 * fallback, so a tampered or future value cannot leave a quantity without a conversion.
 *
 * Section dimensions and displacements were shown in the length unit before they had units of
 * their own, so a store without them keeps showing them in that unit.
 */
export const sanitizeUnitChoice = (stored: Partial<Record<keyof UnitChoice, unknown>>, fallback: UnitChoice) => {
  const moment: { force?: unknown; length?: unknown } =
    typeof stored.moment === 'object' && stored.moment !== null ? stored.moment : {};

  const length = isLengthUnit(stored.Length) ? stored.Length : fallback.Length;
  const hadLengthOnly = isLengthUnit(stored.Length);

  return {
    Length: length,
    SectionLength: isLengthUnit(stored.SectionLength)
      ? stored.SectionLength
      : hadLengthOnly
        ? length
        : fallback.SectionLength,
    Displacement: isLengthUnit(stored.Displacement)
      ? stored.Displacement
      : hadLengthOnly
        ? length
        : fallback.Displacement,
    Area: isAreaUnit(stored.Area) ? stored.Area : fallback.Area,
    AreaM2: isSecondMomentUnit(stored.AreaM2) ? stored.AreaM2 : fallback.AreaM2,
    Mass: isMassUnit(stored.Mass) ? stored.Mass : fallback.Mass,
    Force: isForceUnit(stored.Force) ? stored.Force : fallback.Force,
    Pressure: isPressureUnit(stored.Pressure) ? stored.Pressure : fallback.Pressure,
    Temperature: isTemperatureUnit(stored.Temperature) ? stored.Temperature : fallback.Temperature,
    ThermalExpansion: isThermalExpansionUnit(stored.ThermalExpansion)
      ? stored.ThermalExpansion
      : fallback.ThermalExpansion,
    moment: {
      force: isForceUnit(moment.force) ? moment.force : fallback.moment.force,
      length: isLengthUnit(moment.length) ? moment.length : fallback.moment.length,
    },
  } satisfies UnitChoice;
};
