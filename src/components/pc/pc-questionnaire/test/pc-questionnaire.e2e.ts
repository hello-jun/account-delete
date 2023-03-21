import { newE2EPage } from '@stencil/core/testing';

describe('pc-questionnaire', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<pc-questionnaire></pc-questionnaire>');

    const element = await page.find('pc-questionnaire');
    expect(element).toHaveClass('hydrated');
  });
});
