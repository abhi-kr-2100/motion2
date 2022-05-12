import { TestBed } from '@angular/core/testing';

import { ApiRequestService } from './api-request.service';

describe('ApiRequestService', () => {
  let service: ApiRequestService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ApiRequestService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should not make a get request given headers', () => {
    expect(false).toBeTruthy();
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
