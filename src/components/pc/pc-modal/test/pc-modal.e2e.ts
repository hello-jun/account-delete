import { newE2EPage } from '@stencil/core/testing';

describe('pc-modal', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<pc-modal></pc-modal>');

    const element = await page.find('pc-modal');
    expect(element).toHaveClass('hydrated');
  });
});
