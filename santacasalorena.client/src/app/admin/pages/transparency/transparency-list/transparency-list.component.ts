import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TransparencyPortal } from '../../../../models/transparencyPortal';
import { TransparencyPortalService } from '../../../../services/transparency-portal.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-transparency-list',
  standalone: false,
  templateUrl: './transparency-list.component.html',
  styleUrls: ['./transparency-list.component.css']
})
export class TransparencyListComponent implements OnInit {
  loading = true;
  transparencyItems: TransparencyPortal[] = [];
  filteredTransparencyItems: TransparencyPortal[] = [];

  // Filters
  searchTerm = '';
  statusFilter = 'all'; // all, published, draft
  categoryFilter = 'all';
  sortBy = 'publishDate';
  sortOrder: 'asc' | 'desc' = 'desc';

  // Pagination
  currentPage = 1;
  itemsPerPage = 10;
  totalItems = 0;

  // Selection
  selectedItems: string[] = [];
  selectAll = false;

  categories = [
    'Receitas',
    'Despesas',
    'Licitações',
    'Contratos',
    'Servidores',
    'Planejamento',
    'Relatórios'
  ];

  constructor(private router: Router, private transparencyPortalService: TransparencyPortalService) { }

  ngOnInit(): void {
    this.loadTransparencyItems();
  }

  loadTransparencyItems(): void {
    this.loading = true;
    this.transparencyPortalService.getAll().subscribe({
      next: (data: TransparencyPortal[]) => {
        this.transparencyItems = data;
        this.applyFilters();
        this.loading = false;
      },
      error: (error: HttpErrorResponse) => {
        console.error("Erro ao carregar itens de transparência:", error);
        alert("Erro ao carregar itens de transparência.");
        this.loading = false;
      }
    });
  }

  applyFilters(): void {
    let filtered = [...this.transparencyItems];

    // Search filter
    if (this.searchTerm) {
      filtered = filtered.filter(item =>
        item.title.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        item.category.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (this.statusFilter !== 'all') {
      //filtered = filtered.filter(item => item.status === this.statusFilter);
    }

    // Category filter
    if (this.categoryFilter !== 'all') {
      filtered = filtered.filter(item => item.category === this.categoryFilter);
    }

    // Sort
    filtered.sort((a, b) => {
      let aValue = a[this.sortBy as keyof TransparencyPortal] ?? '';
      let bValue = b[this.sortBy as keyof TransparencyPortal] ?? '';

      if (typeof aValue === 'string') aValue = aValue.toLowerCase();
      if (typeof bValue === 'string') bValue = bValue.toLowerCase();

      if (aValue < bValue) return this.sortOrder === 'asc' ? -1 : 1;
      if (aValue > bValue) return this.sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    this.filteredTransparencyItems = filtered;
    this.totalItems = filtered.length;
    this.currentPage = 1;
  }

  get paginatedTransparencyItems(): TransparencyPortal[] {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    return this.filteredTransparencyItems.slice(start, end);
  }

  get totalPages(): number {
    return Math.ceil(this.totalItems / this.itemsPerPage);
  }

  onSearch(): void {
    this.applyFilters();
  }

  onFilterChange(): void {
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
    this.currentPage = page;
  }

  onItemsPerPageChange(): void {
    this.currentPage = 1;
  }

  toggleSelectAll(): void {
    if (this.selectAll) {
      this.selectedItems = this.paginatedTransparencyItems.map(item => item.id);
    } else {
      this.selectedItems = [];
    }
  }

  toggleItemSelection(id: string): void {
    const index = this.selectedItems.indexOf(id);
    if (index > -1) {
      this.selectedItems.splice(index, 1);
    } else {
      this.selectedItems.push(id);
    }
    this.selectAll = this.selectedItems.length === this.paginatedTransparencyItems.length;
  }

  isSelected(id: string): boolean {
    return this.selectedItems.includes(id);
  }

  createTransparencyItem(): void {
    this.router.navigate(['/admin/transparency/new']);
  }

  editTransparencyItem(id: string): void {
    this.router.navigate(['/admin/transparency/edit', id]);
  }

  deleteTransparencyItem(id: string): void {
    if (confirm("Tem certeza que deseja excluir este item de transparência?")) {
      this.transparencyPortalService.delete(id).subscribe({
        next: () => {
          this.transparencyItems = this.transparencyItems.filter(item => item.id !== id);
          this.selectedItems = this.selectedItems.filter(selectedId => selectedId !== id);
          this.applyFilters();
          alert("Item de transparência excluído com sucesso!");
        },
        error: (error: HttpErrorResponse) => {
          console.error("Erro ao excluir item de transparência:", error);
          alert("Erro ao excluir item de transparência.");
        }
      });
    }
  }

  bulkDelete(): void {
    if (this.selectedItems.length === 0) return;

    if (confirm(`Tem certeza que deseja excluir ${this.selectedItems.length} item(ns) de transparência?`)) {
      const deleteObservables = this.selectedItems.map(id => this.transparencyPortalService.delete(id));
      // Using forkJoin to wait for all deletions to complete
      // Or handle each deletion individually and update the UI after each success
      // For simplicity, let's refetch all items after all delete calls are initiated
      // A more robust solution would involve tracking individual successes/failures
      this.selectedItems.forEach(id => {
        this.transparencyPortalService.delete(id).subscribe({
          next: () => {
            this.transparencyItems = this.transparencyItems.filter(item => item.id !== id);
            this.applyFilters();
          },
          error: (error: HttpErrorResponse) => {
            console.error(`Erro ao excluir item de transparência ${id}:`, error);
            alert(`Erro ao excluir item de transparência ${id}.`);
          }
        });
      });
      this.selectedItems = [];
      this.selectAll = false;
      alert("Itens de transparência excluídos com sucesso!");
      this.loadTransparencyItems(); // Reload all items to ensure UI consistency
    }
  }

  bulkPublish(): void {
    if (this.selectedItems.length === 0) return;

    this.selectedItems.forEach(id => {
      this.transparencyPortalService.updateTransparencyItemStatus(id, 'published').subscribe({
        next: () => {
          // Item status will be updated when all items are reloaded
        },
        error: (error: HttpErrorResponse) => {
          console.error(`Erro ao publicar item de transparência ${id}:`, error);
          alert(`Erro ao publicar item de transparência ${id}.`);
        }
      });
    });

    this.selectedItems = [];
    this.selectAll = false;
    alert("Itens de transparência publicados com sucesso!");
    this.loadTransparencyItems(); // Reload all items to ensure UI consistency
  }

  bulkUnpublish(): void {
    if (this.selectedItems.length === 0) return;

    this.selectedItems.forEach(id => {
      this.transparencyPortalService.updateTransparencyItemStatus(id, 'draft').subscribe({
        next: () => {
          // Item status will be updated when all items are reloaded
        },
        error: (error: HttpErrorResponse) => {
          console.error(`Erro ao despublicar item de transparência ${id}:`, error);
          alert(`Erro ao despublicar item de transparência ${id}.`);
        }
      });
    });

    this.selectedItems = [];
    this.selectAll = false;
    alert("Itens de transparência despublicados com sucesso!");
    this.loadTransparencyItems(); // Reload all items to ensure UI consistency
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('pt-BR');
  }

  getStatusBadgeClass(status: string): string {
    switch (status) {
      case 'published': return 'bg-success';
      case 'draft': return 'bg-warning';
      default: return 'bg-secondary';
    }
  }

  getStatusText(status: string): string {
    switch (status) {
      case 'published': return 'Publicado';
      case 'draft': return 'Rascunho';
      default: return 'Desconhecido';
    }
  }

  downloadFile(fileUrl: string): void {
    window.open(fileUrl, '_blank');
  }

  getMin(a: number, b: number): number {
    return Math.min(a, b);
  }
}

