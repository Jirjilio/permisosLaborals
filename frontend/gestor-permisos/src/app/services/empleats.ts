import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Empleat } from '../models/empleat';

@Injectable({
  providedIn: 'root',
})
export class Empleats {
  private apiUrl = 'http://localhost:3000/usuarios';

  constructor(private http: HttpClient) {}

  getAll(): Observable<Empleat[]> {
    return this.http.get<any[]>(this.apiUrl, { headers: this.authHeaders() }).pipe(
      map(data => data.map(item => this.fromBackend(item)))
    );
  }

  getById(id: string): Observable<Empleat> {
    return this.http.get<any>(`${this.apiUrl}/${id}`, { headers: this.authHeaders() }).pipe(
      map(item => this.fromBackend(item))
    );
  }

  create(empleat: Empleat): Observable<Empleat> {
    return this.http.post<any>(this.apiUrl, this.toBackend(empleat), { headers: this.authHeaders() }).pipe(
      map(item => this.fromBackend(item))
    );
  }

  update(id: string, empleat: Empleat): Observable<Empleat> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, this.toBackend(empleat), { headers: this.authHeaders() }).pipe(
      map(item => this.fromBackend(item))
    );
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, { headers: this.authHeaders() });
  }

  private fromBackend(item: any): Empleat {
    return {
      id: item._id ?? item.id,
      nom: item.nombre ?? item.nom ?? '',
      primerCognom: item.apellido1 ?? item.primerCognom ?? '',
      segonCognom: item.apellido2 ?? item.segonCognom ?? '',
      email: item.email ?? '',
      usuari: item.usuario ?? item.usuari ?? '',
      password: item.password ?? '',
      imatge: item.imagen ?? item.imatge ?? '',
      rol: item.rol ?? 'basic',
    };
  }

  private toBackend(empleat: Empleat): any {
    return {
      nombre: empleat.nom,
      apellido1: empleat.primerCognom,
      apellido2: empleat.segonCognom,
      email: empleat.email,
      usuario: empleat.usuari,
      password: empleat.password,
      imagen: empleat.imatge,
      rol: empleat.rol,
    };
  }

  private authHeaders(): HttpHeaders {
    const raw = localStorage.getItem('user');
    if (!raw) return new HttpHeaders();
    try {
      const user = JSON.parse(raw) as { token?: string };
      return user.token ? new HttpHeaders({ Authorization: `Bearer ${user.token}` }) : new HttpHeaders();
    } catch {
      return new HttpHeaders();
    }
  }
}
