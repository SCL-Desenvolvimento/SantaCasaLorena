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
  news: News[] = [];
  services: Service[] = [];
  placeholderNews = [1, 2, 3];

  heroServices = [
    {
      icon: 'bi-clock',
      title: "Pronto Atendimento",
      description: "Mais de 25 mil casos por ano, situações de urgência e emergência.",
      color: "bg-danger"
    },
    {
      icon: 'bi-building',
      title: "Hotelaria",
      description: "Satisfazendo todas as necessidades dos pacientes bem como a integridade física.",
      color: "bg-primary"
    },
    {
      icon: 'bi-stethoscope',
      title: "Clínica Emília",
      description: "Equipe médica especializada de alto nível técnico garantindo assim o atendimento com qualidade.",
      color: "bg-success"
    },
    {
      icon: 'bi-heart',
      title: "Centro de Diagnóstico",
      description: "Planejadas para oferecer aos nossos pacientes todo acolhimento e segurança necessários.",
      color: "bg-purple"
    }
  ];

  stats = [
    { number: "150+", label: "Anos de História", icon: "bi-award" },
    { number: "25k+", label: "Atendimentos/Ano", icon: "bi-people" },
    { number: "24h", label: "Pronto Socorro", icon: "bi-clock" },
    { number: "100%", label: "Dedicação", icon: "bi-heart" }
  ];

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.http.get<any>('/api/news?per_page=3').subscribe({
      next: res => this.news = res.news || [],
      error: err => console.error('Erro ao carregar notícias:', err)
    });

    this.http.get<any>('/api/services').subscribe({
      next: res => this.services = (res || []).slice(0, 4),
      error: err => console.error('Erro ao carregar serviços:', err)
    });
  }
}
