<template>
  <v-dialog class="no-overlay" v-model="useAppStore().dialogs.addNode" max-width="420">
    <v-card>
      <v-card-title class="text-h5"> Add new node </v-card-title>

      <v-card-text>
        <v-form>
          <v-container>
            <v-row>
              <v-col cols="12" md="6">
                <v-text-field v-model.number="newNodeX" label="X-coordinate" required></v-text-field>
              </v-col>

              <v-col cols="12" md="6">
                <v-text-field v-model.number="newNodeZ" label="Z-coordinate" required></v-text-field>
              </v-col>
            </v-row>
          </v-container>
        </v-form>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>

        <v-btn color="red darken-1" text @click="useAppStore().dialogs.addNode = false"> Cancel </v-btn>

        <v-btn color="green darken-1" text @click="addNode()"> Add node </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <v-dialog class="no-overlay" v-model="useAppStore().dialogs.addElement" max-width="420">
    <v-card>
      <v-card-title class="text-h5"> Add new element </v-card-title>

      <v-card-text>
        <v-form>
          <v-container>
            <v-row>
              <v-col cols="12" md="6">
                <v-select
                  v-model="newElementFrom"
                  :items="useProjectStore().solver.domain.nodes.values() as unknown as unknown[]"
                  item-title="label"
                  item-value="label"
                  label="From node id"
                  required
                />
              </v-col>

              <v-col cols="12" md="6">
                <v-select
                  v-model="newElementTo"
                  :items="useProjectStore().solver.domain.nodes.values() as unknown as unknown[]"
                  item-title="label"
                  item-value="label"
                  label="To node id"
                  required
                />
              </v-col>
            </v-row>
          </v-container>
        </v-form>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>

        <v-btn color="red darken-1" text @click="useAppStore().dialogs.addElement = false"> Cancel </v-btn>

        <v-btn color="green darken-1" text @click="addElement()"> Add element </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <v-dialog class="no-overlay" v-model="useAppStore().dialogs.addNodalLoad" max-width="420">
    <v-card>
      <v-card-title class="text-h5"> Add nodal load </v-card-title>

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

        <v-btn color="red darken-1" text @click="useAppStore().dialogs.addNodalLoad = false"> Cancel </v-btn>

        <v-btn color="green darken-1" text @click="addNodalLoad()"> Add nodal load </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <v-dialog class="no-overlay" v-model="useAppStore().dialogs.addElementLoad" max-width="420">
    <v-card>
      <v-card-title class="text-h5"> Add element load </v-card-title>

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

        <v-btn color="red darken-1" text @click="useAppStore().dialogs.addElementLoad = false"> Cancel </v-btn>

        <v-btn color="green darken-1" text @click="addElementLoad()"> Add element load </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useProjectStore } from "../store/project";
import { useAppStore } from "../store/app";
import { DofID } from "ts-fem";

const newNodeX = ref(0.0);
const newNodeZ = ref(0.0);

const newElementFrom = ref(0);
const newElementTo = ref(0);

const loadNodeId = ref(1);
const loadElementId = ref(1);
const loadNodeValueFx = ref(0.0);
const loadNodeValueFz = ref(0.0);
const loadNodeValueMy = ref(0.0);

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
</script>
