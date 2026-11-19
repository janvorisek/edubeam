/**
 * The names of the material and cross-section library entries, in the app language.
 *
 * A preset's `name` is English and stays its identifier in the code. What is shown, and what a
 * material or section added from the library is labelled, is the name in the app language: the
 * words are translated (Steel → Ocel, approx → přibl.), designations stay as the standards write
 * them (S235, C25/30, IPE 200, W12x26). A label already in a model is the model's own data and is
 * never renamed, so saved projects and share links keep the names they have.
 */

/** Names, or their first word, that are words rather than designations; under `library.name`. */
const NAME_KEYS = {
  Steel: 'steel',
  'Steel HSS': 'steelHss',
  'Stainless steel': 'stainlessSteel',
  Aluminum: 'aluminum',
  Concrete: 'concrete',
  Timber: 'timber',
  'Cast iron': 'castIron',
  Copper: 'copper',
  Brass: 'brass',
  Bronze: 'bronze',
  Titanium: 'titanium',
  Glass: 'glass',
  Polycarbonate: 'polycarbonate',
  Rect: 'rect',
  Square: 'square',
  Circular: 'circular',
} as const satisfies Readonly<Record<string, string>>;

/** The words in brackets that are not designations; under `library.qualifier`. */
const QUALIFIER_KEYS = {
  gray: 'gray',
  lightweight: 'lightweight',
  'soda-lime': 'sodaLime',
  'quasi-isotropic': 'quasiIsotropic',
  rigid: 'rigid',
  acrylic: 'acrylic',
  approx: 'approx',
} as const satisfies Readonly<Record<string, string>>;

const lookup = <T extends Readonly<Record<string, string>>>(keys: T, word: string): T[keyof T] | undefined =>
  Object.hasOwn(keys, word) ? keys[word as keyof T] : undefined;

/** "Steel (S235)" → the base "Steel" and the bracket "S235". */
const splitName = (name: string): { base: string; bracket: string | null } => {
  const match = /^(.*?) \((.*)\)$/.exec(name);
  return match ? { base: match[1], bracket: match[2] } : { base: name, bracket: null };
};

/** The words of a preset name that get translated, as message keys; the rest is kept as written. */
export const presetNameParts = (name: string) => {
  const { base, bracket } = splitName(name);
  const [first, ...rest] = base.split(' ');
  const whole = lookup(NAME_KEYS, base);

  return {
    base: whole ?? lookup(NAME_KEYS, first),
    /** What follows a translated first word: "Rect 100x10 mm" keeps "100x10 mm". */
    baseRest: whole === undefined && lookup(NAME_KEYS, first) !== undefined ? rest.join(' ') : '',
    baseText: base,
    qualifier: bracket === null ? undefined : lookup(QUALIFIER_KEYS, bracket),
    bracket,
  };
};

/** A library entry's name in the app language. */
export const presetDisplayName = (name: string, t: (key: string) => string): string => {
  const parts = presetNameParts(name);

  const base =
    parts.base === undefined
      ? parts.baseText
      : [t(`library.name.${parts.base}`), parts.baseRest].filter((s) => s !== '').join(' ');

  if (parts.bracket === null) return base;

  const bracket = parts.qualifier === undefined ? parts.bracket : t(`library.qualifier.${parts.qualifier}`);
  return `${base} (${bracket})`;
};
