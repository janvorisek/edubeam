<template>
  <v-dialog v-model="open" max-width="420">
    <v-card>
      <v-card-title class="text-h5"> {{ $t("dialogs.addElementLoad.addNewElementLoad") }} </v-card-title>

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
                  autofocus
                />
              </v-col>

              <v-col cols="12" md="6">
                <v-text-field
                  :model-value="appStore.convertForce(loadElementValueFx)"
                  @keydown="checkNumber($event)"
                  @input="
                    loadElementValueFx = appStore.convertInverseForce(
                      $event.target.value !== '' ? parseFloat($event.target.value) : 0
                    )
                  "
                  label="Fx"
                  required
                ></v-text-field>
              </v-col>

              <v-col cols="12" md="6">
                <v-text-field
                  :model-value="appStore.convertForce(loadElementValueFz)"
                  @keydown="checkNumber($event)"
                  @input="
                    loadElementValueFz = appStore.convertInverseForce(
                      $event.target.value !== '' ? parseFloat($event.target.value) : 0
                    )
                  "
                  label="Fz"
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
        <v-btn color="red darken-1" @click="useAppStore().dialogs.addElementLoad = false">{{
          $t("dialogs.common.cancel")
        }}</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useProjectStore } from "../../store/project";
import { useAppStore } from "../../store/app";
import { closeModal } from "jenesius-vue-modal";
import { checkNumber } from "@/utils";

const projectStore = useProjectStore();
const appStore = useAppStore();

const props = defineProps<{
  label: string | number;
}>();

const open = ref(true);
const loadElementId = ref(props.label ?? [...useProjectStore().solver.domain.elements.values()][0].label);
const loadElementValueFx = ref(0.0);
const loadElementValueFz = ref(0.0);

const addElementLoad = () => {
  useProjectStore().solver.loadCases[0].createBeamElementUniformEdgeLoad(
    loadElementId.value,
    [loadElementValueFx.value, loadElementValueFz.value],
    true
  );

  useProjectStore().solve();
  projectStore.clearSelection();
  closeModal();
};
</script>
