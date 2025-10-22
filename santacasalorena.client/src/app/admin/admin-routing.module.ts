import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Pages
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { NewsListComponent } from './pages/news/news-list/news-list.component';
import { NewsFormComponent } from './pages/news/news-form/news-form.component';
import { NewsViewComponent } from './pages/news/news-view/news-view.component';
import { BannerListComponent } from './pages/banners/banner-list/banner-list.component';
import { BannerFormComponent } from './pages/banners/banner-form/banner-form.component';
import { ContactListComponent } from './pages/contacts/contact-list/contact-list.component';
import { ConveniosListComponent } from './pages/convenios/convenios-list/convenios-list.component';
import { ConveniosFormComponent } from './pages/convenios/convenios-form/convenios-form.component';
import { ProviderListComponent } from './pages/providers/provider-list/provider-list.component';
import { ProviderFormComponent } from './pages/providers/provider-form/provider-form.component';
import { TransparencyListComponent } from './pages/transparency/transparency-list/transparency-list.component';
import { TransparencyFormComponent } from './pages/transparency/transparency-form/transparency-form.component';
import { UserListComponent } from './pages/users/user-list/user-list.component';
import { UserFormComponent } from './pages/users/user-form/user-form.component';
import { ContactNewComponent } from './pages/contacts/contact-new/contact-new.component';

const routes: Routes = [
  // Dashboard
  {
    path: 'dashboard',
    component: DashboardComponent,
    data: { title: 'Dashboard', breadcrumb: 'Dashboard' }
  },

  // News Management
  {
    path: 'news',
    component: NewsListComponent,
    data: { title: 'Gerenciar Notícias', breadcrumb: 'Notícias' }
  },
  {
    path: 'news/new',
    component: NewsFormComponent,
    data: { title: 'Nova Notícia', breadcrumb: 'Nova Notícia' }
  },
  {
    path: 'news/edit/:id',
    component: NewsFormComponent,
    data: { title: 'Editar Notícia', breadcrumb: 'Editar Notícia' }
  },
  {
    path: 'news/view/:id',
    component: NewsViewComponent,
    data: { title: 'Visualizar Notícia', breadcrumb: 'Visualizar Notícia' }
  },

  // Banner Management
  {
    path: 'banners',
    component: BannerListComponent,
    data: { title: 'Gerenciar Banners', breadcrumb: 'Banners' }
  },
  {
    path: 'banners/new',
    component: BannerFormComponent,
    data: { title: 'Novo Banner', breadcrumb: 'Novo Banner' }
  },
  {
    path: 'banners/edit/:id',
    component: BannerFormComponent,
    data: { title: 'Editar Banner', breadcrumb: 'Editar Banner' }
  },

  // Contact Management
  {
    path: 'contacts',
    component: ContactListComponent,
    data: { title: 'Gerenciar Contatos', breadcrumb: 'Contatos' }
  },
  {
    path: 'contacts/new',
    component: ContactNewComponent,
    data: { title: 'Novo Contatos', breadcrumb: 'Novo Contatos' }
  },
  {
    path: 'contacts/edit/:id',
    component: ContactNewComponent,
    data: { title: 'Editar Contatos', breadcrumb: 'Editar Contatos' }
  },

  // Convenios Management
  {
    path: 'convenios',
    component: ConveniosListComponent,
    data: { title: 'Gerenciar Convênios', breadcrumb: 'Convênios' }
  },
  {
    path: 'convenios/new',
    component: ConveniosFormComponent,
    data: { title: 'Novo Convênio', breadcrumb: 'Novo Convênio' }
  },
  {
    path: 'convenios/edit/:id',
    component: ConveniosFormComponent,
    data: { title: 'Editar Convênio', breadcrumb: 'Editar Convênio' }
  },

  // Provider Management
  {
    path: 'providers',
    component: ProviderListComponent,
    data: { title: 'Gerenciar Prestadores', breadcrumb: 'Prestadores' }
  },
  {
    path: 'providers/new',
    component: ProviderFormComponent,
    data: { title: 'Novo Prestador', breadcrumb: 'Novo Prestador' }
  },
  {
    path: 'providers/edit/:id',
    component: ProviderFormComponent,
    data: { title: 'Editar Prestador', breadcrumb: 'Editar Prestador' }
  },

  // Transparency Portal Management
  {
    path: 'transparency',
    component: TransparencyListComponent,
    data: { title: 'Portal da Transparência', breadcrumb: 'Transparência' }
  },
  {
    path: 'transparency/new',
    component: TransparencyFormComponent,
    data: { title: 'Novo Item', breadcrumb: 'Novo Item' }
  },
  {
    path: 'transparency/edit/:id',
    component: TransparencyFormComponent,
    data: { title: 'Editar Item', breadcrumb: 'Editar Item' }
  },

  // User Management
  {
    path: 'users',
    component: UserListComponent,
    data: { title: 'Gerenciar Usuários', breadcrumb: 'Usuários' }
  },
  {
    path: 'users/new',
    component: UserFormComponent,
    data: { title: 'Novo Usuário', breadcrumb: 'Novo Usuário' }
  },
  {
    path: 'users/edit/:id',
    component: UserFormComponent,
    data: { title: 'Editar Usuário', breadcrumb: 'Editar Usuário' }
  },

  // Default redirect
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
