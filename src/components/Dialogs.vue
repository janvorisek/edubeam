<template>
  <v-dialog v-model="useAppStore().dialogs.addNode" class="no-overlay" max-width="420">
    <v-card>
      <v-card-title> {{ $t('dialogs.addNode.addNewNode') }} </v-card-title>

      <v-card-text>
        <v-form>
          <v-container>
            <v-row no-gutters>
              <v-col cols="6" md="6">
                <v-text-field
                  v-model.number="newNodeX"
                  :label="$t('dialogs.addNode.coordinate_x')"
                  hide-details="auto"
                  autofocus
                  required
                ></v-text-field>
              </v-col>

              <v-col cols="6" md="6">
                <v-text-field
                  v-model.number="newNodeZ"
                  :label="$t('dialogs.addNode.coordinate_z')"
                  hide-details="auto"
                  required
                ></v-text-field>
              </v-col>
            </v-row>
          </v-container>
        </v-form>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="green darken-1" @click="addNode()"> {{ $t('dialogs.addNode.addNode') }} </v-btn>
        <v-btn color="red darken-1" @click="useAppStore().dialogs.addNode = false">
          {{ $t('dialogs.common.cancel') }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <v-dialog v-model="useAppStore().dialogs.addElement" class="no-overlay" max-width="420">
    <v-card>
      <v-card-title> {{ $t('dialogs.addElement.addNewElement') }} </v-card-title>

      <v-card-text>
        <v-form>
          <v-container>
            <v-row no-gutters>
              <v-col cols="6" md="6">
                <v-select
                  v-model="newElementFrom"
                  :items="useProjectStore().solver.domain.nodes.values() as unknown as unknown[]"
                  item-title="label"
                  item-value="label"
                  :label="$t('dialogs.addElement.fromNodeId')"
                  hide-details="auto"
                  required
                  autofocus
                />
              </v-col>

              <v-col cols="6" md="6">
                <v-select
                  v-model="newElementTo"
                  :items="useProjectStore().solver.domain.nodes.values() as unknown as unknown[]"
                  item-title="label"
                  item-value="label"
                  :label="$t('dialogs.addElement.toNodeId')"
                  hide-details="auto"
                  required
                />
              </v-col>
            </v-row>
          </v-container>
        </v-form>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="green darken-1" @click="addElement()"> {{ $t('dialogs.addElement.addElement') }} </v-btn>
        <v-btn color="red darken-1" @click="useAppStore().dialogs.addElement = false">{{
          $t('dialogs.common.cancel')
        }}</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <v-dialog v-model="useAppStore().dialogs.addNodalLoad" class="no-overlay" max-width="420">
    <v-card>
      <v-card-title> {{ $t('dialogs.addNodalLoad.addNewNodalLoad') }} </v-card-title>

      <v-card-text>
        <v-form>
          <v-container>
            <v-row>
              <v-col cols="12" md="12">
                <v-select
                  v-model="loadNodeId"
                  :items="useProjectStore().solver.domain.nodes.values() as unknown as unknown[]"
                  item-title="label"
                  item-value="label"
                  label="Node id"
                  required
                  autofocus
                />
              </v-col>

              <v-col cols="12" md="4">
                <v-text-field v-model.number="loadNodeValueFx" label="Fx" required></v-text-field>
              </v-col>

              <v-col cols="12" md="4">
                <v-text-field v-model.number="loadNodeValueFz" label="Fz" required></v-text-field>
              </v-col>

              <v-col cols="12" md="4">
                <v-text-field v-model.number="loadNodeValueMy" label="My" required></v-text-field>
              </v-col>
            </v-row>
          </v-container>
        </v-form>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="green darken-1" @click="addNodalLoad()"> {{ $t('dialogs.addNodalLoad.addNodalLoad') }} </v-btn>
        <v-btn color="red darken-1" @click="useAppStore().dialogs.addNodalLoad = false">{{
          $t('dialogs.common.cancel')
        }}</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <v-dialog v-model="useAppStore().dialogs.addElementLoad" class="no-overlay" max-width="420">
    <v-card>
      <v-card-title> {{ $t('dialogs.addElementLoad.addNewElementLoad') }} </v-card-title>

      <v-card-text>
        <v-form>
          <v-container>
            <v-row>
              <v-col cols="12" md="12">
                <v-select
                  v-model="loadElementId"
                  :items="useProjectStore().solver.domain.elements.values() as unknown as unknown[]"
                  item-title="label"
                  item-value="label"
                  label="Element id"
                  required
                  autofocus
                />
              </v-col>

              <v-col cols="12" md="6">
                <v-text-field v-model.number="loadNodeValueFx" label="Fx" required></v-text-field>
              </v-col>

              <v-col cols="12" md="6">
                <v-text-field v-model.number="loadNodeValueFz" label="Fz" required></v-text-field>
              </v-col>
            </v-row>
          </v-container>
        </v-form>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="green darken-1" @click="addElementLoad()">
          {{ $t('dialogs.addElementLoad.addElementLoad') }}
        </v-btn>
        <v-btn color="red darken-1" @click="useAppStore().dialogs.addElementLoad = false">{{
          $t('dialogs.common.cancel')
        }}</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <v-dialog v-model="useAppStore().dialogs.addMaterial" class="no-overlay" max-width="420">
    <v-card>
      <v-card-title> {{ $t('dialogs.addMaterial.addNewMaterial') }} </v-card-title>

      <v-card-text>
        <v-form>
          <v-container>
            <v-row no-gutters>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model.number="matE"
                  :label="$t('dialogs.addMaterial.E')"
                  hide-details="auto"
                  required
                  autofocus
                ></v-text-field>
              </v-col>

              <v-col cols="12" md="6">
                <v-text-field
                  v-model.number="matG"
                  :label="$t('dialogs.addMaterial.G')"
                  hide-details="auto"
                  required
                ></v-text-field>
              </v-col>

              <v-col cols="12" md="6">
                <v-text-field
                  v-model.number="matDensity"
                  :label="$t('dialogs.addMaterial.density')"
                  hide-details="auto"
                  required
                ></v-text-field>
              </v-col>

              <v-col cols="12" md="6">
                <v-text-field
                  v-model.number="matAlphaTemp"
                  :label="$t('dialogs.addMaterial.alphaT')"
                  hide-details="auto"
                  required
                ></v-text-field>
              </v-col>
            </v-row>
          </v-container>
        </v-form>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="green darken-1" @click="addMaterial()"> {{ $t('dialogs.addMaterial.addMaterial') }} </v-btn>
        <v-btn color="red darken-1" @click="useAppStore().dialogs.addMaterial = false">{{
          $t('dialogs.common.cancel')
        }}</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <v-dialog v-model="useAppStore().dialogs.addCrossSection" class="no-overlay" max-width="420">
    <v-card>
      <v-card-title> {{ $t('dialogs.addCrossSection.addNewCrossSection') }} </v-card-title>

      <v-card-text>
        <v-form>
          <v-container>
            <v-row no-gutters>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model.number="csArea"
                  label="A - area"
                  hide-details="auto"
                  required
                  autofocus
                ></v-text-field>
              </v-col>

              <v-col cols="12" md="6">
                <v-text-field
                  v-model.number="csIy"
                  label="Iy - second moment of area"
                  hide-details="auto"
                  required
                ></v-text-field>
              </v-col>

              <v-col cols="12" md="6">
                <v-text-field v-model.number="csH" label="h - Height" hide-details="auto" required></v-text-field>
              </v-col>

              <v-col cols="12" md="6">
                <v-text-field
                  v-model.number="csShear"
                  label="Shear coefficient"
                  hide-details="auto"
                  required
                ></v-text-field>
              </v-col>
            </v-row>
          </v-container>
        </v-form>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="green darken-1" @click="addCrossSection()">
          {{ $t('dialogs.addCrossSection.addCrossSection') }}
        </v-btn>
        <v-btn color="red darken-1" @click="useAppStore().dialogs.addCrossSection = false">{{
          $t('dialogs.common.cancel')
        }}</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useProjectStore } from '../store/project';
import { useAppStore } from '../store/app';
import { DofID } from 'ts-fem';
import { setUnsolved } from '../utils/index';

const newNodeX = ref(0.0);
const newNodeZ = ref(0.0);

const newElementFrom = ref(0);
const newElementTo = ref(0);

const loadNodeId = ref(1);
const loadElementId = ref(1);
const loadNodeValueFx = ref(0.0);
const loadNodeValueFz = ref(0.0);
const loadNodeValueMy = ref(0.0);

const matE = ref(210000e6);
const matG = ref(210000e6 / (2 * (1 + 0.2)));
const matDensity = ref(1000);
const matAlphaTemp = ref(12e-6);

const csArea = ref(1);
const csIy = ref(0.0001);
const csH = ref(1);
const csShear = ref(1);

const addNode = () => {
  const domain = useProjectStore().solver.domain;

  const nid = domain.nodes.size + 1; //Math.round(Date.now() / 1000);

  domain.createNode(nid, [newNodeX.value, 0.0, newNodeZ.value]);

  domain.nodes = new Map(domain.nodes);

  useAppStore().dialogs.addNode = false;
};

const addElement = () => {
  const domain = useProjectStore().solver.domain;

  //if (domain.elements.has(999)) return alert("Element id 999 already exists");

  const nid = domain.elements.size + 1;

  domain.createBeam2D(nid, [newElementFrom.value, newElementTo.value], 1, 1);

  domain.elements = new Map(domain.elements);

  useAppStore().dialogs.addElement = false;

  useProjectStore().solve();
};

const addNodalLoad = () => {
  useProjectStore().solver.loadCases[0].createNodalLoad(loadNodeId.value, {
    [DofID.Dx]: loadNodeValueFx.value,
    [DofID.Dz]: loadNodeValueFz.value,
    [DofID.Ry]: loadNodeValueMy.value,
  });

  useAppStore().dialogs.addNodalLoad = false;

  useProjectStore().solve();
};

const addElementLoad = () => {
  useProjectStore().solver.loadCases[0].createBeamElementUniformEdgeLoad(
    loadElementId.value,
    [loadNodeValueFx.value, loadNodeValueFz.value],
    true
  );

  useAppStore().dialogs.addElementLoad = false;

  useProjectStore().solve();
};

const addMaterial = () => {
  setUnsolved();

  const domain = useProjectStore().solver.domain;

  const nid = domain.materials.size + 1;

  domain.createMaterial(nid, { e: matE.value, g: matG.value, alpha: matAlphaTemp.value, d: matDensity.value });

  useAppStore().dialogs.addMaterial = false;
  useProjectStore().solve();
};

const addCrossSection = () => {
  setUnsolved();
  const domain = useProjectStore().solver.domain;

  const nid = domain.crossSections.size + 1;

  domain.createCrossSection(nid, { a: csArea.value, iy: csIy.value, h: csH.value, k: csShear.value });

  useAppStore().dialogs.addCrossSection = false;
  useProjectStore().solve();
};
</script>
