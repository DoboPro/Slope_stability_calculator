import { TestBed } from '@angular/core/testing';

import { ThreeSurfaceService } from './three-surface.service';

describe('ThreeSurfaceService', () => {
  let service: ThreeSurfaceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ThreeSurfaceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
