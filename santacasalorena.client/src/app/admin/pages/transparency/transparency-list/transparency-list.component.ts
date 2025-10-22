import { Component, OnInit } from '@angular/core';
import { TransparencyPortalService } from '../../../../services/transparency-portal.service';
import { TransparencyPortal } from '../../../../models/transparencyPortal';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-transparency-list',
  standalone: false,
  templateUrl: './transparency-list.component.html',
  styleUrls: ['./transparency-list.component.css']
})
export class TransparencyListComponent implements OnInit {
  transparencyItems: TransparencyPortal[] = [];
  filteredTransparencyItems: TransparencyPortal[] = [];
  paginatedTransparencyItems: TransparencyPortal[] = [];
  categories: string[] = [];

  loading = true;
  searchTerm = '';
  statusFilter = 'all';
  categoryFilter = 'all';

  selectedItems: string[] = [];
  selectAll = false;

  sortBy: string = 'createdAt';
  sortOrder: 'asc' | 'desc' = 'desc';

  currentPage = 1;
  itemsPerPage = 10;

  constructor(
    private router: Router,
    private transparencyPortalService: TransparencyPortalService
  ) { }

  ngOnInit(): void {
    this.fetchTransparencyItems();
  }

  fetchTransparencyItems(): void {
    this.loading = true;
    this.transparencyPortalService.getAll().subscribe({
      next: (items) => {
        this.transparencyItems = items;
        this.categories = Array.from(new Set(items.map(i => i.category)));
        this.applyFilters();
        this.loading = false;
      },
      error: (err: HttpErrorResponse) => {
        console.error('Erro ao carregar itens:', err);
        this.loading = false;
      }
    });
  }

  applyFilters(): void {
    let filtered = [...this.transparencyItems];

    if (this.statusFilter !== 'all') {
      filtered = filtered.filter(item =>
        this.statusFilter === 'active' ? item.isActive : !item.isActive
      );
    }

    if (this.categoryFilter !== 'all') {
      filtered = filtered.filter(item => item.category === this.categoryFilter);
    }

    if (this.searchTerm.trim() !== '') {
      const term = this.searchTerm.toLowerCase();
      filtered = filtered.filter(item =>
        item.title.toLowerCase().includes(term) ||
        item.category.toLowerCase().includes(term)
      );
    }

    filtered.sort((a, b) => {
      let valA = (a as any)[this.sortBy];
      let valB = (b as any)[this.sortBy];

      if (valA == null) valA = '';
      if (valB == null) valB = '';

      if (typeof valA === 'string') valA = valA.toLowerCase();
      if (typeof valB === 'string') valB = valB.toLowerCase();

      if (valA < valB) return this.sortOrder === 'asc' ? -1 : 1;
      if (valA > valB) return this.sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    this.filteredTransparencyItems = filtered;
    this.paginate();
  }

  paginate(): void {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    this.paginatedTransparencyItems = this.filteredTransparencyItems.slice(start, end);
  }

  onSearch(): void {
    this.currentPage = 1;
    this.applyFilters();
  }

  onFilterChange(): void {
    this.currentPage = 1;
    this.applyFilters();
  }

  clearFilters(): void {
    this.searchTerm = '';
    this.statusFilter = 'all';
    this.categoryFilter = 'all';
    this.applyFilters();
  }

  onSort(column: string): void {
    if (this.sortBy === column) {
      this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortBy = column;
      this.sortOrder = 'asc';
    }
    this.applyFilters();
  }

  onItemsPerPageChange(): void {
    this.currentPage = 1;
    this.paginate();
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.paginate();
  }

  toggleItemSelection(id: string): void {
    const index = this.selectedItems.indexOf(id);
    if (index >= 0) {
      this.selectedItems.splice(index, 1);
    } else {
      this.selectedItems.push(id);
    }
    this.selectAll = this.selectedItems.length === this.filteredTransparencyItems.length;
  }

  toggleSelectAll(): void {
    if (this.selectAll) {
      this.selectedItems = this.filteredTransparencyItems.map(i => i.id);
    } else {
      this.selectedItems = [];
    }
  }

  isSelected(id: string): boolean {
    return this.selectedItems.includes(id);
  }

  // ✅ Atualizado para usar o novo endpoint PATCH /toggle-active
  togglePublishStatus(id: string): void {
    const item = this.transparencyItems.find(i => i.id === id);
    if (!item) return;

    this.transparencyPortalService.toggleActive(id).subscribe({
      next: (updatedItem) => {
        item.isActive = updatedItem.isActive;
        this.applyFilters();
        alert(`Item "${item.title}" ${item.isActive ? 'publicado' : 'despublicado'} com sucesso!`);
      },
      error: (err: HttpErrorResponse) => {
        console.error('Erro ao atualizar status:', err);
        alert('Erro ao atualizar status do item.');
      }
    });
  }

  // ✅ Agora usa bulkToggle do service
  bulkPublish(): void {
    if (this.selectedItems.length === 0) return;
    this.transparencyPortalService.bulkToggle(this.selectedItems, true).subscribe({
      next: () => {
        this.transparencyItems.forEach(item => {
          if (this.selectedItems.includes(item.id)) item.isActive = true;
        });
        this.applyFilters();
        this.resetSelection();
        alert('Itens publicados com sucesso!');
      },
      error: (err: HttpErrorResponse) => {
        console.error('Erro ao publicar itens:', err);
        alert('Erro ao publicar itens selecionados.');
      }
    });
  }

  bulkUnpublish(): void {
    if (this.selectedItems.length === 0) return;
    this.transparencyPortalService.bulkToggle(this.selectedItems, false).subscribe({
      next: () => {
        this.transparencyItems.forEach(item => {
          if (this.selectedItems.includes(item.id)) item.isActive = false;
        });
        this.applyFilters();
        this.resetSelection();
        alert('Itens despublicados com sucesso!');
      },
      error: (err: HttpErrorResponse) => {
        console.error('Erro ao despublicar itens:', err);
        alert('Erro ao despublicar itens selecionados.');
      }
    });
  }

  bulkDelete(): void {
    if (this.selectedItems.length === 0) return;
    if (!confirm('Tem certeza que deseja excluir os itens selecionados?')) return;

    this.transparencyPortalService.bulkDelete(this.selectedItems).subscribe({
      next: () => {
        this.transparencyItems = this.transparencyItems.filter(i => !this.selectedItems.includes(i.id));
        this.applyFilters();
        this.resetSelection();
        alert('Itens excluídos com sucesso!');
      },
      error: (err: HttpErrorResponse) => {
        console.error('Erro ao excluir itens:', err);
        alert('Erro ao excluir itens selecionados.');
      }
    });
  }

  // ✅ Delete individual (mantido)
  deleteTransparencyItem(id: string, confirmDialog: boolean = true): void {
    if (confirmDialog && !confirm('Deseja realmente excluir este item?')) return;

    this.transparencyPortalService.delete(id).subscribe({
      next: () => {
        this.transparencyItems = this.transparencyItems.filter(i => i.id !== id);
        this.applyFilters();
        alert('Item excluído com sucesso!');
      },
      error: (err: HttpErrorResponse) => {
        console.error('Erro ao excluir item:', err);
        alert('Erro ao excluir item.');
      }
    });
  }

  createTransparencyItem(): void {
    this.router.navigate(['/admin/transparency/new']);
  }

  editTransparencyItem(id: string): void {
    this.router.navigate(['/admin/transparency/edit', id]);
  }

  getStatusBadgeClass(isActive: boolean): string {
    return isActive ? 'badge bg-success' : 'badge bg-secondary';
  }

  getStatusText(isActive: boolean): string {
    return isActive ? 'Publicado' : 'Rascunho';
  }

  formatDate(dateStr: string | Date | null): string {
    if (!dateStr) return '-';
    const date = new Date(dateStr);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  }

  get totalPages(): number {
    return Math.ceil(this.filteredTransparencyItems.length / this.itemsPerPage);
  }

  getMin(a: number, b: number): number {
    return a < b ? a : b;
  }

  private resetSelection(): void {
    this.selectedItems = [];
    this.selectAll = false;
  }
}
