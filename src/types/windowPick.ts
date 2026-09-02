import type { InjectionKey, Ref } from 'vue';

/** The rectangle of the drawing being picked for an image export, in model units. */
export type WindowDrag = { x0: number; y0: number; x1: number; y1: number } | null;

/**
 * The drawing provides the drag as the ref itself, so that reading it is the overlay's business
 * and not the drawing's: it changes on every pointer report of the gesture.
 */
export const windowDragKey = Symbol('windowPickDrag') as InjectionKey<Ref<WindowDrag>>;

/** The drag as a rectangle: the two corners in either order give the same window. */
export const windowPickBox = (drag: WindowDrag) => {
  if (!drag) return null;

  return {
    x: Math.min(drag.x0, drag.x1),
    y: Math.min(drag.y0, drag.y1),
    w: Math.abs(drag.x1 - drag.x0),
    h: Math.abs(drag.y1 - drag.y0),
  };
};
