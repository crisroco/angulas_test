import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { StudentService } from 'src/app/services/student.service';

@Component({
  selector: 'app-menu-other',
  templateUrl: './menu-other.component.html',
  styleUrls: ['./menu-other.component.scss']
})
export class MenuOtherComponent implements OnInit {

  @Input('heightOther') heightOther: number;
  @Output('heightOtherEmit') heightOtherEmit = new EventEmitter();

  constructor(
    private studentService:StudentService
  ) { }

  ngOnInit() {
  }

  linkModalOpen(){
    this.studentService.setemitDocOther(true);
  }

  logout(){
    this.studentService.setemitLogout(true);
  }
}
