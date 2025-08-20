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
        { name: 'Sobre a Santa Casa', path: '/sobre' },
        { name: 'Humanização', path: '/humanizacao' },
        { name: 'Ações Sociais e Ambientais', path: '/sociais' },
        { name: 'Programa Nacional de Segurança do Paciente', path: '/seguranca' },
        { name: 'Portal da Transparência', path: '/transparencia' }
      ]
    },
    {
      name: 'Instalações',
      open: false,
      children: [
        { name: 'Pronto Atendimento SUS', path: '/pronto-atendimento' },
        { name: 'Hotelaria', path: '/hotelaria' },
        { name: 'Clínica Emília', path: '/clinica-emilia' },
        { name: 'Centro de Diagnóstico por Imagem', path: '/diagnostico-imagem' },
        { name: 'Unidade de Internação', path: '/unidade-internacao' },
        { name: 'Particular / Convênio', path: '/particular-convenio' }
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
