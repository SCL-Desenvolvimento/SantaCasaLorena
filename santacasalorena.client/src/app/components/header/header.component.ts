import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: false,
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  isMenuOpen = false;

  menuItems = [
    { name: 'Home', path: '/' },
    {
      name: 'Institucional',
      open: false,
      children: [
        { name: 'Sobre a Santa Casa', path: '/institucional/sobre' },
        { name: 'Humanização', path: '/institucional/humanizacao' },
        { name: 'Ações Sociais e Ambientais', path: '/institucional/acoes-sociais' },
        { name: 'Programa Nacional de Segurança do Paciente', path: '/institucional/programa-seguranca' },
        { name: 'Portal da Transparência', path: '/institucional/portal-transparencia' }
      ]
    },
    {
      name: 'Instalações',
      open: false,
      children: [
        { name: 'Pronto Atendimento SUS', path: '/instalacoes/pronto-atendimento' },
        { name: 'Hotelaria', path: '/instalacoes/hotelaria' },
        { name: 'Clínica Emília', path: '/instalacoes/clinica-emilia' },
        { name: 'Centro de Diagnóstico por Imagem', path: '/instalacoes/diagnostico-imagem' },
        { name: 'Unidade de Internação', path: '/instalacoes/unidade-internacao' },
        { name: 'Particular / Convênio', path: '/instalacoes/particular-convenio' }
      ]
    },
    {
      name: 'Serviços',
      open: false,
      children: [
        { name: 'Convênios', path: '/servicos/convenios' },
        { name: 'Especialidades', path: '/servicos/especialidades' },
        { name: 'Capacidade de Instalação e Produção', path: '/servicos/capacidade' },
        { name: 'Manual do Paciente e Visitante', path: '/servicos/manual' }
      ]
    },
    { name: 'Notícias', path: '/noticias' },
    { name: 'Fale Conosco', path: '/fale-conosco' }
  ];

  constructor(private router: Router) { }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  navigateTo(path: string) {
    this.router.navigate([path]);
    this.isMenuOpen = false; // Fecha menu no mobile
  }
}
