import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import EntitySelect from '../components/EntitySelect.vue';

const nodes = Array.from({ length: 50 }, (_, i) => ({ label: String(i + 1) }));

const select = (modelValue: string, exclude?: string) =>
  mount(EntitySelect, { props: { items: nodes, prefix: 'Node', modelValue, exclude } });

describe('EntitySelect', () => {
  it('renders only the option it shows until it is used', () => {
    const wrapper = select('7');

    const options = wrapper.findAll('option');
    expect(options).toHaveLength(1);
    expect(options[0].text()).toBe('Node 7');
    expect(wrapper.find('select').element.value).toBe('7');
  });

  it('builds the whole list on the press that opens it', async () => {
    const wrapper = select('7');

    await wrapper.find('select').trigger('pointerdown');

    expect(wrapper.findAll('option')).toHaveLength(nodes.length);
    // the select still shows what it showed before
    expect(wrapper.find('select').element.value).toBe('7');
  });

  it('builds the list on focus too, for a keyboard', async () => {
    const wrapper = select('7');

    await wrapper.find('select').trigger('focus');

    expect(wrapper.findAll('option')).toHaveLength(nodes.length);
  });

  it('leaves out the excluded label once opened', async () => {
    const wrapper = select('7', '9');

    await wrapper.find('select').trigger('pointerdown');

    const texts = wrapper.findAll('option').map((o) => o.text());
    expect(texts).toHaveLength(nodes.length - 1);
    expect(texts).not.toContain('Node 9');
  });

  it('shows a label that is not in the list at all', () => {
    const wrapper = select('404');

    expect(wrapper.findAll('option').map((o) => o.text())).toEqual(['Node 404']);
  });

  it('answers with the label as the model keeps it, not the string the select gives', async () => {
    const numbered = [{ label: 1 }, { label: 2 }, { label: 3 }];
    const wrapper = mount(EntitySelect, { props: { items: numbered, prefix: 'Node', modelValue: 1 } });

    await wrapper.find('select').trigger('pointerdown');
    await wrapper.find('select').setValue('3');

    expect(wrapper.emitted('update:modelValue')![0]).toEqual([3]);
  });
});
