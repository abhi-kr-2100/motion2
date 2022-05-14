import { TestBed } from '@angular/core/testing';

import { AuthenticatedUserService } from './authenticated-user.service';
import { RawApiRequestService } from './raw-api-request.service';
import { LoggedInUser } from '../models/user';
import { of, throwError } from 'rxjs';

describe('AuthenticatedUserService', () => {
  let service: AuthenticatedUserService;
  let httpSpy: jasmine.SpyObj<RawApiRequestService>;

  beforeEach(() => {
    httpSpy = jasmine.createSpyObj('RawApiRequestService', ['get']);
    TestBed.configureTestingModule({
      providers: [{ provide: RawApiRequestService, useValue: httpSpy }],
    });
    service = TestBed.inject(AuthenticatedUserService);

    localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should set a logged in user', () => {
    const user: LoggedInUser = {
      username: 'admin',
      password: 'admin',
    };

    service.setUser(user);
    expect(localStorage.getItem('user')).toBe(JSON.stringify(user));
  });

  it('should return the user when logged in', () => {
    const user: LoggedInUser = {
      username: 'root',
      password: 'toor',
    };

    service.setUser(user);
    expect(service.getUser()).toEqual(user);
  });

  it('should return null when not logged in', () => {
    expect(service.getUser()).toBeNull();
  });

  it('should not verify if user is not logged in', () => {
    service.verify().subscribe({
      next: () => {
        expect(false).toBeTrue();
      },
    });
  });

  it('should not verify if credentials have changed on server', () => {
    const user: LoggedInUser = {
      username: 'admin',
      password: 'oldpassword',
    };

    service.setUser(user);

    spyOn(service, 'getUser').and.returnValue(user);
    httpSpy.get.and.returnValue(
      throwError(() => ({
        message: `Incorrect password for user ${user.username}`,
      }))
    );

    service.verify().subscribe({
      next: () => {
        expect(false).toBeTrue();
      },
    });

    expect(service.getUser).toHaveBeenCalledOnceWith();
    expect(httpSpy.get).toHaveBeenCalledOnceWith(`/users/login`, {
      headers: { Username: user.username, Password: user.password },
    });
  });

  it('should verify user if credentials are correct', () => {
    const user: LoggedInUser = {
      username: 'admin',
      password: 'correctpass',
    };

    service.setUser(user);

    spyOn(service, 'getUser').and.returnValue(user);
    httpSpy.get.and.returnValue(
      of({
        message: 'user is logged in',
      })
    );

    service.verify().subscribe({
      error: () => {
        expect(false).toBeTrue();
      },
    });

    expect(service.getUser).toHaveBeenCalledOnceWith();
    expect(httpSpy.get).toHaveBeenCalledOnceWith(`/users/login`, {
      headers: { Username: user.username, Password: user.password },
    });
  });
});
