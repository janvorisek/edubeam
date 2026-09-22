import type { InjectionKey, Ref } from 'vue';

export type PlacingStartNode = {
  label: string | number | null;
  x: number;
  y: number;
  sourceNodeLabel?: string | number | null;
} | null;

/** Where the next node or element would go, and what it would attach to. */
export type PlacingContext = {
  /** The pointer in model units, snapped to the grid when snapping is on. */
  x: Ref<number>;
  y: Ref<number>;
  /** The end already placed, which the rubber line is drawn from. */
  startNode: Ref<PlacingStartNode>;
  /** Whether the pointer is over a node, which the rubber line draws solid rather than dashed. */
  snappedToNode: Ref<boolean>;
};

/**
 * The drawing provides these as the refs themselves, so that reading them belongs to the preview
 * and not to the drawing: the pointer position changes on every report while a placing mode is
 * on, and the drawing renders every node, element and load at once.
 */
export const placingKey = Symbol('placing') as InjectionKey<PlacingContext>;
