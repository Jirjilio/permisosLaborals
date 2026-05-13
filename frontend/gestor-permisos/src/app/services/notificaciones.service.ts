import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export type TipoNotificacion = 'success' | 'error' | 'warning' | 'info';

export interface Notificacion {
  id: string;
  tipo: TipoNotificacion;
  mensaje: string;
  duracion?: number;
}

@Injectable({
  providedIn: 'root',
})
export class NotificacionesService {
  private notificaciones$ = new BehaviorSubject<Notificacion[]>([]);
  private contador = 0;

  constructor() {}

  getNotificaciones(): Observable<Notificacion[]> {
    return this.notificaciones$.asObservable();
  }

  success(mensaje: string, duracion = 3000): void {
    this.agregar('success', mensaje, duracion);
  }

  error(mensaje: string, duracion = 4000): void {
    this.agregar('error', mensaje, duracion);
  }

  warning(mensaje: string, duracion = 3500): void {
    this.agregar('warning', mensaje, duracion);
  }

  info(mensaje: string, duracion = 3000): void {
    this.agregar('info', mensaje, duracion);
  }

  private agregar(tipo: TipoNotificacion, mensaje: string, duracion: number): void {
    const id = `notif-${++this.contador}`;
    const notif: Notificacion = { id, tipo, mensaje, duracion };

    const actuales = this.notificaciones$.value;
    this.notificaciones$.next([...actuales, notif]);

    setTimeout(() => {
      this.remover(id);
    }, duracion);
  }

  remover(id: string): void {
    const actuales = this.notificaciones$.value;
    this.notificaciones$.next(actuales.filter((n) => n.id !== id));
  }
}
