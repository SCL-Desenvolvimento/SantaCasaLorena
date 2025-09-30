import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FloatingContainerComponent } from './floating-container.component';

describe('FloatingContainerComponent', () => {
  let component: FloatingContainerComponent;
  let fixture: ComponentFixture<FloatingContainerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FloatingContainerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FloatingContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
