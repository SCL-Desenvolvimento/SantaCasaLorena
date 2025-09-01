import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {
  // Propriedades do formulário
  username: string = '';
  password: string = '';

  // Estados do componente
  isLoading: boolean = false;
  usernameError: string = '';
  passwordError: string = '';

  showForgotPassword: boolean = false;

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit(): void {
    // Inicialização do componente
    this.clearErrors();
  }

  /**
   * Método para realizar o login
   */
  onLogin(): void {
    // Limpar erros anteriores
    this.clearErrors();

    // Validar campos
    if (!this.validateForm()) {
      return;
    }

    // Iniciar loading
    this.isLoading = true;

    this.authService.login(this.username, this.password).subscribe({
      next: (data) => {
        this.handleLoginSuccess();
        this.isLoading = false;
      },
      error: (error) => {
        this.handleLoginError('Usuário ou senha inválidos');
        this.isLoading = false;
      }
    });
  }

  /**
   * Método para recuperação de senha
   */
  onForgotPassword(event: Event): void {
    event.preventDefault();
    this.showForgotPassword = true;
  }

  closeForgotPassword(): void {
    this.showForgotPassword = false;
  }

  /**
   * Validação do formulário
   */
  private validateForm(): boolean {
    let isValid = true;

    // Validar username
    if (!this.username || this.username.trim().length === 0) {
      this.usernameError = 'Usuário é obrigatório';
      isValid = false;
    } else if (this.username.length < 3) {
      this.usernameError = 'Usuário deve ter pelo menos 3 caracteres';
      isValid = false;
    }

    // Validar password
    if (!this.password || this.password.trim().length === 0) {
      this.passwordError = 'Senha é obrigatória';
      isValid = false;
    } else if (this.password.length < 2) {
      this.passwordError = 'Senha deve ter pelo menos 2 caracteres';
      isValid = false;
    }

    return isValid;
  }

  /**
   * Limpar mensagens de erro
   */
  private clearErrors(): void {
    this.usernameError = '';
    this.passwordError = '';
  }

  /**
   * Tratar sucesso do login
   */
  private handleLoginSuccess(): void {
     this.router.navigate(['admin/dashboard']);
  }

  /**
   * Tratar erro do login
   */
  private handleLoginError(message: string): void {
    console.error('Erro no login:', message);

    // Mostrar erro específico ou genérico
    if (message.includes('usuário') || message.includes('senha')) {
      this.usernameError = message;
    } else {
      alert('Erro no login: ' + message);
    }
  }

  /**
   * Método para detectar Enter no formulário
   */
  onKeyPress(event: KeyboardEvent): void {
    if (event.key === 'Enter' && !this.isLoading) {
      this.onLogin();
    }
  }
}
