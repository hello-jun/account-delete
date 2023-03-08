import { Component, Host, h } from '@stencil/core';

@Component({
  tag: 'mobile-modal',
  styleUrl: 'mobile-modal.css',
  shadow: true,
})
export class MobileModal {

  render() {
    return (
      <Host>
        <slot></slot>
      </Host>
    );
  }

}
