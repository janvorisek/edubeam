<script setup lang="ts">
/**
 * What a paste will place, carried under the pointer: the copied members, nodes and supports as the
 * plot renderer draws them. Drawn once when the paste starts; the editor moves it with a transform.
 */
import { computed } from 'vue';
import { buildStructureScene, resolveScene, mergePaths, type PlotLayer, type Tone } from '@edubeam/plot';
import { useProjectStore } from '@/store/project';
import { useViewerStore } from '@/store/viewer';
import { useClipboardStore } from '@/store/clipboard';
import {
  NODE_SIZE,
  copiedPart,
  editorResolveOptions,
  editorSceneOptions,
  editorTones,
  readEditorModel,
} from '@/utils/plotDrawing';
import { useEditorLook } from '@/utils/useEditorLook';

const props = defineProps<{
  /** The editor's scale, px per metre */
  scale: number;
}>();

const projectStore = useProjectStore();
const viewerStore = useViewerStore();
const clipboardStore = useClipboardStore();
const look = useEditorLook();
const tones = computed(() => editorTones(viewerStore.colors));

const picture = computed(() => {
  const s = props.scale;
  if (!(s > 0)) return null;
  try {
    const model = readEditorModel(projectStore.solver);
    const part = copiedPart(
      model,
      new Set(clipboardStore.nodes.map(String)),
      new Set(clipboardStore.elements.map(String))
    );
    const layers = new Set<PlotLayer>(viewerStore.showSupports ? ['members', 'supports'] : ['members']);
    const items = buildStructureScene(part, editorSceneOptions(look.value, layers, s));
    const resolved = resolveScene(items, { s, tx: 0, ty: 0 }, editorResolveOptions(look.value, layers));
    return {
      paths: mergePaths(resolved.paths).filter((p) => !p.hitArea),
      circles: resolved.circles,
      nodes: part.nodes.map((n) => ({ id: n.id, x: n.x * s, y: n.z * s })),
    };
  } catch (error) {
    console.warn('[plot renderer] cannot draw the paste', error);
    return null;
  }
});

const colour = (tone: Tone | 'paper'): string => tones.value[tone] ?? '#000000';
</script>

<template>
  <g v-if="picture" class="plot-paste" :transform="`scale(${1 / props.scale})`" pointer-events="none">
    <path
      v-for="(p, i) in picture.paths"
      :key="`p${i}`"
      :d="p.d"
      :stroke="p.width > 0 ? colour(p.tone) : 'none'"
      :stroke-width="p.width > 0 ? p.width : undefined"
      :stroke-opacity="p.opacity"
      :stroke-dasharray="p.dash"
      :stroke-linecap="p.cap ?? 'round'"
      stroke-linejoin="round"
      :fill="p.fill === 'tone' ? colour(p.tone) : p.fill === 'paper' ? colour('paper') : 'none'"
      :fill-opacity="p.fillOpacity"
    />
    <rect
      v-for="n in picture.nodes"
      :key="`n${n.id}`"
      :x="n.x - NODE_SIZE / 2"
      :y="n.y - NODE_SIZE / 2"
      :width="NODE_SIZE"
      :height="NODE_SIZE"
      :fill="colour('ink')"
    />
    <circle
      v-for="(c, i) in picture.circles"
      :key="`c${i}`"
      :cx="c.cx"
      :cy="c.cy"
      :r="c.r"
      :stroke="colour(c.tone)"
      :stroke-width="c.width"
      :fill="c.fill === 'paper' ? colour('paper') : colour(c.tone)"
    />
  </g>
</template>
