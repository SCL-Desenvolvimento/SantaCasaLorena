import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { of } from 'rxjs';

import { PaymentComponent } from './payment.component';

describe('PaymentComponent', () => {
  let component: PaymentComponent;
  let fixture: ComponentFixture<PaymentComponent>;
  let mockRouter: jasmine.SpyObj<Router>;
  let mockLocation: jasmine.SpyObj<Location>;
  let mockActivatedRoute: any;

  beforeEach(async () => {
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);
    mockLocation = jasmine.createSpyObj('Location', ['back']);
    mockActivatedRoute = {
      queryParams: of({ amount: '100' })
    };

    await TestBed.configureTestingModule({
      declarations: [PaymentComponent],
      imports: [ReactiveFormsModule],
      providers: [
        { provide: Router, useValue: mockRouter },
        { provide: Location, useValue: mockLocation },
        { provide: ActivatedRoute, useValue: mockActivatedRoute }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(PaymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with donation amount from query params', () => {
    expect(component.donationAmount).toBe(100);
  });

  it('should validate CPF correctly', () => {
    const validCpf = '11144477735';
    const invalidCpf = '12345678901';
    
    expect(component.cpfValidator({ value: validCpf })).toBeNull();
    expect(component.cpfValidator({ value: invalidCpf })).toEqual({ invalidCpf: true });
  });

  it('should update validations when payment method changes', () => {
    component.selectPaymentMethod('pix');
    expect(component.selectedMethod).toBe('pix');
    
    component.selectPaymentMethod('credit');
    expect(component.selectedMethod).toBe('credit');
  });

  it('should process payment when form is valid', () => {
    spyOn(component, 'processPayment');
    component.paymentForm.patchValue({
      fullName: 'João Silva',
      email: 'joao@email.com',
      cpf: '11144477735',
      acceptTerms: true
    });
    
    component.processPayment();
    expect(component.processPayment).toHaveBeenCalled();
  });
});

