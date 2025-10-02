import { Component, OnInit } from '@angular/core';

interface StatCard {
  label: string;
  value: number;
  icon: string;
  bgClass: string;
  textClass: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

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
  selector: 'app-dashboard',
  standalone: false,
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  loading = true;
  
  statCards: StatCard[] = [
    {
      label: 'Total de Notícias',
      value: 45,
      icon: 'bi-newspaper',
      bgClass: 'bg-primary',
      textClass: 'text-primary',
      trend: { value: 12, isPositive: true }
    },
    {
      label: 'Contatos Não Lidos',
      value: 8,
      icon: 'bi-chat-dots',
      bgClass: 'bg-danger',
      textClass: 'text-danger',
      trend: { value: 3, isPositive: false }
    },
    {
      label: 'Total de Convênios',
      value: 23,
      icon: 'bi-people',
      bgClass: 'bg-success',
      textClass: 'text-success',
      trend: { value: 5, isPositive: true }
    },
    {
      label: 'Banners Ativos',
      value: 6,
      icon: 'bi-image',
      bgClass: 'bg-warning',
      textClass: 'text-warning',
      trend: { value: 1, isPositive: true }
    }
  ];

  recentNews: RecentItem[] = [
    {
      id: 1,
      title: 'Nova parceria com hospital regional',
      subtitle: 'Ampliação dos serviços de saúde',
      date: '2024-01-15',
      status: 'Publicado',
      statusClass: 'success',
      route: '/admin/news/edit/1'
    },
    {
      id: 2,
      title: 'Atualização do sistema de agendamento',
      subtitle: 'Melhorias na interface do usuário',
      date: '2024-01-14',
      status: 'Rascunho',
      statusClass: 'warning',
      route: '/admin/news/edit/2'
    },
    {
      id: 3,
      title: 'Campanha de vacinação 2024',
      subtitle: 'Cronograma e locais de atendimento',
      date: '2024-01-13',
      status: 'Publicado',
      statusClass: 'success',
      route: '/admin/news/edit/3'
    }
  ];

  recentContacts: RecentItem[] = [
    {
      id: 1,
      title: 'Maria Silva',
      subtitle: 'Dúvida sobre agendamento de consulta',
      date: '2024-01-15T14:30:00',
      status: 'Não Lido',
      statusClass: 'danger',
      route: '/admin/contacts/1'
    },
    {
      id: 2,
      title: 'João Santos',
      subtitle: 'Solicitação de segunda via de cartão',
      date: '2024-01-15T10:15:00',
      status: 'Lido',
      statusClass: 'success',
      route: '/admin/contacts/2'
    },
    {
      id: 3,
      title: 'Ana Costa',
      subtitle: 'Reclamação sobre atendimento',
      date: '2024-01-14T16:45:00',
      status: 'Respondido',
      statusClass: 'info',
      route: '/admin/contacts/3'
    }
  ];

  quickActions = [
    {
      title: 'Nova Notícia',
      description: 'Criar uma nova notícia para publicação',
      icon: 'bi-plus-circle',
      route: '/admin/news/new',
      color: 'primary'
    },
    {
      title: 'Novo Banner',
      description: 'Adicionar um novo banner promocional',
      icon: 'bi-image',
      route: '/admin/banners/new',
      color: 'success'
    },
    {
      title: 'Novo Convênio',
      description: 'Cadastrar um novo convênio',
      icon: 'bi-people',
      route: '/admin/convenios/new',
      color: 'info'
    },
    {
      title: 'Ver Contatos',
      description: 'Gerenciar mensagens de contato',
      icon: 'bi-chat-dots',
      route: '/admin/contacts',
      color: 'warning'
    }
  ];

  ngOnInit(): void {
    // Simulate loading
    setTimeout(() => {
      this.loading = false;
    }, 1000);
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  }

  formatDateTime(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
}
