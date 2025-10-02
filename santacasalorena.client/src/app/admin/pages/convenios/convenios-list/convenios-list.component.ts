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

  // Filters
  searchTerm = '';
  statusFilter: 'all' | 'active' | 'inactive' | 'pending' = 'all'; // all, active, inactive, pending
  categoryFilter = 'all';
  sortBy = 'createdAt';
  sortOrder: 'asc' | 'desc' = 'desc';

  // Pagination
  currentPage = 1;
  itemsPerPage = 10;
  totalItems = 0;

  // Selection
  selectedItems: number[] = [];
  selectAll = false;

  categories = [
    'Educação',
    'Saúde',
    'Assistência Social',
    'Cultura',
    'Esporte',
    'Meio Ambiente'
  ];

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

    // Search filter
    if (this.searchTerm) {
      filtered = filtered.filter(item =>
        item.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        item.partner.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (this.statusFilter !== 'all') {
      filtered = filtered.filter(item => item.status === this.statusFilter);
    }

    // Category filter
    if (this.categoryFilter !== 'all') {
      filtered = filtered.filter(item => item.category === this.categoryFilter);
    }

    // Sort
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

  toggleItemSelection(id: number): void {
    const index = this.selectedItems.indexOf(id);
    if (index > -1) {
      this.selectedItems.splice(index, 1);
    } else {
      this.selectedItems.push(id);
    }
    this.selectAll = this.selectedItems.length === this.paginatedConvenios.length;
  }

  isSelected(id: number): boolean {
    return this.selectedItems.includes(id);
  }

  createConvenio(): void {
    this.router.navigate(['/admin/convenios/new']);
  }

  editConvenio(id: number): void {
    this.router.navigate(['/admin/convenios/edit', id]);
  }

  deleteConvenio(id: number): void {
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

  bulkDelete(): void {
    if (this.selectedItems.length === 0) return;

    if (confirm(`Tem certeza que deseja excluir ${this.selectedItems.length} convênio(s)?`)) {
      // Using Promise.all to handle multiple deletions and update UI once
      const deletePromises = this.selectedItems.map(id =>
        this.agreementService.delete(id).toPromise().catch(error => {
          console.error(`Erro ao excluir convênio ${id}:`, error);
          alert(`Erro ao excluir convênio ${id}.`);
          return Promise.reject(error); // Propagate error to stop Promise.all
        })
      );

      Promise.all(deletePromises)
        .then(() => {
          this.convenios = this.convenios.filter(item => !this.selectedItems.includes(item.id));
          this.selectedItems = [];
          this.selectAll = false;
          this.applyFilters();
          alert('Convênios excluídos com sucesso!');
        })
        .catch(() => {
          // Handle overall error if any deletion failed
          this.loading = false;
        });
    }
  }

  bulkActivate(): void {
    if (this.selectedItems.length === 0) return;

    const updatePromises = this.selectedItems.map(id =>
      this.agreementService.updateAgreementStatus(id, 'active').toPromise().catch(error => {
        console.error(`Erro ao ativar convênio ${id}:`, error);
        alert(`Erro ao ativar convênio ${id}.`);
        return Promise.reject(error);
      })
    );

    Promise.all(updatePromises)
      .then(() => {
        this.selectedItems.forEach(id => {
          const convenioItem = this.convenios.find(item => item.id === id);
          if (convenioItem) {
            convenioItem.status = 'active';
          }
        });
        this.selectedItems = [];
        this.selectAll = false;
        this.applyFilters();
        alert('Convênios ativados com sucesso!');
      })
      .catch(() => {
        this.loading = false;
      });
  }

  bulkDeactivate(): void {
    if (this.selectedItems.length === 0) return;

    const updatePromises = this.selectedItems.map(id =>
      this.agreementService.updateAgreementStatus(id, 'inactive').toPromise().catch(error => {
        console.error(`Erro ao desativar convênio ${id}:`, error);
        alert(`Erro ao desativar convênio ${id}.`);
        return Promise.reject(error);
      })
    );

    Promise.all(updatePromises)
      .then(() => {
        this.selectedItems.forEach(id => {
          const convenioItem = this.convenios.find(item => item.id === id);
          if (convenioItem) {
            convenioItem.status = 'inactive';
          }
        });
        this.selectedItems = [];
        this.selectAll = false;
        this.applyFilters();
        alert('Convênios desativados com sucesso!');
      })
      .catch(() => {
        this.loading = false;
      });
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('pt-BR');
  }

  getStatusBadgeClass(status: string): string {
    switch (status) {
      case 'active': return 'bg-success';
      case 'inactive': return 'bg-danger';
      case 'pending': return 'bg-warning';
      default: return 'bg-secondary';
    }
  }

  getStatusText(status: string): string {
    switch (status) {
      case 'active': return 'Ativo';
      case 'inactive': return 'Inativo';
      case 'pending': return 'Pendente';
      default: return 'Desconhecido';
    }
  }

  getMin(a: number, b: number): number {
    return Math.min(a, b);
  }
}

