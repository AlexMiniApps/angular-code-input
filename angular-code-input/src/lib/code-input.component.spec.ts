import { waitForAsync, ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';

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

  it('should emit the changed code when paste stops at an invalid character', fakeAsync(() => {
    const inputs = Array.from(fixture.nativeElement.querySelectorAll('input')) as HTMLInputElement[];
    inputs.forEach(input => input.value = '9');
    const changed = spyOn(component.codeChanged, 'emit');
    const completed = spyOn(component.codeCompleted, 'emit');
    const event = {
      preventDefault: () => {},
      stopPropagation: () => {},
      clipboardData: { getData: () => '1x' }
    } as unknown as ClipboardEvent;

    component.onPaste(event, 0);
    tick(50);

    expect(inputs.map(input => input.value)).toEqual(['1', '', '9', '9']);
    expect(changed).toHaveBeenCalledOnceWith('199');
    expect(completed).not.toHaveBeenCalled();
  }));
});
