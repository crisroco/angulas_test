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
  loadImg = false;

  ngOnInit() {
  }

  showImageHandler(data){
    this.loadImg = false;
    this.imgFile = data.imgPath;
    // this.imgFile = 'https://www.tooltyp.com/wp-content/uploads/2014/10/1900x920-8-beneficios-de-usar-imagenes-en-nuestros-sitios-web.jpg';
    this.showImage.open();
  }

  imgload(){
    this.loadImg = true;
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
