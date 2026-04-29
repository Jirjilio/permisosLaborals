export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const userJson = localStorage.getItem('user');

  if (userJson) {
    // usuario presente => permitir acceso
    return true;
  }

  // no autenticado => redirigir a /login y bloquear acceso
  router.navigate(['/login']);
  return false;
};
