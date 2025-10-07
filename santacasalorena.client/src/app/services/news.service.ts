import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, map, Observable, throwError } from 'rxjs';
import { environment } from '../../environments/environment';
import { News } from '../models/news';

@Injectable({
  providedIn: 'root',
})
export class NewsService {
  private apiUrl = `${environment.apiUrl}/news`;

  constructor(private http: HttpClient) { }

  getAll(): Observable<News[]> {
    return this.http.get<News[]>(this.apiUrl).pipe(
      map(response => response.map(item => ({
        ...item,
        imageUrl: `${environment.imageServerUrl}${item.imageUrl}`
      }))),
      catchError(this.handleError)
    );
  }

  getById(id: string): Observable<News> {
    return this.http.get<News>(`${this.apiUrl}/${id}`).pipe(
      map(response => ({
        ...response,
        imageUrl: `${environment.imageServerUrl}${response.imageUrl}`
      })),
      catchError(this.handleError)
    );
  }

  create(news: News): Observable<News> {
    // O backend deve lidar com o upload da imagem e a geração do ID, createdAt, updatedAt, views
    // Aqui estamos enviando o objeto News diretamente
    return this.http.post<News>(this.apiUrl, news).pipe(
      catchError(this.handleError)
    );
  }

  update(id: string, news: News): Observable<News> {
    // O backend deve lidar com o upload da imagem e a atualização do updatedAt
    // Aqui estamos enviando o objeto News diretamente
    return this.http.put<News>(`${this.apiUrl}/${id}`, news).pipe(
      catchError(this.handleError)
    );
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  updateNewsPublishStatus(id: string, isPublished: boolean): Observable<void> {
    return this.http.patch<void>(`${this.apiUrl}/${id}/publish`, { isPublished }).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'Ocorreu um erro. Tente novamente mais tarde.';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Erro: ${error.error.message}`;
    } else {
      // O backend pode retornar um objeto de erro com uma mensagem específica
      errorMessage = error.error?.message || error.statusText || errorMessage;
    }
    return throwError(() => new Error(errorMessage));
  }
}

