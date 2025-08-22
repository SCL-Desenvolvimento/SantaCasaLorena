import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../models/user';
import { News } from '../models/news';
//import { Service } from '../models/service';
import { Agreement } from '../models/agreement';
import { Contact } from '../models/contact';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl = '/api';
  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    }),
    withCredentials: true
  };

  constructor(private http: HttpClient) { }

  // Auth methods
  checkAuth(): Observable<{ authenticated: boolean, admin: User }> {
    return this.http.get<{ authenticated: boolean, admin: User }>(`${this.baseUrl}/auth/check`, this.httpOptions);
  }

  logout(): Observable<any> {
    return this.http.post(`${this.baseUrl}/auth/logout`, {}, this.httpOptions);
  }

  // News methods
  getAdminNews(page: number = 1, perPage: number = 10): Observable<{ news: News[], total: number, pages: number, current_page: number }> {
    return this.http.get<{ news: News[], total: number, pages: number, current_page: number }>(`${this.baseUrl}/admin/news?page=${page}&per_page=${perPage}`, this.httpOptions);
  }

  createNews(news: any): Observable<News> {
    return this.http.post<News>(`${this.baseUrl}/news`, news, this.httpOptions);
  }

  updateNews(id: string, news: any): Observable<News> {
    return this.http.put<News>(`${this.baseUrl}/news/${id}`, news, this.httpOptions);
  }

  deleteNews(id: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.baseUrl}/news/${id}`, this.httpOptions);
  }

  // Services methods
  //getAdminServices(): Observable<Service[]> {
  //  return this.http.get<Service[]>(`${this.baseUrl}/admin/services`, this.httpOptions);
  //}

  //createService(service: any): Observable<Service> {
  //  return this.http.post<Service>(`${this.baseUrl}/services`, service, this.httpOptions);
  //}

  //updateService(id: number, service: any): Observable<Service> {
  //  return this.http.put<Service>(`${this.baseUrl}/services/${id}`, service, this.httpOptions);
  //}

  deleteService(id: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.baseUrl}/services/${id}`, this.httpOptions);
  }

  // Convenios methods
  getAdminConvenios(): Observable<Agreement[]> {
    return this.http.get<Agreement[]>(`${this.baseUrl}/admin/convenios`, this.httpOptions);
  }

  createConvenio(convenio: any): Observable<Agreement> {
    return this.http.post<Agreement>(`${this.baseUrl}/convenios`, convenio, this.httpOptions);
  }

  updateConvenio(id: number, convenio: any): Observable<Agreement> {
    return this.http.put<Agreement>(`${this.baseUrl}/convenios/${id}`, convenio, this.httpOptions);
  }

  deleteConvenio(id: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.baseUrl}/convenios/${id}`, this.httpOptions);
  }

  // Contacts methods
  getAdminContacts(): Observable<{ contacts: any[] }> {
    return this.http.get<{ contacts: Contact[] }>(`${this.baseUrl}/admin/contacts`, this.httpOptions);
  }

  markContactAsRead(id: string): Observable<Contact> {
    return this.http.put<Contact>(`${this.baseUrl}/contacts/${id}/read`, {}, this.httpOptions);
  }

  deleteContact(id: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.baseUrl}/contacts/${id}`, this.httpOptions);
  }
}
