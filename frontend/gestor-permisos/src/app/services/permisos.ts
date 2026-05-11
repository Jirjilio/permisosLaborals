import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Permis } from '../models/permis';

@Injectable({
  providedIn: 'root',
})
export class Permisos {
  private apiUrl = 'http://localhost:3001/permisos';

  constructor(private http: HttpClient) {}

  getAll(): Observable<Permis[]> {
    return this.http.get<Permis[]>(this.apiUrl);
  }

  getById(id: string): Observable<Permis> {
    return this.http.get<Permis>(`${this.apiUrl}/${id}`);
  }

  create(permis: Permis): Observable<Permis> {
    return this.http.post<Permis>(this.apiUrl, permis);
  }

  update(id: string, permis: Permis): Observable<Permis> {
    return this.http.put<Permis>(`${this.apiUrl}/${id}`, permis);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
