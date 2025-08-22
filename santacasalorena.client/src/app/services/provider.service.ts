import { Injectable, Provider } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, map, Observable, throwError } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ProviderService {
  private apiUrl = `${environment.apiUrl}/providers`;

  constructor(private http: HttpClient) { }

  getAll(): Observable<Provider[]> {
    return this.http.get<Provider[]>(this.apiUrl).pipe(
      map(r => r),
      catchError(this.handleError)
    );
  }

  getById(id: string): Observable<Provider> {
    return this.http.get<Provider>(`${this.apiUrl}/${id}`).pipe(
      map(r => r),
      catchError(this.handleError)
    );
  }

  create(dto: any): Observable<Provider> {
    return this.http.post<Provider>(this.apiUrl, dto).pipe(
      catchError(this.handleError)
    );
  }

  update(id: string, dto: any): Observable<Provider> {
    return this.http.put<Provider>(`${this.apiUrl}/${id}`, dto).pipe(
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
    } else {
      errorMessage = error.error?.error || errorMessage;
    }
    return throwError(() => new Error(errorMessage));
  }
}
