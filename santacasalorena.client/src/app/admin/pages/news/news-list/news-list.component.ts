import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { News } from '../../../../models/news';
import { NewsService } from '../../../../services/news.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-news-list',
  standalone: false,
  templateUrl: './news-list.component.html',
  styleUrls: ['./news-list.component.css']
})
export class NewsListComponent implements OnInit {
  loading = true;
  news: News[] = [];
  filteredNews: News[] = [];

  // Filters
  searchTerm = '';
  statusFilter = 'all'; // all, published, draft
  categoryFilter = 'all';
  sortBy = 'createdAt';
  sortOrder: 'asc' | 'desc' = 'desc';

  // Pagination
  currentPage = 1;
  itemsPerPage = 10;
  totalItems = 0;

  // Selection
  selectedItems: string[] = [];
  selectAll = false;

  categories = [
    'Saúde',
    'Educação',
    'Infraestrutura',
    'Meio Ambiente',
    'Cultura',
    'Esporte',
    'Assistência Social'
  ];

  constructor(private router: Router, private newsService: NewsService) { }

  ngOnInit(): void {
    this.loadNews();
  }

  loadNews(): void {
    this.loading = true;
    this.newsService.getAll().subscribe({
      next: (data: News[]) => {
        this.news = data;
        this.applyFilters();
        this.loading = false;
      },
      error: (error: HttpErrorResponse) => {
        console.error('Erro ao carregar notícias:', error);
        alert('Erro ao carregar notícias. Por favor, tente novamente.');
        this.loading = false;
      }
    });
  }

  applyFilters(): void {
    let filtered = [...this.news];

    // Search filter
    if (this.searchTerm) {
      filtered = filtered.filter(item =>
        item.title.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        (item.description && item.description.toLowerCase().includes(this.searchTerm.toLowerCase())) ||
        (item.content && item.content.toLowerCase().includes(this.searchTerm.toLowerCase())) ||
        (item.category && item.category.toLowerCase().includes(this.searchTerm.toLowerCase())) ||
        (item.tags && item.tags.some(tag => tag.toLowerCase().includes(this.searchTerm.toLowerCase())))
      );
    }

    // Status filter
    if (this.statusFilter !== 'all') {
      filtered = filtered.filter(item =>
        this.statusFilter === 'published' ? item.isPublished : !item.isPublished
      );
    }

    // Category filter
    if (this.categoryFilter !== 'all') {
      filtered = filtered.filter(item => item.category === this.categoryFilter);
    }

    // Sort
    filtered.sort((a, b) => {
      let aValue: any = (a as any)[this.sortBy];
      let bValue: any = (b as any)[this.sortBy];

      // Handle undefined or null values for sorting
      if (aValue === undefined || aValue === null) aValue = '';
      if (bValue === undefined || bValue === null) bValue = '';

      if (typeof aValue === 'string') aValue = aValue.toLowerCase();
      if (typeof bValue === 'string') bValue = bValue.toLowerCase();

      if (aValue < bValue) return this.sortOrder === 'asc' ? -1 : 1;
      if (aValue > bValue) return this.sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    this.filteredNews = filtered;
    this.totalItems = filtered.length;
    this.currentPage = 1;
  }

  get paginatedNews(): News[] {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    return this.filteredNews.slice(start, end);
  }

  get totalPages(): number {
    return Math.ceil(this.totalItems / this.itemsPerPage);
  }

  onSearch(): void {
    this.applyFilters();
  }

  onFilterChange(): void {
    this.currentPage = 1; // Reset page when filters change
    this.applyFilters();
  }

  onSort(field: string): void {
    if (this.sortBy === field) {
      this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortBy = field;
      this.sortOrder = 'desc'; // Default to descending for new sort field
    }
    this.applyFilters();
  }

  onPageChange(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  onItemsPerPageChange(): void {
    this.currentPage = 1;
    this.applyFilters(); // Re-apply filters to adjust pagination
  }

  toggleSelectAll(): void {
    if (this.selectAll) {
      this.selectedItems = this.paginatedNews
        .map(item => item.id)
        .filter((id): id is string => id !== undefined);
    } else {
      this.selectedItems = [];
    }
  }

  toggleItemSelection(id: string | undefined): void {
    if (id) {
      const index = this.selectedItems.indexOf(id);
      if (index > -1) {
        this.selectedItems.splice(index, 1);
      } else {
        this.selectedItems.push(id);
      }
      this.selectAll = this.selectedItems.length === this.paginatedNews.length && this.paginatedNews.length > 0;
    }
    else return;
  }

  isSelected(id: string | undefined): boolean {
    if (id)
      return this.selectedItems.includes(id);
    else
      return false;
  }

  createNews(): void {
    this.router.navigate(['/admin/news/new']);
  }

  editNews(id: string | undefined): void {
    if (id)
      this.router.navigate(['/admin/news/edit', id]);
  }

  // MÉTODO CORRIGIDO: Visualizar notícia
  viewNews(newsItem: News): void {
    if (newsItem.id) {
      // Abre em nova aba usando apenas o ID
      const url = this.router.createUrlTree(['/news', newsItem.id]);
      const fullUrl = window.location.origin + url.toString();
      window.open(fullUrl, '_blank');
    }
  }

  togglePublishStatus(id: string | undefined): void {
    if (id) {
      const newsItem = this.news.find(item => item.id === id);
      if (newsItem) {
        const newStatus = !newsItem.isPublished;
        this.newsService.updateNewsPublishStatus(id, newStatus).subscribe({
          next: () => {
            newsItem.isPublished = newStatus;
            newsItem.publishedAt = newStatus ? new Date().toISOString() : undefined;
            this.applyFilters();
            alert(`Notícia ${newsItem.title} ${newStatus ? 'publicada' : 'despublicada'} com sucesso!`);
          },
          error: (error: HttpErrorResponse) => {
            console.error('Erro ao atualizar status de publicação da notícia:', error);
            alert(`Erro ao atualizar status de publicação: ${error.error?.message || error.message}`);
          }
        });
      }
    }
  }

  deleteNews(id: string | undefined): void {
    if (id) {
      if (confirm('Tem certeza que deseja excluir esta notícia?')) {
        this.newsService.delete(id).subscribe({
          next: () => {
            this.news = this.news.filter(item => item.id !== id);
            this.applyFilters();
            alert('Notícia excluída com sucesso!');
          },
          error: (error: HttpErrorResponse) => {
            console.error('Erro ao excluir notícia:', error);
            alert(`Erro ao excluir notícia: ${error.error?.message || error.message}`);
          }
        });
      }
    }
  }

  bulkDelete(): void {
    if (this.selectedItems.length === 0) return;

    if (confirm(`Tem certeza que deseja excluir ${this.selectedItems.length} notícia(s)?`)) {
      let successfulDeletions = 0;
      let failedDeletions = 0;

      const deleteNext = (index: number) => {
        if (index < this.selectedItems.length) {
          const idToDelete = this.selectedItems[index];
          this.newsService.delete(idToDelete).subscribe({
            next: () => {
              successfulDeletions++;
              deleteNext(index + 1);
            },
            error: (error: HttpErrorResponse) => {
              console.error(`Erro ao excluir notícia ${idToDelete}:`, error);
              failedDeletions++;
              deleteNext(index + 1);
            }
          });
        } else {
          // All deletions attempted
          if (failedDeletions === 0) {
            alert(`${successfulDeletions} notícia(s) excluída(s) com sucesso!`);
          } else if (successfulDeletions > 0) {
            alert(`${successfulDeletions} notícia(s) excluída(s), mas ${failedDeletions} falharam.`);
          } else {
            alert('Nenhuma notícia foi excluída devido a erros.');
          }
          this.selectedItems = [];
          this.selectAll = false;
          this.loadNews(); // Reload news to reflect changes
        }
      };
      deleteNext(0);
    }
  }

  bulkPublish(): void {
    if (this.selectedItems.length === 0) return;

    if (confirm(`Tem certeza que deseja publicar ${this.selectedItems.length} notícia(s)?`)) {
      let successfulPublishes = 0;
      let failedPublishes = 0;

      const publishNext = (index: number) => {
        if (index < this.selectedItems.length) {
          const idToPublish = this.selectedItems[index];
          this.newsService.updateNewsPublishStatus(idToPublish, true).subscribe({
            next: () => {
              successfulPublishes++;
              publishNext(index + 1);
            },
            error: (error: HttpErrorResponse) => {
              console.error(`Erro ao publicar notícia ${idToPublish}:`, error);
              failedPublishes++;
              publishNext(index + 1);
            }
          });
        } else {
          if (failedPublishes === 0) {
            alert(`${successfulPublishes} notícia(s) publicada(s) com sucesso!`);
          } else if (successfulPublishes > 0) {
            alert(`${successfulPublishes} notícia(s) publicada(s), mas ${failedPublishes} falharam.`);
          } else {
            alert('Nenhuma notícia foi publicada devido a erros.');
          }
          this.selectedItems = [];
          this.selectAll = false;
          this.loadNews();
        }
      };
      publishNext(0);
    }
  }

  bulkUnpublish(): void {
    if (this.selectedItems.length === 0) return;

    if (confirm(`Tem certeza que deseja despublicar ${this.selectedItems.length} notícia(s)?`)) {
      let successfulUnpublishes = 0;
      let failedUnpublishes = 0;

      const unpublishNext = (index: number) => {
        if (index < this.selectedItems.length) {
          const idToUnpublish = this.selectedItems[index];
          this.newsService.updateNewsPublishStatus(idToUnpublish, false).subscribe({
            next: () => {
              successfulUnpublishes++;
              unpublishNext(index + 1);
            },
            error: (error: HttpErrorResponse) => {
              console.error(`Erro ao despublicar notícia ${idToUnpublish}:`, error);
              failedUnpublishes++;
              unpublishNext(index + 1);
            }
          });
        } else {
          if (failedUnpublishes === 0) {
            alert(`${successfulUnpublishes} notícia(s) despublicada(s) com sucesso!`);
          } else if (successfulUnpublishes > 0) {
            alert(`${successfulUnpublishes} notícia(s) despublicada(s), mas ${failedUnpublishes} falharam.`);
          } else {
            alert('Nenhuma notícia foi despublicada devido a erros.');
          }
          this.selectedItems = [];
          this.selectAll = false;
          this.loadNews();
        }
      };
      unpublishNext(0);
    }
  }

  formatDate(dateString: string | undefined): string {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  getMin(a: number, b: number): number {
    return Math.min(a, b);
  }
}
