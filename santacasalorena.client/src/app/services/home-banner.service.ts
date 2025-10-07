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

  getById(id: number): Observable<HomeBanner> {
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

  create(dto: HomeBanner): Observable<HomeBanner> {
    return this.http.post<HomeBanner>(this.apiUrl, dto).pipe(
      catchError(this.handleError)
    );
  }

  update(id: number, dto: HomeBanner): Observable<HomeBanner> {
    return this.http.put<HomeBanner>(`${this.apiUrl}/${id}`, dto).pipe(
      catchError(this.handleError)
    );
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  updateBannerStatus(id: number, isActive: boolean): Observable<void> {
    return this.http.patch<void>(`${this.apiUrl}/${id}/status`, { isActive }).pipe(
      catchError(this.handleError)
    );
  }

  updateBannerOrder(id: number, order: number): Observable<void> {
    return this.http.patch<void>(`${this.apiUrl}/${id}/order`, { order }).pipe(
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

