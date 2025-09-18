import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-doacoes',
  standalone: false,
  templateUrl: './doacoes.component.html',
  styleUrl: './doacoes.component.css'
})
export class DoacoesComponent {
  selectedAmount: number | null = null;
  customValue: number | null = null;
  showCustomInput: boolean = false;
  showVideo: boolean = false;

  constructor(private router: Router) {}

  /**
   * Seleciona um valor pré-definido para doação
   * @param amount Valor da doação
   */
  selectAmount(amount: number): void {
    this.selectedAmount = amount;
    this.showCustomInput = false;
    this.customValue = null;
  }

  /**
   * Ativa o input para valor customizado
   */
  selectCustomAmount(): void {
    this.showCustomInput = true;
    if (this.customValue && this.customValue > 0) {
      this.selectedAmount = this.customValue;
    }
  }

  /**
   * Atualiza o valor selecionado quando o usuário digita um valor customizado
   */
  onCustomValueChange(): void {
    if (this.customValue && this.customValue > 0) {
      this.selectedAmount = this.customValue;
    } else {
      this.selectedAmount = null;
    }
  }

  /**
   * Exibe o vídeo institucional
   */
  playVideo(): void {
    this.showVideo = true;
  }

  /**
   * Fecha o vídeo institucional
   */
  closeVideo(): void {
    this.showVideo = false;
  }

  /**
   * Procede para a página de pagamento com o valor selecionado
   * @param amount Valor da doação
   */
  proceedToDonation(amount: number | null): void {
    if (amount && amount > 0) {
      // Validação adicional para valores muito baixos
      if (amount < 5) {
        alert('O valor mínimo para doação é R$ 5,00');
        return;
      }

      // Navegar para a página de pagamento com o valor selecionado
      this.router.navigate(['/payment'], { 
        queryParams: { 
          amount: amount,
          timestamp: Date.now() // Para evitar cache
        } 
      });
    } else {
      alert('Por favor, selecione um valor válido para doação');
    }
  }

  /**
   * Método principal para realizar a doação
   */
  donate(): void {
    if (this.selectedAmount && this.selectedAmount > 0) {
      this.proceedToDonation(this.selectedAmount);
    } else {
      alert('Por favor, selecione um valor para doação');
    }
  }

  /**
   * Formata o valor para exibição
   * @param value Valor a ser formatado
   * @returns Valor formatado em moeda brasileira
   */
  formatCurrency(value: number): string {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  }

  /**
   * Valida se o valor inserido é válido
   * @param value Valor a ser validado
   * @returns True se o valor é válido
   */
  isValidAmount(value: number | null): boolean {
    return value !== null && value > 0 && value >= 5;
  }
}

