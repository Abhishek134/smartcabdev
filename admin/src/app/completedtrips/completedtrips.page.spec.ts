import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CompletedtripsPage } from './completedtrips.page';

describe('CompletedtripsPage', () => {
  let component: CompletedtripsPage;
  let fixture: ComponentFixture<CompletedtripsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CompletedtripsPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompletedtripsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
