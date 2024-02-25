<script lang="ts" setup>
import StiffnessMatrix from "@/components/StiffnessMatrix.vue";
import SVGElementViewer from "@/components/SVGElementViewer.vue";

import { onMounted, onUnmounted, ref, computed } from "vue";

import { useAppStore } from "@/store/app";
import { useProjectStore } from "@/store/project";
import { useLayoutStore } from "@/store/layout";

const appStore = useAppStore();
const projectStore = useProjectStore();
const layoutStore = useLayoutStore();

const props = withDefaults(
  defineProps<{
    widget: unknown;
  }>(),
  {}
);
</script>

<template>
  <vue-draggable-resizable
    :w="400"
    :x="props.widget.props.x"
    :y="props.widget.props.y"
    :parent="true"
    drag-handle=".drag-handle"
  >
    <v-card style="pointer-events: auto">
      <div class="d-flex drag-handle">
        <div class="d-flex align-center flex-grow-1">
          <div style="width: 64px; height: 48px" v-if="props.widget.props.label">
            <SVGElementViewer
              v-if="projectStore.solver.domain.elements.has(props.widget.props.label)"
              class="overflow-hidden pa-1"
              :solver="projectStore.solver"
              :nodes="[]"
              :elements="[projectStore.solver.domain.getElement(props.widget.props.label)]"
              :padding="1"
              :mobile-padding="1"
            />
          </div>
          <div class="d-flex flex-column w-100 mb-1 px-3">
            <div class="text-h6" v-if="props.widget.title">{{ props.widget.title }}</div>
            <div class="d-flex" v-if="props.widget.props.label">
              <div>Element {{ props.widget.props.label }} {{ props.x }}</div>
              <!-- <div class="ml-1">
                <v-btn icon="mdi-content-copy" size="small" density="compact" variant="text"> </v-btn>
              </div> -->
            </div>
          </div>
        </div>
        <div class="">
          <v-btn
            icon="mdi-close"
            size="small"
            variant="text"
            @click.prevent.stop="layoutStore.removeWidget(props.widget.id)"
            small
            class="ml-1"
            v-if="props.widget.closable"
          />
        </div>
      </div>
      <component :is="props.widget.component" v-bind="props.widget.props" />
    </v-card>
  </vue-draggable-resizable>
</template>
