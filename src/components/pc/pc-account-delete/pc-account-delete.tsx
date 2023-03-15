/*
 * @Author: zhangjun
 * @Date: 2023-03-08 16:23:14
 * @LastEditors: zhangjun
 * @LastEditTime: 2023-03-16 01:14:27
 * @Description:
 * @FilePath: /src/components/pc/pc-account-delete/pc-account-delete.tsx
 */
import { Component, Host, h, Prop, State, Method, Element, Fragment, Watch } from '@stencil/core';
import { ModalButton } from '../pc-modal/pc-modal';

export type ClientType = 'pc' | 'mobile';

@Component({
  tag: 'pc-account-delete',
  styleUrl: 'pc-account-delete.css',
  scoped: true, // 使用 scoped 让 light dom 的全局样式穿透进来
})
export class PcAccountDelete {
  @Element() el!: HTMLPcAccountDeleteElement;
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

  /**
   * 账户注销步骤状态:
   *
   * -1 - 注销操作异常
   *
   * 0 - 退出注销,触发退出注销回调;
   *
   * 1 - 弹出开始注销确认弹窗;
   *
   * 2 - 查询注册邮箱是否存在;
   *
   * 3 - 注册邮箱存在;
   *
   * 4 - 注册邮箱不存在;
   *
   * 5 - 先请求隐私条款然后弹出弹窗内容阅读(倒计时强制10s);
   *
   * 6 - 隐私条款阅读完毕;
   *
   * 7 - 请求隐私条款失败;
   *
   * 8 - 查询用户业务状态中;
   *
   * 9 - 二次查询用户业务状态中;
   *
   * 10 - 用户存在在途业务;
   *
   * 11 - 查询用户业务状态超时;
   *
   * 12 - 查询用户业务状态失败;
   *
   * 13 - 请求验证码(倒计时 60s);
   *
   * 14 - 填写验证码(错误5次,弹出图形验证码);
   *
   * 15 - 验证验证码;
   *
   * 16 - 问卷请求与填写;
   *
   * 17 - 提示确认删除;
   *
   * 18 - 提示删除成功
   *
   * 19 - 触发成功回调
   */
  @State() deleteStep = 1; // TODO 确认值范围后,改用 enum

  /**
   * 弹窗内容
   */
  @State() modalContent: any;

  /**
   * 弹窗按钮组
   */
  @State() modalButtonGroup: ModalButton[] = [
    {
      text: 'Exit',
      onClick: () => null,
    },
    {
      text: 'Continue',
      onClick: () => null,
    },
  ];

  /**
   * 定时器
   */
  private timer: string | number | NodeJS.Timeout | undefined;

  /**
   * 显示账号注销组件
   * @returns
   */
  @Method()
  async show() {
    this.el.style.visibility = 'visible';
    return true;
  }

  /**
   * 关闭账号注销组件
   * @returns
   */
  @Method()
  async close() {
    this.el.style.visibility = 'hidden';
    return true;
  }

  @Watch('deleteStep')
  watchStateHandler(newValue: boolean, oldValue: boolean, propName: string) {
    console.log(`The old value of ${propName} is: `, oldValue);
    console.log(`The new value of ${propName} is: `, newValue);
    this.generateModalContent();
  }

  connectedCallback() {
    console.log('connectedCallback');
    this.generateModalContent();
  }
  componentWillLoad() {
    console.log('componentWillLoad');
  }
  componentWillRender() {
    console.log('componentWillRender');
  }
  componentDidRender() {
    console.log('componentDidRender');
  }
  componentShouldUpdate() {
    console.log('componentShouldUpdate');
  }
  componentWillUpdate() {
    console.log('componentWillUpdate');
  }
  componentDidUpdate() {
    console.log('componentDidUpdate');
  }
  disconnectedCallback() {
    console.log('disconnectedCallback');
  }

  /**
   * 退出注销时处理逻辑
   */
  private exitHandler() {
    this.close();
    this.onExitDelete && this.onExitDelete();
  }

  private generateModalButtonGroup() {
    const leftButtonDefault = {
      text: 'Exit',
      onClick: this.exitHandler,
    };
    const rightButtonDefault = {
      text: 'Continue',
      onClick: this.exitHandler,
    };
    switch (this.deleteStep) {
      case 0:
        break;
      case 1:
        this.modalButtonGroup = [
          leftButtonDefault,
          {
            ...rightButtonDefault,
            onClick: () => {
              //检查是否有注册邮箱
              this.deleteStep = 2;
            },
          },
        ];
        break;
      case 2:
      case 3:
      case 4:
        this.modalButtonGroup = [leftButtonDefault];
        break;
      case 5:
        // 倒计时10s 强制阅读
        let timeCount = 10;
        this.timer && clearInterval(this.timer);
        this.timer = setInterval(() => {
          timeCount--;
          if (timeCount <= 0) {
            clearInterval(this.timer);
            this.deleteStep = 6;
          }
          this.modalButtonGroup = [
            leftButtonDefault,
            {
              ...rightButtonDefault,
              text: `Continue (${timeCount})`,
              disabled: true,
              onClick: () => null,
            },
          ];
        }, 1000);
        break;
      case 6:
        this.modalButtonGroup = [
          leftButtonDefault,
          {
            ...rightButtonDefault,
            onClick: () => {
              this.deleteStep = 8;
            },
          },
        ];
        break;
      case 7:
        this.modalButtonGroup = [
          leftButtonDefault,
          {
            ...rightButtonDefault,
            text:'Refresh',
            onClick: () => {
              this.deleteStep = 5;
            },
          },
        ];
        break;
      case 8:
        this.modalContent = (
          <Fragment>
            <p>You are deleting your account. After deleting, all the information, services, rights, data and etc will be deleletd. Please confirm still to continue?</p>
            <p>If select 'Continue', TCL will send verification code to your registered E-mail address.</p>
          </Fragment>
        );
        break;
      case 9:
        this.modalContent = (
          <Fragment>
            <p>You are deleting your account. After deleting, all the information, services, rights, data and etc will be deleletd. Please confirm still to continue?</p>
            <p>If select 'Continue', TCL will send verification code to your registered E-mail address.</p>
          </Fragment>
        );
        break;
      case 10:
        this.modalContent = (
          <Fragment>
            <p>You are deleting your account. After deleting, all the information, services, rights, data and etc will be deleletd. Please confirm still to continue?</p>
            <p>If select 'Continue', TCL will send verification code to your registered E-mail address.</p>
          </Fragment>
        );
        break;
      case 11:
        this.modalContent = (
          <Fragment>
            <p>You are deleting your account. After deleting, all the information, services, rights, data and etc will be deleletd. Please confirm still to continue?</p>
            <p>If select 'Continue', TCL will send verification code to your registered E-mail address.</p>
          </Fragment>
        );
        break;
      default:
        this.modalContent = null;
        break;
    }
  }

  private generateModalContent() {
    switch (this.deleteStep) {
      case 0:
        this.modalContent = null;
        break;
      case 1:
        this.modalContent = (
          <Fragment>
            <p>You are deleting your account. After deleting, all the information, services, rights, data and etc will be deleletd. Please confirm still to continue?</p>
            <p>If select 'Continue', TCL will send verification code to your registered E-mail address.</p>
          </Fragment>
        );
        break;
      case 2:
        this.queryRegisterEmailRequest()
          .then(res => {
            this.deleteStep = res ? 3 : 4;
          })
          .catch(() => {
            this.deleteStep = -1;
          });
        break;
      case 3:
        this.deleteStep = 5;
        break;
      case 4:
        this.modalContent = (
          <Fragment>
            <p>Please complete your E-mail address first.</p>
          </Fragment>
        );
        break;
      case 6:
      case 5:
        this.queryPrivacyClauseRequest()
          .then(res => {
            this.modalContent = (
              <Fragment>
                <pre>{res}</pre>
              </Fragment>
            );
          })
          .catch(() => {
            this.deleteStep = -1;
          });
        break;
      case 7:
        this.modalContent = (
          <Fragment>
            <p>Loading failure, please refresh.</p>
          </Fragment>
        );
        break;
      case 8:
        this.modalContent = (
          <Fragment>
            <p>You are deleting your account. After deleting, all the information, services, rights, data and etc will be deleletd. Please confirm still to continue?</p>
            <p>If select 'Continue', TCL will send verification code to your registered E-mail address.</p>
          </Fragment>
        );
        break;
      case 9:
        this.modalContent = (
          <Fragment>
            <p>You are deleting your account. After deleting, all the information, services, rights, data and etc will be deleletd. Please confirm still to continue?</p>
            <p>If select 'Continue', TCL will send verification code to your registered E-mail address.</p>
          </Fragment>
        );
        break;
      case 10:
        this.modalContent = (
          <Fragment>
            <p>You are deleting your account. After deleting, all the information, services, rights, data and etc will be deleletd. Please confirm still to continue?</p>
            <p>If select 'Continue', TCL will send verification code to your registered E-mail address.</p>
          </Fragment>
        );
        break;
      case 11:
        this.modalContent = (
          <Fragment>
            <p>You are deleting your account. After deleting, all the information, services, rights, data and etc will be deleletd. Please confirm still to continue?</p>
            <p>If select 'Continue', TCL will send verification code to your registered E-mail address.</p>
          </Fragment>
        );
        break;
      default:
        this.modalContent = <p>Unknown Error</p>;
        break;
    }
  }

  render() {
    return (
      <Host>
        <pc-modal modalTitle="Email verification code" divider="both" buttonGroup={this.modalButtonGroup}>
          <div slot="content">
            {/* <p>You are deleting your account. After deleting, all the information, services, rights, data and etc will be deleletd. Please confirm still to continue?</p>
            <p>If select 'Continue', TCL will send verification code to your registered E-mail address.</p> */}
            {this.modalContent}
            {/* <p>
              条款内容条款内容条款内容条款内容条款内容条款内容条款内容条款内容条款内容条款内容条款内容条款内容条款内容条款内容条款内容条款内容条款内容条款内容条款内容条款内容条款内容条款内容条款内容条款内容条款内容条款内容条款内容条款内容条款内容条款内容条款内容条款内容条款内容条款内容条款内容条款内容条款内容条款内容条款内容
            </p> */}
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
