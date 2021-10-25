import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PromosPage } from './promos.page';

describe('PromosPage', () => {
  let component: PromosPage;
  let fixture: ComponentFixture<PromosPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PromosPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PromosPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
