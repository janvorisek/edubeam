<template>
  <div style="border-top: 1px solid #ddd">
    <v-tabs v-model="tab" bg-color="primary" :show-arrows="false" height="36">
      <v-tab v-for="(tab, index) in tabs" :key="index">
        <v-icon small class="mr-3">{{ tab.icon }}</v-icon>
        {{ tab.title }}
      </v-tab>
    </v-tabs>
    <v-window v-model="tab" touchless class="text-body-2" style="height: 220px">
      <v-window-item :key="'tab-nodes'" style="height: 220px" :transition="false" @touchstart.prevent.stop>
        <div>
          <v-btn size="small" variant="flat" color="secondary" :rounded="0" @click.stop="showDialog('addNode')">
            <v-icon small>mdi-plus</v-icon> Add node
          </v-btn>
        </div>
        <v-data-table
          ref="table-nodes"
          :headers="headers.nodes"
          :items="nodes"
          density="compact"
          height="192"
          fixed-header
          :items-per-page="-1"
          disable-pagination
          hide-default-footer
          mobile-breakpoint="0"
          item-key="label"
        >
          <template #item.label="{ item }">
            <input
              :value="item.raw.label"
              @change="changeLabel('nodes', item.raw, $event.target as HTMLInputElement)"
              class="inline-edit"
            />
          </template>
          <template #item.coords[0]="{ item }">
            <input
              :value="item.raw.coords[0]"
              @change="changeSetArrayItem(item.raw, 'coords', 0, $event.target as HTMLInputElement)"
              type="number"
              class="inline-edit"
            />
          </template>
          <template #item.coords[2]="{ item }">
            <input
              :value="item.raw.coords[2]"
              @change="changeSetArrayItem(item.raw, 'coords', 2, $event.target as HTMLInputElement)"
              type="number"
              class="inline-edit"
            />
          </template>
          <template #item.bcs0="{ item }">
            <input type="checkbox" :checked="item.raw.bcs.has(0)" @click="toggleSet(item.raw, 'bcs', 0)" />
          </template>
          <template #item.bcs2="{ item }">
            <input type="checkbox" :checked="item.raw.bcs.has(2)" @click="toggleSet(item.raw, 'bcs', 2)" />
          </template>
          <template #item.bcs4="{ item }">
            <input type="checkbox" :checked="item.raw.bcs.has(4)" @click="toggleSet(item.raw, 'bcs', 4)" />
          </template>
          <template #item.actions="{ item }">
            <v-icon small @click="deleteNode(item.raw.label)"> mdi-close </v-icon>
          </template>
        </v-data-table>
      </v-window-item>

      <v-window-item :key="'tab-elements'" :transition="false" style="height: 220px">
        <v-btn size="small" variant="flat" color="secondary" :rounded="0" @click.stop="showDialog('addElement')">
          <v-icon small>mdi-plus</v-icon> Add element
        </v-btn>
        <v-data-table
          :headers="headers.elements"
          :items="elements"
          density="compact"
          height="192"
          fixed-header
          :items-per-page="-1"
          disable-pagination
          hide-default-footer
          mobile-breakpoint="0"
          item-key="label"
        >
          <template #item.label="{ item }">
            <input
              :value="item.raw.label"
              @change="changeLabel('elements', item.raw, $event.target as HTMLInputElement)"
              class="inline-edit"
            />
          </template>
          <template #item.type> Beam2D </template>
          <template #item.nodes="{ item }">
            <div class="d-flex">
              <select class="mini-select" v-model="item.raw.nodes[0]" @change="solve" style="width: 100%">
                <option
                  v-for="node in nodes.filter((e) => e.label != item.raw.nodes[1])"
                  :value="node.label"
                  :key="node.label"
                >
                  {{ `Node ${node.label}` }}
                </option>
              </select>
              <a href="#" class="text-decoration-none text-primary" @click.stop="swapNodes(item.raw)">
                <v-icon small>mdi-swap-horizontal</v-icon>
              </a>
              <select class="mini-select" v-model="item.raw.nodes[1]" @change="solve" style="width: 100%">
                <option
                  v-for="node in nodes.filter((e) => e.label != item.raw.nodes[0])"
                  :value="node.label"
                  :key="node.label"
                >
                  {{ `Node ${node.label}` }}
                </option>
              </select>
            </div>
          </template>
          <template #item.material="{ item }">
            <select class="mini-select" v-model.number="item.raw.mat" @change="solve" style="width: 100%">
              <option v-for="node in materials" :value="node.label" :key="node.label">
                {{ node.label }}
              </option>
            </select>
            <!--<input
              v-model.number="item.mat"
              type="number"
              class="inline-edit"
            />-->
          </template>
          <template #item.cs="{ item }">
            <select class="mini-select" v-model.number="item.raw.cs" @change="solve" style="width: 100%">
              <option v-for="node in crossSections" :value="node.label" :key="node.label">
                {{ node.label }}
              </option>
            </select>
          </template>
          <template #item.hinges[0]="{ item }">
            <input
              type="checkbox"
              :checked="item.raw.hinges[0]"
              @click="toggleArray(item.raw, 'hinges', 0)"
            />&mdash;<input type="checkbox" :checked="item.raw.hinges[1]" @click="toggleArray(item.raw, 'hinges', 1)" />
          </template>
          <template #item.diagonalMassMatrix="{ item }">
            <select class="mini-select" v-model="item.raw.diagonalMassMatrix" @change="solve" style="width: 100%">
              <option :value="false">consistent</option>
              <option :value="true">lumped</option>
            </select>
            <!--<input
              v-model.number="item.mat"
              type="number"
              class="inline-edit"
            />-->
          </template>
          <template #item.actions="{ item }">
            <v-icon small @click="deleteElement(item.raw.label)"> mdi-close </v-icon>
          </template>
        </v-data-table>
      </v-window-item>

      <v-window-item :key="'tab-loads'" :transition="false" style="height: 220px">
        <div>
          <v-btn size="small" variant="flat" color="secondary" :rounded="0" @click.stop="showDialog('addNodalLoad')">
            <v-icon small>mdi-plus</v-icon> Add nodal load
          </v-btn>
          <v-btn
            size="small"
            variant="flat"
            color="secondary"
            style="border-left: 1px solid #ccc"
            :rounded="0"
            @click.stop="showDialog('addElementLoad')"
          >
            <v-icon small>mdi-plus</v-icon> Add element load
          </v-btn>
        </div>
        <v-data-table
          :headers="headers.loads"
          :items="loads"
          density="compact"
          height="192"
          fixed-header
          :items-per-page="-1"
          disable-pagination
          hide-default-footer
          mobile-breakpoint="0"
          item-key="label"
        >
          <template #item.type="{ item }">
            {{ item.raw.type === "node" ? "Nodal load" : "Element load" }}
          </template>

          <template #item.load.values="{ item }">
            <div class="d-flex" v-if="item.raw.type === 'node'">
              <span>F<sub>x</sub>:</span>
              <input
                :value="item.raw.ref.values[0]"
                @change="changeSetArrayItem(item.raw.ref, 'values', 0, $event.target as HTMLInputElement)"
                type="number"
                class="inline-edit w-50 mr-2"
              />
              <span>F<sub>z</sub>:</span>
              <input
                :value="item.raw.ref.values[2]"
                @change="changeSetArrayItem(item.raw.ref, 'values', 2, $event.target as HTMLInputElement)"
                type="number"
                class="inline-edit w-50"
              />
              <span>M<sub>y</sub>:</span>
              <input
                :value="item.raw.ref.values[4]"
                @change="changeSetArrayItem(item.raw.ref, 'values', 4, $event.target as HTMLInputElement)"
                type="number"
                class="inline-edit w-50"
              />
            </div>

            <div class="d-flex align-content-center" v-if="item.raw.type === 'element'">
              x:
              <input
                :value="item.raw.ref.values[0]"
                @change="changeSetArrayItem(item.raw.ref, 'values', 0, $event.target as HTMLInputElement)"
                type="number"
                class="inline-edit w-50 mr-2"
              />
              z:
              <input
                :value="item.raw.ref.values[1]"
                @change="changeSetArrayItem(item.raw.ref, 'values', 1, $event.target as HTMLInputElement)"
                type="number"
                class="inline-edit w-50 mr-2"
              />
              lcs: <input type="checkbox" :checked="item.raw.ref.lcs" @click="toggleBoolean(item.raw.ref, 'lcs')" />
            </div>
          </template>

          <template #item.target="{ item }">
            <select
              class="mini-select"
              v-if="item.raw.type === 'node'"
              v-model="item.raw.ref.target"
              @change="solve"
              style="width: 100%"
            >
              <option v-for="node in nodes" :value="node.label" :key="node.label">
                {{ `Node ${node.label}` }}
              </option>
            </select>

            <select
              class="mini-select"
              v-if="item.raw.type === 'element'"
              v-model="item.raw.ref.target"
              @change="solve"
              style="width: 100%"
            >
              <option v-for="node in elements" :value="node.label" :key="node.label">
                {{ `Element ${node.label}` }}
              </option>
            </select>
          </template>
        </v-data-table>
      </v-window-item>

      <v-window-item :key="'tab-mats'" style="height: 220px" :transition="false">
        <v-data-table
          :headers="headers.materials"
          :items="materials"
          density="compact"
          height="220"
          fixed-header
          :items-per-page="-1"
          disable-pagination
          hide-default-footer
          mobile-breakpoint="0"
          item-key="label"
        >
          <template #item.label="{ item }">
            <input
              :value="item.raw.label"
              @change="changeLabel('materials', item.raw, $event.target as HTMLInputElement)"
              class="inline-edit"
            />
          </template>
          <template #item.e="{ item }">
            <input @change="solve" v-model.number="item.raw.e" type="number" class="inline-edit" />
          </template>
          <template #item.g="{ item }">
            <input @change="solve" v-model.number="item.raw.g" type="number" class="inline-edit" />
          </template>
          <template #column.alpha="{ column }">
            <v-tooltip :text="column.tooltip" location="bottom">
              <template #activator="{ props }">
                <div v-bind="props" class="d-flex align-center">
                  {{ column.title }}
                  <v-icon icon="mdi-help" size="12" />
                </div>
              </template>
            </v-tooltip>
          </template>
          <template #item.alpha="{ item }">
            <input @change="solve" v-model.number="item.raw.alpha" type="number" class="inline-edit" />
          </template>
          <template #item.d="{ item }">
            <input @change="solve" v-model.number="item.raw.d" type="number" class="inline-edit" />
          </template>
        </v-data-table>
      </v-window-item>

      <v-window-item :key="'tab-cs'" style="height: 220px" :transition="false">
        <v-data-table
          :headers="headers.crossSections"
          :items="crossSections"
          density="compact"
          height="220"
          fixed-header
          :items-per-page="-1"
          disable-pagination
          hide-default-footer
          mobile-breakpoint="0"
          item-key="label"
        >
          <template #item.label="{ item }">
            <input
              :value="item.raw.label"
              @change="changeLabel('crossSections', item.raw, $event.target as HTMLInputElement)"
              class="inline-edit"
            />
          </template>
          <template #item.a="{ item }">
            <input @change="solve" v-model.number="item.raw.a" type="number" class="inline-edit" />
          </template>
          <template #item.iy="{ item }">
            <input @change="solve" v-model.number="item.raw.iy" type="number" class="inline-edit" />
          </template>
          <template #item.h="{ item }">
            <input @change="solve" v-model.number="item.raw.h" type="number" class="inline-edit" />
          </template>
          <template #item.k="{ item }">
            <input @change="solve" v-model.number="item.raw.k" type="number" class="inline-edit" />
          </template>
        </v-data-table>
      </v-window-item>
    </v-window>
  </div>
</template>

<script setup lang="ts">
import {
  Node,
  Element,
  Material,
  CrossSection,
  Solver,
  Domain,
  LoadCase,
  BeamElementUniformEdgeLoad,
  NodalLoad,
} from "ts-fem";

import { ref, onMounted, computed, watch, nextTick } from "vue";
import { useProjectStore } from "../store/project";
import { useAppStore } from "../store/app";

const tab = ref(null);

onMounted(() => {
  window.addEventListener("keydown", (e) => {
    if (e.key == "Escape" || e.keyCode === 13) {
      (document.activeElement as HTMLElement).blur();
    }
  });
});

const showDialog = (name: "addNode" | "addElement" | "addNodalLoad" | "addElementLoad") => {
  useAppStore().dialogs[name] = true;
};

const swapNodes = (el: Element) => {
  el.nodes = el.nodes.reverse();
  solve();
};

const changeSetArrayItem = (item: unknown, set: string, value: number, el?: HTMLInputElement) => {
  setUnsolved();

  if (isNaN(parseFloat(el.value))) return;

  item[set][value] = parseFloat(el.value);

  solve();
};

const changeItem = (item: object, value: number, el?: HTMLInputElement) => {
  setUnsolved();

  if (isNaN(parseFloat(el.value))) return;

  item[value] = parseFloat(el.value);

  solve();
};

const changeLabel = (map: string, item: { label: string }, el?: HTMLInputElement) => {
  setUnsolved();

  //if (isNaN(parseInt(el.value))) return;
  if (useProjectStore().solver.domain[map].has(el.value)) {
    alert("ERROR: Label " + el.value + " already used!");
    el.value = item.label;
    return;
  }

  const prevId = item.label;

  // @ts-expect-error ts-fem is wrongly typed
  item.label = isNaN(el.value) ? el.value : parseInt(el.value);
  useProjectStore().solver.domain[map].set(item.label, item);

  if (map === "nodes") {
    for (const [key, element] of useProjectStore().solver.domain.elements) {
      // @ts-expect-error ts-fem is wrongly typed
      const idtomodify = element.nodes.findIndex((nid) => nid == prevId);
      if (idtomodify > -1) {
        // @ts-expect-error ts-fem is wrongly typed
        element.nodes[idtomodify] = item.label;
      }
    }

    for (const load of useProjectStore().solver.loadCases[0].nodalLoadList) {
      // @ts-expect-error ts-fem is wrongly typed
      if (load.target == prevId) {
        // @ts-expect-error ts-fem is wrongly typed
        load.target = item.label;
      }
    }
  }

  if (map === "materials") {
    for (const [key, element] of useProjectStore().solver.domain.elements) {
      // @ts-expect-error ts-fem is wrongly typed
      if (element.mat == prevId) {
        // @ts-expect-error ts-fem is wrongly typed
        element.mat = item.label;
      }
    }
  }

  if (map === "crossSections") {
    for (const [key, element] of useProjectStore().solver.domain.elements) {
      // @ts-expect-error ts-fem is wrongly typed
      if (element.cs == prevId) {
        // @ts-expect-error ts-fem is wrongly typed
        element.cs = item.label;
      }
    }
  }

  // delete current
  useProjectStore().solver.domain[map].delete(prevId);

  solve();
};

const toggleSet = (item: unknown, set: string, value: number) => {
  setUnsolved();

  if (item[set].has(value)) item[set].delete(value);
  else item[set].add(value);

  item[set] = new Set(item[set].values());

  solve();
};

const toggleArray = (item: unknown, set: string, value: number) => {
  setUnsolved();
  //Vue.set(item[set], value, !item[set][value]);
  item[set][value] = !item[set][value];
  solve();
};

const toggleBoolean = (item: unknown, value: string) => {
  setUnsolved();
  item[value] = !item[value];
  solve();
};

const deleteElement = (id: number) => {
  // delete element load
  for (const lc of useProjectStore().solver.loadCases) {
    for (let i = 0; i < lc.elementLoadList.length; i++) {
      if (lc.elementLoadList[i].target === id) {
        lc.elementLoadList.splice(i, 1);
        i--;
      }
    }
  }

  useProjectStore().solver.domain.elements.delete(id);
  useProjectStore().solver.domain.elements = new Map(useProjectStore().solver.domain.elements);

  solve();
};

const deleteNode = (id: number) => {
  // delete elements first
  for (const [key, value] of useProjectStore().solver.domain.elements) {
    if (value.nodes[0] === id || value.nodes[1] === id) {
      deleteElement(key);
    }
  }

  useProjectStore().solver.domain.nodes.delete(id);
  useProjectStore().solver.domain.nodes = new Map(useProjectStore().solver.domain.nodes);

  solve();
};

const solve = () => {
  nextTick(() => {
    useProjectStore().solve();
  });
};

const setUnsolved = () => {
  useProjectStore().solver.loadCases[0].solved = false;
};

const nodes = computed(() => {
  const nodeVals = useProjectStore().solver.domain.nodes.values();
  const display: Node[] = [];

  for (const node of nodeVals) {
    display.push(node);
  }

  // @ts-expect-error ts-fem is wrongly typed
  return display.sort((a, b) => ("" + a.label).localeCompare(b.label, undefined, { numeric: true }));
});

const elements = computed(() => {
  const elements = useProjectStore().solver.domain.elements.values();
  const display: Element[] = [];

  for (const element of elements) {
    display.push(element);
  }

  return display;
});

const loads = computed(() => {
  const items = useProjectStore().solver.loadCases.values();
  const display: {
    target: number;
    type: string;
    loadCase: LoadCase;
    values: unknown;
    ref: BeamElementUniformEdgeLoad | NodalLoad;
  }[] = [];

  for (const item of items) {
    for (const load of item.elementLoadList) {
      display.push({
        target: load.target,
        type: "element",
        loadCase: item,
        values: load.values,
        ref: load,
      });
    }

    for (const load of item.nodalLoadList) {
      display.push({
        target: load.target,
        type: "node",
        loadCase: item,
        values: load.values,
        ref: load,
      });
    }
  }

  return display;
});

const materials = computed(() => {
  const items = useProjectStore().solver.domain.materials.values();
  const display: Material[] = [];

  for (const item of items) {
    display.push(item);
  }

  return display;
});

const crossSections = computed(() => {
  const items = useProjectStore().solver.domain.crossSections.values();
  const display: CrossSection[] = [];

  for (const item of items) {
    display.push(item);
  }

  return display;
});

const tabs = [
  {
    id: "nodes",
    title: "Nodes",
    icon: "mdi-square-medium-outline",
  },
  {
    id: "elements",
    title: "Elements",
    icon: "mdi-vector-line",
  },
  { id: "loads", title: "Loads", icon: "mdi-weight" },
  { id: "mats", title: "Materials", icon: "mdi-texture-box" },
  {
    id: "cs",
    title: "Cross sections",
    icon: "mdi-pentagon-outline",
  },
];

const headers = {
  nodes: [
    {
      title: "Node",
      key: "label",
      width: 100,
    },
    {
      title: "X",
      key: "coords[0]",
      width: 90,
    },
    {
      title: "Z",
      key: "coords[2]",
      width: 90,
    },
    {
      title: "Ux-bc",
      key: "bcs0",
      width: 90,
      sortable: false,
    },
    {
      title: "Uz-bc",
      key: "bcs2",
      width: 90,
      sortable: false,
    },

    {
      title: "Ry-bc",
      key: "bcs4",
      width: 90,
      sortable: false,
    },
    {
      title: "Actions",
      key: "actions",
      sortable: false,
    },
  ],
  elements: [
    {
      title: "Element",
      key: "label",
      width: 100,
    },
    {
      title: "Type",
      key: "type",
      width: 120,
    },
    {
      title: "Nodes",
      key: "nodes",
      width: 240,
    },
    {
      title: "Material",
      key: "material",
      width: 120,
    },
    {
      title: "Cross section",
      key: "cs",
      width: 160,
    },
    {
      title: "End hinges",
      key: "hinges[0]",
      width: 120,
      sortable: false,
      align: "center",
    },
    {
      title: "Mass matrix",
      key: "diagonalMassMatrix",
      width: 160,
    },
    {
      title: "Actions",
      key: "actions",
      sortable: false,
    },
  ],
  loads: [
    {
      title: "Type",
      key: "type",
      width: 120,
    },
    {
      title: "Target",
      key: "target",
      width: 140,
    },
    {
      title: "Components",
      key: "load.values",
      width: 280,
    },
    {
      title: "Load case",
      key: "loadCase.label",
      width: 160,
    },
    {
      title: "Actions",
      key: "actions",
      sortable: false,
    },
  ],
  materials: [
    {
      title: "Materials",
      key: "label",
      width: 120,
    },
    {
      title: "E",
      key: "e",
      width: 160,
    },
    {
      title: "G",
      key: "g",
      width: 160,
    },
    {
      title: "α_T",
      tooltip: "Temperature coefficient",
      key: "alpha",
      width: 120,
    },

    {
      title: "Density",
      key: "d",
      width: 120,
    },
    {
      title: "Actions",
      key: "actions",
      sortable: false,
    },
  ],
  crossSections: [
    {
      title: "Cross section",
      key: "label",
      width: 160,
    },
    {
      title: "Area",
      key: "a",
      width: 160,
    },

    {
      title: "Iy",
      key: "iy",
      width: 160,
    },
    {
      title: "Height",
      key: "h",
      width: 160,
    },
    {
      title: "Shear coeff.",
      key: "k",
      width: 160,
    },
    {
      title: "Actions",
      key: "actions",
      sortable: false,
    },
  ],
};
</script>

<style lang="scss"></style>
