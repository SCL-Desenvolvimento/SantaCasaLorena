import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FeedbackService {
  private apiUrl = `${environment.apiUrl}/feedback`; 

  constructor(private http: HttpClient) { }

  enviarContato(dto: any): Observable<string> {
    return this.http.post<string>(`${this.apiUrl}/contato`, dto);
  }

  trabalheConosco(dto: any): Observable<string> {
    return this.http.post<string>(`${this.apiUrl}/trabalhe-conosco`, dto);
  }

  pesquisa(dto: any): Observable<string> {
    return this.http.post<string>(`${this.apiUrl}/pesquisa`, dto);
  }
}
