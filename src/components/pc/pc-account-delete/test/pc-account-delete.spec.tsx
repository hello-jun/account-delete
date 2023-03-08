import { newSpecPage } from '@stencil/core/testing';
import { PcAccountDelete } from '../pc-account-delete';

describe('pc-account-delete', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [PcAccountDelete],
      html: `<pc-account-delete></pc-account-delete>`,
    });
    expect(page.root).toEqualHtml(`
      <pc-account-delete>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </pc-account-delete>
    `);
  });
});
