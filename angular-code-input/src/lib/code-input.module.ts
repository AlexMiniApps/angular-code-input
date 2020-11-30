import {ModuleWithProviders, NgModule} from '@angular/core';
import {CodeInputComponent } from './code-input.component';
import {CommonModule} from '@angular/common';
import {CodeInputComponentConfig, CodeInputComponentConfigToken} from './code-input.component.config';

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
export class CodeInputModule {
  static forRoot(config: CodeInputComponentConfig): ModuleWithProviders<CodeInputModule> {
    return {
      ngModule: CodeInputModule,
      providers: [
        {provide: CodeInputComponentConfigToken, useValue: config }
      ]
    };
  }
}
