import { Component, Input, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-notice',
  templateUrl: './notice.component.html',
  styleUrls: ['./notice.component.scss']
})
export class NoticeComponent implements OnInit {

  @Input('notice') notice: any[];
  @ViewChild('showImage') showImage: any
  imgFile:string = '';
  constructor() { }

  ngOnInit() {
  }

  showImageHandler(data){
    console.log(data);
    this.imgFile = data.imgPath;
    this.showImage.open();
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
