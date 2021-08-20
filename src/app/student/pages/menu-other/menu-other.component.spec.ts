import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuOtherComponent } from './menu-other.component';

describe('MenuOtherComponent', () => {
  let component: MenuOtherComponent;
  let fixture: ComponentFixture<MenuOtherComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MenuOtherComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MenuOtherComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
