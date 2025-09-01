import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-forgot-password',
  standalone: false,
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent {
  @Output() close = new EventEmitter<void>();
  email: string = '';
  errorMessage: string = '';
  successMessage: string = '';

  onSubmit(): void {
    this.errorMessage = '';
    this.successMessage = '';

    if (!this.validateEmail(this.email)) {
      this.errorMessage = 'Por favor, insira um e-mail válido.';
      return;
    }

    // Aqui você chamaria sua API de recuperação de senha
    console.log('Enviando e-mail de recuperação para:', this.email);

    this.successMessage = 'As instruções foram enviadas para seu e-mail!';
    this.email = '';
  }

  private validateEmail(email: string): boolean {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email.toLowerCase());
  }
}
