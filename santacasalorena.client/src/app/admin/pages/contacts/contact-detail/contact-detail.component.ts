import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Contact } from '../../../../models/contact';
import { ContactService } from '../../../../services/contact.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-contact-detail',
  standalone: false,
  templateUrl: './contact-detail.component.html',
  styleUrls: ['./contact-detail.component.css']
})
export class ContactDetailComponent implements OnInit {
  loading = true;
  contact?: Contact;
  contactId?: string;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private contactService: ContactService
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.contactId = params['id'];
        if (this.contactId)
          this.loadContact(this.contactId);
      }
    });
  }

  loadContact(id: string): void {
    this.loading = true;
    this.contactService.getContact(id).subscribe({
      next: (data) => {
        this.contact = data;
        this.loading = false;
      },
      error: (error: HttpErrorResponse) => {
        console.error('Erro ao carregar contato:', error);
        this.loading = false;
        // Optionally, navigate back or show an error message
      }
    });
  }

  markAsRead(): void {
    if (this.contact && !this.contact.isRead) {
      this.contactService.markAsRead(this.contact.id).subscribe({
        next: () => {
          if (this.contact) {
            this.contact.isRead = true;
            this.contact.readAt = new Date().toISOString();
          }
        },
        error: (error: HttpErrorResponse) => {
          console.error('Erro ao marcar contato como lido:', error);
        }
      });
    }
  }

  deleteContact(): void {
    if (this.contact && confirm('Tem certeza que deseja excluir este contato?')) {
      this.contactService.deleteContact(this.contact.id).subscribe({
        next: () => {
          console.log(`Contact ${this.contact?.id} deleted.`);
          this.router.navigate(['/admin/contacts']);
        },
        error: (error: HttpErrorResponse) => {
          console.error('Erro ao excluir contato:', error);
        }
      });
    }
  }

  goBack(): void {
    this.router.navigate(['/admin/contacts']);
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
}

