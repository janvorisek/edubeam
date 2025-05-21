// Utilities
import { defineStore } from 'pinia';
import { reactive, ref, markRaw, type Ref, watch, Raw, Component, computed, nextTick } from 'vue';

import SVGViewer from '../components/SVGViewer.vue';
// import Results from "../components/Results.vue";
import Settings from '../components/settings/Settings.vue';
import { MouseMode } from '@/mouse';
import { setLocale } from '@/plugins/i18n';
import { openModal } from 'jenesius-vue-modal';
import SettingsModal from '../components/dialogs/Settings.vue';
import Qty from 'js-quantities';
import { isMobile, suggestLanguage } from '@/utils';

export const useAppStore = defineStore(
  'app',
  () => {
    const inViewerMode = ref(false);

    const drawerOpen = ref(false);
    const rightDrawerOpen = ref(false);

    const bottomBarOpen = ref(!isMobile());
    const bottomBarHeight = ref(226);

    const locale = ref(suggestLanguage());
    const numberFormatter = ref(
      new Intl.NumberFormat(locale.value, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    );

    const units = reactive({
      Length: 'm',
      Area: 'm2',
      AreaM2: 'm4',
      Mass: 'kg',
      Force: 'kN',
      Moment: computed(() => `${units.Force}${units.Length}`),
      Pressure: 'MPa',
      ThermalExpansion: '1/K',
      Angle: 'rad',
      Temperature: 'C',
      ForceDistance: computed(() => `${units.Force}/${units.Length}`),
    });

    let _convertLength = Qty.swiftConverter('m', units.Length);
    let _convertInverseLength = Qty.swiftConverter(units.Length, 'm');
    let _convertArea = Qty.swiftConverter('m2', units.Area);
    let _convertInverseArea = Qty.swiftConverter(units.Area, 'm2');
    let _convertAreaM2 = Qty.swiftConverter('m4', units.AreaM2);
    let _convertInverseAreaM2 = Qty.swiftConverter(units.AreaM2, 'm4');
    let _convertPressure = Qty.swiftConverter('Pa', units.Pressure);
    let _convertInversePressure = Qty.swiftConverter(units.Pressure, 'Pa');
    let _convertForce = Qty.swiftConverter('N', units.Force);
    let _convertInverseForce = Qty.swiftConverter(units.Force, 'N');
    let _convertTemperature = Qty.swiftConverter('C', units.Temperature);
    let _convertInverseTemperature = Qty.swiftConverter(units.Temperature, 'C');

    watch(
      units,
      (newUnits) => {
        _convertLength = Qty.swiftConverter('m', newUnits.Length);
        _convertInverseLength = Qty.swiftConverter(newUnits.Length, 'm');
        _convertArea = Qty.swiftConverter('m2', newUnits.Area);
        _convertInverseArea = Qty.swiftConverter(newUnits.Area, 'm2');
        _convertAreaM2 = Qty.swiftConverter('m4', newUnits.AreaM2);
        _convertInverseAreaM2 = Qty.swiftConverter(newUnits.AreaM2, 'm4');
        _convertPressure = Qty.swiftConverter('Pa', newUnits.Pressure);
        _convertInversePressure = Qty.swiftConverter(newUnits.Pressure, 'Pa');
        _convertForce = Qty.swiftConverter('N', newUnits.Force);
        _convertInverseForce = Qty.swiftConverter(newUnits.Force, 'N');
        _convertTemperature = Qty.swiftConverter('C', newUnits.Temperature);
        _convertInverseTemperature = Qty.swiftConverter(newUnits.Temperature, 'C');

        if (useAppStore().bottomBarOpen) {
          useAppStore().bottomBarOpen = false;
          nextTick(() => {
            useAppStore().bottomBarOpen = true;
          });
        }
      },
      { immediate: true }
    );

    const convertLength = (value: number) => _convertLength(value);
    const convertInverseLength = (value: number) => _convertInverseLength(value);
    const convertArea = (value: number) => _convertArea(value);
    const convertInverseArea = (value: number) => _convertInverseArea(value);
    const convertAreaM2 = (value: number) => _convertAreaM2(value);
    const convertInverseAreaM2 = (value: number) => _convertInverseAreaM2(value);
    const convertPressure = (value: number) => _convertPressure(value);
    const convertInversePressure = (value: number) => _convertInversePressure(value);
    const convertForce = (value: number) => _convertForce(value);
    const convertInverseForce = (value: number) => _convertInverseForce(value);
    const convertTemperature = (value: number) => _convertTemperature(value);
    const convertInverseTemperature = (value: number) => _convertInverseTemperature(value);

    const onboardingFinished = ref(false);

    watch(locale, (newLocale) => {
      setLocale(newLocale);
      numberFormatter.value = new Intl.NumberFormat(newLocale, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    });

    const dialogs = reactive({
      addNode: false,
      addElement: false,
      addNodalLoad: false,
      addElementLoad: false,
      addMaterial: false,
      addCrossSection: false,
    });

    const zooming = ref(false);

    const tab = ref(null);
    const bottomBarTab = ref(null);

    const mouseMode = ref<MouseMode>(MouseMode.NONE);
    const mouse = ref({ x: 0, y: 0, sx: 0, sy: 0 });

    const tabs: Ref<
      {
        title: string;
        component: Raw<Component>;
        props: { id?: string };
        closable: boolean;
      }[]
    > = ref([
      { title: 'tabView.viewer', component: markRaw(SVGViewer), props: { id: 'viewer' }, closable: false },
      //{ title: "tabView.results", component: markRaw(Results), props: {}, closable: true },
      { title: 'tabView.settings', component: markRaw(Settings), props: { id: 'settings' }, closable: true },
    ]);

    const openedTab = computed(() => tabs.value[tab.value] || null);

    const openSettings = () => {
      openModal(SettingsModal);
      /*const si = tabs.value.findIndex((t) => t.title === "tabView.settings");

      // If settings already open, switch to it
      if (si !== -1) {
        tab.value = si;
        return;
      }

      tabs.value.push({ title: "tabView.settings", component: markRaw(Settings), props: {}, closable: true });
      tab.value = tabs.value.length - 1;*/
    };

    const panButton = ref(4);

    return {
      inViewerMode,

      onboardingFinished,
      drawerOpen,
      rightDrawerOpen,
      bottomBarOpen,
      bottomBarHeight,
      locale,
      numberFormatter,
      units,
      dialogs,
      zooming,
      tab,
      openedTab,
      tabs,
      bottomBarTab,
      mouseMode,
      mouse,
      openSettings,

      panButton,

      // Convert units
      convertLength,
      convertInverseLength,
      convertArea,
      convertInverseArea,
      convertAreaM2,
      convertInverseAreaM2,
      convertPressure,
      convertInversePressure,
      convertForce,
      convertInverseForce,
      convertTemperature,
      convertInverseTemperature,
    };
  },
  {
    persist: {
      storage: localStorage,
      paths: ['panButton', 'onboardingFinished', 'locale', 'tab', 'bottomBarHeight', 'units'],
    },
  }
);
