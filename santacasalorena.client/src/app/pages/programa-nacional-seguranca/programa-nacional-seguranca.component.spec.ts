import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProgramaNacionalSegurancaComponent } from './programa-nacional-seguranca.component';

describe('ProgramaNacionalSegurancaComponent', () => {
  let component: ProgramaNacionalSegurancaComponent;
  let fixture: ComponentFixture<ProgramaNacionalSegurancaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProgramaNacionalSegurancaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProgramaNacionalSegurancaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
