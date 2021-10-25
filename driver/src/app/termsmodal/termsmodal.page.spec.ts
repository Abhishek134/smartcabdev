import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TermsmodalPage } from './termsmodal.page';

describe('TermsmodalPage', () => {
  let component: TermsmodalPage;
  let fixture: ComponentFixture<TermsmodalPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TermsmodalPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TermsmodalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
