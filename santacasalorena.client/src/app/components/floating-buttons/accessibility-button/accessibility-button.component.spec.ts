import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccessibilityButtonComponent } from './accessibility-button.component';

describe('AccessibilityButtonComponent', () => {
  let component: AccessibilityButtonComponent;
  let fixture: ComponentFixture<AccessibilityButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AccessibilityButtonComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AccessibilityButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
