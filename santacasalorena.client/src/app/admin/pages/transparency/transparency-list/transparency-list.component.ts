import { Component, OnInit } from '@angular/core';
import { TransparencyPortalService } from '../../../../services/transparency-portal.service';
import { TransparencyPortal } from '../../../../models/transparencyPortal';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { ToastrService } from 'ngx-toastr';

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
    private transparencyPortalService: TransparencyPortalService,
    private toastr: ToastrService
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
        this.toastr.error('Erro ao carregar os itens do portal de transparência.', 'Erro');
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

  // ✅ Atualizado para usar SweetAlert e Toastr
  async togglePublishStatus(id: string): Promise<void> {
    const item = this.transparencyItems.find(i => i.id === id);
    if (!item) return;

    const actionText = item.isActive ? 'despublicar' : 'publicar';
    const result = await Swal.fire({
      title: `Deseja ${actionText} este item?`,
      text: `O item "${item.title}" será ${item.isActive ? 'despublicado' : 'publicado'}.`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: `Sim, ${actionText}`,
      cancelButtonText: 'Cancelar'
    });

    if (result.isConfirmed) {
      this.transparencyPortalService.toggleActive(id).subscribe({
        next: (updatedItem) => {
          item.isActive = updatedItem.isActive;
          this.applyFilters();
          this.toastr.success(
            `Item "${item.title}" ${item.isActive ? 'publicado' : 'despublicado'} com sucesso!`,
            'Sucesso'
          );
        },
        error: (err: HttpErrorResponse) => {
          console.error('Erro ao atualizar status:', err);
          this.toastr.error('Erro ao atualizar o status do item.', 'Erro');
        }
      });
    }
  }

  async bulkPublish(): Promise<void> {
    if (this.selectedItems.length === 0) {
      this.toastr.warning('Nenhum item selecionado.', 'Atenção');
      return;
    }

    const result = await Swal.fire({
      title: 'Publicar itens selecionados?',
      text: `Deseja publicar ${this.selectedItems.length} item(ns)?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sim, publicar',
      cancelButtonText: 'Cancelar'
    });

    if (result.isConfirmed) {
      this.transparencyPortalService.bulkToggle(this.selectedItems, true).subscribe({
        next: () => {
          this.transparencyItems.forEach(item => {
            if (this.selectedItems.includes(item.id)) item.isActive = true;
          });
          this.applyFilters();
          this.resetSelection();
          this.toastr.success('Itens publicados com sucesso!', 'Sucesso');
        },
        error: (err: HttpErrorResponse) => {
          console.error('Erro ao publicar itens:', err);
          this.toastr.error('Erro ao publicar os itens selecionados.', 'Erro');
        }
      });
    }
  }

  async bulkUnpublish(): Promise<void> {
    if (this.selectedItems.length === 0) {
      this.toastr.warning('Nenhum item selecionado.', 'Atenção');
      return;
    }

    const result = await Swal.fire({
      title: 'Despublicar itens selecionados?',
      text: `Deseja despublicar ${this.selectedItems.length} item(ns)?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sim, despublicar',
      cancelButtonText: 'Cancelar'
    });

    if (result.isConfirmed) {
      this.transparencyPortalService.bulkToggle(this.selectedItems, false).subscribe({
        next: () => {
          this.transparencyItems.forEach(item => {
            if (this.selectedItems.includes(item.id)) item.isActive = false;
          });
          this.applyFilters();
          this.resetSelection();
          this.toastr.success('Itens despublicados com sucesso!', 'Sucesso');
        },
        error: (err: HttpErrorResponse) => {
          console.error('Erro ao despublicar itens:', err);
          this.toastr.error('Erro ao despublicar os itens selecionados.', 'Erro');
        }
      });
    }
  }

  async bulkDelete(): Promise<void> {
    if (this.selectedItems.length === 0) {
      this.toastr.warning('Nenhum item selecionado.', 'Atenção');
      return;
    }

    const result = await Swal.fire({
      title: 'Excluir itens selecionados?',
      text: 'Esta ação não poderá ser desfeita.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sim, excluir',
      cancelButtonText: 'Cancelar'
    });

    if (result.isConfirmed) {
      this.transparencyPortalService.bulkDelete(this.selectedItems).subscribe({
        next: () => {
          this.transparencyItems = this.transparencyItems.filter(i => !this.selectedItems.includes(i.id));
          this.applyFilters();
          this.resetSelection();
          this.toastr.success('Itens excluídos com sucesso!', 'Sucesso');
        },
        error: (err: HttpErrorResponse) => {
          console.error('Erro ao excluir itens:', err);
          this.toastr.error('Erro ao excluir os itens selecionados.', 'Erro');
        }
      });
    }
  }

  async deleteTransparencyItem(id: string): Promise<void> {
    const result = await Swal.fire({
      title: 'Excluir item?',
      text: 'Esta ação não poderá ser desfeita.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sim, excluir',
      cancelButtonText: 'Cancelar'
    });

    if (result.isConfirmed) {
      this.transparencyPortalService.delete(id).subscribe({
        next: () => {
          this.transparencyItems = this.transparencyItems.filter(i => i.id !== id);
          this.applyFilters();
          this.toastr.success('Item excluído com sucesso!', 'Sucesso');
        },
        error: (err: HttpErrorResponse) => {
          console.error('Erro ao excluir item:', err);
          this.toastr.error('Erro ao excluir o item.', 'Erro');
        }
      });
    }
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
