import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, map, tap } from 'rxjs';

// Interfaz para el recurso `login` del mock
export interface LoginEntry {
  id?: string;
  nom?: string;
  usuari: string;
  rol?: string;
  password?: string;
  token?: string;
}

@Injectable({
  providedIn: 'root',
})
export class Auth {
  private readonly storageKey = 'user';
  private apiUrl = 'http://localhost:3001/login';
  private readonly userSubject = new BehaviorSubject<LoginEntry | null>(this.readStoredUser());
  readonly user$ = this.userSubject.asObservable();

  constructor(private http: HttpClient) {}

  login(username: string, password: string) {
    const url = `${this.apiUrl}?usuari=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}`;
    console.log('Auth.login: iniciando petició GET a', url);

    return this.http.get<LoginEntry[]>(url).pipe(
      tap((entries) => console.log('Auth.login: resposta GET, entries count =', entries?.length)),
      map((entries) => (entries && entries.length > 0 ? entries[0] : undefined))
    );
  }

  setSession(user: LoginEntry): void {
    localStorage.setItem(this.storageKey, JSON.stringify(user));
    this.userSubject.next(user);
  }

  clearSession(): void {
    localStorage.removeItem(this.storageKey);
    this.userSubject.next(null);
  }

  getCurrentUser(): LoginEntry | null {
    return this.userSubject.value;
  }

  isAuthenticated(): boolean {
    return !!this.userSubject.value;
  }

  private readStoredUser(): LoginEntry | null {
    const raw = localStorage.getItem(this.storageKey);

    if (!raw) {
      return null;
    }

    try {
      return JSON.parse(raw) as LoginEntry;
    } catch (error) {
      console.warn('Auth: no s\'ha pogut llegir l\'usuari guardat', error);
      localStorage.removeItem(this.storageKey);
      return null;
    }
  }

}

