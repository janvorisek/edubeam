<template>
  <v-dialog v-model="open" max-width="420">
    <v-card>
      <v-card-title class="text-h5"> {{ $t("dialogs.editElementLoad.editElementLoad") }} </v-card-title>

      <v-card-text>
        <v-form>
          <v-container>
            <v-row>
              <v-col cols="12" md="12">
                <v-select
                  v-model="elementd"
                  :items="useProjectStore().solver.domain.nodes.values() as unknown as unknown[]"
                  item-title="label"
                  item-value="label"
                  label="Element id"
                  required
                  disabled
                  autofocus
                />
              </v-col>

              <v-col cols="12" md="4">
                <v-text-field
                  :model-value="appStore.convertForce(elementNodeValueFx)"
                  @keydown="checkNumber($event)"
                  @input="
                    elementNodeValueFx = appStore.convertInverseForce(
                      $event.target.value !== '' ? parseFloat($event.target.value) : 0
                    )
                  "
                  label="fx"
                  required
                ></v-text-field>
              </v-col>

              <v-col cols="12" md="4">
                <v-text-field
                  :model-value="appStore.convertForce(elementNodeValueFz)"
                  @keydown="checkNumber($event)"
                  @input="
                    elementNodeValueFz = appStore.convertInverseForce(
                      $event.target.value !== '' ? parseFloat($event.target.value) : 0
                    )
                  "
                  label="fz"
                  required
                ></v-text-field>
              </v-col>

              <v-col cols="12" md="4">
                <v-text-field
                  :model-value="appStore.convertForce(elementNodeValueMy)"
                  @keydown="checkNumber($event)"
                  @input="
                    elementNodeValueMy = appStore.convertInverseForce(
                      $event.target.value !== '' ? parseFloat($event.target.value) : 0
                    )
                  "
                  label="my"
                  required
                ></v-text-field>
              </v-col>
            </v-row>
          </v-container>
        </v-form>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="green darken-1" @click="editNodalLoad()">
          {{ $t("dialogs.editElementLoad.editElementLoad") }}
        </v-btn>
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
const elementNodeValueFx = ref(0.0);
const elementNodeValueFz = ref(0.0);
const elementNodeValueMy = ref(0.0);

onMounted(() => {
  const load = useProjectStore().solver.loadCases[0].elementLoadList[props.index];

  elementNodeValueFx.value = load.values[0];
  elementNodeValueFz.value = load.values[1];
  //elementNodeValueMy.value = load.values[DofID.Ry];
});

const editNodalLoad = () => {
  const load = useProjectStore().solver.loadCases[0].elementLoadList[props.index];

  load.values[0] = elementNodeValueFx.value;
  load.values[1] = elementNodeValueFz.value;
  //load.values[DofID.Ry] = loadNodeValueMy.value;

  useProjectStore().solve();
  projectStore.clearSelection();
  closeModal();
};

const elementd = computed(() => {
  return useProjectStore().solver.loadCases[0].elementLoadList[props.index].target;
});
</script>
