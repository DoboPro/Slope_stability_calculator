import { TestBed } from '@angular/core/testing';

import { WaterlevelService } from './waterlevel.service';

describe('WaterlevelService', () => {
  let service: WaterlevelService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WaterlevelService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
