import { Component, Input } from '@angular/core';

interface RecentItem {
  id: number;
  title: string;
  subtitle?: string;
  date: string;
  status: string;
  statusClass: string;
  route?: string;
}

@Component({
  selector: 'app-recent-items',
  standalone: false,
  templateUrl: './recent-items.component.html',
  styleUrls: ['./recent-items.component.css']
})
export class RecentItemsComponent {
  @Input() items: RecentItem[] = [];
  @Input() showDate = true;
  @Input() dateFormat: 'date' | 'datetime' = 'date';
  @Input() emptyMessage = 'Nenhum item encontrado';
  @Input() maxItems = 5;

  get displayItems(): RecentItem[] {
    return this.items.slice(0, this.maxItems);
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    
    if (this.dateFormat === 'datetime') {
      return date.toLocaleString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    }
    
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  }

  getStatusBadgeClass(statusClass: string): string {
    const classMap: { [key: string]: string } = {
      'success': 'bg-success',
      'warning': 'bg-warning',
      'danger': 'bg-danger',
      'info': 'bg-info',
      'primary': 'bg-primary',
      'secondary': 'bg-secondary'
    };
    
    return classMap[statusClass] || 'bg-secondary';
  }
}
