import { TestBed } from '@angular/core/testing';

import { InitialConditionService } from './initial-condition.service';

describe('InitialConditionService', () => {
  let service: InitialConditionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InitialConditionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
