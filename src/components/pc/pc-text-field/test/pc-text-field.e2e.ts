import { newE2EPage } from '@stencil/core/testing';

describe('pc-text-field', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<pc-text-field></pc-text-field>');

    const element = await page.find('pc-text-field');
    expect(element).toHaveClass('hydrated');
  });
});
