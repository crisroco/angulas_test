import { Component, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { StudentService } from 'src/app/services/student.service';

@Component({
  selector: 'app-menu-items',
  templateUrl: './menu-items.component.html',
  styleUrls: ['./menu-items.component.scss']
})
export class MenuItemsComponent implements OnInit, OnChanges {

  @Input('widthMenu') widthMenu: number;

  constructor(
    private studentS: StudentService
  ) { }
  ngOnChanges(changes: SimpleChanges): void {
    setTimeout(() => {
      this.widthMenuValid = this.widthMenu;
    }, 100);
  }

  public showDoc = false;
  public widthMenuValid = 0;

  ngOnInit() {
  }

  linkModalOpen() {
    this.studentS.setShowdocLoad(true);
  }

}
