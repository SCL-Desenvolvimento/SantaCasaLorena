import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmendasComponent } from './emendas.component';

describe('EmendasComponent', () => {
  let component: EmendasComponent;
  let fixture: ComponentFixture<EmendasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EmendasComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmendasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
