import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Auth } from '../../services/auth';
import { of } from 'rxjs';

import { Navbar } from './navbar';

describe('Navbar', () => {
  let component: Navbar;
  let fixture: ComponentFixture<Navbar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Navbar, RouterTestingModule],
      providers: [
        {
          provide: Auth,
          useValue: {
            getCurrentUser: () => ({ nom: 'Admin', usuari: 'admin', rol: 'admin' }),
            clearSession: () => undefined,
            user$: of(null),
          },
        },
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Navbar);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
