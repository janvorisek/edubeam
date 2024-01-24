<template>
  <v-dialog v-model="open" max-width="420">
    <v-card>
      <v-card-title class="text-h5"> {{ $t("dialogs.addElementLoad.addNewElementLoad") }} </v-card-title>

      <v-card-text>
        <v-form>
          <v-container>
            <v-row no-gutters="">
              <v-col cols="12" md="12">
                <v-select
                  v-model="loadElementId"
                  :items="useProjectStore().solver.domain.elements.values() as unknown as unknown[]"
                  item-title="label"
                  item-value="label"
                  label="Element id"
                  hide-details="auto"
                  required
                  autofocus
                />
              </v-col>

              <v-col cols="12" md="6">
                <v-text-field
                  v-model="loadNodeValueFx"
                  @keydown="checkNumber($event)"
                  label="fx"
                  hide-details="auto"
                  :suffix="`${appStore.units.Force}/m`"
                  required
                ></v-text-field>
              </v-col>

              <v-col cols="12" md="6">
                <v-text-field
                  v-model="loadNodeValueFz"
                  @keydown="checkNumber($event)"
                  label="fz"
                  hide-details="auto"
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
        <v-btn color="green darken-1" @click="addElementLoad()">
          {{ $t("dialogs.addElementLoad.addElementLoad") }}
        </v-btn>
        <v-btn color="red darken-1" @click="closeModal">{{ $t("dialogs.common.cancel") }}</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { useProjectStore } from "../../store/project";
import { useAppStore } from "../../store/app";
import { closeModal } from "jenesius-vue-modal";
import { checkNumber, parseFloat2 } from "@/utils";

const projectStore = useProjectStore();
const appStore = useAppStore();

const props = defineProps<{
  label: string | number;
}>();

const open = ref(true);
const loadElementId = ref(props.label ?? [...useProjectStore().solver.domain.elements.values()][0].label);
const loadNodeValueFx = ref(appStore.convertForce(4000));
const loadNodeValueFz = ref(appStore.convertForce(3000));

const realFx = computed(() => appStore.convertInverseForce(parseFloat2(loadNodeValueFx.value)));
const realFz = computed(() => appStore.convertInverseForce(parseFloat2(loadNodeValueFz.value)));

const addElementLoad = () => {
  useProjectStore().solver.loadCases[0].solved = false;
  useProjectStore().solver.loadCases[0].createBeamElementUniformEdgeLoad(
    loadElementId.value,
    [realFx.value, realFz.value],
    true
  );

  useProjectStore().solve();
  projectStore.clearSelection();
  closeModal();
};
</script>
