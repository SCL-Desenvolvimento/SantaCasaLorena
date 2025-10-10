import { Component, OnInit } from '@angular/core';
import { NewsService } from '../../../services/news.service';
import { AgreementService } from '../../../services/agreement.service';
import { HomeBannerService } from '../../../services/home-banner.service';
import { News } from '../../../models/news';
import { Agreement } from '../../../models/agreement';
import { HomeBanner } from '../../../models/homeBanner';

interface StatCard {
  label: string;
  value: number;
  icon: string;
  bgClass: string;
  textClass: string;
  detailsLink?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

@Component({
  selector: 'app-dashboard',
  standalone: false,
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  loading = true;

  statCards: StatCard[] = [];

  recentNews: News[] = [];
  agreements: Agreement[] = [];
  banners: HomeBanner[] = [];

  recentContacts = [
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

  constructor(
    private newsService: NewsService,
    private agreementService: AgreementService,
    private homeBannerService: HomeBannerService
  ) { }

  ngOnInit(): void {
    this.loadDashboardData();
  }

  private loadDashboardData(): void {
    this.loading = true;

    Promise.all([
      this.newsService.getAll().toPromise(),
      this.agreementService.getAll().toPromise(),
      this.homeBannerService.getAll().toPromise()
    ])
      .then(([newsList, agreements, banners]) => {
        // 🔹 Notícias
        const sortedNews = [...(newsList || [])].sort((a, b) => {
          const dateA = new Date(a.publishedAt || a.createdAt || '').getTime();
          const dateB = new Date(b.publishedAt || b.createdAt || '').getTime();
          return dateB - dateA;
        });
        this.recentNews = sortedNews.slice(0, 3);

        // 🔹 Convênios
        this.agreements = agreements || [];

        // 🔹 Banners
        this.banners = banners || [];

        // 🔹 Estatísticas reais
        const totalNews = newsList?.length || 0;
        const publishedCount = newsList?.filter(n => n.isPublished)?.length || 0;

        const totalAgreements = this.agreements.length;
        const activeAgreements = this.agreements.filter(a => a.status === 'active').length;

        const totalBanners = this.banners.length;
        const activeBanners = this.banners.filter(b => b.isActive).length;

        this.statCards = [
          {
            label: 'Total de Notícias',
            value: totalNews,
            icon: 'bi-newspaper',
            bgClass: 'bg-primary',
            textClass: 'text-primary',
            detailsLink: '/admin/news',
            trend: { value: publishedCount, isPositive: true }
          },
          {
            label: 'Contatos Não Lidos',
            value: 8,
            icon: 'bi-chat-dots',
            bgClass: 'bg-danger',
            textClass: 'text-danger',
            detailsLink: '/admin/contacts',
            trend: { value: 3, isPositive: false }
          },
          {
            label: 'Total de Convênios',
            value: totalAgreements,
            icon: 'bi-people',
            bgClass: 'bg-success',
            textClass: 'text-success',
            detailsLink: '/admin/convenios',
            trend: { value: activeAgreements, isPositive: true }
          },
          {
            label: 'Banners Ativos',
            value: totalBanners,
            icon: 'bi-image',
            bgClass: 'bg-warning',
            textClass: 'text-warning',
            detailsLink: '/admin/banners',
            trend: { value: activeBanners, isPositive: true }
          }
        ];

        this.loading = false;
      })
      .catch((err) => {
        console.error('Erro ao carregar dados do dashboard:', err);
        this.loading = false;
      });
  }

  formatDate(dateString?: string): string {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  }

  formatDateTime(dateString?: string): string {
    if (!dateString) return '';
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
