import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AcoesSociaisAmbientaisComponent } from './acoes-sociais-ambientais.component';

describe('AcoesSociaisAmbientaisComponent', () => {
  let component: AcoesSociaisAmbientaisComponent;
  let fixture: ComponentFixture<AcoesSociaisAmbientaisComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AcoesSociaisAmbientaisComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AcoesSociaisAmbientaisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
