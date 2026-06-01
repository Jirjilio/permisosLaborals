import { TestBed } from '@angular/core/testing';
import { HttpClient } from '@angular/common/http';

import { Auth } from './auth';

describe('Auth', () => {
  let service: Auth;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({
      providers: [{ provide: HttpClient, useValue: {} }]
    });
    service = TestBed.inject(Auth);
  });

  it('should store and clear the current session', () => {
    expect(service.isAuthenticated()).toBeFalse();

    service.setSession({ id: '1', nom: 'Admin', usuari: 'admin', rol: 'admin', token: 'abc' });

    expect(service.isAuthenticated()).toBeTrue();
    expect(service.getCurrentUser()?.nom).toBe('Admin');

    service.clearSession();

    expect(service.isAuthenticated()).toBeFalse();
    expect(service.getCurrentUser()).toBeNull();
  });

  it('should persist the session in localStorage', () => {
    service.setSession({ id: '2', nom: 'Joan', usuari: 'joan', rol: 'basic' });
    expect(localStorage.getItem('user')).toContain('Joan');
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
