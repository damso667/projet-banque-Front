import { TestBed } from '@angular/core/testing';

import { CaissierService } from './caissier-service';

describe('CaissierService', () => {
  let service: CaissierService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CaissierService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
