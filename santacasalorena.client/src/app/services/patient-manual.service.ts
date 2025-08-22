import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, map, Observable, throwError } from 'rxjs';
import { environment } from '../../environments/environment';
import { PatientManual } from '../models/patientManual';

@Injectable({
  providedIn: 'root',
})
export class PatientManualService {
  private apiUrl = `${environment.apiUrl}/patientmanuals`;

  constructor(private http: HttpClient) { }

  getAll(): Observable<PatientManual[]> {
    return this.http.get<PatientManual[]>(this.apiUrl).pipe(
      map(r => r),
      catchError(this.handleError)
    );
  }

  getById(id: string): Observable<PatientManual> {
    return this.http.get<PatientManual>(`${this.apiUrl}/${id}`).pipe(
      map(r => r),
      catchError(this.handleError)
    );
  }

  create(dto: any): Observable<PatientManual> {
    return this.http.post<PatientManual>(this.apiUrl, dto).pipe(
      catchError(this.handleError)
    );
  }

  update(id: string, dto: any): Observable<PatientManual> {
    return this.http.put<PatientManual>(`${this.apiUrl}/${id}`, dto).pipe(
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
