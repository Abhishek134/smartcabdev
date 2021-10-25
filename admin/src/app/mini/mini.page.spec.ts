import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MiniPage } from './mini.page';

describe('MiniPage', () => {
  let component: MiniPage;
  let fixture: ComponentFixture<MiniPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MiniPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MiniPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
