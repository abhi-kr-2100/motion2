import { TestBed } from '@angular/core/testing';

import { of } from 'rxjs';
import { v4 as uuid4 } from 'uuid';

import { LoggedInUser } from '../models/user';
import { ApiRequestService } from './api-request.service';
import { AuthenticatedUserService } from './authenticated-user.service';
import { RawApiRequestService } from './raw-api-request.service';

describe('ApiRequestService', () => {
  let service: ApiRequestService;
  let authenticatedUserSpy: jasmine.SpyObj<AuthenticatedUserService>;
  // must use any because using correct type causes false TypeScript errors
  let httpClientSpy: jasmine.SpyObj<any>;

  beforeEach(() => {
    httpClientSpy = jasmine.createSpyObj('RawApiRequestService', [
      'get',
      'post',
      'put',
      'delete',
    ]);

    authenticatedUserSpy = jasmine.createSpyObj('AuthenticatedUser', [
      'getUser',
    ]);

    TestBed.configureTestingModule({
      providers: [
        ApiRequestService,
        { provide: RawApiRequestService, useValue: httpClientSpy },
        { provide: AuthenticatedUserService, useValue: authenticatedUserSpy },
      ],
    });
    service = TestBed.inject(ApiRequestService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should not make any request if no user is logged in', () => {
    authenticatedUserSpy.getUser.and.returnValue(null);

    service.get('/api/test').subscribe({
      next: () => {
        expect(true).withContext('should not be called').toBeFalse();
      },
      error: (err) => {},
    });

    service.post('/api/test').subscribe({
      next: () => {
        expect(true).withContext('should not be called').toBeFalse();
      },
      error: (err) => {},
    });

    service.put('/api/test').subscribe({
      next: () => {
        expect(true).withContext('should not be called').toBeFalse();
      },
      error: (err) => {},
    });

    service.delete('/api/test').subscribe({
      next: () => {
        expect(true).withContext('should not be called').toBeFalse();
      },
      error: (err) => {},
    });

    expect(authenticatedUserSpy.getUser).toHaveBeenCalledTimes(4);

    expect(httpClientSpy.get)
      .withContext('spy was not called')
      .not.toHaveBeenCalled();
    expect(httpClientSpy.post)
      .withContext('spy was not called')
      .not.toHaveBeenCalled();
    expect(httpClientSpy.put)
      .withContext('spy was not called')
      .not.toHaveBeenCalled();
    expect(httpClientSpy.delete)
      .withContext('spy was not called')
      .not.toHaveBeenCalled();
  });

  it('should make a get request with authenticated user', () => {
    const user: LoggedInUser = {
      id: uuid4(),
      username: 'a-username',
      password: 'a-password',
    };

    const stubObj = { message: 'success' };
    const stubVal = of(stubObj);

    authenticatedUserSpy.getUser.and.returnValue(user);
    httpClientSpy.get.and.returnValue(stubVal);

    service.get('/api/test').subscribe({
      next: (val) => {
        expect(val as any).toEqual(stubObj);
      },
      error: (err) => {
        expect(false).withContext('should not be called').toBeTrue();
      },
    });

    expect(authenticatedUserSpy.getUser)
      .withContext('authenticatedUserSpy was called once')
      .toHaveBeenCalledTimes(1);
    expect(httpClientSpy.get)
      .withContext('httpClientSpy was called once')
      .toHaveBeenCalledTimes(1);
    expect(httpClientSpy.get.calls.mostRecent().args[0].endsWith('/api/test'))
      .withContext('spy was called with given url')
      .toBeTrue();
    expect(httpClientSpy.get.calls.mostRecent().args[1].headers.Username)
      .withContext('spy was called with given value of username')
      .toBe(user.username);
    expect(httpClientSpy.get.calls.mostRecent().args[1].headers.Password)
      .withContext('spy was called with given value of password')
      .toBe(user.password);
  });

  it('should make a post request with authenticated user', () => {
    const user: LoggedInUser = {
      id: uuid4(),
      username: 'a-username',
      password: 'a-password',
    };

    const stubObj = { message: 'success' };
    const stubVal = of(stubObj);

    authenticatedUserSpy.getUser.and.returnValue(user);
    httpClientSpy.post.and.returnValue(stubVal);

    const stubBody = { test: 'test' };
    service.post('/api/test', stubBody).subscribe({
      next: (val) => {
        expect(val as any).toEqual(stubObj);
      },
      error: (err) => {
        expect(false).withContext('should not be called').toBeTrue();
      },
    });

    expect(authenticatedUserSpy.getUser)
      .withContext('authenticatedUserSpy was called once')
      .toHaveBeenCalledTimes(1);
    expect(httpClientSpy.post)
      .withContext('httpClientSpy was called once')
      .toHaveBeenCalledTimes(1);
    expect(httpClientSpy.post.calls.mostRecent().args[0].endsWith('/api/test'))
      .withContext('spy was called with given url')
      .toBeTrue();
    expect(httpClientSpy.post.calls.mostRecent().args[1])
      .withContext('spy was called with given body')
      .toEqual(stubBody);
    expect(httpClientSpy.post.calls.mostRecent().args[2].headers.Username)
      .withContext('spy was called with given value of username')
      .toBe(user.username);
    expect(httpClientSpy.post.calls.mostRecent().args[2].headers.Password)
      .withContext('spy was called with given value of password')
      .toBe(user.password);
  });

  it('should make a put request with authenticated user', () => {
    const user: LoggedInUser = {
      id: uuid4(),
      username: 'a-username',
      password: 'a-password',
    };

    const stubObj = { message: 'success' };
    const stubVal = of(stubObj);

    authenticatedUserSpy.getUser.and.returnValue(user);
    httpClientSpy.put.and.returnValue(stubVal);

    const stubBody = { test: 'test' };
    service.put('/api/test', stubBody).subscribe({
      next: (val) => {
        expect(val as any).toEqual(stubObj);
      },
      error: (err) => {
        expect(false).withContext('should not be called').toBeTrue();
      },
    });

    expect(authenticatedUserSpy.getUser)
      .withContext('authenticatedUserSpy was called once')
      .toHaveBeenCalledTimes(1);
    expect(httpClientSpy.put)
      .withContext('httpClientSpy was called once')
      .toHaveBeenCalledTimes(1);
    expect(httpClientSpy.put.calls.mostRecent().args[0].endsWith('/api/test'))
      .withContext('spy was called with given url')
      .toBeTrue();
    expect(httpClientSpy.put.calls.mostRecent().args[1])
      .withContext('spy was called with given body')
      .toEqual(stubBody);
    expect(httpClientSpy.put.calls.mostRecent().args[2].headers.Username)
      .withContext('spy was called with given value of username')
      .toBe(user.username);
    expect(httpClientSpy.put.calls.mostRecent().args[2].headers.Password)
      .withContext('spy was called with given value of password')
      .toBe(user.password);
  });

  it('should make a delete request with authenticated user', () => {
    const user: LoggedInUser = {
      id: uuid4(),
      username: 'a-username',
      password: 'a-password',
    };

    const stubObj = { message: 'success' };
    const stubVal = of(stubObj);

    authenticatedUserSpy.getUser.and.returnValue(user);
    httpClientSpy.delete.and.returnValue(stubVal);

    service.delete('/api/test').subscribe({
      next: (val) => {
        expect(val as any).toEqual(stubObj);
      },
      error: (err) => {
        expect(false).withContext('should not be called').toBeTrue();
      },
    });

    expect(authenticatedUserSpy.getUser)
      .withContext('authenticatedUserSpy was called once')
      .toHaveBeenCalledTimes(1);
    expect(httpClientSpy.delete)
      .withContext('httpClientSpy was called once')
      .toHaveBeenCalledTimes(1);
    expect(
      httpClientSpy.delete.calls.mostRecent().args[0].endsWith('/api/test')
    )
      .withContext('spy was called with given url')
      .toBeTrue();
    expect(httpClientSpy.delete.calls.mostRecent().args[1].headers.Username)
      .withContext('spy was called with given value of username')
      .toBe(user.username);
    expect(httpClientSpy.delete.calls.mostRecent().args[1].headers.Password)
      .withContext('spy was called with given value of password')
      .toBe(user.password);
  });
});
