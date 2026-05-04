import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Empleat } from '../models/empleat';

@Injectable({
  providedIn: 'root',
})
export class Empleats {
  private apiUrl = 'http://localhost:3001/empleats';

  constructor(private http: HttpClient) {}

  getAll(): Observable<Empleat[]> {
    return this.http.get<Empleat[]>(this.apiUrl);
  }

  create(empleat: Empleat): Observable<Empleat> {
    return this.http.post<Empleat>(this.apiUrl, empleat);
  }

  update(id: string, empleat: Empleat): Observable<Empleat> {
    return this.http.put<Empleat>(`${this.apiUrl}/${id}`, empleat);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
