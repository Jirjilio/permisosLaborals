import { Routes } from '@angular/router';
import { Login } from './pages/login/login';
import { Dashboard } from './pages/dashboard/dashboard';
import { Permisos } from './pages/permisos/permisos';
import { Empleats } from './pages/empleats/empleats';
import { authGuard } from './guards/auth-guard';

export const routes: Routes = [
  { path: 'login', component: Login },
  { path: 'dashboard', component: Dashboard, canActivate: [authGuard] },
  { path: 'permisos', component: Permisos, canActivate: [authGuard] },
  { path: 'empleats', component: Empleats, canActivate: [authGuard] },
  { path: '', redirectTo: 'login', pathMatch: 'full' },
];
