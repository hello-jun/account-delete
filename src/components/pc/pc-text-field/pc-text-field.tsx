/* eslint-disable @stencil-community/required-jsdoc */
/*
 * @Author: zhangjun
 * @Date: 2023-03-17 15:08:03
 * @LastEditors: zhangjun
 * @LastEditTime: 2023-03-17 18:11:48
 * @Description:
 * @FilePath: /src/components/pc/pc-text-field/pc-text-field.tsx
 */
import { Component, Host, h, Prop, State,Event, Listen,EventEmitter } from '@stencil/core';

@Component({
  tag: 'pc-text-field',
  styleUrl: 'pc-text-field.css',
  shadow: true,
})
export class PcTextField {
  @Prop() nickname = false;
  @Prop() mobile = false;
  @Prop() password = false;
  @Prop() onlyNumber = false;
  @Prop() pattern = '';
  @Prop() value = '';
  @Prop() outlined = false;
  @Prop() placeholder = '';
  @Prop() label = true;
  @Prop() required = false;
  @Prop() disabled = false;
  @Prop() readonly = false;
  @Prop() invalid = false;
  @Prop() maxlength: string | number = '';
  // eslint-disable-next-line @stencil-community/reserved-member-names
  @Prop() prefix = '';
  @Prop() suffix = '';
  @Prop() suffixButton = '';
  @Prop() rightIcon = '';
  @Prop() round = false;
  @Prop() msg = '';
  @Prop() msgCounter = false;
  @Prop() isMsgPersist = false;
  @Prop() isMsgValidate = false;
  @Prop() autocomplete = 'off';

  @State() text = '';
  @State() textField = null;
  @State() inputType = 'text';
  @State() iconClass = 'icon-Linear_hide';
  @State() isInputFocus = 0;

  @Event()  input!: EventEmitter<string>
  @Event()  focus!: EventEmitter<FocusEvent>
  @Event()  blur!: EventEmitter<FocusEvent>

     private handlerInput() {
      if (this.onlyNumber) {
        this.text = this.text.slice(0, Number(this.maxlength));
        this.text = this.text.replace(/[^0-9]/g, "");
      }
      if (!this.nickname) {
        this.text = this.text.replace(/\s+/g, "");
      }
      this.input.emit(this.text);
    }

       private inputFocus(event:FocusEvent) {
      this.isInputFocus = 1;
      this.focus.emit(event);
    }
    private inputBlur(event:FocusEvent) {
      this.isInputFocus = 2;
      this.blur.emit(event);
    }

  render() {
    return (
      <Host>
        <div
          class={{
            'mdc-text-field-container': true,
            [this.mobile + '-input']: this.mobile,
          }}
        >
          <div
            class={{
              'mdc-text-field': true,
              'diy-caveat': this.invalid,
              'mdc-text-field--outlined': this.outlined,
              'mdc-text-field--filled': !this.outlined,
              'mdc-text-field--no-label': !this.label || !this.placeholder,
              'round': this.round,
              'mdc-text-field--disabled': this.disabled,
              'mdc-text-field--invalid ': this.invalid,
              'readonly': this.readonly,
            }}
          >
            {!this.outlined ? (
              <span class="mdc-text-field__ripple"></span>
            ) : (
              <span class="mdc-notched-outline">
                <span class="mdc-notched-outline__leading"></span>
                {Boolean(this.label && this.placeholder) ? (
                  <span class="mdc-notched-outline__notch">
                    <span
                      class={{
                        'mdc-floating-label': true,
                        'mdc-floating-label--float-above': this.invalid,
                        'tcl-floating-label--shake': Boolean(this.invalid && this.isInputFocus === 2 && this.text),
                      }}
                    >
                      {this.placeholder + (this.required ? '*' : '')}
                    </span>
                  </span>
                ) : null}
                <span class="mdc-notched-outline__trailing"></span>
              </span>
            )}
            {Boolean(this.label && this.placeholder) ? <span class="mdc-floating-label">{this.placeholder}</span> : null}
            {Boolean(this.prefix) ? (
              <span v-if="prefix" class="mdc-text-field__affix mdc-text-field__affix--prefix">
                {this.prefix}
              </span>
            ) : null}
                  <input
        class="mdc-text-field__input"
        autocomplete={this.autocomplete}
        type={this.inputType}
        aria-label="Label"
        value={this.text}
        onInput={this.handlerInput}
        onBlur={this.inputBlur}
        onFocus={this.inputFocus}
        placeholder={this.label ? '' : this.placeholder}
        disabled={this.disabled}
        
        readonly={this.readonly}
        maxlength={this.maxlength}
      />
          </div>
        </div>
      </Host>
    );
  }
}
