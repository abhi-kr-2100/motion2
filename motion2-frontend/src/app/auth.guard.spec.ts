import { TestBed } from '@angular/core/testing';
import {
  ActivatedRouteSnapshot,
  Router,
  RouterStateSnapshot,
} from '@angular/router';

import { of, throwError } from 'rxjs';

import { AuthGuard } from './auth.guard';
import { AuthenticatedUserService } from './authenticated-user.service';

describe('AuthGuard', () => {
  let guard: AuthGuard;
  let mockRouterStateSnapshot: jasmine.SpyObj<RouterStateSnapshot>;
  let routerSpy: jasmine.SpyObj<Router>;
  let authenticatedUserSpy: jasmine.SpyObj<AuthenticatedUserService>;

  beforeEach(() => {
    mockRouterStateSnapshot = jasmine.createSpyObj('RouterStateSnapshot', [
      'toString',
    ]);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    authenticatedUserSpy = jasmine.createSpyObj('AuthenticatedUserService', [
      'verify',
    ]);

    TestBed.configureTestingModule({
      providers: [
        { provide: Router, useValue: routerSpy },
        { provide: AuthenticatedUserService, useValue: authenticatedUserSpy },
      ],
    });
    guard = TestBed.inject(AuthGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });

  it('should redirect for non-logged in users', () => {
    authenticatedUserSpy.verify.and.returnValue(
      throwError(() => 'User not logged in')
    );
    routerSpy.navigate.and.returnValue(new Promise(() => true));

    guard
      .canActivate(new ActivatedRouteSnapshot(), mockRouterStateSnapshot)
      .subscribe({
        next: (v) => {
          expect(v).toBeFalse();
        },
        error: (_) => {
          expect(false).toBeTrue();
        },
      });

    expect(authenticatedUserSpy.verify).toHaveBeenCalledOnceWith();
    expect(routerSpy.navigate).toHaveBeenCalledOnceWith(['/login']);
  });

  it('should not redirect if user is logged in', () => {
    authenticatedUserSpy.verify.and.returnValue(
      of({
        message: 'user is logged in',
      })
    );

    guard
      .canActivate(new ActivatedRouteSnapshot(), mockRouterStateSnapshot)
      .subscribe({
        next: (v) => {
          expect(v).toBeTrue();
        },
        error: (_) => {
          expect(false).toBeTrue();
        },
      });

    expect(authenticatedUserSpy.verify).toHaveBeenCalledOnceWith();
    expect(routerSpy.navigate).not.toHaveBeenCalled();
  });
});
