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
import { isMobile, readStoredAppSettings, suggestLanguage } from '@/utils';
import { formatResultAsHTML, formatResultAsText, type ResultNumberStyle } from '@/utils/numberDisplay';
import { fromSI, momentLabel, unitSize, type ForceUnit, type LengthUnit } from '@/utils/unitConversions';
import {
  matchUnitSystem,
  sanitizeUnitChoice,
  suggestBrowserUnitSystem,
  unitSystems,
  type UnitChoice,
  type UnitSystem,
} from '@/utils/unitSystems';
import { angle, axisConvention, axisLetters, vertical } from '@/utils/axisConvention';
import { useProjectStore } from './project';
import { useViewerStore } from './viewer';
import { gridStepAfterUnitChange } from '@/utils/grid';

export type SettingsTab = 'lang' | 'appearance' | 'controls';

const asRecord = (value: unknown): Record<string, unknown> =>
  typeof value === 'object' && value !== null ? (value as Record<string, unknown>) : {};

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
    // Results span orders of magnitude, so their mantissa is written by significant digits and
    // the exponent by the chosen style.
    const numberStyle = ref<ResultNumberStyle>('scientific');
    const resultFormatter = ref(new Intl.NumberFormat(locale.value, { maximumSignificantDigits: 5 }));

    const formatResultHTML = (value: number) => formatResultAsHTML(value, numberStyle.value, resultFormatter.value);
    const formatResultText = (value: number) => formatResultAsText(value, numberStyle.value, resultFormatter.value);

    // A first visit starts in the units of the browser's region. Anyone who has been here before
    // starts from what they saved, so a unit their version did not have yet is derived from the
    // units it did have; the persisted state then restores the rest.
    const stored = readStoredAppSettings();
    const initial: UnitChoice =
      stored === undefined
        ? unitSystems[suggestBrowserUnitSystem()]
        : sanitizeUnitChoice({ ...asRecord(stored?.units), moment: stored?.momentUnits }, unitSystems.si);

    // A moment unit is a pair, so it is stored as one: `units.Moment` is only its label.
    const momentUnits = ref<{ force: ForceUnit; length: LengthUnit }>({ ...initial.moment });

    const units = reactive({
      Length: initial.Length,
      SectionLength: initial.SectionLength,
      Displacement: initial.Displacement,
      Area: initial.Area,
      AreaM2: initial.AreaM2,
      Mass: initial.Mass,
      Force: initial.Force,
      Moment: computed(() => momentLabel(momentUnits.value.force, momentUnits.value.length)),
      Pressure: initial.Pressure,
      ThermalExpansion: initial.ThermalExpansion,
      Angle: 'rad',
      Temperature: initial.Temperature,
      ForceDistance: computed(() => `${units.Force}/${units.Length}`),
      Density: computed(() => `${units.Mass}/${units.Length}3`),
    });

    // TODO: We really don't need to solve anything, but this triggers most of the reactivity we need
    watch(units, () => {
      useProjectStore().solve();
    });

    watch(units, () => {
      if (useAppStore().bottomBarOpen) {
        useAppStore().bottomBarOpen = false;
        nextTick(() => {
          useAppStore().bottomBarOpen = true;
        });
      }
    });

    // The size of one display unit in SI. A value goes to the screen divided by it, and comes back
    // multiplied; compound units are products of their parts.
    const size = computed(() => {
      const length = unitSize.length(units.Length);
      const force = unitSize.force(units.Force);

      return {
        length,
        sectionLength: unitSize.length(units.SectionLength),
        displacement: unitSize.length(units.Displacement),
        area: unitSize.area(units.Area),
        secondMoment: unitSize.secondMoment(units.AreaM2),
        force,
        moment: unitSize.force(momentUnits.value.force) * unitSize.length(momentUnits.value.length),
        forceDistance: force / length,
        pressure: unitSize.pressure(units.Pressure),
        density: unitSize.mass(units.Mass) / length ** 3,
        temperature: unitSize.temperature(units.Temperature),
        thermalExpansion: unitSize.thermalExpansion(units.ThermalExpansion),
      };
    });

    const convertLength = (value: number) => fromSI(value, size.value.length);
    const convertInverseLength = (value: number) => value * size.value.length;
    const convertSectionLength = (value: number) => fromSI(value, size.value.sectionLength);
    const convertInverseSectionLength = (value: number) => value * size.value.sectionLength;
    const convertDisplacement = (value: number) => fromSI(value, size.value.displacement);
    const convertInverseDisplacement = (value: number) => value * size.value.displacement;
    const convertArea = (value: number) => fromSI(value, size.value.area);
    const convertInverseArea = (value: number) => value * size.value.area;
    const convertAreaM2 = (value: number) => fromSI(value, size.value.secondMoment);
    const convertInverseAreaM2 = (value: number) => value * size.value.secondMoment;
    const convertPressure = (value: number) => fromSI(value, size.value.pressure);
    const convertInversePressure = (value: number) => value * size.value.pressure;
    const convertForce = (value: number) => fromSI(value, size.value.force);
    const convertInverseForce = (value: number) => value * size.value.force;
    const convertMoment = (value: number) => fromSI(value, size.value.moment);
    const convertInverseMoment = (value: number) => value * size.value.moment;
    const convertForceDistance = (value: number) => fromSI(value, size.value.forceDistance);
    const convertInverseForceDistance = (value: number) => value * size.value.forceDistance;
    const convertDensity = (value: number) => fromSI(value, size.value.density);
    const convertInverseDensity = (value: number) => value * size.value.density;
    const convertTemperature = (value: number) => fromSI(value, size.value.temperature);
    const convertInverseTemperature = (value: number) => value * size.value.temperature;
    const convertThermalExpansion = (value: number) => fromSI(value, size.value.thermalExpansion);
    const convertInverseThermalExpansion = (value: number) => value * size.value.thermalExpansion;

    const unitChoice = (): UnitChoice => ({
      Length: units.Length,
      SectionLength: units.SectionLength,
      Displacement: units.Displacement,
      Area: units.Area,
      AreaM2: units.AreaM2,
      Mass: units.Mass,
      Force: units.Force,
      Pressure: units.Pressure,
      Temperature: units.Temperature,
      ThermalExpansion: units.ThermalExpansion,
      moment: momentUnits.value,
    });

    const applyUnitChoice = ({ moment, ...rest }: UnitChoice) => {
      Object.assign(units, rest);
      momentUnits.value = { ...moment };
    };

    /**
     * The length unit as a person picks it. The grid snap step is kept in metres, and one still at
     * the default of the old unit family moves to the default of the new.
     */
    const setLengthUnit = (unit: LengthUnit) => {
      const viewerStore = useViewerStore();
      viewerStore.gridStep = gridStepAfterUnitChange(viewerStore.gridStep, units.Length, unit);
      units.Length = unit;
    };

    /** SI or US customary when every unit is that system's, null for a custom mix. */
    const unitSystem = computed<UnitSystem | null>({
      get: () => matchUnitSystem(unitChoice()),
      set: (system) => {
        if (!system) return;

        setLengthUnit(unitSystems[system].Length);
        applyUnitChoice(unitSystems[system]);
      },
    });

    /** Called after local storage is read back, which knows nothing of which units exist. */
    const sanitizeUnits = () => applyUnitChoice(sanitizeUnitChoice(unitChoice(), unitSystems.si));

    // Vertical components and angles pass through `vertical` and `angle` on their way to and
    // from the screen, after unit conversion; `axes` holds the letters to label them with.
    const axes = computed(() => axisLetters(axisConvention.value));

    watch(axisConvention, () => {
      if (useAppStore().bottomBarOpen) {
        useAppStore().bottomBarOpen = false;
        nextTick(() => {
          useAppStore().bottomBarOpen = true;
        });
      }
    });

    const onboardingFinished = ref(false);
    /** The "draw your first beam" task is running; see utils/firstBeam.ts. */
    const firstBeamActive = ref(false);
    const lastSeenChangelogVersion = ref('');

    watch(locale, (newLocale) => {
      setLocale(newLocale);
      numberFormatter.value = new Intl.NumberFormat(newLocale, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
      resultFormatter.value = new Intl.NumberFormat(newLocale, { maximumSignificantDigits: 5 });
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
      /*
       * Not closable: closing it was a one way door, since nothing ever put it back - the gear opens
       * the same panel in a dialog instead, and the code that would have reopened the tab has been
       * commented out below since it was written.
       */
      { title: 'tabView.settings', component: markRaw(Settings), props: { id: 'settings' }, closable: false },
    ]);

    const openedTab = computed(() => tabs.value[tab.value] || null);

    const openSettings = (tab: SettingsTab = 'lang') => {
      openModal(SettingsModal, { tab });
      /*const si = tabs.value.findIndex((t) => t.title === "tabView.settings");

      // If settings already open, switch to it
      if (si !== -1) {
        tab.value = si;
        return;
      }

      tabs.value.push({ title: "tabView.settings", component: markRaw(Settings), props: {}, closable: true });
      tab.value = tabs.value.length - 1;*/
    };

    const panButton = ref(-1);

    // Everything the settings dialog edits except the language, which is a person's choice rather
    // than a preference to fall back from.
    const resetSettings = () => {
      numberStyle.value = 'scientific';
      applyUnitChoice(unitSystems[suggestBrowserUnitSystem()]);
      axisConvention.value = 'z-down';
      panButton.value = -1;
    };

    return {
      inViewerMode,

      onboardingFinished,
      firstBeamActive,
      drawerOpen,
      rightDrawerOpen,
      bottomBarOpen,
      bottomBarHeight,
      locale,
      numberFormatter,
      numberStyle,
      resultFormatter,
      formatResultHTML,
      formatResultText,
      units,
      momentUnits,
      unitSystem,
      setLengthUnit,
      sanitizeUnits,
      dialogs,
      zooming,
      tab,
      openedTab,
      tabs,
      bottomBarTab,
      mouseMode,
      mouse,
      openSettings,
      resetSettings,

      panButton,

      // Convert units
      convertLength,
      convertInverseLength,
      convertSectionLength,
      convertInverseSectionLength,
      convertDisplacement,
      convertInverseDisplacement,
      convertArea,
      convertInverseArea,
      convertAreaM2,
      convertInverseAreaM2,
      convertPressure,
      convertInversePressure,
      convertForce,
      convertInverseForce,
      convertMoment,
      convertInverseMoment,
      convertForceDistance,
      convertInverseForceDistance,
      convertDensity,
      convertInverseDensity,
      convertTemperature,
      convertInverseTemperature,
      convertThermalExpansion,
      convertInverseThermalExpansion,

      axisConvention,
      axes,
      vertical,
      angle,

      lastSeenChangelogVersion,
    };
  },
  {
    persist: {
      pick: [
        'panButton',
        'onboardingFinished',
        'lastSeenChangelogVersion',
        'locale',
        'numberStyle',
        'tab',
        'bottomBarHeight',
        'units.Length',
        'units.SectionLength',
        'units.Displacement',
        'units.Area',
        'units.AreaM2',
        'units.Mass',
        'units.Force',
        'units.Pressure',
        'units.Temperature',
        'units.ThermalExpansion',
        'units.Angle',
        'momentUnits',
        'axisConvention',
      ],
      debug: true,
      afterHydrate: ({ store }) => store.sanitizeUnits(),
    },
  }
);
