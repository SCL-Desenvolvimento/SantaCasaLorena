import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DonationInfo } from './donation-info';

describe('DonationInfo', () => {
  let component: DonationInfo;
  let fixture: ComponentFixture<DonationInfo>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DonationInfo]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DonationInfo);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
