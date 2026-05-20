<script lang="ts" setup>
import StiffnessMatrix from '@/components/StiffnessMatrix.vue';
import SVGElementViewer from '@/components/SVGElementViewer.vue';
import type { Element, Node } from 'ts-fem';

import { onMounted, onUnmounted, ref, computed } from 'vue';

import { useAppStore } from '@/store/app';
import { useProjectStore } from '@/store/project';
import { useLayoutStore } from '@/store/layout';
import { useI18n } from "vue-i18n";

const appStore = useAppStore();
const projectStore = useProjectStore();
const layoutStore = useLayoutStore();

const { t } = useI18n();

const props = withDefaults(
  defineProps<{
    widget: unknown;
  }>(),
  {}
);

type WidgetProps = {
  x: number;
  y: number;
  label?: number;
  [key: string]: unknown;
};

type LayoutWidget = {
  id: string;
  title?: string;
  component: unknown;
  props: WidgetProps;
  closable?: boolean;
};

const widget = computed(() => props.widget as LayoutWidget);

const previewElement = computed<Element | null>(() => {
  const label = widget.value?.props?.label;
  if (label === undefined || label === null) return null;
  if (!projectStore.solver.domain.elements.has(label)) return null;

  return projectStore.solver.domain.getElement(label);
});

const previewNodes = computed<Node[]>(() => {
  if (!previewElement.value) return [];

  return previewElement.value.nodes
    .map((nodeLabel: number) => projectStore.solver.domain.nodes.get(nodeLabel))
    .filter((node): node is Node => node !== undefined);
});
</script>

<template>
  <vue-draggable-resizable
    class-name="edubeam-widget"
    :w="480"
    :x="widget.props.x"
    :y="widget.props.y"
    :parent="true"
    drag-handle=".drag-handle"
  >
    <v-card class="widget-shell" style="pointer-events: auto">
      <div class="widget-header d-flex drag-handle">
        <div class="widget-header__lead d-flex align-center flex-grow-1">
          <div v-if="widget.props.label" class="widget-preview">
            <SVGElementViewer
              v-if="previewElement"
              class="overflow-hidden pa-1"
              :solver="projectStore.solver"
              :nodes="previewNodes"
              :elements="[previewElement]"
              :padding="1"
              :mobile-padding="1"
              :show-loads="false"
              :show-supports="false"
              :show-deformed-shape="false"
              :show-reactions="false"
            />
          </div>
          <div class="d-flex flex-column w-100 mb-1 px-3">
            <div v-if="widget.title" class="widget-title">{{ widget.title }}</div>
            <div v-if="widget.props.label" class="widget-subtitle">
              <span class="widget-pill">{{ $t("elements.element") }} {{ widget.props.label }}</span>
            </div>
          </div>
        </div>
        <div class="widget-actions">
          <v-btn
            v-if="widget.closable"
            icon="mdi-close"
            size="small"
            variant="text"
            class="ml-1 widget-close-btn"
            @click.prevent.stop="layoutStore.removeWidget(widget.id)"
          />
        </div>
      </div>
      <div class="widget-body">
        <component :is="widget.component" v-bind="widget.props" />
      </div>
    </v-card>
  </vue-draggable-resizable>
</template>
