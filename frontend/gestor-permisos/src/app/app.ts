import { Component, DestroyRef, OnInit, signal, inject } from '@angular/core';
import { ActivatedRouteSnapshot, NavigationEnd, Router, RouterOutlet } from '@angular/router';
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
    this.updateNavbarVisibility();

    this.router.events
      .pipe(
        filter((event): event is NavigationEnd => event instanceof NavigationEnd),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(() => this.updateNavbarVisibility());

    this.auth.user$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.updateNavbarVisibility());
  }

  private updateNavbarVisibility(): void {
    const route = this.getDeepestRoute(this.router.routerState.snapshot.root);
    const routeWantsNavbar = route?.data?.['showNavbar'] !== false;

    this.showNavbar = this.auth.isAuthenticated() && routeWantsNavbar;
  }

  private getDeepestRoute(route: ActivatedRouteSnapshot): ActivatedRouteSnapshot {
    let current = route;

    while (current.firstChild) {
      current = current.firstChild;
    }

    return current;
  }
}
