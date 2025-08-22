import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, map, Observable, throwError } from 'rxjs';
import { environment } from '../../environments/environment';
import { Specialty } from '../models/specialty';

@Injectable({
  providedIn: 'root'
})
export class SpecialtyService {
  private apiUrl = `${environment.apiUrl}/specialties`;

  constructor(private http: HttpClient) { }

  getAll(): Observable<Specialty[]> {
    return this.http.get<Specialty[]>(this.apiUrl).pipe(
      map(r => r),
      catchError(this.handleError)
    );
  }

  getById(id: string): Observable<Specialty> {
    return this.http.get<Specialty>(`${this.apiUrl}/${id}`).pipe(
      map(r => r),
      catchError(this.handleError)
    );
  }

  create(dto: any): Observable<Specialty> {
    return this.http.post<Specialty>(this.apiUrl, dto).pipe(
      catchError(this.handleError)
    );
  }

  update(id: string, dto: any): Observable<Specialty> {
    return this.http.put<Specialty>(`${this.apiUrl}/${id}`, dto).pipe(
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
