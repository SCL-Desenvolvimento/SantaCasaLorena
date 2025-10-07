import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, map, Observable, throwError } from 'rxjs';
import { environment } from '../../environments/environment';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private apiUrl = `${environment.apiUrl}/users`;

  constructor(private http: HttpClient) { }

  getAll(): Observable<User[]> {
    return this.http.get<User[]>(this.apiUrl).pipe(
      map(response => response.map(item => ({
        ...item,
        photoUrl: `${environment.imageServerUrl}${item.photoUrl}`
      }))),
      catchError(this.handleError)
    );
  }

  getById(id: string): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/${id}`).pipe(
      map(response => ({
        ...response,
        photoUrl: `${environment.imageServerUrl}${response.photoUrl}`
      })),
      catchError(this.handleError)
    );
  }

  create(user: User): Observable<User> {
    return this.http.post<User>(this.apiUrl, user).pipe(
      catchError(this.handleError)
    );
  }

  update(id: string, user: User): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/${id}`, user).pipe(
      catchError(this.handleError)
    );
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  updateUserStatus(id: string, status: 'active' | 'inactive'): Observable<void> {
    return this.http.patch<void>(`${this.apiUrl}/${id}/status`, { status }).pipe(
      catchError(this.handleError)
    );
  }

  resetPassword(userId: string): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/reset-password/${userId}`, {}).pipe(
      catchError(this.handleError)
    );
  }

  changePassword(userId: number, newPassword: string): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/${userId}/change-password`, { newPassword }).pipe(
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
