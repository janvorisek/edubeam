<template>
  <v-dialog v-model="open" max-width="420">
    <v-card>
      <v-card-title class="text-h5"> {{ $t("dialogs.addNodalLoad.addNewNodalLoad") }} </v-card-title>

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
                <v-text-field
                  :model-value="appStore.convertForce(loadNodeValueFx)"
                  @keydown="checkNumber($event)"
                  @input="
                    loadNodeValueFx = appStore.convertInverseForce(
                      $event.target.value !== '' ? parseFloat($event.target.value) : 0
                    )
                  "
                  label="Fx"
                  required
                ></v-text-field>
              </v-col>

              <v-col cols="12" md="4">
                <v-text-field
                  :model-value="appStore.convertForce(loadNodeValueFz)"
                  @keydown="checkNumber($event)"
                  @input="
                    loadNodeValueFz = appStore.convertInverseForce(
                      $event.target.value !== '' ? parseFloat($event.target.value) : 0
                    )
                  "
                  label="Fz"
                  required
                ></v-text-field>
              </v-col>

              <v-col cols="12" md="4">
                <v-text-field
                  :model-value="appStore.convertForce(loadNodeValueMy)"
                  @keydown="checkNumber($event)"
                  @input="
                    loadNodeValueMy = appStore.convertInverseForce(
                      $event.target.value !== '' ? parseFloat($event.target.value) : 0
                    )
                  "
                  label="My"
                  required
                ></v-text-field>
              </v-col>
            </v-row>
          </v-container>
        </v-form>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="green darken-1" @click="addNodalLoad()"> {{ $t("dialogs.addNodalLoad.addNodalLoad") }} </v-btn>
        <v-btn color="red darken-1" @click="closeModal()">{{ $t("dialogs.common.cancel") }}</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useProjectStore } from "../../store/project";
import { DofID } from "ts-fem";
import { closeModal } from "jenesius-vue-modal";
import { useAppStore } from "@/store/app";
import { checkNumber } from "@/utils";

const projectStore = useProjectStore();
const appStore = useAppStore();

const props = defineProps<{
  label?: string | number;
}>();

const open = ref(true);
const loadNodeId = ref(props.label ?? [...useProjectStore().solver.domain.nodes.values()][0].label);
const loadNodeValueFx = ref(0.0);
const loadNodeValueFz = ref(0.0);
const loadNodeValueMy = ref(0.0);

const addNodalLoad = () => {
  useProjectStore().solver.loadCases[0].createNodalLoad(loadNodeId.value, {
    [DofID.Dx]: loadNodeValueFx.value,
    [DofID.Dz]: loadNodeValueFz.value,
    [DofID.Ry]: loadNodeValueMy.value,
  });

  useProjectStore().solve();
  projectStore.clearSelection();
  closeModal();
};
</script>
