import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Permis } from '../models/permis';

@Injectable({ providedIn: 'root' })
export class Permisos {
  private apiUrl = 'http://localhost:3000/permisos';

  constructor(private http: HttpClient) {}

  getAll(): Observable<Permis[]> {
    return this.http
      .get<any[]>(this.apiUrl)
      .pipe(map((data) => data.map((item) => this.normalize(item))));
  }

  getById(id: string): Observable<Permis> {
    return this.http
      .get<any>(`${this.apiUrl}/${id}`)
      .pipe(map((item) => this.normalize(item)));
  }

  create(permis: Permis): Observable<Permis> {
    return this.http
      .post<any>(this.apiUrl, permis)
      .pipe(map((item) => this.normalize(item)));
  }

  update(id: string, permis: Permis): Observable<Permis> {
    return this.http
      .put<any>(`${this.apiUrl}/${id}`, permis)
      .pipe(map((item) => this.normalize(item)));
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  private normalize(item: any): Permis {
    return {
      ...item,
      id: item.id ?? item._id,
      dataInici: item.dataInici ? item.dataInici.substring(0, 10) : '',
      dataFinal: item.dataFinal ? item.dataFinal.substring(0, 10) : '',
      dataCreacio: item.dataCreacio ?? '',
      dataTramitacio: item.dataTramitacio ?? '',
    };
  }
}
