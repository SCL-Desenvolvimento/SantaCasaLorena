import { Component, Input } from '@angular/core';

interface MenuItem {
  label: string;
  icon: string;
  route: string;
  badge?: number;
  children?: MenuItem[];
}

@Component({
  selector: 'app-admin-sidebar',
  standalone: false,
  templateUrl: './admin-sidebar.component.html',
  styleUrls: ['./admin-sidebar.component.css']
})
export class AdminSidebarComponent {
  @Input() collapsed = false;
  @Input() currentRoute = '';

  menuItems: MenuItem[] = [
    {
      label: 'Dashboard',
      icon: 'bi-speedometer2',
      route: '/admin/dashboard'
    },
    {
      label: 'Notícias',
      icon: 'bi-newspaper',
      route: '/admin/news',
      children: [
        { label: 'Listar Notícias', icon: 'bi-list-ul', route: '/admin/news' },
        { label: 'Nova Notícia', icon: 'bi-plus-circle', route: '/admin/news/new' }
      ]
    },
    {
      label: 'Banners',
      icon: 'bi-image',
      route: '/admin/banners',
      children: [
        { label: 'Listar Banners', icon: 'bi-list-ul', route: '/admin/banners' },
        { label: 'Novo Banner', icon: 'bi-plus-circle', route: '/admin/banners/new' }
      ]
    },
    {
      label: 'Contatos',
      icon: 'bi-chat-dots',
      route: '/admin/contacts'
    },
    {
      label: 'Convênios',
      icon: 'bi-people',
      route: '/admin/convenios',
      children: [
        { label: 'Listar Convênios', icon: 'bi-list-ul', route: '/admin/convenios' },
        { label: 'Novo Convênio', icon: 'bi-plus-circle', route: '/admin/convenios/new' }
      ]
    },
    {
      label: 'Prestadores',
      icon: 'bi-person-badge',
      route: '/admin/providers',
      children: [
        { label: 'Listar Prestadores', icon: 'bi-list-ul', route: '/admin/providers' },
        { label: 'Novo Prestador', icon: 'bi-plus-circle', route: '/admin/providers/new' }
      ]
    },
    {
      label: 'Transparência',
      icon: 'bi-eye',
      route: '/admin/transparency',
      children: [
        { label: 'Listar Itens', icon: 'bi-list-ul', route: '/admin/transparency' },
        { label: 'Novo Item', icon: 'bi-plus-circle', route: '/admin/transparency/new' }
      ]
    },
    {
      label: 'Usuários',
      icon: 'bi-person-gear',
      route: '/admin/users',
      children: [
        { label: 'Listar Usuários', icon: 'bi-list-ul', route: '/admin/users' },
        { label: 'Novo Usuário', icon: 'bi-plus-circle', route: '/admin/users/new' }
      ]
    }
  ];

  expandedItems: Set<string> = new Set();

  isActive(route: string): boolean {
    return this.currentRoute === route || this.currentRoute.startsWith(route + '/');
  }

  isParentActive(item: MenuItem): boolean {
    if (this.isActive(item.route)) return true;
    if (item.children) {
      return item.children.some(child => this.isActive(child.route));
    }
    return false;
  }

  toggleExpanded(itemLabel: string): void {
    if (this.expandedItems.has(itemLabel)) {
      this.expandedItems.delete(itemLabel);
    } else {
      this.expandedItems.add(itemLabel);
    }
  }

  isExpanded(itemLabel: string): boolean {
    return this.expandedItems.has(itemLabel);
  }
}
