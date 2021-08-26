import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { StudentService } from 'src/app/services/student.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
  public innerWidth: any;
  public oneMenu:boolean = false;
  nasdad = 200;
  @ViewChild('itemsMenu')itemsMenu;
  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.innerWidth = window.innerWidth;
    this.checkWidth(this.innerWidth);
  }

  constructor(
    private studentS: StudentService
  ) { }

  public showMenu = false;

  ngOnInit() {
    this.innerWidth = window.innerWidth;
    this.checkWidth(this.innerWidth);
    this.studentS.getshowMenu().subscribe(
      resp=>{
        this.showMenu = !this.showMenu;
      }
    );
  }

  checkWidth(width){
    if(width < 1200){
      this.oneMenu = true;
    } else {
      this.oneMenu = false;
    }
  }
}
