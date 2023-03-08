import { Component, Host, h } from '@stencil/core';

@Component({
  tag: 'mobile-account-delete',
  styleUrl: 'mobile-account-delete.css',
  shadow: true,
})
export class MobileAccountDelete {

  render() {
    return (
      <Host>
        <slot></slot>
      </Host>
    );
  }

}
