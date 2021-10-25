import { TestBed } from '@angular/core/testing';

import { IonicComponentService } from './ionic-component.service';

describe('IonicComponentService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: IonicComponentService = TestBed.get(IonicComponentService);
    expect(service).toBeTruthy();
  });
});
