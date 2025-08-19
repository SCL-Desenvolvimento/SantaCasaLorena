import { Component, Input } from '@angular/core';
import { Stats } from '../../../models/stats';
import { News } from '../../../models/news';
import { Contact } from '../../../models/contact';

@Component({
  selector: 'app-dashboard',
  standalone: false,
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
  @Input() stats: Stats = {
    totalNews: 0,
    totalServices: 0,
    totalConvenios: 0,
    unreadContacts: 0
  };
  @Input() news: News[] = [];
  @Input() contacts: Contact[] = [];
  statCards = [
    { label: 'Total de Notícias', value: this.stats.totalNews, icon: 'bi bi-newspaper', bgClass: 'bg-news', textClass: 'text-primary' },
    { label: 'Total de Serviços', value: this.stats.totalServices, icon: 'bi bi-gear', bgClass: 'bg-services', textClass: 'text-purple' },
    { label: 'Total de Convênios', value: this.stats.totalConvenios, icon: 'bi bi-people', bgClass: 'bg-convenios', textClass: 'text-success' },
    { label: 'Contatos Não Lidos', value: this.stats.unreadContacts, icon: 'bi bi-chat-dots', bgClass: 'bg-contacts', textClass: 'text-danger' }
  ];

  formatDate(dateString: string | undefined): string {
    if (!dateString) return '';

    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  }
}
