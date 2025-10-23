import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { News } from '../../../../models/news';
import { NewsService } from '../../../../services/news.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-news-view',
  standalone: false,
  templateUrl: './news-view.component.html',
  styleUrls: ['./news-view.component.css']
})
export class NewsViewComponent implements OnInit {
  news: News | undefined;
  loading = true;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private newsService: NewsService
  ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const newsId = params.get('id');
      if (newsId) {
        this.loadNews(newsId);
      } else {
        // Handle case where no ID is provided, e.g., redirect to list or show error
        this.router.navigate(['/admin/news']);
      }
    });
  }

  loadNews(id: string): void {
    this.loading = true;
    this.newsService.getById(id).subscribe({
      next: (data: News) => {
        this.news = data;
        this.loading = false;
      },
      error: (error: HttpErrorResponse) => {
        console.error('Erro ao carregar notícia:', error);
        alert('Erro ao carregar notícia. Por favor, tente novamente.');
        this.loading = false;
        this.router.navigate(['/admin/news']); // Redirect to list on error
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/admin/news']);
  }

  editNews(id: string | undefined): void {
    if (id) {
      this.router.navigate(['/admin/news/edit', id]);
    }
  }

  formatDate(dateString: string | undefined): string {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  }
}

