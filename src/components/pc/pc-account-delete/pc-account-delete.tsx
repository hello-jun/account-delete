/*
 * @Author: zhangjun
 * @Date: 2023-03-08 16:23:14
 * @LastEditors: zhangjun
 * @LastEditTime: 2023-03-21 20:40:22
 * @Description:
 * @FilePath: /src/components/pc/pc-account-delete/pc-account-delete.tsx
 */
import { Component, Host, h, Prop, State, Method, Element, Fragment, Watch } from '@stencil/core';
import { ModalButton, Divider } from '../pc-modal/pc-modal';
import '../../../utils/yidun-captcha';

export type ClientType = 'pc' | 'mobile';

export interface NECaptchaOption {
  captchaId: string;
  mode: string;
  enableClose: boolean;
  width: string;
}

export interface VerifyCodeError {
  error: boolean;
  msg: string;
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
  styleUrls: ['./pc-account-delete.css', '../../../ui/material-components-web.min.css'],
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
  @Prop() ConfirmEmailVerificationCodeRequest!: (code: string) => Promise<boolean>;
  /**
   * 提交问卷
   */
  @Prop() commitQuestionnaireRequest!: (answer: string) => Promise<boolean>;
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
    mode: 'embed',
    enableClose: false,
    width: '100%',
  };

  /**
   * 是否可见
   */
  @State() visible: boolean = false;

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
  @State() deleteStep = DeleteStep.AboutQuestionnaire;

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
  @State() divider?: Divider | undefined = 'none';

  /**
   * 易盾实例
   */
  @State() captchaIns: any;
  /**
   * 易盾滑块是否验证通过
   */
  @State() captchaVerified: boolean = false;
  /**
   * 验证码
   */
  @State() verifyCode: string;
  /**
   * 验证码是否错误
   */
  @State() verifyCodeError: VerifyCodeError = {
    error: false,
    msg: '',
  };
  /**
   * 是否能请求验证码
   */
  @State() canSendVerifyCode: boolean = true;
  /**
   * 显示验证码发送按钮
   */
  @State() showSendBtn: boolean = true;
  /**
   * 验证码发送倒计时
   */
  @State() sendCountDown: number = 60;
  /**
   * 验证码发送次数
   */
  @State() sendCounter: number = 0;

  /**
   * 问卷内容
   */
  @State() questionnaireContent: string;
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
   * 问卷原因
   */
    private questionnaireReason:string = '';

  /**
   * 显示账号注销组件
   * @returns
   */
  @Method()
  async show() {
    this.visible = true;
    return true;
  }

  /**
   * 关闭账号注销组件
   * @returns
   */
  @Method()
  async close() {
    this.visible = false;
    return true;
  }

  /**
   * 初始化网易易盾滑块验证码
   * @param this
   */
  @Method()
  async initNECaptchaElement(this: any) {
    if (this.captchaIns) {
      return null;
    }
    const _self = this;
    this.captchaIns && this.captchaIns.validate && delete this.captchaIns.validate; // 清除 没有拿到 validate 之前的 captchaIns
    // if(this.captchaIns){
    //   return null
    // }
    // @ts-ignore
    initNECaptchaWithFallback(
      {
        // config对象，参数配置
        captchaId: this.NECaptcha.captchaId,
        element: '#captcha',
        mode: this.NECaptcha.mode,
        enableClose: this.NECaptcha.enableClose,
        lang: this.lng || 'zh-CN',
        width: this.NECaptcha.width,
        onVerify: (err: any, data: any) => {
          // 用户验证码验证成功后，进行实际的提交行为
          // todo
          console.log('页面初始化滑动成功后拿到的了 validate', data, err);
          this.captchaIns = Object.assign(this.captchaIns, data);

          this.captchaVerified = !Boolean(err);

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

  private handlerQuestionnaireChanged=(v)=>{
    console.log(v)
    this.questionnaireReason = v
  }

  @Watch('visible')
  @Watch('deleteStep')
  @Watch('verifyCode')
  @Watch('sendCountDown')
  @Watch('verifyCodeError')
  @Watch('captchaVerified')
  watchStateHandler(newValue: boolean | string, oldValue: boolean | string, propName: string) {
    console.log(`The old value of ${propName} is: `, oldValue);
    console.log(`The new value of ${propName} is: `, newValue);
    if (oldValue !== newValue) {
      this.generateModalContentAndButtonGroup();
    }
  }

  connectedCallback() {
    console.log('connectedCallback');
    this.visible && this.generateModalContentAndButtonGroup();
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
  @Method()
  async exitHandler() {
    this.close();
    this.onExitDelete && this.onExitDelete();
  }

  /**
   * 发送邮件验证码
   */
  private sendVerifyCode = () => {
    if (!this.canSendVerifyCode) {
      return null;
    }
    this.sendEmailVerificationCodeRequest && this.sendEmailVerificationCodeRequest();
    // 倒计时60s 强制阅读
    let timeCount = 60;
    this.timer && clearInterval(this.timer);
    this.timer = setInterval(() => {
      timeCount--;
      if (timeCount < 1) {
        clearInterval(this.timer);
        this.showSendBtn = true;
        this.sendCountDown = 60;
        this.canSendVerifyCode = true;
        return;
      } else {
        this.canSendVerifyCode = false;
        this.showSendBtn = false;
        this.sendCountDown = timeCount;
      }
    }, 1000);
  };

  private handlerChanged = (val: string) => {
    this.verifyCode = val;
    this.verifyCodeError = {
      error: false,
      msg: '',
    };
  };

  private generateModalContentAndButtonGroup() {
    this.modalTitle = null;
    this.divider = 'none';
    const leftButtonDefault = {
      text: 'Exit',
      onClick: this.exitHandler.bind(this),
    };
    const rightButtonDefault = {
      text: 'Continue',
      onClick: this.exitHandler.bind(this),
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
        businessStatusRequest();

        break;
      case DeleteStep.AboutVerifyCode:
        this.initNECaptchaElement();
        this.modalTitle = 'Email verification code';
        this.divider = 'both';
        this.modalButtonGroup = [
          leftButtonDefault,
          {
            ...rightButtonDefault,
            text: 'Verification',
            onClick: () => {
              //1. 检验验证码是否有填入
              if (this.verifyCode === '' || !Boolean(this.verifyCode)) {
                this.verifyCodeError = {
                  error: true,
                  msg: 'Please enter the verification code.',
                };
                return null;
              }
              console.log(this.sendCounter);
              //2. 超过5次验证失败,需要完成滑块图形验证码
              if (this.sendCounter >= 5 && !this.captchaVerified) {
                return null;
              }
              //3. 提交验证码
              //4. 处理提交结果
              this.ConfirmEmailVerificationCodeRequest(this.verifyCode)
                .then(res => {
                  if (res) {
                    this.deleteStep = DeleteStep.AboutQuestionnaire;
                  }
                })
                .catch(e => {
                  if (e instanceof Error) {
                    this.deleteStep = DeleteStep.Exception;
                  } else {
                    this.verifyCodeError = {
                      error: true,
                      msg: e,
                    };
                    this.sendCounter += 1;
                  }
                });
            },
          },
        ];
        this.modalContent = (
          <div class="verify-code">
            <pc-text-field
              label="Verification code*"
              value={this.verifyCode}
              maxlength="6"
              placeholder="Verification code*"
              invalid={this.verifyCodeError.error}
              invalidMsg={this.verifyCodeError.msg}
              onChanged={this.handlerChanged}
            >
              <Fragment>
                <div class="verifyBar pointer" slot="suffix">
                  {this.showSendBtn ? (
                    <div class={`send-verify-code`} onClick={this.sendVerifyCode}>
                      Send
                    </div>
                  ) : (
                    <div class="send-verify-code active">{this.sendCountDown}s</div>
                  )}
                </div>
              </Fragment>
            </pc-text-field>
            <div id="captcha" class={`${this.sendCounter >= 4 ? '' : 'captcha-hidden'}`}></div>
            {this.sendCounter >= 4 && !this.captchaVerified ? <div class={'captcha-tip'}>请滑动拼图到合适位置完成图形验证*{this.captchaVerified}</div> : null}
          </div>
        );
        break;
      case DeleteStep.AboutQuestionnaire:
        // TODO 问卷内容
        this.modalContent=(
          <Fragment>
            <pc-questionnaire
            onChanged={this.handlerQuestionnaireChanged}
            ></pc-questionnaire>
          </Fragment>
        )
        this.modalButtonGroup = [
          leftButtonDefault,
          {
            ...rightButtonDefault,
            onClick: () => {
              // 提交问卷
              this.commitQuestionnaireRequest(this.questionnaireContent)
                .then(res => {
                  // TODO 提交问卷结果
                  this.deleteStep = DeleteStep.Confirm;
                })
                .catch(e => {
                  this.deleteStep = DeleteStep.Exception;
                });
            },
          },
        ];
        break;
      case DeleteStep.Confirm:
        this.modalContent = (
          <Fragment>
            <p>Finally decide to delete account?</p>
          </Fragment>
        );
        this.modalButtonGroup = [
          leftButtonDefault,
          {
            ...rightButtonDefault,
            text: 'Confirm',
            onClick: () => {
              // 提交注销请求
              console.log(this);
              this.deleteRequest()
                .then(res => {
                  if (res) {
                    this.deleteStep = DeleteStep.Success;
                  }
                })
                .catch(e => {
                  this.deleteStep = DeleteStep.Exception;
                });
            },
          },
        ];
        break;
      case DeleteStep.Success:
        this.modalContent = (
          <Fragment>
            <p>Account is deleted successfully, data will be totally eliminated within 48 hours.</p>
          </Fragment>
        );
        this.modalButtonGroup = [
          {
            ...leftButtonDefault,
            onClick: () => {
              this.exitHandler();
              this.onDeleteSuccess && this.onDeleteSuccess();
            },
          },
        ];
        break;
      default:
        this.modalContent = <p>Unknown Error</p>;
        this.modalButtonGroup = [leftButtonDefault];
        break;
    }
  }

  render() {
    console.log(this.visible);
    return this.visible ? (
      <div class={'wrapper'}>
        <pc-modal modalTitle={this.modalTitle} divider={this.divider} buttonGroup={this.modalButtonGroup}>
          <div slot="content">{this.modalContent}</div>
        </pc-modal>
      </div>
    ) : null;
  }
}
