import { TestBed } from '@angular/core/testing';

import { OnlyDriverService } from './only-driver.service';

describe('OnlyDriverService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: OnlyDriverService = TestBed.get(OnlyDriverService);
    expect(service).toBeTruthy();
  });
});
