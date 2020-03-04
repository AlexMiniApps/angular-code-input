import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input, OnChanges,
  OnInit,
  Output,
  QueryList, SimpleChanges,
  ViewChildren
} from '@angular/core';

enum InputState {
  ready = 0,
  reset = 1
}

@Component({
  selector: 'code-input',
  templateUrl: 'code-input.component.html',
  styleUrls: ['./code-input.component.scss']
})
export class CodeInputComponent implements AfterViewInit, OnInit, OnChanges {

  @ViewChildren('input') inputsList: QueryList<ElementRef>;

  @Input() readonly codeLength = 4;
  @Input() readonly isNonDigitsCode = false;
  @Input() readonly isCodeHidden = false;
  @Input() readonly isPrevFocusableAfterClearing = true;
  @Input() readonly inputType = 'tel';
  @Input() readonly code?: string | number;

  @Output() codeChanged = new EventEmitter<string>();
  @Output() codeCompleted = new EventEmitter<string>();

  public placeHolders: number[];

  private inputs: HTMLInputElement[] = [];
  private inputsStates: InputState[] = [];

  constructor() {
  }

  /**
   * Life cycle
   */

  ngOnInit(): void {
    this.placeHolders = Array(this.codeLength).fill(1);
  }

  ngAfterViewInit(): void {
    this.inputsList.forEach((item) => {
      this.inputs.push(item.nativeElement);
      this.inputsStates.push(InputState.ready);
    });

    // the @Input code might have value. Checking
    this.onInputCodeChanges();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.code) {
      this.onInputCodeChanges();
    }
  }

  /**
   * Methods
   */

  onInput(e: any, i: number): void {
    const next = i + 1;
    const target = e.target;
    const value = e.data || target.value;

    if (this.isEmpty(value)) {
      return;
    }

    // only digits are allowed if isNonDigitsCode flag is absent/false
    if (!this.canInputValue(value)) {
      e.preventDefault();
      e.stopPropagation();
      this.setInputValue(target, null);
      this.setStateForInput(target, InputState.reset);
      return;
    }

    this.setInputValue(target, value.toString().charAt(0));
    this.emitChanges();

    if (next > this.codeLength - 1) {
      target.blur();
      return;
    }

    this.inputs[next].focus();
  }

  async onKeydown(e: any, i: number): Promise<void> {
    const target = e.target;
    const isTargetEmpty = this.isEmpty(target.value);
    const prev = i - 1;

    // processing only backspace events
    const isBackspaceKey = await this.isBackspaceKey(e);
    if (!isBackspaceKey) {
      return;
    }

    e.preventDefault();

    this.setInputValue(target, null);
    if (!isTargetEmpty) {
      this.emitChanges();
    }

    if (prev < 0) {
      return;
    }

    if (isTargetEmpty || this.isPrevFocusableAfterClearing) {
      this.inputs[prev].focus();
    }
  }

  isInputElementEmptyAt(index: number): boolean {
    const input = this.inputs[index];
    if (!input) {
      return true;
    }

    return this.isEmpty(input.value);
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

    const chars = this.code.toString().trim().split('');
    // checking if all the values are correct
    for (const char of chars) {
      if (!this.canInputValue(char)) {
        return;
      }
    }

    this.inputs.forEach((input: HTMLInputElement, index: number) => {
      this.setInputValue(input, chars[index]);
    });
  }

  private emitChanges(): void {
    setTimeout(() => this.emitCode(), 50);
  }

  private emitCode(): void {
    let code = '';

    for (const input of this.inputs) {
      if (!this.isEmpty(input.value)) {
        code += input.value;
      }
    }

    this.codeChanged.emit(code);

    if (code.length >= this.codeLength) {
      this.codeCompleted.emit(code);
    }
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

  private setInputValue(input: HTMLInputElement, value: any): void {
    const isEmpty = this.isEmpty(value);
    input.value = isEmpty ? null : value;
    input.className = isEmpty ? '' : 'has-value';
  }

  private canInputValue(value: any): boolean {
    if (this.isEmpty(value)) {
      return false;
    }

    const isDigitsValue = /^[0-9]+$/.test(value.toString());
    return isDigitsValue || this.isNonDigitsCode;
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
