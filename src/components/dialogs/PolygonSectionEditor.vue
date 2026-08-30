<template>
  <v-dialog v-model="open" max-width="1100" scrollable>
    <v-card>
      <v-card-title>
        {{ isEdit ? $t('dialogs.polygonSection.editTitle') : $t('dialogs.polygonSection.title') }}
      </v-card-title>

      <v-card-text class="px-4 pt-2">
        <v-row dense>
          <!-- Canvas + presets -->
          <v-col cols="12" md="7">
            <div class="d-flex flex-wrap align-center ga-2 mb-2">
              <v-select
                v-model="presetId"
                :items="presetItems"
                :label="$t('dialogs.polygonSection.preset')"
                density="compact"
                hide-details
                variant="outlined"
                :rounded="0"
                style="max-width: 190px"
              ></v-select>
              <v-text-field
                v-for="param in presetParams"
                :key="param"
                v-model="presetValues[param]"
                :label="$t(`dialogs.polygonSection.params.${param}`)"
                :suffix="param === 'n' ? '' : appStore.units.Length"
                density="compact"
                hide-details
                variant="outlined"
                :rounded="0"
                style="max-width: 120px"
                @keydown="checkNumber($event)"
                @keydown.enter="applyPreset"
              ></v-text-field>
              <v-btn size="small" variant="tonal" class="text-none" @click="applyPreset">
                {{ $t('dialogs.polygonSection.apply') }}
              </v-btn>
            </div>

            <div class="d-flex flex-wrap align-center ga-2 mb-2">
              <v-text-field
                v-model="snapStep"
                :label="$t('dialogs.polygonSection.snapStep')"
                :suffix="appStore.units.Length"
                density="compact"
                hide-details
                variant="outlined"
                :rounded="0"
                style="max-width: 150px"
                @keydown="checkNumber($event)"
              ></v-text-field>
              <v-btn
                size="small"
                variant="text"
                class="text-none"
                prepend-icon="mdi-image-filter-center-focus"
                @click="recenter"
              >
                {{ $t('dialogs.polygonSection.centerAtCentroid') }}
              </v-btn>
              <v-spacer></v-spacer>
              <div class="text-caption text-medium-emphasis">
                {{ $t('dialogs.polygonSection.hint') }}
              </div>
            </div>

            <svg
              ref="svgRef"
              class="section-canvas"
              :viewBox="viewBoxString"
              preserveAspectRatio="xMidYMid meet"
              @pointermove="onPointerMove"
              @pointerup="onPointerUp"
              @pointercancel="onPointerUp"
            >
              <defs>
                <marker
                  id="axis-arrow"
                  viewBox="0 0 10 10"
                  refX="9"
                  refY="5"
                  markerWidth="7"
                  markerHeight="7"
                  orient="auto"
                >
                  <path d="M0,0 L10,5 L0,10 Z" class="axis-arrow" />
                </marker>
              </defs>

              <!-- Everything geometric is drawn mirrored: screen x = -y (y points left, z down) -->
              <g transform="scale(-1 1)">
                <!-- Section outline (holes via even-odd fill), holes re-stroked so they read differently -->
                <path :d="sectionPath" class="section-fill" fill-rule="evenodd" />
                <path v-for="(d, i) in holePaths" :key="`hp${i}`" :d="d" class="hole-stroke" />
                <!-- Active contour emphasised on top -->
                <path
                  v-if="activeContourPath"
                  :d="activeContourPath"
                  class="active-stroke"
                  :class="{ hole: current?.hole }"
                />

                <template v-if="shapeValid">
                  <!-- Centroidal axes with arrows in the positive direction -->
                  <line
                    :x1="vb.x"
                    :y1="properties.cz"
                    :x2="vb.x + vb.w - handleR * 2"
                    :y2="properties.cz"
                    class="axis-line"
                    marker-end="url(#axis-arrow)"
                  />
                  <line
                    :x1="properties.cy"
                    :y1="vb.y"
                    :x2="properties.cy"
                    :y2="vb.y + vb.h - handleR * 2"
                    class="axis-line"
                    marker-end="url(#axis-arrow)"
                  />

                  <!-- Principal axes and ellipse of inertia -->
                  <g :transform="`rotate(${alphaDeg} ${properties.cy} ${properties.cz})`">
                    <line
                      :x1="properties.cy - axisLen"
                      :y1="properties.cz"
                      :x2="properties.cy + axisLen"
                      :y2="properties.cz"
                      class="principal-line"
                    />
                    <line
                      :x1="properties.cy"
                      :y1="properties.cz - axisLen"
                      :x2="properties.cy"
                      :y2="properties.cz + axisLen"
                      class="principal-line"
                    />
                    <ellipse
                      :cx="properties.cy"
                      :cy="properties.cz"
                      :rx="properties.r2"
                      :ry="properties.r1"
                      class="inertia-ellipse"
                    />
                  </g>

                  <circle :cx="properties.cy" :cy="properties.cz" :r="handleR * 0.6" class="centroid" />
                </template>

                <!-- Edge midpoints: click to insert a vertex -->
                <template v-for="(contour, ci) in shape.contours" :key="`e${ci}`">
                  <circle
                    v-for="(mid, vi) in edgeMidpoints(contour)"
                    :key="vi"
                    :cx="mid[0]"
                    :cy="mid[1]"
                    :r="handleR * 0.6"
                    class="edge-handle"
                    :class="{ inactive: ci !== activeContour }"
                    @pointerdown.stop.prevent="insertVertex(ci, vi + 1, mid)"
                  />
                </template>

                <!-- Vertices: drag to move, double-click to delete -->
                <template v-for="(contour, ci) in shape.contours" :key="`v${ci}`">
                  <circle
                    v-for="(pt, vi) in contour.points"
                    :key="vi"
                    :cx="pt[0]"
                    :cy="pt[1]"
                    :r="handleR"
                    class="vertex-handle"
                    :class="{
                      selected: selected?.ci === ci && selected?.vi === vi,
                      hole: contour.hole,
                      inactive: ci !== activeContour,
                    }"
                    @pointerdown.stop.prevent="startDrag(ci, vi, $event)"
                    @dblclick.stop.prevent="removeVertex(ci, vi)"
                  />
                </template>
              </g>

              <!-- Labels live outside the mirrored group so the text reads normally -->
              <template v-if="shapeValid">
                <text
                  :x="toScreenX(vb.x + vb.w) + handleR"
                  :y="properties.cz - handleR"
                  class="axis-label"
                  :font-size="fontSize"
                >
                  y
                </text>
                <text
                  :x="toScreenX(properties.cy) + handleR"
                  :y="vb.y + vb.h - handleR * 2.5"
                  class="axis-label"
                  :font-size="fontSize"
                >
                  z
                </text>
                <text
                  :x="toScreenX(principalLabel1[0])"
                  :y="principalLabel1[1]"
                  class="principal-label"
                  :font-size="fontSize"
                  text-anchor="middle"
                  dominant-baseline="middle"
                >
                  1
                </text>
                <text
                  :x="toScreenX(principalLabel2[0])"
                  :y="principalLabel2[1]"
                  class="principal-label"
                  :font-size="fontSize"
                  text-anchor="middle"
                  dominant-baseline="middle"
                >
                  2
                </text>
              </template>
            </svg>

            <div class="legend text-caption text-medium-emphasis mt-1">
              <span><i class="sw sw-outline"></i>{{ $t('dialogs.polygonSection.legendOutline') }}</span>
              <span><i class="sw sw-hole"></i>{{ $t('dialogs.polygonSection.legendHole') }}</span>
              <span><i class="sw sw-principal"></i>{{ $t('dialogs.polygonSection.legendPrincipal') }}</span>
              <span><i class="sw sw-centroid"></i>{{ $t('dialogs.polygonSection.legendCentroid') }}</span>
            </div>
          </v-col>

          <!-- Vertices + properties -->
          <v-col cols="12" md="5">
            <v-row dense>
              <v-col cols="7">
                <v-text-field
                  v-model="csLabel"
                  :label="$t('common.label')"
                  density="compact"
                  hide-details="auto"
                  variant="outlined"
                  :rounded="0"
                  :rules="labelRules"
                ></v-text-field>
              </v-col>
              <v-col cols="5">
                <v-text-field
                  v-model="shear"
                  :label="$t('crossSection.k')"
                  density="compact"
                  hide-details="auto"
                  variant="outlined"
                  :rounded="0"
                  :rules="positiveNumberRules"
                  @keydown="checkNumber($event)"
                ></v-text-field>
              </v-col>
            </v-row>

            <v-tabs v-model="tab" density="compact" class="mt-2">
              <v-tab value="vertices" class="text-none">{{ $t('dialogs.polygonSection.vertices') }}</v-tab>
              <v-tab value="properties" class="text-none">{{ $t('dialogs.polygonSection.properties') }}</v-tab>
            </v-tabs>

            <v-window v-model="tab" class="mt-2">
              <v-window-item value="vertices">
                <!-- Contour selector: one vertex table at a time -->
                <div class="contour-bar d-flex align-center flex-wrap ga-1 mb-1">
                  <v-chip-group v-model="activeContour" mandatory class="py-0">
                    <v-chip
                      v-for="(contour, ci) in shape.contours"
                      :key="ci"
                      :value="ci"
                      size="small"
                      label
                      class="contour-chip"
                      :class="{ active: activeContour === ci }"
                      :variant="activeContour === ci ? 'flat' : 'outlined'"
                      :color="activeContour === ci ? (contour.hole ? 'error' : 'primary') : undefined"
                      :prepend-icon="activeContour === ci ? 'mdi-check-bold' : undefined"
                    >
                      <i v-if="activeContour !== ci" class="sw" :class="contour.hole ? 'sw-hole' : 'sw-outline'"></i>
                      {{ contour.hole ? $t('dialogs.polygonSection.hole') : $t('dialogs.polygonSection.outline') }}
                      {{ ci > 0 ? ci : '' }}
                      <span class="text-caption ml-1 chip-count">{{ contour.points.length }}</span>
                    </v-chip>
                  </v-chip-group>
                  <v-btn size="small" variant="text" class="text-none" prepend-icon="mdi-shape-plus" @click="addHole">
                    {{ $t('dialogs.polygonSection.addHole') }}
                  </v-btn>
                </div>

                <div v-if="current" ref="contoursRef" class="contours" :class="{ hole: current.hole }">
                  <table class="vertex-table">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>y [{{ appStore.units.Length }}]</th>
                        <th>z [{{ appStore.units.Length }}]</th>
                        <th class="text-right">
                          <v-btn
                            density="compact"
                            variant="text"
                            size="small"
                            icon="mdi-plus"
                            :title="$t('dialogs.polygonSection.addVertex')"
                            @click="appendVertex(activeContour)"
                          ></v-btn>
                          <v-btn
                            v-if="activeContour > 0"
                            density="compact"
                            variant="text"
                            size="small"
                            icon="mdi-delete-outline"
                            color="error"
                            :title="$t('dialogs.polygonSection.removeContour')"
                            @click="removeContour(activeContour)"
                          ></v-btn>
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr
                        v-for="(pt, vi) in current.points"
                        :id="`vertex-row-${activeContour}-${vi}`"
                        :key="vi"
                        :class="{ selected: selected?.ci === activeContour && selected?.vi === vi }"
                        @click="selected = { ci: activeContour, vi }"
                      >
                        <td class="text-medium-emphasis">{{ vi + 1 }}</td>
                        <td>
                          <input
                            :value="formatLength(pt[0])"
                            class="coord-input"
                            @keydown="checkNumber($event)"
                            @change="setCoord(activeContour, vi, 0, $event.target as HTMLInputElement)"
                          />
                        </td>
                        <td>
                          <input
                            :value="formatLength(pt[1])"
                            class="coord-input"
                            @keydown="checkNumber($event)"
                            @change="setCoord(activeContour, vi, 1, $event.target as HTMLInputElement)"
                          />
                        </td>
                        <td class="text-right">
                          <v-btn
                            density="compact"
                            variant="text"
                            size="x-small"
                            icon="mdi-close"
                            :disabled="current.points.length <= 3"
                            @click.stop="removeVertex(activeContour, vi)"
                          ></v-btn>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </v-window-item>

              <v-window-item value="properties">
                <v-alert v-if="!shapeValid" type="warning" density="compact" variant="tonal" class="mb-2">
                  {{ $t('dialogs.polygonSection.invalidShape') }}
                </v-alert>
                <div class="text-caption text-medium-emphasis mb-1">
                  {{ $t('dialogs.polygonSection.centroidalNote') }}
                </div>
                <table class="props-table">
                  <tbody>
                    <tr v-for="row in propertyRows" :key="row.key">
                      <td v-html="row.title"></td>
                      <td class="text-right">{{ row.value }}</td>
                      <td class="text-medium-emphasis" v-html="row.units"></td>
                    </tr>
                  </tbody>
                </table>
              </v-window-item>
            </v-window>

            <!-- Key numbers always visible under the tabs -->
            <div class="summary d-flex flex-wrap ga-3 mt-2 text-body-2">
              <span
                >A = <b>{{ formatScientificNumber(appStore.convertArea(properties.a)) }}</b>
                <span v-html="areaUnitHtml"></span
              ></span>
              <span
                >I<sub>y</sub> = <b>{{ formatScientificNumber(appStore.convertAreaM2(properties.iy)) }}</b>
                <span v-html="inertiaUnitHtml"></span
              ></span>
              <span
                >h = <b>{{ formatLength(properties.h) }}</b> {{ appStore.units.Length }}</span
              >
            </div>
            <v-alert
              v-if="!shapeValid && tab !== 'properties'"
              type="warning"
              density="compact"
              variant="tonal"
              class="mt-2"
            >
              {{ $t('dialogs.polygonSection.invalidShape') }}
            </v-alert>
          </v-col>
        </v-row>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="green darken-1" :disabled="!canSave" @click="save" @keydown.enter="save">
          {{ isEdit ? $t('dialogs.polygonSection.save') : $t('dialogs.addCrossSection.addCrossSection') }}
        </v-btn>
        <v-btn color="red darken-1" @click="closeModal" @keydown.enter="closeModal">
          {{ $t('dialogs.common.cancel') }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { computed, nextTick, reactive, ref, watch } from 'vue';
import { closeModal } from 'jenesius-vue-modal';
import { useElementSize } from '@vueuse/core';
import { useI18n } from 'vue-i18n';
import { useProjectStore } from '@/store/project';
import { useAppStore } from '@/store/app';
import {
  checkNumber,
  executeModelMutationWithUndo,
  formatCompactNumber,
  formatScientificNumber,
  parseFloat2,
  positiveNumberRules,
  setUnsolved,
} from '@/utils';
import { formatMeasureAsHTML } from '@/SVGUtils';
import {
  centerShape,
  cloneShape,
  computeSectionProperties,
  createPresetShape,
  isShapeValid,
  sectionPresetDefaults,
  sectionPresetParams,
  type SectionContour,
  type SectionPoint,
  type SectionPresetId,
  type SectionPresetParam,
  type SectionShape,
} from '@/utils/sectionProperties';
import '@/types/crossSection';

const props = defineProps<{
  /** Label of an existing cross section to edit; omit to create a new one. */
  label?: string;
}>();

const projectStore = useProjectStore();
const appStore = useAppStore();
const { t } = useI18n();

const open = ref(true);
const isEdit = computed(() => props.label !== undefined && projectStore.solver.domain.crossSections.has(props.label));

// ---------------------------------------------------------------------------
// Initial state
// ---------------------------------------------------------------------------

const nextFreeLabel = () => {
  const domain = projectStore.solver.domain;
  let nid = domain.crossSections.size + 1;
  while (domain.crossSections.has(nid.toString())) nid++;
  return nid.toString();
};

const initialShape = (): SectionShape => {
  const cs = props.label !== undefined ? projectStore.solver.domain.crossSections.get(props.label) : undefined;
  if (cs?.shape) return cloneShape(cs.shape);

  // Rebuild an equivalent rectangle from the existing a/h pair when possible.
  if (cs && cs.h > 0 && cs.a > 0 && Number.isFinite(cs.a / cs.h)) {
    return createPresetShape('rectangle', { b: cs.a / cs.h, h: cs.h });
  }

  return createPresetShape('rectangle');
};

const existing = props.label !== undefined ? projectStore.solver.domain.crossSections.get(props.label) : undefined;

const shape = reactive<SectionShape>(initialShape());
const csLabel = ref(existing?.label ?? nextFreeLabel());
const shear = ref(`${existing?.k ?? 0.833}`);
const selected = ref<{ ci: number; vi: number } | null>(null);
const tab = ref<'vertices' | 'properties'>('vertices');
const activeContour = ref(0);
const current = computed<SectionContour | undefined>(() => shape.contours[activeContour.value]);
const contoursRef = ref<HTMLElement | null>(null);

/**
 * Selects a vertex and points the contour editor at it (active contour + scroll to row).
 * Deliberately never changes the Vertices/Properties tab: the user chose that view.
 */
const revealVertex = (ci: number, vi: number) => {
  selected.value = { ci, vi };
  activeContour.value = ci;
  nextTick(() => {
    document.getElementById(`vertex-row-${ci}-${vi}`)?.scrollIntoView({ block: 'nearest' });
  });
};

const labelRules = [
  (v: string) => v.trim() !== '' || t('validators.enterValue'),
  (v: string) => {
    if (existing && v === existing.label) return true;
    return !projectStore.solver.domain.crossSections.has(v) || t('dialogs.polygonSection.labelInUse');
  },
];

// ---------------------------------------------------------------------------
// Units
// ---------------------------------------------------------------------------

const toDisplay = (m: number) => appStore.convertLength(m);
const toModel = (v: number) => appStore.convertInverseLength(v);
const formatLength = (m: number) => formatCompactNumber(toDisplay(m));

const snapStep = ref(formatCompactNumber(toDisplay(0.005)));
const snapStepModel = computed(() => {
  const v = parseFloat2(snapStep.value);
  return v > 0 ? toModel(v) : 0;
});

const snap = (v: number) => {
  const step = snapStepModel.value;
  if (step <= 0) return v;
  return Math.round(v / step) * step;
};

// ---------------------------------------------------------------------------
// Presets
// ---------------------------------------------------------------------------

const presetId = ref<SectionPresetId>('rectangle');
const presetItems = computed(() =>
  (Object.keys(sectionPresetParams) as SectionPresetId[]).map((id) => ({
    value: id,
    title: t(`dialogs.polygonSection.presets.${id}`),
  }))
);
const presetParams = computed(() => sectionPresetParams[presetId.value]);
const presetValues = reactive<Record<SectionPresetParam, string>>({
  b: formatCompactNumber(toDisplay(sectionPresetDefaults.b)),
  h: formatCompactNumber(toDisplay(sectionPresetDefaults.h)),
  tw: formatCompactNumber(toDisplay(sectionPresetDefaults.tw)),
  tf: formatCompactNumber(toDisplay(sectionPresetDefaults.tf)),
  t: formatCompactNumber(toDisplay(sectionPresetDefaults.t)),
  d: formatCompactNumber(toDisplay(sectionPresetDefaults.d)),
  n: `${sectionPresetDefaults.n}`,
});

const replaceShape = (next: SectionShape) => {
  shape.contours.splice(0, shape.contours.length, ...next.contours);
  selected.value = null;
  activeContour.value = 0;
};

const applyPreset = () => {
  const params: Partial<Record<SectionPresetParam, number>> = {};
  for (const p of presetParams.value) {
    const v = parseFloat2(presetValues[p]);
    params[p] = p === 'n' ? v : toModel(v);
  }
  replaceShape(createPresetShape(presetId.value, params));
};

const recenter = () => replaceShape(centerShape(cloneShape(shape)));

// ---------------------------------------------------------------------------
// Geometry editing
// ---------------------------------------------------------------------------

const edgeMidpoints = (contour: SectionContour): SectionPoint[] =>
  contour.points.map((p, i) => {
    const q = contour.points[(i + 1) % contour.points.length];
    return [(p[0] + q[0]) / 2, (p[1] + q[1]) / 2];
  });

const insertVertex = (ci: number, at: number, pt: SectionPoint) => {
  shape.contours[ci].points.splice(at, 0, [pt[0], pt[1]]);
  revealVertex(ci, at);
};

const appendVertex = (ci: number) => {
  const pts = shape.contours[ci].points;
  const last = pts[pts.length - 1];
  const first = pts[0];
  insertVertex(ci, pts.length, [(last[0] + first[0]) / 2, (last[1] + first[1]) / 2]);
};

const removeVertex = (ci: number, vi: number) => {
  const pts = shape.contours[ci].points;
  if (pts.length <= 3) return;
  pts.splice(vi, 1);
  selected.value = null;
};

const removeContour = (ci: number) => {
  if (ci === 0) return;
  shape.contours.splice(ci, 1);
  selected.value = null;
  activeContour.value = 0;
};

const addHole = () => {
  // A small hole around the centroid so it is immediately visible and inside the outline.
  const p = computeSectionProperties(shape);
  const size = Math.max(p.b, p.h) * 0.2 || 0.02;
  shape.contours.push({
    hole: true,
    points: [
      [p.cy - size / 2, p.cz - size / 2],
      [p.cy + size / 2, p.cz - size / 2],
      [p.cy + size / 2, p.cz + size / 2],
      [p.cy - size / 2, p.cz + size / 2],
    ],
  });
  revealVertex(shape.contours.length - 1, 0);
};

const setCoord = (ci: number, vi: number, axis: 0 | 1, el: HTMLInputElement) => {
  const v = parseFloat2(el.value);
  if (!Number.isFinite(v)) {
    el.value = formatLength(shape.contours[ci].points[vi][axis]);
    return;
  }
  shape.contours[ci].points[vi][axis] = toModel(v);
};

// Dragging vertices on the canvas ------------------------------------------

const svgRef = ref<SVGSVGElement | null>(null);
const { width: canvasWidth, height: canvasHeight } = useElementSize(svgRef);
const drag = ref<{ ci: number; vi: number } | null>(null);
const frozenViewBox = ref<{ x: number; y: number; w: number; h: number } | null>(null);

const pointerToModel = (e: PointerEvent): SectionPoint | null => {
  const svg = svgRef.value;
  if (!svg) return null;
  const ctm = svg.getScreenCTM();
  if (!ctm) return null;
  const pt = new DOMPoint(e.clientX, e.clientY).matrixTransform(ctm.inverse());
  // Screen x is mirrored: y points to the left.
  return [-pt.x, pt.y];
};

const startDrag = (ci: number, vi: number, e: PointerEvent) => {
  drag.value = { ci, vi };
  revealVertex(ci, vi);
  frozenViewBox.value = { ...computedViewBox.value };
  svgRef.value?.setPointerCapture(e.pointerId);
};

const onPointerMove = (e: PointerEvent) => {
  if (!drag.value) return;
  const p = pointerToModel(e);
  if (!p) return;
  const target = shape.contours[drag.value.ci].points[drag.value.vi];
  target[0] = snap(p[0]);
  target[1] = snap(p[1]);
};

const onPointerUp = (e: PointerEvent) => {
  if (!drag.value) return;
  drag.value = null;
  frozenViewBox.value = null;
  if (svgRef.value?.hasPointerCapture(e.pointerId)) svgRef.value.releasePointerCapture(e.pointerId);
};

// ---------------------------------------------------------------------------
// Derived properties and drawing
// ---------------------------------------------------------------------------

const properties = computed(() => computeSectionProperties(shape));
const shapeValid = computed(() => isShapeValid(shape));
const alphaDeg = computed(() => (properties.value.alpha * 180) / Math.PI);

const computedViewBox = computed(() => {
  let ymin = Infinity;
  let ymax = -Infinity;
  let zmin = Infinity;
  let zmax = -Infinity;
  for (const c of shape.contours) {
    for (const [y, z] of c.points) {
      ymin = Math.min(ymin, y);
      ymax = Math.max(ymax, y);
      zmin = Math.min(zmin, z);
      zmax = Math.max(zmax, z);
    }
  }
  if (!Number.isFinite(ymin)) return { x: -0.1, y: -0.1, w: 0.2, h: 0.2 };

  // Keep the ellipse of inertia inside the canvas as well.
  const p = properties.value;
  if (p.a > 0) {
    const r = Math.max(p.r1, p.r2);
    ymin = Math.min(ymin, p.cy - r);
    ymax = Math.max(ymax, p.cy + r);
    zmin = Math.min(zmin, p.cz - r);
    zmax = Math.max(zmax, p.cz + r);
  }

  const span = Math.max(ymax - ymin, zmax - zmin, 1e-6);
  const pad = span * 0.2;
  const w = ymax - ymin + 2 * pad;
  const h = zmax - zmin + 2 * pad;
  // Match the rendered canvas aspect so no space is wasted on letterboxing.
  const aspect = canvasWidth.value > 0 && canvasHeight.value > 0 ? canvasWidth.value / canvasHeight.value : 3 / 2;
  const targetH = Math.max(h, w / aspect);
  const targetW = Math.max(w, targetH * aspect);
  return {
    x: (ymin + ymax) / 2 - targetW / 2,
    y: (zmin + zmax) / 2 - targetH / 2,
    w: targetW,
    h: targetH,
  };
});

/** View box in section coordinates (y, z). */
const vb = computed(() => frozenViewBox.value ?? computedViewBox.value);
/** y -> screen x (mirrored so that y points left). */
const toScreenX = (y: number) => -y;
/** The SVG viewBox is expressed in screen coordinates, i.e. mirrored in x. */
const viewBoxString = computed(() => `${toScreenX(vb.value.x + vb.value.w)} ${vb.value.y} ${vb.value.w} ${vb.value.h}`);

/** Positions for the principal-axis labels, placed along each axis inside the canvas (section coords). */
const principalLabelRadius = computed(() => Math.min(vb.value.w, vb.value.h) * 0.42);
const principalLabel1 = computed<[number, number]>(() => {
  const p = properties.value;
  const r = principalLabelRadius.value;
  return [p.cy + r * Math.cos(p.alpha), p.cz + r * Math.sin(p.alpha)];
});
const principalLabel2 = computed<[number, number]>(() => {
  const p = properties.value;
  const r = principalLabelRadius.value;
  return [p.cy - r * Math.sin(p.alpha), p.cz + r * Math.cos(p.alpha)];
});
const handleR = computed(() => Math.min(vb.value.w, vb.value.h) * 0.014);
const fontSize = computed(() => Math.min(vb.value.w, vb.value.h) * 0.045);
const axisLen = computed(() => Math.max(vb.value.w, vb.value.h));

const holePaths = computed(() =>
  shape.contours
    .filter((c) => c.hole && c.points.length >= 3)
    .map((c) => `M${c.points.map((p) => `${p[0]},${p[1]}`).join('L')}Z`)
);

const activeContourPath = computed(() => {
  const c = current.value;
  if (!c || c.points.length < 3) return '';
  return `M${c.points.map((p) => `${p[0]},${p[1]}`).join('L')}Z`;
});

const areaUnitHtml = computed(() => formatMeasureAsHTML(appStore.units.Area));
const inertiaUnitHtml = computed(() => formatMeasureAsHTML(appStore.units.AreaM2));

const sectionPath = computed(() =>
  shape.contours
    .filter((c) => c.points.length >= 3)
    .map((c) => `M${c.points.map((p) => `${p[0]},${p[1]}`).join('L')}Z`)
    .join(' ')
);

/** Short "(centroidal)" marker used in the property labels. */
const centroidalSuffix = computed(
  () => `<span class="text-medium-emphasis">(${t('dialogs.polygonSection.centroidal')})</span>`
);

const propertyRows = computed(() => {
  const p = properties.value;
  const lengthU = formatMeasureAsHTML(appStore.units.Length);
  const areaU = formatMeasureAsHTML(appStore.units.Area);
  const inertiaU = formatMeasureAsHTML(appStore.units.AreaM2);
  const num = (v: number) => formatScientificNumber(v);
  const len = (v: number) => formatCompactNumber(toDisplay(v));

  return [
    { key: 'a', title: t('crossSection.area') + ' A', value: num(appStore.convertArea(p.a)), units: areaU },
    { key: 'cy', title: t('crossSection.centroid') + ' y<sub>c</sub>', value: len(p.cy), units: lengthU },
    { key: 'cz', title: t('crossSection.centroid') + ' z<sub>c</sub>', value: len(p.cz), units: lengthU },
    {
      key: 'iy',
      title: 'I<sub>y</sub> ' + centroidalSuffix.value,
      value: num(appStore.convertAreaM2(p.iy)),
      units: inertiaU,
    },
    {
      key: 'iz',
      title: 'I<sub>z</sub> ' + centroidalSuffix.value,
      value: num(appStore.convertAreaM2(p.iz)),
      units: inertiaU,
    },
    {
      key: 'iyz',
      title: 'I<sub>yz</sub> ' + centroidalSuffix.value,
      value: num(appStore.convertAreaM2(p.iyz)),
      units: inertiaU,
    },
    { key: 'i1', title: 'I<sub>1</sub>', value: num(appStore.convertAreaM2(p.i1)), units: inertiaU },
    { key: 'i2', title: 'I<sub>2</sub>', value: num(appStore.convertAreaM2(p.i2)), units: inertiaU },
    { key: 'alpha', title: t('crossSection.alpha') + ' α', value: formatCompactNumber(alphaDeg.value, 4), units: '°' },
    {
      key: 'ry',
      title: t('crossSection.radiusOfGyration') + ' i<sub>y</sub>',
      value: len(p.ry),
      units: lengthU,
    },
    {
      key: 'rz',
      title: t('crossSection.radiusOfGyration') + ' i<sub>z</sub>',
      value: len(p.rz),
      units: lengthU,
    },
    { key: 'h', title: t('crossSection.h') + ' h', value: len(p.h), units: lengthU },
    { key: 'b', title: t('crossSection.b') + ' b', value: len(p.b), units: lengthU },
  ];
});

// ---------------------------------------------------------------------------
// Save
// ---------------------------------------------------------------------------

const canSave = computed(
  () => shapeValid.value && parseFloat2(shear.value) > 0 && labelRules.every((rule) => rule(csLabel.value) === true)
);

const save = () => {
  if (!canSave.value) return;

  const domain = projectStore.solver.domain;
  const p = properties.value;
  const k = parseFloat2(shear.value);
  const newLabel = csLabel.value.trim();

  executeModelMutationWithUndo(() => {
    setUnsolved();

    let cs = existing;
    if (!cs) {
      cs = domain.createCrossSection(newLabel, {});
    } else if (cs.label !== newLabel) {
      domain.crossSections.delete(cs.label);
      for (const element of domain.elements.values()) {
        if (element.cs === cs.label) element.cs = newLabel;
      }
      cs.label = newLabel;
      domain.crossSections.set(newLabel, cs);
    }

    cs.a = p.a;
    cs.iy = p.iy;
    cs.iz = p.iz;
    cs.dyz = p.iyz;
    cs.h = p.h;
    cs.k = k;
    cs.shape = cloneShape(shape);

    domain.crossSections = new Map(domain.crossSections);
  });

  closeModal();
};

// Keep the preset height/width fields in sync with the current bounding box so
// "Apply" after tweaking a single parameter stays predictable.
watch(
  presetId,
  () => {
    presetValues.b = formatCompactNumber(toDisplay(properties.value.b || sectionPresetDefaults.b));
    presetValues.h = formatCompactNumber(toDisplay(properties.value.h || sectionPresetDefaults.h));
    presetValues.d = presetValues.h;
  },
  { immediate: true }
);
</script>

<style scoped>
.section-canvas {
  display: block;
  width: 100%;
  height: clamp(240px, 40vh, 360px);
  background: rgb(var(--v-theme-surface));
  border: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
  touch-action: none;
  user-select: none;
}

.section-fill {
  fill: rgba(var(--v-theme-primary), 0.25);
  stroke: rgb(var(--v-theme-primary));
  stroke-width: 1.5px;
  vector-effect: non-scaling-stroke;
}

.axis-line {
  stroke: rgba(var(--v-theme-on-surface), 0.45);
  stroke-width: 1px;
  stroke-dasharray: 6 4;
  vector-effect: non-scaling-stroke;
}

.axis-arrow {
  fill: rgba(var(--v-theme-on-surface), 0.45);
}

.axis-label,
.principal-label {
  fill: rgba(var(--v-theme-on-surface), 0.7);
  font-style: italic;
}

.principal-line {
  stroke: #e67e22;
  stroke-width: 1px;
  stroke-dasharray: 2 3;
  vector-effect: non-scaling-stroke;
}

.principal-label {
  fill: #e67e22;
}

.inertia-ellipse {
  fill: rgba(230, 126, 34, 0.08);
  stroke: #e67e22;
  stroke-width: 1.2px;
  vector-effect: non-scaling-stroke;
}

.centroid {
  fill: #e67e22;
}

.vertex-handle {
  fill: #fff;
  stroke: rgb(var(--v-theme-primary));
  stroke-width: 1.5px;
  vector-effect: non-scaling-stroke;
  cursor: move;
}

.vertex-handle.hole {
  stroke: #c0392b;
}

.vertex-handle.selected,
.vertex-handle:hover {
  fill: rgb(var(--v-theme-primary));
}

.vertex-handle.hole.selected,
.vertex-handle.hole:hover {
  fill: #c0392b;
}

.edge-handle {
  fill: rgba(var(--v-theme-surface), 0.9);
  stroke: rgba(var(--v-theme-on-surface), 0.4);
  stroke-width: 1px;
  vector-effect: non-scaling-stroke;
  cursor: copy;
}

.edge-handle:hover {
  stroke: rgb(var(--v-theme-primary));
}

.hole-stroke {
  fill: none;
  stroke: #c0392b;
  stroke-width: 1.5px;
  stroke-dasharray: 5 3;
  vector-effect: non-scaling-stroke;
}

.active-stroke {
  fill: none;
  stroke: rgb(var(--v-theme-primary));
  stroke-width: 3px;
  vector-effect: non-scaling-stroke;
  pointer-events: none;
}

.active-stroke.hole {
  stroke: #c0392b;
}

.vertex-handle.inactive,
.edge-handle.inactive {
  opacity: 0.35;
}

.contour-chip {
  font-weight: 500;
}

.contour-chip:not(.active) {
  opacity: 0.75;
}

.contour-chip:not(.active):hover {
  opacity: 1;
}

.contours.hole {
  border-top: 3px solid #c0392b;
}

.contours.hole .vertex-table thead th {
  background: color-mix(in srgb, #c0392b 8%, rgb(var(--v-theme-surface)));
}

.contours:not(.hole) {
  border-top: 3px solid rgb(var(--v-theme-primary));
}

.contours:not(.hole) .vertex-table thead th {
  background: color-mix(in srgb, rgb(var(--v-theme-primary)) 8%, rgb(var(--v-theme-surface)));
}

.legend {
  display: flex;
  flex-wrap: wrap;
  gap: 4px 14px;
}

.legend span {
  display: inline-flex;
  align-items: center;
}

.sw {
  display: inline-block;
  width: 14px;
  height: 10px;
  margin-right: 6px;
  box-sizing: border-box;
  border-radius: 2px;
}

.sw-outline {
  background: rgba(var(--v-theme-primary), 0.25);
  border: 1.5px solid rgb(var(--v-theme-primary));
}

.sw-hole {
  background: transparent;
  border: 1.5px dashed #c0392b;
}

.sw-principal {
  background: rgba(230, 126, 34, 0.08);
  border: 1.5px solid #e67e22;
  border-radius: 50%;
}

.sw-centroid {
  width: 8px;
  height: 8px;
  margin-left: 3px;
  margin-right: 9px;
  border-radius: 50%;
  background: #e67e22;
}

.summary {
  border-top: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
  padding-top: 6px;
}

.contours {
  max-height: 280px;
  overflow-y: auto;
  border: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
}

.vertex-table,
.props-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.85rem;
}

.vertex-table th,
.vertex-table td,
.props-table td {
  padding: 1px 6px;
  border-bottom: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
  white-space: nowrap;
}

.vertex-table thead th {
  position: sticky;
  top: 0;
  z-index: 1;
  font-weight: 500;
  text-align: left;
  /* Opaque so rows never show through while scrolling */
  background: rgb(var(--v-theme-surface));
  box-shadow: inset 0 -1px 0 rgba(var(--v-border-color), var(--v-border-opacity));
}

.contour-bar :deep(.v-slide-group__content) {
  gap: 4px;
}

.vertex-table tr.selected td {
  background: rgba(var(--v-theme-primary), 0.12);
}

.coord-input {
  width: 100%;
  min-width: 70px;
  border: none;
  background: transparent;
  outline: none;
  font: inherit;
  color: inherit;
}

.coord-input:focus {
  background: rgba(var(--v-theme-primary), 0.08);
}
</style>
