import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { XlPage } from './xl.page';

describe('XlPage', () => {
  let component: XlPage;
  let fixture: ComponentFixture<XlPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ XlPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(XlPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
