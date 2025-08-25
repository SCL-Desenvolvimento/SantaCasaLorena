import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransparencyPortalComponent } from './transparency-portal.component';

describe('TransparencyPortalComponent', () => {
  let component: TransparencyPortalComponent;
  let fixture: ComponentFixture<TransparencyPortalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TransparencyPortalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TransparencyPortalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
