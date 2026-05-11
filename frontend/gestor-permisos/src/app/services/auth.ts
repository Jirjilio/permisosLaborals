import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, tap } from 'rxjs/operators';

// Interfaz para el recurso `login` del mock
export interface LoginEntry {
  id?: string;
  usuari: string;
  rol?: string;
  password?: string;
  token?: string;
}

@Injectable({
  providedIn: 'root',
})
export class Auth {
  // Usar la raíz /login si prefieres que la autenticación consulte ese recurso en el mock
  private apiUrl = 'http://localhost:3001/login';

  constructor(private http: HttpClient) {}

  login(username: string, password: string) {
    const url = `${this.apiUrl}?usuari=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}`;
    console.log('Auth.login: iniciando petició GET a', url);

    return this.http.get<LoginEntry[]>(url).pipe(
      tap((entries) => console.log('Auth.login: resposta GET, entries count =', entries?.length)),
      map((entries) => (entries && entries.length > 0 ? entries[0] : undefined))
    );

  }

}

