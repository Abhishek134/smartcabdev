import { TestBed } from '@angular/core/testing';

import { MiniService } from './mini.service';

describe('MiniService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MiniService = TestBed.get(MiniService);
    expect(service).toBeTruthy();
  });
});
