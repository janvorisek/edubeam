<template>
  <v-dialog v-model="open" max-width="420">
    <v-card>
      <v-card-title> {{ $t("dialogs.editNodalLoad.editNodalLoad") }} </v-card-title>

      <v-card-text>
        <v-form v-model="valid">
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
                      :items="projectStore.nodes"
                      item-title="label"
                      item-value="label"
                      :label="$t('common.node')"
                      hide-details="auto"
                      disabled
                      autofocus
                    />
                  </v-col>
                  <v-col cols="12">
                    <v-text-field
                      v-model="loadNodeValueFx"
                      @keydown="checkNumber($event)"
                      :label="`${mainLabel}x`"
                      hide-details="auto"
                      :rules="numberRules"
                      :suffix="mainUnits"
                      :disabled="
                        loadType === 'displacement' && !projectStore.solver.domain.nodes.get(loadNodeId).bcs.has(0)
                      "
                    ></v-text-field>
                  </v-col>

                  <v-col cols="12">
                    <v-text-field
                      v-model="loadNodeValueFz"
                      @keydown="checkNumber($event)"
                      :label="`${mainLabel}z`"
                      hide-details="auto"
                      :rules="numberRules"
                      :suffix="mainUnits"
                      :disabled="
                        loadType === 'displacement' && !projectStore.solver.domain.nodes.get(loadNodeId).bcs.has(2)
                      "
                    ></v-text-field>
                  </v-col>

                  <v-col cols="12">
                    <v-text-field
                      v-model="loadNodeValueMy"
                      @keydown="checkNumber($event)"
                      :label="`${momentLabel}y`"
                      hide-details="auto"
                      :rules="numberRules"
                      :suffix="`${momentUnits}`"
                      :disabled="
                        loadType === 'displacement' && !projectStore.solver.domain.nodes.get(loadNodeId).bcs.has(4)
                      "
                    >
                    </v-text-field>
                  </v-col>
                </v-row>
              </v-col>
            </v-row>
          </v-container>
        </v-form>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="green darken-1" @click="editNodalLoad()" @keydown.enter="editNodalLoad">
          {{ $t("dialogs.editNodalLoad.editNodalLoad") }}
        </v-btn>
        <v-btn color="red darken-1" @click="closeModal()" @keydown.enter="closeModal">{{
          $t("dialogs.common.cancel")
        }}</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { onMounted, ref, reactive, computed } from "vue";
import { useProjectStore } from "../../store/project";
import { DofID, NodalLoad } from "ts-fem";
import { closeModal } from "jenesius-vue-modal";
import { useAppStore } from "@/store/app";
import { checkNumber, parseFloat2 } from "@/utils";
import Vector2DHelper from "../Vector2DHelper.vue";
import { numberRules } from "../../utils";

const projectStore = useProjectStore();
const appStore = useAppStore();

const props = withDefaults(
  defineProps<{
    index: number;
    type?: "force" | "displacement";
  }>(),
  {
    type: "force",
  }
);

const open = ref(true);
const valid = ref(false);

const loadType = ref("force");
const loadNodeValueFx = ref("");
const loadNodeValueFz = ref("");
const loadNodeValueMy = ref("");

const realFx = computed(() => {
  if (loadType.value === "force") {
    return appStore.convertInverseForce(parseFloat2(loadNodeValueFx.value));
  }

  return appStore.convertInverseLength(parseFloat2(loadNodeValueFx.value));
});

const realFz = computed(() => {
  if (loadType.value === "force") {
    return appStore.convertInverseForce(parseFloat2(loadNodeValueFz.value));
  }

  return appStore.convertInverseLength(parseFloat2(loadNodeValueFz.value));
});

const realMy = computed(() => {
  if (loadType.value === "force") {
    return appStore.convertInverseForce(parseFloat2(loadNodeValueMy.value));
  }

  return appStore.convertInverseLength(parseFloat2(loadNodeValueMy.value));
});

const mainLabel = computed(() => (loadType.value === "force" ? "F" : "D"));
const momentLabel = computed(() => (loadType.value === "force" ? "M" : "R"));

const mainUnits = computed(() => (loadType.value === "force" ? appStore.units.Force : appStore.units.Length));
const momentUnits = computed(() => (loadType.value === "force" ? appStore.units.Force + "m" : "rad"));

onMounted(() => {
  if (props.type === "displacement") {
    loadType.value = "displacement";
  }

  if (props.type === "displacement") {
    const load = useProjectStore().solver.loadCases[0].prescribedBC[props.index];
    loadNodeValueFx.value = appStore.convertLength(load.prescribedValues[DofID.Dx]).toString();
    loadNodeValueFz.value = appStore.convertLength(load.prescribedValues[DofID.Dz]).toString();
    loadNodeValueMy.value = appStore.convertLength(load.prescribedValues[DofID.Ry]).toString();
  } else {
    const load = useProjectStore().solver.loadCases[0].nodalLoadList[props.index];
    loadNodeValueFx.value = appStore.convertForce(load.values[DofID.Dx]).toString();
    loadNodeValueFz.value = appStore.convertForce(load.values[DofID.Dz]).toString();
    loadNodeValueMy.value = appStore.convertForce(load.values[DofID.Ry]).toString();
  }
});

const editNodalLoad = () => {
  if (valid.value === false) return;

  if (props.type === "displacement") {
    const load = useProjectStore().solver.loadCases[0].prescribedBC[props.index];
    load.prescribedValues[DofID.Dx] = realFx.value;
    load.prescribedValues[DofID.Dz] = realFz.value;
    load.prescribedValues[DofID.Ry] = realMy.value;
  } else {
    const load = useProjectStore().solver.loadCases[0].nodalLoadList[props.index];
    load.values[DofID.Dx] = realFx.value;
    load.values[DofID.Dz] = realFz.value;
    load.values[DofID.Ry] = realMy.value;
  }

  useProjectStore().solve();
  projectStore.clearSelection();
  closeModal();
};

const loadNodeId = computed(() => {
  if (props.type === "displacement") return useProjectStore().solver.loadCases[0].prescribedBC[props.index].target;

  return useProjectStore().solver.loadCases[0].nodalLoadList[props.index].target;
});
</script>
