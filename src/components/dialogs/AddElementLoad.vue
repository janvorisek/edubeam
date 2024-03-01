<template>
  <v-dialog v-model="open" max-width="420">
    <v-card>
      <v-card-title> {{ $t("dialogs.addElementLoad.addNewElementLoad") }} </v-card-title>

      <v-card-text>
        <v-radio-group v-model="loadType" inline density="compact" class="mx-3">
          <v-radio :label="$t('loadType.udl')" value="udl"></v-radio>
          <v-radio :label="$t('loadType.concentrated')" value="concentrated"></v-radio>
        </v-radio-group>
        <v-form v-model="valid">
          <v-container>
            <v-row no-gutters>
              <v-col cols="12" md="12">
                <v-select
                  v-model="loadElementId"
                  :items="projectStore.beams"
                  item-title="label"
                  item-value="label"
                  :label="$t('common.element')"
                  hide-details="auto"
                  required
                  autofocus
                />
              </v-col>

              <v-col cols="12" md="6">
                <v-text-field
                  v-model="loadNodeValueFx"
                  @keydown="checkNumber($event)"
                  :label="`${unitAndLabel.l}x`"
                  hide-details="auto"
                  :rules="numberRules"
                  :suffix="unitAndLabel.u"
                ></v-text-field>
              </v-col>

              <v-col cols="12" md="6">
                <v-text-field
                  v-model="loadNodeValueFz"
                  @keydown="checkNumber($event)"
                  :label="`${unitAndLabel.l}z`"
                  hide-details="auto"
                  :rules="numberRules"
                  :suffix="unitAndLabel.u"
                ></v-text-field>
              </v-col>

              <v-col class="mt-3" cols="12" md="12" v-if="loadType === 'concentrated'">
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
        <v-btn color="green darken-1" @click="addElementLoad()" @keydown.enter="addElementLoad">
          {{ $t("dialogs.addElementLoad.addElementLoad") }}
        </v-btn>
        <v-btn color="red darken-1" @click="closeModal" @keydown.enter="closeModal">{{
          $t("dialogs.common.cancel")
        }}</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { useProjectStore } from "../../store/project";
import { useAppStore } from "../../store/app";
import { closeModal } from "jenesius-vue-modal";
import { checkNumber, parseFloat2, numberRules } from "@/utils";
import { load } from "webfontloader";

const projectStore = useProjectStore();
const appStore = useAppStore();

const props = defineProps<{
  label?: string | number;
}>();

const open = ref(true);
const valid = ref(false);
const loadType = ref("udl");

const unitAndLabel = computed(() => {
  let u = appStore.units.Force;
  let l = "F";

  if (loadType.value === "udl") {
    u += "/m";
    l = "f";
  }

  return { l, u };
});

const loadElementId = ref(props.label ?? [...useProjectStore().solver.domain.elements.values()][0].label);
const loadNodeValueFx = ref(`${appStore.convertForce(4000)}`);
const loadNodeValueFz = ref(`${appStore.convertForce(3000)}`);
const elementLoadPos = ref("0.0");

const realFx = computed(() => appStore.convertInverseForce(parseFloat2(loadNodeValueFx.value)));
const realFz = computed(() => appStore.convertInverseForce(parseFloat2(loadNodeValueFz.value)));
const realDist = computed(() => appStore.convertInverseLength(parseFloat2(elementLoadPos.value)));

const minMax = (v) => {
  const geo = target.value.computeGeo();
  if (v < 0 || v > geo.l) {
    return "Enter value between 0 and " + geo.l;
  }
  return true;
};

const addElementLoad = () => {
  if (valid.value === false) return;

  useProjectStore().solver.loadCases[0].solved = false;

  if (loadType.value === "udl")
    useProjectStore().solver.loadCases[0].createBeamElementUniformEdgeLoad(
      loadElementId.value,
      [realFx.value, realFz.value],
      false
    );

  if (loadType.value === "concentrated")
    useProjectStore().solver.loadCases[0].createBeamConcentratedLoad(
      loadElementId.value,
      [realFx.value, realFz.value, 0, realDist.value],
      false
    );

  useProjectStore().solve();
  projectStore.clearSelection();
  closeModal();
};

const target = computed(() => {
  return useProjectStore().solver.domain.elements.get(loadElementId.value)!;
});
</script>
