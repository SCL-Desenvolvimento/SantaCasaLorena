import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

interface News {
  id: number;
  title: string;
  summary: string;
  content: string;
  author: string;
  category: string;
  image_url: string | null;
  createdAt: string;
}

@Component({
  selector: 'app-noticias',
  standalone: false,
  templateUrl: './noticias.component.html',
  styleUrl: './noticias.component.css'
})
export class NoticiasComponent implements OnInit {

  news: News[] = [];
  filteredNews: News[] = [];
  searchTerm: string = '';
  selectedCategory: string = 'all';
  currentPage: number = 1;
  totalPages: number = 1;
  loading: boolean = true;

  defaultNews: News[] = [
    {
      id: 1,
      title: "Santa Casa de Lorena amplia atendimentos do SUS em parceria com a Prefeitura",
      summary: "Com essa parceria, a instituição hospitalar passa a oferecer agendamentos de consultas especializadas e exames de diagnóstico...",
      content: "A Santa Casa de Lorena firmou uma importante parceria com a Prefeitura Municipal para ampliar significativamente os atendimentos pelo Sistema Único de Saúde (SUS). Esta iniciativa representa um marco na história da instituição e demonstra nosso compromisso contínuo com a saúde pública da região.",
      author: "Assessoria de Imprensa",
      category: "Parcerias",
      image_url: null,
      createdAt: "2024-01-15T10:00:00Z"
    },
    {
      id: 2,
      title: "Santa Casa de Lorena realiza cirurgia cardíaca inédita na região",
      summary: "Procedimento de revascularização do miocárdio com técnica minimamente invasiva",
      content: "A equipe de cirurgia cardiovascular da Santa Casa de Lorena realizou com sucesso um procedimento inédito na região: uma cirurgia de revascularização do miocárdio utilizando técnica minimamente invasiva. O procedimento representa um avanço significativo na cardiologia local.",
      author: "Dr. João Silva",
      category: "Medicina",
      image_url: null,
      createdAt: "2024-01-10T14:30:00Z"
    },
    {
      id: 3,
      title: "Santa Casa de Lorena conquista Selo 'Hospital Amigo do Idoso'",
      summary: "O Selo Inicial é o reflexo de um importante trabalho multiprofissional que busca incorporar maior qualidade e eficiência...",
      content: "A Santa Casa de Lorena recebeu o prestigioso Selo 'Hospital Amigo do Idoso', reconhecimento que atesta a qualidade do atendimento prestado à população idosa. Esta certificação é resultado do trabalho dedicado de nossa equipe multiprofissional.",
      author: "Direção Clínica",
      category: "Reconhecimentos",
      image_url: null,
      createdAt: "2024-01-05T09:15:00Z"
    },
    {
      id: 4,
      title: "Novo equipamento de ressonância magnética em funcionamento",
      summary: "Investimento em tecnologia de ponta para melhor diagnóstico por imagem",
      content: "A Santa Casa de Lorena inaugura seu novo equipamento de ressonância magnética de última geração, proporcionando diagnósticos mais precisos e rápidos para nossos pacientes. O investimento reforça nosso compromisso com a excelência médica.",
      author: "Departamento de Imagem",
      category: "Tecnologia",
      image_url: null,
      createdAt: "2024-01-01T16:00:00Z"
    }
  ];

  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.fetchNews();
  }

  fetchNews() {
    this.loading = true;
    this.http.get<any>(`/api/news?page=${this.currentPage}&per_page=6`).subscribe({
      next: (response) => {
        if (response && response.news && response.news.length > 0) {
          this.news = response.news;
          this.filteredNews = response.news;
          this.totalPages = response.pages || 1;
        } else {
          this.news = this.defaultNews;
          this.filteredNews = this.defaultNews;
          this.totalPages = 1;
        }
        this.applyFilters();
      },
      error: () => {
        this.news = this.defaultNews;
        this.filteredNews = this.defaultNews;
        this.totalPages = 1;
        this.applyFilters();
        this.loading = false;
      },
      complete: () => {
        this.loading = false;
      }
    });
  }

  applyFilters() {
    let filtered = this.news;

    if (this.selectedCategory !== 'all') {
      filtered = filtered.filter(item => item.category === this.selectedCategory);
    }

    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      filtered = filtered.filter(item =>
        item.title.toLowerCase().includes(term) ||
        item.summary.toLowerCase().includes(term) ||
        item.content.toLowerCase().includes(term)
      );
    }

    this.filteredNews = filtered;
  }

  categories(): string[] {
    return ['all', ...new Set(this.news.map(item => item.category))];
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  }

  getCategoryClass(category: string): string {
    const classes: { [key: string]: string } = {
      'Parcerias': 'badge bg-primary',
      'Medicina': 'badge bg-success',
      'Reconhecimentos': 'badge bg-warning text-dark',
      'Tecnologia': 'badge bg-purple',
      'Eventos': 'badge bg-danger'
    };
    return classes[category] || 'badge bg-secondary';
  }

  changePage(page: number) {
    this.currentPage = page;
    this.fetchNews();
  }
}
