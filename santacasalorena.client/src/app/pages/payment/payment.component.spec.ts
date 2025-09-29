import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
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
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    const locationSpy = jasmine.createSpyObj('Location', ['back']);
    
    mockActivatedRoute = {
      queryParams: of({ amount: '100' })
    };

    await TestBed.configureTestingModule({
      declarations: [PaymentComponent],
      imports: [ReactiveFormsModule],
      providers: [
        { provide: Router, useValue: routerSpy },
        { provide: Location, useValue: locationSpy },
        { provide: ActivatedRoute, useValue: mockActivatedRoute }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PaymentComponent);
    component = fixture.componentInstance;
    mockRouter = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    mockLocation = TestBed.inject(Location) as jasmine.SpyObj<Location>;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with donation amount from query params', () => {
    expect(component.donationAmount).toBe(100);
  });

  it('should redirect to donation page if amount is invalid', () => {
    mockActivatedRoute.queryParams = of({ amount: '0' });
    component.ngOnInit();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/donation']);
  });

  it('should select payment method correctly', () => {
    component.selectPaymentMethod('pix');
    expect(component.selectedMethod).toBe('pix');
  });

  it('should update validations when credit card is selected', () => {
    component.selectPaymentMethod('credit');
    
    const cardNumberControl = component.paymentForm.get('cardNumber');
    const cardNameControl = component.paymentForm.get('cardName');
    
    expect(cardNumberControl?.hasError('required')).toBeTruthy();
    expect(cardNameControl?.hasError('required')).toBeTruthy();
  });

  it('should clear validations when non-credit method is selected', () => {
    component.selectPaymentMethod('credit');
    component.selectPaymentMethod('pix');
    
    const cardNumberControl = component.paymentForm.get('cardNumber');
    expect(cardNumberControl?.validator).toBeNull();
  });

  it('should validate CPF correctly', () => {
    const validCpf = { value: '11144477735' };
    const invalidCpf = { value: '12345678901' };
    
    expect(component.cpfValidator(validCpf)).toBeNull();
    expect(component.cpfValidator(invalidCpf)).toEqual({ invalidCpf: true });
  });

  it('should validate card number correctly', () => {
    const validCard = { value: '4111111111111111' }; // Visa test number
    const invalidCard = { value: '1234567890123456' };
    
    expect(component.cardNumberValidator(validCard)).toBeNull();
    expect(component.cardNumberValidator(invalidCard)).toEqual({ invalidCardNumber: true });
  });

  it('should validate expiry date correctly', () => {
    const futureDate = { value: '12/30' };
    const pastDate = { value: '01/20' };
    const invalidFormat = { value: '1230' };
    
    expect(component.expiryDateValidator(futureDate)).toBeNull();
    expect(component.expiryDateValidator(pastDate)).toEqual({ invalidExpiryDate: true });
    expect(component.expiryDateValidator(invalidFormat)).toEqual({ invalidExpiryDate: true });
  });

  it('should check if field is invalid correctly', () => {
    const fullNameControl = component.paymentForm.get('fullName');
    fullNameControl?.markAsTouched();
    fullNameControl?.setValue('');
    
    expect(component.isFieldInvalid('fullName')).toBeTruthy();
  });

  it('should go back when goBack is called', () => {
    component.goBack();
    expect(mockLocation.back).toHaveBeenCalled();
  });

  it('should return correct payment method name', () => {
    component.selectedMethod = 'credit';
    expect(component.getPaymentMethodName()).toBe('Cartão de Crédito');
    
    component.selectedMethod = 'pix';
    expect(component.getPaymentMethodName()).toBe('PIX');
    
    component.selectedMethod = 'boleto';
    expect(component.getPaymentMethodName()).toBe('Boleto Bancário');
  });

  it('should format currency correctly', () => {
    const formatted = component.formatCurrency(100);
    expect(formatted).toBe('R$ 100,00');
  });

  it('should validate donation amount correctly', () => {
    component.donationAmount = 100;
    expect(component.isValidDonationAmount()).toBeTruthy();
    
    component.donationAmount = 3;
    expect(component.isValidDonationAmount()).toBeFalsy();
    
    component.donationAmount = 0;
    expect(component.isValidDonationAmount()).toBeFalsy();
  });

  it('should process payment when form is valid', () => {
    // Preencher formulário com dados válidos
    component.paymentForm.patchValue({
      fullName: 'João Silva',
      email: 'joao@email.com',
      cpf: '11144477735',
      acceptTerms: true
    });
    
    component.selectedMethod = 'pix';
    component.updateValidations();
    
    spyOn(component, 'generateTransactionId').and.returnValue('TEST123');
    
    component.processPayment();
    
    expect(component.isProcessing).toBeTruthy();
  });

  it('should mark form as touched when form is invalid', () => {
    component.paymentForm.patchValue({
      fullName: '',
      email: 'invalid-email',
      acceptTerms: false
    });
    
    component.processPayment();
    
    const fullNameControl = component.paymentForm.get('fullName');
    expect(fullNameControl?.touched).toBeTruthy();
  });

  it('should generate unique transaction ID', () => {
    const id1 = component['generateTransactionId']();
    const id2 = component['generateTransactionId']();
    
    expect(id1).toMatch(/^SCL\d{6}[A-Z0-9]{9}$/);
    expect(id2).toMatch(/^SCL\d{6}[A-Z0-9]{9}$/);
    expect(id1).not.toBe(id2);
  });

  it('should mask card number correctly', () => {
    const cardNumber = '4111111111111111';
    const masked = component['maskCardNumber'](cardNumber);
    
    expect(masked).toBe('**** **** **** 1111');
  });

  it('should return correct form status class', () => {
    // Formulário válido
    component.paymentForm.patchValue({
      fullName: 'João Silva',
      email: 'joao@email.com',
      cpf: '11144477735',
      acceptTerms: true
    });
    component.selectedMethod = 'pix';
    component.updateValidations();
    
    expect(component.getFormStatusClass()).toBe('valid');
    
    // Formulário inválido e touched
    component.paymentForm.patchValue({
      fullName: '',
      email: 'invalid'
    });
    component.paymentForm.markAllAsTouched();
    
    expect(component.getFormStatusClass()).toBe('invalid');
  });

  it('should handle phone validation correctly', () => {
    const phoneControl = component.paymentForm.get('phone');
    
    phoneControl?.setValue('(11) 99999-9999');
    expect(phoneControl?.valid).toBeTruthy();
    
    phoneControl?.setValue('invalid-phone');
    expect(phoneControl?.valid).toBeFalsy();
  });
});

