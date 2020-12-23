import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardEnrollComponent } from './dashboard-enroll.component';

describe('DashboardEnrollComponent', () => {
  let component: DashboardEnrollComponent;
  let fixture: ComponentFixture<DashboardEnrollComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DashboardEnrollComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardEnrollComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
