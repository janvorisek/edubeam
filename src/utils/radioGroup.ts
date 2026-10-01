const ARROW_STEPS: Readonly<Partial<Record<string, number>>> = {
  ArrowRight: 1,
  ArrowDown: 1,
  ArrowLeft: -1,
  ArrowUp: -1,
};

/**
 * Keyboard handling for a row of cards acting as radio buttons, as the WAI-ARIA radio group
 * pattern has it: Enter or Space chooses the focused card, and the arrow keys choose the next or
 * previous one and move focus with it. The cards must be the only children of their group element.
 */
export const onRadioKeydown = <T>(event: KeyboardEvent, values: readonly T[], value: T, select: (value: T) => void) => {
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault();
    select(value);
    return;
  }

  const step = ARROW_STEPS[event.key];
  if (step === undefined) return;

  event.preventDefault();
  const next = (values.indexOf(value) + step + values.length) % values.length;
  select(values[next]);

  const card = event.currentTarget instanceof HTMLElement ? event.currentTarget.parentElement?.children[next] : null;
  if (card instanceof HTMLElement) card.focus();
};

/**
 * One tab stop for the whole group: the chosen card, or the first one when none is chosen, so
 * Tab moves past the group instead of through every card.
 */
export const radioTabIndex = <T>(values: readonly T[], value: T, current: T | null | undefined) => {
  const chosen = current !== null && current !== undefined && values.includes(current);
  return value === (chosen ? current : values[0]) ? 0 : -1;
};
