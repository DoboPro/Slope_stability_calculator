import { TestBed } from '@angular/core/testing';

import { ThreeNodeService } from './three-node.service';

describe('ThreeNodeService', () => {
  let service: ThreeNodeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ThreeNodeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
