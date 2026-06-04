import { Routes } from '@angular/router';
import { Login } from './pages/login/login';
import { Dashboard } from './pages/dashboard/dashboard';
import { Permisos } from './pages/permisos/permisos';
import { Empleats } from './pages/empleats/empleats';
import { PermisDetall } from './pages/permis-detall/permis-detall';
import { authGuard } from './guards/auth-guard';

export const routes: Routes = [
  { path: 'login', component: Login, data: { showNavbar: false } },
  { path: 'dashboard', component: Dashboard, canActivate: [authGuard], data: { showNavbar: true, roles: ['admin'] } },
  { path: 'permisos', component: Permisos, canActivate: [authGuard], data: { showNavbar: true, roles: ['admin', 'basic'] } },
  { path: 'permisos/:id', component: PermisDetall, canActivate: [authGuard], data: { showNavbar: true, roles: ['admin', 'basic'] } },
  { path: 'empleats', component: Empleats, canActivate: [authGuard], data: { showNavbar: true, roles: ['admin'] } },
  { path: '', redirectTo: 'login', pathMatch: 'full' },
];
