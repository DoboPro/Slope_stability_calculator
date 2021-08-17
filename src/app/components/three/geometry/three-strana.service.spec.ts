import { TestBed } from '@angular/core/testing';

import { ThreeStranaService } from './three-strana.service';

describe('ThreeStranaService', () => {
  let service: ThreeStranaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ThreeStranaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
