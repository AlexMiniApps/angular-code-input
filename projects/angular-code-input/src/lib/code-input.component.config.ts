import {InjectionToken} from '@angular/core';

export const CodeInputComponentConfigToken = new InjectionToken<CodeInputComponentConfig>('CodeInputComponentConfig');

export interface CodeInputComponentConfig {
  codeLength?: number;
  inputType?: string;
  inputMode?: string;
  initialFocusField?: number;
  isCharsCode?: boolean;
  isCodeHidden?: boolean;
  isPrevFocusableAfterClearing?: boolean;
  isFocusingOnLastByClickIfFilled?: boolean;
  code?: string | number;
  disabled?: boolean;
  autocapitalize?: string;
}

export const defaultComponentConfig: CodeInputComponentConfig = {
  codeLength: 4,
  inputType: 'tel',
  inputMode: 'numeric',
  initialFocusField: undefined,
  isCharsCode: false,
  isCodeHidden: false,
  isPrevFocusableAfterClearing: true,
  isFocusingOnLastByClickIfFilled: false,
  code: undefined,
  disabled: false,
  autocapitalize: undefined
};
