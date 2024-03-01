<template>
  <v-dialog v-model="open" max-width="420">
    <v-card>
      <v-card-title> {{ $t("dialogs.editElementLoad.editElementLoad") }} </v-card-title>
      <v-card-subtitle>{{ $t("loadType." + loadType) }}</v-card-subtitle>
      <v-card-text>
        <v-form v-model="valid">
          <v-container>
            <v-row no-gutters>
              <v-col cols="12" md="12">
                <v-select
                  v-model="elementd"
                  :items="projectStore.beams"
                  item-title="label"
                  item-value="label"
                  label="Element id"
                  hide-details="auto"
                  required
                  disabled
                  autofocus
                />
              </v-col>

              <v-col cols="12" md="6">
                <v-text-field
                  v-model="elementNodeValueFx"
                  @keydown="checkNumber($event)"
                  :label="`${unitAndLabel.l}x`"
                  hide-details="auto"
                  :rules="numberRules"
                  :suffix="unitAndLabel.u"
                ></v-text-field>
              </v-col>

              <v-col cols="12" md="6">
                <v-text-field
                  v-model="elementNodeValueFz"
                  @keydown="checkNumber($event)"
                  :label="`${unitAndLabel.l}z`"
                  hide-details="auto"
                  :rules="numberRules"
                  :suffix="unitAndLabel.u"
                ></v-text-field>
              </v-col>

              <v-col cols="12" md="12" v-if="loadType === 'concentrated'">
                <v-text-field
                  v-model="elementLoadPos"
                  @keydown="checkNumber($event)"
                  :label="$t('loads.loadPositionOnBeam')"
                  hide-details="auto"
                  :rules="[...numberRules, minMax]"
                  :suffix="appStore.units.Length"
                />
              </v-col>
            </v-row>
          </v-container>
        </v-form>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="green darken-1" @click="editNodalLoad()" @keydown.enter="editNodalLoad">
          {{ $t("dialogs.editElementLoad.editElementLoad") }}
        </v-btn>
        <v-btn color="red darken-1" @click="closeModal()" @keydown.enter="closeModal">{{
          $t("dialogs.common.cancel")
        }}</v-btn>
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
import { checkNumber, numberRules, parseFloat2 } from "@/utils";
import { BeamConcentratedLoad } from "ts-fem";

const projectStore = useProjectStore();
const appStore = useAppStore();

const props = defineProps<{
  index: number;
}>();

const open = ref(true);
const valid = ref(false);

const loadType = computed(() => (load.value instanceof BeamConcentratedLoad ? "concentrated" : "udl"));
const unitAndLabel = computed(() => {
  let u = appStore.units.Force;
  let l = "F";

  if (loadType.value === "udl") {
    u += "/m";
    l = "f";
  }

  return { l, u };
});

const elementNodeValueFx = ref("0.0");
const elementNodeValueFz = ref("0.0");
const elementLoadPos = ref("0.0");

const minMax = (v) => {
  const geo = target.value.computeGeo();
  if (v < 0 || v > geo.l) {
    return "Enter value between 0 and " + geo.l;
  }
  return true;
};

const realFx = computed(() => appStore.convertInverseForce(parseFloat2(elementNodeValueFx.value)));
const realFz = computed(() => appStore.convertInverseForce(parseFloat2(elementNodeValueFz.value)));
const realDist = computed(() => appStore.convertInverseLength(parseFloat2(elementLoadPos.value)));

onMounted(() => {
  elementNodeValueFx.value = appStore.convertForce(load.value.values[0]).toString();
  elementNodeValueFz.value = appStore.convertForce(load.value.values[1]).toString();

  if (loadType.value === "concentrated") elementLoadPos.value = appStore.convertLength(load.value.values[3]).toString();

  //elementNodeValueMy.value = load.values[DofID.Ry];
});

const editNodalLoad = () => {
  if (valid.value === false) return;

  load.value.values[0] = realFx.value;
  load.value.values[1] = realFz.value;

  if (loadType.value === "concentrated") load.value.values[3] = realDist.value;

  //load.values[DofID.Ry] = loadNodeValueMy.value;

  useProjectStore().solve();
  projectStore.clearSelection();
  closeModal();
};

const target = computed(() => {
  return useProjectStore().solver.domain.elements.get(load.value.target)!;
});

const elementd = computed(() => {
  return useProjectStore().solver.loadCases[0].elementLoadList[props.index].target;
});

const load = computed(() => {
  return useProjectStore().solver.loadCases[0].elementLoadList[props.index];
});
</script>
