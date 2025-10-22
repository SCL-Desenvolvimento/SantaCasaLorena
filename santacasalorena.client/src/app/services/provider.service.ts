import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, map, Observable, throwError } from 'rxjs';
import { environment } from '../../environments/environment';
import { Providers } from '../models/provider';

@Injectable({
  providedIn: 'root',
})
export class ProviderService {
  private apiUrl = `${environment.apiUrl}/providers`;

  constructor(private http: HttpClient) { }

  getAll(): Observable<Providers[]> {
    return this.http.get<Providers[]>(this.apiUrl).pipe(
      map(response =>
        response.map(item => ({
          ...item,
          imageUrl: item.imageUrl
            ? `${environment.imageServerUrl}${item.imageUrl}`
            : ''
        }))
      ),
      catchError(this.handleError)
    );
  }

  getById(id: string): Observable<Providers> {
    return this.http.get<Providers>(`${this.apiUrl}/${id}`).pipe(
      map(response => ({
        ...response,
        imageUrl: response.imageUrl
          ? `${environment.imageServerUrl}${response.imageUrl}`
          : ''
      })),
      catchError(this.handleError)
    );
  }

  // 👇 Ajustado para aceitar FormData
  create(formData: FormData): Observable<Providers> {
    return this.http.post<Providers>(this.apiUrl, formData).pipe(
      catchError(this.handleError)
    );
  }

  // 👇 Ajustado para aceitar FormData também
  update(id: string, formData: FormData): Observable<Providers> {
    return this.http.put<Providers>(`${this.apiUrl}/${id}`, formData).pipe(
      catchError(this.handleError)
    );
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'Ocorreu um erro. Tente novamente mais tarde.';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Erro: ${error.error.message}`;
    } else if (error.error?.error) {
      errorMessage = error.error.error;
    } else if (typeof error.error === 'string') {
      errorMessage = error.error;
    }
    return throwError(() => new Error(errorMessage));
  }
}
