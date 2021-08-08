import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-notice',
  templateUrl: './notice.component.html',
  styleUrls: ['./notice.component.scss']
})
export class NoticeComponent implements OnInit {

  @Input('notice') notice: any[];

  constructor() { }

  ngOnInit() {
  }

  showMore(i) {
    this.notice.forEach((r, ind) => {
      if (ind == i) {
        r.expand = true;
      } else {
        r.expand = false;
      }
    })
  }

  hideMore() {
    this.notice.forEach((r) => {
      r.expand = false;
    })
  }
}
