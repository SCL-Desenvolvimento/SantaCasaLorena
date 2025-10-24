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
      map(response => response.map(item => ({
        ...item,
        fileUrl: `${environment.imageServerUrl}${item.fileUrl}`
      }))),
      catchError(this.handleError)
    );
  }

  getById(id: string): Observable<TransparencyPortal> {
    return this.http.get<TransparencyPortal>(`${this.apiUrl}/${id}`).pipe(
      map(response => ({
        ...response,
        fileUrl: `${environment.imageServerUrl}${response.fileUrl}`
      })),
      catchError(this.handleError)
    );
  }

  create(dto: FormData): Observable<TransparencyPortal> {
    return this.http.post<TransparencyPortal>(this.apiUrl, dto).pipe(
      catchError(this.handleError)
    );
  }

  update(id: string, dto: FormData): Observable<TransparencyPortal> {
    return this.http.put<TransparencyPortal>(`${this.apiUrl}/${id}`, dto).pipe(
      catchError(this.handleError)
    );
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  toggleActive(id: string): Observable<TransparencyPortal> {
    return this.http.patch<TransparencyPortal>(`${this.apiUrl}/${id}/toggle-active`, {}).pipe(
      catchError(this.handleError)
    );;
  }

  bulkDelete(ids: string[]): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/bulk-delete`, ids).pipe(
      catchError(this.handleError)
    );;
  }

  bulkToggle(ids: string[], activate: boolean): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/bulk-toggle`, { ids, activate }).pipe(
      catchError(this.handleError)
    );;
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

