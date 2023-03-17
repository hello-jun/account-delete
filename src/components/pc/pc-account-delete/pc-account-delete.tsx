/*
 * @Author: zhangjun
 * @Date: 2023-03-08 16:23:14
 * @LastEditors: zhangjun
 * @LastEditTime: 2023-03-17 17:14:50
 * @Description:
 * @FilePath: /src/components/pc/pc-account-delete/pc-account-delete.tsx
 */
import { Component, Host, h, Prop, State, Method, Element, Fragment, Watch } from '@stencil/core';
import { ModalButton, Divider } from '../pc-modal/pc-modal';
import initNECaptchaWithFallback from '../../../utils/yidun-captcha';

export type ClientType = 'pc' | 'mobile';

export interface NECaptchaOption {
  captchaId: string;
  mode: string;
  enableClose: boolean;
  width: string;
}

enum DeleteStep {
  Exception = -1,
  Exit,
  Start,
  AboutRegisterEmail,
  AboutPrivacyClause,
  AboutBusinessStatus,
  AboutVerifyCode,
  AboutQuestionnaire,
  Confirm,
  Success,
}

console.log('#DeleteStep', DeleteStep);

@Component({
  tag: 'pc-account-delete',
  styleUrls: ['./pc-account-delete.css','../../../ui/material-components-web.min.css'],
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
   * 易盾验证码配置
   */
  @Prop() NECaptcha: NECaptchaOption = {
    captchaId: '3d52897607474bf787201909fb95a880',
    mode: 'float',
    enableClose: false,
    width: '100%',
  };

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
   * 3 - 隐私条款(倒计时强制阅读10s);
   *
   * 4 - 查询用户业务状态. 查询中/存在/无反馈(第一次可刷新或退出,第二次提示查询超时,需电联客服);
   *
   * 5 - 验证码相关 .请求/填写/校验/图形验证码(倒计时 60s);
   *
   * 6 - 问卷请求与填写;
   *
   * 7 - 提示确认删除;
   *
   * 8 - 删除操作状态. 成功;
   */
  @State() deleteStep = DeleteStep.Start;

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
   * 弹窗标题
   */
  @State() modalTitle?: string;
  /**
   * 弹窗分割线
   */
  @State() divider?: Divider | undefined;
  /**
   * 易盾实例
   */
  @State() captchaIns: any;

  /**
   * 定时器
   */
  private timer: string | number | NodeJS.Timeout | undefined;

  /**
   * 查询业务定时器
   */
  private queryBusinessDelayTimer: string | number | NodeJS.Timeout | undefined;

  /**
   * 重新请求了在途业务状态
   */
  private refreshedBusinessStatus = false;

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

  /**
   * 初始化网易易盾滑块验证码
   * @param this
   */
  @Method()
  async initNECaptchaElement(this: any) {
    const _self = this;
    this.captchaIns && this.captchaIns.validate && delete this.captchaIns.validate; // 清除 没有拿到 validate 之前的 captchaIns
    initNECaptchaWithFallback(
      {
        // config对象，参数配置
        captchaId: this.NECaptcha.captchaId,
        element: '#password-captcha',
        mode: this.NECaptcha.mode,
        enableClose: this.NECaptcha.enableClose,
        lang: this.lng || 'zh-CN',
        width: this.NECaptcha.width,
        onVerify: (err: any, data: any) => {
          // 用户验证码验证成功后，进行实际的提交行为
          // todo
          console.log('页面初始化滑动成功后拿到的了 validate', data, err);
          this.captchaIns = Object.assign(this.captchaIns, data);

          // Account.captchaBlur()
        },
        onClose: () => {
          // 弹出关闭结束后将会触发该函数
          // typeof this.onCloseFn === 'function' && onCloseFn()
          // console.log('NECaptcha close')
        },
      },
      function onload(instance: any) {
        console.log('onload===>', instance);
        _self.captchaIns = instance;
        // 初始化成功后得到验证实例instance，可以调用实例的方法
      },
      function onerror(err: any) {
        console.log('err===>', err);
        // 初始化失败后触发该函数，err对象描述当前错误信息
      },
    );
  }

  @Watch('deleteStep')
  watchStateHandler(newValue: boolean, oldValue: boolean, propName: string) {
    console.log(`The old value of ${propName} is: `, oldValue);
    console.log(`The new value of ${propName} is: `, newValue);
    this.generateModalContentAndButtonGroup();
  }

  connectedCallback() {
    console.log('connectedCallback');
    this.generateModalContentAndButtonGroup();
    this.initNECaptchaElement();
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
            text: 'Refresh',
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
      default:
        this.modalContent = null;
        break;
    }
  }

  private generateModalContentAndButtonGroup() {
    const leftButtonDefault = {
      text: 'Exit',
      onClick: this.exitHandler,
    };
    const rightButtonDefault = {
      text: 'Continue',
      onClick: this.exitHandler,
    };
    switch (this.deleteStep) {
      case DeleteStep.Exit:
        this.modalContent = null;
        break;
      case DeleteStep.Start:
        this.modalContent = (
          <Fragment>
            <p>You are deleting your account. After deleting, all the information, services, rights, data and etc will be deleletd. Please confirm still to continue?</p>
            <p>If select 'Continue', TCL will send verification code to your registered E-mail address.</p>
          </Fragment>
        );
        this.modalButtonGroup = [
          leftButtonDefault,
          {
            ...rightButtonDefault,
            onClick: () => {
              //检查是否有注册邮箱
              this.deleteStep = DeleteStep.AboutRegisterEmail;
            },
          },
        ];
        break;
      case DeleteStep.AboutRegisterEmail:
        this.queryRegisterEmailRequest()
          .then(res => {
            if (res) {
              this.deleteStep = DeleteStep.AboutPrivacyClause;
            } else {
              this.modalContent = (
                <Fragment>
                  <p>Please complete your E-mail address first.</p>
                </Fragment>
              );
              this.modalButtonGroup = [leftButtonDefault];
            }
          })
          .catch(() => {
            this.deleteStep = DeleteStep.Exception;
          });
        break;
      case DeleteStep.AboutPrivacyClause:
        const privacyClauseRequest = () => {
          this.queryPrivacyClauseRequest()
            .then(res => {
              if (typeof res !== 'undefined') {
                this.modalContent = (
                  <Fragment>
                    <pre>{res}</pre>
                  </Fragment>
                );
                // 倒计时10s 强制阅读
                let timeCount = 10;
                this.timer && clearInterval(this.timer);
                this.timer = setInterval(() => {
                  timeCount--;
                  if (timeCount < 0) {
                    clearInterval(this.timer);
                    this.modalButtonGroup = [
                      leftButtonDefault,
                      {
                        ...rightButtonDefault,
                        onClick: () => {
                          this.deleteStep = DeleteStep.AboutBusinessStatus;
                        },
                      },
                    ];
                    return;
                  } else {
                    this.modalButtonGroup = [
                      leftButtonDefault,
                      {
                        ...rightButtonDefault,
                        text: `Continue (${timeCount})`,
                        disabled: true,
                        onClick: () => null,
                      },
                    ];
                  }
                }, 1000);
              } else {
                this.modalContent = (
                  <Fragment>
                    <p>Loading failure, please refresh.</p>
                  </Fragment>
                );
                this.modalButtonGroup = [
                  leftButtonDefault,
                  {
                    ...rightButtonDefault,
                    text: 'Refresh',
                    onClick: () => {
                      privacyClauseRequest();
                    },
                  },
                ];
              }
            })
            .catch(() => {
              this.deleteStep = DeleteStep.Exception;
            });
        };

        privacyClauseRequest();

        break;
      case DeleteStep.AboutBusinessStatus:
        // 进来就是查询中
        this.modalContent = (
          <Fragment>
            {/* TODO ...需要动起来 */}
            <p>Under inquiring, please wait…</p>
          </Fragment>
        );
        this.modalButtonGroup = [leftButtonDefault];
        // 查询在途业务状态,超时处理
        const businessStatusRequest = () => {
          Promise.race([
            this.queryBusinessStatusRequest(),
            new Promise((resolve, reject) => {
              this.queryBusinessDelayTimer = setTimeout(() => {
                reject(new Error('request timeout'));
              }, 5000); //TODO 需要确认超时阈值 ,暂定5s
            }),
          ])
            .then(res => {
              if (res as boolean) {
                this.modalContent = (
                  <Fragment>
                    <p>Exist ongoing order/service, please complete first.</p>
                  </Fragment>
                );
                this.modalButtonGroup = [leftButtonDefault];
              } else {
                this.deleteStep = DeleteStep.AboutVerifyCode;
              }
            })
            .catch(e => {
              if (e?.message === 'request timeout') {
                if (this.refreshedBusinessStatus) {
                  this.modalContent = (
                    <Fragment>
                      <p>Inquiring failure, please try again later, or call the service alternatively.</p>
                    </Fragment>
                  );
                  this.modalButtonGroup = [leftButtonDefault];
                } else {
                  this.modalContent = (
                    <Fragment>
                      <p>Inquiring time out, please refresh.</p>
                    </Fragment>
                  );
                  this.modalButtonGroup = [
                    leftButtonDefault,
                    {
                      ...rightButtonDefault,
                      text: 'Refresh',
                      onClick: () => {
                        this.refreshedBusinessStatus = true;
                        businessStatusRequest();
                      },
                    },
                  ];
                }
              } else {
                this.deleteStep = DeleteStep.Exception;
              }
            })
            .finally(() => {
              this.queryBusinessDelayTimer && clearTimeout(this.queryBusinessDelayTimer);
            });
        };

        break;
      case DeleteStep.AboutVerifyCode:
        
        break;
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
      default:
        this.modalContent = <p>Unknown Error</p>;
        break;
    }
  }

  render() {
    return (
      <Host>
        <pc-modal modalTitle={this.modalTitle} divider={this.divider} buttonGroup={this.modalButtonGroup}>
          <div slot="content">{this.modalContent}</div>
        </pc-modal>
      </Host>
    );
  }
}
