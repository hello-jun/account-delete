import { newSpecPage } from '@stencil/core/testing';
import { MobileAccountDelete } from '../mobile-account-delete';

describe('mobile-account-delete', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [MobileAccountDelete],
      html: `<mobile-account-delete></mobile-account-delete>`,
    });
    expect(page.root).toEqualHtml(`
      <mobile-account-delete>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </mobile-account-delete>
    `);
  });
});
