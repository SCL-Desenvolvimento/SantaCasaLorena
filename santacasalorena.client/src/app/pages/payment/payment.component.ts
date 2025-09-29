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
      phone: ['', [Validators.pattern(/^\(\d{2}\)\s\d{4,5}-\d{4}$/)]],
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

  /**
   * Seleciona o método de pagamento e atualiza as validações
   * @param method Método de pagamento selecionado
   */
  selectPaymentMethod(method: string): void {
    this.selectedMethod = method;
    this.updateValidations();
  }

  /**
   * Atualiza as validações baseadas no método de pagamento selecionado
   */
  updateValidations(): void {
    const cardFields = ['cardNumber', 'cardName', 'expiryDate', 'cvv'];
    
    if (this.selectedMethod === 'credit') {
      // Adicionar validações para cartão de crédito
      this.paymentForm.get('cardNumber')?.setValidators([Validators.required, this.cardNumberValidator]);
      this.paymentForm.get('cardName')?.setValidators([Validators.required, Validators.minLength(3)]);
      this.paymentForm.get('expiryDate')?.setValidators([Validators.required, this.expiryDateValidator]);
      this.paymentForm.get('cvv')?.setValidators([Validators.required, Validators.pattern(/^\d{3,4}$/)]);
    } else {
      // Remover validações para outros métodos
      cardFields.forEach(field => {
        this.paymentForm.get(field)?.clearValidators();
      });
    }
    
    // Atualizar validações
    cardFields.forEach(field => {
      this.paymentForm.get(field)?.updateValueAndValidity();
    });
  }

  /**
   * Validador customizado para CPF
   * @param control Controle do formulário
   * @returns Erro de validação ou null se válido
   */
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

  /**
   * Validador customizado para número do cartão
   * @param control Controle do formulário
   * @returns Erro de validação ou null se válido
   */
  cardNumberValidator(control: any) {
    const cardNumber = control.value?.replace(/\D/g, '');
    
    if (!cardNumber || cardNumber.length < 13 || cardNumber.length > 19) {
      return { invalidCardNumber: true };
    }
    
    // Algoritmo de Luhn para validação do cartão
    let sum = 0;
    let isEven = false;
    
    for (let i = cardNumber.length - 1; i >= 0; i--) {
      let digit = parseInt(cardNumber.charAt(i));
      
      if (isEven) {
        digit *= 2;
        if (digit > 9) {
          digit -= 9;
        }
      }
      
      sum += digit;
      isEven = !isEven;
    }
    
    return sum % 10 === 0 ? null : { invalidCardNumber: true };
  }

  /**
   * Validador customizado para data de validade
   * @param control Controle do formulário
   * @returns Erro de validação ou null se válido
   */
  expiryDateValidator(control: any) {
    const value = control.value;
    
    if (!value || !/^\d{2}\/\d{2}$/.test(value)) {
      return { invalidExpiryDate: true };
    }
    
    const [month, year] = value.split('/').map((v: string) => parseInt(v));
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear() % 100;
    const currentMonth = currentDate.getMonth() + 1;
    
    if (month < 1 || month > 12) {
      return { invalidExpiryDate: true };
    }
    
    if (year < currentYear || (year === currentYear && month < currentMonth)) {
      return { invalidExpiryDate: true };
    }
    
    return null;
  }

  /**
   * Verifica se um campo específico é inválido
   * @param fieldName Nome do campo
   * @returns True se o campo é inválido
   */
  isFieldInvalid(fieldName: string): boolean {
    const field = this.paymentForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  /**
   * Retorna para a página anterior
   */
  goBack(): void {
    this.location.back();
  }

  /**
   * Retorna o nome do método de pagamento selecionado
   * @returns Nome do método de pagamento
   */
  getPaymentMethodName(): string {
    const methods: { [key: string]: string } = {
      'credit': 'Cartão de Crédito',
      'pix': 'PIX',
      'boleto': 'Boleto Bancário'
    };
    return methods[this.selectedMethod] || 'Não selecionado';
  }

  /**
   * Formata o valor para exibição em moeda brasileira
   * @param value Valor a ser formatado
   * @returns Valor formatado
   */
  formatCurrency(value: number): string {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  }

  /**
   * Processa o pagamento
   */
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
            cardNumber: this.maskCardNumber(this.paymentForm.value.cardNumber),
            cardName: this.paymentForm.value.cardName,
            expiryDate: this.paymentForm.value.expiryDate
            // CVV não é armazenado por segurança
          } : null,
          preferences: {
            receiveNews: this.paymentForm.value.receiveNews
          },
          timestamp: new Date().toISOString()
        };
        
        // Aqui seria feita a integração com o gateway de pagamento real
        console.log('Dados do pagamento:', paymentData);
        
        // Redirecionar para página de sucesso
        this.router.navigate(['/payment-success'], {
          queryParams: {
            amount: this.donationAmount,
            method: this.selectedMethod,
            transactionId: this.generateTransactionId(),
            email: this.paymentForm.value.email
          }
        });
        
      }, 3000); // Simular 3 segundos de processamento
    } else {
      // Marcar todos os campos como touched para mostrar erros
      this.markFormGroupTouched();
    }
  }

  /**
   * Marca todos os campos do formulário como touched
   */
  private markFormGroupTouched(): void {
    Object.keys(this.paymentForm.controls).forEach(key => {
      const control = this.paymentForm.get(key);
      control?.markAsTouched();
      
      if (control && typeof control.value === 'object') {
        this.markFormGroupTouched();
      }
    });
  }

  /**
   * Mascara o número do cartão para exibição segura
   * @param cardNumber Número do cartão
   * @returns Número mascarado
   */
  private maskCardNumber(cardNumber: string): string {
    if (!cardNumber) return '';
    const cleaned = cardNumber.replace(/\D/g, '');
    return cleaned.replace(/(\d{4})(\d{4})(\d{4})(\d{4})/, '**** **** **** $4');
  }

  /**
   * Gera um ID único para a transação
   * @returns ID da transação
   */
  private generateTransactionId(): string {
    const timestamp = Date.now().toString();
    const random = Math.random().toString(36).substr(2, 9).toUpperCase();
    return `SCL${timestamp.slice(-6)}${random}`;
  }

  /**
   * Valida se o valor da doação é válido
   * @returns True se o valor é válido
   */
  isValidDonationAmount(): boolean {
    return this.donationAmount > 0 && this.donationAmount >= 5;
  }

  /**
   * Retorna a classe CSS para o status do formulário
   * @returns Classe CSS
   */
  getFormStatusClass(): string {
    if (this.paymentForm.valid) return 'valid';
    if (this.paymentForm.invalid && this.paymentForm.touched) return 'invalid';
    return 'pending';
  }
}

