import { Component, OnInit, ViewChild } from '@angular/core';
import { Broadcaster } from '../../../services/broadcaster';
import { NgxSmartModalService } from 'ngx-smart-modal';
import { Router } from '@angular/router';
import { NewEnrollmentService } from '../../../services/newenrollment.service';
import { ToastrService } from 'ngx-toastr';
import { SessionService } from '../../../services/session.service';
import { CalendarDateFormatter, CalendarView, CalendarEventAction, CalendarEvent } from 'angular-calendar';
import { RealDate, AddDay, GetFirstDayWeek, GetFirstDayWeek2, SubstractDay, BetweenDays } from '../../../helpers/dates';
import { ValidateEmail } from '../../../helpers/general';
@Component({
  selector: 'app-enrollment',
  templateUrl: './enrollment.component.html',
  styleUrls: ['./enrollment.component.scss']
})
export class EnrollmentComponent implements OnInit {
	crossdata: any;
  @ViewChild('schedulePreview') schedulePreview: any;
  @ViewChild('aditionalCoursesModal') aditionalCoursesModal: any;
  @ViewChild('equivalentCoursesModal') equivalentCoursesModal: any;
  @ViewChild('showModalEmailSend') showModalEmailSend: any;
  loading: boolean = false;
  aditionalCourses:Array<any> = [];
  equivalentCourses:Array<any> = [];
  skillFull;
  allData;
  schoolCycle: any = this.session.getObject('schoolCycle');
  user: any = this.session.getObject('user');
  student: any = this.session.getObject('student');
  dataEnrollment: any;
  myVirtualClasses:Array<any> = [];
  viewDate: Date = new Date(2021,3,5);
  events:CalendarEvent[] = [];
  CalendarView = CalendarView;
  view: CalendarView = CalendarView.Week;
  classDay: Array<any> = [];
  moreData: Array<any> = [];
  public emailToSend = '';
  public myCredits = 0;

  constructor(private broadcaster: Broadcaster, public enrollmentS: NewEnrollmentService, public session: SessionService, private router: Router, public toastT: ToastrService) { }

  ngOnInit() {
    this.session.destroy('mySchedule');
    this.student = this.session.getObject('student');
    this.enrollmentS.getAcademicData({EMPLID: this.user.codigoAlumno})
      .then((res) => {
        this.allData = res[0];
      });
    this.broadcaster.sendMessage({ hideFooter: true });
  	this.crossdata = this.broadcaster.getMessage().subscribe(message => {
      if (message && message.openModal) {
        this.moreData = message.selectedOnHold;
        this.openScheduleModalPreview();
      }
      if (message && message.cycleSelected) {
        this.schoolCycle = message.cycleSelected;
      }
      if (message && message.sendEmailModal) {
        this.emailToSend = '';
        this.myCredits = message.myCredits;
        this.showModalEmailSend.open();
      }
    });
  }

  openScheduleModalPreview(){
    if (this.session.getObject('mySchedule')) {
      this.schedulePreview.open();
      this.classDay = this.session.getObject('mySchedule');
      this.closeOpenMonthViewDay();
    } else {
      this.dataEnrollment = this.session.getObject('dataEnrollment');
      this.enrollmentS.getScheduleStudent({
        EMPLID: this.user.codigoAlumno,
        INSTITUTION: this.dataEnrollment['INSTITUTION'],
        ACAD_CAREER: this.dataEnrollment['ACAD_CAREER'],
        STRM1: this.schoolCycle.CICLO_LECTIVO,
        STRM2: this.session.getObject('otherCicle')?this.session.getObject('otherCicle').CICLO_LECTIVO:null
      }).then((res) => {
        this.schedulePreview.open();
        this.classDay = res['UCS_REST_CONS_HORA_MATR_RES']['UCS_REST_DET_HORARIO_RES']?res['UCS_REST_CONS_HORA_MATR_RES']['UCS_REST_DET_HORARIO_RES']:[];
        this.session.setObject('mySchedule', this.classDay);
        this.closeOpenMonthViewDay();
      });
    }
  }

  sendScheduleToMail(){
    if (ValidateEmail(this.emailToSend)) {
      this.loading = true;
      this.dataEnrollment = this.session.getObject('dataEnrollment');
      this.enrollmentS.sendEmailSchedule({
        EMPLID: this.user.codigoAlumno,
        EMAIL: this.emailToSend,
        NAME: this.student.nombreAlumno + ' ' + this.student.apellidoAlumno,
        INSTITUTION: this.dataEnrollment['INSTITUTION'],
        ACAD_CAREER: this.dataEnrollment['ACAD_CAREER'],
        PROG_PLAN: this.allData.ACAD_PROG + ' / ' + this.allData.ACAD_PLAN,
        STRM1: this.schoolCycle.CICLO_LECTIVO,
        TOTAL_CREDITS: this.myCredits,
        STRM2: this.session.getObject('otherCicle')?this.session.getObject('otherCicle').CICLO_LECTIVO:null
      })
        .then((res) => {
          this.toastT.success('Correo enviado');
          this.showModalEmailSend.close();
          this.loading = false;
        });
    } else {
      this.emailToSend = '';
      this.toastT.error('Ingresa un correo valido!');
    }
  }

  openEquivalentModal(){
    this.dataEnrollment = this.session.getObject('dataEnrollment');
    this.enrollmentS.getEquivalentsCourses({
      EMPLID: this.user.codigoAlumno,
      INSTITUTION: this.dataEnrollment['INSTITUTION'],
      ACAD_CAREER: this.dataEnrollment['ACAD_CAREER'],
      ACAD_PROG: this.dataEnrollment['ACAD_PROG'],
      ACAD_PLAN: this.dataEnrollment['ACAD_PLAN']
    }).then((res) => {
      this.equivalentCourses = res['RES_LST_CRSE_EQUIV']['COM_LST_CRSE_EQUIV'].sort((a,b) => {
        return a.UCS_CICLO - b.UCS_CICLO
      });
      this.equivalentCoursesModal.open();
    });
  }

  reload(){
    this.session.destroy('schoolCycle');
    if (this.router.url != '/estudiante/matricula/disponibles') {
      this.router.navigate(['/estudiante/matricula/disponibles']);
    } else {
      location.reload();
    }
  }

  aditionalModalData(openModal){
    this.loading = true;
    this.dataEnrollment = this.session.getObject('dataEnrollment');
    this.allData['EMPLID'] = this.user.codigoAlumno;
    this.allData['STRM'] = this.schoolCycle.CICLO_LECTIVO;
    this.enrollmentS.getAditionalCourses(this.allData)
      .then((res) => {
        this.aditionalCourses = res.UCS_CON_SOL_CUR_ADIC_RES.UCS_DETCUS_RES?res.UCS_CON_SOL_CUR_ADIC_RES.UCS_DETCUS_RES:[];
        this.enrollmentS.getSkillfullLoad({EMPLID: this.user.codigoAlumno, CAMPUS: this.dataEnrollment.CAMPUS})
        .then((res) => {
          res.sort((a,b) => {
            return a.UCS_CICLO - b.UCS_CICLO
          });
          for (var i = 0; i < res.length; i++) {
            if (!this.aditionalCourses.filter(el => el.CURSO_ID == res[i].CRSE_ID)[0] && res[i].number == 0) {
              res[i].extra = true;
              res[i].TURNO = 'M';
              this.aditionalCourses.push(res[i]);
            }
          }
          openModal?this.aditionalCoursesModal.open():null;
          this.loading = false;
        });
      })
  }


  openAditionalCoursesModal(){
    this.aditionalModalData(true);
  }

  deleteAditionalCourse(crs) {
    this.loading = true;
    this.enrollmentS.saveAditionalCourses({
      EMPLID: this.user.codigoAlumno,
      INSTITUTION: this.dataEnrollment['INSTITUTION'],
      ACAD_CAREER: this.dataEnrollment['ACAD_CAREER'],
      ACAD_PROG: this.dataEnrollment['ACAD_PROG'],
      ACAD_PLAN: this.dataEnrollment['ACAD_PLAN'],
      STRM: this.schoolCycle.CICLO_LECTIVO,
      UCS_REST_CUR_ADIC_DT: [{CRSE_ID: crs.CURSO_ID, TURNO: crs.TURNO, ACCION: 'B'}]
    }).then((res) => {
      this.loading = false;
      this.aditionalModalData(false);
    });
  }

  getCss(day){
    return day.type
  }

  confirmAditional(){
    this.loading = true;
    let aditional = [];
    for (var i = 0; i < this.aditionalCourses.length; i++) {
      if (this.aditionalCourses[i].extra && this.aditionalCourses[i].value) {
        aditional.push({
          CRSE_ID: this.aditionalCourses[i]['CRSE_ID'],
          TURNO: this.aditionalCourses[i]['TURNO']?this.aditionalCourses[i]['TURNO']:'M',
          ACCION: "I"
        });
      }
    }
    if (aditional.length == 0) {
      this.loading = false;
      this.toastT.warning('Tienes que seleccionar al menos un curso');
      return;
    }
    this.enrollmentS.saveAditionalCourses({
      EMPLID: this.user.codigoAlumno,
      INSTITUTION: this.dataEnrollment['INSTITUTION'],
      ACAD_CAREER: this.dataEnrollment['ACAD_CAREER'],
      ACAD_PROG: this.dataEnrollment['ACAD_PROG'],
      ACAD_PLAN: this.dataEnrollment['ACAD_PLAN'],
      STRM: this.schoolCycle.CICLO_LECTIVO,
      UCS_REST_CUR_ADIC_DT: aditional
    }).then((res) => {
      this.loading = false;
      this.aditionalModalData(false);
    });
  }

  closeOpenMonthViewDay(){
    var firstDate = GetFirstDayWeek(this.viewDate);
    var days = {
      LUNES:  RealDate(firstDate),
      MARTES: RealDate(AddDay(firstDate, 1)),
      MIERCOLES: RealDate(AddDay(firstDate, 2)),
      JUEVES: RealDate(AddDay(firstDate, 3)),
      VIERNES: RealDate(AddDay(firstDate, 4)),
      SABADO: RealDate(AddDay(firstDate, 5)),
      DOMINGO: RealDate(AddDay(firstDate, 6)),
    }
    var events = [];
    var objEvents = {};
    let dates: any = {};
    let inverted:any = {};
    this.myVirtualClasses = [];
    this.classDay.forEach(classD => {
      classD['UCS_REST_MTG_DET_REQ'].forEach(clase => {
        for(var kDay in days){
          if(clase[kDay] == 'Y'){
            if(BetweenDays(clase.INICIO_FECHA, clase.FIN_FECHA, days[kDay])){
              if (!clase['DESCR_INSTALACION'].includes('VIRT')) {
                var rDay = days[kDay].year + '-' + days[kDay].month + '-' + days[kDay].day;
                clase.date = rDay;
                if(!objEvents[rDay + ' ' + clase.HORA_INICIO + ':00' + ' ' + classD.CRSE_ID]){
                  dates = this.getDates(rDay, clase.HORA_INICIO + ':00', clase.HORA_FIN + ':00');
                  events.push({
                    start: dates.start,//new Date(rDay + ' ' + clase.MEETING_TIME_START),
                    end: dates.end,//new Date(rDay + ' ' + clase.HORA_FIN),
                    title: clase.HORA_INICIO + '-' + clase.HORA_FIN + '<br>' + classD.NOMBRE_CURSO + ' ' + classD.SECCION_CLASE + '<br>' + classD.DESCR_COMP + '<br>' + classD.CLASE,
                    cssClass: classD.CICLO_LECTIVO!=this.schoolCycle.CICLO_LECTIVO?'RED':'normal',
                    allDay: false,
                    resizable: {
                      beforeStart: false,
                      afterEnd: false,
                    },
                    meta: clase,
                  });
                  objEvents[rDay + ' ' + clase.HORA_INICIO + ':00' + ' ' + classD.CRSE_ID] = true;
                }
              } else {
                let finded = this.myVirtualClasses.filter(vclass => vclass.name == classD.NOMBRE_CURSO)[0];
                if (finded) {
                  finded.hrs_acad += this.toHours(clase.HORA_INICIO, clase.HORA_FIN);
                } else {
                  this.myVirtualClasses.push({
                    hour: clase.HORA_INICIO + '-' + clase.HORA_FIN,
                    descr_ciclo: classD.DESCR_CICLO,
                    name: classD.NOMBRE_CURSO,
                    fech_ini: clase.INICIO_FECHA,
                    fech_fin: clase.FIN_FECHA,
                    section: classD.SECCION_CLASE,
                    descr: classD.DESCR_COMP,
                    clase: classD.CLASE,
                    extra: false,
                    hrs_acad: this.toHours(clase.HORA_INICIO, clase.HORA_FIN)
                  });
                }
              }
            }
          }
        }
      });
    });
    if (this.moreData) {
      this.moreData.forEach(classD => {
        for (var kDay in days) {
          if (kDay.substring(0,3) == classD.DAY_OF_WEEK) {
            if(BetweenDays(classD.START_DT_DO, classD.END_DT_DO, days[kDay])){
              if (classD.CRSE_ATTR != 'VIRT') {
                var rDay = days[kDay].year + '-' + days[kDay].month + '-' + days[kDay].day;
                classD.date = rDay;
                if(!objEvents[rDay + ' ' + classD.MEETING_TIME_START + ' ' + classD.CRSE_ID]){
                  dates = this.getDates(rDay, classD.MEETING_TIME_START, classD.MEETING_TIME_END);
                  events.push({
                    start: dates.start,
                    end: dates.end,
                    title: classD.MEETING_TIME_START.slice(0, -3) + '-' + classD.MEETING_TIME_END.slice(0, -3) + '<br>' + classD.SSR_COMPONENT + '<br>' + classD.DESCR + ' ' + '<br>' + classD.STRM,
                    cssClass: 'extra',
                    allDay: false,
                    resizable: {
                      beforeStart: true,
                      afterEnd: true,
                    },
                    meta: classD,
                  });
                  objEvents[rDay + ' ' + classD.MEETING_TIME_START + ' ' + classD.CRSE_ID] = true;
                }
              } else {
                let finded = this.myVirtualClasses.filter(vclass => vclass.name.toUpperCase() == classD.DESCR)[0];
                if (finded) {
                  finded.hrs_acad += this.toHours(classD.MEETING_TIME_START.slice(0, -3), classD.MEETING_TIME_END.slice(0, -3))
                } else {
                  this.myVirtualClasses.push({
                    hour: classD.MEETING_TIME_START.slice(0, -3) + '-' + classD.MEETING_TIME_END.slice(0, -3),
                    descr_ciclo: classD.DESCR,
                    name: classD.DESCR.toUpperCase(),
                    fech_ini: classD.START_DT_DO,
                    fech_fin: classD.END_DT_DO,
                    section: classD.SUBJECT,
                    descr: classD.DESCR,
                    clase: classD.STRM,
                    extra: true,
                    hrs_acad: this.toHours(classD.MEETING_TIME_START.slice(0, -3), classD.MEETING_TIME_END.slice(0, -3))
                  });
                }
              }
            }
          }
        }
      });
    }
    this.events = events;
  }

  toHours(start,end){
    let minutes = (this.timeToSeconds(end) - this.timeToSeconds(start))/60;
    if (this.isInteger(minutes/50)) {
      return minutes/50
    } else {
      if (this.isInteger(minutes/45)) {
        return minutes/45
      } else {
        return (minutes/50).toFixed();
      }
    }
  }

  isInteger(number){
    return number % 1 == 0?true:false;
  }

  timeToSeconds(time){
    let inSeconds = time.split(':');
    return inSeconds[0]*60*60 + inSeconds[1]*60
  }

  eventClicked(event){
    console.log(event);
  }

  getDates(rDay: string, MEETING_TIME_START: string, MEETING_TIME_END: string) {
    let start: Date;
    let end: Date;
    console.log(rDay);
    const ua = navigator.userAgent.toLowerCase();
    if (ua.indexOf('safari') !== -1) {
      if (ua.indexOf('chrome') > -1) {
        start = new Date(rDay + 'T' + MEETING_TIME_START);
        end = new Date(rDay + 'T' + MEETING_TIME_END);
      } else {
        start = new Date(this.getDay(rDay, this.getHour(MEETING_TIME_START)));
        end = new Date(this.getDay(rDay, this.getHour(MEETING_TIME_END)));
      }
    } else {
      start = new Date(rDay + 'T' + MEETING_TIME_START);
      end = new Date(rDay + 'T' + MEETING_TIME_END);
    }

    return { start, end };
  }

  getHour(pHour: string): string {

    const arrHour = pHour.split(':');
    let hour =  Number(arrHour[0]);
    hour += 5;
    const hourModified = this.pad(hour, 2);
    const minute =  arrHour[1];
    const second =  arrHour[2];

    return `${hourModified}:${minute}:${second}`;
  }

  getDay(pDay: string, pHour: string): string {

    let rDate = `${pDay}T${pHour}`;

    const arrHour = pHour.split(':');
    let hour =  Number(arrHour[0]);
    if (hour > 23) {

      const arrDate = pDay.split('-'); // 2020-07-06

      let day =  Number(arrDate[2]);
      day += 1;

      const dayModified = this.pad(day, 2);
      const month =  arrDate[1];
      const year =  arrDate[0];

      const vDate = `${year}-${month}-${dayModified}`;

      hour -= 24;
      const hourModified = this.pad(hour, 2);
      const minute =  arrHour[1];
      const second =  arrHour[2];

      const vHour = `${hourModified}:${minute}:${second}`;

      rDate = `${vDate}T${vHour}`;
    }
    return rDate;
  }

  pad(num: number, size: number): string {
    let s = num + '';
    while (s.length < size) { s = '0' + s; }
    return s;
  }

  invertDates(date_format){
    let x = date_format.split('-');
    return x[2] + '-' + x[1] + '-' + x[0]
  }

}