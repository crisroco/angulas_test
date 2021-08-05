import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-menu-course',
  templateUrl: './menu-course.component.html',
  styleUrls: ['./menu-course.component.scss']
})
export class MenuCourseComponent implements OnInit {

  @Input('course') course: any[];

  constructor() { }

  ngOnInit() {
  }

}
