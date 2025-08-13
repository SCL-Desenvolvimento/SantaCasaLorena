import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Importar todos os componentes de página
import { HomeComponent } from './pages/home/home.component';
import { InstitucionalComponent } from './pages/institucional/institucional.component';
import { InstalacoesComponent } from './pages/instalacoes/instalacoes.component';
import { ServicosComponent } from './pages/servicos/servicos.component';
import { NoticiasComponent } from './pages/noticias/noticias.component';
import { FaleConoscoComponent } from './pages/fale-conosco/fale-conosco.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'institucional', component: InstitucionalComponent },
  { path: 'instalacoes', component: InstalacoesComponent },
  { path: 'servicos', component: ServicosComponent },
  { path: 'noticias', component: NoticiasComponent },
  { path: 'fale-conosco', component: FaleConoscoComponent },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
