import { newSpecPage } from '@stencil/core/testing';
import { PcModal } from '../pc-modal';

describe('pc-modal', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [PcModal],
      html: `<pc-modal></pc-modal>`,
    });
    expect(page.root).toEqualHtml(`
      <pc-modal>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </pc-modal>
    `);
  });
});
