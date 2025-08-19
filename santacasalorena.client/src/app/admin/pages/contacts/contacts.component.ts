import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Contact } from '../../../models/contact';

@Component({
  selector: 'app-contacts',
  standalone: false,
  templateUrl: './contacts.component.html',
  styleUrl: './contacts.component.css'
})
export class ContactsComponent {
  @Input() contacts: Contact[] = [];
  @Output() markAsRead = new EventEmitter<number>();
  @Output() deleteContact = new EventEmitter<number>();

  onMarkAsRead(id: number) {
    this.markAsRead.emit(id);
  }

  onDeleteContact(id: number) {
    this.deleteContact.emit(id);
  }

  formatDate(dateString: string | undefined): string {
    if (!dateString) return '';

    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  }
}
