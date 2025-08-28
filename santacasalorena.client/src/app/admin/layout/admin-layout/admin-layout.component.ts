import { Component, OnInit, signal, inject } from '@angular/core';
import { Router } from '@angular/router';

// Services
import { AgreementService } from '../../../services/agreement.service';
import { HomeBannerService } from '../../../services/home-banner.service';
import { NewsService } from '../../../services/news.service';
import { ProviderService } from '../../../services/provider.service';
import { TransparencyPortalService } from '../../../services/transparency-portal.service';
import { UserService } from '../../../services/user.service';
import { AuthService } from '../../../services/auth.service';

// Models
import { User } from '../../../models/user';
import { News } from '../../../models/news';
import { Contact } from '../../../models/contact';
import { Stats } from '../../../models/stats';
import { Agreement } from '../../../models/agreement';
import { HomeBanner } from '../../../models/homeBanner';
import { Providers } from '../../../models/provider';
import { TransparencyPortal } from '../../../models/transparencyPortal';
import { environment } from '../../../../environments/environment';

type Tab =
  | 'dashboard'
  | 'news'
  | 'convenios'
  | 'contacts'
  | 'homeBanner'
  | 'patientManual'
  | 'provider'
  | 'specialty'
  | 'transparencyPortal'
  | 'user';

@Component({
  selector: 'app-admin-layout',
  standalone: false,
  templateUrl: './admin-layout.component.html',
  styleUrl: './admin-layout.component.css'
})
export class AdminLayoutComponent implements OnInit {
  private router = inject(Router);

  // Injeção dos serviços
  private newsService = inject(NewsService);
  private agreementService = inject(AgreementService);
  private homeBannerService = inject(HomeBannerService);
  private providerService = inject(ProviderService);
  private transparencyService = inject(TransparencyPortalService);
  private userService = inject(UserService);
  private authService = inject(AuthService);
  // TODO: futuramente criar ContactService para não deixar contatos mockados.

  // Estados com Signals
  activeTab = signal<Tab>('dashboard');
  user = signal<User | null>(null);
  stats = signal<Stats>({
    totalNews: 0,
    totalServices: 0,
    totalConvenios: 0,
    unreadContacts: 0
  });

  news = signal<News[]>([]);
  convenios = signal<Agreement[]>([]);
  contacts = signal<Contact[]>([]);
  homeBanners = signal<HomeBanner[]>([]);
  providers = signal<Providers[]>([]);
  transparencyPortal = signal<TransparencyPortal[]>([]);
  users = signal<User[]>([]);

  editingItem = signal<any | null>(null);
  isDialogOpen = signal(false);
  formData = signal<any>({});

  ngOnInit() {
    this.loadAllData();
  }

  /** 🔄 Carrega todos os dados das entidades reais (API) */
  private loadAllData() {
    this.newsService.getAll().subscribe(res => {
      res = res.map(news => ({
        ...news,
        imageUrl: `${environment.imageServerUrl}${news.imageUrl}`,
      }))
      this.news.set(res);
      this.updateStats();
    });

    this.agreementService.getAll().subscribe(res => {
      res = res.map(conv => ({
        ...conv,
        imageUrl: `${environment.imageServerUrl}${conv.imageUrl}`,
      }))

      this.convenios.set(res);
      this.updateStats();
    });

    this.homeBannerService.getAll().subscribe(res => {
      res = res.map(ban => ({
        ...ban,
        desktopImageUrl: `${environment.imageServerUrl}${ban.desktopImageUrl}`,
        mobileImageUrl: `${environment.imageServerUrl}${ban.mobileImageUrl}`,
        tabletImageUrl: `${environment.imageServerUrl}${ban.tabletImageUrl}`
      }))
      this.homeBanners.set(res);
    });

    this.providerService.getAll().subscribe(res => {
      res = res.map(prov => ({
        ...prov,
        imageUrl: `${environment.imageServerUrl}${prov.imageUrl}`,
      }))

      this.providers.set(res);
    });

    this.transparencyService.getAll().subscribe(res => {
      res = res.map(trans => ({
        ...trans,
        fileUrl: `${environment.imageServerUrl}${trans.fileUrl}`,
      }))
      this.transparencyPortal.set(res);
    });

    this.userService.getUser().subscribe(res => {
      res = res.map(usu => ({
        ...usu,
        photoUrl: `${environment.imageServerUrl}${usu.photoUrl}`,
      }))

      this.users.set(res);
    });

    // TODO: substituir por contactService quando implementado
    // this.contactService.getAll().subscribe(res => {
    //   this.contacts.set(res);
    //   this.updateStats();
    // });
  }

  private updateStats() {
    this.stats.set({
      totalNews: this.news().length,
      totalServices: 0, // aqui entraria se você tiver ServiceService
      totalConvenios: this.convenios().length,
      unreadContacts: this.contacts().filter(c => !c.is_read).length
    });
  }

  setActiveTab(tab: Tab) {
    this.activeTab.set(tab);
  }

  async handleLogout() {
    try {
      this.authService.logout();
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
          case 'news': this.newsService.update(item.id, data).subscribe(() => this.loadAllData()); break;
          case 'convenios': this.agreementService.update(item.id, data).subscribe(() => this.loadAllData()); break;
          case 'homeBanner': this.homeBannerService.update(item.id, data).subscribe(() => this.loadAllData()); break;
          case 'provider': this.providerService.update(item.id, data).subscribe(() => this.loadAllData()); break;
          case 'transparencyPortal': this.transparencyService.update(item.id, data).subscribe(() => this.loadAllData()); break;
          case 'user': this.userService.updateUser(item.id, data).subscribe(() => this.loadAllData()); break;
        }
      } else {
        switch (type) {
          case 'news': this.newsService.create(data).subscribe(() => this.loadAllData()); break;
          case 'convenios': this.agreementService.create(data).subscribe(() => this.loadAllData()); break;
          case 'homeBanner': this.homeBannerService.create(data).subscribe(() => this.loadAllData()); break;
          case 'provider': this.providerService.create(data).subscribe(() => this.loadAllData()); break;
          case 'transparencyPortal': this.transparencyService.create(data).subscribe(() => this.loadAllData()); break;
          case 'user': this.userService.createUser(data).subscribe(() => this.loadAllData()); break;
        }
      }

      this.closeDialog();
    } catch (err) {
      console.error('Erro ao salvar:', err);
      alert('Erro ao salvar. Tente novamente.');
    }
  }

  handleDelete(type: string, id: string) {
    if (!confirm('Tem certeza que deseja excluir?')) return;

    switch (type) {
      case 'news': this.newsService.delete(id).subscribe(() => this.loadAllData()); break;
      case 'convenios': this.agreementService.delete(id).subscribe(() => this.loadAllData()); break;
      case 'homeBanner': this.homeBannerService.delete(id).subscribe(() => this.loadAllData()); break;
      case 'provider': this.providerService.delete(id).subscribe(() => this.loadAllData()); break;
      case 'transparencyPortal': this.transparencyService.delete(id).subscribe(() => this.loadAllData()); break;
      case 'user': this.userService.deleteUser(id).subscribe(() => this.loadAllData()); break;
      // TODO: quando implementar ContactService -> case 'contacts': this.contactService.delete(id)...
    }
  }

  markAsRead(id: string) {
    // TODO: implementar via ContactService
    console.warn("TODO: criar ContactService e implementar markAsRead");
  }
}
