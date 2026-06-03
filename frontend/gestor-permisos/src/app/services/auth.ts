import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, of, switchMap } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

export interface LoginEntry {
  id?: string;
  nom?: string;
  usuari: string;
  email?: string;
  rol?: string;
  password?: string;
  token?: string;
}

@Injectable({ providedIn: 'root' })
export class Auth {
  private readonly storageKey = 'user';
  private readonly backendLoginUrl = 'http://localhost:3000/usuarios/login';
  private readonly backendProfileUrl = 'http://localhost:3000/usuarios/profile';

  private readonly userSubject = new BehaviorSubject<LoginEntry | null>(
    this.readStoredUser()
  );
  readonly user$ = this.userSubject.asObservable();

  constructor(private http: HttpClient) {}

  login(identifier: string, password: string): Observable<LoginEntry | undefined> {
    const value = identifier.trim();
    if (!value || !password.trim()) return of(undefined);

    return this.http
      .post<{ token?: string }>(this.backendLoginUrl, {
        email: value,
        password,
      })
      .pipe(
        switchMap((res) => {
          const token = res?.token;
          if (!token) return of(undefined);

          const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
          return this.http
            .get<Record<string, unknown>>(this.backendProfileUrl, { headers })
            .pipe(map((profile) => this.normalizeBackendUser(profile, token)));
        }),
        catchError((err) => {
          console.error('Login fallido:', err);
          return of(undefined);
        })
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
    return !!this.userSubject.value?.token;
  }

  private normalizeBackendUser(
    profile: Record<string, unknown>,
    token: string
  ): LoginEntry {
    const email = String(profile['email'] ?? '');
    const usuari = String(profile['usuario'] ?? profile['usuari'] ?? email);
    const nom = String(profile['nombre'] ?? profile['nom'] ?? usuari);
    const rawRol = String(profile['rol'] ?? '');
    const rol = rawRol === 'user' ? 'basic' : rawRol;

    return {
      id: String(profile['_id'] ?? profile['id'] ?? ''),
      nom,
      usuari,
      email,
      rol,
      token,
    };
  }

  private readStoredUser(): LoginEntry | null {
    const raw = localStorage.getItem(this.storageKey);
    if (!raw) return null;
    try {
      return JSON.parse(raw) as LoginEntry;
    } catch {
      localStorage.removeItem(this.storageKey);
      return null;
    }
  }
}
