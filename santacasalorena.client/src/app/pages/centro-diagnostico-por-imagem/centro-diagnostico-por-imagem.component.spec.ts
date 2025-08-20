import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CentroDiagnosticoPorImagemComponent } from './centro-diagnostico-por-imagem.component';

describe('CentroDiagnosticoPorImagemComponent', () => {
  let component: CentroDiagnosticoPorImagemComponent;
  let fixture: ComponentFixture<CentroDiagnosticoPorImagemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CentroDiagnosticoPorImagemComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CentroDiagnosticoPorImagemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
