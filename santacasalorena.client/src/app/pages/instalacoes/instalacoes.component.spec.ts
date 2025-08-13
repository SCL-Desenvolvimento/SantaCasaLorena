import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InstalacoesComponent } from './instalacoes.component';

describe('InstalacoesComponent', () => {
  let component: InstalacoesComponent;
  let fixture: ComponentFixture<InstalacoesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [InstalacoesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InstalacoesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
