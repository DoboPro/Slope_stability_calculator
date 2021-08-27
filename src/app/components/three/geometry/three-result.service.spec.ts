import { TestBed } from '@angular/core/testing';

import { ThreeResultService } from './three-result.service';

describe('ThreeResultService', () => {
  let service: ThreeResultService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ThreeResultService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
