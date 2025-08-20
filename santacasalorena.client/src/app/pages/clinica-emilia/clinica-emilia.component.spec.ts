import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClinicaEmiliaComponent } from './clinica-emilia.component';

describe('ClinicaEmiliaComponent', () => {
  let component: ClinicaEmiliaComponent;
  let fixture: ComponentFixture<ClinicaEmiliaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ClinicaEmiliaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClinicaEmiliaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
