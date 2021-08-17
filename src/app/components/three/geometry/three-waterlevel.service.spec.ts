import { TestBed } from '@angular/core/testing';

import { ThreeWaterlevelService } from './three-waterlevel.service';

describe('ThreeWaterlevelService', () => {
  let service: ThreeWaterlevelService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ThreeWaterlevelService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
