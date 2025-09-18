import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-donation-form',
  standalone: false,
  templateUrl: './donation-form.component.html',
  styleUrl: './donation-form.component.css'
})
export class DonationFormComponent {
  selectedAmount: number | null = null;
  customValue: number | null = null;
  showCustomInput: boolean = false;
  showVideo: boolean = false;

  constructor(private router: Router) {}

  selectAmount(amount: number): void {
    this.selectedAmount = amount;
    this.showCustomInput = false;
    this.customValue = null;
  }

  selectCustomAmount(): void {
    this.showCustomInput = true;
    this.selectedAmount = this.customValue;
  }

  onCustomValueChange(): void {
    if (this.customValue && this.customValue > 0) {
      this.selectedAmount = this.customValue;
    } else {
      this.selectedAmount = null;
    }
  }

  playVideo(): void {
    this.showVideo = true;
  }

  closeVideo(): void {
    this.showVideo = false;
  }

  proceedToDonation(amount: number | null): void {
    if (amount && amount > 0) {
      // Navegar para a página de pagamento com o valor selecionado
      this.router.navigate(['/payment'], { 
        queryParams: { amount: amount } 
      });
    }
  }

  donate(): void {
    if (this.selectedAmount && this.selectedAmount > 0) {
      this.proceedToDonation(this.selectedAmount);
    } else {
      alert('Por favor, selecione um valor para doação');
    }
  }
}
