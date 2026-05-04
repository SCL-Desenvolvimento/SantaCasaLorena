import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { News } from '../../../../models/news';
import { NewsService } from '../../../../services/news.service';
import { HttpErrorResponse } from '@angular/common/http';
import Swal from 'sweetalert2';
import { ToastrService } from 'ngx-toastr';

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
    private newsService: NewsService,
    private toastr: ToastrService // ✅ Toastr pronto para usar
  ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const newsId = params.get('id');
      if (newsId) {
        this.loadNews(newsId);
      } else {
        // Id não informado
        Swal.fire({
          icon: 'warning',
          title: 'ID inválido',
          text: 'Nenhuma notícia selecionada.',
          confirmButtonText: 'Voltar'
        }).then(() => {
          this.router.navigate(['/admin/news']);
        });
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
        Swal.fire({
          icon: 'error',
          title: 'Erro ao carregar notícia',
          text: 'Ocorreu um problema ao buscar a notícia. Tente novamente mais tarde.',
          confirmButtonText: 'OK'
        });
        this.loading = false;
        this.router.navigate(['/admin/news']);
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/admin/news']);
  }

  editNews(id: string | undefined): void {
    if (id) {
      this.router.navigate(['/admin/news/edit', id]);
    } else {
      this.toastr.warning('ID da notícia inválido!');
    }
  }

  formatDate(dateString: string | undefined): string {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      year: 'numeric', month: 'long', day: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });
  }
}
