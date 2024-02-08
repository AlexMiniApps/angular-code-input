import { CommonModule } from "@angular/common";
import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { CodeInputModule } from "../../../angular-code-input/src/public-api";
import { AppComponent } from "./app.component";

describe("AppComponent", () => {
  let fixture: ComponentFixture<AppComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        BrowserAnimationsModule,
        CommonModule,

        // Vendors
        CodeInputModule,
      ],
      declarations: [AppComponent],
    }).compileComponents();
  }));

  fixture = TestBed.createComponent(AppComponent);
  fixture.detectChanges(); // Initial binding

  it("should create the app", () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector("h1")?.textContent).toContain(
      "href tester is running!"
    );
  });
});
