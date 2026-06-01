import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Empleat } from '../models/empleat';

type BackendUser = {
  _id?: string;
  id?: string;
  nombre?: string;
  apellido1?: string;
  apellido2?: string;
  email?: string;
  usuario?: string;
  password?: string;
  imagen?: string;
  rol?: 'admin' | 'basic' | 'user';
};

@Injectable({
  providedIn: 'root',
})
export class Empleats {
  private apiUrl = 'http://localhost:3000/usuarios';

  constructor(private http: HttpClient) {}

  getAll(): Observable<Empleat[]> {
    return this.http.get<BackendUser[]>(this.apiUrl, { headers: this.authHeaders() }).pipe(
      map((items) => items.map((item) => this.toEmpleat(item)))
    );
  }

  create(empleat: Empleat): Observable<Empleat> {
    return this.http.post<BackendUser>(this.apiUrl, this.toBackendPayload(empleat), { headers: this.authHeaders() }).pipe(
      map((item) => this.toEmpleat(item))
    );
  }

  update(id: string, empleat: Empleat): Observable<Empleat> {
    return this.http.put<BackendUser>(`${this.apiUrl}/${id}`, this.toBackendPayload(empleat), { headers: this.authHeaders() }).pipe(
      map((item) => this.toEmpleat(item))
    );
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

  private toEmpleat(item: BackendUser): Empleat {
    return {
      id: item._id || item.id,
      nom: item.nombre || '',
      primerCognom: item.apellido1 || '',
      segonCognom: item.apellido2 || '',
      email: item.email || '',
      usuari: item.usuario || '',
      password: item.password || '',
      imatge: item.imagen || '',
      rol: item.rol === 'admin' ? 'admin' : 'basic',
    };
  }

  private toBackendPayload(empleat: Empleat): BackendUser {
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
}
