import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Contact } from '../../../../models/contact';
import { ContactService } from '../../../../services/contact.service';
import { HttpErrorResponse } from '@angular/common/http';
import { forkJoin } from 'rxjs';

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
  statusFilter = 'all'; // all, unread, read, replied
  priorityFilter = 'all';
  categoryFilter = 'all';
  sortBy = 'createdAt';
  sortOrder: 'asc' | 'desc' = 'desc';
  
  // Pagination
  currentPage = 1;
  itemsPerPage = 15;
  totalItems = 0;
  
  // Selection
  selectedItems: string[] = []; // Changed to string[] for contact IDs
  selectAll = false;
  
  categories = [
    'Dúvida',
    'Reclamação',
    'Sugestão',
    'Elogio',
    'Solicitação',
    'Informação',
    'Suporte Técnico',
    'Outros'
  ];

  priorities = [
    { value: 'low', label: 'Baixa', class: 'success' },
    { value: 'medium', label: 'Média', class: 'warning' },
    { value: 'high', label: 'Alta', class: 'danger' }
  ];

  constructor(private router: Router, private contactService: ContactService) {}

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
        // Tratar erro, talvez exibir uma mensagem para o usuário
        this.loading = false;
      }
    });
  }

  applyFilters(): void {
    let filtered = [...this.contacts];

    // Search filter
    if (this.searchTerm) {
      filtered = filtered.filter(item =>
        item.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        item.email.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        item.subject.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        item.message.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (this.statusFilter !== 'all') {
      filtered = filtered.filter(item => {
        switch (this.statusFilter) {
          case 'unread': return !item.isRead;
          case 'read': return item.isRead && !item.isReplied;
          case 'replied': return item.isReplied;
          default: return true;
        }
      });
    }

    // Priority filter
    if (this.priorityFilter !== 'all') {
      filtered = filtered.filter(item => item.priority === this.priorityFilter);
    }

    // Category filter
    if (this.categoryFilter !== 'all') {
      filtered = filtered.filter(item => item.category === this.categoryFilter);
    }

    // Sort
    filtered.sort((a, b) => {
      let aValue = a[this.sortBy as keyof Contact] ?? '';
      let bValue = b[this.sortBy as keyof Contact] ?? '';

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

  get unreadCount(): number {
    return this.contacts.filter(c => !c.isRead).length;
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
    this.contactService.markAsRead(id).subscribe({
      next: () => {
        const contact = this.contacts.find(c => c.id === id);
        if (contact) {
          contact.isRead = true;
          contact.readAt = new Date().toISOString();
        }
        this.router.navigate(['/admin/contacts', id]);
      },
      error: (error: HttpErrorResponse) => {
        console.error('Erro ao marcar contato como lido:', error);
        // Mesmo com erro, tenta navegar para a visualização
        this.router.navigate(['/admin/contacts', id]);
      }
    });
  }

  markAsRead(id: string): void {
    this.contactService.markAsRead(id).subscribe({
      next: () => {
        const contact = this.contacts.find(c => c.id === id);
        if (contact) {
          contact.isRead = true;
          contact.readAt = new Date().toISOString();
        }
        this.applyFilters();
      },
      error: (error: HttpErrorResponse) => {
        console.error('Erro ao marcar contato como lido:', error);
      }
    });
  }

  markAsUnread(id: string): void {
    this.contactService.markAsUnread(id).subscribe({
      next: () => {
        const contact = this.contacts.find(c => c.id === id);
        if (contact) {
          contact.isRead = false;
          contact.readAt = undefined;
        }
        this.applyFilters();
      },
      error: (error: HttpErrorResponse) => {
        console.error('Erro ao marcar contato como não lido:', error);
      }
    });
  }

  setPriority(id: string, priority: 'low' | 'medium' | 'high'): void {
    this.contactService.setPriority(id, priority).subscribe({
      next: () => {
        const contact = this.contacts.find(c => c.id === id);
        if (contact) {
          contact.priority = priority;
        }
        this.applyFilters();
      },
      error: (error: HttpErrorResponse) => {
        console.error('Erro ao definir prioridade:', error);
      }
    });
  }

  deleteContact(id: string): void {
    if (confirm('Tem certeza que deseja excluir este contato?')) {
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

  bulkMarkAsRead(): void {
    if (this.selectedItems.length === 0) return;
    
    forkJoin(this.selectedItems.map(id => this.contactService.markAsRead(id))).subscribe({
      next: () => {
        this.selectedItems.forEach(id => {
          const contact = this.contacts.find(c => c.id === id);
          if (contact) {
            contact.isRead = true;
            contact.readAt = new Date().toISOString();
          }
        });
        this.selectedItems = [];
        this.selectAll = false;
        this.applyFilters();
      },
      error: (error: HttpErrorResponse) => {
        console.error('Erro ao marcar contatos como lidos em massa:', error);
      }
    });
  }

  bulkMarkAsUnread(): void {
    if (this.selectedItems.length === 0) return;
    
    forkJoin(this.selectedItems.map(id => this.contactService.markAsUnread(id))).subscribe({
      next: () => {
        this.selectedItems.forEach(id => {
          const contact = this.contacts.find(c => c.id === id);
          if (contact) {
            contact.isRead = false;
            contact.readAt = undefined;
          }
        });
        this.selectedItems = [];
        this.selectAll = false;
        this.applyFilters();
      },
      error: (error: HttpErrorResponse) => {
        console.error('Erro ao marcar contatos como não lidos em massa:', error);
      }
    });
  }

  bulkDelete(): void {
    if (this.selectedItems.length === 0) return;
    
    if (confirm(`Tem certeza que deseja excluir ${this.selectedItems.length} contato(s)?`)) {
      forkJoin(this.selectedItems.map(id => this.contactService.deleteContact(id))).subscribe({
        next: () => {
          this.contacts = this.contacts.filter(c => !this.selectedItems.includes(c.id));
          this.selectedItems = [];
          this.selectAll = false;
          this.applyFilters();
        },
        error: (error: HttpErrorResponse) => {
          console.error('Erro ao excluir contatos em massa:', error);
        }
      });
    }
  }

  getPriorityLabel(priority: string): string {
    const p = this.priorities.find(pr => pr.value === priority);
    return p ? p.label : priority;
  }

  getPriorityClass(priority: string): string {
    const p = this.priorities.find(pr => pr.value === priority);
    return p ? p.class : 'secondary';
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

  getTimeAgo(dateString: string): string {
    const now = new Date();
    const date = new Date(dateString);
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Agora há pouco';
    if (diffInHours < 24) return `${diffInHours}h atrás`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d atrás`;
    
    const diffInWeeks = Math.floor(diffInDays / 7);
    if (diffInWeeks < 4) return `${diffInWeeks}sem atrás`;
    
    return this.formatDate(dateString);
  }

  getMin(a: number, b: number): number {
    return Math.min(a, b);
  }
}

