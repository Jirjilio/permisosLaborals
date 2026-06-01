import { TestBed } from '@angular/core/testing';

import { NotificacionesService } from './notificaciones.service';

describe('NotificacionesService', () => {
  let service: NotificacionesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NotificacionesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should add and remove notifications', () => {
    service.success('Missatge de prova', 1);

    service.getNotificaciones().subscribe((items) => {
      if (items.length === 0) {
        return;
      }

      expect(items[0].mensaje).toBe('Missatge de prova');
      service.remover(items[0].id);
    });
  });
});
