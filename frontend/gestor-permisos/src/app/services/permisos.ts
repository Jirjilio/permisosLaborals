import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Permis } from '../models/permis';

@Injectable({
  providedIn: 'root',
})
export class Permisos {
  private apiUrl = 'http://localhost:3000/permisos';

  constructor(private http: HttpClient) {}

  getAll(): Observable<Permis[]> {
    return this.http.get<Permis[]>(this.apiUrl, { headers: this.authHeaders() });
  }

  getById(id: string): Observable<Permis> {
    return this.http.get<Permis>(`${this.apiUrl}/${id}`, { headers: this.authHeaders() });
  }

  create(permis: Permis): Observable<Permis> {
    return this.http.post<Permis>(this.apiUrl, permis, { headers: this.authHeaders() });
  }

  update(id: string, permis: Permis): Observable<Permis> {
    return this.http.put<Permis>(`${this.apiUrl}/${id}`, permis, { headers: this.authHeaders() });
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, { headers: this.authHeaders() });
  }

  private authHeaders(): HttpHeaders {
    const raw = localStorage.getItem('user');
    if (!raw) {
      return new HttpHeaders();
    }

    try {
      const user = JSON.parse(raw) as { token?: string };
      return user.token ? new HttpHeaders({ Authorization: `Bearer ${user.token}` }) : new HttpHeaders();
    } catch {
      return new HttpHeaders();
    }
  }
}
