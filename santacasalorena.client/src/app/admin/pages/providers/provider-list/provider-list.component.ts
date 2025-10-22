import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Providers } from '../../../../models/provider';
import { ProviderService } from '../../../../services//provider.service';
import { debounceTime, Subject, forkJoin, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

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

  // Filters and Search
  searchTerm: string = '';
  private searchSubject = new Subject<string>();

  // Pagination
  currentPage: number = 1;
  itemsPerPage: number = 10;
  totalItems: number = 0;
  totalPages: number = 0;

  // Sorting
  sortBy: string = 'name';
  sortOrder: 'asc' | 'desc' = 'asc';

  // Bulk Actions
  selectedItems: string[] = [];
  selectAll: boolean = false;

  constructor(
    private router: Router,
    private providerService: ProviderService
  ) { }

  ngOnInit(): void {
    this.loadProviders();
    this.searchSubject.pipe(
      debounceTime(300)
    ).subscribe(() => {
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
        alert('Erro ao carregar fornecedores. Tente novamente mais tarde.');
        this.loading = false;
      }
    });
  }

  applyFiltersAndSort(): void {
    let tempProviders = [...this.providers];

    // Apply Search
    if (this.searchTerm) {
      const lowerSearchTerm = this.searchTerm.toLowerCase();
      tempProviders = tempProviders.filter(provider =>
        provider.name.toLowerCase().includes(lowerSearchTerm)
      );
    }

    // Apply Sorting
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
    this.currentPage = 1; // Reset to first page after filters/sort change
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

  deleteProvider(id: string): void {
    if (confirm('Tem certeza que deseja excluir este fornecedor?')) {
      this.providerService.delete(id).subscribe({
        next: () => {
          alert('Fornecedor excluído com sucesso!');
          this.loadProviders(); // Recarrega a lista após exclusão
        },
        error: (err) => {
          console.error('Erro ao excluir fornecedor:', err);
          alert('Erro ao excluir fornecedor. Tente novamente mais tarde.');
        }
      });
    }
  }

  // Bulk Actions Logic
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

  bulkDelete(): void {
    if (this.selectedItems.length === 0) return;
    if (confirm(`Tem certeza que deseja excluir ${this.selectedItems.length} fornecedor(es)?`)) {
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
        alert('Fornecedores excluídos com sucesso (verifique o console para erros individuais)!');
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

