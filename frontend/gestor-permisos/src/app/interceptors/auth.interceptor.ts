import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const raw = localStorage.getItem('user');
  if (!raw) return next(req);

  try {
    const user = JSON.parse(raw) as { token?: string };
    if (user.token) {
      const cloned = req.clone({
        setHeaders: { Authorization: `Bearer ${user.token}` },
      });
      return next(cloned);
    }
  } catch {
    // token malformado, ignorar
  }

  return next(req);
};
