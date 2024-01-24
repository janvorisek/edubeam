<template>
  <v-dialog v-model="open" max-width="420">
    <v-card>
      <v-card-title class="text-h5"> {{ $t("dialogs.editNodalLoad.editNodalLoad") }} </v-card-title>

      <v-card-text>
        <v-form>
          <v-container>
            <v-row no-gutters>
              <v-col cols="6" align-self="center">
                <div class="d-flex justify-center">
                  <Vector2DHelper :fx="realFx" :fz="realFz" :my="realMy" />
                </div>
              </v-col>

              <v-col cols="6">
                <v-row no-gutters>
                  <v-col cols="12">
                    <v-select
                      v-model="nodeId"
                      :items="useProjectStore().solver.domain.nodes.values() as unknown as unknown[]"
                      item-title="label"
                      item-value="label"
                      label="Node id"
                      hide-details="auto"
                      required
                      disabled
                      autofocus
                    />
                  </v-col>
                  <v-col cols="12">
                    <v-text-field
                      v-model="loadNodeValueFx"
                      @keydown="checkNumber($event)"
                      label="Fx"
                      hide-details="auto"
                      :suffix="appStore.units.Force"
                      required
                    ></v-text-field>
                  </v-col>

                  <v-col cols="12">
                    <v-text-field
                      v-model="loadNodeValueFz"
                      @keydown="checkNumber($event)"
                      label="Fz"
                      hide-details="auto"
                      :suffix="appStore.units.Force"
                      required
                    ></v-text-field>
                  </v-col>

                  <v-col cols="12">
                    <v-text-field
                      v-model="loadNodeValueMy"
                      @keydown="checkNumber($event)"
                      label="My"
                      hide-details="auto"
                      :suffix="`${appStore.units.Force}m`"
                      required
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
        <v-btn color="green darken-1" @click="editNodalLoad()"> {{ $t("dialogs.editNodalLoad.editNodalLoad") }} </v-btn>
        <v-btn color="red darken-1" @click="closeModal()">{{ $t("dialogs.common.cancel") }}</v-btn>
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

const projectStore = useProjectStore();
const appStore = useAppStore();

const props = defineProps<{
  index: number;
}>();

const open = ref(true);
const loadNodeValueFx = ref("");
const loadNodeValueFz = ref("");
const loadNodeValueMy = ref("");

const realFx = computed(() => appStore.convertInverseForce(parseFloat2(loadNodeValueFx.value)));
const realFz = computed(() => appStore.convertInverseForce(parseFloat2(loadNodeValueFz.value)));
const realMy = computed(() => appStore.convertInverseForce(parseFloat2(loadNodeValueMy.value)));

onMounted(() => {
  const load = useProjectStore().solver.loadCases[0].nodalLoadList[props.index];

  loadNodeValueFx.value = appStore.convertForce(load.values[DofID.Dx]).toString();
  loadNodeValueFz.value = appStore.convertForce(load.values[DofID.Dz]).toString();
  loadNodeValueMy.value = appStore.convertForce(load.values[DofID.Ry]).toString();
});

const editNodalLoad = () => {
  const load = useProjectStore().solver.loadCases[0].nodalLoadList[props.index];

  load.values[DofID.Dx] = realFx.value;
  load.values[DofID.Dz] = realFz.value;
  load.values[DofID.Ry] = realMy.value;

  useProjectStore().solve();
  projectStore.clearSelection();
  closeModal();
};

const nodeId = computed(() => {
  return useProjectStore().solver.loadCases[0].nodalLoadList[props.index].target;
});
</script>
