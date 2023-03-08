/* eslint-disable */
/* tslint:disable */
/**
 * This is an autogenerated file created by the Stencil compiler.
 * It contains typing information for all components that exist in this project.
 */
import { HTMLStencilElement, JSXBase } from "@stencil/core/internal";
import { ClientType } from "./components/pc/pc-account-delete/pc-account-delete";
export { ClientType } from "./components/pc/pc-account-delete/pc-account-delete";
export namespace Components {
    interface MobileAccountDelete {
    }
    interface MobileModal {
    }
    interface PcAccountDelete {
        /**
          * 确认验证码
         */
        "ConfirmEmailVerificationCodeRequest": () => Promise<boolean>;
        /**
          * 终端类型
         */
        "clientType": ClientType;
        /**
          * 提交问卷
         */
        "commitQuestionnaireRequest": () => Promise<boolean>;
        /**
          * 提交注销请求
         */
        "deleteRequest": () => Promise<boolean>;
        /**
          * 注销失败回调
         */
        "onDeleteFail": () => void;
        /**
          * 注销成功回调
         */
        "onDeleteSuccess": () => void;
        /**
          * 退出注销流程回调
         */
        "onExitDelete": () => void;
        /**
          * 查询业务状态
         */
        "queryBusinessStatusRequest": () => Promise<boolean>;
        /**
          * 查询隐私条款
         */
        "queryPrivacyClauseRequest": () => Promise<String>;
        /**
          * 查询注册邮箱
         */
        "queryRegisterEmailRequest": () => Promise<boolean>;
        /**
          * 请求问卷
         */
        "questionnaireRequest": () => Promise<Record<string, any>>;
        /**
          * 发送验证码
         */
        "sendEmailVerificationCodeRequest": () => Promise<boolean>;
    }
    interface PcModal {
    }
}
declare global {
    interface HTMLMobileAccountDeleteElement extends Components.MobileAccountDelete, HTMLStencilElement {
    }
    var HTMLMobileAccountDeleteElement: {
        prototype: HTMLMobileAccountDeleteElement;
        new (): HTMLMobileAccountDeleteElement;
    };
    interface HTMLMobileModalElement extends Components.MobileModal, HTMLStencilElement {
    }
    var HTMLMobileModalElement: {
        prototype: HTMLMobileModalElement;
        new (): HTMLMobileModalElement;
    };
    interface HTMLPcAccountDeleteElement extends Components.PcAccountDelete, HTMLStencilElement {
    }
    var HTMLPcAccountDeleteElement: {
        prototype: HTMLPcAccountDeleteElement;
        new (): HTMLPcAccountDeleteElement;
    };
    interface HTMLPcModalElement extends Components.PcModal, HTMLStencilElement {
    }
    var HTMLPcModalElement: {
        prototype: HTMLPcModalElement;
        new (): HTMLPcModalElement;
    };
    interface HTMLElementTagNameMap {
        "mobile-account-delete": HTMLMobileAccountDeleteElement;
        "mobile-modal": HTMLMobileModalElement;
        "pc-account-delete": HTMLPcAccountDeleteElement;
        "pc-modal": HTMLPcModalElement;
    }
}
declare namespace LocalJSX {
    interface MobileAccountDelete {
    }
    interface MobileModal {
    }
    interface PcAccountDelete {
        /**
          * 确认验证码
         */
        "ConfirmEmailVerificationCodeRequest": () => Promise<boolean>;
        /**
          * 终端类型
         */
        "clientType"?: ClientType;
        /**
          * 提交问卷
         */
        "commitQuestionnaireRequest": () => Promise<boolean>;
        /**
          * 提交注销请求
         */
        "deleteRequest": () => Promise<boolean>;
        /**
          * 注销失败回调
         */
        "onDeleteFail": () => void;
        /**
          * 注销成功回调
         */
        "onDeleteSuccess": () => void;
        /**
          * 退出注销流程回调
         */
        "onExitDelete": () => void;
        /**
          * 查询业务状态
         */
        "queryBusinessStatusRequest": () => Promise<boolean>;
        /**
          * 查询隐私条款
         */
        "queryPrivacyClauseRequest": () => Promise<String>;
        /**
          * 查询注册邮箱
         */
        "queryRegisterEmailRequest": () => Promise<boolean>;
        /**
          * 请求问卷
         */
        "questionnaireRequest": () => Promise<Record<string, any>>;
        /**
          * 发送验证码
         */
        "sendEmailVerificationCodeRequest": () => Promise<boolean>;
    }
    interface PcModal {
    }
    interface IntrinsicElements {
        "mobile-account-delete": MobileAccountDelete;
        "mobile-modal": MobileModal;
        "pc-account-delete": PcAccountDelete;
        "pc-modal": PcModal;
    }
}
export { LocalJSX as JSX };
declare module "@stencil/core" {
    export namespace JSX {
        interface IntrinsicElements {
            "mobile-account-delete": LocalJSX.MobileAccountDelete & JSXBase.HTMLAttributes<HTMLMobileAccountDeleteElement>;
            "mobile-modal": LocalJSX.MobileModal & JSXBase.HTMLAttributes<HTMLMobileModalElement>;
            "pc-account-delete": LocalJSX.PcAccountDelete & JSXBase.HTMLAttributes<HTMLPcAccountDeleteElement>;
            "pc-modal": LocalJSX.PcModal & JSXBase.HTMLAttributes<HTMLPcModalElement>;
        }
    }
}
