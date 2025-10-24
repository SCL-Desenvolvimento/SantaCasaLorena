import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { finalize } from 'rxjs/operators';
import { User } from '../../../../models/user';
import { UserService } from '../../../../services/user.service';
import Swal from 'sweetalert2';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-user-list',
  standalone: false,
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css'],
})
export class UserListComponent implements OnInit {
  loading = true;
  users: User[] = [];
  filteredUsers: User[] = [];

  searchTerm = '';
  private searchDebounceTimer: any = null;
  roleFilter: string = 'all';
  isActiveFilter: 'all' | 'true' | 'false' = 'all';

  sortBy: keyof User | 'createdAt' = 'createdAt';
  sortOrder: 'asc' | 'desc' = 'desc';

  currentPage = 1;
  itemsPerPage = 10;
  totalItems = 0;

  selectedItems: string[] = [];
  selectAll = false;

  roles = [
    { value: 'admin', label: 'Administrador' },
    { value: 'editor', label: 'Editor' },
    { value: 'viewer', label: 'Visualizador' },
  ];

  constructor(
    private router: Router,
    private userService: UserService,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.loading = true;
    this.userService
      .getAll()
      .pipe(finalize(() => (this.loading = false)))
      .subscribe({
        next: (data: User[]) => {
          this.users = data.map(u => ({
            ...u,
            isActive: typeof u.isActive === 'boolean' ? u.isActive : !!u['isActive'],
          }));
          this.applyFilters();
        },
        error: (err: HttpErrorResponse) => {
          console.error('Erro ao carregar usuários:', err);
          this.toastr.error('Erro ao carregar usuários.', 'Erro');
        },
      });
  }

  // ---------- FILTERS / SEARCH ----------
  onSearchInput(): void {
    if (this.searchDebounceTimer) clearTimeout(this.searchDebounceTimer);
    this.searchDebounceTimer = setTimeout(() => this.applyFilters(), 250);
  }

  onSearch(): void {
    this.applyFilters();
  }

  applyFilters(): void {
    let filtered = [...this.users];

    if (this.searchTerm?.trim()) {
      const term = this.searchTerm.trim().toLowerCase();
      filtered = filtered.filter(u =>
        (u.username || '').toLowerCase().includes(term) ||
        (u.email || '').toLowerCase().includes(term)
      );
    }

    if (this.roleFilter !== 'all') filtered = filtered.filter(u => u.role === this.roleFilter);
    if (this.isActiveFilter === 'true') filtered = filtered.filter(u => u.isActive);
    if (this.isActiveFilter === 'false') filtered = filtered.filter(u => !u.isActive);

    filtered.sort((a, b) => this.dynamicSort(a, b, this.sortBy, this.sortOrder));

    this.filteredUsers = filtered;
    this.totalItems = filtered.length;
    this.currentPage = 1;
    this.selectedItems = [];
    this.selectAll = false;
  }

  private dynamicSort(a: any, b: any, field: any, order: 'asc' | 'desc'): number {
    const aVal = this.resolveField(a, field);
    const bVal = this.resolveField(b, field);

    const aDate = this.tryParseDate(aVal);
    const bDate = this.tryParseDate(bVal);
    if (aDate && bDate) return order === 'asc' ? aDate.getTime() - bDate.getTime() : bDate.getTime() - aDate.getTime();

    const aStr = (aVal ?? '').toString().toLowerCase();
    const bStr = (bVal ?? '').toString().toLowerCase();
    if (aStr < bStr) return order === 'asc' ? -1 : 1;
    if (aStr > bStr) return order === 'asc' ? 1 : -1;
    return 0;
  }

  private resolveField(obj: any, field: any): any {
    return obj ? obj[field as keyof typeof obj] : undefined;
  }

  private tryParseDate(value: any): Date | null {
    if (!value) return null;
    const d = new Date(value);
    return isNaN(d.getTime()) ? null : d;
  }

  // ---------- PAGINATION ----------
  get paginatedUsers(): User[] {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    return this.filteredUsers.slice(start, start + this.itemsPerPage);
  }

  get totalPages(): number {
    return Math.max(1, Math.ceil(this.totalItems / this.itemsPerPage));
  }

  get pagesArray(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  onPageChange(page: number): void {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
    this.selectAll = this.paginatedUsers.every(u => this.selectedItems.includes(u.id));
  }

  onItemsPerPageChange(): void {
    this.currentPage = 1;
  }

  getMin(a: number, b: number): number {
    return Math.min(a, b);
  }

  // ---------- SELECTION ----------
  toggleSelectAll(event: Event): void {
    const checked = (event.target as HTMLInputElement).checked;
    this.selectAll = checked;
    if (checked) {
      this.selectedItems = Array.from(new Set([...this.selectedItems, ...this.paginatedUsers.map(u => u.id)]));
    } else {
      const pageIds = this.paginatedUsers.map(u => u.id);
      this.selectedItems = this.selectedItems.filter(id => !pageIds.includes(id));
    }
  }

  toggleItemSelection(id: string): void {
    const idx = this.selectedItems.indexOf(id);
    if (idx > -1) this.selectedItems.splice(idx, 1);
    else this.selectedItems.push(id);
    this.selectAll = this.paginatedUsers.every(u => this.selectedItems.includes(u.id));
  }

  isSelected(id: string): boolean {
    return this.selectedItems.includes(id);
  }

  // ---------- ACTIONS ----------
  createUser(): void {
    this.router.navigate(['/admin/users/new']);
  }

  editUser(id: string): void {
    this.router.navigate(['/admin/users/edit', id]);
  }

  async deleteUser(id: string): Promise<void> {
    const result = await Swal.fire({
      title: 'Excluir usuário?',
      text: 'Tem certeza que deseja excluir este usuário?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sim, excluir',
      cancelButtonText: 'Cancelar',
    });

    if (!result.isConfirmed) return;

    this.userService.bulkDelete([id]).subscribe({
      next: () => {
        this.loadUsers();
        this.toastr.success('Usuário excluído com sucesso!', 'Sucesso');
      },
      error: (err: HttpErrorResponse) => {
        console.error('Erro ao excluir usuário:', err);
        this.toastr.error('Erro ao excluir usuário.', 'Erro');
      },
    });
  }

  async bulkDelete(): Promise<void> {
    if (!this.selectedItems.length) return;

    const result = await Swal.fire({
      title: 'Excluir usuários?',
      text: `Tem certeza que deseja excluir ${this.selectedItems.length} usuário(s)?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sim, excluir',
      cancelButtonText: 'Cancelar',
    });

    if (!result.isConfirmed) return;

    this.userService.bulkDelete(this.selectedItems).subscribe({
      next: () => {
        this.loadUsers();
        this.selectedItems = [];
        this.selectAll = false;
        this.toastr.success('Usuários excluídos com sucesso!', 'Sucesso');
      },
      error: (err: HttpErrorResponse) => {
        console.error('Erro ao excluir usuários:', err);
        this.toastr.error('Erro ao excluir usuários.', 'Erro');
      },
    });
  }

  bulkActivate(): void {
    if (!this.selectedItems.length) return;
    this.userService.bulkToggle(this.selectedItems, true).subscribe({
      next: () => {
        this.loadUsers();
        this.selectedItems = [];
        this.selectAll = false;
        this.toastr.success('Usuários ativados com sucesso!', 'Sucesso');
      },
      error: (err: HttpErrorResponse) => {
        console.error('Erro ao ativar usuários:', err);
        this.toastr.error('Erro ao ativar usuários.', 'Erro');
      },
    });
  }

  bulkDeactivate(): void {
    if (!this.selectedItems.length) return;
    this.userService.bulkToggle(this.selectedItems, false).subscribe({
      next: () => {
        this.loadUsers();
        this.selectedItems = [];
        this.selectAll = false;
        this.toastr.success('Usuários desativados com sucesso!', 'Sucesso');
      },
      error: (err: HttpErrorResponse) => {
        console.error('Erro ao desativar usuários:', err);
        this.toastr.error('Erro ao desativar usuários.', 'Erro');
      },
    });
  }

  async toggleSingleStatus(user: User): Promise<void> {
    const action = user.isActive ? 'desativar' : 'ativar';

    const result = await Swal.fire({
      title: `${action === 'ativar' ? 'Ativar' : 'Desativar'} usuário?`,
      text: `Deseja realmente ${action} o usuário ${user.username}?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sim',
      cancelButtonText: 'Cancelar',
    });

    if (!result.isConfirmed) return;

    this.userService.toggleActive(user.id).subscribe({
      next: () => {
        this.loadUsers();
        this.toastr.success(`Usuário ${action} com sucesso!`, 'Sucesso');
      },
      error: (err: HttpErrorResponse) => {
        console.error(`Erro ao ${action} usuário:`, err);
        this.toastr.error(`Erro ao ${action} usuário.`, 'Erro');
      },
    });
  }

  // ---------- UTIL / UI ----------
  formatDate(dateString: string | Date | undefined): string {
    if (!dateString) return '';
    try {
      return new Date(dateString).toLocaleDateString('pt-BR');
    } catch {
      return String(dateString);
    }
  }

  getRoleText(role: string | undefined): string {
    switch (role) {
      case 'admin': return 'Administrador';
      case 'editor': return 'Editor';
      case 'viewer': return 'Visualizador';
      default: return role ?? 'Desconhecido';
    }
  }

  sortIcon(field: string): string {
    if (this.sortBy !== (field as any)) return 'bi-arrow-down-up';
    return this.sortOrder === 'asc' ? 'bi-arrow-up' : 'bi-arrow-down';
  }

  onSort(field: keyof User | 'createdAt'): void {
    if (this.sortBy === field) this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
    else {
      this.sortBy = field;
      this.sortOrder = 'desc';
    }
    this.applyFilters();
  }

  clearFilters(): void {
    this.searchTerm = '';
    this.roleFilter = 'all';
    this.isActiveFilter = 'all';
    this.itemsPerPage = 10;
    this.applyFilters();
  }
}
