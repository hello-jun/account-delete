/*
 * @Author: zhangjun
 * @Date: 2023-03-08 16:20:29
 * @LastEditors: zhangjun
 * @LastEditTime: 2023-03-21 16:08:01
 * @Description:
 * @FilePath: /src/components/pc/pc-modal/pc-modal.tsx
 */
import { Component, Host, h, Prop, Fragment, getAssetPath, Watch } from '@stencil/core';

export interface ModalButton {
  text: string;
  disabled?: boolean;
  onClick: () => void;
}
/**
 * 'both'|'top'|'bottom';
 * both - 显示上下分割线;
 * top - 显示顶部分割线;
 * bottom - 显示底部分割线;
 */
export type Divider = 'both' | 'top' | 'bottom' | 'none';

const dividerList = ['both', 'top', 'bottom', 'none'];

@Component({
  tag: 'pc-modal',
  styleUrl: 'pc-modal.css',
  assetsDirs: ['../../../assets/images'],
  shadow: true,
})
export class PcModal {
  /**
   * 按钮组
   */
  @Prop() buttonGroup: ModalButton[] = [
    {
      text: 'Exit',
      onClick: () => null,
    },
    {
      text: 'Continue',
      disabled: true,
      onClick: () => null,
    },
  ];
  @Watch('buttonGroup')
  validateButtonGroup(nv: ModalButton[], _ov: ModalButton[]) {
    console.log('#buttonGroup', nv, _ov);
    const limitExceeded = !Boolean(nv) || !Boolean(nv.length) || nv.length > 2;
    if (limitExceeded) {
      throw new Error('buttonGroup is a list ,which length is between 1~2.');
    }
  }

  /**
   * 弹窗标题
   */
  @Prop() modalTitle?: string;

  /**
   * 弹窗分割线
   */
  @Prop() divider?: Divider;
  @Watch('divider')
  validateDivider(newValue: string, _oldValue: string) {
    console.log('#validateDivider', newValue, _oldValue);

    // don't allow `divider` to be the empty string
    const isBlank = typeof newValue !== 'string' || newValue === '';
    if (isBlank) {
      // throw new Error(`divider value should be one of 'both'|'top'|'bottom'|'none'.`);
      return true
    }
    // don't allow `divider` is not 'both'|'top'|'bottom'
    const effective = dividerList.includes(this.divider as string);
    if (!effective) {
      throw new Error(`divider value should be one of 'both'|'top'|'bottom'|'none'.`);
    }
  }

  private async closeHandler(ev: MouseEvent) {
    await customElements.whenDefined('pc-account-delete');
    const PcAccountDelete = document.querySelector('pc-account-delete');
    await PcAccountDelete!.exitHandler();
  }

  private generateButtonGroup = () => {
    return (
      <Fragment>
        {this.buttonGroup.map(btn => {
          return (
            <div
              class={`btn 
            ${this.buttonGroup.length === 1 ? 'only-btn' : ''} 
            ${btn.disabled ? 'disabled-btn' : ''} 
            `}
              onClick={btn.disabled ? undefined : btn.onClick}
            >
              <span>{btn.text}</span>
            </div>
          );
        })}
      </Fragment>
    );
  };

  render() {
    const closeIconSrc = getAssetPath(`../../../assets/images/close@2x.png`);
    return (
      <Host>
        <div class={'icon-close'} onClick={this.closeHandler}>
          <img src={closeIconSrc} alt="close" />
        </div>
        {Boolean(this.modalTitle) ? <div class={'title'}>{this.modalTitle}</div> : null}
        {['both', 'top'].includes(this.divider as string) ? <div class={'divider divider-top'}></div> : null}
        <div
          class={{
            'content': true,
            'with-title': Boolean(this.modalTitle),
            'no-title': !Boolean(this.modalTitle),
          }}
        >
          <slot name="content"></slot>
        </div>
        {['both', 'bottom'].includes(this.divider as string) ? <div class={'divider divider-bottom'}></div> : null}
        {this.buttonGroup.length > 0 ? <div class={'button-group'}>{this.generateButtonGroup()}</div> : null}
      </Host>
    );
  }
}
