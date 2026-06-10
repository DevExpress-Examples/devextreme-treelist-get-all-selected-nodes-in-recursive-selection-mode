import { describe, it, expect } from 'vitest';

import { mount } from '@vue/test-utils';
import Content from '../HomeContent.vue';

describe('Content', () => {
  it('renders properly', () => {
    const wrapper = mount(Content);
    expect(wrapper.find('.dx-treelist').exists()).toBe(true);
    expect(wrapper.text()).toContain('Get all selected keys');
  });
});
