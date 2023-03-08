/*
 * @Author: zhangjun
 * @Date: 2023-03-08 16:23:14
 * @LastEditors: zhangjun
 * @LastEditTime: 2023-03-08 16:25:40
 * @Description: 
 * @FilePath: /src/components/pc/pc-account-delete/pc-account-delete.tsx
 */
import { Component, Host, h } from '@stencil/core';

@Component({
  tag: 'pc-account-delete',
  styleUrl: 'pc-account-delete.css',
  shadow: true,
})
export class PcAccountDelete {

  render() {
    return (
      <Host>
        <span>I'm a pc-account-delete</span>
        <slot></slot>
      </Host>
    );
  }

}
