import { ref, type Ref } from 'vue';

/**
 * Whether the screen can be touched, whatever else the device also has.
 *
 * This is a different question from whether the pointer can hover, and the two are not opposites: a
 * laptop with a touch screen answers yes to both. Anything offered *because* a finger cannot do what
 * a mouse does has to ask this one - asking for the absence of hover hides it from exactly the
 * devices that have both and need it most.
 *
 * `any-pointer: coarse` is the direct answer where it is understood; the touch point count is the
 * fallback for where it is not.
 */
export const supportsTouch = (matches: (query: string) => boolean, maxTouchPoints: number | undefined): boolean =>
  matches('(any-pointer: coarse)') || (maxTouchPoints ?? 0) > 0;

/**
 * An answer that follows the question rather than being taken once.
 *
 * What a device can do changes under the page: a tablet is docked to a keyboard, a convertible is
 * folded over, a browser's touch simulation is switched on. Read at import time, the answer stays
 * whatever was true when the tab opened, and everything depending on it is wrong until a reload -
 * the CSS beside it, which asks the same question in a media query, changes over immediately.
 */
const followed = (query: string, answer: () => boolean): Ref<boolean> => {
  if (typeof window === 'undefined') return ref(false);

  const media = window.matchMedia(query);
  const current = ref(answer());

  media.addEventListener('change', () => (current.value = answer()));

  return current;
};

/**
 * Whether the primary pointer can hover. A touch screen cannot, so affordances that live behind
 * hovering (tooltips, a right button) need an on-screen stand-in there.
 */
export const deviceHasHover = followed('(hover: hover)', () => window.matchMedia('(hover: hover)').matches);

export const deviceCanTouch = followed('(any-pointer: coarse)', () =>
  supportsTouch((query) => window.matchMedia(query).matches, navigator?.maxTouchPoints)
);
