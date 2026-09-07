<script setup lang="ts">
import type { Bounds } from '@/utils/fitBounds';
import { centerSvgContent, fitSvgContent } from '@/utils/fitSvgContent';
import { nextTick, onMounted, onUnmounted, ref } from 'vue';
import { useAppStore } from '@/store/app';
import { debounce } from '@/utils';
import { frameQueue } from '@/utils/frameQueue';
import { useResizeObserver } from '@vueuse/core';
import { MouseMode } from '@/mouse';

const appStore = useAppStore();

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
    /**
     * After fitting, centre the view on everything actually drawn (ignored decorations
     * included), so a diagram hanging off one side does not leave the picture lopsided.
     */
    centerAfterFit?: boolean;
    touch?: boolean;
  }>(),
  {
    onUpdate: () => {},
    padding: 0,
    mobilePadding: 0,
    canFitContent: true,
    modelBounds: () => null,
    fitIgnore: '',
    fitReserve: 0,
    centerAfterFit: false,
    touch: true,
  }
);

let viewBox = { x: 0, y: 0, w: 1, h: 1 };
const scale = ref(1);
/** A fit has been shown at least once; the drawing can be revealed. */
const fitted = ref(false);
/** Keep the drawing fitted on viewport changes until the user pans or zooms. */
const autoFit = ref(true);
const zooming = ref(false);
const panning = ref(false);

const touchPointer = ref({ x: 0, y: 0, ds: 0, move: false, pinch: false });

const rootRef = ref<HTMLElement | null>(null);
const svgRef = ref<SVGElement | null>(null);

useResizeObserver(rootRef, () => {
  if (autoFit.value && fitted.value) fitContent();
  else onWindowResize();
});

/** Forget the current view; the next `fitContent` starts from the model bounds. */
const reset = () => {
  viewBox = { x: 0, y: 0, w: 0, h: 0 };
  scale.value = 1;
};

const onWindowResize = (): void => {
  if (!rootRef.value || !svgRef.value) return;

  if (rootRef.value!.offsetWidth === 0) return;

  const dX = rootRef.value!.offsetWidth - svgRef.value!.getBoundingClientRect().width;
  const dY = rootRef.value!.offsetHeight - svgRef.value!.getBoundingClientRect().height;

  svgRef.value.setAttribute('width', rootRef.value!.offsetWidth.toString());
  svgRef.value.setAttribute('height', rootRef.value!.offsetHeight.toString());

  viewBox.w = rootRef.value.offsetWidth / scale.value;
  viewBox.h = rootRef.value.offsetHeight / scale.value;

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
  if (deltaY === 0) return;

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

const debonceZoom = debounce(() => {
  zooming.value = false;
}, 200);

const onMouseWheel = (event: WheelEvent): void => {
  zooming.value = true;
  zoom(event.offsetX, event.offsetY, Math.sign(event.deltaY) * 0.05);
  debonceZoom();
};

// A single finger pans, unless it starts on a node (the viewer switches mouseMode to drag it
// instead) or the clipboard is waiting to be placed. Pasting is the one placing mode with something
// to aim: the preview has to be carried to where it goes, and with no hover a tap alone would place
// it blind. The other placing modes place on a tap, so they still pan.
/**
 * A finger reports far more often than the screen paints, and every report moves the view: it
 * writes the viewBox and changes the zoom, which every element in the drawing is sized from. The
 * position is remembered here and applied once per frame instead, which is as often as it can be
 * seen. The root box is read once per gesture, since reading it forces a layout and it cannot
 * move while a finger is down.
 */
let gestureRect: DOMRect | null = null;

const touchFrame = frameQueue((touch: { x: number; y: number; distance: number; pinch: boolean }) => {
  autoFit.value = false;
  panning.value = true;

  viewBox.x -= (touch.x - touchPointer.value.x) / scale.value;
  viewBox.y -= (touch.y - touchPointer.value.y) / scale.value;

  touchPointer.value.x = touch.x;
  touchPointer.value.y = touch.y;

  if (!touch.pinch) {
    updateMatrix();
    return;
  }

  const deltaY = Math.sign(touchPointer.value.ds - touch.distance) * 0.025;
  touchPointer.value.ds = touch.distance;

  if (deltaY !== 0) {
    zooming.value = true;
    zoom(touchPointer.value.x, touchPointer.value.y, deltaY);
  } else {
    updateMatrix(true);
  }
});

const onTouchStart = (event: TouchEvent): void => {
  if (!props.touch) return;

  if (event.touches.length === 1) {
    touchPointer.value.move =
      appStore.mouseMode !== MouseMode.MOVING && appStore.mouseMode !== MouseMode.PASTE_CLIPBOARD;
    touchPointer.value.x = event.touches[0].clientX;
    touchPointer.value.y = event.touches[0].clientY;
    touchPointer.value.pinch = false;
  }

  if (event.touches.length === 2) {
    panning.value = true;

    touchPointer.value.ds = Math.hypot(
      event.touches[0].pageX - event.touches[1].pageX,
      event.touches[0].pageY - event.touches[1].pageY
    );

    gestureRect = (rootRef.value as unknown as HTMLElement).getBoundingClientRect();
    touchPointer.value.x = (event.touches[0].clientX + event.touches[1].clientX) / 2 - gestureRect.left;
    touchPointer.value.y = (event.touches[0].clientY + event.touches[1].clientY) / 2 - gestureRect.top;

    touchPointer.value.pinch = true;
  }
};

const onTouchEnd = (): void => {
  touchFrame.cancel();
  gestureRect = null;

  // Restoring the drawing costs more than hiding it, so a gesture that is followed by another
  // does not pay for it twice; the wheel settles the same way.
  debonceZoom();
  touchPointer.value.move = false;
  touchPointer.value.pinch = false;
  panning.value = false;
};

const onTouchMove = (event: TouchEvent): void => {
  if (!props.touch) return;

  if (event.touches.length === 1 && touchPointer.value.move) {
    touchFrame.schedule({
      x: event.touches[0].clientX,
      y: event.touches[0].clientY,
      distance: 0,
      pinch: false,
    });
  }

  if (event.touches.length === 2 && touchPointer.value.pinch) {
    const rect = gestureRect ?? (rootRef.value as unknown as HTMLElement).getBoundingClientRect();

    touchFrame.schedule({
      x: (event.touches[0].clientX + event.touches[1].clientX) / 2 - rect.left,
      y: (event.touches[0].clientY + event.touches[1].clientY) / 2 - rect.top,
      distance: Math.hypot(
        event.touches[0].pageX - event.touches[1].pageX,
        event.touches[0].pageY - event.touches[1].pageY
      ),
      pinch: true,
    });
  }
};

const onMouseMove = (event: MouseEvent): void => {
  if (appStore.panButton === -1 && !(event.buttons === 4 || event.buttons === 2)) return;

  if (appStore.panButton !== -1 && event.buttons !== appStore.panButton) return;

  panning.value = true;
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
 * Zoom and pan so that everything drawn - geometry, labels, loads and result
 * diagrams - fills the viewport minus the padding. Resolves once the final view is
 * shown; `false` when there was nothing to fit or a newer fit took over.
 */
const fitContent = async (): Promise<boolean> => {
  const svgEl = svgRef.value as SVGSVGElement | null;

  if (!rootRef.value || !svgEl) return false;

  onWindowResize();

  if (!svgEl.clientWidth || !svgEl.clientHeight) return false;

  if (!props.canFitContent) {
    centerContent();
    return false;
  }

  const version = ++fitVersion;

  // Label widths change when the web font arrives; a fit measured before that lands
  // slightly off. Resolves immediately once loaded.
  if (typeof document !== 'undefined' && document.fonts?.ready) await document.fonts.ready;
  if (version !== fitVersion || svgRef.value !== svgEl) return false;

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
    if (props.centerAfterFit) centerContent();

    fitted.value = true;
    autoFit.value = true;
  }

  return result !== null;
};

/** A button released outside the element never reaches `@mouseup`; without this `panning` stays true forever. */
const onGlobalPointerUp = () => {
  panning.value = false;
};

onMounted(() => {
  window.addEventListener('pointerup', onGlobalPointerUp);
  window.addEventListener('pointercancel', onGlobalPointerUp);
  window.addEventListener('blur', onGlobalPointerUp);

  nextTick(() => {
    // Default slot is the SVG
    svgRef.value! = rootRef.value!.children[0] as SVGElement;

    //window.addEventListener('resize', onWindowResize)
    // const resizewatcher = new ResizeObserver(() => {
    //   onWindowResize();
    // });

    // resizewatcher.observe(rootRef.value!);

    svgRef.value!.setAttribute('overflow', 'visible');
  });

  /* const isFirefox = navigator.userAgent.search("Firefox") > -1;
  let wheelEventEndTimeout = null;
  window.addEventListener(
    "wheel",
    () => {
      console.log("wheel");
      if (isFirefox) appStore.zooming = true;
      clearTimeout(wheelEventEndTimeout);
      wheelEventEndTimeout = setTimeout(() => {
        appStore.zooming = false;
      }, 100);
    },
    { passive: false }
  );*/
});

const onMouseDown = () => {
  //useAppStore().zooming = true;
};

const onMouseUp = () => {
  //useAppStore().zooming = false;
  panning.value = false;
};

onUnmounted(() => {
  touchFrame.cancel();
  window.removeEventListener('pointerup', onGlobalPointerUp);
  window.removeEventListener('pointercancel', onGlobalPointerUp);
  window.removeEventListener('blur', onGlobalPointerUp);
});

defineExpose({ scale, fitted, centerContent, fitContent, updateMatrix, onWindowResize, zoom, reset, zooming, panning });
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
