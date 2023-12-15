<template>
  <div style="border-top: 1px solid #ddd" :style="`min-height: ${props.height}px; overflow: hidden`">
    <div class="d-flex">
      <div class="flex-grow-1">
        <v-tabs v-model="appStore.bottomBarTab" bg-color="primary" :show-arrows="false" height="36">
          <v-tab v-for="(tab, index) in tabs" :key="index">
            <template #default>
              <v-icon small class="mr-3">{{ tab.icon }}</v-icon> {{ $t(tab.title) }}</template
            >
            <template #append v-if="'count' in tab && tab.count() > 0">{{ tab.count() }}</template>
          </v-tab>
        </v-tabs>
      </div>
      <div class="bg-primary d-flex align-center">
        <v-btn color="primary" density="compact" icon="mdi-window-minimize"></v-btn>
      </div>
    </div>
    <v-window v-model="appStore.bottomBarTab" touchless class="text-body-2" :style="`height: ${props.height - 36}px`">
      <v-window-item
        :key="'tab-nodes'"
        :style="`height: ${props.height - 36}px`"
        :transition="false"
        :reverse-transition="false"
        @touchstart.prevent.stop
      >
        <div class="border-b border-t">
          <v-btn size="small" variant="flat" color="secondary" :rounded="0" @click.stop="showDialog('addNode')">
            <v-icon small>mdi-plus</v-icon> {{ $t("nodes.addNode") }}
          </v-btn>
          <v-btn
            size="small"
            variant="flat"
            color="secondary"
            style="border-left: 1px solid #ccc"
            :rounded="0"
            @click.stop="appStore.mouseMode = MouseMode.ADD_NODE"
          >
            <v-icon small>mdi-cursor-default-outline</v-icon> {{ $t("nodes.addNode") }}
          </v-btn>
        </div>
        <v-data-table
          ref="table-nodes"
          :headers="headers.nodes"
          :items="nodes"
          density="compact"
          :height="props.height - 36 - 30"
          fixed-header
          :items-per-page="-1"
          disable-pagination
          hide-default-footer
          mobile-breakpoint="0"
          item-key="label"
        >
          <template #headers="{ columns, isSorted, getSortIcon, toggleSort }">
            <tr>
              <template v-for="column in columns" :key="column.key">
                <th
                  :class="{ 'v-data-table__th--sorted': isSorted(column) }"
                  class="v-data-table__td v-data-table-column--align-start v-data-table__th v-data-table__th--sortable"
                >
                  <div class="v-data-table-header__content">
                    <span class="mr-2 cursor-pointer" @click="() => toggleSort(column)">{{
                      capitalize($t(column.title))
                    }}</span>
                    <v-icon
                      v-if="column.sortable"
                      :icon="getSortIcon(column)"
                      class="v-data-table-header__sort-icon"
                    ></v-icon>
                    <v-icon v-if="column.removable" icon="$close" @click="() => remove(column.key)"></v-icon>
                  </div>
                </th>
              </template>
            </tr>
          </template>
          <template #item.label="{ item }">
            <input
              :value="item.label"
              @change="changeLabel('nodes', item, $event.target as HTMLInputElement)"
              class="inline-edit"
            />
          </template>
          <template #item.coords="{ item }">
            <div class="d-flex">
              <div class="inline-edit-group mr-2">
                <label :for="`coords0-${item.label}`" class="input-before">x</label>
                <input
                  :id="`coords0-${item.label}`"
                  :value="item.coords[0]"
                  @keydown="checkNumber($event)"
                  @change="changeSetArrayItem(item, 'coords', 0, $event.target as HTMLInputElement)"
                  class="inline-edit"
                />
              </div>
              <div class="inline-edit-group mr-2">
                <label :for="`coords2-${item.label}`" class="input-before">z</label>
                <input
                  :id="`coords2-${item.label}`"
                  :value="item.coords[2]"
                  @keydown="checkNumber($event)"
                  @change="changeSetArrayItem(item, 'coords', 2, $event.target as HTMLInputElement)"
                  class="inline-edit"
                />
              </div>
            </div>
          </template>
          <template #item.bcs="{ item }">
            <div class="d-flex">
              <div class="inline-edit-group">
                <label :for="`bcs0-${item.label}`" class="input-before">U<sub>x</sub></label>
                <div class="inline-edit">
                  <input
                    :id="`bcs0-${item.label}`"
                    type="checkbox"
                    :checked="item.bcs.has(0)"
                    @click="toggleSet(item, 'bcs', 0)"
                  />
                </div>
              </div>
              <div class="inline-edit-group mx-2">
                <label :for="`bcs1-${item.label}`" class="input-before">U<sub>z</sub></label>
                <div class="inline-edit">
                  <input
                    :id="`bcs1-${item.label}`"
                    type="checkbox"
                    :checked="item.bcs.has(2)"
                    @click="toggleSet(item, 'bcs', 2)"
                  />
                </div>
              </div>
              <div class="inline-edit-group">
                <label :for="`bcs2-${item.label}`" class="input-before">R<sub>y</sub></label>
                <div class="inline-edit">
                  <input
                    :id="`bcs2-${item.label}`"
                    type="checkbox"
                    :checked="item.bcs.has(4)"
                    @click="toggleSet(item, 'bcs', 4)"
                  />
                </div>
              </div>
            </div>
          </template>
          <template #item.loads="{ item }">
            <div
              v-if="
                useProjectStore().solver.loadCases[0].nodalLoadList.filter((nl) => nl.target === item.label).length > 0
              "
            >
              <v-chip-group>
                <v-chip v-for="nl in formatNodalLoadsAtNode(item)" density="compact"> <span v-html="nl"></span></v-chip>
              </v-chip-group>
            </div>
            <div v-else>-</div>
          </template>
          <template #item.actions="{ item }">
            <v-btn density="compact" variant="text" @click="deleteNode(item.label)" icon="mdi-close"></v-btn>
          </template>
        </v-data-table>
      </v-window-item>

      <v-window-item
        :key="'tab-elements'"
        :transition="false"
        :reverse-transition="false"
        :style="`height: ${props.height - 36}px`"
      >
        <div class="border-b border-t">
          <v-btn size="small" variant="flat" color="secondary" :rounded="0" @click.stop="showDialog('addElement')">
            <v-icon small>mdi-plus</v-icon> {{ $t("elements.addElement") }}
          </v-btn>
          <v-btn
            size="small"
            variant="flat"
            color="secondary"
            style="border-left: 1px solid #ccc"
            :rounded="0"
            @click.stop="appStore.mouseMode = MouseMode.ADD_ELEMENT"
          >
            <v-icon small>mdi-cursor-default-outline</v-icon> {{ $t("elements.addElement") }}
          </v-btn>
        </div>

        <v-data-table
          :headers="headers.elements"
          :items="elements"
          density="compact"
          :height="props.height - 36 - 30"
          fixed-header
          :items-per-page="-1"
          disable-pagination
          hide-default-footer
          mobile-breakpoint="0"
          item-key="label"
        >
          <template #headers="{ columns, isSorted, getSortIcon, toggleSort }">
            <tr>
              <template v-for="column in columns" :key="column.key">
                <th
                  :class="{ 'v-data-table__th--sorted': isSorted(column) }"
                  class="v-data-table__td v-data-table-column--align-start v-data-table__th v-data-table__th--sortable"
                >
                  <div class="v-data-table-header__content">
                    <span class="mr-2 cursor-pointer" @click="() => toggleSort(column)">{{
                      capitalize($t(column.title))
                    }}</span>
                    <v-icon
                      v-if="column.sortable"
                      :icon="getSortIcon(column)"
                      class="v-data-table-header__sort-icon"
                    ></v-icon>
                    <v-icon v-if="column.removable" icon="$close" @click="() => remove(column.key)"></v-icon>
                  </div>
                </th>
              </template>
            </tr>
          </template>
          <template #item.label="{ item }">
            <input
              :value="item.label"
              @change="changeLabel('elements', item, $event.target as HTMLInputElement)"
              class="inline-edit"
            />
          </template>
          <template #item.type> Beam2D </template>
          <template #item.nodes="{ item }">
            <div class="d-flex">
              <select class="mini-select flex-shrink-0" v-model="item.nodes[0]" @change="solve" style="width: 100px">
                <option
                  v-for="node in nodes.filter((e) => e.label != item.nodes[1])"
                  :value="node.label"
                  :key="node.label"
                >
                  {{ `${$t("common.node")} ${node.label}` }}
                </option>
              </select>
              <a href="#" class="text-decoration-none text-primary" @click.stop="swapNodes(item)">
                <v-icon small>mdi-swap-horizontal</v-icon>
              </a>
              <select class="mini-select flex-shrink-0" v-model="item.nodes[1]" @change="solve" style="width: 100px">
                <option
                  v-for="node in nodes.filter((e) => e.label != item.nodes[0])"
                  :value="node.label"
                  :key="node.label"
                >
                  {{ `${$t("common.node")} ${node.label}` }}
                </option>
              </select>
            </div>
          </template>
          <template #item.material="{ item }">
            <select class="mini-select" v-model.number="item.mat" @change="solve" style="width: 100%">
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
            <select class="mini-select" v-model.number="item.cs" @change="solve" style="width: 100%">
              <option v-for="node in crossSections" :value="node.label" :key="node.label">
                {{ node.label }}
              </option>
            </select>
          </template>
          <template #item.hinges[0]="{ item }">
            <input type="checkbox" :checked="item.hinges[0]" @click="toggleArray(item, 'hinges', 0)" />&mdash;<input
              type="checkbox"
              :checked="item.hinges[1]"
              @click="toggleArray(item, 'hinges', 1)"
            />
          </template>
          <template #item.diagonalMassMatrix="{ item }">
            <select class="mini-select" v-model="item.diagonalMassMatrix" @change="solve" style="width: 100%">
              <option :value="false">consistent</option>
              <option :value="true">lumped</option>
            </select>
            <!--<input
              v-model.number="item.mat"
              type="number"
              class="inline-edit"
            />-->
          </template>
          <template #item.loads="{ item }">
            <div
              v-if="
                useProjectStore().solver.loadCases[0].elementLoadList.filter((nl) => nl.target === item.label).length >
                0
              "
            >
              <v-chip-group>
                <v-chip v-for="el in formatElementLoadsAtElement(item)" density="compact">
                  <span v-html="el"></span
                ></v-chip>
              </v-chip-group>
            </div>
            <div v-else>-</div>
          </template>
          <template #item.actions="{ item }">
            <v-btn density="compact" variant="text" @click="deleteElement(item.label)" icon="mdi-close"></v-btn>
          </template>
        </v-data-table>
      </v-window-item>

      <v-window-item
        :key="'tab-loads'"
        :transition="false"
        :reverse-transition="false"
        :style="`height: ${props.height - 36}px`"
      >
        <div class="border-b border-t">
          <v-btn size="small" variant="flat" color="secondary" :rounded="0" @click.stop="showDialog('addNodalLoad')">
            <v-icon small>mdi-plus</v-icon> {{ $t("loads.addNodalLoad") }}
          </v-btn>
          <v-btn
            size="small"
            variant="flat"
            color="secondary"
            style="border-left: 1px solid #ccc"
            :rounded="0"
            @click.stop="showDialog('addElementLoad')"
          >
            <v-icon small>mdi-plus</v-icon> {{ $t("loads.addElementLoad") }}
          </v-btn>
        </div>
        <v-data-table
          :headers="headers.loads"
          :items="loads"
          density="compact"
          :height="props.height - 36 - 30"
          fixed-header
          :items-per-page="-1"
          disable-pagination
          hide-default-footer
          mobile-breakpoint="0"
          item-key="label"
        >
          <template #headers="{ columns, isSorted, getSortIcon, toggleSort }">
            <tr>
              <template v-for="column in columns" :key="column.key">
                <th
                  :class="{ 'v-data-table__th--sorted': isSorted(column) }"
                  class="v-data-table__td v-data-table-column--align-start v-data-table__th v-data-table__th--sortable"
                >
                  <div class="v-data-table-header__content">
                    <div class="mr-2 cursor-pointer" @click="() => toggleSort(column)">
                      {{ capitalize($t(column.title)) }}
                      <span
                        class="font-weight-regular"
                        v-if="column.units"
                        v-html="`[${formatMeasureAsHTML(appStore.units[column.units])}]`"
                      ></span>
                    </div>
                    <v-icon
                      v-if="column.sortable"
                      :icon="getSortIcon(column)"
                      class="v-data-table-header__sort-icon"
                    ></v-icon>
                    <v-icon v-if="column.removable" icon="$close" @click="() => remove(column.key)"></v-icon>
                  </div>
                </th>
              </template>
            </tr>
          </template>

          <template #item.type="{ item }">
            {{ item.type === "node" ? "Nodal load" : "Element load" }}
          </template>

          <template #item.load.values="{ item }">
            <div class="d-flex" v-if="item.type === 'node'">
              <div class="inline-edit-group mr-2">
                <label class="input-before">F<sub>x</sub></label>
                <input
                  :value="appStore.convertForce(item.ref.values[0])"
                  @keydown="checkNumber($event)"
                  @change="
                    changeSetArrayItem(
                      item.ref,
                      'values',
                      0,
                      $event.target as HTMLInputElement,
                      appStore.convertInverseForce
                    )
                  "
                  class="inline-edit"
                />
              </div>
              <div class="inline-edit-group mr-2">
                <span class="input-before">F<sub>z</sub></span>
                <input
                  :value="appStore.convertForce(item.ref.values[2])"
                  @keydown="checkNumber($event)"
                  @change="
                    changeSetArrayItem(
                      item.ref,
                      'values',
                      2,
                      $event.target as HTMLInputElement,
                      appStore.convertInverseForce
                    )
                  "
                  class="inline-edit"
                />
              </div>
              <div class="inline-edit-group">
                <span class="input-before">M<sub>y</sub></span>
                <input
                  :value="appStore.convertForce(item.ref.values[4])"
                  @keydown="checkNumber($event)"
                  @change="
                    changeSetArrayItem(
                      item.ref,
                      'values',
                      4,
                      $event.target as HTMLInputElement,
                      appStore.convertInverseForce
                    )
                  "
                  class="inline-edit"
                />
              </div>
            </div>

            <div class="d-flex align-content-center" v-if="item.type === 'element'">
              <div class="inline-edit-group mr-2">
                <span class="input-before">f<sub>x</sub></span>
                <input
                  :value="appStore.convertForce(item.ref.values[0])"
                  @keydown="checkNumber($event)"
                  @change="
                    changeSetArrayItem(
                      item.ref,
                      'values',
                      0,
                      $event.target as HTMLInputElement,
                      appStore.convertInverseForce
                    )
                  "
                  class="inline-edit"
                />
              </div>
              <div class="inline-edit-group mr-2">
                <span class="input-before">f<sub>z</sub></span>
                <input
                  :value="appStore.convertForce(item.ref.values[1])"
                  @keydown="checkNumber($event)"
                  @change="
                    changeSetArrayItem(
                      item.ref,
                      'values',
                      1,
                      $event.target as HTMLInputElement,
                      appStore.convertInverseForce
                    )
                  "
                  class="inline-edit"
                />
              </div>
              <div class="inline-edit-group">
                <span class="input-before">LCS</span>
                <div class="inline-edit">
                  <input type="checkbox" :checked="item.ref.lcs" @click="toggleBoolean(item.ref, 'lcs')" />
                </div>
              </div>
            </div>
          </template>

          <template #item.target="{ item }">
            <select
              class="mini-select"
              v-if="item.type === 'node'"
              v-model="item.ref.target"
              @change="solve"
              style="width: 100%"
            >
              <option v-for="node in nodes" :value="node.label" :key="node.label">
                {{ `${$t("common.node")} ${node.label}` }}
              </option>
            </select>

            <select
              class="mini-select"
              v-if="item.type === 'element'"
              v-model="item.ref.target"
              @change="solve"
              style="width: 100%"
            >
              <option v-for="node in elements" :value="node.label" :key="node.label">
                {{ `${$t("common.element")} ${node.label}` }}
              </option>
            </select>
          </template>

          <template #item.actions="{ item, index }">
            <v-btn
              v-if="item.type === 'element'"
              density="compact"
              variant="text"
              @click="deleteElementLoad(item, index)"
              icon="mdi-close"
            ></v-btn>
            <v-btn
              v-if="item.type === 'node'"
              density="compact"
              variant="text"
              @click="deleteNodalLoad(item, item)"
              icon="mdi-close"
            ></v-btn>
          </template>
        </v-data-table>
      </v-window-item>

      <v-window-item
        :key="'tab-mats'"
        :style="`height: ${props.height - 36}px`"
        :transition="false"
        :reverse-transition="false"
      >
        <div class="border-b border-t">
          <v-btn size="small" variant="flat" color="secondary" :rounded="0" @click.stop="showDialog('addMaterial')">
            <v-icon small>mdi-plus</v-icon> {{ $t("materials.addMaterial") }}
          </v-btn>
        </div>

        <v-data-table
          :headers="headers.materials"
          :items="materials"
          density="compact"
          :height="props.height - 36 - 30"
          fixed-header
          :items-per-page="-1"
          disable-pagination
          hide-default-footer
          mobile-breakpoint="0"
          item-key="label"
        >
          <template #headers="{ columns, isSorted, getSortIcon, toggleSort }">
            <tr>
              <template v-for="column in columns" :key="column.key">
                <th
                  :class="{ 'v-data-table__th--sorted': isSorted(column) }"
                  class="v-data-table__td v-data-table-column--align-start v-data-table__th v-data-table__th--sortable"
                >
                  <div class="v-data-table-header__content">
                    <div class="mr-2 cursor-pointer" @click="() => toggleSort(column)">
                      {{ capitalize($t(column.title)) }}
                      <span
                        class="font-weight-regular"
                        v-if="column.units"
                        v-html="`[${formatMeasureAsHTML(appStore.units[column.units])}]`"
                      ></span>
                    </div>
                    <v-icon
                      v-if="column.sortable"
                      :icon="getSortIcon(column)"
                      class="v-data-table-header__sort-icon"
                    ></v-icon>
                    <v-icon v-if="column.removable" icon="$close" @click="() => remove(column.key)"></v-icon>
                  </div>
                </th>
              </template>
            </tr>
          </template>

          <template #item.label="{ item }">
            <input
              :value="item.label"
              @change="changeLabel('materials', item, $event.target as HTMLInputElement)"
              class="inline-edit"
            />
          </template>
          <template #item.e="{ item }">
            <input
              :value="formatScientificNumber(appStore.convertPressure(item.e))"
              @keydown="checkNumber($event)"
              @change="changeItem(item, 'e', $event.target as HTMLInputElement, appStore.convertInversePressure)"
              class="inline-edit"
            />
          </template>
          <template #item.g="{ item }">
            <input
              :value="formatScientificNumber(appStore.convertPressure(item.g))"
              @keydown="checkNumber($event)"
              @change="changeItem(item, 'g', $event.target as HTMLInputElement, appStore.convertInversePressure)"
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
              :value="item.alpha"
              @keydown="checkNumber($event)"
              @change="changeItem(item, 'alpha', $event.target as HTMLInputElement)"
              class="inline-edit"
            />
          </template>
          <template #item.d="{ item }">
            <input
              :value="item.d"
              @keydown="checkNumber($event)"
              @change="changeItem(item, 'd', $event.target as HTMLInputElement)"
              class="inline-edit"
            />
          </template>
          <template #item.actions="{ item }">
            <v-btn density="compact" variant="text" @click="deleteMaterial(item.label)" icon="mdi-close"></v-btn>
          </template>
        </v-data-table>
      </v-window-item>

      <v-window-item
        :key="'tab-cs'"
        :style="`height: ${props.height - 36}px`"
        :transition="false"
        :reverse-transition="false"
      >
        <div class="border-b border-t">
          <v-btn size="small" variant="flat" color="secondary" :rounded="0" @click.stop="showDialog('addCrossSection')">
            <v-icon small>mdi-plus</v-icon> {{ $t("crossSections.addCrossSection") }}
          </v-btn>
        </div>

        <v-data-table
          :headers="headers.crossSections"
          :items="crossSections"
          density="compact"
          :height="props.height - 36 - 30"
          fixed-header
          :items-per-page="-1"
          disable-pagination
          hide-default-footer
          mobile-breakpoint="0"
          item-key="label"
        >
          <template #headers="{ columns, isSorted, getSortIcon, toggleSort }">
            <tr>
              <template v-for="column in columns" :key="column.key">
                <th
                  :class="{ 'v-data-table__th--sorted': isSorted(column) }"
                  class="v-data-table__td v-data-table-column--align-start v-data-table__th v-data-table__th--sortable"
                >
                  <div class="v-data-table-header__content">
                    <div class="mr-2 cursor-pointer" @click="() => toggleSort(column)">
                      {{ capitalize($t(column.title)) }}
                      <span
                        class="font-weight-regular"
                        v-if="column.units"
                        v-html="`[${formatMeasureAsHTML(appStore.units[column.units])}]`"
                      ></span>
                    </div>
                    <v-icon
                      v-if="column.sortable"
                      :icon="getSortIcon(column)"
                      class="v-data-table-header__sort-icon"
                    ></v-icon>
                    <v-icon v-if="column.removable" icon="$close" @click="() => remove(column.key)"></v-icon>
                  </div>
                </th>
              </template>
            </tr>
          </template>

          <template #item.label="{ item }">
            <input
              :value="item.label"
              @change="changeLabel('crossSections', item, $event.target as HTMLInputElement)"
              class="inline-edit"
            />
          </template>
          <template #item.a="{ item }">
            <input
              :value="formatScientificNumber(appStore.convertArea(item.a))"
              @keydown="checkNumber($event)"
              @change="changeItem(item, 'a', $event.target as HTMLInputElement, appStore.convertInverseArea)"
              class="inline-edit"
            />
          </template>
          <template #item.iy="{ item }">
            <input
              :value="formatScientificNumber(appStore.convertAreaM2(item.iy))"
              @keydown="checkNumber($event)"
              @change="changeItem(item, 'iy', $event.target as HTMLInputElement, appStore.convertInverseAreaM2)"
              class="inline-edit"
            />
          </template>
          <template #item.h="{ item }">
            <input
              :value="item.h"
              @keydown="checkNumber($event)"
              @change="changeItem(item, 'h', $event.target as HTMLInputElement)"
              class="inline-edit"
            />
          </template>
          <template #item.k="{ item }">
            <input
              :value="formatScientificNumber(item.k)"
              @keydown="checkNumber($event)"
              @change="changeItem(item, 'k', $event.target as HTMLInputElement)"
              class="inline-edit"
            />
          </template>
          <template #item.actions="{ item }">
            <v-btn density="compact" variant="text" @click="deleteCrossSection(item.label)" icon="mdi-close"></v-btn>
          </template>
        </v-data-table>
      </v-window-item>
      <v-window-item
        :key="'tab-results'"
        :style="`height: ${props.height - 36}px`"
        :transition="false"
        :reverse-transition="false"
        @touchstart.prevent.stop
      >
        <div class="border-b border-t">
          <v-btn size="small" variant="flat" color="secondary" :rounded="0">
            <v-icon small>mdi-square-medium-outline</v-icon> {{ $t("results.nodal_results") }}
          </v-btn>
          <v-btn size="small" variant="flat" color="secondary" style="border-left: 1px solid #ccc" :rounded="0">
            <v-icon small>mdi-vector-line</v-icon> {{ $t("results.element_results") }}
          </v-btn>
        </div>
        <v-data-table
          ref="table-results"
          :headers="headers.results"
          :items="nodes"
          density="compact"
          :height="props.height - 36 - 30"
          fixed-header
          :items-per-page="-1"
          disable-pagination
          hide-default-footer
          mobile-breakpoint="0"
          item-key="label"
        >
          <template #headers="{ columns, isSorted, getSortIcon, toggleSort }">
            <tr>
              <template v-for="column in columns" :key="column.key">
                <th
                  :class="{ 'v-data-table__th--sorted': isSorted(column) }"
                  class="v-data-table__td v-data-table-column--align-start v-data-table__th v-data-table__th--sortable"
                >
                  <div class="v-data-table-header__content">
                    <span class="mr-2 cursor-pointer" @click="() => toggleSort(column)">{{
                      capitalize($t(column.title))
                    }}</span>
                    <v-icon
                      v-if="column.sortable"
                      :icon="getSortIcon(column)"
                      class="v-data-table-header__sort-icon"
                    ></v-icon>
                    <v-icon v-if="column.removable" icon="$close" @click="() => remove(column.key)"></v-icon>
                  </div>
                </th>
              </template>
            </tr>
          </template>

          <template #item.coords="{ item }">
            <div class="d-flex">
              <div class="inline-edit-group mr-2">
                <label class="input-before">D<sub>x</sub></label>
                <div
                  class="inline-edit fw"
                  v-html="formatExpValueAsHTML(item.getUnknowns(useProjectStore().solver.loadCases[0], [DofID.Dx]), 4)"
                />
              </div>
              <div class="inline-edit-group mr-2">
                <label class="input-before">D<sub>z</sub></label>
                <div
                  class="inline-edit fw"
                  v-html="formatExpValueAsHTML(item.getUnknowns(useProjectStore().solver.loadCases[0], [DofID.Dz]), 4)"
                />
              </div>
              <div class="inline-edit-group mr-2">
                <label class="input-before">R<sub>y</sub></label>
                <div
                  class="inline-edit fw"
                  v-html="formatExpValueAsHTML(item.getUnknowns(useProjectStore().solver.loadCases[0], [DofID.Ry]), 4)"
                />
              </div>
            </div>
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

import { ref, onMounted, computed, watch, nextTick, reactive, onUnmounted } from "vue";
import { useProjectStore } from "../store/project";
import { useAppStore } from "../store/app";
import { MouseMode } from "../mouse";
import { capitalize, checkNumber } from "../utils";
import { DofID, Beam2D } from "ts-fem";
import { formatExpValueAsHTML, formatMeasureAsHTML } from "../SVGUtils";

type EntityWithLabel = { label: string & { [key: string]: unknown } };

const appStore = useAppStore();
const projStore = useProjectStore();

const props = defineProps({
  height: {
    type: Number,
    default: 231,
  },
});

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

const swapNodes = (el: Beam2D) => {
  el.nodes = el.nodes.reverse();

  el.hinges = [el.hinges[1], el.hinges[0]];
  solve();
};

const formatScientificNumber = (n: number) => {
  if (n > 1000 || n < 0.001) return n.toExponential(4);

  return n;
};

const changeSetArrayItem = (
  item: unknown,
  set: string,
  value: number,
  el?: HTMLInputElement,
  formatter?: (v: number) => number
) => {
  setUnsolved();

  if (el.value === "") el.value = "0";

  const val = parseFloat(el.value.replace(/\s/g, "").replace(",", "."));
  if (isNaN(val)) return (el.value = item[set][value]);

  if (formatter) item[set][value] = formatter(val);
  else item[set][value] = val;

  solve();
};

const changeItem = (item: object, value: string, el?: HTMLInputElement, formatter?: (v: number) => number) => {
  setUnsolved();

  if (el.value === "") el.value = "0";

  const val = parseFloat(el.value.replace(/\s/g, "").replace(",", "."));
  if (isNaN(val)) return (el.value = item[value]);

  if (formatter) item[value] = formatter(val);
  else item[value] = val;

  solve();
};

const changeLabel = (map: string, item: EntityWithLabel, el?: HTMLInputElement) => {
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

  setUnsolved();
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

  setUnsolved();
  useProjectStore().solver.domain.nodes.delete(id);
  //useProjectStore().solver.domain.nodes = new Map(useProjectStore().solver.domain.nodes);

  solve();
};

const deleteMaterial = (id: number) => {
  setUnsolved();
  useProjectStore().solver.domain.materials.delete(id);
};

const deleteCrossSection = (id: number) => {
  setUnsolved();
  useProjectStore().solver.domain.crossSections.delete(id);
};

const deleteNodalLoad = (load: NodalLoad, id: number) => {
  setUnsolved();
  useProjectStore().solver.loadCases[0].nodalLoadList.splice(id, 1);
};

const deleteElementLoad = (load: BeamElementUniformEdgeLoad, id: number) => {
  setUnsolved();
  useProjectStore().solver.loadCases[0].elementLoadList.splice(id, 1);
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

const formatNodalLoadsAtNode = (item: Node) => {
  const nls = useProjectStore()
    .solver.loadCases[0].nodalLoadList.filter((nl) => nl.target === item.label)
    .map((nl) => {
      return { components: nl.values };
    });

  return nls.map((nl) => {
    let tmp = [];
    if (DofID.Dx in nl.components && Math.abs(nl.components[DofID.Dx]) > 1e-12)
      tmp.push("F<sub>x</sub> = " + appStore.convertForce(nl.components[DofID.Dx]));
    if (DofID.Dz in nl.components && Math.abs(nl.components[DofID.Dz]) > 1e-12)
      tmp.push("F<sub>z</sub> = " + appStore.convertForce(nl.components[DofID.Dz]));
    if (DofID.Ry in nl.components && Math.abs(nl.components[DofID.Ry]) > 1e-12)
      tmp.push("M<sub>y</sub> = " + appStore.convertForce(nl.components[DofID.Ry]));
    return tmp.join(", ");
  });
};

const formatElementLoadsAtElement = (item: Beam2D) => {
  const nls = useProjectStore()
    .solver.loadCases[0].elementLoadList.filter((nl) => nl.target === item.label)
    .map((nl) => {
      return { values: nl.values };
    });

  return nls.map((nl) => {
    let tmp = [];
    if (Math.abs(nl.values[0]) > 1e-12) tmp.push("f<sub>x</sub> = " + appStore.convertForce(nl.values[0]));
    if (Math.abs(nl.values[1]) > 1e-12) tmp.push("f<sub>z</sub> = " + appStore.convertForce(nl.values[1]));
    return tmp.join(", ");
  });
};

const tabs = reactive([
  {
    id: "nodes",
    title: "tabs.nodes",
    icon: "mdi-square-medium-outline",
    count: () => projStore.solver.domain.nodes.size,
  },
  {
    id: "elements",
    title: "tabs.elements",
    icon: "mdi-vector-line",
    count: () => projStore.solver.domain.elements.size,
  },
  {
    id: "loads",
    title: "tabs.loads",
    icon: "mdi-weight",
    count: () =>
      projStore.solver.loadCases[0].nodalLoadList.length + projStore.solver.loadCases[0].elementLoadList.length,
  },
  { id: "mats", title: "tabs.materials", icon: "mdi-texture-box", count: () => projStore.solver.domain.materials.size },
  {
    id: "cs",
    title: "tabs.crossSections",
    icon: "mdi-pentagon-outline",
    count: () => projStore.solver.domain.crossSections.size,
  },
  {
    id: "results",
    title: "tabs.results",
    icon: "mdi-numeric",
  },
]);

const headers = reactive({
  nodes: [
    {
      title: "common.node",
      key: "label",
      width: 100,
    },
    {
      title: "common.coords",
      key: "coords",
      width: 180,
    },
    {
      title: "dofs.bcs",
      key: "bcs",
      width: 260,
      sortable: false,
    },
    {
      title: "common.loads",
      key: "loads",
      width: 260,
      sortable: false,
    },
    {
      title: "common.actions",
      key: "actions",
      sortable: false,
    },
  ],
  elements: [
    {
      title: "common.element",
      key: "label",
      width: 100,
    },
    {
      title: "common.type",
      key: "type",
      width: 100,
    },
    {
      title: "common.nodes",
      key: "nodes",
      width: 240,
    },
    {
      title: "common.material",
      key: "material",
      width: 140,
    },
    {
      title: "common.crossSection",
      key: "cs",
      width: 140,
    },
    {
      title: "common.endHinges",
      key: "hinges[0]",
      width: 140,
      sortable: false,
    },
    /*{
      title: "common.massMatrix",
      key: "diagonalMassMatrix",
      width: 180,
    },*/
    {
      title: "common.loads",
      key: "loads",
      width: 260,
      sortable: false,
    },
    {
      title: "common.actions",
      key: "actions",
      sortable: false,
    },
  ],
  loads: [
    {
      title: "common.type",
      key: "type",
      width: 120,
    },
    {
      title: "common.target",
      key: "target",
      width: 140,
    },
    {
      title: "common.components",
      units: "Force",
      key: "load.values",
      width: 320,
    },
    {
      title: "common.actions",
      key: "actions",
      sortable: false,
    },
  ],
  materials: [
    {
      title: "common.material",
      key: "label",
      width: 120,
    },
    {
      title: "material.e",
      units: "Pressure",
      key: "e",
      width: 160,
    },
    {
      title: "material.g",
      units: "Pressure",
      key: "g",
      width: 160,
    },
    {
      title: "material.alphaT",
      tooltip: "Temperature coefficient",
      key: "alpha",
      width: 120,
    },

    {
      title: "material.density",
      key: "d",
      width: 120,
    },
    {
      title: "common.actions",
      key: "actions",
      sortable: false,
    },
  ],
  crossSections: [
    {
      title: "common.crossSection",
      key: "label",
      width: 160,
    },
    {
      title: "crossSection.area",
      units: "Area",
      key: "a",
      width: 160,
    },

    {
      title: "crossSection.iy",
      units: "AreaM2",
      key: "iy",
      width: 160,
    },
    {
      title: "crossSection.h",
      key: "h",
      width: 160,
    },
    {
      title: "crossSection.k",
      key: "k",
      width: 160,
    },
    {
      title: "common.actions",
      key: "actions",
      sortable: false,
    },
  ],
  results: [
    {
      title: "common.node",
      key: "label",
      width: 100,
    },
    {
      title: "results.results",
      key: "coords",
      sortable: false,
    },
  ],
});
</script>
