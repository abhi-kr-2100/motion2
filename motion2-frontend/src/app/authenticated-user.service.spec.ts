import { TestBed } from '@angular/core/testing';

import { AuthenticatedUserService } from './authenticated-user.service';

import { LoggedInUser } from '../models/user';

describe('AuthenticatedUserService', () => {
  let service: AuthenticatedUserService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AuthenticatedUserService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should set a logged in user', () => {
    expect(false).toBeTrue();
  });

  it('should return the user when logged in', () => {
    expect(false).toBeTrue();
  });

  it('should return null when not logged in', () => {
    expect(false).toBeTrue();
  });
});
