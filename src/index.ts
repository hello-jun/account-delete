
/*
 * @Author: zhangjun
 * @Date: 2023-03-08 11:46:16
 * @LastEditors: zhangjun
 * @LastEditTime: 2023-03-08 23:25:32
 * @Description:
 * @FilePath: /src/index.ts
 */
export * from './components';

export type ClientType = 'pc' | 'mobile';

/**
 * 8个后端请求行为
 * 注销成功回调
 * 注销失败回调
 * 退出注销流程回调
 * 终端类型 pc-电脑浏览器 mobile-移动端
 */
export interface DeleteAccountOption {
  /**
   * 查询注册邮箱
   */
  queryRegisterEmailRequest: () => Promise<boolean>;
  /**
   * 查询隐私条款
   */
  queryPrivacyClauseRequest: () => Promise<String>;
  /**
   * 查询业务状态
   */
  queryBusinessStatusRequest: () => Promise<boolean>;
  /**
   * 发送验证码
   */
  sendEmailVerificationCodeRequest: () => Promise<boolean>;
  /**
   * 确认验证码
   */
  ConfirmEmailVerificationCodeRequest: () => Promise<boolean>;
  /**
   * 请求问卷
   */
  questionnaireRequest: () => Promise<Record<string, any>>;
  /**
   * 提交问卷
   */
  commitQuestionnaireRequest: () => Promise<boolean>;
  /**
   * 提交注销请求
   */
  deleteRequest: () => Promise<boolean>;

  /**
   * 注销成功回调
   */
  onDeleteSuccess: () => void;
  /**
   * 注销失败回调
   */
  onDeleteFail: () => void;
  /**
   * 退出注销流程回调
   */
  onExitDelete: () => void;

  /**
   * 终端类型
   */
  clientType: ClientType;
}

export interface AccountDelete {
  show: () => void;
  close: () => void;
}

/**
 * 初始化账号注销组件
 * -注入参数
 * -将注销组件插入到DOM中
 * @param options
 */
export function deleteAccountInit(options: DeleteAccountOption): Element|null {
    const {
        queryRegisterEmailRequest,
        queryPrivacyClauseRequest,
        queryBusinessStatusRequest,
        sendEmailVerificationCodeRequest,
        ConfirmEmailVerificationCodeRequest,
        questionnaireRequest,
        commitQuestionnaireRequest,
        onDeleteSuccess,
        onDeleteFail,
        onExitDelete,
        clientType
    } = options
    const tagName = `${clientType}-account-delete`
    const deleteAccountExist = document.querySelector(tagName)
    if (deleteAccountExist) {
        console.error(`The ${tagName} is exist! Do not init it again,please!`)
        return deleteAccountExist
    }
    const deleteAccount = document.createElement(tagName)
    Object.assign(deleteAccount,options)
    document.body.appendChild(deleteAccount)
    return deleteAccount
}
console.log(1111);
(window as any).deleteAccountInit = deleteAccountInit
