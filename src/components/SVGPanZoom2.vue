<script setup lang="ts">
import type { Bounds } from '@/utils/fitBounds';
import { centerSvgContent, fitSvgContent } from '@/utils/fitSvgContent';
import type { ViewBox } from '@/utils/fitBounds';
import type { FitContentResult } from '@/utils/fitContent';
import { nextTick, onMounted, onBeforeUnmount, ref } from 'vue';

const props = withDefaults(
  defineProps<{
    onUpdate: (zooming: boolean) => void;
    /** Screen pixels kept free on every side of the fitted content. */
    padding?: number;
    mobilePadding?: number;
    canFitContent?: boolean;
    /** Pure model-space bounds of the drawing (node coordinates); seeds the fit. */
    modelBounds?: () => Bounds | null;
    /** Selector for decorations excluded from the fit; `fitReserve` makes room for them. */
    fitIgnore?: string;
    /** Screen pixels guaranteed free around the geometry for the ignored decorations. */
    fitReserve?: number;
    panButton?: number;
    zoomEnabled?: boolean;
  }>(),
  {
    onUpdate: () => {},
    padding: 0,
    mobilePadding: 0,
    canFitContent: true,
    modelBounds: () => null,
    fitIgnore: '',
    fitReserve: 0,
    panButton: 4,
    zoomEnabled: true,
  }
);

let viewBox = { x: 0, y: 0, w: 0, h: 0 };
const scale = ref(1);
/** A fit has been shown at least once; the drawing can be revealed. */
const fitted = ref(false);
/** Keep the drawing fitted on viewport changes until the user pans or zooms. */
const autoFit = ref(true);

const touchPointer = ref({ x: 0, y: 0, ds: 0, move: false, pinch: false });

const onWindowResize = (): void => {
  if (!rootRef.value || !svgRef.value) return;

  if (rootRef.value!.offsetWidth === 0) return;

  const dX = rootRef.value!.offsetWidth - svgRef.value!.getBoundingClientRect().width;
  const dY = rootRef.value!.offsetHeight - svgRef.value!.getBoundingClientRect().height;

  svgRef.value!.setAttribute('width', rootRef.value!.offsetWidth.toString());
  svgRef.value!.setAttribute('height', rootRef.value!.offsetHeight.toString());

  viewBox.w = rootRef.value!.offsetWidth / scale.value;
  viewBox.h = rootRef.value!.offsetHeight / scale.value;

  viewBox.x -= dX / scale.value / 2;
  viewBox.y -= dY / scale.value / 2;

  updateMatrix(true);
};

const updateMatrix = (zooming = false): void => {
  const svgEl = svgRef.value as SVGElement;
  svgEl.setAttribute('viewBox', `${viewBox.x} ${viewBox.y} ${viewBox.w} ${viewBox.h}`);
  props.onUpdate(zooming);
};

const zoom = (mx: number, my: number, deltaY: number): void => {
  if (deltaY === 0 || !props.zoomEnabled) return;

  autoFit.value = false;

  const svgEl = svgRef.value as SVGElement;

  const w = viewBox.w;
  const h = viewBox.h;
  const dw = -w * deltaY;
  const dh = -h * deltaY;
  const dx = (dw * mx) / svgEl.clientWidth;
  const dy = (dh * my) / svgEl.clientHeight;
  viewBox = {
    x: viewBox.x + dx,
    y: viewBox.y + dy,
    w: viewBox.w - dw,
    h: viewBox.h - dh,
  };
  scale.value = svgEl.clientWidth / viewBox.w;

  updateMatrix(true);
};

const onMouseWheel = (event: WheelEvent): void => {
  zoom(event.offsetX, event.offsetY, Math.sign(event.deltaY) * 0.05);
};

const onTouchStart = (event: TouchEvent): void => {
  if (event.touches.length === 1) {
    touchPointer.value.x = event.touches[0].clientX;
    touchPointer.value.y = event.touches[0].clientY;

    touchPointer.value.move = true;
    touchPointer.value.pinch = false;
  }

  if (event.touches.length === 2) {
    touchPointer.value.ds = Math.hypot(
      event.touches[0].pageX - event.touches[1].pageX,
      event.touches[0].pageY - event.touches[1].pageY
    );

    const rootEl = rootRef.value as unknown as HTMLElement;
    const rect = rootEl.getBoundingClientRect();
    touchPointer.value.x = (event.touches[0].clientX + event.touches[1].clientX) / 2 - rect.left;
    touchPointer.value.y = (event.touches[0].clientY + event.touches[1].clientY) / 2 - rect.top;

    touchPointer.value.move = false;
    touchPointer.value.pinch = true;
  }
};

const onTouchEnd = (): void => {
  touchPointer.value.move = false;
  touchPointer.value.pinch = false;
};

const onTouchMove = (event: TouchEvent): void => {
  //console.log({ touchmove: event.touches.length, pointer: JSON.stringify(touchPointer) })
  if (event.touches.length === 1 && touchPointer.value.move) {
    autoFit.value = false;
    viewBox.x -= (event.touches[0].clientX - touchPointer.value.x) / scale.value;
    viewBox.y -= (event.touches[0].clientY - touchPointer.value.y) / scale.value;
    updateMatrix();

    touchPointer.value.x = event.touches[0].clientX;
    touchPointer.value.y = event.touches[0].clientY;
  }

  if (event.touches.length === 2 && touchPointer.value.pinch) {
    const distance = Math.hypot(
      event.touches[0].pageX - event.touches[1].pageX,
      event.touches[0].pageY - event.touches[1].pageY
    );

    zoom(touchPointer.value.x, touchPointer.value.y, Math.sign(touchPointer.value.ds - distance) * 0.025);

    touchPointer.value.ds = distance;
  }
};

const onMouseMove = (event: MouseEvent): void => {
  if (event.buttons !== props.panButton) return;

  autoFit.value = false;
  viewBox.x -= (event.movementX * 1) / scale.value;
  viewBox.y -= (event.movementY * 1) / scale.value;

  updateMatrix();
};

const centerContent = (): void => {
  if (!svgRef.value) return;

  const centered = centerSvgContent(svgRef.value, viewBox);
  if (!centered) return;

  viewBox = centered;
  updateMatrix(true);
};

let fitVersion = 0;

/**
 * Show exactly this box of the model — an AutoCAD "window" rather than a fit.
 *
 * The box is grown, centred, to the viewport's aspect ratio first: an `<svg>` letterboxes
 * a viewBox of a different shape, and then what is visible would be more than what was
 * asked for. Growing it here keeps `viewBox` the literal truth about the view. Counts as
 * fitted so the drawing is revealed, and cancels any fit still in flight.
 */
const setViewBox = (box: ViewBox): void => {
  const svgEl = svgRef.value as SVGSVGElement | null;
  if (!svgEl || !box.w || !box.h) return;

  fitVersion++;
  onWindowResize();

  const width = svgEl.clientWidth;
  const height = svgEl.clientHeight;
  if (!width || !height) return;

  const aspect = width / height;
  let { x, y, w, h } = box;

  if (w / h > aspect) {
    const grown = w / aspect;
    y -= (grown - h) / 2;
    h = grown;
  } else {
    const grown = h * aspect;
    x -= (grown - w) / 2;
    w = grown;
  }

  viewBox = { x, y, w, h };
  scale.value = width / w;
  fitted.value = true;
  autoFit.value = false;

  updateMatrix(true);
};

/**
 * Zoom and pan so that everything drawn - geometry, labels, loads and result
 * diagrams - fills the viewport minus the padding. Resolves once the final view is
 * shown; `false` when there was nothing to fit or a newer fit took over.
 */
const fitContent = async (): Promise<FitContentResult | null> => {
  const svgEl = svgRef.value as SVGSVGElement | null;

  if (!rootRef.value || !svgEl) return null;

  onWindowResize();

  if (!svgEl.clientWidth || !svgEl.clientHeight) return null;

  if (!props.canFitContent) {
    centerContent();
    return null;
  }

  const version = ++fitVersion;

  // Label widths change when the web font arrives; a fit measured before that lands
  // slightly off. Resolves immediately once loaded.
  if (typeof document !== 'undefined' && document.fonts?.ready) await document.fonts.ready;
  if (version !== fitVersion || svgRef.value !== svgEl) return null;

  const result = await fitSvgContent(
    {
      svg: svgEl,
      ignore: props.fitIgnore || undefined,
      apply: (fit) => {
        viewBox = { ...fit.viewBox };
        scale.value = fit.scale;
        updateMatrix(true);
      },
      isCancelled: () => version !== fitVersion || svgRef.value !== svgEl,
    },
    {
      padding: window.innerWidth > 768 ? props.padding : props.mobilePadding,
      reserve: props.fitReserve,
      modelBounds: props.modelBounds?.() ?? null,
      viewBox,
    }
  );

  if (result) {
    fitted.value = true;
    autoFit.value = true;
  }

  return result;
};

let resizewatcher: ResizeObserver;

onMounted(() => {
  nextTick(() => {
    // Default slot is the SVG
    svgRef.value! = rootRef.value!.children[0] as SVGElement;

    resizewatcher = new ResizeObserver(() => {
      if (autoFit.value && fitted.value) fitContent();
      else onWindowResize();
    });

    resizewatcher.observe(rootRef.value!);

    svgRef.value!.setAttribute('overflow', 'visible');
  });
});

onBeforeUnmount(() => {
  resizewatcher?.disconnect();
});

const onMouseDown = () => {
  //useAppStore().zooming = true;
};

const onMouseUp = () => {
  //useAppStore().zooming = false;
};

const rootRef = ref<HTMLElement | null>(null);
const svgRef = ref<SVGElement | null>(null);

defineExpose({ scale, fitted, centerContent, fitContent, setViewBox, updateMatrix, onWindowResize, zoom });
</script>

<template>
  <div
    ref="rootRef"
    class="w-100 fill-height"
    style="touch-action: none"
    @touchstart.prevent="onTouchStart"
    @touchmove.prevent="onTouchMove"
    @touchend.prevent="onTouchEnd"
    @wheel.prevent="onMouseWheel"
    @mousedown.prevent="onMouseDown"
    @mouseup.prevent="onMouseUp"
    @mousemove.prevent="onMouseMove"
    @contextmenu.prevent
  >
    <slot></slot>
  </div>
</template>
