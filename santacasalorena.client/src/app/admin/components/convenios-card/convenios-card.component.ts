import { Component, Input } from '@angular/core';
import { Agreement } from '../../../models/agreement';

@Component({
  selector: 'app-convenios-card',
  standalone: false,
  templateUrl: './convenios-card.component.html',
  styleUrls: ['./convenios-card.component.css']
})
export class ConveniosCardComponent {
  @Input() convenio!: Agreement; // Usar a interface Agreement

  getStatusBadgeClass(status: string): string {
    switch (status) {
      case 'active': return 'bg-success';
      case 'inactive': return 'bg-danger';
      case 'pending': return 'bg-warning';
      default: return 'bg-secondary';
    }
  }

  getStatusText(status: string): string {
    switch (status) {
      case 'active': return 'Ativo';
      case 'inactive': return 'Inativo';
      case 'pending': return 'Pendente';
      default: return 'Desconhecido';
    }
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('pt-BR');
  }
}
