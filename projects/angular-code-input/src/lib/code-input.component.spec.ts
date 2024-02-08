import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { CodeInputComponent } from './code-input.component';

describe('CodeInputComponent', () => {
  let component: CodeInputComponent;
  let fixture: ComponentFixture<CodeInputComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CodeInputComponent ]
    }).compileComponents();

    fixture = TestBed.createComponent(CodeInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
