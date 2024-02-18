<template>
  <v-dialog v-model="open" max-width="420">
    <v-card>
      <v-card-title> {{ $t("dialogs.addNodalLoad.addNewNodalLoad") }} </v-card-title>

      <div>
        <v-radio-group
          v-model="loadType"
          v-if="projectStore.solver.domain.nodes.get(props.label).bcs.size > 0"
          inline
          density="compact"
          class="mx-3"
        >
          <v-radio label="Force" value="force"></v-radio>
          <v-radio label="Prescribed displacement" value="displacement"></v-radio>
        </v-radio-group>
        <v-form>
          <v-container>
            <v-row no-gutters>
              <v-col cols="6" align-self="center">
                <div class="d-flex justify-center">
                  <Vector2DHelper v-if="loadType === 'force'" :fx="realFx" :fz="realFz" :my="realMy" />
                </div>
              </v-col>

              <v-col cols="6">
                <v-row no-gutters>
                  <v-col cols="12">
                    <v-select
                      v-model="loadNodeId"
                      :items="useProjectStore().solver.domain.nodes.values() as unknown as unknown[]"
                      item-title="label"
                      item-value="label"
                      label="Node id"
                      hide-details="auto"
                      required
                      autofocus
                    />
                  </v-col>
                  <v-col cols="12">
                    <v-text-field
                      v-model="loadNodeValueFx"
                      @keydown="checkNumber($event)"
                      :label="`${mainLabel}x`"
                      hide-details="auto"
                      :suffix="mainUnits"
                      required
                    ></v-text-field>
                  </v-col>

                  <v-col cols="12">
                    <v-text-field
                      v-model="loadNodeValueFz"
                      @keydown="checkNumber($event)"
                      :label="`${mainLabel}z`"
                      hide-details="auto"
                      :suffix="mainUnits"
                      required
                    ></v-text-field>
                  </v-col>

                  <v-col cols="12">
                    <v-text-field
                      v-model="loadNodeValueMy"
                      @keydown="checkNumber($event)"
                      :label="`${momentLabel}y`"
                      hide-details="auto"
                      :suffix="`${momentUnits}`"
                      required
                    >
                    </v-text-field>
                  </v-col>
                </v-row>
              </v-col>
            </v-row>
          </v-container>
        </v-form>
      </div>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="green darken-1" @click="addNodalLoad()"> {{ $t("dialogs.addNodalLoad.addNodalLoad") }} </v-btn>
        <v-btn color="red darken-1" @click="closeModal()">{{ $t("dialogs.common.cancel") }}</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from "vue";
import { useProjectStore } from "../../store/project";
import { DofID, NodalLoad, PrescribedDisplacement } from "ts-fem";
import { closeModal } from "jenesius-vue-modal";
import { useAppStore } from "@/store/app";
import { checkNumber, parseFloat2 } from "@/utils";
import Vector2DHelper from "../Vector2DHelper.vue";
import { onMounted } from "vue";

const projectStore = useProjectStore();
const appStore = useAppStore();

const props = withDefaults(
  defineProps<{
    label?: string | number;
    type?: "force" | "displacement";
  }>(),
  {
    type: "force",
  }
);

const open = ref(true);
const loadType = ref("force");
const loadNodeId = ref(props.label ?? [...useProjectStore().solver.domain.nodes.values()][0].label);
const loadNodeValueFx = ref(appStore.convertForce(4000));
const loadNodeValueFz = ref(appStore.convertForce(3000));
const loadNodeValueMy = ref("0.0");

const mainLabel = computed(() => (loadType.value === "force" ? "F" : "D"));
const momentLabel = computed(() => (loadType.value === "force" ? "M" : "R"));

const mainUnits = computed(() => (loadType.value === "force" ? appStore.units.Force : appStore.units.Length));
const momentUnits = computed(() => (loadType.value === "force" ? appStore.units.Force + "m" : "rad"));

const realFx = computed(() => appStore.convertInverseForce(parseFloat2(loadNodeValueFx.value)));
const realFz = computed(() => appStore.convertInverseForce(parseFloat2(loadNodeValueFz.value)));
const realMy = computed(() => appStore.convertInverseForce(parseFloat2(loadNodeValueMy.value)));

const realDx = computed(() => appStore.convertInverseLength(parseFloat2(loadNodeValueFx.value)));
const realDz = computed(() => appStore.convertInverseLength(parseFloat2(loadNodeValueFz.value)));
const realRy = computed(() => parseFloat2(loadNodeValueMy.value));

onMounted(() => {
  if (props.type === "displacement") {
    loadType.value = "displacement";
  }
});

const addNodalLoad = () => {
  useProjectStore().solver.loadCases[0].solved = false;

  if (loadType.value === "force") {
    useProjectStore().solver.loadCases[0].createNodalLoad(loadNodeId.value, {
      [DofID.Dx]: realFx.value,
      [DofID.Dz]: realFz.value,
      [DofID.Ry]: realMy.value,
    });
  } else {
    // check if the node already has a prescribed displacement
    for (const load of projectStore.solver.loadCases[0].prescribedBC) {
      if (load.target === loadNodeId.value) {
        alert("Prescribed displacement already exists for this node. Please remove it first.");
        closeModal();
        return;
      }
    }

    useProjectStore().solver.loadCases[0].createPrescribedDisplacement(loadNodeId.value, {
      [DofID.Dx]: realDx.value,
      [DofID.Dz]: realDz.value,
      [DofID.Ry]: realRy.value,
    });
  }

  useProjectStore().solve();
  projectStore.clearSelection();
  closeModal();
};
</script>
