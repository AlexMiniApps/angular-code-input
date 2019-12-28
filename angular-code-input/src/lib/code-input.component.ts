import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  QueryList,
  ViewChildren
} from '@angular/core';

/**
 * Generated class for the CodeInputComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'code-input',
  templateUrl: 'code-input.component.html',
  styleUrls: ['./code-input.component.scss']
})
export class CodeInputComponent implements AfterViewInit, OnInit {

  @ViewChildren('input') inputsList: QueryList<ElementRef>;

  @Input() readonly codeLength: number;
  @Input() readonly isCodeHidden: boolean;
  @Input() readonly isNonDigitsCode: boolean;

  @Output() codeChanged = new EventEmitter<string>();
  @Output() codeCompleted = new EventEmitter<string>();

  public placeHolders: number[];
  public state = {
    isEmpty: true
  };

  private inputs: HTMLInputElement[] = [];

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
    });
  }

  /**
   * Methods
   */

  onInput(e: any, i: number): void {
    const next = i + 1;
    const target = e.target;
    const data = e.data || target.value;

    if (data === null || data === undefined || !data.toString().length) {
      return;
    }

    // only digits are allowed if isNonDigitsCode flag is absent/false
    if (!this.isNonDigitsCode && !this.isDigitsData(data)) {
      e.preventDefault();
      e.stopPropagation();
      this.setInputValue(target, null);
      return;
    }

    this.setInputValue(target, data.toString().charAt(0));
    this.emitChanges();

    if (next > this.codeLength - 1) {
      target.blur();
      return;
    }

    this.inputs[next].focus();
  }

  async onKeydown(e: any, i: number): Promise<void> {
    // processing only backspace events
    const isBackspaceKey = await this.isBackspaceKey(e);
    if (!isBackspaceKey) {
      return;
    }

    const prev = i - 1;
    const target = e.target;

    e.preventDefault();

    this.setInputValue(target, null);
    this.emitChanges();

    if (prev < 0) {
      return;
    }

    this.inputs[prev].focus();
  }

  private emitChanges(): void {
    setTimeout(() => this.emitCode(), 50);
  }

  private emitCode(): void {
    let code = '';

    for (const input of this.inputs) {
      if (input.value !== null && input.value !== undefined) {
        code += input.value;
      }
    }

    this.codeChanged.emit(code);

    if (code.length < this.codeLength) {
      code = null;
    }

    this.state.isEmpty = (code === null);

    if (code !== null) {
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
        // if backspace key pressed the caret will have position 0 (for single value field)
        resolve(e.target.selectionStart === 0);
      });
    });
  }

  private isDigitsData(data: any): boolean {
    return /^[0-9]+$/.test(data.toString());
  }

  private setInputValue(input: HTMLInputElement, value: any): void {
    const isNonEmpty = value !== null && value !== undefined && value.toString().length;
    input.value = value;
    input.className = isNonEmpty ? 'has-value' : '';
  }
}
