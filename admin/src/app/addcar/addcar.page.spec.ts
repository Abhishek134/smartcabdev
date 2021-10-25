import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddcarPage } from './addcar.page';

describe('AddcarPage', () => {
  let component: AddcarPage;
  let fixture: ComponentFixture<AddcarPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddcarPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddcarPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
