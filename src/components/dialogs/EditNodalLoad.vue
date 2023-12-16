<template>
  <v-dialog v-model="open" max-width="420">
    <v-card>
      <v-card-title class="text-h5"> {{ $t("dialogs.editNodalLoad.editNodalLoad") }} </v-card-title>

      <v-card-text>
        <v-form>
          <v-container>
            <v-row>
              <v-col cols="12" md="12">
                <v-select
                  v-model="nodeId"
                  :items="useProjectStore().solver.domain.nodes.values() as unknown as unknown[]"
                  item-title="label"
                  item-value="label"
                  label="Node id"
                  required
                  disabled
                  autofocus
                />
              </v-col>

              <v-col cols="12" md="4">
                <v-text-field
                  :model-value="appStore.convertForce(loadNodeValueFx)"
                  @keydown="checkNumber($event)"
                  @input="loadNodeValueFx = appStore.convertInverseForce(parseFloat($event.target.value))"
                  label="Fx"
                  required
                ></v-text-field>
              </v-col>

              <v-col cols="12" md="4">
                <v-text-field
                  :model-value="appStore.convertForce(loadNodeValueFz)"
                  @keydown="checkNumber($event)"
                  @input="loadNodeValueFz = appStore.convertInverseForce(parseFloat($event.target.value))"
                  label="Fz"
                  required
                ></v-text-field>
              </v-col>

              <v-col cols="12" md="4">
                <v-text-field
                  :model-value="appStore.convertForce(loadNodeValueMy)"
                  @keydown="checkNumber($event)"
                  @input="loadNodeValueMy = appStore.convertInverseForce(parseFloat($event.target.value))"
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
        <v-btn color="green darken-1" @click="editNodalLoad()"> {{ $t("dialogs.editNodalLoad.editNodalLoad") }} </v-btn>
        <v-btn color="red darken-1" @click="closeModal()">{{ $t("dialogs.common.cancel") }}</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { useProjectStore } from "@/store/project";
import { DofID } from "ts-fem";
import { closeModal } from "jenesius-vue-modal";
import { onMounted } from "vue";
import { useAppStore } from "@/store/app";
import { checkNumber } from "@/utils";

const projectStore = useProjectStore();
const appStore = useAppStore();

const props = defineProps<{
  index: number;
}>();

const open = ref(true);
const loadNodeValueFx = ref(0.0);
const loadNodeValueFz = ref(0.0);
const loadNodeValueMy = ref(0.0);

onMounted(() => {
  const load = useProjectStore().solver.loadCases[0].nodalLoadList[props.index];

  loadNodeValueFx.value = load.values[DofID.Dx];
  loadNodeValueFz.value = load.values[DofID.Dz];
  loadNodeValueMy.value = load.values[DofID.Ry];
});

const editNodalLoad = () => {
  const load = useProjectStore().solver.loadCases[0].nodalLoadList[props.index];

  load.values[DofID.Dx] = loadNodeValueFx.value;
  load.values[DofID.Dz] = loadNodeValueFz.value;
  load.values[DofID.Ry] = loadNodeValueMy.value;

  useProjectStore().solve();
  projectStore.clearSelection();
  closeModal();
};

const nodeId = computed(() => {
  return useProjectStore().solver.loadCases[0].nodalLoadList[props.index].target;
});
</script>
