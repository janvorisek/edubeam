/**
 * The layers a shared link opens with, as `?show=` with one letter per layer that is on - `show=MRL`
 * is the moments, the reactions and the loads, and nothing else. A link without it opens in the
 * viewer's own layers, as links always have.
 */
export const LAYER_LETTERS = {
  N: 'showNormalForce',
  V: 'showShearForce',
  M: 'showBendingMoment',
  U: 'showDeformedShape',
  R: 'showReactions',
  L: 'showLoads',
  S: 'showSupports',
  n: 'showNodeLabels',
  e: 'showElementLabels',
} as const;

export type LayerKey = (typeof LAYER_LETTERS)[keyof typeof LAYER_LETTERS];
export type Layers = Record<LayerKey, boolean>;

const entries = Object.entries(LAYER_LETTERS) as [keyof typeof LAYER_LETTERS, LayerKey][];

/** The letters of the layers that are on, in a fixed order. */
export const encodeLayers = (layers: Readonly<Layers>): string =>
  entries
    .filter(([, key]) => layers[key])
    .map(([letter]) => letter)
    .join('');

/** Every layer, on when its letter is in `text`; letters it does not know are ignored. */
export const decodeLayers = (text: string): Layers =>
  Object.fromEntries(entries.map(([letter, key]) => [key, text.includes(letter)])) as Layers;
