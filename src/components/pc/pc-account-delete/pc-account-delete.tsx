/*
 * @Author: zhangjun
 * @Date: 2023-03-08 16:23:14
 * @LastEditors: zhangjun
 * @LastEditTime: 2023-03-08 23:35:32
 * @Description: 
 * @FilePath: /src/components/pc/pc-account-delete/pc-account-delete.tsx
 */
import { Component, Host, h, Prop } from '@stencil/core';

export type ClientType = 'pc' | 'mobile';


@Component({
  tag: 'pc-account-delete',
  styleUrl: 'pc-account-delete.css',
  shadow: true,
})
export class PcAccountDelete {

  /**
   * 查询注册邮箱
   */
  @Prop() queryRegisterEmailRequest!: () => Promise<boolean>;
  /**
   * 查询隐私条款
   */
  @Prop() queryPrivacyClauseRequest!: () => Promise<String>
  /**
   * 查询业务状态
   */
  @Prop() queryBusinessStatusRequest!: () => Promise<boolean>
  /**
   * 发送验证码
   */
  @Prop() sendEmailVerificationCodeRequest!: () => Promise<boolean>
  /**
   * 确认验证码
   */
  @Prop() ConfirmEmailVerificationCodeRequest!: () => Promise<boolean>
  /**
   * 请求问卷
   */
  @Prop() questionnaireRequest!: () => Promise<Record<string, any>>
  /**
   * 提交问卷
   */
  @Prop() commitQuestionnaireRequest!: () => Promise<boolean>
  /**
   * 提交注销请求
   */
  @Prop() deleteRequest!: () => Promise<boolean>

  /**
   * 注销成功回调
   */
  @Prop() onDeleteSuccess!: () => void
  /**
   * 注销失败回调
   */
  @Prop() onDeleteFail!: () => void
  /**
   * 退出注销流程回调
   */
  @Prop() onExitDelete!: () => void

  /**
   * 终端类型
   */
  @Prop() clientType: ClientType = 'pc';

  render() {
    return (
      <Host>
        <span>I'm a pc-account-delete</span>
        <slot></slot>
      </Host>
    );
  }

}
