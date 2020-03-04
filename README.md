# Code/pincode input component for angular 

Code (number/chars) input component for angular 7+ projects.<br />
Ionic 4+ is supported, can be used in iOS and Android.

Preview

![](https://github.com/AlexMiniApps/angular-code-input/blob/master/preview1.gif)

![](https://github.com/AlexMiniApps/angular-code-input/blob/master/preview2.gif)

## Supported platforms

<b>Angular</b> 7, 8, 9 +<br />
<b>Ionic</b> 4, 5 +<br />
Mobile browsers and WebViews on: <b>Android and iOS</b><br />
Desktop browsers: <b>Chrome, Firefox, Safari, Edge v.79 +</b><br />
Other browsers:  <b>Edge v.41 - 44</b> (without code hidden feature)

## Installation

    $ npm install --save angular-code-input

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

Include the component on page template HTML:

```html
  <code-input [isCodeHidden]="false"
              [isNonDigitsCode]="false"
              [codeLength]="4"
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

`--text-security-type: disc;` - text presentation type when the isCodeHidden is enabled<br />
`--item-spacing: 4px;` - horizontal space between input items  <br />
`--item-height: 4.375em;` - height of input items <br />
`--item-border: 1px solid #dddddd;` - border of input item for an empty value <br />
`--item-border-bottom: 1px solid #dddddd;` - bottom border of input item for an empty value <br />
`--item-border-has-value: 1px solid #dddddd;` - border of input item with a value <br />
`--item-border-bottom-has-value: 1px solid #dddddd;` - bottom border of input item with a value <br />
`--item-border-focused: 1px solid #dddddd;` - border of input item when focused <br />
`--item-border-bottom-focused: 1px solid #dddddd;` - bottom border of input item when focused <br />
`--item-shadow-focused: 0px 1px 5px rgba(221, 221, 221, 1);` - shadow of input item when focused <br />
`--item-border-radius: 5px;` - border radius of input item <br />
`--item-background: transparent;` - input item background  <br />
`--color: #171516;` - text color of input items <br />

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

<b>`codeLength: number`</b> - length of input code <br /><br />
<b>`isCodeHidden: boolean`</b> - when `true` inputted code chars will be shown as asterisks (points)<br /><br />
<b>`isNonDigitsCode: boolean`</b> - when `true` inputted code can contain any char and not only digits from 0 to 9.
If the input parameter <b>`code`</b> contains non digits chars and `isNonDigitsCode` is `false` the value will be ignored<br /><br />
<b>`isPrevFocusableAfterClearing: boolean`</b> - when `true` after the input value deletion the caret will be moved 
to the previous input immediately. If `false` then after the input value deletion the caret will 
stay on the current input and be moved to the previous input only if the current input is empty<br /><br />
<b>`inputType: string`</b> - type of the input DOM elements like `<input [type]="inputType"/>` default '`tel'`<br /><br />
<b>`code: string | number`</b> - the input code value for the component. If the parameter 
contains non digits chars and `isNonDigitsCode` is `false` the value will be <b>ignored</b> <br /><br />

#### Events

`codeChanged` - will be called every time when a user changed the code <br />
`codeCompleted` - will be called only if a user entered full code

