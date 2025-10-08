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

  create(news: News, imageFile?: File): Observable<News> {
    const formData = this.buildFormData(news, imageFile);
    return this.http.post<News>(this.apiUrl, formData).pipe(
      catchError(this.handleError)
    );
  }

  update(id: string, news: News, imageFile?: File): Observable<News> {
    const formData = this.buildFormData(news, imageFile);
    return this.http.put<News>(`${this.apiUrl}/${id}`, formData).pipe(
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

  private buildFormData(news: News, imageFile?: File): FormData {
    const formData = new FormData();

    if (imageFile) {
      formData.append('File', imageFile, imageFile.name);
    }

    formData.append('Title', news.title);
    if (news.description) formData.append('Description', news.description);
    formData.append('Content', news.content);
    if (news.category) formData.append('Category', news.category);
    formData.append('IsPublished', news.isPublished.toString());
    if (news.userId) formData.append('UserId', news.userId);

    if (news.tags && news.tags.length > 0) {
      news.tags.forEach(tag => formData.append('Tags', tag));
    }
    if (news.seoTitle) formData.append('SeoTitle', news.seoTitle);
    if (news.seoDescription) formData.append('SeoDescription', news.seoDescription);
    if (news.seoKeywords) formData.append('SeoKeywords', news.seoKeywords);

    return formData;
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

