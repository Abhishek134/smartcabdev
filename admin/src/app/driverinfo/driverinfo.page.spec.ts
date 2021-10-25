import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DriverinfoPage } from './driverinfo.page';

describe('DriverinfoPage', () => {
  let component: DriverinfoPage;
  let fixture: ComponentFixture<DriverinfoPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DriverinfoPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DriverinfoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
