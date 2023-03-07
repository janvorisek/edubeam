<template>
  <div style="border-top: 1px solid #ddd">
    <v-tabs v-model="appStore.bottomBarTab" bg-color="primary" :show-arrows="false" height="36">
      <v-tab v-for="(tab, index) in tabs" :key="index">
        <v-icon small class="mr-3">{{ tab.icon }}</v-icon>
        {{ tab.title }}
      </v-tab>
    </v-tabs>
    <v-window v-model="appStore.bottomBarTab" touchless class="text-body-2" style="height: 185px">
      <v-window-item
        :key="'tab-nodes'"
        style="height: 185px"
        :transition="false"
        :reverse-transition="false"
        @touchstart.prevent.stop
      >
        <div class="border-b border-t">
          <v-btn size="small" variant="flat" color="secondary" :rounded="0" @click.stop="showDialog('addNode')">
            <v-icon small>mdi-plus</v-icon> Add node
          </v-btn>
          <v-btn
            size="small"
            variant="flat"
            color="secondary"
            style="border-left: 1px solid #ccc"
            :rounded="0"
            @click.stop="appStore.mouseMode = MouseMode.ADD_NODE"
          >
            <v-icon small>mdi-cursor-default-outline</v-icon> Add node
          </v-btn>
        </div>
        <v-data-table
          ref="table-nodes"
          :headers="headers.nodes"
          :items="nodes"
          density="compact"
          height="155"
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
          <template #item.coords="{ item }">
            <div class="d-flex">
              <div class="inline-edit-group mr-2">
                <span class="input-before">x</span>
                <input
                  :value="item.raw.coords[0]"
                  @keydown="checkNumber($event)"
                  @change="changeSetArrayItem(item.raw, 'coords', 0, $event.target as HTMLInputElement)"
                  class="inline-edit"
                />
              </div>
              <div class="inline-edit-group mr-2">
                <span class="input-before">z</span>
                <input
                  :value="item.raw.coords[2]"
                  @keydown="checkNumber($event)"
                  @change="changeSetArrayItem(item.raw, 'coords', 2, $event.target as HTMLInputElement)"
                  class="inline-edit"
                />
              </div>
            </div>
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

      <v-window-item :key="'tab-elements'" :transition="false" :reverse-transition="false" style="height: 185px">
        <div class="border-b border-t">
          <v-btn size="small" variant="flat" color="secondary" :rounded="0" @click.stop="showDialog('addElement')">
            <v-icon small>mdi-plus</v-icon> Add element
          </v-btn>
          <v-btn
            size="small"
            variant="flat"
            color="secondary"
            style="border-left: 1px solid #ccc"
            :rounded="0"
            @click.stop="appStore.mouseMode = MouseMode.ADD_ELEMENT"
          >
            <v-icon small>mdi-cursor-default-outline</v-icon> Add element
          </v-btn>
        </div>

        <v-data-table
          :headers="headers.elements"
          :items="elements"
          density="compact"
          height="155"
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

      <v-window-item :key="'tab-loads'" :transition="false" :reverse-transition="false" style="height: 185px">
        <div class="border-b border-t">
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
          height="155"
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
              <div class="inline-edit-group mr-2">
                <span class="input-before">F<sub>x</sub></span>
                <input
                  :value="item.raw.ref.values[0]"
                  @keydown="checkNumber($event)"
                  @change="changeSetArrayItem(item.raw.ref, 'values', 0, $event.target as HTMLInputElement)"
                  class="inline-edit"
                />
              </div>
              <div class="inline-edit-group mr-2">
                <span class="input-before">F<sub>z</sub></span>
                <input
                  :value="item.raw.ref.values[2]"
                  @keydown="checkNumber($event)"
                  @change="changeSetArrayItem(item.raw.ref, 'values', 2, $event.target as HTMLInputElement)"
                  class="inline-edit"
                />
              </div>
              <div class="inline-edit-group">
                <span class="input-before">M<sub>y</sub></span>
                <input
                  :value="item.raw.ref.values[4]"
                  @keydown="checkNumber($event)"
                  @change="changeSetArrayItem(item.raw.ref, 'values', 4, $event.target as HTMLInputElement)"
                  class="inline-edit"
                />
              </div>
            </div>

            <div class="d-flex align-content-center" v-if="item.raw.type === 'element'">
              <div class="inline-edit-group mr-2">
                <span class="input-before">f<sub>x</sub></span>
                <input
                  :value="item.raw.ref.values[0]"
                  @keydown="checkNumber($event)"
                  @change="changeSetArrayItem(item.raw.ref, 'values', 0, $event.target as HTMLInputElement)"
                  class="inline-edit"
                />
              </div>
              <div class="inline-edit-group mr-2">
                <span class="input-before">f<sub>z</sub></span>
                <input
                  :value="item.raw.ref.values[1]"
                  @keydown="checkNumber($event)"
                  @change="changeSetArrayItem(item.raw.ref, 'values', 1, $event.target as HTMLInputElement)"
                  class="inline-edit"
                />
              </div>
              <div class="inline-edit-group">
                <span class="input-before">LCS</span>
                <div class="inline-edit">
                  <input type="checkbox" :checked="item.raw.ref.lcs" @click="toggleBoolean(item.raw.ref, 'lcs')" />
                </div>
              </div>
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

          <template #item.actions="{ item, index }">
            <v-icon v-if="item.raw.type === 'element'" small @click="deleteElementLoad(index)"> mdi-close </v-icon>
            <v-icon v-if="item.raw.type === 'node'" small @click="deleteNodalLoad(item)"> mdi-close </v-icon>
          </template>
        </v-data-table>
      </v-window-item>

      <v-window-item :key="'tab-mats'" style="height: 185px" :transition="false" :reverse-transition="false">
        <div class="border-b border-t">
          <v-btn size="small" variant="flat" color="secondary" :rounded="0" @click.stop="showDialog('addMaterial')">
            <v-icon small>mdi-plus</v-icon> Add material
          </v-btn>
        </div>

        <v-data-table
          :headers="headers.materials"
          :items="materials"
          density="compact"
          height="155"
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
            <input
              :value="item.raw.e"
              @keydown="checkNumber($event)"
              @change="changeItem(item.raw, 'e', $event.target as HTMLInputElement)"
              class="inline-edit"
            />
          </template>
          <template #item.g="{ item }">
            <input
              :value="item.raw.g"
              @keydown="checkNumber($event)"
              @change="changeItem(item.raw, 'g', $event.target as HTMLInputElement)"
              class="inline-edit"
            />
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
            <input
              :value="item.raw.alpha"
              @keydown="checkNumber($event)"
              @change="changeItem(item.raw, 'alpha', $event.target as HTMLInputElement)"
              class="inline-edit"
            />
          </template>
          <template #item.d="{ item }">
            <input
              :value="item.raw.d"
              @keydown="checkNumber($event)"
              @change="changeItem(item.raw, 'd', $event.target as HTMLInputElement)"
              class="inline-edit"
            />
          </template>
          <template #item.actions="{ item }">
            <v-icon small @click="deleteMaterial(item.raw.label)"> mdi-close </v-icon>
          </template>
        </v-data-table>
      </v-window-item>

      <v-window-item :key="'tab-cs'" style="height: 185px" :transition="false" :reverse-transition="false">
        <div class="border-b border-t">
          <v-btn size="small" variant="flat" color="secondary" :rounded="0" @click.stop="showDialog('addCrossSection')">
            <v-icon small>mdi-plus</v-icon> Add cross section
          </v-btn>
        </div>

        <v-data-table
          :headers="headers.crossSections"
          :items="crossSections"
          density="compact"
          height="155"
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
            <input
              :value="item.raw.a"
              @keydown="checkNumber($event)"
              @change="changeItem(item.raw, 'a', $event.target as HTMLInputElement)"
              class="inline-edit"
            />
          </template>
          <template #item.iy="{ item }">
            <input
              :value="item.raw.iy"
              @keydown="checkNumber($event)"
              @change="changeItem(item.raw, 'iy', $event.target as HTMLInputElement)"
              class="inline-edit"
            />
          </template>
          <template #item.h="{ item }">
            <input
              :value="item.raw.h"
              @keydown="checkNumber($event)"
              @change="changeItem(item.raw, 'h', $event.target as HTMLInputElement)"
              class="inline-edit"
            />
          </template>
          <template #item.k="{ item }">
            <input
              :value="item.raw.k"
              @keydown="checkNumber($event)"
              @change="changeItem(item.raw, 'k', $event.target as HTMLInputElement)"
              class="inline-edit"
            />
          </template>
          <template #item.actions="{ item }">
            <v-icon small @click="deleteCrossSection(item.raw.label)"> mdi-close </v-icon>
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
import { MouseMode } from "../mouse";

const appStore = useAppStore();
const projStore = useProjectStore();

onMounted(() => {
  window.addEventListener("keydown", (e) => {
    if (e.key == "Escape" || e.keyCode === 13) {
      (document.activeElement as HTMLElement).blur();
    }
  });
});

const showDialog = (
  name: "addNode" | "addElement" | "addNodalLoad" | "addElementLoad" | "addMaterial" | "addCrossSection"
) => {
  appStore.dialogs[name] = true;
};

const swapNodes = (el: Element) => {
  el.nodes = el.nodes.reverse();
  solve();
};

const checkNumber = (e: KeyboardEvent) => {
  if (e.key === "Escape") if ("activeElement" in document) (document.activeElement as HTMLElement).blur();

  const isNumber = !isNaN(e.key as unknown as number);
  const isActionKey =
    e.key === "Escape" ||
    e.key === "Delete" ||
    e.key === "Backspace" ||
    e.key === "Enter" ||
    e.key === "Tab" ||
    e.key === "ArrowRight" ||
    e.key === "ArrowLeft" ||
    e.key === "e" ||
    e.key === "-";

  const isComma = e.key === "," || e.key === ".";

  if (isNumber || isActionKey || isComma) return;

  e.stopPropagation();
  e.preventDefault();
};

const changeSetArrayItem = (item: unknown, set: string, value: number, el?: HTMLInputElement) => {
  setUnsolved();

  if (el.value === "") el.value = "0";

  const val = parseFloat(el.value.replace(/\s/g, "").replace(",", "."));
  if (isNaN(val)) return (el.value = item[set][value]);

  item[set][value] = val;

  solve();
};

const changeItem = (item: object, value: string, el?: HTMLInputElement) => {
  setUnsolved();

  if (el.value === "") el.value = "0";

  const val = parseFloat(el.value.replace(/\s/g, "").replace(",", "."));
  if (isNaN(val)) return (el.value = item[value]);

  item[value] = val;

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
  //useProjectStore().solver.domain.nodes = new Map(useProjectStore().solver.domain.nodes);

  solve();
};

const deleteMaterial = (id: number) => {
  useProjectStore().solver.domain.materials.delete(id);
};

const deleteCrossSection = (id: number) => {
  useProjectStore().solver.domain.crossSections.delete(id);
};

const deleteNodalLoad = (id: number) => {
  console.log(id);
};

const deleteElementLoad = (id: number) => {
  console.log(id);
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
  let display: Node[] = [];

  for (const node of nodeVals) {
    display.push(node);
  }

  if (projStore.selection.type === "node") {
    display = display.filter((e) => e.label === projStore.selection.label);
  }

  // @ts-expect-error ts-fem is wrongly typed
  return display.sort((a, b) => ("" + a.label).localeCompare(b.label, undefined, { numeric: true }));
});

const elements = computed(() => {
  const elements = useProjectStore().solver.domain.elements.values();
  let display: Element[] = [];

  for (const element of elements) {
    display.push(element);
  }

  if (projStore.selection.type === "element") {
    display = display.filter((e) => e.label === projStore.selection.label);
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
      title: "Coords",
      key: "coords",
      width: 180,
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
      width: 100,
    },
    {
      title: "Nodes",
      key: "nodes",
      width: 240,
    },
    {
      title: "Material",
      key: "material",
      width: 140,
    },
    {
      title: "Cross section",
      key: "cs",
      width: 140,
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
      width: 140,
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
      width: 320,
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
