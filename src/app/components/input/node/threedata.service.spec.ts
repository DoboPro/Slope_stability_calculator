import { TestBed } from '@angular/core/testing';

import { ThreedataService } from './threedata.service';

describe('ThreedataService', () => {
  let service: ThreedataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ThreedataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
