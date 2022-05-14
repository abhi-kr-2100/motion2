import { TestBed } from '@angular/core/testing';

import { HttpClient } from '@angular/common/http';

import { RawApiRequestService } from './raw-api-request.service';

describe('RawApiRequestService', () => {
  let service: RawApiRequestService;
  let httpSpy: jasmine.SpyObj<HttpClient>;

  beforeEach(() => {
    httpSpy = jasmine.createSpyObj('HttpClient', [
      'get',
      'post',
      'put',
      'delete',
    ]);
    TestBed.configureTestingModule({
      providers: [{ provide: HttpClient, useValue: httpSpy }],
    });
    service = TestBed.inject(RawApiRequestService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
