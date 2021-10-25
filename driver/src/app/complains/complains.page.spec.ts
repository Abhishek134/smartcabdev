import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ComplainsPage } from './complains.page';

describe('ComplainsPage', () => {
  let component: ComplainsPage;
  let fixture: ComponentFixture<ComplainsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ComplainsPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ComplainsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
