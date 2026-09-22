/**
 * Draws the model to a picture people can drop into a report or slide.
 *
 * A throwaway viewer is mounted off screen at exactly the requested resolution and given
 * the editor's own settings — colours, font size, support size, result diagram height,
 * unit converters. It draws the structure for that canvas rather than the editor's, so
 * the output is a real drawing at that size instead of a rescaled one: stroke widths and
 * type come out at their true pixel sizes, because nothing is stretched afterwards.
 *
 * Both formats come off the same serializer. The markup it produces has to stand on its
 * own anyway — the PNG is rasterized through an `<img>`, which renders it as an isolated
 * document with no access to the page's stylesheets or web fonts — so every style is
 * flattened onto the elements and the typeface is inlined. A *file* of SVG needs all of
 * that and more, because its readers are not browsers: see `StyleMode` for what the
 * vector export additionally resolves before it is written out.
 */
import { createApp, h, nextTick, ref, shallowReactive, type Component } from 'vue';
import type { ViewBox } from './fitBounds';
// Barlow is the app's own typeface. Inlined into the bundle as a data URI at build time
// rather than fetched when an export happens: a runtime fetch has to cross the service
// worker and hit a hashed asset URL that may belong to an older build, and one failure
// used to leave every later export in the session without a font. A string constant
// cannot fail, and it embeds the same face whether or not the machine is online.
import barlowRegular from '@fontsource/barlow/files/barlow-latin-400-normal.woff2?inline';

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
 * Shapes drawn only to be clicked.
 *
 * The viewer lays a fat `stroke: transparent` line over every element, node and load so
 * there is something forgiving to grab with a mouse. `transparent` computes to
 * `rgba(0, 0, 0, 0)`, which is CSS: SVG 1.1's colour grammar has no `rgba()`, so a
 * renderer that only speaks that grammar discards the value and falls back to the
 * initial paint — black — and paints the hit target as a 24 px black slab across the
 * drawing. They carry no information a picture needs, so they are dropped outright
 * rather than translated; only the tags below, because a `<g>` or a `<use>` can be
 * invisible itself and still have visible content.
 */
const SHAPE_ELEMENTS = new Set(['path', 'polyline', 'polygon', 'rect', 'circle', 'ellipse', 'line']);

const MARKER_PROPERTIES = ['marker-start', 'marker-mid', 'marker-end'];

const RGBA_PATTERN = /^rgba?\(([^)]*)\)$/i;

/**
 * A computed paint, split into an SVG 1.1 colour and the opacity it was carrying.
 *
 * The alpha of an `rgba()` is folded into the matching `*-opacity`, which every renderer
 * understands, so nothing downstream has to parse a colour function it may not know.
 */
const paintOf = (style: CSSStyleDeclaration, property: 'fill' | 'stroke') => {
  const raw = style.getPropertyValue(property).trim();
  const declared = Number.parseFloat(style.getPropertyValue(`${property}-opacity`));
  const opacity = Number.isFinite(declared) ? declared : 1;

  const transparent = { color: 'none', opacity: 0 };

  if (!raw || raw === 'none') return transparent;

  const match = RGBA_PATTERN.exec(raw);
  if (!match) return { color: raw, opacity };

  // Handles both `rgba(0, 0, 0, 0)` and the space-separated `rgb(0 0 0 / 0%)` form.
  const parts = match[1].split(/[\s,/]+/).filter(Boolean);
  if (parts.length < 3) return { color: raw, opacity };

  const fourth = parts[3];
  const alpha = fourth === undefined ? 1 : fourth.endsWith('%') ? Number.parseFloat(fourth) / 100 : Number(fourth);

  if (!Number.isFinite(alpha) || alpha <= 0) return transparent;

  return { color: `rgb(${parts[0]}, ${parts[1]}, ${parts[2]})`, opacity: opacity * alpha };
};

const SVG_NS = 'http://www.w3.org/2000/svg';

/** `marker-start` / `-mid` / `-end`, in the order their vertices are visited. */
const MARKER_SLOTS = [
  { property: 'marker-start', at: 'start' },
  { property: 'marker-mid', at: 'mid' },
  { property: 'marker-end', at: 'end' },
] as const;

const pointsOf = (value: string) => {
  const numbers = value
    .trim()
    .split(/[\s,]+/)
    .map(Number);
  const points: [number, number][] = [];

  for (let i = 0; i + 1 < numbers.length; i += 2) {
    if (Number.isFinite(numbers[i]) && Number.isFinite(numbers[i + 1])) points.push([numbers[i], numbers[i + 1]]);
  }

  return points;
};

const degrees = (from: [number, number], to: [number, number]) => {
  const dx = to[0] - from[0];
  const dy = to[1] - from[1];

  // A zero-length segment has no direction; SVG calls that angle zero.
  return dx === 0 && dy === 0 ? 0 : (Math.atan2(dy, dx) * 180) / Math.PI;
};

/**
 * Markers redrawn as ordinary geometry.
 *
 * Everything the drawing puts on a vertex — load and reaction arrows, dimension tips,
 * node dots, supports with their hatching — is a `<marker>`, and Inkscape (what
 * `\includesvg` runs) draws the *filled* children of a marker and drops the *stroked*
 * ones: arrowheads arrive without shafts, support triangles without hatching, dimension
 * labels without the line. It also has every other way of disagreeing about markers —
 * `markerUnits`, `orient`, a `refX` outside the `viewBox`, a zero-length carrier — and
 * the app leans on all of them.
 *
 * So the reference is resolved here instead of being left as a promise: the marker's
 * content is copied to each vertex under the transform the spec prescribes, and the
 * `marker-*` properties are dropped. What comes out is the same picture expressed only
 * in shapes and transforms, which is the part of SVG nothing gets wrong.
 *
 * The group is inserted beside the carrier, so it has to *repeat* the carrier's own
 * `transform` — a sibling does not inherit it, and the carriers here are placed by one.
 * For a `strokeWidth` marker the scale is taken from the source element's width, which
 * is what the browser sized it against, not the converted width written to the clone.
 */
const inlineMarkers = (source: Element, clone: Element, sourceStyle: CSSStyleDeclaration, root: Element) => {
  const points = pointsOf(clone.getAttribute('points') ?? '');
  if (!points.length) return;

  const strokeWidth = Number.parseFloat(sourceStyle.getPropertyValue('stroke-width')) || 0;
  const placement = clone.getAttribute('transform') ?? '';
  const drawn: Element[] = [];

  for (const slot of MARKER_SLOTS) {
    const reference = /url\(\s*["']?#([^"')\s]+)/.exec(sourceStyle.getPropertyValue(slot.property));
    clone.removeAttribute(slot.property);
    if (!reference) continue;

    const marker = root.querySelector(`[id="${CSS.escape(reference[1])}"]`);
    if (!marker || marker.tagName !== 'marker') continue;

    const box = (marker.getAttribute('viewBox') ?? '').split(/[\s,]+/).map(Number);
    const width = Number(marker.getAttribute('markerWidth') ?? 3);
    const height = Number(marker.getAttribute('markerHeight') ?? 3);
    const refX = Number(marker.getAttribute('refX') ?? 0);
    const refY = Number(marker.getAttribute('refY') ?? 0);
    const orient = marker.getAttribute('orient') ?? '0';

    // `meet` with the default alignment: the centring offsets cancel against the
    // reference point, so only the uniform scale survives into the transform.
    let scale = box.length === 4 && box[2] > 0 && box[3] > 0 ? Math.min(width / box[2], height / box[3]) : 1;
    if ((marker.getAttribute('markerUnits') ?? 'strokeWidth') === 'strokeWidth') scale *= strokeWidth;

    if (!Number.isFinite(scale) || scale === 0) continue;

    const last = points.length - 1;
    const vertices =
      slot.at === 'start' ? [0] : slot.at === 'end' ? [last] : points.map((_, i) => i).slice(1, Math.max(1, last));

    for (const index of vertices) {
      const before = points[Math.max(0, index - 1)];
      const after = points[Math.min(last, index + 1)];

      let angle: number;

      if (orient === 'auto' || orient === 'auto-start-reverse') {
        angle =
          slot.at === 'mid'
            ? (degrees(before, points[index]) + degrees(points[index], after)) / 2
            : degrees(slot.at === 'start' ? points[index] : before, slot.at === 'start' ? after : points[index]);

        if (orient === 'auto-start-reverse' && slot.at === 'start') angle += 180;
      } else {
        angle = Number.parseFloat(orient) || 0;
      }

      const group = document.createElementNS(SVG_NS, 'g');
      const [x, y] = points[index];

      group.setAttribute(
        'transform',
        `${placement} translate(${trim(x)},${trim(y)}) rotate(${trim(angle)}) scale(${trim(scale)}) translate(${trim(-refX)},${trim(-refY)})`.trim()
      );

      for (const child of Array.from(marker.children)) group.appendChild(child.cloneNode(true));

      drawn.push(group);
    }
  }

  // Markers paint over the shape that carries them.
  for (const group of drawn) clone.after(group);
};

/**
 * The white plate behind a result label, as a rectangle instead of a filter.
 *
 * The viewer draws it by giving a duplicate of the label a `feFlood` filter, which
 * turns the whole text box into a translucent white block that the real label then
 * sits on. Filters are SVG's least portable corner: Inkscape composites this one *over*
 * the label instead of under it and the numbers come out washed to grey. The plate is
 * just a box, so it is written as one — sized from the label's measured bounds, with
 * the filter's own 2.5 % of side padding — and the filter reference goes.
 */
const plateToRect = (source: Element, clone: Element, sourceStyle: CSSStyleDeclaration) => {
  const filter = /url\(\s*["']?#([^"')\s]+)/.exec(sourceStyle.getPropertyValue('filter'));
  if (!filter) return;

  const text = source as SVGGraphicsElement;
  if (typeof text.getBBox !== 'function') return;

  let box: DOMRect;

  try {
    box = text.getBBox();
  } catch {
    return;
  }

  if (!(box.width > 0) || !(box.height > 0)) return;

  const rect = document.createElementNS(SVG_NS, 'rect');
  const pad = box.width * 0.025;

  rect.setAttribute('x', String(trim(box.x - pad)));
  rect.setAttribute('y', String(trim(box.y)));
  rect.setAttribute('width', String(trim(box.width + 2 * pad)));
  rect.setAttribute('height', String(trim(box.height)));
  rect.setAttribute('fill', '#ffffff');
  rect.setAttribute('fill-opacity', '0.8');
  rect.setAttribute('stroke', 'none');

  const transform = clone.getAttribute('transform');
  if (transform) rect.setAttribute('transform', transform);

  clone.replaceWith(rect);
};

/**
 * `<line>` rewritten as the equivalent `<path>`.
 *
 * Every arrow in the drawing is a `<polyline>` head over a `<line>` shaft, and in at
 * least one SVG→PDF converter the heads arrive and the shafts do not — with identical
 * stroke, width and colour on both, serialized in the same pass, so the tag itself is
 * the only thing left that distinguishes them. `<path>` is the one geometry element
 * nothing has ever had trouble with, and the two are exactly equivalent here, so the
 * shafts are simply written in the form that always survives.
 */
const LINE_GEOMETRY = ['x1', 'y1', 'x2', 'y2'];

const lineToPath = (clone: Element) => {
  const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  const coordinate = (name: string) => Number(clone.getAttribute(name) ?? 0) || 0;

  for (const attribute of Array.from(clone.attributes)) {
    if (!LINE_GEOMETRY.includes(attribute.name)) path.setAttribute(attribute.name, attribute.value);
  }

  path.setAttribute('d', `M ${coordinate('x1')},${coordinate('y1')} L ${coordinate('x2')},${coordinate('y2')}`);
  clone.replaceWith(path);
};

/**
 * Vertical text alignment, turned into a coordinate.
 *
 * The viewer centres labels on their anchor with `dominant-baseline="central"` (or
 * `middle`). Renderers older than SVG 2 ignore the property and drop the baseline
 * straight onto `y`, which lifts every label by half its height — node and element
 * labels float above the thing they name.
 *
 * The offset is taken from the element's own bounding box, measured once as it stands
 * and once forced back to an alphabetic baseline: the difference is exactly what the
 * property was contributing. (`getStartPositionOfChar` looks like the direct way to ask
 * and is not — it reports the anchor unchanged whatever the baseline is set to.)
 *
 */
const bakeBaseline = (source: Element, clone: Element) => {
  const text = source as SVGTextElement;

  if (typeof text.getBBox !== 'function' || !text.getNumberOfChars?.()) return;

  let shift: number;

  try {
    const positioned = text.getBBox().y;

    // The live viewer is a throwaway mounted for this export, so it can be nudged and
    // put back; nothing else reads it and the property affects only this element.
    const previous = text.style.dominantBaseline;

    text.style.dominantBaseline = 'alphabetic';
    const alphabetic = text.getBBox().y;
    text.style.dominantBaseline = previous;

    shift = positioned - alphabetic;
  } catch {
    // Text the browser could not lay out has no position to copy.
    return;
  }

  if (!Number.isFinite(shift)) return;

  // Whatever `dy` the element already carried still has to apply on top.
  const existing = text.dy?.baseVal?.numberOfItems ? text.dy.baseVal.getItem(0).value : 0;

  clone.setAttribute('dy', String(trim(existing + shift)));
  clone.removeAttribute('dominant-baseline');
  clone.removeAttribute('alignment-baseline');
};

/**
 * How the flattened appearance is written onto the clone.
 *
 * `css` keeps every declaration in one `style` attribute — compact, and exactly what the
 * browser reads back when it rasterizes, so it is what the PNG path feeds to `<img>`.
 * `attributes` writes each one as a presentation attribute instead, and is what every SVG
 * *file* is written in: the readers a file meets — Word's importer, the Inkscape behind
 * LaTeX's `\includesvg` — range from unreliable to indifferent about CSS, markers and
 * filters, so that mode also resolves all three into plain SVG 1.1 geometry.
 */
type StyleMode = 'css' | 'attributes';

/** Properties whose values are lengths, so `px` suffixes and scaling both apply. */
const LENGTH_PROPERTIES = new Set(['stroke-width', 'stroke-dasharray', 'stroke-dashoffset']);

/** Enough digits for a metre-scale drawing without writing out float noise. */
const trim = (value: number) => Number(value.toPrecision(6));

/**
 * Multiplies every number in a length or length list, dropping the `px` suffixes.
 *
 * Anything that is not a plain list of numbers — `none`, a percentage — is left alone,
 * because scaling it would be a guess.
 */
const scaleLengths = (value: string, factor: number) => {
  const parts = value.trim().split(/[\s,]+/);
  const numbers = parts.map((part) => Number.parseFloat(part));

  if (!numbers.every((n, i) => Number.isFinite(n) && /^-?[\d.]+(px)?$/.test(parts[i]))) return value;

  return numbers.map((n) => trim(n * factor)).join(' ');
};

const stripUnits = (value: string) => scaleLengths(value, 1);

/**
 * `url("#id")` written back the way SVG 1.1 spells it, as `url(#id)`.
 *
 * Every reference here — markers, the label filter — is read off `getComputedStyle`,
 * which hands back the CSS form with the IRI quoted. CSS allows that; the `<FuncIRI>`
 * grammar a presentation attribute is parsed with does not, so a strict reader resolves
 * the reference to nothing and drops the marker or filter without complaint. Chrome and
 * Word are lenient, which is why this only shows up once the file leaves them.
 */
const unquoteUrls = (value: string) => value.replace(/url\(\s*(['"])(.*?)\1\s*\)/g, 'url($2)');

/**
 * Viewport pixels per user unit for this element, measured on the live drawing.
 *
 * `getCTM` returns null for anything the browser does not lay out — the contents of
 * `<defs>`, chiefly — and the root's own scale is the closest thing to an answer for
 * those, since a `<use>` paints them in the user space of wherever it stands.
 */
const localScale = (element: Element, rootScale: number) => {
  const matrix = (element as SVGGraphicsElement).getCTM?.();
  if (!matrix) return rootScale;

  const determinant = Math.abs(matrix.a * matrix.d - matrix.b * matrix.c);

  return determinant > 0 ? Math.sqrt(determinant) : rootScale;
};

interface FlattenContext {
  mode: StyleMode;
  /** The cloned root, so a marker reference can be resolved without touching the page. */
  root: Element;
  /** Viewport pixels per user unit at the root, the fallback for unmeasurable elements. */
  rootScale: number;

  /**
   * Raster magnification, for `css` mode only: how much bigger the bitmap is than the
   * laid-out drawing.
   */
  strokeScale: number;
}

/**
 * Copies computed appearance onto the clone, in document order.
 *
 * Both trees are walked with the same filter so the two node lists stay index-aligned;
 * hidden subtrees are dropped from the clone entirely rather than exported invisible.
 */
const flattenStyles = (source: Element, clone: Element, context: FlattenContext) => {
  const sourceStyle = getComputedStyle(source);

  if (sourceStyle.display === 'none' || sourceStyle.visibility === 'hidden') {
    clone.remove();
    return;
  }

  const fill = paintOf(sourceStyle, 'fill');
  const stroke = paintOf(sourceStyle, 'stroke');

  /**
   * Marker and symbol content stands in a coordinate system of its own.
   *
   * A marker sizes itself as `markerWidth = constant / scale` over a fixed `viewBox`, so
   * one unit inside it already works out to roughly one pixel however far the drawing is
   * zoomed — the marker does by hand what `non-scaling-stroke` does for everything else.
   * The root's scale says nothing about that space, so neither the width conversion below
   * nor the paint test above may be applied to anything in here.
   */
  const inDefs = !!source.closest('defs');

  // Painting nothing and marking nothing: a hit target, and the export is not clickable.
  // A filter is checked too, because `feFlood` draws a plate whatever the source paints.
  const invisible =
    SHAPE_ELEMENTS.has(clone.tagName) &&
    clone.children.length === 0 &&
    fill.opacity === 0 &&
    stroke.opacity === 0 &&
    sourceStyle.getPropertyValue('filter') === 'none' &&
    !MARKER_PROPERTIES.some((property) => {
      const value = sourceStyle.getPropertyValue(property);

      return value && value !== 'none';
    }) &&
    // Nothing in `<defs>` is judged on how it looks where it stands: a marker or symbol
    // is painted at the `<use>` that references it, and this style is the defs context.
    !inDefs;

  if (invisible) {
    clone.remove();
    return;
  }

  const pinned = sourceStyle.getPropertyValue('vector-effect') === 'non-scaling-stroke';

  // `non-scaling-stroke` pins the stroke to viewport pixels, so it is the one thing that
  // does *not* grow when the same drawing is rasterized at a higher resolution: geometry,
  // type and markers all double while these stay put and come out half weight. Scaling
  // them here by hand keeps every line in proportion.
  const magnify = context.mode === 'css' && pinned && context.strokeScale !== 1;

  /**
   * Resolving the pin into a plain user-space width, for consumers that have never
   * heard of `vector-effect`.
   *
   * The drawing is laid out in metres — node coordinates go into the SVG as they are —
   * so a renderer that ignores the pin reads `stroke-width:2px` as two *metres* and
   * paints the structure as a slab. Dividing by the element's own scale converts the
   * pinned width into the user units it is standing in, which every renderer reads the
   * same way. It also means the strokes now grow with the figure when someone resizes
   * it in a document, which is what a vector figure should do.
   */
  const unpin = context.mode === 'attributes' && pinned ? 1 / localScale(source, context.rootScale) : 0;

  const declarations: [string, string][] = [];

  const properties = isTextElement(clone) ? [...FLATTENED_PROPERTIES, ...TEXT_PROPERTIES] : FLATTENED_PROPERTIES;

  for (const property of properties) {
    // Pins are resolved into concrete widths below, so the property has no work left to
    // do — and leaving it in would re-pin the stroke for the renderers that do read it.
    if (context.mode === 'attributes' && property === 'vector-effect') {
      // Not enough to stop writing it: the viewer authors `vector-effect` as a literal
      // attribute in its templates, so it rides along in the clone unless taken out.
      // Left there it would re-pin a width that has already been divided down into user
      // units, and any renderer that honours the property draws a hairline or nothing.
      clone.removeAttribute('vector-effect');
      continue;
    }

    const value = sourceStyle.getPropertyValue(property);
    if (!value) continue;

    // Only the width, deliberately: the dash pattern is pinned the same way, but the
    // raster path is what the PNG export has always used and is not worth disturbing.
    if (magnify && property === 'stroke-width') {
      const parsed = Number.parseFloat(value);

      // Stays a CSS length: this is the string the browser reads back, and it has been
      // rasterizing correctly as one.
      if (Number.isFinite(parsed)) {
        declarations.push([property, `${trim(parsed * context.strokeScale)}px`]);
        continue;
      }
    }

    if (unpin && LENGTH_PROPERTIES.has(property)) {
      declarations.push([property, scaleLengths(value, unpin)]);
      continue;
    }

    if (context.mode === 'attributes') {
      // Colour functions SVG 1.1 has never heard of, resolved into what it has: a plain
      // `rgb()` and an opacity. Browsers read either, so `css` mode keeps the original.
      const portable =
        property === 'fill'
          ? fill.color
          : property === 'stroke'
            ? stroke.color
            : property === 'fill-opacity'
              ? String(trim(fill.opacity))
              : property === 'stroke-opacity'
                ? String(trim(stroke.opacity))
                : stripUnits(value);

      declarations.push([property, unquoteUrls(portable)]);
      continue;
    }

    declarations.push([property, value]);
  }

  if (context.mode === 'attributes') {
    // The live element may carry its own inline styles — the marker custom properties,
    // the fade-in opacity — and a `style` attribute outranks every presentation
    // attribute written beside it, so it has to go rather than be left to win.
    clone.removeAttribute('style');

    for (const [property, value] of declarations) clone.setAttribute(property, value);

    if (clone.tagName === 'text') {
      bakeBaseline(source, clone);
      plateToRect(source, clone, sourceStyle);
    }
    if (clone.tagName === 'polyline') inlineMarkers(source, clone, sourceStyle, context.root);
    if (clone.tagName === 'line') lineToPath(clone);
  } else {
    clone.setAttribute('style', declarations.map(([property, value]) => `${property}:${value}`).join(';'));
  }

  clone.removeAttribute('class');

  const sourceChildren = Array.from(source.children);
  const cloneChildren = Array.from(clone.children);

  for (let i = 0; i < sourceChildren.length; i++) {
    flattenStyles(sourceChildren[i], cloneChildren[i], context);
  }
};

/**
 * The typeface, inlined into the exported document.
 *
 * Rasterizing goes through an `<img>`, which renders the SVG as an isolated document:
 * it cannot reach the page's web fonts, so without this the labels fall back to
 * whatever sans the machine happens to have and the picture stops matching the editor.
 * An SVG file is in the same position on someone else's machine, only more so — it may
 * be opened somewhere Barlow was never installed.
 */
const fontFaceCss = () =>
  `@font-face{font-family:'Barlow';font-style:normal;font-weight:400;src:url(${barlowRegular}) format('woff2');}`;

/**
 * Serializes the viewer, keeping its viewBox exactly as it is.
 *
 * Only `width` and `height` change, which is what makes this a screenshot rather than a
 * re-framing: the same drawing, at a different resolution. Sizing the SVG to the final
 * bitmap also makes it rasterize natively — drawing an `<img>` scaled up on a canvas
 * would rasterize at the intrinsic size first and stretch that, which is how vector art
 * ends up pixelated.
 */
const svgToString = (
  svg: SVGSVGElement,
  width: number,
  height: number,
  background: string | null,
  fontCss: string,
  mode: StyleMode = 'css'
) => {
  const clone = svg.cloneNode(true) as SVGSVGElement;

  const rect = svg.getBoundingClientRect();
  // How much the raster magnifies the laid-out drawing.
  const strokeScale = rect.width > 0 ? width / rect.width : 1;

  const viewBox = svg.getAttribute('viewBox') ?? `0 0 ${Math.round(rect.width)} ${Math.round(rect.height)}`;
  const [x, y, w, h] = viewBox.split(/[\s,]+/).map(Number);

  flattenStyles(svg, clone, {
    mode,
    root: clone,
    strokeScale,
    rootScale: w > 0 && rect.width > 0 ? rect.width / w : 1,
  });

  clone.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
  clone.setAttribute('xmlns:xlink', 'http://www.w3.org/1999/xlink');
  clone.setAttribute('width', `${width}`);
  clone.setAttribute('height', `${height}`);
  clone.setAttribute('viewBox', viewBox);
  // In the app the viewer may paint past its box; an exported figure wants clean bounds.
  clone.removeAttribute('overflow');
  // The live element fades itself in via opacity; an export must not inherit that.
  clone.setAttribute('opacity', '1');
  // In `css` mode the flattened `style` attribute outranks the one above, so it needs
  // overriding there too.
  if (mode === 'css') clone.style.opacity = '1';

  if (fontCss) {
    const style = document.createElementNS('http://www.w3.org/2000/svg', 'style');

    style.textContent = fontCss;
    clone.insertBefore(style, clone.firstChild);
  }

  if (background) {
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

/** Standalone files get the declaration; the string handed to `<img>` does not need it. */
const XML_PROLOG = '<?xml version="1.0" encoding="UTF-8" standalone="no"?>\n';

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

const nextFrame = () => new Promise((resolve) => requestAnimationFrame(resolve));

/** The drawing SVG, once the component has given it a real viewBox. */
const findDrawing = (host: ParentNode) =>
  Array.from(host.querySelectorAll('svg')).find((el) => {
    const box = (el.getAttribute('viewBox') ?? '').split(/[\s,]+/).map(Number);
    return box.length === 4 && box[2] > 0 && el.querySelector(':scope > g');
  }) as SVGSVGElement | undefined;

/** What the viewer component exposes; all optional so a foreign viewer degrades to a plain render. */
interface ExportViewer {
  fitContent?: () => Promise<unknown>;
  setView?: (box: ViewBox) => void;
  update?: () => void;
}

/** How far, in canvas pixels, the drawing runs past each edge of the canvas. */
export interface Overflow {
  left: number;
  right: number;
  top: number;
  bottom: number;
}

export interface UpdateInfo {
  /**
   * Set when a fit could not honour the drawing: something runs past the canvas edge
   * by this many pixels. Measured against the drawing the fit was asked to fit — with
   * `fitWith`, that is the full drawing, whatever is currently shown.
   */
  overflow: Overflow | null;
}

/** White unless the caller asked for transparency; `undefined` is not a choice. */
const backgroundOf = (options: { background?: string | null }) =>
  options.background === undefined ? '#ffffff' : options.background;

export interface PngOptions {
  /**
   * Bitmap pixels per layout pixel. The layout is untouched, so this is pure
   * resolution: 2 is the same drawing at print density, 0.25 is a preview thumbnail.
   */
  scale?: number;
  /** Painted behind the drawing; `null` leaves it transparent. */
  background?: string | null;
}

export type SvgOptions = Pick<PngOptions, 'background'>;

/**
 * One off-screen viewer, kept for as long as whoever asked for it needs pictures.
 *
 * Earlier every preview mounted a fresh viewer, waited out its post-mount timer, polled
 * for it to settle and tore it down — a fixed few hundred milliseconds per render at
 * best, and a forty-attempt retry loop at worst. Here the viewer is mounted once; a
 * change of layer or size is a prop change and one awaited fit, the way the editor
 * itself works. `update` calls are queued so a fast run of clicks lays out in order and
 * the last one wins.
 */
export interface ExportRenderer {
  /**
   * Re-lay out for these props at this canvas size; resolves once the drawing is shown.
   * With a `window` the view is exactly that model-space box (grown to the canvas
   * aspect). Without one the drawing is fitted — to `fitWith` when given: the fit is
   * measured with *those* props and the view it finds is then shown with `props`. That is
   * how a fit can be made independent of what is toggled on: fit with every layer, show
   * the chosen ones, and the frame is the same whichever they are.
   */
  update(
    props: Record<string, unknown>,
    width: number,
    height: number,
    window?: ViewBox | null,
    fitWith?: Record<string, unknown> | null
  ): Promise<UpdateInfo>;
  /** The model-space box the current layout shows — the fitted one, or the window as grown. */
  viewBox(): ViewBox | null;
  /** The current layout as a bitmap. */
  png(options?: PngOptions): Promise<Blob>;
  /** The current layout as a standalone SVG file. */
  svg(options?: SvgOptions): Promise<Blob>;
  dispose(): void;
}

/**
 * The page's stylesheets, copied into a shadow root.
 *
 * Styles do not cross a shadow boundary, and the viewer needs the page's — Vuetify's
 * layout classes, the global drawing rules, its own scoped rules — so each document
 * sheet is re-created as a constructed sheet and adopted. Cross-origin sheets refuse to
 * expose their rules and are skipped; the web font link is one of those, which is fine,
 * because fonts are document-scoped and reach shadow trees anyway. `@font-face` and
 * `@import` are dropped for the same reason and because constructed sheets reject the
 * latter.
 */
const adoptDocumentStyles = (shadow: ShadowRoot) => {
  const sheets: CSSStyleSheet[] = [];

  for (const sheet of Array.from(document.styleSheets)) {
    let rules: CSSRule[];

    try {
      rules = Array.from(sheet.cssRules);
    } catch {
      continue;
    }

    const text = rules
      .filter((rule) => !(rule instanceof CSSFontFaceRule) && !(rule instanceof CSSImportRule))
      .map((rule) => rule.cssText)
      .join('\n');

    if (!text) continue;

    const copy = new CSSStyleSheet();
    copy.replaceSync(text);
    sheets.push(copy);
  }

  shadow.adoptedStyleSheets = sheets;
};

export const createExportRenderer = (viewer: Component): ExportRenderer => {
  const host = document.createElement('div');

  // Off screen but still laid out: `display: none` would leave every getBBox at zero.
  host.style.cssText = [
    'position:fixed',
    'left:-100000px',
    'top:0',
    'width:0px',
    'height:0px',
    'display:block',
    'pointer-events:none',
    'opacity:0',
    'z-index:-1',
  ].join(';');

  // The viewer lives in a closed shadow root: a few hundred SVG nodes appearing in the
  // page is a DOM mutation, and browser extensions that rescan the page on every
  // mutation walk into them — 1Password's content script recursed through this tree
  // until its stack overflowed, freezing the page for seconds on every render. Nothing
  // outside the page's own scripts can see into a closed shadow root, so the viewer is
  // simply not there for them. `findDrawing` and the styles work through the root.
  const shadow = host.attachShadow({ mode: 'closed' });

  adoptDocumentStyles(shadow);

  // Block, not flex: as a flex item the viewer would shrink to fit its content instead
  // of taking the canvas width, and the fit would measure that.
  const mountPoint = document.createElement('div');
  mountPoint.style.cssText = 'display:block;width:100%;height:100%';
  shadow.appendChild(mountPoint);

  document.body.appendChild(host);

  const state = shallowReactive({ props: {} as Record<string, unknown> });
  const instance = ref<ExportViewer | null>(null);

  // Mounted on the first `update`, not here: the component sets up watchers on its
  // props as it mounts, and mounting it before there is a solver to watch leaves those
  // watching `undefined` for good (and Vue says so, loudly).
  let app: ReturnType<typeof createApp> | null = null;

  const mount = () => {
    app = createApp({
      setup: () => () => h(viewer, { ...state.props, zoomEnabled: false, ref: instance }),
    });

    app.mount(mountPoint);
  };

  let width = 0;
  let height = 0;
  let queue: Promise<unknown> = Promise.resolve();

  /**
   * Where the last fit landed, and where the next one starts.
   *
   * A fit is iterative and, when the decorations outweigh the canvas, it does not
   * converge: it ends in one of two fallbacks, and which one depends on the view it
   * started from. Left to itself the start drifts — the component's own watchers kick
   * off fits of their own whenever its props change — and the frame jumps between the
   * two. Starting every fit from the previous result, applied explicitly (which also
   * supersedes those stray fits), makes the outcome a function of the drawing alone; a
   * result within half a percent of the start is snapped back to it, so a fit that
   * merely re-derives its own start cannot creep.
   */
  let seed: ViewBox | null = null;

  const nearly = (a: ViewBox, b: ViewBox) => {
    const tolerance = 0.005 * Math.max(a.w, b.w);

    return [a.x - b.x, a.y - b.y, a.w - b.w, a.h - b.h].every((d) => Math.abs(d) <= tolerance);
  };

  /**
   * Where the time goes, on the dev build only.
   *
   * Reported as one line per `update` so a slow open can be read straight off the
   * console: which phase is synchronous and long is the whole diagnosis, and a stopwatch
   * on someone else's machine is the only way to get it.
   */
  const timings: Record<string, number> = {};
  const timed = async <T>(phase: string, work: () => Promise<T> | T) => {
    const started = performance.now();
    const result = await work();
    timings[phase] = Math.round(performance.now() - started);
    return result;
  };

  const fit = async (window: ViewBox | null) => {
    const target = instance.value;
    if (!target?.fitContent) throw new Error('The off-screen viewer did not render.');

    // The component sizes its result diagrams in `update()`, which it runs on a timer
    // after mount and from watchers on the show* props. Running it here makes sure the
    // fit that follows measures diagrams at their final scale, whichever path we are on.
    await timed('scales', () => target.update?.());

    if (window && target.setView) {
      // A window is not fitted, it is shown: one synchronous view change. Shown twice, a
      // frame apart: changing the props starts the component's own fit from its watchers,
      // and although the view change cancels it, the second application makes sure the
      // window is what is on screen whatever else may have landed in between.
      await timed('fit', async () => {
        target.setView?.(window);
        await nextFrame();
        target.setView?.(window);
      });
    } else {
      const fitOnce = async () => {
        // `false` means another fit superseded this one — the component's own resize
        // observer, or its post-mount timer — and is still landing. Let it, then fit
        // again; the one that reports `true` is the view actually on screen.
        for (let attempt = 0; attempt < 6; attempt++) {
          timings.fitAttempts = attempt + 1;
          if ((await target.fitContent()) !== null) break;
          await nextFrame();
        }

        return viewBox();
      };

      await timed('fit', async () => {
        // Fit from the seed; where it lands becomes the seed for next time. The first
        // fit has no seed and starts wherever the component happens to be, so it is
        // repeated from its own result until that stops moving — the frame a dialog
        // opens with is then the same one every later toggle gets.
        for (let round = 0; round < 3; round++) {
          if (seed && target.setView) target.setView(seed);

          const landed = await fitOnce();
          if (!landed) break;

          if (seed && nearly(landed, seed)) {
            target.setView?.(seed);
            break;
          }

          seed = landed;
        }
      });
    }

    // The marker definitions size themselves as `constant / scale`, and the fit that
    // just landed is what sets `scale`. Serializing before Vue has flushed that back
    // into the defs bakes in the previous zoom.
    await timed('flush', async () => {
      await nextTick();
      await nextFrame();
    });
  };

  const update = (
    props: Record<string, unknown>,
    nextWidth: number,
    nextHeight: number,
    window: ViewBox | null = null,
    fitWith: Record<string, unknown> | null = null
  ) => {
    const run = async () => {
      const started = performance.now();

      if (nextWidth !== width || nextHeight !== height) {
        width = nextWidth;
        height = nextHeight;
        host.style.width = `${width}px`;
        host.style.height = `${height}px`;
      }

      if (!app) await timed('mount', mount);

      let mode = window ? 'window' : 'fit';
      let overflow: Overflow | null = null;

      if (!window && fitWith) {
        // Fit the full drawing, then show the chosen layers in the view it found.
        state.props = fitWith;
        await timed('render', () => nextTick());
        await fit(null);
        overflow = measureOverflow();

        const found = viewBox();
        mode = found ? 'fit-all' : 'fit-all(no box)';

        state.props = props;
        await timed('render', () => nextTick());
        await fit(found);
      } else {
        state.props = props;
        await timed('render', () => nextTick());
        await fit(window);
        if (!window) overflow = measureOverflow();
      }

      if (import.meta.env.DEV) {
        const box = viewBox();
        const svg = findDrawing(shadow);
        const viewBoxText = box ? [box.x, box.y, box.w, box.h].map((n) => Math.round(n * 1000) / 1000).join(' ') : null;

        console.debug(
          `[export] update ${Math.round(performance.now() - started)} ms ${mode} viewBox=[${viewBoxText}]`,
          {
            ...timings,
            overflow,
            viewBox: viewBoxText,
            svgSize: svg
              ? `${svg.getAttribute('width')}x${svg.getAttribute('height')} client ${svg.clientWidth}x${svg.clientHeight}`
              : null,
            aspect: box ? Math.round((box.w / box.h) * 1000) / 1000 : null,
          }
        );
      }

      return { overflow } as UpdateInfo;
    };

    const result = queue.then(run, run);

    // The chain must survive a failed run, or every later update would fail with it.
    queue = result.then(
      () => undefined,
      () => undefined
    );

    return result;
  };

  const drawing = () => {
    const svg = findDrawing(shadow);
    if (!svg) throw new Error('The off-screen viewer did not render.');

    return svg;
  };

  /**
   * What runs past the canvas, in canvas pixels, for the drawing currently laid out.
   *
   * Measured directly — the drawing's bounding box against the view — rather than read
   * off the fit's own flags, because it is the plain truth about clipping: anything
   * past an edge by more than a pixel will be cut off in the file.
   */
  const measureOverflow = (): Overflow | null => {
    const svg = findDrawing(shadow);
    const box = viewBox();
    const content = svg?.querySelector<SVGGraphicsElement>(':scope > g');
    if (!svg || !box || !content) return null;

    let bounds: DOMRect;

    try {
      bounds = content.getBBox();
    } catch {
      return null;
    }

    const scale = svg.clientWidth / box.w;
    const past = (px: number) => (px > 1 ? Math.ceil(px) : 0);

    const overflow = {
      left: past((box.x - bounds.x) * scale),
      top: past((box.y - bounds.y) * scale),
      right: past((bounds.x + bounds.width - box.x - box.w) * scale),
      bottom: past((bounds.y + bounds.height - box.y - box.h) * scale),
    };

    return overflow.left || overflow.right || overflow.top || overflow.bottom ? overflow : null;
  };

  const viewBox = (): ViewBox | null => {
    const svg = findDrawing(shadow);
    if (!svg) return null;

    const [x, y, w, h] = (svg.getAttribute('viewBox') ?? '').split(/[\s,]+/).map(Number);

    return [x, y, w, h].every(Number.isFinite) && w > 0 && h > 0 ? { x, y, w, h } : null;
  };

  const png = async (options: PngOptions = {}) => {
    let scale = options.scale ?? 1;

    // Keep the bitmap within what browsers reliably allocate.
    const pixels = width * scale * (height * scale);
    if (pixels > MAX_EXPORT_PIXELS) scale *= Math.sqrt(MAX_EXPORT_PIXELS / pixels);

    const outputWidth = Math.max(1, Math.round(width * scale));
    const outputHeight = Math.max(1, Math.round(height * scale));

    const markup = await timed('serialize', () =>
      svgToString(drawing(), outputWidth, outputHeight, backgroundOf(options), fontFaceCss())
    );
    const blob = await timed('rasterize', () => rasterize(markup, outputWidth, outputHeight));

    if (import.meta.env.DEV) {
      console.debug(`[export] png ${outputWidth}x${outputHeight}`, {
        serialize: timings.serialize,
        rasterize: timings.rasterize,
        bytes: markup.length,
      });
    }

    return blob;
  };

  /**
   * The file is written in `attributes` mode, assuming nothing of the reader beyond SVG
   * 1.1 — see `StyleMode`. There is no `scale`: a vector file has no resolution to
   * choose, so it is sized at the canvas the drawing was laid out for.
   */
  const svg = async (options: SvgOptions = {}) => {
    const markup = svgToString(drawing(), width, height, backgroundOf(options), fontFaceCss(), 'attributes');

    return new Blob([XML_PROLOG, markup], { type: 'image/svg+xml;charset=utf-8' });
  };

  const dispose = () => {
    app?.unmount();
    host.remove();
  };

  return { update, viewBox, png, svg, dispose };
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
