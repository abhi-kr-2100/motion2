import { HttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { LoggedInUser } from 'src/models/user';

import { ApiRequestService } from './api-request.service';
import { AuthenticatedUserService } from './authenticated-user.service';

describe('ApiRequestService', () => {
  let service: ApiRequestService;
  let authenticatedUserSpy: jasmine.SpyObj<any>;
  let httpClientSpy: jasmine.SpyObj<any>;

  beforeEach(() => {
    httpClientSpy = jasmine.createSpyObj('HttpClient', [
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
        { provide: HttpClient, useValue: httpClientSpy },
        { provide: AuthenticatedUserService, useValue: authenticatedUserSpy },
      ],
    });
    service = TestBed.inject(ApiRequestService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should make a get request given headers', () => {
    const stubVal = of({ message: 'success' });
    httpClientSpy.get.and.returnValue(stubVal);

    const headers = {
      Username: 'admin',
      Password: 'admin',
    };

    expect(service.getWithHeaders('/api/test', headers))
      .withContext('service returned stub value')
      .toBe(stubVal);
    expect(httpClientSpy.get)
      .withContext('spy was called once')
      .toHaveBeenCalledTimes(1);
    expect(httpClientSpy.get.calls.mostRecent().args[0].endsWith('/api/test'))
      .withContext('spy was called with given url')
      .toBeTrue();
    expect(httpClientSpy.get.calls.mostRecent().args[1].headers.Username)
      .withContext('spy was called with given value of username')
      .toBe(headers.Username);
    expect(httpClientSpy.get.calls.mostRecent().args[1].headers.Password)
      .withContext('spy was called with given value of password')
      .toBe(headers.Password);
    expect(httpClientSpy.get.calls.mostRecent().returnValue)
      .withContext('service returned stub value')
      .toBe(stubVal);
  });

  it('should not make any request if no user is logged in', () => {
    authenticatedUserSpy.getUser.and.returnValue(null);

    service.get('/api/test').subscribe({
      next: () => {
        expect(true).withContext('should not be called').toBeFalse();
      },
    });

    service.post('/api/test').subscribe({
      next: () => {
        expect(true).withContext('should not be called').toBeFalse();
      },
    });

    service.put('/api/test').subscribe({
      next: () => {
        expect(true).withContext('should not be called').toBeFalse();
      },
    });

    service.delete('/api/test').subscribe({
      next: () => {
        expect(true).withContext('should not be called').toBeFalse();
      },
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
      username: 'a-username',
      password: 'a-password',
    };

    const stubObj = { message: 'success' };
    const stubVal = of(stubObj);

    authenticatedUserSpy.getUser.and.returnValue(user);
    httpClientSpy.get.and.returnValue(stubVal);

    service.get('/api/test').subscribe({
      next: (val) => {
        expect(val).toEqual(stubObj);
      },
      error: () => {
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
        expect(val).toEqual(stubObj);
      },
      error: () => {
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
        expect(val).toEqual(stubObj);
      },
      error: () => {
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
      username: 'a-username',
      password: 'a-password',
    };

    const stubObj = { message: 'success' };
    const stubVal = of(stubObj);

    authenticatedUserSpy.getUser.and.returnValue(user);
    httpClientSpy.delete.and.returnValue(stubVal);

    service.delete('/api/test').subscribe({
      next: (val) => {
        expect(val).toEqual(stubObj);
      },
      error: () => {
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
