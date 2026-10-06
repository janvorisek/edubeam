/**
 * plugins/webfontloader.ts
 *
 * webfontloader documentation: https://github.com/typekit/webfontloader
 */

export async function loadFonts() {
  // Roboto is only a nicer face: offline, or with a chunk from a replaced deploy, the system font
  // stands in and there is nothing to report.
  const webFontLoader = await import('webfontloader').catch(() => null);
  if (!webFontLoader) return;

  webFontLoader.load({
    google: {
      families: ['Roboto:100,300,400,500,700,900&display=swap'],
    },
  });
}
