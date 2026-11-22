<script setup lang="ts">
/**
 * A small model drawn by the plot renderer, as wide as its place and `height` tall: what a dialog
 * shows of the node or member it edits. `over` writes markup of the caller's over the figure, in
 * its px (a dimension), given the fit; `extra` are points the fit keeps in view for it.
 */
import { computed, ref } from 'vue';
import { useElementSize } from '@vueuse/core';
import type { Anchor, Fit, PlotLayer, PlotModel } from '@edubeam/plot';
import { useViewerStore } from '@/store/viewer';
import { editorFigureSvg, editorFit, editorScene } from '@/utils/plotDrawing';
import { useEditorLook } from '@/utils/useEditorLook';
import { themedColors, useThemeName } from '@/utils/theme';

const props = withDefaults(
  defineProps<{
    model: PlotModel | null;
    layers: ReadonlySet<PlotLayer>;
    height?: number;
    extra?: readonly Anchor[];
    over?: (fit: Fit) => string;
    /** The loads are a stand-in, nothing typed yet: drawn in grey, without values */
    ghostLoads?: boolean;
  }>(),
  { height: 200, extra: () => [], over: undefined, ghostLoads: false }
);

/** A stand-in load's grey */
const GHOST = '#9e9e9e';

const viewerStore = useViewerStore();
const look = useEditorLook();
const themeName = useThemeName();
const root = ref<HTMLElement>();
const { width } = useElementSize(root);

/** Room around the figure, px */
const PADDING = 16;

const svg = computed((): string => {
  const w = Math.floor(width.value);
  if (!props.model || props.model.nodes.length === 0 || w <= 0) return '';
  try {
    const box = { width: w, height: props.height, padding: PADDING };
    const fit = editorFit(props.model, look.value, props.layers, box, { extra: props.extra });
    const scene = editorScene(props.model, look.value, props.layers, fit, undefined, fit);
    const figure = {
      fit,
      scene: props.ghostLoads ? { ...scene, texts: scene.texts.filter((t) => t.group !== 'loads') } : scene,
    };
    const themed = themedColors(viewerStore.colors, themeName.value);
    const colors = props.ghostLoads ? { ...themed, loads: GHOST } : themed;
    return editorFigureSvg(figure, look.value, colors, {
      background: false,
      theme: themeName.value,
      over: props.over?.(figure.fit),
    });
  } catch (error) {
    console.warn('[plot renderer] cannot draw the preview', error);
    return '';
  }
});
</script>

<template>
  <!-- eslint-disable-next-line vue/no-v-html -- markup built by the plot renderer, its text escaped -->
  <div ref="root" class="plot-figure" :style="{ height: `${height}px` }" v-html="svg" />
</template>

<style scoped>
.plot-figure {
  width: 100%;
  overflow: hidden;
}

.plot-figure :deep(svg) {
  display: block;
}
</style>
