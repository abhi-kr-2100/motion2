import { TestBed } from '@angular/core/testing';

import { RawApiRequestService } from './raw-api-request.service';

describe('RawApiRequestService', () => {
  let service: RawApiRequestService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RawApiRequestService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
