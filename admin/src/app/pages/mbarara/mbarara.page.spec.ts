import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MbararaPage } from './mbarara.page';

describe('MbararaPage', () => {
  let component: MbararaPage;
  let fixture: ComponentFixture<MbararaPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MbararaPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MbararaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
