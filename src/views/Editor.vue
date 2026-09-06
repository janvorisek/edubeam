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

const MIN_BOTTOM_BAR_HEIGHT = 193;

/**
 * A press on the tab strip may yet turn out to be a tab tap, so it becomes a resize only once the
 * pointer has travelled: the dedicated handle drags at once, a shared one has to earn it.
 */
const TAB_STRIP_DRAG_THRESHOLD_PX = 8;
let pendingDragStartY: number | null = null;
let dragStartedOnTabs = false;

/** A drag across the tabs must not leave a click behind that switches the tab it ended on. */
const swallowNextClick = () => {
  const swallow = (e: MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
  };

  window.addEventListener('click', swallow, { capture: true });
  window.setTimeout(() => window.removeEventListener('click', swallow, { capture: true }), 300);
};

const mouseMove = (e: PointerEvent) => {
  if (pendingDragStartY !== null && Math.abs(e.clientY - pendingDragStartY) > TAB_STRIP_DRAG_THRESHOLD_PX) {
    pendingDragStartY = null;
    dragStartedOnTabs = true;
    drag.value = true;
    dragLastY = e.clientY;

    // Dragging the strip of a collapsed bar opens it at its smallest, and grows from there.
    if (!appStore.bottomBarOpen) {
      appStore.bottomBarOpen = true;
      appStore.bottomBarHeight = MIN_BOTTOM_BAR_HEIGHT;
    }
  }

  if (drag.value) {
    const val = appStore.bottomBarHeight - (e.clientY - dragLastY);
    dragLastY = e.clientY;

    document.getSelection().removeAllRanges();

    if (val < MIN_BOTTOM_BAR_HEIGHT) return (appStore.bottomBarHeight = MIN_BOTTOM_BAR_HEIGHT);
    if (val > window.innerHeight / 2) return (appStore.bottomBarHeight = window.innerHeight / 2);

    appStore.bottomBarHeight = val;
  }
};

const onMouseDown = (e: PointerEvent) => {
  if (!(e.target instanceof Element)) return;

  if (e.target instanceof HTMLElement && e.target.dataset.direction === 'vertical') {
    drag.value = true;
    dragLastY = e.clientY;
    return;
  }

  if (e.target.closest('[data-resize-handle="vertical"]')) pendingDragStartY = e.clientY;
};

const onMouseUp = () => {
  if (drag.value && dragStartedOnTabs) swallowNextClick();

  drag.value = false;
  dragStartedOnTabs = false;
  pendingDragStartY = null;
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

/*
 * The bottom bar tab strip doubles as a resize handle - a whole bar to grab rather than a line.
 * Horizontal panning stays with the browser, so the tabs themselves can still be scrolled.
 */
[data-resize-handle='vertical'] {
  touch-action: pan-x;
}
</style>
