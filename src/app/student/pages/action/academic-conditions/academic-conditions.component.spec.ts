import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AcademicConditionsComponent } from './academic-conditions.component';

describe('AcademicConditionsComponent', () => {
  let component: AcademicConditionsComponent;
  let fixture: ComponentFixture<AcademicConditionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AcademicConditionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AcademicConditionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
