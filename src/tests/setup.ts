/**
 * What happy-dom is missing and Vuetify expects.
 *
 * Its overlays read `visualViewport` on mount, so anything that opens a dialog throws without it.
 */
if (!('visualViewport' in window)) {
  Object.defineProperty(window, 'visualViewport', {
    value: {
      width: 1024,
      height: 768,
      scale: 1,
      offsetLeft: 0,
      offsetTop: 0,
      addEventListener() {},
      removeEventListener() {},
    },
    configurable: true,
  });
}
