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
    { name: 'Institucional', path: '/institucional' },
    { name: 'Instalações', path: '/instalacoes' },
    { name: 'Serviços', path: '/servicos' },
    { name: 'Notícias', path: '/noticias' },
    { name: 'Fale Conosco', path: '/fale-conosco' }
  ];

  constructor(private router: Router) { }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  navigateTo(path: string) {
    this.router.navigate([path]);
    this.isMenuOpen = false; // Fecha o menu no mobile
  }
}
