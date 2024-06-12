import {
  AfterViewChecked,
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Inject,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Optional,
  Output,
  QueryList,
  SimpleChanges,
  ViewChildren
} from '@angular/core';
import {
  CodeInputComponentConfig,
  CodeInputComponentConfigToken,
  defaultComponentConfig
} from './code-input.component.config';
import { Subscription } from 'rxjs';

enum InputState {
  ready = 0,
  reset = 1
}

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'code-input',
  templateUrl: 'code-input.component.html',
  styleUrls: ['./code-input.component.scss']
})
export class CodeInputComponent implements AfterViewInit, OnInit, OnChanges, OnDestroy, AfterViewChecked, CodeInputComponentConfig {

  @ViewChildren('input') inputsList !: QueryList<ElementRef>;

  @Input() codeLength !: number;
  @Input() inputType !: string;
  @Input() inputMode !: string;
  @Input() initialFocusField?: number;
  /** @deprecated Use isCharsCode prop instead. */
  @Input() isNonDigitsCode = false;
  @Input() isCharsCode !: boolean;
  @Input() isCodeHidden !: boolean;
  @Input() isPrevFocusableAfterClearing !: boolean;
  @Input() isFocusingOnLastByClickIfFilled !: boolean;
  @Input() code ?: string | number;
  @Input() disabled !: boolean;
  @Input() autocapitalize ?: string;

  @Output() readonly codeChanged = new EventEmitter<string>();
  @Output() readonly codeCompleted = new EventEmitter<string>();

  public placeholders: number[] = [];

  private inputs: HTMLInputElement[] = [];
  private inputsStates: InputState[] = [];
  private inputsListSubscription !: Subscription;

  // tslint:disable-next-line:variable-name
  private _codeLength !: number;
  private state = {
    isFocusingAfterAppearingCompleted: false,
    isInitialFocusFieldEnabled: false
  };

  constructor(@Optional() @Inject(CodeInputComponentConfigToken) config?: CodeInputComponentConfig) {
    Object.assign(this, defaultComponentConfig);

    if (!config) {
      return;
    }

    // filtering for only valid config props
    for (const prop in config) {
      if (!config.hasOwnProperty(prop)) {
        continue;
      }

      if (!defaultComponentConfig.hasOwnProperty(prop)) {
        continue;
      }

      // @ts-ignore
      this[prop] = config[prop];
    }
  }

  /**
   * Life cycle
   */

  ngOnInit(): void {
    // defining the state
    this.state.isInitialFocusFieldEnabled = !this.isEmpty(this.initialFocusField);
    // initiating the code
    this.onCodeLengthChanges();
  }

  ngAfterViewInit(): void {
    // initiation of the inputs
    this.inputsListSubscription = this.inputsList.changes.subscribe(this.onInputsListChanges.bind(this));
    this.onInputsListChanges(this.inputsList);
  }

  ngAfterViewChecked(): void {
    this.focusOnInputAfterAppearing();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.code) {
      this.onInputCodeChanges();
    }
    if (changes.codeLength) {
      this.onCodeLengthChanges();
    }
  }

  ngOnDestroy(): void {
    if (this.inputsListSubscription) {
      this.inputsListSubscription.unsubscribe();
    }
  }

  /**
   * Methods
   */

  reset(isChangesEmitting = false): void {
    // resetting the code to its initial value or to an empty value
    this.onInputCodeChanges();

    if (this.state.isInitialFocusFieldEnabled) {
      // tslint:disable-next-line:no-non-null-assertion
      this.focusOnField(this.initialFocusField!);
    }

    if (isChangesEmitting) {
      this.emitChanges();
    }
  }

  focusOnField(index: number): void {
    if (index >= this._codeLength) {
      throw new Error('The index of the focusing input box should be less than the codeLength.');
    }

    this.inputs[index].focus();
  }

  onClick(e: any): void {
    // handle click events only if the the prop is enabled
    if (!this.isFocusingOnLastByClickIfFilled) {
      return;
    }

    const target = e.target;
    const last = this.inputs[this._codeLength - 1];
    // already focused
    if (target === last) {
      return;
    }

    // check filling
    const isFilled = this.getCurrentFilledCode().length >= this._codeLength;
    if (!isFilled) {
      return;
    }

    // focusing on the last input if is filled
    setTimeout(() => last.focus());
  }

  onInput(e: any, i: number): void {
    const target = e.target;
    const value = e.data || target.value;

    if (this.isEmpty(value)) {
      return;
    }

    // only digits are allowed if isCharsCode flag is absent/false
    if (!this.canInputValue(value)) {
      e.preventDefault();
      e.stopPropagation();
      this.setInputValue(target, null);
      this.setStateForInput(target, InputState.reset);
      return;
    }

    const values = value.toString().trim().split('');
    for (let j = 0; j < values.length; j++) {
      const index = j + i;
      if (index > this._codeLength - 1) {
        break;
      }

      this.setInputValue(this.inputs[index], values[j]);
    }
    this.emitChanges();

    const next = i + values.length;
    if (next > this._codeLength - 1) {
      target.blur();
      return;
    }

    this.inputs[next].focus();
  }

  onPaste(e: ClipboardEvent, i: number): void {
    e.preventDefault();
    e.stopPropagation();

    const data = e.clipboardData ? e.clipboardData.getData('text').trim() : undefined;

    if (this.isEmpty(data)) {
      return;
    }

    // Convert paste text into iterable
    // tslint:disable-next-line:no-non-null-assertion
    const values = data!.split('');
    let valIndex = 0;

    for (let j = i; j < this.inputs.length; j++) {
      // The values end is reached. Loop exit
      if (valIndex === values.length) {
        break;
      }

      const input = this.inputs[j];
      const val = values[valIndex];

      // Cancel the loop when a value cannot be used
      if (!this.canInputValue(val)) {
        this.setInputValue(input, null);
        this.setStateForInput(input, InputState.reset);
        return;
      }

      this.setInputValue(input, val.toString());
      valIndex++;
    }

    this.inputs[i].blur();
    this.emitChanges();
  }

  async onKeydown(e: any, i: number): Promise<void> {
    const target = e.target;
    const isTargetEmpty = this.isEmpty(target.value);
    const prev = i - 1;

    // processing only the backspace and delete key events
    const isBackspaceKey = await this.isBackspaceKey(e);
    const isDeleteKey = this.isDeleteKey(e);
    if (!isBackspaceKey && !isDeleteKey) {
      return;
    }

    e.preventDefault();

    this.setInputValue(target, null);
    if (!isTargetEmpty) {
      this.emitChanges();
    }

    // preventing to focusing on the previous field if it does not exist or the delete key has been pressed
    if (prev < 0 || isDeleteKey) {
      return;
    }

    if (isTargetEmpty || this.isPrevFocusableAfterClearing) {
      this.inputs[prev].focus();
    }
  }

  private onInputCodeChanges(): void {
    if (!this.inputs.length) {
      return;
    }

    if (this.isEmpty(this.code)) {
      this.inputs.forEach((input: HTMLInputElement) => {
        this.setInputValue(input, null);
      });
      return;
    }

    // tslint:disable-next-line:no-non-null-assertion
    const chars = this.code!.toString().trim().split('');
    // checking if all the values are correct
    let isAllCharsAreAllowed = true;
    for (const char of chars) {
      if (!this.canInputValue(char)) {
        isAllCharsAreAllowed = false;
        break;
      }
    }

    this.inputs.forEach((input: HTMLInputElement, index: number) => {
      const value = isAllCharsAreAllowed ? chars[index] : null;
      this.setInputValue(input, value);
    });
  }

  private onCodeLengthChanges(): void {
    if (!this.codeLength) {
      return;
    }

    this._codeLength = this.codeLength;
    if (this._codeLength > this.placeholders.length) {
      const numbers = Array(this._codeLength - this.placeholders.length).fill(1);
      this.placeholders.splice(this.placeholders.length - 1, 0, ...numbers);
    }
    else if (this._codeLength < this.placeholders.length) {
      this.placeholders.splice(this._codeLength);
    }
  }

  private onInputsListChanges(list: QueryList<ElementRef>): void {
    if (list.length > this.inputs.length) {
      const inputsToAdd = list.filter((item, index) => index > this.inputs.length - 1);
      this.inputs.splice(this.inputs.length, 0, ...inputsToAdd.map(item => item.nativeElement));
      const states = Array(inputsToAdd.length).fill(InputState.ready);
      this.inputsStates.splice(this.inputsStates.length, 0, ...states);
    }
    else if (list.length < this.inputs.length) {
      this.inputs.splice(list.length);
      this.inputsStates.splice(list.length);
    }

    // filling the inputs after changing of their count
    this.onInputCodeChanges();
  }

  private focusOnInputAfterAppearing(): void {
    if (!this.state.isInitialFocusFieldEnabled) {
      return;
    }

    if (this.state.isFocusingAfterAppearingCompleted) {
      return;
    }

    // tslint:disable-next-line:no-non-null-assertion
    this.focusOnField(this.initialFocusField!);
    // tslint:disable-next-line:no-non-null-assertion
    this.state.isFocusingAfterAppearingCompleted = document.activeElement === this.inputs[this.initialFocusField!];
  }

  private emitChanges(): void {
    setTimeout(() => this.emitCode(), 50);
  }

  private emitCode(): void {
    const code = this.getCurrentFilledCode();

    this.codeChanged.emit(code);

    if (code.length >= this._codeLength) {
      this.codeCompleted.emit(code);
    }
  }

  private getCurrentFilledCode(): string {
    let code = '';

    for (const input of this.inputs) {
      if (!this.isEmpty(input.value)) {
        code += input.value;
      }
    }

    return code;
  }

  private isBackspaceKey(e: any): Promise<boolean> {
    const isBackspace = (e.key && e.key.toLowerCase() === 'backspace') || (e.keyCode && e.keyCode === 8);
    if (isBackspace) {
      return Promise.resolve(true);
    }

    // process only key with placeholder keycode on android devices
    if (!e.keyCode || e.keyCode !== 229) {
      return Promise.resolve(false);
    }

    return new Promise<boolean>((resolve) => {
      setTimeout(() => {
        const input = e.target;
        const isReset = this.getStateForInput(input) === InputState.reset;
        if (isReset) {
          this.setStateForInput(input, InputState.ready);
        }
        // if backspace key pressed the caret will have position 0 (for single value field)
        resolve(input.selectionStart === 0 && !isReset);
      });
    });
  }

  private isDeleteKey(e: any): boolean {
    return (e.key && e.key.toLowerCase() === 'delete') || (e.keyCode && e.keyCode === 46);
  }

  private setInputValue(input: HTMLInputElement, value: any): void {
    const isEmpty = this.isEmpty(value);
    const valueClassCSS = 'has-value';
    const emptyClassCSS = 'empty';
    
    input.select();
    
    if (isEmpty) {
      input.value = '';
      input.classList.remove(valueClassCSS);
      // tslint:disable-next-line:no-non-null-assertion
      input.parentElement!.classList.add(emptyClassCSS);
    }
    else {
      input.value = value;
      input.classList.add(valueClassCSS);
      // tslint:disable-next-line:no-non-null-assertion
      input.parentElement!.classList.remove(emptyClassCSS);
    }
  }

  private canInputValue(value: any): boolean {
    if (this.isEmpty(value)) {
      return false;
    }

    const isDigitsValue = /^[0-9]+$/.test(value.toString());
    return isDigitsValue || (this.isCharsCode || this.isNonDigitsCode);
  }

  private setStateForInput(input: HTMLInputElement, state: InputState): void {
    const index = this.inputs.indexOf(input);
    if (index < 0) {
      return;
    }

    this.inputsStates[index] = state;
  }

  private getStateForInput(input: HTMLInputElement): InputState | undefined {
    const index = this.inputs.indexOf(input);
    return this.inputsStates[index];
  }

  private isEmpty(value: any): boolean {
    return  value === null || value === undefined || !value.toString().length;
  }
}
