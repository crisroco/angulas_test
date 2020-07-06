import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FinalGradesComponent } from './final-grades.component';

describe('FinalGradesComponent', () => {
  let component: FinalGradesComponent;
  let fixture: ComponentFixture<FinalGradesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FinalGradesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FinalGradesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
