import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

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
    FaleConoscoComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
