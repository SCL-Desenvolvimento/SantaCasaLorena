import { Component, OnInit } from '@angular/core';
import { News } from '../../models/news';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-news-detail',
  standalone: false,
  templateUrl: './news-detail.component.html',
  styleUrl: './news-detail.component.css'
})
export class NewsDetailComponent implements OnInit {
  news: News | null = null;
  relatedNews: News[] = [];
  loading = true;
  error = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    //private newsService: NewsService
  ) { }

  ngOnInit(): void {
    this.loadNewsDetail();
    this.loadRelatedNews();
  }

  loadNewsDetail(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    //this.newsService.getNewsById(id).subscribe({
    //  next: (res) => {
    //    this.news = res;
    //    this.loading = false;
    //  },
    //  error: () => {
    //    this.error = 'Notícia não encontrada';
    //    this.loading = false;
    //  }
    //});
  }

  loadRelatedNews(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    //this.newsService.getRelatedNews().subscribe({
    //  next: (res: NewsResponse) => {
    //    this.relatedNews = res.news.filter(n => n.id !== id);
    //  }
    //});
  }

  formatDate(date: string | undefined): string {
    if (!date) return '';

    return new Date(date).toLocaleDateString('pt-BR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  goBack(): void {
    this.router.navigate(['/noticias']);
  }

  share(network: string): void {
    const shareUrl = window.location.href;
    const shareTitle = this.news?.title || 'Notícia da Santa Casa de Lorena';

    const links: Record<string, string> = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
      twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareTitle)}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`,
      email: `mailto:?subject=${encodeURIComponent(shareTitle)}&body=${encodeURIComponent(shareUrl)}`
    };

    window.open(links[network], '_blank');
  }
}
