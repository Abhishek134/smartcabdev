import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DriverDepositPage } from './driver-deposit.page';

describe('DriverDepositPage', () => {
  let component: DriverDepositPage;
  let fixture: ComponentFixture<DriverDepositPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DriverDepositPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DriverDepositPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
