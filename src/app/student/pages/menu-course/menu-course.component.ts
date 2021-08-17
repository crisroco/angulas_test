import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { interval, Subscription } from 'rxjs';
import * as moment from 'moment';
import { StudentService } from 'src/app/services/student.service';

@Component({
  selector: 'app-menu-course',
  templateUrl: './menu-course.component.html',
  styleUrls: ['./menu-course.component.scss']

})
export class MenuCourseComponent implements OnInit, OnDestroy {

  @Input('course') course: any[];
  @Input('student') student: any[];
  @Input('loadCourse') loadCourse: any[];

  constructor(
    private studentService: StudentService
  ) { }
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

  courseSplit() {
    return this.validCourseVisible().slice(0, 3);
  }

  openLinkZoom(data) {
    if (this.validateRangeWithAfterMinutes(data.MEETING_TIME_START, data.MEETING_TIME_END) && this.validateClick(data)) {
      let time = moment(`${this.dateMoment} ${data.MEETING_TIME_START}`).format('X');
      this.studentService.getLinkZoom(data.STRM, data.CLASS_NBR2, Number(time), data.DOCENTE, data.CLASS_SECTION, data.INSTITUTION)
        .then((res) => {
          if (!res.includes('false')) {
            this.openTabZoom(res);
          }
        });
    }
  }

  openTabZoom(res) {
    let link = res.replace(/<\/?[^>]+(>|$)/g, "");

    let a = document.createElement("a");
    a.setAttribute('style', 'display: none');
    a.href = link;
    a.target = '_blank'
    a.click();
    window.URL.revokeObjectURL(link);
    a.remove();
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

  limitCharacter(string: string) {
    if (!string) return '';
    if (string.length > 30) {
      return `${string.substr(0, 30)}...`
    } else {
      return string;
    }
  }

  validCourseVisible() {
    return this.course ?
      this.course.filter(f => !this.validateAfter(f.MEETING_TIME_END)) :
      [];
  }

  capitalizarPrimeraLetra(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  validateClick(data) {
    //valida el grado academico
    if (["PREGR"].includes(data.INSTITUTION)) {
      //valida ciclo electivo
      if (["1032", "2222"].includes(data.STRM)) {
        //valida que sea pregrado
        if ("PREGR" == data.INSTITUTION) {
          //valida la lista de cursos excluidos excluidos
          return !["001071", "001072", "001073", "666911", "667233"].includes(data.CRSE_ID);
        }
        return true;
      }
    }
    return false;
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
