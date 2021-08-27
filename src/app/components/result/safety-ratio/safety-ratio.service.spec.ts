import { TestBed } from '@angular/core/testing';

import { SafetyRatioService } from './safety-ratio.service';

describe('SafetyRatioService', () => {
  let service: SafetyRatioService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SafetyRatioService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
