import { Component, OnInit, ViewChild } from '@angular/core';
import { AppSettings } from '../../app.settings';
import { ToastrService } from 'ngx-toastr';
import { NewEnrollmentService } from '../../services/newenrollment.service';
import { SessionService } from '../../services/session.service';
import { Broadcaster } from '../../services/broadcaster';
import { StudentService } from '../../services/student.service';
import { CalendarDateFormatter, CalendarView, CalendarEventAction, CalendarEvent } from 'angular-calendar';
import { RealDate, AddDay, GetFirstDayWeek, GetFirstDayWeek2, SubstractDay, BetweenDays } from '../../helpers/dates';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  allData: any;
  schoolCycle: any;
  public CPE;
  loading: boolean = false;
  company = AppSettings.COMPANY;
  studentCode;
  equivalentCourses: Array<any> = [];
  aditionalCourses: Array<any> = [];
  user = this.session.getObject('user');
  @ViewChild('aditionalCoursesModal') aditionalCoursesModal: any;
  @ViewChild('equivalentCoursesModal') equivalentCoursesModal: any;
  @ViewChild('schedulePreview') schedulePreview: any;
  @ViewChild('confirmationUploadModal') confirmationUploadModal: any;
  myVirtualClasses: Array<any> = [];
  viewDate: Date = new Date(2021, 12, 1);
  events: CalendarEvent[] = [];
  CalendarView = CalendarView;
  public showEquivalents:Array<any> = [];
  public motives:Array<any> = [{name: '1', descr: 'Falta de cupo'},{name: '2', descr: 'Cruce de horario'},{name: '3', descr: 'Sin programación'},{name: '4', descr: 'Nuevo horario'}];
  public days:Array<any> = [{val: 'LUN',name:'LUNES', type: 'D'},{val: 'MAR',name:'MARTES', type: 'D'},{val: 'MIE',name:'MIERCOLES', type: 'D'},{val: 'JUE',name:'JUEVES', type: 'D'},{val: 'VIE',name:'VIERNES', type: 'A'},{val: 'SAB',name:'SABADO', type: 'F'},{val: 'DOM',name:'DOMINGO', type: 'F'}];
  public aditionalHoursRange:any;
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
  view: CalendarView = CalendarView.Week;
  classDay: Array<any> = [];
  moreData: Array<any> = [];
  isthisStudent;
  student: any = {};
  userCode;
  MyCode = {};
  enroll: any = null;
  enrollCycles: Array<any>;
  enroll_conditions: any = null;
  public aditionalCredits = 0;
  public maxCredits = 0;

  constructor(
    public newEnrollmentS: NewEnrollmentService,
    public toastr: ToastrService,
    public studentS: StudentService,
    private router: Router,
    public session: SessionService,
    public broadcaster: Broadcaster) { }

  ngOnInit() {
    if (this.session.getObject('mySelectedStudent')) {
      this.isthisStudent = this.session.getObject('mySelectedStudent');
      this.allData = this.session.getObject('acadmicData');
      this.studentCode = this.session.getItem('emplidSelected');
      this.schoolCycle = this.session.getObject('schoolCycle');
    }
    this.broadcaster.getMessage().subscribe((msg) => {
      if (msg && msg.cycleSelected) {
        this.schoolCycle = msg.cycleSelected;
      }
      if (msg && msg.openModal) {
        this.moreData = msg.selectedOnHold;
        this.openScheduleModalPreview();
      }
    });
  }

  reload() {
    this.session.destroy('acadmicData');
    this.session.destroy('mySelectedStudent');
    if (this.router.url != '/admin/dashboard/disponibles') {
      this.router.navigate(['/admin/dashboard/disponibles']).then(() => window.location.reload())
    } else {
      location.reload();
    }
  }

  eventClicked(event) {

  }

  openAditionalCoursesModal(){
    this.maxCredits = this.session.getObject('MaxCreditsEnrollment');
    this.aditionalModalData(true);
  }

  selectMotive(crs){
    crs.DESCR_MOTIVO = this.motives.find(el => el.name == crs.MOTIVO)['descr'];
  }

  aditionalModalData(openModal) {
    this.aditionalCredits = 0;
    this.CPE = this.session.getItem('CPE');
    this.loading = true;
    this.allData = this.session.getObject('acadmicData');
    let aditional = {
      EMPLID: this.session.getItem('emplidSelected'),
      INSTITUTION: this.allData['institucion'],
      ACAD_CAREER: this.allData['codigoGrado'],
      ACAD_PROG: this.allData['codigoPrograma'],
      ACAD_PLAN: this.allData['codigoPlan'],
      STRM: this.allData.cicloAdmision
    }
    this.aditionalHoursRange = this.CPE?this.hoursAditionalCourses[1]['hoursStart']:this.hoursAditionalCourses[0]['hoursStart'];
    this.newEnrollmentS.getAditionalCourses(aditional)
      .then((res) => {
        this.aditionalCourses = res.UCS_CON_SOL_CUR_ADIC_RES.UCS_DETCUS_RES?res.UCS_CON_SOL_CUR_ADIC_RES.UCS_DETCUS_RES:[];
        this.loading = false;
        this.newEnrollmentS.getSkillfulLoadBoffice({EMPLID: this.user.codigoAlumno})
        .then((res) => {
          let alreadyIn = this.session.getObject('notInAditional')?this.session.getObject('notInAditional'):[];
          for (let e = 0; e < alreadyIn.length; e++) {
            res = res.filter(al => (al.CRSE_ID != alreadyIn[e].CRSE_ID) && (al.CRSE_ID2 != alreadyIn[e].CRSE_ID) && (al.CRSE_ID3 != alreadyIn[e].CRSE_ID) && (al.CRSE_ID4 != alreadyIn[e].CRSE_ID) && (al.CRSE_ID5 != alreadyIn[e].CRSE_ID) && (al.CRSE_ID6 != alreadyIn[e].CRSE_ID));
          }
          res.sort((a,b) => {
            return a.UCS_CICLO - b.UCS_CICLO
          });
          for (var i = 0; i < res.length; i++) {
            let finded = this.aditionalCourses.find(el => el.CURSO_ID == res[i].CRSE_ID);
            if (!finded) {
              let comps = res[i].COMPONENTS.split('|');
              let hour = res[i].HOUR_COMP.split('|');
              comps.forEach((el, index) => {
                let ex = JSON.parse(JSON.stringify(res[i]));
                ex.extra = true;
                ex.TURNO = '';
                ex.DIA = 'LUN';
                ex.COMPONENTS = res[i].COMPONENTS;
                ex.UCS_TURNO_CRSE = this.CPE?'D':'';
                ex.COMPONENTE = el;
                ex.HORA = hour[index];
                ex.DAYS = this.CPE?this.days.filter(el => el.type != 'F'):this.days;
                this.aditionalCourses.push(ex);
              })
            } else {
              finded.COMPONENTS = res[i].COMPONENTS;
              this.aditionalCredits += Number(finded.CREDITOS);
            }
          }
          openModal?this.aditionalCoursesModal.open():null;
          this.loading = false;
        });
      })
  }

  deleteAditionalCourse(crs){
    this.loading = true;
    let toDelete = [];
    let single = this.aditionalCourses.find(el => el.CRSE_ID == crs.CURSO_ID || el.CURSO_ID == crs.CURSO_ID);
    single['COMPONENTS'].split('|').forEach(el => {
      toDelete.push({CRSE_ID: crs.CURSO_ID, TURNO: '', ACCION: 'B', TURNO_SEMANA: crs.UCS_TURNO_CRSE, MOTIVO: crs.MOTIVO, HORA_INICIO: crs.HORA_INICIO,
      HORA_FIN: crs.HORA_INICIO, DIA: crs.DIA, MODULO: crs.MODULO, COMPONENTE: el})
    });
    this.newEnrollmentS.saveAditionalCourses({
      EMPLID: this.session.getItem('emplidSelected'),
      INSTITUTION: this.allData['institucion'],
      ACAD_CAREER: this.allData['codigoGrado'],
      ACAD_PROG: this.allData['codigoPrograma'],
      ACAD_PLAN: this.allData['codigoPlan'],
      STRM: this.allData.cicloAdmision,
      UCS_REST_CUR_ADIC_DT: toDelete
    }).then((res) => {
      this.loading = false;
      this.aditionalModalData(false);
    });
  }

  confirmAditional(){
    this.loading = true;
    let aditional = [];
    let lastNbr;
    let one = [];
    let two = [];
    for (var i = 0; i < this.aditionalCourses.length; i++) {
      if (this.aditionalCourses[i].extra && this.aditionalCourses[i].value) {
        if(!this.aditionalCourses[i]['HORA_INICIO'] || !this.aditionalCourses[i]['MOTIVO']){
          this.toastr.error('Falta seleccionar una hora inicio o motivo','', {progressBar: true});
          this.loading = false;
          return
        }
        if(!lastNbr || (lastNbr != this.aditionalCourses[i + 1]['CRSE_ID'])){
          let quantity = this.aditionalCourses.filter(el =>el.value && el['CRSE_ID'] == this.aditionalCourses[i]['CRSE_ID']).length;
          if(Number(this.aditionalCourses[i]['CANT_COMP']) != quantity){
            lastNbr = this.aditionalCourses[i]['CRSE_ID'];
            this.toastr.warning('Tienes que seleccionar todos los componentes de la clase ','',{progressBar: true});
            this.loading = false;
            return
          }
        }
        one = aditional.filter((el) =>(el != this.aditionalCourses[i]) && (el['DIA'] == this.aditionalCourses[i]['DIA']));
        for (let h = 0; h < one.length; h++) {
          if(this.aditionalCourses[i]['DIA'] == one[h]['DIA']){
            let cross = (one[h]['HORA_INICIO'] >= this.aditionalCourses[i]['HORA_INICIO'] && one[h]['HORA_INICIO'] < this.aditionalCourses[i]['HORA_FIN']) || (one[h]['HORA_FIN'] > this.aditionalCourses[i]['HORA_INICIO'] && one[h]['HORA_FIN'] <= this.aditionalCourses[i]['HORA_FIN']);
            if(cross){
              this.toastr.warning('Tienes un cruce con tu solicitud','',{progressBar: true})
              this.loading = false;
              return
            }
          }
        }
        two = this.aditionalCourses.filter((el) => el.CURSO_ID && !el.extra);
        for (let j = 0; j < two.length; j++) {
          if(this.aditionalCourses[i]['DIA'] == two[j]['DIA']){
            if((two[j]['HORA_INICIO'] >= this.aditionalCourses[i]['HORA_INICIO'] && two[j]['HORA_INICIO'] < this.aditionalCourses[i]['HORA_FIN']) || (two[j]['HORA_FIN'] > this.aditionalCourses[i]['HORA_INICIO'] && two[j]['HORA_FIN'] <= this.aditionalCourses[i]['HORA_FIN'])){
              this.toastr.warning('Tienes un cruce con tu solicitud','',{progressBar: true})
              this.loading = false;
              return
            }
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
          MODULO: '1',
          COMPONENTE: this.aditionalCourses[i]['COMPONENTE'],
          ACCION: "I"
        });
      }
    }
    if (aditional.length == 0) {
      this.loading = false;
      this.toastr.warning('Tienes que seleccionar al menos un curso','', {progressBar: true});
      return;
    }
    this.newEnrollmentS.saveAditionalCourses({
      EMPLID: this.user.codigoAlumno,
      INSTITUTION: this.allData['institucion'],
      ACAD_CAREER: this.allData['codigoGrado'],
      ACAD_PROG: this.allData['codigoPrograma'],
      ACAD_PLAN: this.allData['codigoPlan'],
      STRM: this.allData.cicloAdmision,
      UCS_REST_CUR_ADIC_DT: aditional
    }).then((res) => {
      this.loading = false;
      this.aditionalModalData(false);
    });
  }

  openEquivalentModal() {
    this.loading = true;
    this.allData = this.session.getObject('acadmicData');
    this.newEnrollmentS.getEquivalentsCourses({
      EMPLID: this.session.getItem('emplidSelected'),
      INSTITUTION: this.allData['institucion'],
      ACAD_CAREER: this.allData['codigoGrado'],
      ACAD_PROG: this.allData['codigoPrograma'],
      ACAD_PLAN: this.allData['codigoPlan']
    }).then((res) => {
      this.equivalentCourses = res['RES_LST_CRSE_EQUIV']['COM_LST_CRSE_EQUIV'].sort((a, b) => {
        return a.UCS_CICLO - b.UCS_CICLO
      });
      this.loading = false;
      this.equivalentCoursesModal.open();
    });
  }

  openScheduleModalPreview() {
    this.loading = true;
    this.allData = this.session.getObject('acadmicData');
    this.schoolCycle = this.session.getObject('schoolCycle');
    this.newEnrollmentS.getScheduleStudent({
      EMPLID: this.session.getItem('emplidSelected'),
      INSTITUTION: this.allData['institucion'],
      ACAD_CAREER: this.allData['codigoGrado'],
      STRM1: this.schoolCycle.CICLO_LECTIVO,
      STRM2: null
    }).then((res) => {
      this.schedulePreview.open();
      this.classDay = res['UCS_REST_CONS_HORA_MATR_RES']['UCS_REST_DET_HORARIO_RES'] ? res['UCS_REST_CONS_HORA_MATR_RES']['UCS_REST_DET_HORARIO_RES'] : [];
      this.closeOpenMonthViewDay();
    });
  }

  closeOpenMonthViewDay() {
    var firstDate = GetFirstDayWeek(this.viewDate);
    var days = {
      LUNES: RealDate(firstDate),
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
    this.myVirtualClasses = [];
    this.classDay.forEach(classD => {
      classD['UCS_REST_MTG_DET_REQ'].forEach(clase => {
        for (var kDay in days) {
          if (clase[kDay] == 'Y') {
            if (BetweenDays(clase.INICIO_FECHA, clase.FIN_FECHA, days[kDay])) {
              if (!clase['DESCR_INSTALACION'].includes('VIRT')) {
                var rDay = days[kDay].year + '-' + days[kDay].month + '-' + days[kDay].day;
                clase.date = rDay;
                if (!objEvents[rDay + ' ' + clase.HORA_INICIO + ' ' + classD.CRSE_ID]) {
                  dates = this.getDates(rDay, clase.HORA_INICIO, clase.HORA_FIN);
                  events.push({
                    start: dates.start,//new Date(rDay + ' ' + clase.MEETING_TIME_START),
                    end: dates.end,//new Date(rDay + ' ' + clase.HORA_FIN),
                    title: clase.HORA_INICIO + '-' + clase.HORA_FIN + '<br>' + classD.NOMBRE_CURSO + ' ' + classD.SECCION_CLASE + '<br>' + classD.DESCR_COMP + '<br>' + classD.CLASE,
                    cssClass: classD.CICLO_LECTIVO != this.schoolCycle.CICLO_LECTIVO ? 'RED' : 'normal',
                    actions: "",
                    allDay: false,
                    resizable: {
                      beforeStart: true,
                      afterEnd: true,
                    },
                    meta: clase,
                  });
                  objEvents[rDay + ' ' + clase.HORA_INICIO + ' ' + classD.CRSE_ID] = true;
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
        classM.UCS_REST_DET2MREU.forEach(classD => {
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
    this.loading = false;
    this.events = events;
  }

  toHours(start, end) {
    let minutes = (this.timeToSeconds(end) - this.timeToSeconds(start)) / 60;
    if (this.isInteger(minutes / 50)) {
      return minutes / 50
    } else {
      if (this.isInteger(minutes / 45)) {
        return minutes / 45
      } else {
        return (minutes / 50).toFixed();
      }
    }
  }

  isInteger(number) {
    return number % 1 == 0 ? true : false;
  }

  timeToSeconds(time) {
    let inSeconds = time.split(':');
    return inSeconds[0] * 60 * 60 + inSeconds[1] * 60
  }

  getDates(rDay: string, MEETING_TIME_START: string, MEETING_TIME_END: string) {
    let start: Date;
    let end: Date;
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
    let hour = Number(arrHour[0]);
    hour += 5;
    const hourModified = this.pad(hour, 2);
    const minute = arrHour[1];
    const second = arrHour[2];

    return `${hourModified}:${minute}:${second}`;
  }

  getDay(pDay: string, pHour: string): string {

    let rDate = `${pDay}T${pHour}`;

    const arrHour = pHour.split(':');
    let hour = Number(arrHour[0]);
    if (hour > 23) {

      const arrDate = pDay.split('-'); // 2020-07-06

      let day = Number(arrDate[2]);
      day += 1;

      const dayModified = this.pad(day, 2);
      const month = arrDate[1];
      const year = arrDate[0];

      const vDate = `${year}-${month}-${dayModified}`;

      hour -= 24;
      const hourModified = this.pad(hour, 2);
      const minute = arrHour[1];
      const second = arrHour[2];

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

  selectEnd(crs){
    let s = this.aditionalHoursRange.findIndex(el => el == crs.HORA_INICIO);
    let h = Number(crs.HORA.split('|')[0]);
    crs.HORA_FIN = this.aditionalHoursRange[s + h];
    if(!crs.HORA_FIN){
      this.toastr.warning('No completas las horas necesarias para este Componente','',{progressBar: true});
      crs.HORA_INICIO = '';
    }
  }

  showAditionals(crs){
    this.showEquivalents = [];
    this.newEnrollmentS.getEquivalentsAditionals().subscribe((res) => {
      this.showEquivalents = res.filter(el => el.crse_id == crs.CURSO_ID);
      crs.showEquivalents = true;
      setTimeout(() => {
        crs.showEquivalents = false;
      }, 4500);
    });
  }

  sameWeekDay(crs){
    this.aditionalCourses.forEach((el) => {
      if(el.CRSE_ID == crs.CRSE_ID){
        el.DAYS = this.days.filter(el => el.type == crs.UCS_TURNO_CRSE || el.type == 'A');
        el.UCS_TURNO_CRSE = crs.UCS_TURNO_CRSE
      }
    });
  }

  sameModule(crs){
    this.aditionalCourses.forEach((el) => {
      if(el.CRSE_ID == crs.CRSE_ID){
        el.MODULO = crs.MODULO
      }
    });
  }
}