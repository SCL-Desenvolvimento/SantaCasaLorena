import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Agreement } from '../../../../models/agreement';
import { AgreementService } from '../../../../services/agreement.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-convenios-list',
  standalone: false,
  templateUrl: './convenios-list.component.html',
  styleUrls: ['./convenios-list.component.css']
})
export class ConveniosListComponent implements OnInit {
  loading = true;
  convenios: Agreement[] = [];
  filteredConvenios: Agreement[] = [];

  // Filtros
  searchTerm = '';
  statusFilter: 'all' | 'active' | 'inactive' = 'all';
  sortBy = 'createdAt';
  sortOrder: 'asc' | 'desc' = 'desc';

  // Paginação
  currentPage = 1;
  itemsPerPage = 10;
  totalItems = 0;

  // Seleção
  selectedItems: string[] = [];
  selectAll = false;

  constructor(private router: Router, private agreementService: AgreementService) { }

  ngOnInit(): void {
    this.loadConvenios();
  }

  loadConvenios(): void {
    this.loading = true;
    this.agreementService.getAll().subscribe({
      next: (data) => {
        this.convenios = data;
        this.applyFilters();
        this.loading = false;
      },
      error: (error: HttpErrorResponse) => {
        console.error('Erro ao carregar convênios:', error);
        alert('Erro ao carregar convênios. Tente novamente mais tarde.');
        this.loading = false;
      }
    });
  }

  applyFilters(): void {
    let filtered = [...this.convenios];

    // Filtro de busca
    if (this.searchTerm) {
      filtered = filtered.filter(item =>
        item.name.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }

    // Filtro de status
    if (this.statusFilter !== 'all') {
      const isActive = this.statusFilter === 'active';
      filtered = filtered.filter(item => item.isActive === isActive);
    }

    // Ordenação
    filtered.sort((a, b) => {
      let aValue = (a as any)[this.sortBy];
      let bValue = (b as any)[this.sortBy];

      if (typeof aValue === 'string') aValue = aValue.toLowerCase();
      if (typeof bValue === 'string') bValue = bValue.toLowerCase();

      if (aValue < bValue) return this.sortOrder === 'asc' ? -1 : 1;
      if (aValue > bValue) return this.sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    this.filteredConvenios = filtered;
    this.totalItems = filtered.length;
    this.currentPage = 1;
  }

  get paginatedConvenios(): Agreement[] {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    return this.filteredConvenios.slice(start, end);
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
      this.selectedItems = this.paginatedConvenios.map(item => item.id);
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
    this.selectAll = this.selectedItems.length === this.paginatedConvenios.length;
  }

  isSelected(id: string): boolean {
    return this.selectedItems.includes(id);
  }

  createConvenio(): void {
    this.router.navigate(['/admin/convenios/new']);
  }

  editConvenio(id: string): void {
    this.router.navigate(['/admin/convenios/edit', id]);
  }

  deleteConvenio(id: string): void {
    if (confirm('Tem certeza que deseja excluir este convênio?')) {
      this.agreementService.delete(id).subscribe({
        next: () => {
          this.convenios = this.convenios.filter(item => item.id !== id);
          this.applyFilters();
          alert('Convênio excluído com sucesso!');
        },
        error: (error: HttpErrorResponse) => {
          console.error('Erro ao excluir convênio:', error);
          alert('Erro ao excluir convênio. Tente novamente mais tarde.');
        }
      });
    }
  }

  formatDate(dateString?: string): string {
    return dateString ? new Date(dateString).toLocaleDateString('pt-BR') : '-';
  }

  getStatusBadgeClass(isActive: boolean): string {
    return isActive ? 'bg-success' : 'bg-danger';
  }

  getStatusText(isActive: boolean): string {
    return isActive ? 'Ativo' : 'Inativo';
  }

  getMin(a: number, b: number): number {
    return Math.min(a, b);
  }
}
