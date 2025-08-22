import { Component, Input, Output, EventEmitter } from '@angular/core';
import { News } from '../../../models/news';

@Component({
  selector: 'app-news',
  standalone: false,
  templateUrl: './news.component.html',
  styleUrl: './news.component.css'
})
export class NewsComponent {
  @Input() news: News[] = [];
  @Output() createNews = new EventEmitter<void>();
  @Output() editNews = new EventEmitter<News>();
  @Output() deleteNews = new EventEmitter<string>();

  onCreateNews() {
    this.createNews.emit();
  }

  onEditNews(item: News) {
    this.editNews.emit(item);
  }

  onDeleteNews(id: string) {
    this.deleteNews.emit(id);
  }

  formatDate(dateString: string | undefined): string {
    if (!dateString) return '';

    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  }
}
