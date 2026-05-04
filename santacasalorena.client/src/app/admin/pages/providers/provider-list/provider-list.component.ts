import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Providers } from '../../../../models/provider';
import { ProviderService } from '../../../../services/provider.service';
import { debounceTime, Subject, forkJoin, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-provider-list',
  standalone: false,
  templateUrl: './provider-list.component.html',
  styleUrls: ['./provider-list.component.css']
})
export class ProviderListComponent implements OnInit {
  providers: Providers[] = [];
  filteredProviders: Providers[] = [];
  paginatedProviders: Providers[] = [];
  loading = false;

  // Filtros e busca
  searchTerm: string = '';
  private searchSubject = new Subject<string>();

  // Paginação
  currentPage: number = 1;
  itemsPerPage: number = 10;
  totalItems: number = 0;
  totalPages: number = 0;

  // Ordenação
  sortBy: string = 'name';
  sortOrder: 'asc' | 'desc' = 'asc';

  // Ações em massa
  selectedItems: string[] = [];
  selectAll: boolean = false;

  constructor(
    private router: Router,
    private providerService: ProviderService,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.loadProviders();
    this.searchSubject.pipe(debounceTime(300)).subscribe(() => {
      this.applyFiltersAndSort();
    });
  }

  loadProviders(): void {
    this.loading = true;
    this.providerService.getAll().subscribe({
      next: (data: Providers[]) => {
        this.providers = data;
        this.applyFiltersAndSort();
        this.loading = false;
      },
      error: (err) => {
        console.error('Erro ao carregar fornecedores:', err);
        this.toastr.error('Erro ao carregar fornecedores. Tente novamente mais tarde.', 'Erro');
        this.loading = false;
      }
    });
  }

  applyFiltersAndSort(): void {
    let tempProviders = [...this.providers];

    // Filtro de busca
    if (this.searchTerm) {
      const lowerSearchTerm = this.searchTerm.toLowerCase();
      tempProviders = tempProviders.filter(provider =>
        provider.name.toLowerCase().includes(lowerSearchTerm)
      );
    }

    // Ordenação
    tempProviders.sort((a, b) => {
      const aValue = (a as any)[this.sortBy];
      const bValue = (b as any)[this.sortBy];

      if (aValue < bValue) return this.sortOrder === 'asc' ? -1 : 1;
      if (aValue > bValue) return this.sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    this.filteredProviders = tempProviders;
    this.totalItems = this.filteredProviders.length;
    this.totalPages = Math.ceil(this.totalItems / this.itemsPerPage);
    this.currentPage = 1;
    this.paginateProviders();
  }

  paginateProviders(): void {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedProviders = this.filteredProviders.slice(startIndex, endIndex);
    this.selectAll = this.paginatedProviders.length > 0 && this.paginatedProviders.every(p => this.selectedItems.includes(p.id));
  }

  onSearch(): void {
    this.searchSubject.next(this.searchTerm);
  }

  onFilterChange(): void {
    this.applyFiltersAndSort();
  }

  onItemsPerPageChange(): void {
    this.currentPage = 1;
    this.paginateProviders();
  }

  onPageChange(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.paginateProviders();
    }
  }

  onSort(column: string): void {
    if (this.sortBy === column) {
      this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortBy = column;
      this.sortOrder = 'asc';
    }
    this.applyFiltersAndSort();
  }

  createProvider(): void {
    this.router.navigate(['/admin/providers/new']);
  }

  editProvider(id: string): void {
    this.router.navigate([`/admin/providers/edit/${id}`]);
  }

  async deleteProvider(id: string): Promise<void> {
    const result = await Swal.fire({
      title: 'Tem certeza?',
      text: 'Deseja realmente excluir este fornecedor?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sim, excluir',
      cancelButtonText: 'Cancelar'
    });

    if (result.isConfirmed) {
      this.providerService.delete(id).subscribe({
        next: () => {
          this.toastr.success('Fornecedor excluído com sucesso!', 'Sucesso');
          this.loadProviders();
        },
        error: (err) => {
          console.error('Erro ao excluir fornecedor:', err);
          this.toastr.error('Erro ao excluir fornecedor. Tente novamente mais tarde.', 'Erro');
        }
      });
    }
  }

  toggleSelectAll(): void {
    this.selectedItems = this.selectAll ? this.paginatedProviders.map(p => p.id) : [];
  }

  toggleItemSelection(id: string): void {
    const index = this.selectedItems.indexOf(id);
    if (index > -1) {
      this.selectedItems.splice(index, 1);
    } else {
      this.selectedItems.push(id);
    }
    this.selectAll = this.paginatedProviders.length > 0 && this.paginatedProviders.every(p => this.selectedItems.includes(p.id));
  }

  isSelected(id: string): boolean {
    return this.selectedItems.includes(id);
  }

  async bulkDelete(): Promise<void> {
    if (this.selectedItems.length === 0) return;

    const result = await Swal.fire({
      title: 'Excluir múltiplos fornecedores?',
      text: `Tem certeza que deseja excluir ${this.selectedItems.length} fornecedor(es)?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sim, excluir todos',
      cancelButtonText: 'Cancelar'
    });

    if (result.isConfirmed) {
      const deletions = this.selectedItems.map(id =>
        this.providerService.delete(id).pipe(
          map(() => console.log(`Fornecedor ${id} excluído.`)),
          catchError(err => {
            console.error(`Erro ao excluir fornecedor ${id}:`, err);
            return of(null);
          })
        )
      );

      forkJoin(deletions).subscribe(() => {
        this.toastr.success('Fornecedores excluídos com sucesso!', 'Sucesso');
        this.selectedItems = [];
        this.selectAll = false;
        this.loadProviders();
      });
    }
  }

  getMin(a: number, b: number): number {
    return Math.min(a, b);
  }
}
