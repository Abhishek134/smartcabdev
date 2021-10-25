import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CancelledtripsPage } from './cancelledtrips.page';

describe('CancelledtripsPage', () => {
  let component: CancelledtripsPage;
  let fixture: ComponentFixture<CancelledtripsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CancelledtripsPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CancelledtripsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
