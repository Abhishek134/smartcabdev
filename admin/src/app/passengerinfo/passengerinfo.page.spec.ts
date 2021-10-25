import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PassengerinfoPage } from './passengerinfo.page';

describe('PassengerinfoPage', () => {
  let component: PassengerinfoPage;
  let fixture: ComponentFixture<PassengerinfoPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PassengerinfoPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PassengerinfoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
