/*
 * @Author: zhangjun
 * @Date: 2023-03-08 16:20:29
 * @LastEditors: zhangjun
 * @LastEditTime: 2023-03-14 16:50:06
 * @Description:
 * @FilePath: /src/components/pc/pc-modal/pc-modal.tsx
 */
import { Component, Host, h, Prop, Fragment, getAssetPath } from '@stencil/core';

export interface ModalButton {
  text: string;
  onClick: () => void;
}

@Component({
  tag: 'pc-modal',
  styleUrl: 'pc-modal.css',
  assetsDirs:['../../../assets/images'],
  shadow: true,
})
export class PcModal {
  /**
   * 按钮组
   */
  @Prop() buttonGroup: ModalButton[] = [
    {
      text: 'Exit',
      onClick: () => alert('exit'),
    },
    {
      text: 'Continue',
      onClick: () => alert('continue'),
    },
  ];

  private generateButtonGroup = () => {
    return (
      <Fragment>
        {this.buttonGroup.map(btn => {
          return (
            <div class={`btn ${this.buttonGroup.length === 1 ? 'only-btn' : ''}`} onClick={btn.onClick}>
              <span>{btn.text}</span>
            </div>
          );
        })}
      </Fragment>
    );
  };

  render() {
    const closeIconSrc = getAssetPath(`../../../assets/images/close@2x.png`)
    return (
      <Host>
        <div class={'icon-close'}>
          <img src={closeIconSrc} alt="close" />
        </div>
        <div class={'content'}>
          <slot name="content"></slot>
        </div>
        <div class={'button-group'}>{this.generateButtonGroup()}</div>
      </Host>
    );
  }
}
