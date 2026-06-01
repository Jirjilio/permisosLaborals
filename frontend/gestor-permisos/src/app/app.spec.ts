import { TestBed } from '@angular/core/testing';
import { App } from './app';
import { Router } from '@angular/router';
import { Auth } from './services/auth';
import { of } from 'rxjs';

describe('App', () => {
  const routerSpy = {
    events: of(),
    routerState: { snapshot: { root: { data: {} } } },
  } as unknown as Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [
        { provide: Router, useValue: routerSpy },
        {
          provide: Auth,
          useValue: {
            isAuthenticated: () => false,
            user$: of(null),
          },
        },
      ],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should not show navbar when unauthenticated', () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();
    const app = fixture.componentInstance;
    expect(app.showNavbar).toBeFalse();
  });
});
