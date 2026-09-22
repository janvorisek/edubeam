/**
 * Whether the primary pointer can hover. A touch screen cannot, so affordances that live behind
 * hovering (tooltips, a right button) need an on-screen stand-in there.
 */
export const deviceHasHover = typeof window !== 'undefined' && window.matchMedia('(hover: hover)').matches;

/**
 * Whether the screen can be touched, whatever else the device also has.
 *
 * This is a different question from the one above, and the two are not opposites: a laptop with a
 * touch screen answers yes to both. Anything offered *because* a finger cannot do what a mouse does
 * has to ask this one - asking for the absence of hover hides it from exactly the devices that have
 * both and need it most.
 *
 * `any-pointer: coarse` is the direct answer where it is understood; the touch point count is the
 * fallback for where it is not.
 */
export const supportsTouch = (matches: (query: string) => boolean, maxTouchPoints: number | undefined): boolean =>
  matches('(any-pointer: coarse)') || (maxTouchPoints ?? 0) > 0;

export const deviceCanTouch =
  typeof window !== 'undefined' &&
  supportsTouch((query) => window.matchMedia(query).matches, navigator?.maxTouchPoints);
