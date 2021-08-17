import { TestBed } from '@angular/core/testing';

import { StranaService } from './strana.service';

describe('StranaService', () => {
  let service: StranaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StranaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
