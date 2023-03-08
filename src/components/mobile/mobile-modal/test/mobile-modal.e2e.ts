import { newE2EPage } from '@stencil/core/testing';

describe('mobile-modal', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<mobile-modal></mobile-modal>');

    const element = await page.find('mobile-modal');
    expect(element).toHaveClass('hydrated');
  });
});
