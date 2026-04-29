import { Routes } from '@angular/router';
import { Login } from './pages/login/login';
import { Dashboard } from './pages/dashboard/dashboard';
import { Permisos } from './pages/permisos/permisos';

export const routes: Routes = [
  { path: 'login', component: Login },
  { path: 'dashboard', component: Dashboard },
  { path: 'permisos', component: Permisos },
  { path: '', redirectTo: 'login', pathMatch: 'full' },
];
