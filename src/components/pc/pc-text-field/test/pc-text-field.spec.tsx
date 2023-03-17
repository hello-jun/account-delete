import { newSpecPage } from '@stencil/core/testing';
import { PcTextField } from '../pc-text-field';

describe('pc-text-field', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [PcTextField],
      html: `<pc-text-field></pc-text-field>`,
    });
    expect(page.root).toEqualHtml(`
      <pc-text-field>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </pc-text-field>
    `);
  });
});
