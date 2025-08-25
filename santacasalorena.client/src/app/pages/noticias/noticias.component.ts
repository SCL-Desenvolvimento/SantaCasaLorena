import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { News } from '../../models/news';
import { NewsService } from '../../services/news.service';
import { environment } from '../../../environments/environment';

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

  constructor(private newsService: NewsService) { }

  ngOnInit() {
    this.fetchNews();
  }

  fetchNews() {
    this.loading = true;
    this.newsService.getAll().subscribe({
      next: (response) => {
        this.news = response.map(n => ({
          ...n,
          imageUrl: `${environment.imageServerUrl}${n.imageUrl}`
        }));
        this.applyFilters();
      },
      error: () => {
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
        item.description.toLowerCase().includes(term) ||
        item.content.toLowerCase().includes(term)
      );
    }

    this.filteredNews = filtered;
  }

  categories(): string[] {
    return ['all', ...new Set(this.news.map(item => item.category))];
  }

  formatDate(dateString: string | undefined): string {
    if (!dateString)
      return '';

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
