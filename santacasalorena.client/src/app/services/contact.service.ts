import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Contact } from '../models/contact';


@Injectable({
  providedIn: 'root'
})
export class ContactService {
  private apiUrl = '/api/contacts';

  constructor(private http: HttpClient) { }

  // MANTENHA estes métodos (eles vão servir para números de telefone):
  getContacts(): Observable<Contact[]> {
    return this.http.get<Contact[]>(this.apiUrl);
  }

  getContact(id: string): Observable<Contact> {
    return this.http.get<Contact>(`${this.apiUrl}/${id}`);
  }

  createContact(contact: Contact): Observable<Contact> {
    return this.http.post<Contact>(this.apiUrl, contact);
  }

  updateContact(id: string, contact: Contact): Observable<Contact> {
    return this.http.put<Contact>(`${this.apiUrl}/${id}`, contact);
  }

  deleteContact(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  // ADICIONE estes novos métodos:
  toggleActive(id: string): Observable<Contact> {
    return this.http.patch<Contact>(`${this.apiUrl}/${id}/toggle-active`, {});
  }

  getContactsByLocation(location: string): Observable<Contact[]> {
    return this.http.get<Contact[]>(`${this.apiUrl}/location/${location}`);
  }

  // COMENTE ou REMOVA estes métodos antigos:
  /*
  markAsRead(id: string): Observable<Contact> {
    return this.http.patch<Contact>(`${this.apiUrl}/${id}/read`, {});
  }

  markAsUnread(id: string): Observable<Contact> {
    return this.http.patch<Contact>(`${this.apiUrl}/${id}/unread`, {});
  }
  */
}

