import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, map, Observable, throwError } from 'rxjs';
import { environment } from '../../environments/environment';
import { Agreement } from '../models/agreement';

@Injectable({
  providedIn: 'root',
})
export class AgreementService {
  private apiUrl = `${environment.apiUrl}/agreements`;

  constructor(private http: HttpClient) { }

  getAll(): Observable<Agreement[]> {
    return this.http.get<Agreement[]>(this.apiUrl).pipe(
      map(response => response.map(item => ({
        ...item,
        imageUrl: `${environment.imageServerUrl}${item.imageUrl}`
      }))),
      catchError(this.handleError)
    );
  }

  getById(id: string): Observable<Agreement> {
    return this.http.get<Agreement>(`${this.apiUrl}/${id}`).pipe(
      map(response => ({
        ...response,
        imageUrl: `${environment.imageServerUrl}${response.imageUrl}`
      })),
      catchError(this.handleError)
    );
  }

  create(dto: FormData): Observable<Agreement> {
    return this.http.post<Agreement>(this.apiUrl, dto).pipe(
      catchError(this.handleError)
    );
  }

  update(id: string, dto: FormData): Observable<Agreement> {
    return this.http.put<Agreement>(`${this.apiUrl}/${id}`, dto).pipe(
      catchError(this.handleError)
    );
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  updateAgreementStatus(id: string, status: boolean): Observable<void> {
    return this.http.patch<void>(`${this.apiUrl}/${id}/status`, { status }).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'Ocorreu um erro. Tente novamente mais tarde.';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Erro: ${error.error.message}`;
    } else {
      errorMessage = error.error?.message || error.statusText || errorMessage;
    }
    return throwError(() => new Error(errorMessage));
  }
}

