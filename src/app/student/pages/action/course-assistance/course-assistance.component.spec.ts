import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CourseAssistanceComponent } from './course-assistance.component';

describe('CourseAssistanceComponent', () => {
  let component: CourseAssistanceComponent;
  let fixture: ComponentFixture<CourseAssistanceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CourseAssistanceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CourseAssistanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
