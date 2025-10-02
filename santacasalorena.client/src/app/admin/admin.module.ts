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
import { NewsCardComponent } from './components/news-card/news-card.component';

// Banner Management Components
import { BannerListComponent } from './pages/banners/banner-list/banner-list.component';
import { BannerFormComponent } from './pages/banners/banner-form/banner-form.component';
import { BannerCardComponent } from './components/banner-card/banner-card.component';

// Contact Management Components
import { ContactListComponent } from './pages/contacts/contact-list/contact-list.component';
import { ContactDetailComponent } from './pages/contacts/contact-detail/contact-detail.component';
import { ContactCardComponent } from './components/contact-card/contact-card.component';

// Convenios Management Components
import { ConveniosListComponent } from './pages/convenios/convenios-list/convenios-list.component';
import { ConveniosFormComponent } from './pages/convenios/convenios-form/convenios-form.component';
import { ConveniosCardComponent } from './components/convenios-card/convenios-card.component';

// Provider Management Components
import { ProviderListComponent } from './pages/providers/provider-list/provider-list.component';
import { ProviderFormComponent } from './pages/providers/provider-form/provider-form.component';
import { ProviderCardComponent } from './components/provider-card/provider-card.component';

// Transparency Portal Components
import { TransparencyListComponent } from './pages/transparency/transparency-list/transparency-list.component';
import { TransparencyFormComponent } from './pages/transparency/transparency-form/transparency-form.component';
import { TransparencyCardComponent } from './components/transparency-card/transparency-card.component';

// User Management Components
import { UserListComponent } from './pages/users/user-list/user-list.component';
import { UserFormComponent } from './pages/users/user-form/user-form.component';
import { UserCardComponent } from './components/user-card/user-card.component';

// Shared Components
import { ConfirmDialogComponent } from './components/confirm-dialog/confirm-dialog.component';
import { LoadingSpinnerComponent } from './components/loading-spinner/loading-spinner.component';
import { DataTableComponent } from './components/data-table/data-table.component';
import { FormFieldComponent } from './components/form-field/form-field.component';
import { ImageUploaderComponent } from './components/image-uploader/image-uploader.component';

// Interceptors
import { AuthInterceptor } from '../guards/auth.interceptor';

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
    NewsCardComponent,
    
    // Banners
    BannerListComponent,
    BannerFormComponent,
    BannerCardComponent,
    
    // Contacts
    ContactListComponent,
    ContactDetailComponent,
    ContactCardComponent,
    
    // Convenios
    ConveniosListComponent,
    ConveniosFormComponent,
    ConveniosCardComponent,
    
    // Providers
    ProviderListComponent,
    ProviderFormComponent,
    ProviderCardComponent,
    
    // Transparency
    TransparencyListComponent,
    TransparencyFormComponent,
    TransparencyCardComponent,
    
    // Users
    UserListComponent,
    UserFormComponent,
    
    // Card Components
    UserCardComponent,
    TransparencyCardComponent,
    ProviderCardComponent,
    ConveniosCardComponent,
    BannerCardComponent,
    ContactCardComponent,
    NewsCardComponent,
    
    // Shared
    ConfirmDialogComponent,
    LoadingSpinnerComponent,
    DataTableComponent,
    FormFieldComponent,
    ImageUploaderComponent
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
