import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Importar todos os componentes de página
import { HomeComponent } from './pages/home/home.component';
import { SobreComponent } from './pages/sobre/sobre.component';
import { InstalacoesComponent } from './pages/instalacoes/instalacoes.component';
import { ServicosComponent } from './pages/servicos/servicos.component';
import { NoticiasComponent } from './pages/noticias/noticias.component';
import { FaleConoscoComponent } from './pages/fale-conosco/fale-conosco.component';
import { PublicLayoutComponent } from './layout/public-layout/public-layout.component';
import { AdminLayoutComponent } from './admin/layout/admin-layout/admin-layout.component';
import { HumanizacaoComponent } from './pages/humanizacao/humanizacao.component';
import { AcoesSociaisAmbientaisComponent } from './pages/acoes-sociais-ambientais/acoes-sociais-ambientais.component';
import { ProgramaNacionalSegurancaComponent } from './pages/programa-nacional-seguranca/programa-nacional-seguranca.component';
import { PortalTransparenciaComponent } from './pages/portal-transparencia/portal-transparencia.component';
//import { AuthGuard } from './guards/auth.guard';
//import { RoleGuard } from './guards/role.guard';

const routes: Routes = [
  {
    path: '',
    component: PublicLayoutComponent,
    children: [
      { path: '', component: HomeComponent },
      { path: 'sobre', component: SobreComponent },
      { path: 'instalacoes', component: InstalacoesComponent },
      { path: 'servicos', component: ServicosComponent },
      { path: 'noticias', component: NoticiasComponent },
      { path: 'fale-conosco', component: FaleConoscoComponent },
      { path: 'humanizacao', component: HumanizacaoComponent },
      { path: 'sociais', component: AcoesSociaisAmbientaisComponent },
      { path: 'seguranca', component: ProgramaNacionalSegurancaComponent },
      { path: 'transparencia', component: PortalTransparenciaComponent },
    ]
  },
  {
    path: 'admin',
    component: AdminLayoutComponent,
    //canActivate: [AuthGuard, RoleGuard],
    //data: { expectedRole: 'admin' },
    children: [
      {
        path: '',
        loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule)
      }
    ]
  },
  { path: '**', redirectTo: '', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
