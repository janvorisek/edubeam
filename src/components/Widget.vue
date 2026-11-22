<script lang="ts" setup>
import { computed, nextTick, onBeforeUnmount, onMounted, ref } from 'vue';
import { useThemeName } from '@/utils/theme';
import SVGElementViewer from '@/components/SVGElementViewer.vue';

import { useProjectStore } from '@/store/project';
import { useLayoutStore, type Widget } from '@/store/layout';

/** The previews drawn on the theme's canvas, as the editor is */
const themeName = useThemeName();
const projectStore = useProjectStore();
const layoutStore = useLayoutStore();

const props = defineProps<{ widget: Widget }>();

/**
 * A widget never runs past the bottom of the space it floats in. Its height is what it shows, capped
 * by that space alone - never by where it is, so dragging it does not change it - and its content
 * scrolls inside. The drag is what stops at the bottom: the frame is told the card's real height, so
 * its limits hold, and a widget whose content grows past the bottom moves up instead.
 */
const MARGIN = 8;
// The draggable frame; it measures its space once when it mounts, so it is asked again on every resize
const frame = ref<{ $el: HTMLElement; checkParentSize?: () => void } | null>(null);
const card = ref<{ $el: HTMLElement } | null>(null);
const top = ref(props.widget.props.y);
const spaceHeight = ref(Number.POSITIVE_INFINITY);
const cardHeight = ref(200);
const maxHeight = computed(() => Math.max(120, spaceHeight.value - 2 * MARGIN));

const measureSpace = () => {
  const space = frame.value?.$el.parentElement;
  if (!space) return;
  const box = space.getBoundingClientRect();
  // The space can reach below the window; the room is to whichever bottom comes first
  spaceHeight.value = Math.min(box.bottom, window.innerHeight) - box.top;
};

/** Up, if a card this tall would reach past the bottom where it is */
const keepInside = (height: number) => {
  const lowest = spaceHeight.value - height - MARGIN;
  if (top.value > lowest) top.value = Math.max(MARGIN, lowest);
};

let observer: ResizeObserver | undefined;
onMounted(() => {
  measureSpace();
  const space = frame.value?.$el.parentElement;
  const el = card.value?.$el;
  observer = new ResizeObserver(() => {
    measureSpace();
    frame.value?.checkParentSize?.();
    if (!el) return;
    const height = el.offsetHeight;
    // Moved first, sized after: the frame caps a new height at the room below its top as it stands
    keepInside(height);
    void nextTick(() => (cardHeight.value = height));
  });
  if (space) observer.observe(space);
  if (el) observer.observe(el);
  window.addEventListener('resize', measureSpace);
});
onBeforeUnmount(() => {
  observer?.disconnect();
  window.removeEventListener('resize', measureSpace);
});
</script>

<template>
  <vue-draggable-resizable
    ref="frame"
    :w="400"
    :x="props.widget.props.x"
    :y="top"
    :h="cardHeight"
    :parent="true"
    drag-handle=".drag-handle"
    @dragging="(_x: number, y: number) => (top = y)"
    @drag-stop="(_x: number, y: number) => (top = y)"
  >
    <v-card ref="card" class="widget-card" :style="{ maxHeight: `${maxHeight}px` }">
      <div class="d-flex drag-handle">
        <div class="d-flex align-center flex-grow-1">
          <div v-if="props.widget.props.label" style="width: 64px; height: 48px">
            <SVGElementViewer
              v-if="projectStore.solver.domain.elements.has(String(props.widget.props.label))"
              :theme="themeName"
              class="overflow-hidden pa-1"
              :solver="projectStore.solver"
              :nodes="[]"
              :elements="[projectStore.solver.domain.getElement(String(props.widget.props.label))]"
              :padding="1"
              :mobile-padding="1"
              no-fit-for-results
            />
          </div>
          <div class="d-flex flex-column w-100 mb-1 px-3">
            <div v-if="props.widget.title" class="text-h6">{{ props.widget.title }}</div>
            <div v-if="props.widget.props.label">{{ $t('common.element') }} {{ props.widget.props.label }}</div>
          </div>
        </div>
        <div class="">
          <v-btn
            v-if="props.widget.closable"
            icon="mdi-close"
            size="small"
            variant="text"
            small
            class="ml-1"
            @click.prevent.stop="layoutStore.removeWidget(props.widget.id)"
          />
        </div>
      </div>
      <div class="widget-content">
        <component :is="props.widget.component" v-bind="props.widget.props" />
      </div>
    </v-card>
  </vue-draggable-resizable>
</template>

<style scoped>
.widget-card {
  pointer-events: auto;
  display: flex;
  flex-direction: column;
}
.widget-content {
  flex: 1 1 auto;
  min-height: 0;
  overflow: auto;
}
</style>
