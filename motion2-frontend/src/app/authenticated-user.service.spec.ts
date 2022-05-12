import { TestBed } from '@angular/core/testing';

import { AuthenticatedUserService } from './authenticated-user.service';

import { LoggedInUser } from '../models/user';

describe('AuthenticatedUserService', () => {
  let service: AuthenticatedUserService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
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
});
