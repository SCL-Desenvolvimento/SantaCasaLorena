import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Contact } from '../../../../models/contact';
import { ContactService } from '../../../../services/contact.service';
import { HttpErrorResponse } from '@angular/common/http';
import { forkJoin, of } from 'rxjs';

@Component({
  selector: 'app-contact-list',
  standalone: false,
  templateUrl: './contact-list.component.html',
  styleUrls: ['./contact-list.component.css']
})
export class ContactListComponent implements OnInit {
  loading = true;
  contacts: Contact[] = [];
  filteredContacts: Contact[] = [];

  // Filters
  searchTerm = '';
  statusFilter = 'all'; // all, active, inactive
  locationFilter = 'all';
  categoryFilter = 'all';
  sortBy = 'order';
  sortOrder: 'asc' | 'desc' = 'asc';

  // Pagination
  currentPage = 1;
  itemsPerPage = 15;
  totalItems = 0;

  // Selection
  selectedItems: string[] = [];
  selectAll = false;

  locations = [
    'header',
    'footer',
    'contato',
    'sobre',
    'home',
    'servicos'
  ];

  categories = [
    'comercial',
    'suporte',
    'emergencia',
    'whatsapp',
    'vendas',
    'financeiro',
    'outros'
  ];

  statuses = [
    { value: 'active', label: 'Ativo', class: 'success' },
    { value: 'inactive', label: 'Inativo', class: 'secondary' }
  ];

  constructor(private router: Router, private contactService: ContactService) { }

  ngOnInit(): void {
    this.loadContacts();
  }

  loadContacts(): void {
    this.loading = true;
    this.contactService.getContacts().subscribe({
      next: (data) => {
        this.contacts = data;
        this.applyFilters();
        this.loading = false;
      },
      error: (error: HttpErrorResponse) => {
        console.error('Erro ao carregar contatos:', error);
        this.loading = false;
      }
    });
  }

  applyFilters(): void {
    let filtered = [...this.contacts];

    // Search filter
    if (this.searchTerm) {
      filtered = filtered.filter(item =>
        item.title.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        item.phoneNumber.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }

    // Status filter (active/inactive)
    if (this.statusFilter !== 'all') {
      filtered = filtered.filter(item => {
        switch (this.statusFilter) {
          case 'active': return item.isActive;
          case 'inactive': return !item.isActive;
          default: return true;
        }
      });
    }

    // Location filter
    if (this.locationFilter !== 'all') {
      filtered = filtered.filter(item => item.pageLocation === this.locationFilter);
    }

    // Category filter
    if (this.categoryFilter !== 'all') {
      filtered = filtered.filter(item => item.category === this.categoryFilter);
    }

    // Sort
    filtered.sort((a, b) => {
      let aValue = a[this.sortBy as keyof Contact];
      let bValue = b[this.sortBy as keyof Contact];

      if (typeof aValue === 'string') aValue = aValue.toLowerCase();
      if (typeof bValue === 'string') bValue = bValue.toLowerCase();

      if (aValue < bValue) return this.sortOrder === 'asc' ? -1 : 1;
      if (aValue > bValue) return this.sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    this.filteredContacts = filtered;
    this.totalItems = filtered.length;
    this.currentPage = 1;
  }

  get paginatedContacts(): Contact[] {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    return this.filteredContacts.slice(start, end);
  }

  get totalPages(): number {
    return Math.ceil(this.totalItems / this.itemsPerPage);
  }

  get activeCount(): number {
    return this.contacts.filter(c => c.isActive).length;
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

  toggleSelectAll(): void {
    if (this.selectAll) {
      this.selectedItems = this.paginatedContacts.map(item => item.id);
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
    this.selectAll = this.selectedItems.length === this.paginatedContacts.length;
  }

  isSelected(id: string): boolean {
    return this.selectedItems.includes(id);
  }

  viewContact(id: string): void {
    this.router.navigate(['/admin/contacts', id]);
  }

  toggleActive(id: string): void {
    this.contactService.toggleActive(id).subscribe({
      next: (updatedContact) => {
        const contact = this.contacts.find(c => c.id === id);
        if (contact) {
          contact.isActive = updatedContact.isActive;
        }
        this.applyFilters();
      },
      error: (error: HttpErrorResponse) => {
        console.error('Erro ao alterar status do contato:', error);
      }
    });
  }

  deleteContact(id: string): void {
    if (confirm('Tem certeza que deseja excluir este número de telefone?')) {
      this.contactService.deleteContact(id).subscribe({
        next: () => {
          this.contacts = this.contacts.filter(c => c.id !== id);
          this.applyFilters();
        },
        error: (error: HttpErrorResponse) => {
          console.error('Erro ao excluir contato:', error);
        }
      });
    }
  }

  // Métodos para ações em massa
  bulkActivate(): void {
    if (this.selectedItems.length === 0) return;

    forkJoin(this.selectedItems.map(id => this.contactService.toggleActive(id))).subscribe({
      next: () => {
        this.selectedItems.forEach(id => {
          const contact = this.contacts.find(c => c.id === id);
          if (contact) {
            contact.isActive = true;
          }
        });
        this.selectedItems = [];
        this.selectAll = false;
        this.applyFilters();
      },
      error: (error: HttpErrorResponse) => {
        console.error('Erro ao ativar contatos em massa:', error);
      }
    });
  }

  bulkDeactivate(): void {
    if (this.selectedItems.length === 0) return;

    forkJoin(this.selectedItems.map(id => {
      const contact = this.contacts.find(c => c.id === id);
      if (contact && contact.isActive) {
        return this.contactService.toggleActive(id);
      }
      return of(null);
    })).subscribe({
      next: () => {
        this.selectedItems.forEach(id => {
          const contact = this.contacts.find(c => c.id === id);
          if (contact) {
            contact.isActive = false;
          }
        });
        this.selectedItems = [];
        this.selectAll = false;
        this.applyFilters();
      },
      error: (error: HttpErrorResponse) => {
        console.error('Erro ao desativar contatos em massa:', error);
      }
    });
  }

  bulkDelete(): void {
    if (this.selectedItems.length === 0) return;

    if (confirm(`Tem certeza que deseja excluir ${this.selectedItems.length} número(s) de telefone?`)) {
      forkJoin(this.selectedItems.map(id => this.contactService.deleteContact(id))).subscribe({
        next: () => {
          this.contacts = this.contacts.filter(c => !this.selectedItems.includes(c.id));
          this.selectedItems = [];
          this.selectAll = false;
          this.applyFilters();
        },
        error: (error: HttpErrorResponse) => {
          console.error('Erro ao excluir números em massa:', error);
        }
      });
    }
  }

  // Métodos auxiliares para exibição
  getStatusLabel(isActive: boolean): string {
    return isActive ? 'Ativo' : 'Inativo';
  }

  getStatusClass(isActive: boolean): string {
    return isActive ? 'success' : 'secondary';
  }

  formatDate(dateString: string): string {
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
