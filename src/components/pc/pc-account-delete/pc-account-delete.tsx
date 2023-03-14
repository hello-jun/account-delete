/*
 * @Author: zhangjun
 * @Date: 2023-03-08 16:23:14
 * @LastEditors: zhangjun
 * @LastEditTime: 2023-03-14 19:39:12
 * @Description:
 * @FilePath: /src/components/pc/pc-account-delete/pc-account-delete.tsx
 */
import { Component, Host, h, Prop } from '@stencil/core';

export type ClientType = 'pc' | 'mobile';

@Component({
  tag: 'pc-account-delete',
  styleUrl: 'pc-account-delete.css',
  scoped: true, // 使用 scoped 让 light dom 的全局样式穿透进来
})
export class PcAccountDelete {
  /**
   * 查询注册邮箱
   */
  @Prop() queryRegisterEmailRequest!: () => Promise<boolean>;
  /**
   * 查询隐私条款
   */
  @Prop() queryPrivacyClauseRequest!: () => Promise<String>;
  /**
   * 查询业务状态
   */
  @Prop() queryBusinessStatusRequest!: () => Promise<boolean>;
  /**
   * 发送验证码
   */
  @Prop() sendEmailVerificationCodeRequest!: () => Promise<boolean>;
  /**
   * 确认验证码
   */
  @Prop() ConfirmEmailVerificationCodeRequest!: () => Promise<boolean>;
  /**
   * 请求问卷
   */
  @Prop() questionnaireRequest!: () => Promise<Record<string, any>>;
  /**
   * 提交问卷
   */
  @Prop() commitQuestionnaireRequest!: () => Promise<boolean>;
  /**
   * 提交注销请求
   */
  @Prop() deleteRequest!: () => Promise<boolean>;

  /**
   * 注销成功回调
   */
  @Prop() onDeleteSuccess!: () => void;
  /**
   * 注销失败回调
   */
  @Prop() onDeleteFail!: () => void;
  /**
   * 退出注销流程回调
   */
  @Prop() onExitDelete!: () => void;

  /**
   * 终端类型
   */
  @Prop() clientType: ClientType = 'pc';

  render() {
    return (
      <Host>
        <pc-modal 
        modalTitle='Email verification code'
        divider='both'
        >
          <div slot="content">
            {/* <p>You are deleting your account. After deleting, all the information, services, rights, data and etc will be deleletd. Please confirm still to continue?</p>
            <p>If select 'Continue', TCL will send verification code to your registered E-mail address.</p> */}
            <p>条款内容条款内容条款内容条款内容条款内容条款内容条款内容条款内容条款内容条款内容条款内容条款内容条款内容条款内容条款内容条款内容条款内容条款内容条款内容条款内容条款内容条款内容条款内容条款内容条款内容条款内容条款内容条款内容条款内容条款内容条款内容条款内容条款内容条款内容条款内容条款内容条款内容条款内容条款内容</p>
            {/* <p>条款内容条款内容条款内容条款内容条款内容条款内容条款内容条款内容条款内容条款内容条款内容条款内容条款内容条款内容条款内容条款内容条款内容条款内容条款内容条款内容条款内容条款内容条款内容条款内容条款内容条款内容条款内容条款内容条款内容条款内容条款内容条款内容条款内容条款内容条款内容条款内容条款内容条款内容条款内容</p>
            <p>条款内容条款内容条款内容条款内容条款内容条款内容条款内容条款内容条款内容条款内容条款内容条款内容条款内容条款内容条款内容条款内容条款内容条款内容条款内容条款内容条款内容条款内容条款内容条款内容条款内容条款内容条款内容条款内容条款内容条款内容条款内容条款内容条款内容条款内容条款内容条款内容条款内容条款内容条款内容</p>
            <p>条款内容条款内容条款内容条款内容条款内容条款内容条款内容条款内容条款内容条款内容条款内容条款内容条款内容条款内容条款内容条款内容条款内容条款内容条款内容条款内容条款内容条款内容条款内容条款内容条款内容条款内容条款内容条款内容条款内容条款内容条款内容条款内容条款内容条款内容条款内容条款内容条款内容条款内容条款内容</p>
            <p>条款内容条款内容条款内容条款内容条款内容条款内容条款内容条款内容条款内容条款内容条款内容条款内容条款内容条款内容条款内容条款内容条款内容条款内容条款内容条款内容条款内容条款内容条款内容条款内容条款内容条款内容条款内容条款内容条款内容条款内容条款内容条款内容条款内容条款内容条款内容条款内容条款内容条款内容条款内容</p>
            <p>条款内容条款内容条款内容条款内容条款内容条款内容条款内容条款内容条款内容条款内容条款内容条款内容条款内容条款内容条款内容条款内容条款内容条款内容条款内容条款内容条款内容条款内容条款内容条款内容条款内容条款内容条款内容条款内容条款内容条款内容条款内容条款内容条款内容条款内容条款内容条款内容条款内容条款内容条款内容</p>
            <p>条款内容条款内容条款内容条款内容条款内容条款内容条款内容条款内容条款内容条款内容条款内容条款内容条款内容条款内容条款内容条款内容条款内容条款内容条款内容条款内容条款内容条款内容条款内容条款内容条款内容条款内容条款内容条款内容条款内容条款内容条款内容条款内容条款内容条款内容条款内容条款内容条款内容条款内容条款内容</p>
            <p>条款内容条款内容条款内容条款内容条款内容条款内容条款内容条款内容条款内容条款内容条款内容条款内容条款内容条款内容条款内容条款内容条款内容条款内容条款内容条款内容条款内容条款内容条款内容条款内容条款内容条款内容条款内容条款内容条款内容条款内容条款内容条款内容条款内容条款内容条款内容条款内容条款内容条款内容条款内容</p>
            <p>条款内容条款内容条款内容条款内容条款内容条款内容条款内容条款内容条款内容条款内容条款内容条款内容条款内容条款内容条款内容条款内容条款内容条款内容条款内容条款内容条款内容条款内容条款内容条款内容条款内容条款内容条款内容条款内容条款内容条款内容条款内容条款内容条款内容条款内容条款内容条款内容条款内容条款内容条款内容</p>
            <p>条款内容条款内容条款内容条款内容条款内容条款内容条款内容条款内容条款内容条款内容条款内容条款内容条款内容条款内容条款内容条款内容条款内容条款内容条款内容条款内容条款内容条款内容条款内容条款内容条款内容条款内容条款内容条款内容条款内容条款内容条款内容条款内容条款内容条款内容条款内容条款内容条款内容条款内容条款内容</p> */}
          </div>
        </pc-modal>
      </Host>
    );
  }
}
