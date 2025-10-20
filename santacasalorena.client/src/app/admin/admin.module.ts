import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { QuillModule } from 'ngx-quill';
import { AdminRoutingModule } from './admin-routing.module';
import { HTTP_INTERCEPTORS } from '@angular/common/http';

// Layout Components
import { AdminComponent } from './admin.component';
import { AdminLayoutComponent } from './layout/admin-layout/admin-layout.component';
import { AdminHeaderComponent } from './components/admin-header/admin-header.component';
import { AdminFooterComponent } from './components/admin-footer/admin-footer.component';
import { AdminSidebarComponent } from './components/admin-sidebar/admin-sidebar.component';

// Dashboard Components
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { StatsCardComponent } from './components/stats-card/stats-card.component';
import { RecentItemsComponent } from './components/recent-items/recent-items.component';

// News Management Components
import { NewsListComponent } from './pages/news/news-list/news-list.component';
import { NewsFormComponent } from './pages/news/news-form/news-form.component';
import { NewsViewComponent } from './pages/news/news-view/news-view.component';

// Banner Management Components
import { BannerListComponent } from './pages/banners/banner-list/banner-list.component';
import { BannerFormComponent } from './pages/banners/banner-form/banner-form.component';
// Contact Management Components
import { ContactListComponent } from './pages/contacts/contact-list/contact-list.component';

// Convenios Management Components
import { ConveniosListComponent } from './pages/convenios/convenios-list/convenios-list.component';
import { ConveniosFormComponent } from './pages/convenios/convenios-form/convenios-form.component';

// Provider Management Components
import { ProviderListComponent } from './pages/providers/provider-list/provider-list.component';
import { ProviderFormComponent } from './pages/providers/provider-form/provider-form.component';

// Transparency Portal Components
import { TransparencyListComponent } from './pages/transparency/transparency-list/transparency-list.component';
import { TransparencyFormComponent } from './pages/transparency/transparency-form/transparency-form.component';

// User Management Components
import { UserListComponent } from './pages/users/user-list/user-list.component';
import { UserFormComponent } from './pages/users/user-form/user-form.component';

// Shared Components
import { LoadingSpinnerComponent } from './components/loading-spinner/loading-spinner.component';

// Interceptors
import { AuthInterceptor } from '../guards/auth.interceptor';
import { ContactNewComponent } from './pages/contacts/contact-new/contact-new.component';

@NgModule({
  declarations: [
    // Layout
    AdminComponent,
    AdminLayoutComponent,
    AdminHeaderComponent,
    AdminFooterComponent,
    AdminSidebarComponent,
    
    // Dashboard
    DashboardComponent,
    StatsCardComponent,
    RecentItemsComponent,
    
    // News
    NewsListComponent,
    NewsFormComponent,
    NewsViewComponent,
    
    // Banners
    BannerListComponent,
    BannerFormComponent,
    
    // Contacts
    ContactListComponent,
    
    // Convenios
    ConveniosListComponent,
    ConveniosFormComponent,
    
    // Providers
    ProviderListComponent,
    ProviderFormComponent,
    
    // Transparency
    TransparencyListComponent,
    TransparencyFormComponent,
    
    // Users
    UserListComponent,
    UserFormComponent,
        
    // Shared
    LoadingSpinnerComponent,
    ContactNewComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    AdminRoutingModule,
    QuillModule.forRoot()
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    }
  ]
})
export class AdminModule { }
