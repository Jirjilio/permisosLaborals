import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Empleat } from '../models/empleat';

@Injectable({
  providedIn: 'root',
})
export class Auth {
  private apiUrl = 'http://localhost:3001/empleats';
constructor(private http: HttpClient) {}
  login(username: string, password: string) {
    return this.http.get<Empleat[]>(this.apiUrl).pipe(
      map(empleats => empleats.find(e => e.usuari === username && e.password === password))
    );

  }

}

