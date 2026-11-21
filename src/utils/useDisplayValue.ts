import { ref, watch, type Ref } from 'vue';
import { useAppStore } from '@/store/app';
import { parseNumberInput } from '@/utils/numberInput';

/** The quantities a value typed into a tool's banner can be */
type Quantity = 'Force' | 'ForceDistance' | 'Moment';

/**
 * A value typed in the units on show, held as the SI value it means: a change of the units, or of
 * which way the vertical axis points, writes the text again for the same value. A tool keeps its
 * values while it is open, unlike a dialog, which reads them afresh each time - so 10 kN down,
 * typed under z-down, must not become 10 kip, or 10 up, by a change made in the settings meanwhile.
 *
 * `vertical` for a vertical component, written with the display's sign; `shown` is the value the
 * text starts with, in the units on show, so a tool starts at a round number whatever the units.
 */
export const useDisplayValue = (quantity: Quantity, vertical: boolean, shown: number): Ref<string> => {
  const appStore = useAppStore();
  const toDisplay = (si: number) => {
    const value =
      quantity === 'Force'
        ? appStore.convertForce(si)
        : quantity === 'Moment'
          ? appStore.convertMoment(si)
          : appStore.convertForceDistance(si);
    return vertical ? appStore.vertical(value) : value;
  };
  const toSI = (display: number) => {
    // The vertical sign is its own inverse
    const value = vertical ? appStore.vertical(display) : display;
    return quantity === 'Force'
      ? appStore.convertInverseForce(value)
      : quantity === 'Moment'
        ? appStore.convertInverseMoment(value)
        : appStore.convertInverseForceDistance(value);
  };

  const text = ref(`${vertical ? appStore.vertical(shown) : shown}`);
  let si = toSI(shown);

  // What is typed: the SI value it means, while it reads as a number
  watch(text, (typed) => {
    const value = parseNumberInput(typed);
    if (Number.isFinite(value)) si = toSI(value);
  });
  // A change of units or axes: the same value written in the new ones, without round-off noise
  watch(
    () => [appStore.units[quantity], appStore.axes.v],
    () => (text.value = `${Number(toDisplay(si).toPrecision(6))}`)
  );

  return text;
};
