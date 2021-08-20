import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuCourseComponent } from './menu-course.component';

describe('MenuCourseComponent', () => {
  let component: MenuCourseComponent;
  let fixture: ComponentFixture<MenuCourseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MenuCourseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MenuCourseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
