/**
 * Whether the primary pointer can hover. A touch screen cannot, so affordances that live behind
 * hovering (tooltips, a right button) need an on-screen stand-in there.
 */
export const deviceHasHover = typeof window !== 'undefined' && window.matchMedia('(hover: hover)').matches;
