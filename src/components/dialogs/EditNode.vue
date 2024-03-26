<template>
  <v-dialog v-model="open" max-width="420">
    <v-card>
      <v-card-title> {{ $t("dialogs.editNode.editNode") }} </v-card-title>

      <v-card-text>
        <v-form v-model="valid">
          <v-row>
            <v-col cols="6">
              <v-row no-gutters>
                <v-col cols="12">
                  <v-select
                    v-model="node.label"
                    :items="projectStore.nodes"
                    item-title="label"
                    item-value="label"
                    :label="$t('common.node')"
                    hide-details="auto"
                    disabled
                    :rounded="0"
                  />
                </v-col>
                <v-col cols="12">
                  <v-text-field
                    v-model="newNodeX"
                    @keydown="checkNumber($event)"
                    :label="$t('dialogs.addNode.coordinate_x')"
                    :suffix="appStore.units.Length"
                    hide-details="auto"
                    :rules="numberRules"
                    autofocus
                    required
                    :rounded="0"
                  ></v-text-field>
                </v-col>
                <v-col cols="12">
                  <v-text-field
                    v-model="newNodeZ"
                    @keydown="checkNumber($event)"
                    :label="$t('dialogs.addNode.coordinate_z')"
                    :suffix="appStore.units.Length"
                    hide-details="auto"
                    :rules="numberRules"
                    required
                    :rounded="0"
                  ></v-text-field>
                </v-col>
              </v-row>
            </v-col>
            <v-col cols="6">
              <div class="d-flex justify-center" style="height: 64px">
                <SupportHelper :angle="angleVal" :node="tmpNode" />
              </div>
              <div>
                <div class="text-caption">{{ $t("dofs.bcs") }}</div>
                <v-row no-gutters>
                  <v-col>
                    <v-checkbox
                      density="compact"
                      label="Dx"
                      hide-details="auto"
                      :model-value="tmpNode.bcs.has(0)"
                      @click="toggleSet(tmpNode, 'bcs', 0)"
                    ></v-checkbox>
                  </v-col>
                  <v-col>
                    <v-checkbox
                      density="compact"
                      label="Dz"
                      hide-details="auto"
                      :model-value="tmpNode.bcs.has(2)"
                      @click="toggleSet(tmpNode, 'bcs', 2)"
                    ></v-checkbox>
                  </v-col>
                  <v-col>
                    <v-checkbox
                      density="compact"
                      label="Ry"
                      hide-details="auto"
                      :model-value="tmpNode.bcs.has(4)"
                      @click="toggleSet(tmpNode, 'bcs', 4)"
                    ></v-checkbox>
                  </v-col>
                </v-row>
                <v-row no-gutters>
                  <v-col cols="12">
                    <v-text-field
                      v-model="nodalAngle"
                      @keydown="checkNumber($event)"
                      :label="$t('nodes.lcsAngle')"
                      hide-details="auto"
                      :rules="[...numberRules, minMax]"
                      :suffix="`°`"
                      :rounded="0"
                    ></v-text-field>
                  </v-col>
                </v-row>
              </div>
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="green darken-1" @click="edit" @keydown.enter="edit">
          {{ $t("dialogs.editNode.editNode") }}
        </v-btn>
        <v-btn color="red darken-1" @click="closeModal()" @keydown.enter="closeModal">{{
          $t("dialogs.common.cancel")
        }}</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { onMounted, ref, computed } from "vue";
import { useProjectStore } from "../../store/project";
import { Node } from "ts-fem";
import { closeModal } from "jenesius-vue-modal";
import { useAppStore } from "@/store/app";
import { checkNumber, parseFloat2, setUnsolved, solve, toggleSet } from "@/utils";
import SupportHelper from "../svg/SupportHelper.vue";
import { numberRules } from "../../utils";

const projectStore = useProjectStore();
const appStore = useAppStore();

const props = withDefaults(
  defineProps<{
    label: string;
  }>(),
  {}
);

const open = ref(true);
const valid = ref(false);

const tmpNode = ref(new Node("tmp", undefined, [0, 0, 0]));

const newNodeX = ref("0");
const newNodeZ = ref("0");
const nodalAngle = ref("0");

const angleVal = computed(() => {
  const val = parseFloat(nodalAngle.value);
  return isNaN(val) ? 0 : val;
});

const minMax = (v) => {
  const val = parseFloat(v);
  if (val < -180 || val > 180) {
    return "Enter value between -180 and 180.";
  }
  return true;
};

onMounted(() => {
  nodalAngle.value = node.value.hasLcs() ? angle.value.toString() : "0";
  tmpNode.value = new Node(node.value.label, node.value.domain, node.value.coords, [...node.value.bcs.values()]);

  newNodeX.value = node.value.coords[0].toString();
  newNodeZ.value = node.value.coords[2].toString();
});

const angle = computed(() => {
  if (!node.value.hasLcs()) {
    return 0;
  }

  return 90 - Math.atan2(node.value.lcs[0][0], node.value.lcs[0][2]) * (180 / Math.PI);
});

const node = computed(() => {
  return projectStore.solver.domain.nodes.get(props.label);
});

const edit = () => {
  if (!valid.value) return;

  setUnsolved();

  const ang = parseFloat(nodalAngle.value) * (Math.PI / 180);

  if (isNaN(ang) || Math.abs(ang) < 1e-8) {
    node.value.lcs = undefined;
    solve();
    closeModal();
    return;
  }

  const locx = [Math.cos(ang), 0, Math.sin(ang)];
  const locy = [0, 1, 0];

  node.value.updateLcs({ locx, locy });

  node.value.coords = [parseFloat2(newNodeX.value), 0, parseFloat2(newNodeZ.value)];

  node.value.bcs = new Set(tmpNode.value.bcs);

  solve();
  closeModal();
};
</script>
