import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

interface News {
  id: number;
  title: string;
  category?: string;
  summary?: string;
  content?: string;
  image_url?: string;
}

interface Service {
  title: string;
  description: string;
}

@Component({
  selector: 'app-home',
  standalone: false,
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  hero = {
    bgGradient: 'linear-gradient(135deg, #0d6efd, #6610f2)',
    title: 'Atendimento de qualidade e um serviço de',
    highlight: 'excelência!',
    hashtag: '#150AnosporVocê',
    subtitle: 'Estrutura de ponta e profissionais qualificados. De portas e braços abertos pra você!',
    buttons: [
      { label: 'Resultado de Exames', icon: 'bi-calendar', class: 'btn btn-danger' },
      { label: 'Fale Conosco', icon: 'bi-telephone', class: 'btn btn-outline-light' }
    ]
  };

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

  news: any[] = [];
  placeholderNews = [1, 2, 3];

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.http.get<any>('/api/news?per_page=3').subscribe(res => this.news = res.news || []);
  }
}
