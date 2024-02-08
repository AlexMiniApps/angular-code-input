# Code/pincode input component for angular

![](https://img.shields.io/npm/dm/angular-code-input?color=55aa33)
![](https://img.shields.io/github/stars/AlexMiniApps/angular-code-input)
![](https://badgen.net/badge/icon/typescript?icon=typescript&label&color=99aabb)
![](https://img.shields.io/github/license/AlexMiniApps/angular-code-input?color=00ccbb)

Robust and <b>tested</b> code (number/chars) input component for Angular 7 - 16+ projects.<br />
Ionic 4 - 7+ is supported, can be used in iOS and Android.<br />
<b>Clipboard</b> events are supported.

Star it to inspire us to build the best component! <img src="https://github.com/AlexMiniApps/angular-code-input/blob/master/star.jpg" alt="Star"/>

Preview

![](https://github.com/AlexMiniApps/angular-code-input/blob/master/preview1.gif)

![](https://github.com/AlexMiniApps/angular-code-input/blob/master/preview2.gif)

## Supported platforms

<b>Angular</b> 7 - 16+<br />
<b>Ionic</b> 4 - 7+<br />
Mobile browsers and WebViews on: <b>Android</b> and <b>iOS</b><br />
Desktop browsers: <b>Chrome, Firefox, Safari, Edge v.79 +</b><br />
Other browsers:  <b>Edge v.41 - 44</b> (without code hidden feature)

## Installation

    $ npm install --save angular-code-input

Choose the version corresponding to your Angular version:

| Angular    | angular-code-input |
|------------|--------------------|
| 16+        | 2.x+               |
| 7-15       | 1.x+               |

## Usage

Import `CodeInputModule` in your app module or page module:

```ts
import { CodeInputModule } from 'angular-code-input';

@NgModule({
  imports: [
    // ...
    CodeInputModule
  ]
})
```

It is possible to configure the component across the app using the root config. In such case the import will look as follows:
```ts
import { CodeInputModule } from 'angular-code-input';

@NgModule({
  imports: [
    // ...
    CodeInputModule.forRoot({
      codeLength: 6,
      isCharsCode: true,
      code: 'abcdef'
    }),
  ]
})
```

Include the component on page template HTML:

```html
  <code-input [isCodeHidden]="true"
              [codeLength]="5"
              (codeChanged)="onCodeChanged($event)"
              (codeCompleted)="onCodeCompleted($event)">
</code-input>
```

Inside a page script:

```ts
  // this called every time when user changed the code
onCodeChanged(code: string) {
}

// this called only if user entered full code
onCodeCompleted(code: string) {
}
```

## Configuration

#### View

It is possible to configure the component via CSS vars
<br />or using `::ng-deep` (deprecated) angular CSS selector
[::ng-deep](https://angular.io/guide/component-styles#deprecated-deep--and-ng-deep)

CSS vars:

| CSS Var                                                      | Description                                            |          
|--------------------------------------------------------------|--------------------------------------------------------|
| `--text-security-type: disc;`                                | Text presentation type when the isCodeHidden is enabled |
| `--item-spacing: 4px;`                                       | Horizontal space between input items                   |
| `--item-height: 4.375em;`                                    | Height of input items                                  |
| `--item-border: 1px solid #dddddd;`                          | Border of input item for an empty value                |
| `--item-border-bottom: 1px solid #dddddd;`                   | Bottom border of input item for an empty value         |
| `--item-border-has-value: 1px solid #dddddd;`                | Border of input item with a value                      |
| `--item-border-bottom-has-value: 1px solid #dddddd;`         | Bottom border of input item with a value               |
| `--item-border-focused: 1px solid #dddddd;`                  | Border of input item when focused                      |
| `--item-border-bottom-focused: 1px solid #dddddd;`           | Bottom border of input item when focused               |
| `--item-shadow-focused: 0px 1px 5px rgba(221, 221, 221, 1);` | Shadow of input item when focused                      |
| `--item-border-radius: 5px;`                                 | Border radius of input item                            |
| `--item-background: transparent;`                            | Input item background                                  |
| `--item-font-weight: 300;`                                   | Font weight of input item                              |
| `--color: #171516;`                                          | Text color of input items                              |

Example with only bottom borders:

````
/* inside page styles*/
...
  code-input {
    --item-spacing: 10px;
    --item-height: 3em;
    --item-border: none;
    --item-border-bottom: 2px solid #dddddd;
    --item-border-has-value: none;
    --item-border-bottom-has-value: 2px solid #888888;
    --item-border-focused: none;
    --item-border-bottom-focused: 2px solid #809070;
    --item-shadow-focused: none;
    --item-border-radius: 0px;
  }
...
````

#### Component options

| Property  | Type   | Default |  Description |         
|----------|:-------:|:-----:|----------|
| <b>`codeLength`</b> | number | 4 | Length of input code |
| <b>`inputType`</b> | string | tel | Type of the input DOM elements like `<input [type]="inputType"/>` default '`tel'` |
| <b>`isCodeHidden`</b> | boolean | false | When `true` inputted code chars will be shown as asterisks (points) |
| <b>`isCharsCode`</b> | boolean | false | When `true` inputted code can contain any char and not only digits from 0 to 9. If the input parameter <b>`code`</b> contains non digits chars and `isCharsCode` is `false` the value will be ignored |
| <b>`isPrevFocusableAfterClearing`</b> | boolean | true | When `true` after the input value deletion the caret will be moved to the previous input immediately. If `false` then after the input value deletion the caret will stay on the current input and be moved to the previous input only if the current input is empty |
| <b>`isFocusingOnLastByClickIfFilled`</b> | boolean | false | When `true` and the code is filled then the focus will be moved to the last input element when clicked |
| <b>`initialFocusField`</b> | number | - | The index of the input box for initial focusing. When the component will appear the focus will be placed on the input with this index. <br/> Note: If you need to dynamically hide the component it is needed to use <b>*ngIf</b> directive instead of the `[hidden]` attribute |
| <b>`code`</b> | string / number | - | The input code value for the component. If the parameter contains non digits chars and `isCharsCode` is `false` the value will be <b>ignored</b> |
| <b>`disabled`</b> | boolean | false | When `true` then the component will not handle user actions, like in regular html input element with the `disabled` attribute  |
| <b>`autocapitalize`</b> | string | - | The autocapitalize attribute is an enumerated attribute that controls whether and how text input is automatically capitalized as it is entered/edited by the user  |

#### Events

| Event  | Description        |          
|----------|--------------------|
| `codeChanged` | Will be called every time when a user changed the code |
| `codeCompleted` | Will be called only if a user entered full code |

## Methods

For calling the component's methods it is required to access the component inside the template or page script.
It can be reached as follows.

Inside the page template HTML add a template ref:

```html
<code-input
  ...
  #codeInput
  ...
>
</code-input>
```

Inside a page script attach the component:

```ts
...
// adding to the imports
import {CodeInputComponent} from 'angular-code-input';
...
// adding to the page props
@ViewChild('codeInput') codeInput !: CodeInputComponent;
...
// calling the component's methods somewhere in the page.
// IMPORTANT: it will be accessible only after the view initialization!
this.codeInput.reset();
```

| Method         | Description        |          
|----------------|--------------------|
| <b>`focusOnField(index: number): void`</b> | Focuses the input caret on the input box with the passed index |
| <b>`reset(isChangesEmitting = false): void`</b> | <p>Resets the component values in the following way:</p><p>if the `code` option is supplied then the value will be reset to the `code` option value. If the `code` option is not supplied then the component will be reset to empty values.</p><p>if the `initialFocusField` option is supplied then the caret will be focused in that filed after reset.</p><p>if the `isChangesEmitting` param is passed then changes will be emitted</p>|
