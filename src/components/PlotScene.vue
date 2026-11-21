<script setup lang="ts">
/**
 * The model drawn by @edubeam/plot, as a still picture inside a viewer's SVG: the previews and the
 * image export. Written by plot's own SVG writer, so a label's halo is a text of its own and every
 * colour a plain attribute, as Word and Inkscape read them.
 *
 * Built at the viewer's scale in px and scaled back to metres, so its symbols and labels keep
 * their size in px whatever the zoom; it is built again when the scale changes.
 */
import { computed } from 'vue';
import { sceneMarkup, type PlotLayer, type PlotModel } from '@edubeam/plot';
import { editorScene, editorTones, type DiagramScales, type EditorColors, type EditorLook } from '@/utils/plotDrawing';

const props = defineProps<{
  model: PlotModel;
  look: EditorLook;
  layers: ReadonlySet<PlotLayer>;
  /** The viewer's scale, px per metre */
  scale: number;
  colors: EditorColors;
  diagramScale?: DiagramScales;
}>();

const markup = computed((): string => {
  const s = props.scale;
  if (!(s > 0) || props.model.nodes.length === 0) return '';
  try {
    const scene = editorScene(props.model, props.look, props.layers, { s, tx: 0, ty: 0 }, props.diagramScale);
    return sceneMarkup(scene, { colors: editorTones(props.colors), fontSize: props.look.fontSize });
  } catch (error) {
    console.warn('[plot renderer] cannot draw the model', error);
    return '';
  }
});
</script>

<template>
  <!-- Plot's writer escapes every text it writes. The rule takes the SVG group for a component. -->
  <!-- eslint-disable-next-line vue/no-v-text-v-html-on-component -->
  <g class="plot-scene" :transform="`scale(${1 / props.scale})`" v-html="markup" />
</template>
