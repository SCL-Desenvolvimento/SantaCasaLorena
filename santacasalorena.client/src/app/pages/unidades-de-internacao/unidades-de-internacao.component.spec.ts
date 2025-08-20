import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UnidadesDeInternacaoComponent } from './unidades-de-internacao.component';

describe('UnidadesDeInternacaoComponent', () => {
  let component: UnidadesDeInternacaoComponent;
  let fixture: ComponentFixture<UnidadesDeInternacaoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UnidadesDeInternacaoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UnidadesDeInternacaoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
