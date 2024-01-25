<template>
  <v-dialog v-model="open" max-width="420">
    <v-card>
      <v-card-title> {{ $t("dialogs.addNodalLoad.addNewNodalLoad") }} </v-card-title>

      <div>
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
import { DofID, NodalLoad } from "ts-fem";
import { closeModal } from "jenesius-vue-modal";
import { useAppStore } from "@/store/app";
import { checkNumber, parseFloat2 } from "@/utils";
import Vector2DHelper from "../Vector2DHelper.vue";

const projectStore = useProjectStore();
const appStore = useAppStore();

const props = defineProps<{
  label?: string | number;
}>();

const open = ref(true);
const loadNodeId = ref(props.label ?? [...useProjectStore().solver.domain.nodes.values()][0].label);
const loadNodeValueFx = ref(appStore.convertForce(4000));
const loadNodeValueFz = ref(appStore.convertForce(3000));
const loadNodeValueMy = ref("0.0");

const realFx = computed(() => appStore.convertInverseForce(parseFloat2(loadNodeValueFx.value)));
const realFz = computed(() => appStore.convertInverseForce(parseFloat2(loadNodeValueFz.value)));
const realMy = computed(() => appStore.convertInverseForce(parseFloat2(loadNodeValueMy.value)));

const addNodalLoad = () => {
  useProjectStore().solver.loadCases[0].solved = false;
  useProjectStore().solver.loadCases[0].createNodalLoad(loadNodeId.value, {
    [DofID.Dx]: realFx.value,
    [DofID.Dz]: realFz.value,
    [DofID.Ry]: realMy.value,
  });

  useProjectStore().solve();
  projectStore.clearSelection();
  closeModal();
};
</script>
