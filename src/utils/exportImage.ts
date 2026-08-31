/**
 * Draws the model to a PNG people can drop into a report or slide.
 *
 * A throwaway viewer is mounted off screen at exactly the requested resolution and given
 * the editor's own settings — colours, font size, support size, result diagram height,
 * unit converters. It draws the structure for that canvas rather than the editor's, so
 * the output is a real drawing at that size instead of a rescaled one: stroke widths and
 * type come out at their true pixel sizes, because nothing is stretched afterwards.
 *
 * PNG is the only output format on purpose. Producing a *file* of SVG would mean
 * shipping the flattened styles below to a foreign renderer and hoping; rasterizing
 * keeps the browser as the only renderer involved.
 */
import { createApp, nextTick, type Component } from 'vue';
// Barlow is the app's own typeface. Bundled rather than pulled from the web font CDN,
// so an export embeds the same face whether or not the machine is online.
import barlowRegular from '@fontsource/barlow/files/barlow-latin-400-normal.woff2?url';

/**
 * Properties that carry the viewer's appearance.
 *
 * Every one of them is written out, even when it matches the SVG initial value. Most are
 * inherited — `stroke-width`, `fill`, `stroke`, the `marker-*` trio — so leaving one off
 * does not mean "use the default", it means "take the parent's", and after flattening the
 * parent carries an explicit value it never had in the live document. That is how a 1 px
 * line ends up drawn at a group's stroke width.
 */
const FLATTENED_PROPERTIES = [
  'fill',
  'fill-opacity',
  'fill-rule',
  'stroke',
  'stroke-width',
  'stroke-opacity',
  'stroke-linecap',
  'stroke-linejoin',
  'stroke-dasharray',
  'stroke-dashoffset',
  'marker-start',
  'marker-mid',
  'marker-end',
  'filter',
  'opacity',
  'paint-order',
  'vector-effect',
];

/** Text metrics only matter on text nodes, and emitting them everywhere bloats the file. */
const TEXT_PROPERTIES = ['font-family', 'font-size', 'font-weight', 'font-style', 'text-anchor', 'letter-spacing'];

const isTextElement = (element: Element) => element.tagName === 'text' || element.tagName === 'tspan';

/**
 * Copies computed appearance onto the clone, in document order.
 *
 * Both trees are walked with the same filter so the two node lists stay index-aligned;
 * hidden subtrees are dropped from the clone entirely rather than exported invisible.
 */
const flattenStyles = (source: Element, clone: Element, strokeScale = 1) => {
  const sourceStyle = getComputedStyle(source);

  if (sourceStyle.display === 'none' || sourceStyle.visibility === 'hidden') {
    clone.remove();
    return;
  }

  const declarations: string[] = [];

  // `non-scaling-stroke` pins the stroke to viewport pixels, so it is the one thing that
  // does *not* grow when the same drawing is rasterized at a higher resolution: geometry,
  // type and markers all double while these stay put and come out half weight. Scaling
  // them here by hand keeps every line in proportion.
  const pinnedStroke = strokeScale !== 1 && sourceStyle.getPropertyValue('vector-effect') === 'non-scaling-stroke';

  for (const property of FLATTENED_PROPERTIES) {
    const value = sourceStyle.getPropertyValue(property);
    if (!value) continue;

    if (pinnedStroke && property === 'stroke-width') {
      const width = Number.parseFloat(value);

      if (Number.isFinite(width)) {
        declarations.push(`stroke-width:${width * strokeScale}px`);
        continue;
      }
    }

    declarations.push(`${property}:${value}`);
  }

  if (isTextElement(clone)) {
    for (const property of TEXT_PROPERTIES) {
      const value = sourceStyle.getPropertyValue(property);
      if (value) declarations.push(`${property}:${value}`);
    }
  }

  clone.setAttribute('style', declarations.join(';'));
  clone.removeAttribute('class');

  const sourceChildren = Array.from(source.children);
  const cloneChildren = Array.from(clone.children);

  for (let i = 0; i < sourceChildren.length; i++) {
    flattenStyles(sourceChildren[i], cloneChildren[i], strokeScale);
  }
};

const toBase64 = (buffer: ArrayBuffer) => {
  const bytes = new Uint8Array(buffer);
  let binary = '';

  // Chunked, because spreading a large array into fromCharCode blows the call stack.
  for (let i = 0; i < bytes.length; i += 0x8000) {
    binary += String.fromCharCode(...bytes.subarray(i, i + 0x8000));
  }

  return btoa(binary);
};

let embeddedFont: string | null = null;

/**
 * The typeface, inlined into the exported document.
 *
 * Rasterizing goes through an `<img>`, which renders the SVG as an isolated document:
 * it cannot reach the page's web fonts, so without this the labels fall back to
 * whatever sans the machine happens to have and the picture stops matching the editor.
 */
const fontFaceCss = async () => {
  if (embeddedFont !== null) return embeddedFont;

  try {
    const response = await fetch(barlowRegular);
    const data = await response.arrayBuffer();

    embeddedFont = `@font-face{font-family:'Barlow';font-style:normal;font-weight:400;src:url(data:font/woff2;base64,${toBase64(data)}) format('woff2');}`;
  } catch {
    // A missing font is a cosmetic loss, never a failed export.
    embeddedFont = '';
  }

  return embeddedFont;
};

/**
 * Serializes the viewer, keeping its viewBox exactly as it is.
 *
 * Only `width` and `height` change, which is what makes this a screenshot rather than a
 * re-framing: the same drawing, at a different resolution. Sizing the SVG to the final
 * bitmap also makes it rasterize natively — drawing an `<img>` scaled up on a canvas
 * would rasterize at the intrinsic size first and stretch that, which is how vector art
 * ends up pixelated.
 */
const svgToString = (svg: SVGSVGElement, width: number, height: number, background: string | null, fontCss: string) => {
  const clone = svg.cloneNode(true) as SVGSVGElement;

  const rect = svg.getBoundingClientRect();
  // How much the raster magnifies the laid-out drawing.
  const strokeScale = rect.width > 0 ? width / rect.width : 1;

  flattenStyles(svg, clone, strokeScale);

  const viewBox = svg.getAttribute('viewBox') ?? `0 0 ${Math.round(rect.width)} ${Math.round(rect.height)}`;

  clone.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
  clone.setAttribute('xmlns:xlink', 'http://www.w3.org/1999/xlink');
  clone.setAttribute('width', `${width}`);
  clone.setAttribute('height', `${height}`);
  clone.setAttribute('viewBox', viewBox);
  // In the app the viewer may paint past its box; an exported figure wants clean bounds.
  clone.removeAttribute('overflow');
  // The live element fades itself in via opacity; an export must not inherit that.
  clone.style.opacity = '1';

  if (fontCss) {
    const style = document.createElementNS('http://www.w3.org/2000/svg', 'style');

    style.textContent = fontCss;
    clone.insertBefore(style, clone.firstChild);
  }

  if (background) {
    const [x, y, w, h] = viewBox.split(/[\s,]+/).map(Number);
    const rectEl = document.createElementNS('http://www.w3.org/2000/svg', 'rect');

    rectEl.setAttribute('x', `${x}`);
    rectEl.setAttribute('y', `${y}`);
    rectEl.setAttribute('width', `${w}`);
    rectEl.setAttribute('height', `${h}`);
    rectEl.setAttribute('fill', background);
    clone.insertBefore(rectEl, clone.firstChild);
  }

  return new XMLSerializer().serializeToString(clone);
};

const rasterize = async (markup: string, width: number, height: number) => {
  const url = URL.createObjectURL(new Blob([markup], { type: 'image/svg+xml;charset=utf-8' }));

  try {
    const image = new Image();
    image.width = width;
    image.height = height;

    await new Promise<void>((resolve, reject) => {
      image.onload = () => resolve();
      image.onerror = () => reject(new Error('Could not rasterize the drawing.'));
      image.src = url;
    });

    // Chrome resolves onload before the SVG is fully laid out often enough to matter.
    if (typeof image.decode === 'function') await image.decode().catch(() => undefined);

    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;

    const context = canvas.getContext('2d');
    if (!context) throw new Error('Canvas 2D context is unavailable.');

    // 1:1 with the rasterized source, so nothing is resampled.
    context.drawImage(image, 0, 0, width, height);

    return await new Promise<Blob>((resolve, reject) => {
      canvas.toBlob((blob) => (blob ? resolve(blob) : reject(new Error('Could not encode the PNG.'))), 'image/png');
    });
  } finally {
    URL.revokeObjectURL(url);
  }
};

/** Beyond these browsers start returning blank bitmaps. */
/** Absolute floor; the real minimum is worked out per model by `minimumExportSide`. */
export const MIN_EXPORT_SIDE = 64;

/** Structure left after the decorations have taken their room. Below this it is a smudge. */
export const MIN_STRUCTURE_PX = 160;

/**
 * Smallest canvas that can actually hold the drawing.
 *
 * An export fits everything it draws rather than reserving room for what it might draw,
 * so the only fixed cost is the margin on each side. What is left has to be enough for
 * the structure itself to read.
 */
export const minimumExportSide = (margin: number) => Math.ceil(2 * margin + MIN_STRUCTURE_PX);
export const MAX_EXPORT_SIDE = 12000;
export const MAX_EXPORT_PIXELS = 60e6;

export const clampExportSide = (value: number, minimum = MIN_EXPORT_SIDE) => {
  const floor = Math.max(MIN_EXPORT_SIDE, minimum);

  return Math.min(MAX_EXPORT_SIDE, Math.max(floor, Math.round(Number.isFinite(value) ? value : floor)));
};

export interface RenderOptions {
  /** Canvas width in pixels — the size the drawing is laid out for. */
  width: number;
  /** Canvas height in pixels. */
  height: number;
  /**
   * Bitmap pixels per layout pixel. The layout is untouched, so this is pure
   * resolution: 2 is the same drawing at print density, 0.25 is a preview thumbnail.
   */
  scale?: number;
  /** Painted behind the drawing; `null` keeps the PNG transparent. */
  background?: string | null;
}

const nextFrame = () => new Promise((resolve) => requestAnimationFrame(resolve));

/** The drawing SVG, once the component has given it a real viewBox. */
const findDrawing = (host: HTMLElement) =>
  Array.from(host.querySelectorAll('svg')).find((el) => {
    const box = (el.getAttribute('viewBox') ?? '').split(/[\s,]+/).map(Number);
    return box.length === 4 && box[2] > 0 && el.querySelector(':scope > g');
  }) as SVGSVGElement | undefined;

interface FittableViewer {
  fitContent?: () => unknown;
}

/** Matches the component's own post-mount `setTimeout(update, 100)`, with headroom. */
const SETTLE_MS = 180;

/**
 * Waits for the off-screen viewer to settle, then nudges it if it has not.
 *
 * The component runs its own `update()` — result diagram scales *and* the fit — on a
 * short timer after mount, so that has to be given its chance first; calling `fitContent`
 * ahead of it fits a drawing whose diagram scales are still unset. After that the fit is
 * retried, because the first attempt measures a host the browser has not laid out yet
 * and the component's resize observer only re-fits views that already fitted once.
 */
const settleFit = async (host: HTMLElement, instance: FittableViewer, attempts = 40) => {
  await new Promise((resolve) => setTimeout(resolve, SETTLE_MS));

  for (let i = 0; i < attempts; i++) {
    const svg = findDrawing(host);

    // `opacity` is the component's own signal that the fit has settled.
    if (svg && getComputedStyle(svg).opacity === '1') {
      // The marker definitions size themselves as `constant / scale`, and the fit that
      // just landed is what sets `scale`. Serializing before Vue has flushed that back
      // into the defs bakes in the previous zoom, and every marker — node dots, hinge
      // circles, arrowheads, and the stroke widths inside them, which ride the same
      // marker transform — comes out scaled by the ratio between the two.
      await nextTick();
      await nextFrame();

      return findDrawing(host) ?? svg;
    }

    await instance.fitContent?.();
    await nextFrame();
  }

  return findDrawing(host);
};

export const renderModelPng = async (
  viewer: Component,
  props: Record<string, unknown>,
  options: RenderOptions
): Promise<Blob> => {
  const width = clampExportSide(options.width);
  const height = clampExportSide(options.height);

  let scale = options.scale ?? 1;

  // Keep the bitmap within what browsers reliably allocate.
  const pixels = width * scale * (height * scale);
  if (pixels > MAX_EXPORT_PIXELS) scale *= Math.sqrt(MAX_EXPORT_PIXELS / pixels);

  const outputWidth = Math.max(1, Math.round(width * scale));
  const outputHeight = Math.max(1, Math.round(height * scale));

  const host = document.createElement('div');

  // Off screen but still laid out: `display: none` would leave every getBBox at zero.
  // Block, not flex: as a flex item the viewer would shrink to fit its content instead
  // of taking the canvas width, and the fit would measure that.
  host.style.cssText = [
    'position:fixed',
    'left:-100000px',
    'top:0',
    `width:${width}px`,
    `height:${height}px`,
    'display:block',
    'pointer-events:none',
    'opacity:0',
    'z-index:-1',
  ].join(';');

  document.body.appendChild(host);

  const app = createApp(viewer, { ...props, zoomEnabled: false });

  try {
    const instance = app.mount(host) as unknown as FittableViewer;

    const svg = await settleFit(host, instance);
    if (!svg) throw new Error('The off-screen viewer did not render.');

    const markup = svgToString(
      svg,
      outputWidth,
      outputHeight,
      options.background === undefined ? '#ffffff' : options.background,
      await fontFaceCss()
    );

    return await rasterize(markup, outputWidth, outputHeight);
  } finally {
    app.unmount();
    host.remove();
  }
};

export const canCopyImageToClipboard = () =>
  typeof ClipboardItem !== 'undefined' && typeof navigator !== 'undefined' && !!navigator.clipboard?.write;

export const downloadBlob = (blob: Blob, filename: string) => {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');

  anchor.href = url;
  anchor.download = filename;
  anchor.style.display = 'none';

  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);

  URL.revokeObjectURL(url);
};

export const copyBlobToClipboard = async (blob: Blob) => {
  await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]);
};
