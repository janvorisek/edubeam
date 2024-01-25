<template>
  <v-dialog v-model="open" max-width="420">
    <v-card>
      <v-card-title> {{ $t("dialogs.editElementLoad.editElementLoad") }} </v-card-title>

      <v-card-text>
        <v-form>
          <v-container>
            <v-row no-gutters>
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

              <v-col cols="12" md="6">
                <v-text-field
                  v-model="elementNodeValueFx"
                  @keydown="checkNumber($event)"
                  label="fx"
                  :suffix="`${appStore.units.Force}/m`"
                  required
                ></v-text-field>
              </v-col>

              <v-col cols="12" md="6">
                <v-text-field
                  v-model="elementNodeValueFz"
                  @keydown="checkNumber($event)"
                  label="fz"
                  :suffix="`${appStore.units.Force}/m`"
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
import { closeModal } from "jenesius-vue-modal";
import { onMounted } from "vue";
import { useAppStore } from "@/store/app";
import { checkNumber, parseFloat2 } from "@/utils";

const projectStore = useProjectStore();
const appStore = useAppStore();

const props = defineProps<{
  index: number;
}>();

const open = ref(true);
const elementNodeValueFx = ref("0.0");
const elementNodeValueFz = ref("0.0");

const realFx = computed(() => appStore.convertInverseForce(parseFloat2(elementNodeValueFx.value)));
const realFz = computed(() => appStore.convertInverseForce(parseFloat2(elementNodeValueFz.value)));

onMounted(() => {
  const load = useProjectStore().solver.loadCases[0].elementLoadList[props.index];

  elementNodeValueFx.value = appStore.convertForce(load.values[0]).toFixed();
  elementNodeValueFz.value = appStore.convertForce(load.values[1]).toFixed();
  //elementNodeValueMy.value = load.values[DofID.Ry];
});

const editNodalLoad = () => {
  const load = useProjectStore().solver.loadCases[0].elementLoadList[props.index];

  load.values[0] = realFx.value;
  load.values[1] = realFz.value;
  //load.values[DofID.Ry] = loadNodeValueMy.value;

  useProjectStore().solve();
  projectStore.clearSelection();
  closeModal();
};

const elementd = computed(() => {
  return useProjectStore().solver.loadCases[0].elementLoadList[props.index].target;
});
</script>
