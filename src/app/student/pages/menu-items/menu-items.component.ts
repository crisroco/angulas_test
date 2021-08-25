import { Component, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { StudentService } from 'src/app/services/student.service';
import { Gtag } from 'angular-gtag';

@Component({
  selector: 'app-menu-items',
  templateUrl: './menu-items.component.html',
  styleUrls: ['./menu-items.component.scss']
})
export class MenuItemsComponent implements OnInit, OnChanges {

  @Input('widthMenu') widthMenu: number;

  constructor(
    private studentS: StudentService,
    private gtag: Gtag,
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
    this.gtag.event('academic_documents', { 
      method: 'click',
      event_category: 'modal'
    });
    this.studentS.setShowdocLoad(true);
  }

}
