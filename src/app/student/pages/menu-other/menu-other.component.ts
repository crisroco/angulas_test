import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-menu-other',
  templateUrl: './menu-other.component.html',
  styleUrls: ['./menu-other.component.scss']
})
export class MenuOtherComponent implements OnInit {

  @Input('heightOther') heightOther: number;
  @Output('heightOtherEmit') heightOtherEmit = new EventEmitter();

  constructor() { }

  ngOnInit() {
  }

  changeItem(){
    
  }
}
