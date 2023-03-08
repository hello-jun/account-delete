import { newSpecPage } from '@stencil/core/testing';
import { MobileModal } from '../mobile-modal';

describe('mobile-modal', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [MobileModal],
      html: `<mobile-modal></mobile-modal>`,
    });
    expect(page.root).toEqualHtml(`
      <mobile-modal>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </mobile-modal>
    `);
  });
});
