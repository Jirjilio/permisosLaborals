import { ActivatedRouteSnapshot, CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { Auth } from '../services/auth';

export const authGuard: CanActivateFn = (route: ActivatedRouteSnapshot) => {
  const router = inject(Router);
  const auth = inject(Auth);
  const user = auth.getCurrentUser();

  if (!auth.isAuthenticated()) {
    return router.parseUrl('/login');
  }

  const roles = (route.data?.['roles'] as string[] | undefined) ?? [];
  const currentRole = String(user?.rol ?? '').toLowerCase();

  if (roles.length > 0 && !roles.includes(currentRole)) {
    return router.parseUrl(currentRole === 'admin' ? '/dashboard' : '/permisos');
  }

  return true;
};
