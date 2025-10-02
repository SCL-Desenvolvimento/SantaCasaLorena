import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../../../../models/user';
import { UserService } from '../../../../services/user.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-user-list',
  standalone: false,
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit {
  loading = true;
  users: User[] = [];
  filteredUsers: User[] = [];

  // Filters
  searchTerm = '';
  roleFilter = 'all'; // all, admin, editor, viewer
  statusFilter = 'all'; // all, active, inactive
  sortBy = 'createdAt';
  sortOrder: 'asc' | 'desc' = 'desc';

  // Pagination
  currentPage = 1;
  itemsPerPage = 10;
  totalItems = 0;

  // Selection
  selectedItems: string[] = [];
  selectAll = false;

  roles = [
    { value: 'admin', label: 'Administrador' },
    { value: 'editor', label: 'Editor' },
    { value: 'viewer', label: 'Visualizador' }
  ];

  constructor(private router: Router, private userService: UserService) { }

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.loading = true;
    this.userService.getAll().subscribe({
      next: (data: User[]) => {
        this.users = data;
        this.applyFilters();
        this.loading = false;
      },
      error: (error: HttpErrorResponse) => {
        console.error("Erro ao carregar usuários:", error);
        alert("Erro ao carregar usuários.");
        this.loading = false;
      }
    });
  }

  applyFilters(): void {
    let filtered = [...this.users];

    // Search filter
    if (this.searchTerm) {
      filtered = filtered.filter(item =>
        item.username.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        item.email.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }

    // Role filter
    if (this.roleFilter !== 'all') {
      //filtered = filtered.filter(item => item.role === this.roleFilter);
    }

    // Status filter
    if (this.statusFilter !== 'all') {
      //filtered = filtered.filter(item => item.status === this.statusFilter);
    }

    // Sort
    filtered.sort((a, b) => {
      let aValue = a[this.sortBy as keyof User] ?? '';
      let bValue = b[this.sortBy as keyof User] ?? '';

      if (typeof aValue === 'string') aValue = aValue.toLowerCase();
      if (typeof bValue === 'string') bValue = bValue.toLowerCase();

      if (aValue < bValue) return this.sortOrder === 'asc' ? -1 : 1;
      if (aValue > bValue) return this.sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    this.filteredUsers = filtered;
    this.totalItems = filtered.length;
    this.currentPage = 1;
  }

  get paginatedUsers(): User[] {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    return this.filteredUsers.slice(start, end);
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
      this.selectedItems = this.paginatedUsers.map(item => item.id);
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
    this.selectAll = this.selectedItems.length === this.paginatedUsers.length;
  }

  isSelected(id: string): boolean {
    return this.selectedItems.includes(id);
  }

  createUser(): void {
    this.router.navigate(['/admin/users/new']);
  }

  editUser(id: string): void {
    this.router.navigate(['/admin/users/edit', id]);
  }

  deleteUser(id: string): void {
    if (confirm("Tem certeza que deseja excluir este usuário?")) {
      this.userService.delete(id).subscribe({
        next: () => {
          this.users = this.users.filter(item => item.id !== id);
          this.selectedItems = this.selectedItems.filter(selectedId => selectedId !== id);
          this.applyFilters();
          alert("Usuário excluído com sucesso!");
        },
        error: (error: HttpErrorResponse) => {
          console.error("Erro ao excluir usuário:", error);
          alert("Erro ao excluir usuário.");
        }
      });
    }
  }

  bulkDelete(): void {
    if (this.selectedItems.length === 0) return;

    if (confirm(`Tem certeza que deseja excluir ${this.selectedItems.length} usuário(s)?`)) {
      this.selectedItems.forEach(id => {
        this.userService.delete(id).subscribe({
          next: () => {
            this.users = this.users.filter(item => item.id !== id);
            this.applyFilters();
          },
          error: (error: HttpErrorResponse) => {
            console.error(`Erro ao excluir usuário ${id}:`, error);
            alert(`Erro ao excluir usuário ${id}.`);
          }
        });
      });
      this.selectedItems = [];
      this.selectAll = false;
      alert("Usuários excluídos com sucesso!");
      this.loadUsers(); // Reload all items to ensure UI consistency
    }
  }

  bulkActivate(): void {
    if (this.selectedItems.length === 0) return;

    this.selectedItems.forEach(id => {
      this.userService.updateUserStatus(id, 'active').subscribe({
        next: () => {
          // User status will be updated when all users are reloaded
        },
        error: (error: HttpErrorResponse) => {
          console.error(`Erro ao ativar usuário ${id}:`, error);
          alert(`Erro ao ativar usuário ${id}.`);
        }
      });
    });

    this.selectedItems = [];
    this.selectAll = false;
    alert("Usuários ativados com sucesso!");
    this.loadUsers(); // Reload all items to ensure UI consistency
  }

  bulkDeactivate(): void {
    if (this.selectedItems.length === 0) return;

    this.selectedItems.forEach(id => {
      this.userService.updateUserStatus(id, 'inactive').subscribe({
        next: () => {
          // User status will be updated when all users are reloaded
        },
        error: (error: HttpErrorResponse) => {
          console.error(`Erro ao desativar usuário ${id}:`, error);
          alert(`Erro ao desativar usuário ${id}.`);
        }
      });
    });

    this.selectedItems = [];
    this.selectAll = false;
    alert("Usuários desativados com sucesso!");
    this.loadUsers(); // Reload all items to ensure UI consistency
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('pt-BR');
  }

  getRoleText(role: string): string {
    switch (role) {
      case 'admin': return 'Administrador';
      case 'editor': return 'Editor';
      case 'viewer': return 'Visualizador';
      default: return 'Desconhecido';
    }
  }

  getStatusBadgeClass(status: string): string {
    switch (status) {
      case 'active': return 'bg-success';
      case 'inactive': return 'bg-danger';
      default: return 'bg-secondary';
    }
  }

  getStatusText(status: string): string {
    switch (status) {
      case 'active': return 'Ativo';
      case 'inactive': return 'Inativo';
      default: return 'Desconhecido';
    }
  }

  getMin(a: number, b: number): number {
    return Math.min(a, b);
  }
}

