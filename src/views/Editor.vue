<template>
  <div class="d-flex flex-column fill-height">
    <div style="height: 100%; width: 100%; position: absolute; pointer-events: none">
      <TransitionGroup name="fade">
        <Widget v-for="widget of layoutStore.widgets" :key="widget.title" :widget="widget" />
      </TransitionGroup>
    </div>
    <HelloWorld class="fill-height" style="min-height: 0" />
    <div class="resizer" data-direction="vertical"></div>
    <BottomBar v-if="!appStore.inViewerMode" :height="computedBottomBarHeight" class="d-block" />
  </div>
</template>

<script lang="ts" setup>
import HelloWorld from '@/components/HelloWorld.vue';
import BottomBar from '@/components/BottomBar.vue';
import Widget from '@/components/Widget.vue';

import { onMounted, onUnmounted, ref, computed } from 'vue';
import { useAppStore } from '@/store/app';
import { useProjectStore } from '@/store/project';
import { useLayoutStore } from '@/store/layout';

const appStore = useAppStore();
const projectStore = useProjectStore();
const layoutStore = useLayoutStore();

const drag = ref(false);

const computedBottomBarHeight = computed(() => {
  if (appStore.inViewerMode) return 0;

  return appStore.bottomBarOpen ? appStore.bottomBarHeight : 36;
});

// The last pointer position, not `movementY`: for touch pointers browsers report no movement.
let dragLastY = 0;

const mouseMove = (e: PointerEvent) => {
  if (drag.value) {
    const val = appStore.bottomBarHeight - (e.clientY - dragLastY);
    dragLastY = e.clientY;

    document.getSelection().removeAllRanges();

    if (val < 193) return (appStore.bottomBarHeight = 193);
    if (val > window.innerHeight / 2) return (appStore.bottomBarHeight = window.innerHeight / 2);

    appStore.bottomBarHeight = val;
  }
};

const onMouseDown = (e: PointerEvent) => {
  if (e.target instanceof HTMLElement && e.target.dataset.direction === 'vertical') {
    drag.value = true;
    dragLastY = e.clientY;
  }
};

const onMouseUp = () => {
  drag.value = false;
};

onMounted(() => {
  window.addEventListener('pointermove', mouseMove);
  window.addEventListener('pointerup', onMouseUp);
  window.addEventListener('pointercancel', onMouseUp);
  window.addEventListener('pointerdown', onMouseDown);
});

onUnmounted(() => {
  window.removeEventListener('pointermove', mouseMove);
  window.removeEventListener('pointerup', onMouseUp);
  window.removeEventListener('pointercancel', onMouseUp);
  window.removeEventListener('pointerdown', onMouseDown);
});
</script>

<style lang="scss">
.resizer[data-direction='horizontal'] {
  background-color: #cbd5e0;
  cursor: ew-resize;
  height: 100%;
  width: 2px;
}
.resizer[data-direction='vertical'] {
  cursor: ns-resize;
  height: 0px;
  width: 100%;
  display: flex;
  position: relative;
  /* The drag is ours: without this a touch drag scrolls the page instead of resizing. */
  touch-action: none;
}

.resizer[data-direction='vertical']::after {
  content: '';
  background-color: transparent;
  cursor: ns-resize;
  height: 12px;
  margin-top: -6px;
  width: 100%;
  display: flex;
  position: absolute;
  z-index: 100;
}

/* A 12 px strip is a mouse target; a finger needs more to grab. */
@media (pointer: coarse) {
  .resizer[data-direction='vertical']::after {
    height: 24px;
    margin-top: -12px;
  }
}
</style>
