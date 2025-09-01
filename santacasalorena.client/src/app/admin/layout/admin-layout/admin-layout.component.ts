import { Component, OnInit, signal, inject } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';

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
  private toastr = inject(ToastrService);

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

  private loadAllData() {
    this.newsService.getAll().subscribe({
      next: res => {
        res = res.map(news => ({
          ...news,
          imageUrl: `${environment.imageServerUrl}${news.imageUrl}`,
        }));
        this.news.set(res);
        this.updateStats();
        this.toastr.success('Notícias carregadas com sucesso!');
      },
      error: () => this.toastr.error('Erro ao carregar notícias')
    });

    this.agreementService.getAll().subscribe({
      next: res => {
        res = res.map(conv => ({
          ...conv,
          imageUrl: `${environment.imageServerUrl}${conv.imageUrl}`,
        }));
        this.convenios.set(res);
        this.updateStats();
        this.toastr.success('Convênios carregados com sucesso!');
      },
      error: () => this.toastr.error('Erro ao carregar convênios')
    });

    this.homeBannerService.getAll().subscribe({
      next: res => {
        res = res.map(ban => ({
          ...ban,
          desktopImageUrl: `${environment.imageServerUrl}${ban.desktopImageUrl}`,
          mobileImageUrl: `${environment.imageServerUrl}${ban.mobileImageUrl}`,
          tabletImageUrl: `${environment.imageServerUrl}${ban.tabletImageUrl}`
        }));
        this.homeBanners.set(res);
        this.toastr.success('Banners carregados com sucesso!');
      },
      error: () => this.toastr.error('Erro ao carregar banners')
    });

    this.providerService.getAll().subscribe({
      next: res => {
        res = res.map(prov => ({
          ...prov,
          imageUrl: `${environment.imageServerUrl}${prov.imageUrl}`,
        }));
        this.providers.set(res);
        this.toastr.success('Prestadores carregados com sucesso!');
      },
      error: () => this.toastr.error('Erro ao carregar prestadores')
    });

    this.transparencyService.getAll().subscribe({
      next: res => {
        res = res.map(trans => ({
          ...trans,
          fileUrl: `${environment.imageServerUrl}${trans.fileUrl}`,
        }));
        this.transparencyPortal.set(res);
        this.toastr.success('Portais de transparência carregados com sucesso!');
      },
      error: () => this.toastr.error('Erro ao carregar portais de transparência')
    });

    this.userService.getUser().subscribe({
      next: res => {
        res = res.map(usu => ({
          ...usu,
          photoUrl: `${environment.imageServerUrl}${usu.photoUrl}`,
        }));
        this.users.set(res);
        this.toastr.success('Usuários carregados com sucesso!');
      },
      error: () => this.toastr.error('Erro ao carregar usuários')
    });
  }

  private updateStats() {
    this.stats.set({
      totalNews: this.news().length,
      totalServices: 0,
      totalConvenios: this.convenios().length,
      unreadContacts: this.contacts().filter(c => !c.is_read).length
    });
  }

  setActiveTab(tab: Tab) {
    this.activeTab.set(tab);
  }

  async handleLogout() {
    const result = await Swal.fire({
      title: 'Tem certeza?',
      text: 'Deseja realmente sair do sistema?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sim, sair',
      cancelButtonText: 'Cancelar'
    });

    if (result.isConfirmed) {
      try {
        this.authService.logout();
        this.router.navigate(['/login']);
        this.toastr.success('Logout realizado com sucesso!');
      } catch {
        this.toastr.error('Erro ao fazer logout');
      }
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
          case 'news': this.newsService.update(item.id, data).subscribe(() => { this.loadAllData(); this.toastr.success('Notícia atualizada!'); }); break;
          case 'convenios': this.agreementService.update(item.id, data).subscribe(() => { this.loadAllData(); this.toastr.success('Convênio atualizado!'); }); break;
          case 'homeBanner': this.homeBannerService.update(item.id, data).subscribe(() => { this.loadAllData(); this.toastr.success('Banner atualizado!'); }); break;
          case 'provider': this.providerService.update(item.id, data).subscribe(() => { this.loadAllData(); this.toastr.success('Prestador atualizado!'); }); break;
          case 'transparencyPortal': this.transparencyService.update(item.id, data).subscribe(() => { this.loadAllData(); this.toastr.success('Portal de transparência atualizado!'); }); break;
          case 'user': this.userService.updateUser(item.id, data).subscribe(() => { this.loadAllData(); this.toastr.success('Usuário atualizado!'); }); break;
        }
      } else {
        switch (type) {
          case 'news': this.newsService.create(data).subscribe(() => { this.loadAllData(); this.toastr.success('Notícia criada!'); }); break;
          case 'convenios': this.agreementService.create(data).subscribe(() => { this.loadAllData(); this.toastr.success('Convênio criado!'); }); break;
          case 'homeBanner': this.homeBannerService.create(data).subscribe(() => { this.loadAllData(); this.toastr.success('Banner criado!'); }); break;
          case 'provider': this.providerService.create(data).subscribe(() => { this.loadAllData(); this.toastr.success('Prestador criado!'); }); break;
          case 'transparencyPortal': this.transparencyService.create(data).subscribe(() => { this.loadAllData(); this.toastr.success('Portal de transparência criado!'); }); break;
          case 'user': this.userService.createUser(data).subscribe(() => { this.loadAllData(); this.toastr.success('Usuário criado!'); }); break;
        }
      }

      this.closeDialog();
    } catch {
      this.toastr.error('Erro ao salvar. Tente novamente.');
    }
  }

  async handleDelete(type: string, id: string) {
    const result = await Swal.fire({
      title: 'Tem certeza?',
      text: 'Não será possível reverter!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sim, excluir',
      cancelButtonText: 'Cancelar'
    });

    if (!result.isConfirmed) return;

    switch (type) {
      case 'news': this.newsService.delete(id).subscribe(() => { this.loadAllData(); this.toastr.success('Notícia excluída!'); }); break;
      case 'convenios': this.agreementService.delete(id).subscribe(() => { this.loadAllData(); this.toastr.success('Convênio excluído!'); }); break;
      case 'homeBanner': this.homeBannerService.delete(id).subscribe(() => { this.loadAllData(); this.toastr.success('Banner excluído!'); }); break;
      case 'provider': this.providerService.delete(id).subscribe(() => { this.loadAllData(); this.toastr.success('Prestador excluído!'); }); break;
      case 'transparencyPortal': this.transparencyService.delete(id).subscribe(() => { this.loadAllData(); this.toastr.success('Portal de transparência excluído!'); }); break;
      case 'user': this.userService.deleteUser(id).subscribe(() => { this.loadAllData(); this.toastr.success('Usuário excluído!'); }); break;
    }
  }

  markAsRead(id: string) {
    console.warn("TODO: criar ContactService e implementar markAsRead");
  }
}
