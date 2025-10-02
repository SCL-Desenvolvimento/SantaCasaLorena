import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-admin-layout',
  standalone: false,
  templateUrl: './admin-layout.component.html',
  styleUrls: ['./admin-layout.component.css']
})
export class AdminLayoutComponent implements OnInit {
  sidebarCollapsed = false;
  currentRoute = '';
  pageTitle = '';
  breadcrumbs: string[] = [];

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        this.updatePageInfo(event.url);
      });
    
    // Initialize with current route
    this.updatePageInfo(this.router.url);
  }

  toggleSidebar(): void {
    this.sidebarCollapsed = !this.sidebarCollapsed;
  }

  private updatePageInfo(url: string): void {
    this.currentRoute = url;
    
    // Extract page title and breadcrumbs from route data
    const routeSegments = url.split('/').filter(segment => segment);
    this.breadcrumbs = routeSegments.map(segment => this.formatBreadcrumb(segment));
    
    // Set page title based on route
    this.pageTitle = this.getPageTitle(url);
  }

  private formatBreadcrumb(segment: string): string {
    const breadcrumbMap: { [key: string]: string } = {
      'admin': 'Administração',
      'dashboard': 'Dashboard',
      'news': 'Notícias',
      'banners': 'Banners',
      'contacts': 'Contatos',
      'convenios': 'Convênios',
      'providers': 'Prestadores',
      'transparency': 'Transparência',
      'users': 'Usuários',
      'new': 'Novo',
      'edit': 'Editar'
    };
    
    return breadcrumbMap[segment] || segment;
  }

  private getPageTitle(url: string): string {
    const titleMap: { [key: string]: string } = {
      '/admin/dashboard': 'Dashboard',
      '/admin/news': 'Gerenciar Notícias',
      '/admin/news/new': 'Nova Notícia',
      '/admin/banners': 'Gerenciar Banners',
      '/admin/banners/new': 'Novo Banner',
      '/admin/contacts': 'Gerenciar Contatos',
      '/admin/convenios': 'Gerenciar Convênios',
      '/admin/convenios/new': 'Novo Convênio',
      '/admin/providers': 'Gerenciar Prestadores',
      '/admin/providers/new': 'Novo Prestador',
      '/admin/transparency': 'Portal da Transparência',
      '/admin/transparency/new': 'Novo Item',
      '/admin/users': 'Gerenciar Usuários',
      '/admin/users/new': 'Novo Usuário'
    };
    
    // Check for edit routes
    if (url.includes('/edit/')) {
      const entity = url.split('/')[2];
      return `Editar ${this.formatBreadcrumb(entity)}`;
    }
    
    return titleMap[url] || 'Administração';
  }
}
