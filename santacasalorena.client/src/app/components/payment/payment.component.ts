import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'app-payment',
  standalone: false,
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css']
})
export class PaymentComponent implements OnInit {
  paymentForm: FormGroup;
  donationAmount: number = 0;
  selectedMethod: string = 'credit';
  isProcessing: boolean = false;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private location: Location
  ) {
    this.paymentForm = this.createForm();
  }

  ngOnInit(): void {
    // Obter o valor da doação dos parâmetros da URL
    this.route.queryParams.subscribe(params => {
      this.donationAmount = parseFloat(params['amount']) || 0;
      
      if (this.donationAmount <= 0) {
        // Se não há valor válido, redirecionar de volta
        this.router.navigate(['/donation']);
      }
    });
  }

  createForm(): FormGroup {
    return this.fb.group({
      // Dados pessoais
      fullName: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      phone: [''],
      cpf: ['', [Validators.required, this.cpfValidator]],
      birthDate: [''],
      
      // Dados do cartão (apenas para cartão de crédito)
      cardNumber: [''],
      cardName: [''],
      expiryDate: [''],
      cvv: [''],
      
      // Termos e condições
      acceptTerms: [false, Validators.requiredTrue],
      receiveNews: [false]
    });
  }

  selectPaymentMethod(method: string): void {
    this.selectedMethod = method;
    
    // Atualizar validações baseadas no método de pagamento
    this.updateValidations();
  }

  updateValidations(): void {
    const cardFields = ['cardNumber', 'cardName', 'expiryDate', 'cvv'];
    
    if (this.selectedMethod === 'credit') {
      // Adicionar validações para cartão de crédito
      cardFields.forEach(field => {
        this.paymentForm.get(field)?.setValidators([Validators.required]);
        this.paymentForm.get(field)?.updateValueAndValidity();
      });
    } else {
      // Remover validações para outros métodos
      cardFields.forEach(field => {
        this.paymentForm.get(field)?.clearValidators();
        this.paymentForm.get(field)?.updateValueAndValidity();
      });
    }
  }

  cpfValidator(control: any) {
    const cpf = control.value?.replace(/\D/g, '');
    
    if (!cpf || cpf.length !== 11) {
      return { invalidCpf: true };
    }
    
    // Verificar se todos os dígitos são iguais
    if (/^(\d)\1{10}$/.test(cpf)) {
      return { invalidCpf: true };
    }
    
    // Validação dos dígitos verificadores
    let sum = 0;
    for (let i = 0; i < 9; i++) {
      sum += parseInt(cpf.charAt(i)) * (10 - i);
    }
    let digit1 = 11 - (sum % 11);
    if (digit1 > 9) digit1 = 0;
    
    if (parseInt(cpf.charAt(9)) !== digit1) {
      return { invalidCpf: true };
    }
    
    sum = 0;
    for (let i = 0; i < 10; i++) {
      sum += parseInt(cpf.charAt(i)) * (11 - i);
    }
    let digit2 = 11 - (sum % 11);
    if (digit2 > 9) digit2 = 0;
    
    if (parseInt(cpf.charAt(10)) !== digit2) {
      return { invalidCpf: true };
    }
    
    return null;
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.paymentForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  goBack(): void {
    this.location.back();
  }

  processPayment(): void {
    if (this.paymentForm.valid) {
      this.isProcessing = true;
      
      // Simular processamento do pagamento
      setTimeout(() => {
        this.isProcessing = false;
        
        // Dados do pagamento
        const paymentData = {
          amount: this.donationAmount,
          method: this.selectedMethod,
          personalData: {
            fullName: this.paymentForm.value.fullName,
            email: this.paymentForm.value.email,
            phone: this.paymentForm.value.phone,
            cpf: this.paymentForm.value.cpf,
            birthDate: this.paymentForm.value.birthDate
          },
          cardData: this.selectedMethod === 'credit' ? {
            cardNumber: this.paymentForm.value.cardNumber,
            cardName: this.paymentForm.value.cardName,
            expiryDate: this.paymentForm.value.expiryDate,
            cvv: this.paymentForm.value.cvv
          } : null,
          preferences: {
            receiveNews: this.paymentForm.value.receiveNews
          }
        };
        
        // Aqui seria feita a integração com o gateway de pagamento real
        console.log('Dados do pagamento:', paymentData);
        
        // Redirecionar para página de sucesso
        this.router.navigate(['/payment-success'], {
          queryParams: {
            amount: this.donationAmount,
            method: this.selectedMethod,
            transactionId: this.generateTransactionId()
          }
        });
        
      }, 3000); // Simular 3 segundos de processamento
    } else {
      // Marcar todos os campos como touched para mostrar erros
      Object.keys(this.paymentForm.controls).forEach(key => {
        this.paymentForm.get(key)?.markAsTouched();
      });
    }
  }

  private generateTransactionId(): string {
    return 'TXN' + Date.now() + Math.random().toString(36).substr(2, 9).toUpperCase();
  }
}

