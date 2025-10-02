import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-admin-header',
  standalone: false,
  templateUrl: './admin-header.component.html',
  styleUrls: ['./admin-header.component.css']
})
export class AdminHeaderComponent {
  @Input() pageTitle = '';
  @Input() breadcrumbs: string[] = [];
  @Output() toggleSidebar = new EventEmitter<void>();

  showNotifications = false;
  showUserMenu = false;

  notifications = [
    {
      id: 1,
      title: 'Nova mensagem de contato',
      message: 'João Silva enviou uma nova mensagem',
      time: '5 min atrás',
      read: false,
      type: 'message'
    },
    {
      id: 2,
      title: 'Notícia publicada',
      message: 'A notícia "Novo serviço disponível" foi publicada',
      time: '1 hora atrás',
      read: false,
      type: 'success'
    },
    {
      id: 3,
      title: 'Backup realizado',
      message: 'Backup automático concluído com sucesso',
      time: '2 horas atrás',
      read: true,
      type: 'info'
    }
  ];

  get unreadNotifications(): number {
    return this.notifications.filter(n => !n.read).length;
  }

  onToggleSidebar(): void {
    this.toggleSidebar.emit();
  }

  toggleNotifications(): void {
    this.showNotifications = !this.showNotifications;
    this.showUserMenu = false;
  }

  toggleUserMenu(): void {
    this.showUserMenu = !this.showUserMenu;
    this.showNotifications = false;
  }

  markAsRead(notificationId: number): void {
    const notification = this.notifications.find(n => n.id === notificationId);
    if (notification) {
      notification.read = true;
    }
  }

  markAllAsRead(): void {
    this.notifications.forEach(n => n.read = true);
  }

  logout(): void {
    // Implement logout logic
    console.log('Logout clicked');
  }
}
