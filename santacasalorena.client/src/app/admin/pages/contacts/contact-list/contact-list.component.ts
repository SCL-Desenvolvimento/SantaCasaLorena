import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ContactService } from '../../../../services/contact.service';
import { Contact } from '../../../../models/contact';

@Component({
  selector: 'app-contact-list',
  standalone: false,
  templateUrl: './contact-list.component.html',
  styleUrl: './contact-list.component.css'
})
export class ContactListComponent implements OnInit {
  contacts: Contact[] = [];
  filteredContacts: Contact[] = [];
  searchTerm: string = '';
  statusFilter: string = 'all';

  loading: boolean = true;
  selectedItems: string[] = [];

  constructor(private contactService: ContactService, private router: Router) { }

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
      error: (err) => {
        console.error('Erro ao carregar contatos', err);
        this.loading = false;
      }
    });
  }

  applyFilters(): void {
    this.filteredContacts = this.contacts.filter(contact => {
      const matchesSearch = contact.title.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        contact.phoneNumber.includes(this.searchTerm);
      const matchesStatus = this.statusFilter === 'all' ||
        (this.statusFilter === 'active' && contact.isActive) ||
        (this.statusFilter === 'inactive' && !contact.isActive);
      return matchesSearch && matchesStatus;
    });
  }

  onSearch(): void {
    this.applyFilters();
  }

  onFilterChange(): void {
    this.applyFilters();
  }

  clearFilters(): void {
    this.searchTerm = '';
    this.statusFilter = 'all';

    this.applyFilters();
  }

  createContact(): void {
    this.router.navigate(['/admin/contacts/new']);
  }

  editContact(id: string): void {
    this.router.navigate([`/admin/contacts/edit/${id}`]);
  }

  toggleActiveStatus(contact: Contact): void {
    this.contactService.toggleActive(contact.id).subscribe({
      next: (updated) => {
        contact.isActive = updated.isActive;
      },
      error: (err) => {
        console.error('Erro ao alterar status do contato', err);
      }
    });
  }

  deleteContact(id: string): void {
    if (!confirm('Deseja realmente excluir este contato?')) return;

    this.contactService.deleteContact(id).subscribe({
      next: () => {
        this.contacts = this.contacts.filter(c => c.id !== id);
        this.applyFilters();
      },
      error: (err) => console.error('Erro ao excluir contato', err)
    });
  }

  toggleAllSelection(): void {
    if (this.isAllSelected()) {
      this.selectedItems = [];
    } else {
      this.selectedItems = this.filteredContacts.map(contact => contact.id);
    }
  }

  toggleItemSelection(id: string): void {
    const index = this.selectedItems.indexOf(id);
    if (index > -1) {
      this.selectedItems.splice(index, 1);
    } else {
      this.selectedItems.push(id);
    }
  }

  isSelected(id: string): boolean {
    return this.selectedItems.includes(id);
  }

  isAllSelected(): boolean {
    return this.filteredContacts.length > 0 && this.selectedItems.length === this.filteredContacts.length;
  }

  bulkActivate(): void {
    if (this.selectedItems.length === 0) return;

    this.contactService.bulkToggle(this.selectedItems, true).subscribe({
      next: () => {
        this.contacts.forEach(c => {
          if (this.selectedItems.includes(c.id)) c.isActive = true;
        });
        this.applyFilters();
      },
      error: (err) => console.error('Erro ao ativar em massa', err)
    });
  }


  bulkDeactivate(): void {
    if (this.selectedItems.length === 0) return;

    this.contactService.bulkToggle(this.selectedItems, false).subscribe({
      next: () => {
        this.contacts.forEach(c => {
          if (this.selectedItems.includes(c.id)) c.isActive = false;
        });
        this.applyFilters();
      },
      error: (err) => console.error('Erro ao desativar em massa', err)
    });
  }

  bulkDelete(): void {
    if (this.selectedItems.length === 0) return;
    if (!confirm('Deseja realmente excluir os contatos selecionados?')) return;

    this.contactService.bulkDelete(this.selectedItems).subscribe({
      next: () => {
        this.contacts = this.contacts.filter(c => !this.selectedItems.includes(c.id));
        this.selectedItems = [];
        this.applyFilters();
      },
      error: (err) => console.error('Erro ao excluir em massa', err)
    });
  }
}

