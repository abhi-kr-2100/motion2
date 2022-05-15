import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { Observable, Subject } from 'rxjs';

import { AuthenticatedUserService } from './authenticated-user.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(
    private router: Router,
    private authenticatedUser: AuthenticatedUserService
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> {
    let isUserLoggedIn = new Subject<boolean>();
    this.authenticatedUser.verify().subscribe({
      next: (_) => isUserLoggedIn.next(true),
      error: (_) => {
        this.router.navigate(['/login']);
        isUserLoggedIn.next(false);
      },
    });

    return isUserLoggedIn.asObservable();
  }
}
