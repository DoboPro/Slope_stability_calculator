import { TestBed } from '@angular/core/testing';

import { ThreeLoadService } from './three-load.service';

describe('ThreeLoadService', () => {
  let service: ThreeLoadService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ThreeLoadService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
