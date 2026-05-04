import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, map, Observable, throwError } from 'rxjs';
import { environment } from '../../environments/environment';
import { HomeBanner } from '../models/homeBanner';

@Injectable({
  providedIn: 'root',
})
export class HomeBannerService {
  private apiUrl = `${environment.apiUrl}/homebanners`;

  constructor(private http: HttpClient) { }

  getAll(): Observable<HomeBanner[]> {
    return this.http.get<HomeBanner[]>(this.apiUrl).pipe(
      map(response => response.map(item => ({
        ...item,
        desktopImageUrl: `${environment.imageServerUrl}${item.desktopImageUrl}`,
        mobileImageUrl: `${environment.imageServerUrl}${item.mobileImageUrl}`,
        tabletImageUrl: `${environment.imageServerUrl}${item.tabletImageUrl}`
      }))),
      catchError(this.handleError)
    );
  }

  getById(id: string): Observable<HomeBanner> {
    return this.http.get<HomeBanner>(`${this.apiUrl}/${id}`).pipe(
      map(response => ({
        ...response,
        desktopImageUrl: `${environment.imageServerUrl}${response.desktopImageUrl}`,
        mobileImageUrl: `${environment.imageServerUrl}${response.mobileImageUrl}`,
        tabletImageUrl: `${environment.imageServerUrl}${response.tabletImageUrl}`
      })),
      catchError(this.handleError)
    );
  }

  create(dto: FormData): Observable<HomeBanner> {
    return this.http.post<HomeBanner>(this.apiUrl, dto).pipe(
      catchError(this.handleError)
    );
  }

  update(id: string, dto: FormData): Observable<HomeBanner> {
    return this.http.put<HomeBanner>(`${this.apiUrl}/${id}`, dto).pipe(
      catchError(this.handleError)
    );
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  updateBannerOrder(id: string, order: number): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}/order?order=${order}`, null).pipe(
      catchError(this.handleError)
    );
  }

  toggleActive(id: string): Observable<HomeBanner> {
    return this.http.patch<HomeBanner>(`${this.apiUrl}/${id}/toggle-active`, {}).pipe(
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
    let errorMessage = 'Ocorreu um erro. Tente novamente mais tarde.';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Erro: ${error.error.message}`;
    } else {
      errorMessage = error.error?.error || errorMessage;
    }
    return throwError(() => new Error(errorMessage));
  }
}

