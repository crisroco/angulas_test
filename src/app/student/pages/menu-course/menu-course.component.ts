import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { interval, Subscription } from 'rxjs';
import * as moment from 'moment';

@Component({
  selector: 'app-menu-course',
  templateUrl: './menu-course.component.html',
  styleUrls: ['./menu-course.component.scss']

})
export class MenuCourseComponent implements OnInit, OnDestroy {

  @Input('course') course: any[];
  @Input('loadCourse') loadCourse: any[];
  
  constructor() { }
  //VARS
  private afterMinutes = 10;
  //MOMENT
  private moment = moment;
  private dateMoment = moment().format('YYYY-MM-DD');
  private dateTimeMoment = moment().format('YYYY-MM-DD HH:mm:ss');
  //RXJS
  private interval = interval(1000);
  private subscription = new Subscription();
  //EVENTS
  @Output() openZoomEmit = new EventEmitter();

  ngOnInit() {
    moment.locale('es');

    this.subscription.add(this.interval.subscribe(
      resp => {
        this.dateTimeMoment = moment().format('YYYY-MM-DD HH:mm:ss');
      }
    ));
  }

  openLinkZoom(data) {
    if(this.validateRangeWithAfterMinutes(data.MEETING_TIME_START, data.MEETING_TIME_END)){
      this.openZoomEmit.emit(data);
    }
  }

  getDateMoment() {
    return this.capitalizarPrimeraLetra(this.moment().format('dddd, D MMMM YYYY'));
  }

  calculateTime(time) {
    return this.transformTime(this.moment(`${this.dateMoment} ${time}`).from(this.dateTimeMoment));
  }

  transformTime(time: string) {
    return time.replace(/\b(?: un | una )\b/gi, ' 1 ').toUpperCase();
  }

  validateRange(init, end) {
    let initDate = `${this.dateMoment} ${init}`;
    let endDate = `${this.dateMoment} ${end}`;

    return this.moment(this.dateTimeMoment).isBetween(initDate, endDate);
  }

  validateRangeWithAfterMinutes(init, end) {
    let initDate = `${this.dateMoment} ${init}`;
    let endDate = `${this.dateMoment} ${end}`;

    return this.moment(this.dateTimeMoment).isBetween(this.moment(initDate).subtract(this.afterMinutes, 'minutes'), endDate);
  }

  validateAfter(end) {
    return this.moment(this.dateTimeMoment).isSameOrAfter(`${this.dateMoment} ${end}`);
  }

  validCourseVisible(){
    return this.course.filter(f=> !this.validateAfter(f.MEETING_TIME_END) );
  }

  capitalizarPrimeraLetra(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
