import { Component, OnInit, signal, inject } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../../../services/api';
import { User } from '../../../models/user';
import { News } from '../../../models/news';
import { Contact } from '../../../models/contact';
import { Stats } from '../../../models/stats';
import { Agreement } from '../../../models/agreement';
type Tab = 'dashboard' | 'news' | 'services' | 'convenios' | 'contacts';

@Component({
  selector: 'app-admin-layout',
  standalone: false,
  templateUrl: './admin-layout.component.html',
  styleUrl: './admin-layout.component.css'
})
export class AdminLayoutComponent implements OnInit {
  private apiService = inject(ApiService);
  private router = inject(Router);

  // Estados com Signals (Angular 16+)
  activeTab = signal<Tab>('dashboard');
  user = signal<User | null>(null);
  stats = signal<Stats>({ totalNews: 0, totalServices: 0, totalConvenios: 0, unreadContacts: 0 });

  news = signal<News[]>([]);
  //services = signal<Service[]>([]);
  convenios = signal<Agreement[]>([]);
  contacts = signal<Contact[]>([]);

  editingItem = signal<any | null>(null);
  isDialogOpen = signal(false);
  formData = signal<any>({});

  ngOnInit() {
    this.loadMockData();
  }

  private loadMockData() {
    this.news.set([
      { id: '1', title: 'Notícia A', description: 'Resumo...', content: 'Conteúdo...', imageUrl: '', category: 'Parcerias', isPublished: true, createdAt: new Date().toISOString() }
    ]);

    //this.services.set([
    //  { id: 1, name: 'Pronto Atendimento', description: 'Atendimento 24h', category: 'Emergência', icon: 'clock', is_active: true }
    //]);

    this.convenios.set([
      { id: '1', name: 'Unimed', imageUrl: '' }
    ]);

    this.contacts.set([
      { id: '1', name: 'João', email: 'joao@email.com', subject: 'Dúvida', message: 'Mensagem...', is_read: false, createdAt: new Date().toISOString() }
    ]);

    this.updateStats();
  }

  private updateStats() {
    this.stats.set({
      totalNews: this.news().length,
      totalServices: 0, /*this.services().length*/
      totalConvenios: this.convenios().length,
      unreadContacts: this.contacts().filter(c => !c.is_read).length
    });
  }

  setActiveTab(tab: Tab) {
    this.activeTab.set(tab);
  }

  async handleLogout() {
    try {
      await this.apiService.logout().subscribe();
      this.router.navigate(['/admin/login']);
    } catch (err) {
      console.error('Erro no logout:', err);
    }
  }

  openEditDialog(type: string, item: any = null) {
    this.editingItem.set(item);
    this.formData.set(item ? { ...item } : {});
    this.isDialogOpen.set(true);
  }

  closeDialog() {
    this.isDialogOpen.set(false);
    this.editingItem.set(null);
    this.formData.set({});
  }

  async handleSave(data: any) {
    try {
      const type = this.activeTab();
      const item = this.editingItem();

      if (item) {
        switch (type) {
          case 'news': this.apiService.updateNews(item.id, data).subscribe(); break;
          //case 'services': this.apiService.updateService(item.id, data).subscribe(); break;
          case 'convenios': this.apiService.updateConvenio(item.id, data).subscribe(); break;
        }
      } else {
        switch (type) {
          case 'news': this.apiService.createNews(data).subscribe(); break;
          //case 'services': this.apiService.createService(data).subscribe(); break;
          case 'convenios': this.apiService.createConvenio(data).subscribe(); break;
        }
      }

      this.closeDialog();
      this.loadMockData();
    } catch (err) {
      console.error('Erro ao salvar:', err);
      alert('Erro ao salvar. Tente novamente.');
    }
  }

  handleDelete(type: string, id: string) {
    if (!confirm('Tem certeza que deseja excluir?')) return;

    switch (type) {
      case 'news': this.apiService.deleteNews(id).subscribe(); break;
      case 'services': this.apiService.deleteService(id).subscribe(); break;
      case 'convenios': this.apiService.deleteConvenio(id).subscribe(); break;
      case 'contacts': this.apiService.deleteContact(id).subscribe(); break;
    }

    this.loadMockData();
  }

  markAsRead(id: string) {
    this.apiService.markContactAsRead(id).subscribe(() => this.loadMockData());
  }
}
