import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ContactService } from '../../../../services/contact.service';
import { Contact } from '../../../../models/contact';
import Swal from 'sweetalert2';
import { ToastrService } from 'ngx-toastr';

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

  constructor(
    private contactService: ContactService,
    private router: Router,
    private toastr: ToastrService
  ) { }

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
      error: () => {
        this.toastr.error('Erro ao carregar os contatos', 'Erro');
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
        this.toastr.success('Status atualizado com sucesso', 'Sucesso');
      },
      error: () => this.toastr.error('Erro ao alterar status do contato', 'Erro')
    });
  }

  deleteContact(id: string): void {
    Swal.fire({
      title: 'Tem certeza?',
      text: 'Você não poderá reverter essa ação!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sim, excluir',
      cancelButtonText: 'Cancelar'
    }).then(result => {
      if (result.isConfirmed) {
        this.contactService.deleteContact(id).subscribe({
          next: () => {
            this.contacts = this.contacts.filter(c => c.id !== id);
            this.applyFilters();
            this.toastr.success('Contato excluído com sucesso!', 'Sucesso');
          },
          error: () => this.toastr.error('Erro ao excluir contato', 'Erro')
        });
      }
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
    if (this.selectedItems.length === 0) {
      this.toastr.warning('Nenhum item selecionado', 'Atenção');
      return;
    }

    this.contactService.bulkToggle(this.selectedItems, true).subscribe({
      next: () => {
        this.contacts.forEach(c => {
          if (this.selectedItems.includes(c.id)) c.isActive = true;
        });
        this.toastr.success('Contatos ativados com sucesso', 'Sucesso');
        this.applyFilters();
      },
      error: () => this.toastr.error('Erro ao ativar em massa', 'Erro')
    });
  }

  bulkDeactivate(): void {
    if (this.selectedItems.length === 0) {
      this.toastr.warning('Nenhum item selecionado', 'Atenção');
      return;
    }

    this.contactService.bulkToggle(this.selectedItems, false).subscribe({
      next: () => {
        this.contacts.forEach(c => {
          if (this.selectedItems.includes(c.id)) c.isActive = false;
        });
        this.toastr.success('Contatos desativados com sucesso', 'Sucesso');
        this.applyFilters();
      },
      error: () => this.toastr.error('Erro ao desativar em massa', 'Erro')
    });
  }

  bulkDelete(): void {
    if (this.selectedItems.length === 0) {
      this.toastr.warning('Nenhum item selecionado', 'Atenção');
      return;
    }

    Swal.fire({
      title: 'Excluir selecionados?',
      text: 'Essa ação não poderá ser desfeita!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sim, excluir',
      cancelButtonText: 'Cancelar'
    }).then(result => {
      if (result.isConfirmed) {
        this.contactService.bulkDelete(this.selectedItems).subscribe({
          next: () => {
            this.contacts = this.contacts.filter(c => !this.selectedItems.includes(c.id));
            this.selectedItems = [];
            this.applyFilters();
            this.toastr.success('Contatos excluídos com sucesso', 'Sucesso');
          },
          error: () => this.toastr.error('Erro ao excluir em massa', 'Erro')
        });
      }
    });
  }
}
