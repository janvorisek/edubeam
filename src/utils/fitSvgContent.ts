import { nextTick } from 'vue';
import { centerBounds, type Bounds, type FitResult, type ViewBox } from './fitBounds';
import { fitRenderedContent, type FitContentOptions, type FitContentResult } from './fitContent';

/** The group holding the drawing: the first `<g>` directly under the `<svg>` (skips `<defs>`). */
export const findContentGroup = (svg: SVGElement): SVGGraphicsElement | null =>
  svg.querySelector<SVGGraphicsElement>(':scope > g');

/**
 * Bounding box of everything currently rendered inside `content`, in user (model)
 * units. `getBBox` forces a synchronous layout, so it already reflects any attribute
 * change made before the call.
 */
export const measureSvgContent = (content: SVGGraphicsElement | null, ignore?: string): Bounds | null => {
  if (!content) return null;

  // `getBBox` skips `display: none` subtrees, so hiding the ignored decorations for
  // the duration of the call measures everything else in one go.
  const hidden: { el: SVGElement; display: string }[] = [];

  if (ignore) {
    for (const el of Array.from(content.querySelectorAll<SVGElement>(ignore))) {
      hidden.push({ el, display: el.style.display });
      el.style.display = 'none';
    }
  }

  let box: DOMRect;

  try {
    box = content.getBBox();
  } catch {
    // Detached or not rendered - Firefox throws here.
    return null;
  } finally {
    for (const { el, display } of hidden) el.style.display = display;
  }

  // An empty group reports an all-zero box.
  if (box.width === 0 && box.height === 0 && box.x === 0 && box.y === 0) return null;

  return { minX: box.x, minY: box.y, maxX: box.x + box.width, maxY: box.y + box.height };
};

export interface SvgFitHost {
  svg: SVGElement;
  /**
   * Selector for decorations that must not drive the fit (result diagrams, loads).
   * Their pixel size is reserved through the padding instead, so toggling them on
   * or off leaves the view untouched.
   */
  ignore?: string;
  /** Show the view. The content is re-rendered for the new zoom before the fit continues. */
  apply: (fit: FitResult) => void;
  /** Whether this fit has been superseded (a newer fit started, the viewer unmounted). */
  isCancelled?: () => boolean;
}

/**
 * Fit the drawing inside an `<svg>` to its viewport.
 *
 * Runs all refinement steps back to back on the microtask queue: the intermediate
 * views are applied and re-rendered by Vue, but the browser never paints between
 * them, so only the final view is visible.
 */
export const fitSvgContent = async (
  host: SvgFitHost,
  options: Omit<FitContentOptions, 'viewportWidth' | 'viewportHeight'>
): Promise<FitContentResult | null> => {
  const { svg } = host;
  const content = findContentGroup(svg);

  if (!content) return null;

  return fitRenderedContent(
    {
      apply: async (fit) => {
        host.apply(fit);
        await nextTick();
      },
      measure: () => measureSvgContent(content, host.ignore),
      isCancelled: () => host.isCancelled?.() === true || !svg.isConnected,
    },
    {
      ...options,
      viewportWidth: svg.clientWidth,
      viewportHeight: svg.clientHeight,
    }
  );
};

/** ViewBox that keeps the current zoom and puts the rendered drawing in the middle. */
export const centerSvgContent = (svg: SVGElement, viewBox: ViewBox): ViewBox | null =>
  centerBounds(measureSvgContent(findContentGroup(svg)), viewBox);
