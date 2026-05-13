import { Routes } from '@angular/router';
import { Login } from './pages/login/login';
import { Dashboard } from './pages/dashboard/dashboard';
import { Permisos } from './pages/permisos/permisos';
import { Empleats } from './pages/empleats/empleats';
import { PermisDetall } from './pages/permis-detall/permis-detall';
import { authGuard } from './guards/auth-guard';

export const routes: Routes = [
  { path: 'login', component: Login },
  { path: 'dashboard', component: Dashboard, canActivate: [authGuard] },
  { path: 'permisos', component: Permisos, canActivate: [authGuard] },
  { path: 'permisos/:id', component: PermisDetall, canActivate: [authGuard] },
  { path: 'empleats', component: Empleats, canActivate: [authGuard] },
  { path: '', redirectTo: 'login', pathMatch: 'full' },
];
