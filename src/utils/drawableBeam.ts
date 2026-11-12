import { Beam2D, type Domain, type Node } from 'ts-fem';

/**
 * Shorter than this (in metres) a beam is taken to have no length. Nodes typed at the same
 * coordinates are exactly equal; the nanometre only keeps rounding noise from passing for a beam.
 */
export const MIN_BEAM_LENGTH = 1e-9;

/** Whether two nodes are at the same point, as far as a beam between them is concerned. */
export const coincide = (a: Readonly<Pick<Node, 'coords'>>, b: Readonly<Pick<Node, 'coords'>>): boolean =>
  Math.hypot(b.coords[0] - a.coords[0], b.coords[2] - a.coords[2]) < MIN_BEAM_LENGTH;

/**
 * Whether a beam can be drawn: both of its end nodes exist, and they are not at the same point. A
 * model from an older link or file can hold an element whose node is gone, and a node can be moved
 * onto the other end of its beam; the solver reports both as errors rather than refusing the model,
 * so they stay editable in the tables. Everything that draws an element goes through this - the
 * drawing divides by the length, and a missing node has no coordinates at all.
 */
export const isDrawableBeam = (domain: Domain, element: unknown): element is Beam2D => {
  if (!(element instanceof Beam2D)) return false;

  const start = domain.nodes.get(element.nodes[0]);
  const end = domain.nodes.get(element.nodes[1]);

  return start !== undefined && end !== undefined && !coincide(start, end);
};

/** The beam with this label, if it exists and can be drawn. */
export const drawableBeam = (domain: Domain, label: string | number | null | undefined): Beam2D | undefined => {
  if (label === null || label === undefined) return undefined;

  const element = domain.elements.get(String(label));
  return isDrawableBeam(domain, element) ? element : undefined;
};
