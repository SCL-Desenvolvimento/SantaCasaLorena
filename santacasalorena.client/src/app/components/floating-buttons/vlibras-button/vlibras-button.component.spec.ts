import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VlibrasButtonComponent } from './vlibras-button.component';

describe('VlibrasButtonComponent', () => {
  let component: VlibrasButtonComponent;
  let fixture: ComponentFixture<VlibrasButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [VlibrasButtonComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VlibrasButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
