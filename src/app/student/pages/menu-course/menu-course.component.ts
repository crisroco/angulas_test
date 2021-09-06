import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { interval, Subscription } from 'rxjs';
import * as moment from 'moment-timezone';
import { StudentService } from 'src/app/services/student.service';
import { SessionService } from 'src/app/services/session.service';
import { DateFixedSOTz } from '../../../helpers/dates';
import { Gtag } from 'angular-gtag';
@Component({
  selector: 'app-menu-course',
  templateUrl: './menu-course.component.html',
  styleUrls: ['./menu-course.component.scss']

})
export class MenuCourseComponent implements OnInit, OnDestroy {

  @Input('course') course: any[];
  @Input('student') student: any[];
  @Input('loadCourse') loadCourse: any[];
  @Output() emitMarcacion = new EventEmitter();

  constructor(
    private studentService: StudentService,
    private gtag: Gtag,
    private _s:SessionService
  ) { }
  //VARS
  private afterMinutes = 10;
  //MOMENT
  private dateMoment = moment().tz('America/Lima').format('YYYY-MM-DD');
  private dateTimeMoment = moment().tz('America/Lima').format('YYYY-MM-DD HH:mm:ss');
  //RXJS
  private interval = interval(1000);
  private subscription = new Subscription();
  //EVENTS
  @Output() openZoomEmit = new EventEmitter();

  ngOnInit() {
    moment.locale('es');
    this.subscription.add(this.interval.subscribe(
      resp => {
        this.dateTimeMoment = moment().tz('America/Lima').format('YYYY-MM-DD HH:mm:ss');
      }
    ));
    console.log(this.course);
    console.log(this.loadCourse);
  }

  courseSplit() {
    return this.validCourseVisible().slice(0, 3);
  }

  openLinkZoom(data) {
    let sendData = JSON.parse(JSON.stringify(data));
    if (this.validateRangeWithAfterMinutes(sendData.MEETING_TIME_START, sendData.MEETING_TIME_END) && this.validateClick(sendData)) {
      // let time2 = moment(`${this.dateMoment} ${sendData.MEETING_TIME_START}`).format('X');
      let time = Math.floor(Number(DateFixedSOTz(this.dateMoment, sendData.MEETING_TIME_START))/1000);
      this.studentService.getLinkZoom(sendData.STRM, sendData.CLASS_NBR2, time, sendData.DOCENTE, sendData.CLASS_SECTION, sendData.INSTITUTION)
        .then((res) => {
          if (!res.includes('false')) {
            sendData.callback = (() => {
              this.gtag.event('zoom_link_' + sendData.STRM + '_' + sendData.CLASS_NBR2, { 
                method: 'click',
                event_category: 'zoom_link'
              });
              this.openTabZoom(res);
            })
            this.openZoomEmit.emit(sendData);
          } else {
            this._s.seterrorModal(true);
          }
        });
    }
  }

  openTabZoom(res) {
    let link = res.replace(/<\/?[^>]+(>|$)/g, "");
    let a = document.createElement("a");
    a.setAttribute('style', 'display: none');
    a.href = link;
    a.target = '_self'
    a.click();
    window.URL.revokeObjectURL(link);
    a.remove();
  }

  getDateMoment() {
    return this.capitalizarPrimeraLetra(moment(this.dateMoment).format('dddd, D MMMM YYYY'));
  }

  calculateTime(time) {
    return this.transformTime(moment(`${this.dateMoment} ${time}`).from(this.dateTimeMoment));
  }

  transformTime(time: string) {
    time = time.replace("unos",'');
    return time.replace(/\b(?: un | una )\b/gi, ' 1 ').toUpperCase();
  }

  validateRange(init, end) {
    let initDate = `${this.dateMoment} ${init}`;
    let endDate = `${this.dateMoment} ${end}`;

    return moment(this.dateTimeMoment).isBetween(initDate, endDate);
  }

  validateRangeWithAfterMinutes(init, end) {
    let initDate = `${this.dateMoment} ${init}`;
    let endDate = `${this.dateMoment} ${end}`;

    return moment(this.dateTimeMoment).isBetween(moment(initDate).subtract(this.afterMinutes, 'minutes'), endDate);
  }

  validateAfter(end) {
    return moment(this.dateTimeMoment).isSameOrAfter(`${this.dateMoment} ${end}`);
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
      if (["1032", "2223"].includes(data.STRM)) {
        //valida que sea pregrado
        if ("PREGR" == data.INSTITUTION) {
          //valida la lista de cursos externado
          return !["001070", "001071", "001072", "001073", "666911", "667233"].includes(data.CRSE_ID);
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
