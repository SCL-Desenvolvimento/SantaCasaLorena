import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PatientManualComponent } from './patient-manual.component';

describe('PatientManualComponent', () => {
  let component: PatientManualComponent;
  let fixture: ComponentFixture<PatientManualComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PatientManualComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PatientManualComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
