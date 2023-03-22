/*
 * @Author: zhangjun
 * @Date: 2023-03-21 16:17:21
 * @LastEditors: zhangjun
 * @LastEditTime: 2023-03-22 14:17:48
 * @Description:
 * @FilePath: /src/components/pc/pc-questionnaire/pc-questionnaire.tsx
 */
import { Component, Host, h, Listen, Prop, State, Watch } from '@stencil/core';

@Component({
  tag: 'pc-questionnaire',
  styleUrl: './pc-questionnaire.css',
  scoped: true,
})
export class PcQuestionnaire {
  /**
   * 值变化回调函数
   */
  @Prop() onChanged: (v: string) => void;

  /**
   * 是否显示文本区域
   */
  @State() textareaEnabled = false;

  /**
   * 问卷原因
   */
  @State() reason: string;
  /**
   * 问卷原因索引
   */
  @State() reasonIndex: number;
  /**
   * 问卷自定义原因
   */
  @State() textareaValue: string = '';

  @Watch('reason')
  @Watch('textareaValue')
  watchHandler(nv,ov,propName){
    this.onChanged && this.onChanged(nv);
  }

  @Listen('change')
  handlerChange(e) {
    this.reasonIndex = Number((e.target as HTMLInputElement).value);
    if (this.reasonIndex === this.options.length - 1) {
      return null
    } else {
      this.reason = this.options[this.reasonIndex];
    }
  }

  @Listen('input')
  handlerInput(e) {
    if (this.reasonIndex === this.options.length - 1) {
      this.textareaValue = (e.target as HTMLInputElement).value;
    }
  }

  connectedCallback(){
    this.onChanged && this.onChanged(this.options[0]);
  }

  // @Listen('focus')
  // handlerFocus(e){
  //   console.log(e)
  // }

  private options: string[] = [
    'Have another TCL account and delete the unused one',
    'No use for extended periods of time (immigration, military service, etc.)',
    'Dissatisfied with TCL’s service and content',
    'Dissatisfied with the system performance (too many errors, slow response)',
    'Not aware of the function of TCL account',
    'Worry about privacy issues',
    'Others',
  ];

  private generateOptionsJSX = () => {
    return this.options.map((o, index) => {
      return (
        <div class={'radio-item'}>
          <input type="radio" id={`${index}`} name="reason" value={index} checked={!Boolean(index)} />
          <label htmlFor={`${index}`}>{o}</label>
        </div>
      );
    });
  };

  render() {
    return (
      <Host>
        <p>You are deleting your account. After deleting, all the information, services, rights, data and etc will be deleletd. Please confirm still to continue?</p>
        <div class={'options'}>
          <span>Reason for leaving:</span>
          <div>{this.generateOptionsJSX()}</div>
          {this.reasonIndex === this.options.length - 1 ? (
            <div class={'textarea'}>
              <textarea cols={30} rows={4} maxLength={100}></textarea>
              <span>{this.textareaValue.length}/100</span>
            </div>
          ) : null}
        </div>
      </Host>
    );
  }
}
