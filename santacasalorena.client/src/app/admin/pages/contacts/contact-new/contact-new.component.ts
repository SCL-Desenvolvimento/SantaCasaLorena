import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Contact } from '../../../../models/contact';
import { ContactService } from '../../../../services/contact.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-contact-new',
  standalone: false,
  templateUrl: './contact-new.component.html',
  styleUrls: ['./contact-new.component.css']
})
export class ContactNewComponent {
  loading = false;
  contact: Partial<Contact> = {
    title: '',
    phoneNumber: '',
    description: '',
    pageLocation: 'footer',
    category: 'comercial',
    isActive: true,
    order: 1
  };

  locations = [
    { value: 'header', label: 'Header' },
    { value: 'footer', label: 'Footer' },
    { value: 'contato', label: 'Página Contato' },
    { value: 'sobre', label: 'Página Sobre' },
    { value: 'home', label: 'Home' },
    { value: 'servicos', label: 'Serviços' }
  ];

  categories = [
    { value: 'comercial', label: 'Comercial' },
    { value: 'suporte', label: 'Suporte' },
    { value: 'emergencia', label: 'Emergência' },
    { value: 'whatsapp', label: 'WhatsApp' },
    { value: 'vendas', label: 'Vendas' },
    { value: 'financeiro', label: 'Financeiro' },
    { value: 'outros', label: 'Outros' }
  ];

  constructor(
    private contactService: ContactService,
    private router: Router
  ) { }

  onSubmit(): void {
    this.loading = true;

    this.contactService.createContact(this.contact as Contact).subscribe({
      next: (newContact) => {
        this.loading = false;
        this.router.navigate(['/admin/contacts']);
      },
      error: (error: HttpErrorResponse) => {
        console.error('Erro ao criar número:', error);
        this.loading = false;
        alert('Erro ao criar número. Tente novamente.');
      }
    });
  }

  onCancel(): void {
    this.router.navigate(['/admin/contacts']);
  }

  formatPhoneNumber(event: any): void {
    let value = event.target.value.replace(/\D/g, '');

    if (value.length <= 11) {
      if (value.length === 11) {
        value = value.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
      } else if (value.length === 10) {
        value = value.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
      } else if (value.length > 6) {
        value = value.replace(/(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3');
      } else if (value.length > 2) {
        value = value.replace(/(\d{2})(\d{0,5})/, '($1) $2');
      } else if (value.length > 0) {
        value = value.replace(/(\d{0,2})/, '($1');
      }
    }

    this.contact.phoneNumber = value;
  }
}
