import { Component, Input } from '@angular/core';
import { TransparencyPortal } from '../../../models/transparencyPortal';

@Component({
  selector: 'app-transparency-card',
  standalone: false,
  templateUrl: './transparency-card.component.html',
  styleUrls: ['./transparency-card.component.css']
})
export class TransparencyCardComponent {
  @Input() item!: TransparencyPortal;

  getStatusBadgeClass(status: string): string {
    switch (status) {
      case 'published': return 'bg-success';
      case 'draft': return 'bg-warning';
      default: return 'bg-secondary';
    }
  }

  getStatusText(status: string): string {
    switch (status) {
      case 'published': return 'Publicado';
      case 'draft': return 'Rascunho';
      default: return 'Desconhecido';
    }
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('pt-BR');
  }
}

