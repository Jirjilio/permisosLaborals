import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { of } from 'rxjs';
import { Router } from '@angular/router';

import { Login } from './login';
import { Auth } from '../../services/auth';

describe('Login', () => {
  let component: Login;
  let fixture: ComponentFixture<Login>;
  let authSpy: jasmine.SpyObj<Auth>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    authSpy = jasmine.createSpyObj<Auth>('Auth', ['login', 'setSession', 'clearSession']);
    routerSpy = jasmine.createSpyObj<Router>('Router', ['navigate']);

    authSpy.login.and.returnValue(of({ id: '1', nom: 'Admin', usuari: 'admin', rol: 'admin', token: 'abc' }));

    await TestBed.configureTestingModule({
      imports: [Login, ReactiveFormsModule],
      providers: [
        { provide: Auth, useValue: authSpy },
        { provide: Router, useValue: routerSpy },
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Login);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show validation error when form is empty', () => {
    component.onSubmit();

    expect(component.errorMessage).toContain('Introdueix usuari i password.');
    expect(authSpy.login).not.toHaveBeenCalled();
  });

  it('should login and navigate admins to dashboard', () => {
    component.loginForm.setValue({ usuari: 'admin', password: '1234' });

    component.onSubmit();

    expect(authSpy.login).toHaveBeenCalledWith('admin', '1234');
    expect(authSpy.setSession).toHaveBeenCalled();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/dashboard']);
  });
});
