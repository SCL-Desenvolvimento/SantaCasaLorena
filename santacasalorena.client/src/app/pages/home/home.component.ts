import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-home',
  standalone: false,
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {

  heroSlides = [
    { image: '../../../assets/img/carrossel/Desktop_-1920x540-3.png' },
    { image: '../../../assets/img/carrossel/Desktop_-1920x540-5.png' },
    { image: '../../../assets/img/carrossel/Desktop_-1920x540-3.png' }
  ];

  currentSlide = 0;
  intervalId: any;

  heroServices = [
    { icon: 'bi-clock', title: 'Pronto Atendimento', description: 'Mais de 25 mil casos por ano...', color: 'bg-danger' },
    { icon: 'bi-building', title: 'Hotelaria', description: 'Satisfazendo todas as necessidades...', color: 'bg-primary' },
    { icon: 'bi-stethoscope', title: 'Clínica Emília', description: 'Equipe médica especializada...', color: 'bg-success' },
    { icon: 'bi-heart', title: 'Centro de Diagnóstico', description: 'Planejadas para oferecer...', color: 'bg-purple' }
  ];

  stats = [
    { number: '150+', label: 'Anos de História', icon: 'bi-award' },
    { number: '25k+', label: 'Atendimentos/Ano', icon: 'bi-people' },
    { number: '24h', label: 'Pronto Socorro', icon: 'bi-clock' },
    { number: '100%', label: 'Dedicação', icon: 'bi-heart' }
  ];

  convenios = {
    title: 'Convênios',
    description: 'Uma série de convênios atendidos...',
    items: [
      { name: 'Convênio 1', logo: '' },
      { name: 'Convênio 2', logo: '' },
      { name: 'Convênio 3', logo: '' },
      { name: 'Convênio 4', logo: '' },
      { name: 'Convênio 5', logo: '' },
      { name: 'Convênio 6', logo: '' }
    ]
  };

  newsSection = { title: 'Últimas Notícias' };

  cta = {
    bgGradient: 'linear-gradient(135deg, #0d6efd, #198754)',
    title: 'Manual do Paciente e Visitante',
    description: 'Este manual foi desenvolvido para facilitar...',
    buttonLabel: 'Clique aqui para acessar'
  };

  // Apenas placeholders para simular notícias locais
  news: any[] = [];
  placeholderNews = [1, 2, 3];

  ngOnInit(): void {
    this.startAutoSlide();
  }

  startAutoSlide(): void {
    this.intervalId = setInterval(() => {
      this.nextSlide();
    }, 5000); // troca a cada 5s
  }

  nextSlide(): void {
    this.currentSlide = (this.currentSlide + 1) % this.heroSlides.length;
  }

  goToSlide(index: number): void {
    this.currentSlide = index;
    clearInterval(this.intervalId);
    this.startAutoSlide(); // reinicia o timer ao clicar
  }
}
