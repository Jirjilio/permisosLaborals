import { Component, DestroyRef, OnInit, signal, inject } from '@angular/core';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { Navbar } from './components/navbar/navbar';
import { NotificacionesComponent } from './components/notificaciones/notificaciones';
import { CommonModule } from '@angular/common';
import { filter } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Auth } from './services/auth';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Navbar, NotificacionesComponent, CommonModule],
  templateUrl: './app.html',
  styleUrls: ['./app.scss']
})
export class App implements OnInit {
  protected readonly title = signal('gestor-permisos');
  showNavbar = false;

  private readonly destroyRef = inject(DestroyRef);

  constructor(private router: Router, private auth: Auth) {}

  ngOnInit(): void {
    this.updateNavbarVisibility(this.router.url);

    this.router.events
      .pipe(
        filter((event): event is NavigationEnd => event instanceof NavigationEnd),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe((event) => {
        this.updateNavbarVisibility(event.urlAfterRedirects);
      });

    this.auth.user$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.updateNavbarVisibility(this.router.url));
  }

  private updateNavbarVisibility(url: string): void {
    this.showNavbar = this.auth.isAuthenticated() && !url.includes('/login');
  }
}
