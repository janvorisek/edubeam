<template>
  <div style="max-width: 560px">
    <div>
      <h3 class="mb-2">{{ $t('settings.mouse.mouse') }}</h3>

      <v-select
        v-model="appStore.panButton"
        item-title="name"
        item-value="code"
        hide-details="auto"
        :items="[
          { name: $t('settings.mouse.all'), code: -1 },
          { name: $t('settings.mouse.wheel'), code: 4 },
          { name: $t('settings.mouse.right_button'), code: 2 },
        ]"
        :label="$t('settings.mouse.pan_button')"
      >
      </v-select>
    </div>

    <!-- Every key the drawing answers, as it answers them: on a Mac with ⌘ where elsewhere Ctrl -->
    <h3 class="mt-8 mb-2">{{ $t('shortcuts.title') }}</h3>
    <section v-for="group in groups" :key="group.title" class="mb-4">
      <h4 class="text-body-2 text-medium-emphasis mb-1">{{ group.title }}</h4>
      <table class="shortcuts">
        <tbody>
          <tr v-for="row in group.rows" :key="row.action">
            <td class="shortcuts__keys">
              <template v-for="(combo, i) in row.keys" :key="i">
                <span v-if="i > 0" class="shortcuts__or">/</span>
                <kbd v-for="key in combo" :key="key">{{ key }}</kbd>
              </template>
            </td>
            <td>{{ row.action }}</td>
          </tr>
        </tbody>
      </table>
    </section>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { useAppStore } from '@/store/app';
import { isApplePlatform } from '@/utils/keyboard';

const appStore = useAppStore();
const { t } = useI18n();

const MOD = isApplePlatform() ? '⌘' : 'Ctrl';
const SHIFT = isApplePlatform() ? '⇧' : 'Shift';
const ALT = isApplePlatform() ? '⌥' : 'Alt';

/** A row: each combination its keys pressed together, more than one combination for the same action */
type Row = { readonly keys: readonly (readonly string[])[]; readonly action: string };

const groups = computed((): readonly { readonly title: string; readonly rows: readonly Row[] }[] => [
  {
    title: t('viewer.tools'),
    rows: [
      { keys: [['V']], action: t('viewer.select') },
      { keys: [['N']], action: t('nodes.addNode') },
      { keys: [['E']], action: t('elements.addElement') },
      { keys: [['U']], action: t('sideSettings.supports') },
      { keys: [['L']], action: t('sideSettings.loads') },
      { keys: [['D']], action: t('dimensioning.add_dimension') },
      { keys: [['Esc']], action: t('shortcuts.cancel') },
      { keys: [[ALT]], action: t('shortcuts.placeFreely') },
    ],
  },
  {
    title: t('shortcuts.drawing'),
    rows: [
      { keys: [['F']], action: t('viewer.fitContent') },
      { keys: [['C']], action: t('viewer.centerContent') },
      { keys: [['G']], action: t('shortcuts.grid') },
      { keys: [['S']], action: t('shortcuts.snap') },
      {
        keys: [
          [MOD, '+'],
          [MOD, '−'],
        ],
        action: t('shortcuts.zoom'),
      },
    ],
  },
  {
    title: t('shortcuts.editing'),
    rows: [
      { keys: [[MOD, 'Z']], action: t('common.undo') },
      { keys: [[MOD, SHIFT, 'Z']], action: t('common.redo') },
      { keys: [[MOD, 'A']], action: t('shortcuts.selectAll') },
      { keys: [[MOD, 'C']], action: t('common.copy') },
      { keys: [[MOD, 'V']], action: t('common.paste') },
      { keys: [['Delete']], action: t('common.delete') },
      { keys: [[MOD, 'S']], action: t('shortcuts.save') },
      { keys: [[MOD, 'P']], action: t('shortcuts.exportImage') },
    ],
  },
]);
</script>

<style scoped lang="scss">
.shortcuts {
  border-collapse: collapse;
  width: 100%;

  td {
    padding: 3px 0;
    vertical-align: middle;
  }
}

.shortcuts__keys {
  width: 9.5em;
  white-space: nowrap;
}

.shortcuts__or {
  margin: 0 4px;
  color: rgba(var(--v-theme-on-surface), 0.5);
}

kbd {
  display: inline-block;
  min-width: 1.6em;
  margin-right: 3px;
  padding: 1px 6px;
  border: 1px solid rgba(var(--v-border-color), 0.25);
  border-bottom-width: 2px;
  border-radius: 4px;
  background: rgba(var(--v-theme-on-surface), 0.04);
  font-family: inherit;
  font-size: 0.85em;
  text-align: center;
}
</style>
