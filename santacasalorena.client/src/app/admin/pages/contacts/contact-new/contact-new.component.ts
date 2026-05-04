import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Contact } from '../../../../models/contact';
import { ContactService } from '../../../../services/contact.service';
import { HttpErrorResponse } from '@angular/common/http';
import Swal from 'sweetalert2';
import { ToastrService } from 'ngx-toastr';

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
    private route: ActivatedRoute,
    private toastr: ToastrService
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
        this.loading = false;
        this.toastr.error('Erro ao carregar o contato.', 'Erro');
        this.router.navigate(['/admin/contacts']);
      }
    });
  }

  onSubmit(): void {
    this.loading = true;

    if (this.isEditMode && this.contactId) {
      this.contactService.updateContact(this.contactId, this.contact as Contact).subscribe({
        next: () => {
          this.loading = false;
          Swal.fire({
            icon: 'success',
            title: 'Atualizado!',
            text: 'Contato atualizado com sucesso.'
          }).then(() => this.router.navigate(['/admin/contacts']));
        },
        error: (error: HttpErrorResponse) => {
          this.loading = false;
          Swal.fire('Erro', 'Erro ao atualizar o contato. Tente novamente.', 'error');
        }
      });
    } else {
      this.contactService.createContact(this.contact as Contact).subscribe({
        next: () => {
          this.loading = false;
          Swal.fire({
            icon: 'success',
            title: 'Criado!',
            text: 'Contato criado com sucesso.'
          }).then(() => this.router.navigate(['/admin/contacts']));
        },
        error: (error: HttpErrorResponse) => {
          this.loading = false;
          Swal.fire('Erro', 'Erro ao criar o contato. Tente novamente.', 'error');
        }
      });
    }
  }

  onCancel(): void {
    Swal.fire({
      title: 'Tem certeza que deseja cancelar?',
      text: 'As alterações não serão salvas!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sim, cancelar',
      cancelButtonText: 'Voltar'
    }).then(result => {
      if (result.isConfirmed) {
        this.router.navigate(['/admin/contacts']);
      }
    });
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
