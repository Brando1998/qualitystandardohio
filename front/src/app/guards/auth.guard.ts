import { CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { inject } from '@angular/core';
import { Router } from '@angular/router';


export const authGuard: CanActivateFn = (route, state) => {
  const authService: AuthService = inject(AuthService);
  const router: Router = inject(Router)
  if (authService.isLoggedIn()) {
    return true;
  } else {
    router.navigate(['admin/login']);
    authService.logout();
    return false;
  }
};
