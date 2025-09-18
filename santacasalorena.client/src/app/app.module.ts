import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { LOCALE_ID, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { QuillModule } from 'ngx-quill';
import { ToastrModule } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import localePt from '@angular/common/locales/pt';
registerLocaleData(localePt);
import { RecaptchaModule } from "ng-recaptcha-2";

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { HomeComponent } from './pages/home/home.component';
import { SobreComponent } from './pages/sobre/sobre.component';
import { NoticiasComponent } from './pages/noticias/noticias.component';
import { FaleConoscoComponent } from './pages/fale-conosco/fale-conosco.component';
import { PublicLayoutComponent } from './layout/public-layout/public-layout.component';
import { AuthInterceptor } from './guards/auth.interceptor';
import { registerLocaleData } from '@angular/common';
import { NewsDetailComponent } from './pages/news-detail/news-detail.component';
import { HumanizacaoComponent } from './pages/humanizacao/humanizacao.component';
import { AcoesSociaisAmbientaisComponent } from './pages/acoes-sociais-ambientais/acoes-sociais-ambientais.component';
import { ProgramaNacionalSegurancaComponent } from './pages/programa-nacional-seguranca/programa-nacional-seguranca.component';
import { PortalTransparenciaComponent } from './pages/portal-transparencia/portal-transparencia.component';
import { ProntoAtendimentoComponent } from './pages/pronto-atendimento/pronto-atendimento.component';
import { HotelariaComponent } from './pages/hotelaria/hotelaria.component';
import { ClinicaEmiliaComponent } from './pages/clinica-emilia/clinica-emilia.component';
import { CentroDiagnosticoPorImagemComponent } from './pages/centro-diagnostico-por-imagem/centro-diagnostico-por-imagem.component';
import { UnidadesDeInternacaoComponent } from './pages/unidades-de-internacao/unidades-de-internacao.component';
import { ConveniosComponent } from './pages/convenios/convenios.component';
import { EspecialidadesComponent } from './pages/especialidades/especialidades.component';
import { CapacidadeInstalacaoEProducaoComponent } from './pages/capacidade-instalacao-e-producao/capacidade-instalacao-e-producao.component';
import { ManualDoPacienteEVisitantesComponent } from './pages/manual-do-paciente-e-visitante/manual-do-paciente-e-visitante.component';
import { EmendasComponent } from './pages/emendas/emendas.component';
import { LoginComponent } from './pages/login/login.component';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import { PaymentComponent } from './pages/payment/payment.component';
import { DoacoesComponent } from './pages/doacoes/doacoes.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    HomeComponent,
    HumanizacaoComponent,
    SobreComponent,
    NoticiasComponent,
    FaleConoscoComponent,
    PublicLayoutComponent,
    NewsDetailComponent,
    AcoesSociaisAmbientaisComponent,
    ProgramaNacionalSegurancaComponent,
    PortalTransparenciaComponent,
    ProntoAtendimentoComponent,
    HotelariaComponent,
    ClinicaEmiliaComponent,
    CentroDiagnosticoPorImagemComponent,
    UnidadesDeInternacaoComponent,
    ConveniosComponent,
    EspecialidadesComponent,
    CapacidadeInstalacaoEProducaoComponent,
    ManualDoPacienteEVisitantesComponent,
    EmendasComponent,
    LoginComponent,
    ForgotPasswordComponent,
    DoacoesComponent,
    PaymentComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    QuillModule.forRoot(),
    ToastrModule.forRoot({
      timeOut: 3000,
      positionClass: 'toast-bottom-right',
      preventDuplicates: true,
    }),
    RecaptchaModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    },
    {
      provide: LOCALE_ID, useValue: 'pt'
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
