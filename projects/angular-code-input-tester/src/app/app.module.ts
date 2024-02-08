import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { CodeInputModule } from "../../../angular-code-input/src/lib/code-input.module";
import { AppComponent } from "./app.component";

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    CommonModule,

    // Init
    CodeInputModule,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
