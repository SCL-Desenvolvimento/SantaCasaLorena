import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { TransparencyPortal } from '../models/transparencyPortal';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TransparencyPortalService {
  private apiUrl = `${environment.apiUrl}/transparencyportal`;

  constructor(private http: HttpClient) { }

  getAll(): Observable<TransparencyPortal[]> {
    return this.http.get<TransparencyPortal[]>(this.apiUrl).pipe(
      map(response => response),
      catchError(this.handleError)
    );
  }

  getById(id: string): Observable<TransparencyPortal> {
    return this.http.get<TransparencyPortal>(`${this.apiUrl}/${id}`).pipe(
      map(response => response),
      catchError(this.handleError)
    );
  }

  create(dto: any): Observable<TransparencyPortal> {
    return this.http.post<TransparencyPortal>(this.apiUrl, dto).pipe(
      catchError(this.handleError)
    );
  }

  update(id: string, dto: any): Observable<TransparencyPortal> {
    return this.http.put<TransparencyPortal>(`${this.apiUrl}/${id}`, dto).pipe(
      catchError(this.handleError)
    );
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'Erro inesperado.';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Erro: ${error.error.message}`;
    } else {
      errorMessage = error.error?.error || errorMessage;
    }
    return throwError(() => new Error(errorMessage));
  }
}
