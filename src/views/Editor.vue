<template>
  <div class="d-flex flex-column fill-height">
    <HelloWorld class="fill-height" style="min-height: 0" />
    <div class="resizer" data-direction="vertical"></div>
    <BottomBar :height="appStore.bottomBarHeight" class="d-none d-sm-block" />
  </div>
</template>

<script lang="ts" setup>
import HelloWorld from "@/components/HelloWorld.vue";
import BottomBar from "@/components/BottomBar.vue";
import { onMounted, onUnmounted, ref } from "vue";
import { useAppStore } from "@/store/app";

const appStore = useAppStore();
const drag = ref(false);

const mouseMove = (e: MouseEvent) => {
  if (drag.value) {
    const val = appStore.bottomBarHeight - e.movementY;

    document.getSelection().removeAllRanges();

    if (val < 193) return appStore.bottomBarHeight = 193;
    if (val > window.innerHeight / 2) return appStore.bottomBarHeight = window.innerHeight/2;

    appStore.bottomBarHeight = val;
    
  }
};

const onMouseDown = (e: MouseEvent) => {
  if (e.target instanceof HTMLElement && e.target.dataset.direction === "vertical") {
    drag.value = true;
  }
};

const onMouseUp = () => {
  drag.value = false;
};

onMounted(() => {
  window.addEventListener("mousemove", mouseMove);
  window.addEventListener("mouseup", onMouseUp);
  window.addEventListener("mousedown", onMouseDown);
});

onUnmounted(() => {
  window.removeEventListener("mousemove", mouseMove);
  window.removeEventListener("mouseup", onMouseUp);
  window.removeEventListener("mousedown", onMouseDown);
});
</script>

<style lang="scss">
.resizer[data-direction="horizontal"] {
  background-color: #cbd5e0;
  cursor: ew-resize;
  height: 100%;
  width: 2px;
}
.resizer[data-direction="vertical"] {
  cursor: ns-resize;
  height: 0px;
  width: 100%;
  display: flex;
  position: relative;
}

.resizer[data-direction="vertical"]::after {
  content: "";
  background-color: transparent;
  cursor: ns-resize;
  height: 12px;
  margin-top: -6px;
  width: 100%;
  display: flex;
  position: absolute;
  z-index: 100;
}
</style>
