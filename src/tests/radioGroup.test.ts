import { describe, it, expect } from 'vitest';
import { onRadioKeydown, radioTabIndex } from '@/utils/radioGroup';

const values = ['si', 'us'] as const;

/** A group of two cards in the document, and a key pressed on the one at `index`. */
const press = (key: string, index: number) => {
  const group = document.createElement('div');
  const cards = values.map(() => {
    const card = document.createElement('div');
    card.tabIndex = 0;
    group.append(card);
    return card;
  });
  document.body.append(group);

  const chosen: string[] = [];
  cards[index].addEventListener('keydown', (event) =>
    onRadioKeydown(event, values, values[index], (value) => chosen.push(value))
  );
  const event = new KeyboardEvent('keydown', { key, cancelable: true });
  cards[index].dispatchEvent(event);
  // Read before the cards leave the document, which takes the focus with them
  const focused = cards.findIndex((card) => card === document.activeElement);
  group.remove();

  return { chosen, prevented: event.defaultPrevented, focused };
};

describe('cards acting as radio buttons', () => {
  it('chooses the focused card with Enter or Space, and keeps Space from scrolling', () => {
    expect(press('Enter', 1)).toMatchObject({ chosen: ['us'], prevented: true });
    expect(press(' ', 0)).toMatchObject({ chosen: ['si'], prevented: true });
  });

  it('moves the choice and the focus with the arrow keys, round the ends', () => {
    expect(press('ArrowRight', 0)).toMatchObject({ chosen: ['us'], focused: 1 });
    expect(press('ArrowRight', 1).chosen).toEqual(['si']);
    expect(press('ArrowUp', 1).chosen).toEqual(['si']);
  });

  it('leaves other keys to the page', () => {
    expect(press('Tab', 0)).toMatchObject({ chosen: [], prevented: false });
  });

  it('is one tab stop: the chosen card, or the first when none is', () => {
    expect(values.map((v) => radioTabIndex(values, v, 'us'))).toEqual([-1, 0]);
    expect(values.map((v) => radioTabIndex(values, v, null))).toEqual([0, -1]);
  });
});
