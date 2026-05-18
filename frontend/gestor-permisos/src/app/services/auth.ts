import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, catchError, map, of, switchMap } from 'rxjs';

// Interfaz para el recurso `login` del mock
export interface LoginEntry {
  id?: string;
  nom?: string;
  usuari: string;
  email?: string;
  rol?: string;
  password?: string;
  token?: string;
}

@Injectable({
  providedIn: 'root',
})
export class Auth {
  private readonly storageKey = 'user';
  private readonly mockApiUrl = 'http://localhost:3001/login';
  private readonly backendLoginUrl = 'http://localhost:3000/usuarios/login';
  private readonly backendProfileUrl = 'http://localhost:3000/usuarios/profile';
  private readonly userSubject = new BehaviorSubject<LoginEntry | null>(this.readStoredUser());
  readonly user$ = this.userSubject.asObservable();

  constructor(private http: HttpClient) {}

  login(identifier: string, password: string): Observable<LoginEntry | undefined> {
    const value = identifier.trim();

    if (!value || !password.trim()) {
      return of(undefined);
    }

    const useBackendFirst = value.includes('@');
    const primaryLogin$ = useBackendFirst
      ? this.loginAgainstBackend(value, password)
      : this.loginAgainstMock(value, password);
    const fallbackLogin$ = useBackendFirst
      ? this.loginAgainstMock(value, password)
      : this.loginAgainstBackend(value, password);

    return primaryLogin$.pipe(
      catchError((error) => {
        console.warn('Auth.login: falló el login principal, probando alternativa', error);
        return fallbackLogin$;
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
    return !!this.userSubject.value?.token || !!this.userSubject.value;
  }

  private loginAgainstMock(identifier: string, password: string): Observable<LoginEntry | undefined> {
    return this.findMockLogin('usuari', identifier, password).pipe(
      switchMap((user) => (user ? of(user) : this.findMockLogin('email', identifier, password)))
    );
  }

  private findMockLogin(
    field: 'usuari' | 'email',
    identifier: string,
    password: string
  ): Observable<LoginEntry | undefined> {
    const url = `${this.mockApiUrl}?${field}=${encodeURIComponent(identifier)}&password=${encodeURIComponent(password)}`;
    console.log('Auth.login: petició GET al mock', url);

    return this.http.get<LoginEntry[]>(url).pipe(
      map((entries) => {
        const user = entries?.[0];
        return user ? this.normalizeMockUser(user) : undefined;
      })
    );
  }

  private loginAgainstBackend(email: string, password: string): Observable<LoginEntry | undefined> {
    console.log('Auth.login: petició POST al backend', this.backendLoginUrl);

    return this.http.post<{ token?: string }>(this.backendLoginUrl, { email, password }).pipe(
      switchMap((response) => {
        const token = response?.token;

        if (!token) {
          return of(undefined);
        }

        const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });

        return this.http.get<Record<string, unknown>>(this.backendProfileUrl, { headers }).pipe(
          map((profile) => this.normalizeBackendUser(profile, token))
        );
      })
    );
  }

  private normalizeMockUser(user: LoginEntry): LoginEntry {
    return {
      ...user,
      nom: user.nom || user.usuari,
      usuari: user.usuari,
    };
  }

  private normalizeBackendUser(profile: Record<string, unknown>, token: string): LoginEntry {
    const email = String(profile['email'] ?? '');
    const usuari = String(profile['usuario'] ?? profile['usuari'] ?? email);
    const nom = String(profile['nombre'] ?? profile['nom'] ?? usuari);

    return {
      id: String(profile['_id'] ?? profile['id'] ?? ''),
      nom,
      usuari,
      email,
      rol: String(profile['rol'] ?? ''),
      token,
    };
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

