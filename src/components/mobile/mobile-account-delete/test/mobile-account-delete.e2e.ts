import { newE2EPage } from '@stencil/core/testing';

describe('mobile-account-delete', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<mobile-account-delete></mobile-account-delete>');

    const element = await page.find('mobile-account-delete');
    expect(element).toHaveClass('hydrated');
  });
});
