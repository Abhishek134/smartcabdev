import { TestBed } from '@angular/core/testing';

import { BodaService } from './boda.service';

describe('BodaService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: BodaService = TestBed.get(BodaService);
    expect(service).toBeTruthy();
  });
});
