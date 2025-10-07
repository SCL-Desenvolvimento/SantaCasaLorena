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
      map(response => response.map(item => ({
        ...item,
        imageUrl: `${environment.imageServerUrl}${item.imageUrl}`
      }))),
      catchError(this.handleError)
    );
  }

  getById(id: string): Observable<Providers> { // ID é string no modelo original
    return this.http.get<Providers>(`${this.apiUrl}/${id}`).pipe(
      map(response => ({
        ...response,
        imageUrl: `${environment.imageServerUrl}${response.imageUrl}`
      })),
      catchError(this.handleError)
    );
  }

  create(dto: Providers): Observable<Providers> {
    // O modelo original Providers tem 'id: string', então não removemos o ID aqui.
    // Assumimos que o ID será gerado pelo cliente ou que o backend aceita o ID fornecido.
    return this.http.post<Providers>(this.apiUrl, dto).pipe(
      catchError(this.handleError)
    );
  }

  update(id: string, dto: Providers): Observable<Providers> { // ID é string no modelo original
    return this.http.put<Providers>(`${this.apiUrl}/${id}`, dto).pipe(
      catchError(this.handleError)
    );
  }

  delete(id: string): Observable<void> { // ID é string no modelo original
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  // Este método não faz sentido com o modelo Providers original, que não tem 'status'.
  // Se a funcionalidade de status for necessária, o modelo Providers precisará ser atualizado.
  // Por enquanto, vou remover ou comentar este método, ou adaptá-lo se houver um campo similar.
  // Dado o modelo original, vou comentar este método por não ter um campo 'status'.
  /*
  updateProviderStatus(id: string, status: 'active' | 'inactive' | 'pending'): Observable<void> {
    return this.http.patch<void>(`${this.apiUrl}/${id}/status`, { status }).pipe(
      catchError(this.handleError)
    );
  }
  */

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

