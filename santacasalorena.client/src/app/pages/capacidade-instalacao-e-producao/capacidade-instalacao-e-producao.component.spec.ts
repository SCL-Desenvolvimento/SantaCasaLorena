import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CapacidadeInstalacaoEProducaoComponent } from './capacidade-instalacao-e-producao.component';

describe('CapacidadeInstalacaoEProducaoComponent', () => {
  let component: CapacidadeInstalacaoEProducaoComponent;
  let fixture: ComponentFixture<CapacidadeInstalacaoEProducaoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CapacidadeInstalacaoEProducaoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CapacidadeInstalacaoEProducaoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
