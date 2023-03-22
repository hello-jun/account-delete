/*
 * @Author: zhangjun
 * @Date: 2023-03-17 15:08:03
 * @LastEditors: zhangjun
 * @LastEditTime: 2023-03-22 16:33:17
 * @Description: 受控组件
 * @FilePath: /src/components/pc/pc-text-field/pc-text-field.tsx
 */
import { Component, Host, h, Prop } from '@stencil/core';

@Component({
  tag: 'pc-text-field',
  styleUrls: ['pc-text-field.scss'],
  shadow: true,
})
export class PcTextField {
  /**
   * 文本框label
   */
  @Prop() label = '';
  /**
   * 文本框的值
   */
  @Prop() value = '';
  /**
   * 文本框预设文本
   */
  @Prop() placeholder = '';
  /**
   * 最大长度
   */
  @Prop() maxlength: string | number = '';
  /**
   * 是否有后缀元素修饰
   */
  @Prop() suffix = true;
  /**
   * 是否非法输入
   */
  @Prop() invalid = false;
  /**
   * 非法输入消息提示
   */
  @Prop() invalidMsg = '';

  /**
   * 输入发生变化后的回调函数
   */
  @Prop() onChanged: (val: string) => void;

  private handlerInput = (e: InputEvent) => {
    let val = (e.target as HTMLInputElement).value;
    this.onChanged && this.onChanged(val);
  };
  private handlerBlur = (e: FocusEvent) => {
    let val = (e.target as HTMLInputElement).value;
    this.onChanged && this.onChanged(val);
  };

  render() {
    return (
      <Host>
        <div class={`text-field ${this.invalid ? 'text-field-invalid' : ''}`}>
          <input type={'text'} value={this.value} placeholder={'Verification code*'} maxlength={this.maxlength} onInput={this.handlerInput} onBlur={this.handlerBlur} />
          {Boolean(this.suffix) ? (
            <div class={'suffix'}>
              <slot name="suffix"></slot>
            </div>
          ) : null}
        </div>
        <span class={`label ${this.invalid ? 'label-invalid' : ''}`}>{this.label}</span>
        {this.invalid ? <span class={'tip'}>{this.invalidMsg}</span> : null}
      </Host>
    );
  }
}
