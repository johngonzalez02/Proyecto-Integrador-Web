import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { UserRole } from '../interfaces/user.interface';
import { UserService } from '../services/user.service';

/** Solo deja entrar a la ruta si el usuario en sesión tiene el rol indicado. */
export const roleGuard = (role: UserRole): CanActivateFn => () => {
  const user = inject(UserService).currentUser();
  if (user?.rol === role) return true;
  return inject(Router).createUrlTree(['/login']);
};