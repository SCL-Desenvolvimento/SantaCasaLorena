import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { LOCALE_ID, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { QuillModule } from 'ngx-quill';
import localePt from '@angular/common/locales/pt';
registerLocaleData(localePt);

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { HomeComponent } from './pages/home/home.component';
import { InstitucionalComponent } from './pages/institucional/institucional.component';
import { InstalacoesComponent } from './pages/instalacoes/instalacoes.component';
import { ServicosComponent } from './pages/servicos/servicos.component';
import { NoticiasComponent } from './pages/noticias/noticias.component';
import { FaleConoscoComponent } from './pages/fale-conosco/fale-conosco.component';
import { PublicLayoutComponent } from './layout/public-layout/public-layout.component';
//import { AuthInterceptor } from './guards/auth.interceptor';
import { registerLocaleData } from '@angular/common';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    HomeComponent,
    InstitucionalComponent,
    InstalacoesComponent,
    ServicosComponent,
    NoticiasComponent,
    FaleConoscoComponent,
    PublicLayoutComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    QuillModule.forRoot(),
  ],
  providers: [
    //{
    //  provide: HTTP_INTERCEPTORS,
    //  useClass: AuthInterceptor, multi: true
    //},
    {
      provide: LOCALE_ID, useValue: 'pt'
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
