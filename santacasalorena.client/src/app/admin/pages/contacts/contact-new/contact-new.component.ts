import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Contact } from '../../../../models/contact';
import { ContactService } from '../../../../services/contact.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-contact-new',
  standalone: false,
  templateUrl: './contact-new.component.html',
  styleUrls: ['./contact-new.component.css']
})
export class ContactNewComponent implements OnInit {
  loading = false;
  contactId?: string;
  isEditMode = false;

  contact: Partial<Contact> = {
    title: '',
    phoneNumber: '',
    description: '',
    isActive: true
  };

  constructor(
    private contactService: ContactService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const idParam = params.get('id');
      if (idParam) {
        this.contactId = idParam;
        this.isEditMode = true;
        this.loadContact(this.contactId);
      }
    });
  }

  private loadContact(id: string): void {
    this.loading = true;
    this.contactService.getContact(id).subscribe({
      next: (contact) => {
        this.contact = contact;
        this.loading = false;
      },
      error: (error: HttpErrorResponse) => {
        console.error('Erro ao carregar contato:', error);
        this.loading = false;
        alert('Erro ao carregar o contato. Verifique se o contato existe.');
        this.router.navigate(['/admin/contacts']);
      }
    });
  }

  onSubmit(): void {
    this.loading = true;

    if (this.isEditMode && this.contactId) {
      // Atualiza o contato existente
      this.contactService.updateContact(this.contactId, this.contact as Contact).subscribe({
        next: () => {
          this.loading = false;
          alert('Contato atualizado com sucesso!');
          this.router.navigate(['/admin/contacts']);
        },
        error: (error: HttpErrorResponse) => {
          console.error('Erro ao atualizar contato:', error);
          this.loading = false;
          alert('Erro ao atualizar contato. Tente novamente.');
        }
      });
    } else {
      // Cria um novo contato
      this.contactService.createContact(this.contact as Contact).subscribe({
        next: () => {
          this.loading = false;
          alert('Contato criado com sucesso!');
          this.router.navigate(['/admin/contacts']);
        },
        error: (error: HttpErrorResponse) => {
          console.error('Erro ao criar contato:', error);
          this.loading = false;
          alert('Erro ao criar contato. Tente novamente.');
        }
      });
    }
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
