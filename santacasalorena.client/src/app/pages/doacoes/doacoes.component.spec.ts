import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { DonationComponent } from './donation.component';

describe('DonationComponent', () => {
  let component: DonationComponent;
  let fixture: ComponentFixture<DonationComponent>;
  let mockRouter: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      declarations: [DonationComponent],
      imports: [FormsModule],
      providers: [
        { provide: Router, useValue: routerSpy }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DonationComponent);
    component = fixture.componentInstance;
    mockRouter = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should select amount correctly', () => {
    component.selectAmount(100);
    expect(component.selectedAmount).toBe(100);
    expect(component.showCustomInput).toBeFalse();
    expect(component.customValue).toBeNull();
  });

  it('should activate custom input', () => {
    component.selectCustomAmount();
    expect(component.showCustomInput).toBeTrue();
  });

  it('should update selected amount when custom value changes', () => {
    component.customValue = 150;
    component.onCustomValueChange();
    expect(component.selectedAmount).toBe(150);
  });

  it('should reset selected amount when custom value is invalid', () => {
    component.customValue = 0;
    component.onCustomValueChange();
    expect(component.selectedAmount).toBeNull();
  });

  it('should show video', () => {
    component.playVideo();
    expect(component.showVideo).toBeTrue();
  });

  it('should close video', () => {
    component.showVideo = true;
    component.closeVideo();
    expect(component.showVideo).toBeFalse();
  });

  it('should navigate to payment with valid amount', () => {
    component.proceedToDonation(100);
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/payment'], {
      queryParams: jasmine.objectContaining({
        amount: 100
      })
    });
  });

  it('should not navigate with invalid amount', () => {
    spyOn(window, 'alert');
    component.proceedToDonation(null);
    expect(mockRouter.navigate).not.toHaveBeenCalled();
    expect(window.alert).toHaveBeenCalled();
  });

  it('should not navigate with amount below minimum', () => {
    spyOn(window, 'alert');
    component.proceedToDonation(3);
    expect(mockRouter.navigate).not.toHaveBeenCalled();
    expect(window.alert).toHaveBeenCalledWith('O valor mínimo para doação é R$ 5,00');
  });

  it('should format currency correctly', () => {
    const formatted = component.formatCurrency(100);
    expect(formatted).toBe('R$ 100,00');
  });

  it('should validate amount correctly', () => {
    expect(component.isValidAmount(100)).toBeTrue();
    expect(component.isValidAmount(5)).toBeTrue();
    expect(component.isValidAmount(4)).toBeFalse();
    expect(component.isValidAmount(0)).toBeFalse();
    expect(component.isValidAmount(null)).toBeFalse();
  });
});

