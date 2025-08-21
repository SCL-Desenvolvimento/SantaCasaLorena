import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManualDoPacienteEVisitanteComponent } from './manual-do-paciente-e-visitante.component';

describe('ManualDoPacienteEVisitanteComponent', () => {
  let component: ManualDoPacienteEVisitanteComponent;
  let fixture: ComponentFixture<ManualDoPacienteEVisitanteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ManualDoPacienteEVisitanteComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManualDoPacienteEVisitanteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
