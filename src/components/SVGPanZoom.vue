<script setup lang="ts">
import { nextTick, onMounted, ref } from "vue";
import { useAppStore } from "../store/app";

const appStore = useAppStore();

const props = withDefaults(
  defineProps<{
    onUpdate: (zooming: boolean) => void;
    padding: number;
    mobilePadding: number;
  }>(),
  {
    onUpdate: () => {},
    padding: 0,
    mobilePadding: 0,
  }
);

let viewBox = { x: 0, y: 0, w: 0, h: 0 };
const scale = ref(1);

const touchPointer = ref({ x: 0, y: 0, ds: 0, move: false, pinch: false });

const onWindowResize = (): void => {
  if (rootRef.value!.offsetWidth === 0) return;

  const dX = rootRef.value!.offsetWidth - svgRef.value!.getBoundingClientRect().width;
  const dY = rootRef.value!.offsetHeight - svgRef.value!.getBoundingClientRect().height;

  svgRef.value!.setAttribute("width", rootRef.value!.offsetWidth.toString());
  svgRef.value!.setAttribute("height", rootRef.value!.offsetHeight.toString());

  viewBox.w = rootRef.value!.offsetWidth / scale.value;
  viewBox.h = rootRef.value!.offsetHeight / scale.value;

  viewBox.x -= dX / scale.value / 2;
  viewBox.y -= dY / scale.value / 2;

  updateMatrix(true);
};

const updateMatrix = (zooming = false): void => {
  const svgEl = svgRef.value as SVGElement;
  svgEl.setAttribute("viewBox", `${viewBox.x} ${viewBox.y} ${viewBox.w} ${viewBox.h}`);
  props.onUpdate(zooming);
};

const zoom = (mx: number, my: number, deltaY: number): void => {
  if (deltaY === 0) return;

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

let wheelEventEndTimeout = null;
const isFirefox = navigator.userAgent.search("Firefox") > -1;
const onMouseWheel = (event: WheelEvent): void => {
  if (isFirefox) appStore.zooming = true;
  clearTimeout(wheelEventEndTimeout);
  wheelEventEndTimeout = setTimeout(() => {
    appStore.zooming = false;
  }, 100);

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
    appStore.zooming = true;

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
  appStore.zooming = false;
  touchPointer.value.move = false;
  touchPointer.value.pinch = false;
};

const onTouchMove = (event: TouchEvent): void => {
  //console.log({ touchmove: event.touches.length, pointer: JSON.stringify(touchPointer) })
  if (event.touches.length === 1 && touchPointer.value.move) {
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
  if (event.buttons !== appStore.panButton) return;

  viewBox.x -= (event.movementX * 1) / scale.value;
  viewBox.y -= (event.movementY * 1) / scale.value;

  updateMatrix();
};

const centerContent = (): void => {
  const rootG = (svgRef.value as SVGElement).getElementsByTagName("g")[0] as SVGGElement;
  const bBox = rootG.getBBox();

  viewBox.x = -viewBox.w / 2 + bBox.x + bBox.width / 2;
  viewBox.y = -viewBox.h / 2 + bBox.y + bBox.height / 2;

  updateMatrix(true);
};

const fitContent = (n = 0): void => {
  if (n > 5) return;

  const FIT_CONTENT_PADDING = window.innerWidth > 768 ? props.padding : props.mobilePadding;

  const svgEl = svgRef.value as SVGElement;
  const rootG = svgEl.getElementsByTagName("g")[0] as SVGGElement;

  const rootBBox = svgEl.getBoundingClientRect();
  //const bBox = rootG.getBoundingClientRect();

  const bBoxW = rootG.getBBox().width * scale.value;
  const bBoxH = rootG.getBBox().height * scale.value;

  let zoomBy = bBoxH / (svgEl.clientHeight - FIT_CONTENT_PADDING);

  //console.log(svgEl.clientHeight);

  const r1 = bBoxW / bBoxH;
  const r2 = rootBBox.width / rootBBox.height;

  if (r2 < r1) {
    zoomBy = bBoxW / (svgEl.clientWidth - FIT_CONTENT_PADDING);
    //   console.log({ bBoxW, cw: svgEl.clientWidth - FIT_CONTENT_PADDING, zoomBy });
    // } else {
    //   console.log({ bBoxH, cw: svgEl.clientHeight - FIT_CONTENT_PADDING, zoomBy });
  }

  viewBox.h *= zoomBy;
  viewBox.w *= zoomBy;
  /*viewBox.h = bBox.height
  //viewBox.w = bBox.width
  const realScale = svgEl.clientHeight / bBox.height
  viewBox.w = bBox.width / realScale*/

  scale.value = svgEl.clientWidth / viewBox.w;

  //console.log(bBox)
  //console.log(viewBox)

  centerContent();
  updateMatrix(true);

  requestAnimationFrame(() => fitContent(n + 1));
  //nextTick(() => fitContent(n + 1));
};

onMounted(() => {
  nextTick(() => {
    // Default slot is the SVG
    svgRef.value! = rootRef.value!.children[0] as SVGElement;

    //window.addEventListener('resize', onWindowResize)
    const resizewatcher = new ResizeObserver(() => {
      onWindowResize();
    });

    resizewatcher.observe(rootRef.value!);

    svgRef.value!.setAttribute("overflow", "visible");
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
};

const rootRef = ref<HTMLElement | null>(null);
const svgRef = ref<SVGElement | null>(null);

defineExpose({ scale, centerContent, fitContent, updateMatrix, onWindowResize, zoom });
</script>

<template>
  <div
    ref="rootRef"
    class="w-100 fill-height"
    @touchstart.prevent="onTouchStart"
    @touchmove.prevent="onTouchMove"
    @touchend.prevent="onTouchEnd"
    @wheel.prevent="onMouseWheel"
    @mousedown.prevent="onMouseDown"
    @mouseup.prevent="onMouseUp"
    @mousemove.prevent="onMouseMove"
    @contextmenu.prevent
    style="touch-action: none"
  >
    <slot></slot>
  </div>
</template>
