import type { InjectionKey, Ref } from 'vue';

/** What the pointer is over in the drawing, and where it was when the press began. */
export type Intersected = {
  type: string | null;
  index: number | string | null;
  originalPosition: { x: number; y: number };
};

/**
 * The drawing provides the hover as the ref itself, so that reading it belongs to the overlay
 * that draws the highlight and not to the drawing: it changes as the pointer crosses the model,
 * and the drawing renders every node, element and load at once.
 */
export const intersectedKey = Symbol('intersected') as InjectionKey<Ref<Intersected>>;
