import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CashlessPage } from './cashless.page';

describe('CashlessPage', () => {
  let component: CashlessPage;
  let fixture: ComponentFixture<CashlessPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CashlessPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CashlessPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
