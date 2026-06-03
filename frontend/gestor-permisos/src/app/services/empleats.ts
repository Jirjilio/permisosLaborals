import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Empleat } from '../models/empleat';

@Injectable({ providedIn: 'root' })
export class Empleats {
  private apiUrl = 'http://localhost:3000/usuarios';

  constructor(private http: HttpClient) {
  }

  getAll(): Observable<Empleat[]> {
    return this.http
      .get<any[]>(this.apiUrl)
      .pipe(map((data) => data.map((item) => this.normalize(item))));
  }

  getById(id: string): Observable<Empleat> {
    return this.http
      .get<any>(`${this.apiUrl}/${id}`)
      .pipe(map((item) => this.normalize(item)));
  }

  create(empleat: Empleat): Observable<Empleat> {
    return this.http
      .post<any>(this.apiUrl, empleat)
      .pipe(map((item) => this.normalize(item)));
  }

  update(id: string, empleat: Empleat): Observable<Empleat> {
    return this.http
      .put<any>(`${this.apiUrl}/${id}`, empleat)
      .pipe(map((item) => this.normalize(item)));
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  private normalize(item: any): Empleat {
    const usuari = item.usuari ?? item.usuario ?? '';
    return {
      ...item,
      id: item.id ?? item._id,
      nom: item.nom ?? item.nombre ?? usuari,
      primerCognom: item.primerCognom ?? item.apellido ?? item.apellidos ?? usuari,
      segonCognom: item.segonCognom ?? item.segundoApellido ?? '',
      email: item.email ?? '',
      usuari,
      rol: item.rol ?? 'basic',
      imatge: item.imatge ?? item.imagen ?? '',
    };
  }
}
