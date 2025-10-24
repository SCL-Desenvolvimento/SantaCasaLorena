import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { News } from '../../../../models/news';
import { NewsService } from '../../../../services/news.service';
import { HttpErrorResponse } from '@angular/common/http';
import Swal from 'sweetalert2';
import { ToastrService } from 'ngx-toastr';

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

  constructor(
    private router: Router,
    private newsService: NewsService,
    private toastr: ToastrService
  ) { }

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
        this.toastr.error('Erro ao carregar notícias. Por favor, tente novamente.');
        this.loading = false;
      }
    });
  }

  applyFilters(): void {
    let filtered = [...this.news];

    if (this.searchTerm) {
      filtered = filtered.filter(item =>
        item.title.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        (item.description && item.description.toLowerCase().includes(this.searchTerm.toLowerCase())) ||
        (item.content && item.content.toLowerCase().includes(this.searchTerm.toLowerCase())) ||
        (item.category && item.category.toLowerCase().includes(this.searchTerm.toLowerCase())) ||
        (item.tags && item.tags.some(tag => tag.toLowerCase().includes(this.searchTerm.toLowerCase())))
      );
    }

    if (this.statusFilter !== 'all') {
      filtered = filtered.filter(item =>
        this.statusFilter === 'published' ? item.isPublished : !item.isPublished
      );
    }

    if (this.categoryFilter !== 'all') {
      filtered = filtered.filter(item => item.category === this.categoryFilter);
    }

    filtered.sort((a, b) => {
      let aValue: any = (a as any)[this.sortBy];
      let bValue: any = (b as any)[this.sortBy];

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
    this.currentPage = 1;
    this.applyFilters();
  }

  onSort(field: string): void {
    if (this.sortBy === field) {
      this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortBy = field;
      this.sortOrder = 'desc';
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
    this.applyFilters();
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
  }

  isSelected(id: string | undefined): boolean {
    return id ? this.selectedItems.includes(id) : false;
  }

  createNews(): void {
    this.router.navigate(['/admin/news/new']);
  }

  viewNews(id: string | undefined): void {
    if (id) this.router.navigate(['/admin/news/view', id]);
  }

  editNews(id: string | undefined): void {
    if (id) this.router.navigate(['/admin/news/edit', id]);
  }

  togglePublishStatus(id: string | undefined): void {
    if (!id) return;

    const newsItem = this.news.find(item => item.id === id);
    if (!newsItem) return;

    const newStatus = !newsItem.isPublished;
    const actionText = newStatus ? 'publicar' : 'despublicar';

    Swal.fire({
      title: `Deseja realmente ${actionText} esta notícia?`,
      text: newsItem.title,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sim',
      cancelButtonText: 'Cancelar'
    }).then(result => {
      if (result.isConfirmed) {
        this.newsService.updateNewsPublishStatus(id, newStatus).subscribe({
          next: () => {
            newsItem.isPublished = newStatus;
            newsItem.publishedAt = newStatus ? new Date().toISOString() : undefined;
            this.applyFilters();
            this.toastr.success(`Notícia ${newStatus ? 'publicada' : 'despublicada'} com sucesso!`);
          },
          error: (error: HttpErrorResponse) => {
            console.error('Erro ao atualizar status:', error);
            this.toastr.error(`Erro ao atualizar status: ${error.error?.message || error.message}`);
          }
        });
      }
    });
  }

  deleteNews(id: string | undefined): void {
    if (!id) return;

    Swal.fire({
      title: 'Tem certeza que deseja excluir esta notícia?',
      text: 'Esta ação não poderá ser desfeita!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sim, excluir',
      cancelButtonText: 'Cancelar'
    }).then(result => {
      if (result.isConfirmed) {
        this.newsService.delete(id).subscribe({
          next: () => {
            this.news = this.news.filter(item => item.id !== id);
            this.applyFilters();
            this.toastr.success('Notícia excluída com sucesso!');
          },
          error: (error: HttpErrorResponse) => {
            console.error('Erro ao excluir notícia:', error);
            this.toastr.error(`Erro ao excluir notícia: ${error.error?.message || error.message}`);
          }
        });
      }
    });
  }

  async bulkDelete(): Promise<void> {
    if (this.selectedItems.length === 0) return;

    const result = await Swal.fire({
      title: `Excluir ${this.selectedItems.length} notícia(s)?`,
      text: 'Esta ação não poderá ser desfeita.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sim, excluir',
      cancelButtonText: 'Cancelar'
    });

    if (!result.isConfirmed) return;

    let successful = 0;
    let failed = 0;

    for (const id of this.selectedItems) {
      try {
        await this.newsService.delete(id).toPromise();
        successful++;
      } catch {
        failed++;
      }
    }

    this.toastr.success(`${successful} notícia(s) excluída(s).`);
    if (failed > 0) this.toastr.warning(`${failed} falharam ao excluir.`);
    this.selectedItems = [];
    this.selectAll = false;
    this.loadNews();
  }

  async bulkPublish(): Promise<void> {
    if (this.selectedItems.length === 0) return;

    const result = await Swal.fire({
      title: `Publicar ${this.selectedItems.length} notícia(s)?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sim, publicar',
      cancelButtonText: 'Cancelar'
    });

    if (!result.isConfirmed) return;

    let success = 0;
    let failed = 0;

    for (const id of this.selectedItems) {
      try {
        await this.newsService.updateNewsPublishStatus(id, true).toPromise();
        success++;
      } catch {
        failed++;
      }
    }

    this.toastr.success(`${success} publicada(s) com sucesso!`);
    if (failed > 0) this.toastr.warning(`${failed} falharam.`);
    this.selectedItems = [];
    this.selectAll = false;
    this.loadNews();
  }

  async bulkUnpublish(): Promise<void> {
    if (this.selectedItems.length === 0) return;

    const result = await Swal.fire({
      title: `Despublicar ${this.selectedItems.length} notícia(s)?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sim, despublicar',
      cancelButtonText: 'Cancelar'
    });

    if (!result.isConfirmed) return;

    let success = 0;
    let failed = 0;

    for (const id of this.selectedItems) {
      try {
        await this.newsService.updateNewsPublishStatus(id, false).toPromise();
        success++;
      } catch {
        failed++;
      }
    }

    this.toastr.success(`${success} despublicada(s) com sucesso!`);
    if (failed > 0) this.toastr.warning(`${failed} falharam.`);
    this.selectedItems = [];
    this.selectAll = false;
    this.loadNews();
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
