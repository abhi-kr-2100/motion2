import { HttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';

import { ApiRequestService } from './api-request.service';

describe('ApiRequestService', () => {
  let service: ApiRequestService;
  let httpClientSpy = jasmine.createSpyObj('HttpClient', [
    'get',
    'post',
    'put',
    'delete',
  ]);

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ApiRequestService,
        { provide: HttpClient, useValue: httpClientSpy },
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

  it('should make a get request', () => {
    expect(false).toBeTruthy();
  });

  it('should make a post request', () => {
    expect(false).toBeTruthy();
  });

  it('should make a put request', () => {
    expect(false).toBeTruthy();
  });

  it('should make a delete request', () => {
    expect(false).toBeTruthy();
  });
});
