import { NgModule } from '@angular/core';
import {CodeInputComponent} from './code-input.component';
import {CommonModule} from '@angular/common';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    CodeInputComponent
  ],
  exports: [
    CodeInputComponent
  ]
})
export class CodeInputModule {}
