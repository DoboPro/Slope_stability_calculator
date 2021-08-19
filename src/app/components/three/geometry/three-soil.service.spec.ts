import { TestBed } from '@angular/core/testing';

import { ThreeSoilService } from './three-soil.service';

describe('ThreeSoilService', () => {
  let service: ThreeSoilService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ThreeSoilService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
