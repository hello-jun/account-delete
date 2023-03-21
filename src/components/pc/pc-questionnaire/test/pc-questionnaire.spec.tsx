import { newSpecPage } from '@stencil/core/testing';
import { PcQuestionnaire } from '../pc-questionnaire';

describe('pc-questionnaire', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [PcQuestionnaire],
      html: `<pc-questionnaire></pc-questionnaire>`,
    });
    expect(page.root).toEqualHtml(`
      <pc-questionnaire>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </pc-questionnaire>
    `);
  });
});
