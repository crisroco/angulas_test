import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CoursesEnrollmentComponent } from './courses-enrollment.component';

describe('CoursesEnrollmentComponent', () => {
  let component: CoursesEnrollmentComponent;
  let fixture: ComponentFixture<CoursesEnrollmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CoursesEnrollmentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CoursesEnrollmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
