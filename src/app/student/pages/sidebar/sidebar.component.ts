import { Component, OnInit, ViewChild } from '@angular/core';
import { StudentService } from 'src/app/services/student.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {

  @ViewChild('itemsMenu')itemsMenu;

  constructor(
    private studentS: StudentService
  ) { }

  public showMenu = false;

  ngOnInit() {
    this.studentS.getshowMenu().subscribe(
      resp=>{
        this.showMenu = !this.showMenu;
      }
    );
  }
}
