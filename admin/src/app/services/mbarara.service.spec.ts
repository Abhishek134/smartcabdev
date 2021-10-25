import { TestBed } from '@angular/core/testing';

import { MbararaService } from './mbarara.service';

describe('MbararaService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MbararaService = TestBed.get(MbararaService);
    expect(service).toBeTruthy();
  });
});
