import { Component, OnInit, ViewChild } from '@angular/core';
import { Broadcaster } from '../../../services/broadcaster';
import { Router } from '@angular/router';
import { NewEnrollmentService } from '../../../services/newenrollment.service';
import { ToastrService } from 'ngx-toastr';
import { SessionService } from '../../../services/session.service';
import { CalendarDateFormatter, CalendarView, CalendarEventAction, CalendarEvent } from 'angular-calendar';
import { RealDate, AddDay, GetFirstDayWeek, GetFirstDayWeek2, RealDateTz, DateFixedSO, BetweenDays } from '../../../helpers/dates';
import { ValidateEmail } from '../../../helpers/general';
import { DeviceDetectorService } from 'ngx-device-detector';
import * as moment from 'moment-timezone';

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
  @ViewChild('changeToChromeModal') changeToChromeModal: any;
  loading: boolean = false;
  CPE:any = false;
  aditionalCourses:Array<any> = [];
  equivalentCourses:Array<any> = [];
  skillFull;
  public showEquivalents:Array<any> = [];
  allData;
  schoolCycle: any = this.session.getObject('schoolCycle');
  user: any = this.session.getObject('user');
  student: any = this.session.getObject('student');
  public motives:Array<any> = [{name: '1', descr: 'Motivo1'},{name: '2', descr: 'Motivo2'},{name: '3', descr: 'Motivo3'},{name: '4', descr: 'Motivo4'}];
  public hoursAditionalCourses:Array<any> = [
    {
      type: 'PREG',
      timebetween: 50,
      hoursStart: ['07:10','08:10','09:10','10:10','11:10','12:10','13:10','14:10','15:10','16:10','17:10','18:10','19:00','19:45','20:30','21:15','22:00','22:45']
    },
    {
      type: 'CPE',
      timebetween: 45,
      hoursStart: ['07:30','08:15','09:00','09:45','10:30','11:15','12:00','12:45','13:30','14:15','15:00','15:45','16:30','17:15','18:00','19:00','19:45','20:30','21:15','22:00','22:45']
    }
  ];
  public aditionalHoursRange:any;
  dataEnrollment: any;
  myVirtualClasses:Array<any> = [];
  tzDate = RealDateTz();
  viewDate: Date = DateFixedSO(this.tzDate.sDate, this.tzDate.sTime);
  events:CalendarEvent[] = [];
  CalendarView = CalendarView;
  view: CalendarView = CalendarView.Week;
  classDay: Array<any> = [];
  moreData: Array<any> = [];
  public emailToSend = '';
  public myCredits = 0;
  public aditionalCredits = 0;
  public maxCredits = 0;

  constructor(private broadcaster: Broadcaster,private deviceS: DeviceDetectorService, public enrollmentS: NewEnrollmentService, public session: SessionService, private router: Router, public toastT: ToastrService) { }

  ngOnInit() {
    if(((this.deviceS.isMobile() || this.deviceS.isTablet()) && this.deviceS.getDeviceInfo().browser != 'Chrome' && this.deviceS.getDeviceInfo().os == 'Android') || (this.deviceS.getDeviceInfo().browser == 'Chrome' && this.deviceS.getDeviceInfo().os == 'Windows' && Number(this.deviceS.getDeviceInfo().browser_version.split('.')[0]) < 90)){
      this.changeToChromeModal.open();
    }
    moment.locale('es');
    this.session.destroy('mySchedule');
    this.student = this.session.getObject('student');
    this.allData = this.session.getObject('dataEnrollment');
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
        STRM2: null
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
        PROG_PLAN: this.allData.ACAD_PROG + ' / ' + this.allData.codigoPlan,
        STRM1: this.schoolCycle.CICLO_LECTIVO,
        TOTAL_CREDITS: this.myCredits
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
      ACAD_PLAN: this.dataEnrollment['codigoPlan']
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
    this.CPE = this.session.getItem('CPE');
    this.loading = true;
    this.dataEnrollment = this.session.getObject('dataEnrollment');
    let aditional = {
      EMPLID: this.user.codigoAlumno,
      INSTITUTION: this.allData['INSTITUTION'],
      ACAD_CAREER: this.allData['ACAD_CAREER'],
      ACAD_PROG: this.allData['ACAD_PROG'],
      ACAD_PLAN: this.allData['codigoPlan'],
      STRM: this.schoolCycle.CICLO_LECTIVO
    }
    this.aditionalHoursRange = this.CPE?this.hoursAditionalCourses[1]['hoursStart']:this.hoursAditionalCourses[0]['hoursStart'];
    this.enrollmentS.getAditionalCourses(aditional)
      .then((res) => {
        this.aditionalCourses = res.UCS_CON_SOL_CUR_ADIC_RES.UCS_DETCUS_RES?res.UCS_CON_SOL_CUR_ADIC_RES.UCS_DETCUS_RES:[];
        this.loading = false;
        this.enrollmentS.getSkillfullLoad({EMPLID: this.user.codigoAlumno, CAMPUS: this.dataEnrollment.sede})
        .then((res) => {
          let alreadyIn = this.session.getObject('notInAditional')?this.session.getObject('notInAditional'):[];
          for (let e = 0; e < alreadyIn.length; e++) {
            res = res.filter(al => (al.CRSE_ID != alreadyIn[e].CRSE_ID) && (al.CRSE_ID2 != alreadyIn[e].CRSE_ID) && (al.CRSE_ID3 != alreadyIn[e].CRSE_ID) && (al.CRSE_ID4 != alreadyIn[e].CRSE_ID) && (al.CRSE_ID5 != alreadyIn[e].CRSE_ID) && (al.CRSE_ID6 != alreadyIn[e].CRSE_ID));
          }
          res.sort((a,b) => {
            return a.UCS_CICLO - b.UCS_CICLO
          });
          for (let i = 0; i < res.length; i++) {
            let finded = this.aditionalCourses.find(el => el.CURSO_ID == res[i].CRSE_ID);
            if (!finded) {
              let comps = res[i].COMPONENTS.split('|');
              let hour = res[i].HOUR_COMP.split('|');
              comps.forEach((el, index) => {
                let ex = JSON.parse(JSON.stringify(res[i]));
                ex.extra = true;
                ex.TURNO = '';
                ex.DIA = 'LUN';
                ex.UCS_TURNO_CRSE = this.CPE?'D':'';
                ex.COMPONENTE = el;
                ex.HORA = hour[index];
                this.aditionalCourses.push(ex);
              })
            } else {
              this.aditionalCredits += Number(finded.CREDITOS);
            }
          }
          openModal?this.aditionalCoursesModal.open():null;
          this.loading = false;
        });
      })
  }

  selectEnd(crs){
    let s = this.aditionalHoursRange.findIndex(el => el == crs.HORA_INICIO);
    let h = Number(crs.HORA.split('|')[0]);
    crs.HORA_FIN = this.aditionalHoursRange[s + h];
    if(!crs.HORA_FIN){
      this.toastT.warning('No completas las horas necesarias para este Componente','',{progressBar: true});
      crs.HORA_INICIO = '';
    }
  }

  selectMotive(crs){
    crs.DESCR_MOTIVO = this.motives.find(el => el.name == crs.MOTIVO)['descr'];
  }


  openAditionalCoursesModal(){
    this.maxCredits = this.session.getObject('MaxCreditsEnrollment');
    this.aditionalModalData(true);
  }

  deleteAditionalCourse(crs) {
    this.loading = true;
    let toDelete = [];
    let single = this.aditionalCourses.find(el => el.CURSO_ID == crs.CRSE_ID);
    single['COMPONENTS'].split('|').forEach(el => {
      toDelete.push({CRSE_ID: crs.CURSO_ID, TURNO: '', ACCION: 'B', TURNO_SEMANA: crs.UCS_TURNO_CRSE, MOTIVO: crs.MOTIVO, HORA_INICIO: crs.HORA_INICIO,
      HORA_FIN: crs.HORA_INICIO, DIA: crs.DIA, MODULO: crs.MODULO, COMPONENTE: el})
    });
    this.enrollmentS.saveAditionalCourses({
      EMPLID: this.user.codigoAlumno,
      INSTITUTION: this.dataEnrollment['INSTITUTION'],
      ACAD_CAREER: this.dataEnrollment['ACAD_CAREER'],
      ACAD_PROG: this.dataEnrollment['ACAD_PROG'],
      ACAD_PLAN: this.dataEnrollment['codigoPlan'],
      STRM: this.schoolCycle.CICLO_LECTIVO,
      UCS_REST_CUR_ADIC_DT: toDelete
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
    let lastNbr;
    for (var i = 0; i < this.aditionalCourses.length; i++) {
      if (this.aditionalCourses[i].extra && this.aditionalCourses[i].value) {
        if(!this.aditionalCourses[i]['HORA_INICIO'] && !this.aditionalCourses[i]['MOTIVO']){
          this.toastT.error('Falta seleccionar una hora inicio y motivo','', {progressBar: true});
          this.loading = false;
          return
        }
        if(!lastNbr || (lastNbr != this.aditionalCourses[i + 1]['CRSE_ID'])){
          let quantity = this.aditionalCourses.filter(el =>el.value && el['CRSE_ID'] == this.aditionalCourses[i]['CRSE_ID']).length;
          if(Number(this.aditionalCourses[i]['CANT_COMP']) != quantity){
            lastNbr = this.aditionalCourses[i]['CRSE_ID'];
            this.toastT.warning('Tienes que seleccionar todos los componentes de la clase ','',{progressBar: true});
            this.loading = false;
            return
          }
        }
        aditional.push({
          CRSE_ID: this.aditionalCourses[i]['CRSE_ID'],
          TURNO: this.aditionalCourses[i]['TURNO']?this.aditionalCourses[i]['TURNO']:'M',
          TURNO_SEMANA: this.aditionalCourses[i]['UCS_TURNO_CRSE']?this.aditionalCourses[i]['UCS_TURNO_CRSE']:'',
          MOTIVO: this.aditionalCourses[i]['MOTIVO'],
          HORA_INICIO: this.aditionalCourses[i]['HORA_INICIO'],
          HORA_FIN: this.aditionalCourses[i]['HORA_FIN'],
          DIA: this.aditionalCourses[i]['DIA'],
          MODULO: this.aditionalCourses[i]['MODULO'],
          COMPONENTE: this.aditionalCourses[i]['COMPONENTE'],
          ACCION: "I"
        });
      }
    }
    if (aditional.length == 0) {
      this.loading = false;
      this.toastT.warning('Tienes que seleccionar al menos un curso','', {progressBar: true});
      return;
    }

    this.enrollmentS.saveAditionalCourses({
      EMPLID: this.user.codigoAlumno,
      INSTITUTION: this.dataEnrollment['INSTITUTION'],
      ACAD_CAREER: this.dataEnrollment['ACAD_CAREER'],
      ACAD_PROG: this.dataEnrollment['ACAD_PROG'],
      ACAD_PLAN: this.dataEnrollment['codigoPlan'],
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
      this.moreData.forEach(classM => {
        classM.UCS_REST_DET_MREU.forEach(classD => {
          for (var kDay in days) {
            if (kDay == classD.DIA.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toUpperCase()) {
              if(BetweenDays(classD.FECHA_INICIAL, classD.FECHA_FINAL, days[kDay])){
                if (classD.TIPO != 'VIRT') {
                  var rDay = days[kDay].year + '-' + days[kDay].month + '-' + days[kDay].day;
                  classD.date = rDay;
                  if(!objEvents[rDay + ' ' + classD.HORA_INICIO + ' ' + classM.ID_CURSO]){
                    dates = this.getDates(rDay, classD.HORA_INICIO, classD.HORA_FIN);
                    events.push({
                      start: dates.start,
                      end: dates.end,
                      title: classD.HORA_INICIO + '-' + classD.HORA_FIN + '<br>' + classM.CODIGO_COMPONENTE + '<br>' + classM.DESCR_CURSO,
                      cssClass: 'extra',
                      allDay: false,
                      resizable: {
                        beforeStart: true,
                        afterEnd: true,
                      },
                      meta: classD,
                    });
                    objEvents[rDay + ' ' + classD.HORA_INICIO + ' ' + classM.ID_CURSO] = true;
                  }
                } else {
                  let finded = this.myVirtualClasses.filter(vclass => vclass.name == classM.DESCR_CURSO.toUpperCase())[0];
                  if (finded) {
                    finded.hrs_acad += this.toHours(classD.HORA_INICIO, classD.HORA_FIN)
                  } else {
                    this.myVirtualClasses.push({
                      hour: classD.HORA_INICIO + '-' + classD.HORA_FIN,
                      descr_ciclo: classM.DESCR_CURSO,
                      name: classM.DESCR_CURSO.toUpperCase(),
                      fech_ini: classD.FECHA_INICIAL,
                      fech_fin: classD.FECHA_FINAL,
                      section: classD.CODIGO_AULA,
                      descr: classM.DESCR_CURSO,
                      extra: true,
                      hrs_acad: this.toHours(classD.HORA_INICIO, classD.HORA_FIN)
                    });
                  }
                }
              }
            }
          }
        });
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

  capitalizarPrimeraLetra(str) {
		return str.charAt(0).toUpperCase() + str.slice(1);
	}

  getDateMoment() {
		return this.capitalizarPrimeraLetra(moment().tz('America/Lima').format('dddd, D MMMM YYYY HH:mm'));
	}

  eventClicked(event){
    // console.log(event);
  }

  getDates(rDay: string, MEETING_TIME_START: string, MEETING_TIME_END: string) {
		let start: Date;
		let end: Date;
		start = DateFixedSO(rDay, MEETING_TIME_START);
		end = DateFixedSO(rDay, MEETING_TIME_END);
		return { start, end };
	}

  showAditionals(crs){
    this.showEquivalents = [];
    this.enrollmentS.getEquivalentsAditionals().subscribe((res) => {
      this.showEquivalents = res.filter(el => el.crse_id == crs.CURSO_ID);
      crs.showEquivalents = true;
      setTimeout(() => {
        crs.showEquivalents = false;
      }, 4500);
    });
  }

}