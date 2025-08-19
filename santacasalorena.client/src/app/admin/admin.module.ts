// Modules
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { QuillModule } from 'ngx-quill';
import { AdminRoutingModule } from './admin-routing.module';
import { ReactiveFormsModule } from '@angular/forms';

// Components
import { AdminComponent } from './admin.component';
import { AdminHeaderComponent } from './components/admin-header/admin-header.component';
import { AdminFooterComponent } from './components/admin-footer/admin-footer.component';
import { AdminLayoutComponent } from './layout/admin-layout/admin-layout.component';

//Interceptors
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { NewsComponent } from './pages/news/news.component';
import { ContactsComponent } from './pages/contacts/contacts.component';
import { ServicesComponent } from './pages/services/services.component';
import { ConveniosComponent } from './pages/convenios/convenios.component';
import { EntityDialogComponent } from './components/entity-dialog/entity-dialog.component';
//import { AuthInterceptor } from '../guards/auth.interceptor';

@NgModule({
  declarations: [
    AdminComponent,
    AdminHeaderComponent,
    AdminFooterComponent,
    AdminLayoutComponent,
    DashboardComponent,
    NewsComponent,
    ContactsComponent,
    ServicesComponent,
    ConveniosComponent,
    EntityDialogComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    AdminRoutingModule,
    QuillModule.forRoot()
  ],
  providers: [
    //{
    //  provide: HTTP_INTERCEPTORS,
    //  useClass: AuthInterceptor, multi: true
    //}
  ]
})
export class AdminModule { }
