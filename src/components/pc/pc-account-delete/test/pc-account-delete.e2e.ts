import { newE2EPage } from '@stencil/core/testing';

describe('pc-account-delete', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<pc-account-delete></pc-account-delete>');

    const element = await page.find('pc-account-delete');
    expect(element).toHaveClass('hydrated');
  });
});
