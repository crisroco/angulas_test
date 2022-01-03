import { Component, OnInit, ViewChild } from '@angular/core';
import { Broadcaster } from '../../../services/broadcaster';
import { NgxSmartModalService } from 'ngx-smart-modal';
import { AppSettings } from '../../../app.settings';
import { Router } from '@angular/router';
import { NewEnrollmentService } from '../../../services/newenrollment.service';
import { ToastrService } from 'ngx-toastr';
import { SessionService } from '../../../services/session.service';
import { CalendarDateFormatter, CalendarView, CalendarEventAction, CalendarEvent } from 'angular-calendar';
import { RealDate, AddDay, GetFirstDayWeek, GetFirstDayWeek2, SubstractDay, BetweenDays } from '../../../helpers/dates';

@Component({
  selector: 'app-disponibles',
  templateUrl: './disponibles.component.html',
  styleUrls: ['./disponibles.component.scss']
})
export class DisponiblesComponent implements OnInit {
	public loading:boolean = false;
  public selectedStudentEmplid = this.session.getItem('emplidSelected');
	dataStudent:any;
	dataCicle:any;
  company = AppSettings.COMPANY;
  cycleSTRMSelected: any;
	cycles: Array<any> = [];
	availableCourses: Array<any> = [];
  numberofExtra:any;
  scheduleAvailables:Array<any> = [];
	myCoursesinEnrollment: Array<any> = [];
	cicleSelected:any;
	otherCicle:any;
	studentCode:any;
	myData:any;
	myCredits:number = 0;
  maxCredits = 0;
  selectedCourse = {
    DESCR: '',
    value: false
  };
  schoolCycle;
	@ViewChild('selectCycleModal') selectCycleModal:any;
  @ViewChild('IntentionEnrollmentBack') IntentionEnrollmentBack:any;
  @ViewChild('scheduleSelection') scheduleSelection:any;
  constructor(public broadcaster: Broadcaster,
  	public newEnrollmentS: NewEnrollmentService,
  	public session: SessionService,
  	public toastS: ToastrService) { }

  ngOnInit() {
  	this.broadcaster.getMessage().subscribe((msg) => {
  		// if (msg && msg.myStudent) {
  		// 	this.loadData(msg.myStudent);
  		// 	this.studentCode = msg.myStudent;
  		// 	this.myData = this.session.getObject('acadmicData')
  		// }
  	});
    if (this.session.getObject('acadmicData')) {
      let data = this.session.getObject('acadmicData');
      this.myData = data;
      this.studentCode = this.selectedStudentEmplid;
      this.loadData(this.studentCode);
    }
  }

  loadData(emplid){
  	this.loading = true;
  	let data = this.session.getObject('acadmicData');
  	this.newEnrollmentS.getSchoolCycle({EMPLID: emplid, INSTITUTION: data['institucion'], ACAD_CAREER: data['codigoGrado']})
  		.then((res) => {
  			this.dataCicle = res;
        this.cycles = this.checkInscription(res['UCS_REST_CON_CIC_RES']['UCS_REST_CON_CIC_DET']);
        if (this.cycles.length > 0) {
          if (this.cycles.length > 1) {
            this.loading = false;
            if (!this.session.getObject('schoolCycle')) {
              this.selectCycleModal.open();
            } else {
              this.selectedCycle(this.session.getObject('schoolCycle'));
            }
          } else {
            this.selectedCycle(this.cycles[0]);
          }
        } else {
          this.IntentionEnrollmentBack.open();
          this.loading = false;
        }
  		});
  }

  selectedCycle(cicle){
    this.cicleSelected = cicle;
    this.session.setObject('schoolCycle', this.cicleSelected);
    if(this.cicleSelected.DESCR_CICLO.includes('CPE')){
      this.session.setItem('CPE', true);
    }
    this.broadcaster.sendMessage({cycleSelected: this.cicleSelected})
    this.loadCoursesAlready();
  }

  loadCoursesAlready(){
    this.newEnrollmentS.getScheduleStudent({
      EMPLID: this.studentCode,
      INSTITUTION: this.myData['institucion'],
      ACAD_CAREER: this.myData['codigoGrado'],
      STRM1: this.cicleSelected['CICLO_LECTIVO'],
      STRM2: null,
      check:true
    }).then((res) => {
      let creditos = 0;
      let coursesInEnrollment = res.UCS_REST_CONS_HORA_MATR_RES.UCS_REST_DET_HORARIO_RES;
      if (res.UCS_REST_CONS_HORA_MATR_RES.UCS_REST_DET_HORARIO_RES) {
        for (let i = 0; i < coursesInEnrollment.length; i++) {
          creditos += Number(coursesInEnrollment[i].CREDITOS);
        }
        this.session.setObject('notInAditional', res.UCS_REST_CONS_HORA_MATR_RES.UCS_REST_DET_HORARIO_RES);
        this.myCoursesinEnrollment = coursesInEnrollment;
      }
      this.myCredits = creditos;
      this.newEnrollmentS.getSkillfulLoadBoffice({EMPLID: this.studentCode})
        .then((res) => {
          this.availableCourses = res.sort(this.dynamicSortMultiple(["-FLAG","UCS_CICLO"]));
          let materials = res.filter(el => el.FLAG == 'A');
          // let materials = [];
          this.session.setObject('MaterialInCourse', materials);
          if (coursesInEnrollment) {
            for (let i = 0; i < coursesInEnrollment.length; i++) {
              this.availableCourses = this.availableCourses.filter(el => el.CRSE_ID != coursesInEnrollment[i].CRSE_ID && el.CRSE_ID2 != coursesInEnrollment[i].CRSE_ID && el.CRSE_ID3 != coursesInEnrollment[i].CRSE_ID && el.CRSE_ID4 != coursesInEnrollment[i].CRSE_ID && el.CRSE_ID5 != coursesInEnrollment[i].CRSE_ID && el.CRSE_ID6 != coursesInEnrollment[i].CRSE_ID);
            }
          }
          // this.numberofExtra = this.availableCourses.filter(el => el.FLAG == 'A').length;
          let max = res.find(el => el.FLAG == 'N');
          this.maxCredits = max?Math.round(max['FT_MAX_TOTAL_UNIT']):0;
          this.session.setItem('MaxCreditsEnrollment', this.maxCredits);
          this.loading = false;
        });
    });
  }

  onChangeAvailable(course, evt){
    let courses_id = [];
    courses_id.push(course.CRSE_ID2, course.CRSE_ID3,course.CRSE_ID4,course.CRSE_ID5,course.CRSE_ID6,course.CRSE_ID7, course.CRSE_ID8,course.CRSE_ID9,course.CRSE_ID10,course.CRSE_ID11,course.CRSE_ID12,course.CRSE_ID13,course.CRSE_ID14,course.CRSE_ID15,course.CRSE_ID16);
    let allCourses = courses_id.filter(el => el != '' && el != null);
    this.loading = true;
    this.newEnrollmentS.getScheduleNewBO({
      CAMPUS: '',
      OFFER_CRSE: '',
      SESSION_CODE: '',
      CRSE_ID: course.CRSE_ID,
      STRM: this.cicleSelected['CICLO_LECTIVO']
    }).then((res) => {
      this.selectedCourse = course;
      let data = res.UCS_REST_COHOR2RESP.UCS_REST_CON_HOR2RES;
      if (!data) {
        data = [];
        if (allCourses.length > 0) {
          for (let o = 0; o < allCourses.length; o++) {
            this.newEnrollmentS.getScheduleNewBO({
              CAMPUS: '',
              CRSE_ID: allCourses[o],
              OFFER_CRSE: '',
              SESSION_CODE: '',
              STRM: this.cicleSelected['CICLO_LECTIVO']
            }).then((res) => {
              data.push(...res.UCS_REST_COHOR2RESP.UCS_REST_CON_HOR2RES);
              if (o == allCourses.length-1) {
                setTimeout(() => {
                  this.scheduleAvailables = this.checkDuplicates(data);
                  this.loading = false;
                  this.scheduleSelection.open();
                }, 1500)
              }
            });
          }
        } else {
          this.scheduleAvailables = this.checkDuplicates(data);
          this.loading = false;
          this.scheduleSelection.open();
        }
      }else {
        if (allCourses.length > 0) {
          for (let o = 0; o < allCourses.length; o++) {
            this.newEnrollmentS.getScheduleNewBO({
              CAMPUS: '',
              CRSE_ID: allCourses[o],
              OFFER_CRSE: '',
              SESSION_CODE: '',
              STRM: this.cicleSelected['CICLO_LECTIVO']
            }).then((res) => {
              data.push(...res.UCS_REST_COHOR2RESP.UCS_REST_CON_HOR2RES);
              if (o == allCourses.length-1) {
                setTimeout(() => {
                  this.scheduleAvailables = this.checkDuplicates(data);
                  this.loading = false;
                  this.scheduleSelection.open();
                }, 1500)
              }
            });
          }
        } else {
          this.scheduleAvailables = this.checkDuplicates(data);
          this.loading = false;
          this.scheduleSelection.open();
        }
      }
    });
  }

  showMore(section){
    for (var i = 0; i < this.scheduleAvailables.length; i++) {
      for (var o = 0; o < this.scheduleAvailables[i]['UCS_REST_DET2MREU'].length; o++) {
        if ((this.scheduleAvailables[i].ASOCIACION_CLASE == section.ASOCIACION_CLASE) && !this.scheduleAvailables[i]['UCS_REST_DET2MREU'][o].show && this.scheduleAvailables[i].NRO_CLASE == section.NRO_CLASE) {
          this.scheduleAvailables[i]['UCS_REST_DET2MREU'][o].more = !section.up;
        }
      }
    }
    section.up = !section.up;
  }

  changeSchedule(course, evt){
    if(course.notAvailable){
      evt.target.checked = false;
      course.value = false;
      this.toastS.error(course.alertMessage,'', {progressBar: true});
    } else {
      if (this.checkCreditsCap(course)) {
        evt.target.checked = false;
        course.value = false;
        return
      }
      let numberOfPRA = this.countPRA(course);
      this.scheduleAvailables.forEach(el => {
        if (el.ASOCIACION_CLASE == course.ASOCIACION_CLASE) {
          if (course.CODIGO_COMPONENTE == 'PRA') {
            if(el.CODIGO_COMPONENTE == 'TEO'){
              if (el.ID_CURSO == course.ID_CURSO) {
                el.value = course.value;
              } else {
                el.value = false;
              }
            }
            if (!el.show && el.NRO_CLASE == course.NRO_CLASE) {
              el.value = course.value;
            }
            if (numberOfPRA > 1 && el.CODIGO_COMPONENTE == 'PRA' && el.NRO_CLASE != course.NRO_CLASE) {
              el.value = false;
            }
            if (el.CODIGO_COMPONENTE == 'PRA' && el.ID_CURSO != course.ID_CURSO) {
              el.value = false;
            }
          }
          if (course.CODIGO_COMPONENTE == 'TEO') {
            if (course != el) {
              el.value = false;
            }
            if (!el.show && el.NRO_CLASE == course.NRO_CLASE) {
              el.value = course.value;
            }
            if (el.CODIGO_COMPONENTE == 'PRA') {
              el.value = false;
            }
            if (el.CODIGO_COMPONENTE == 'SEM') {
              el.value = course.value;
            }
            if (numberOfPRA > 1) {
              
            } else {
              if (el.CODIGO_COMPONENTE == 'PRA' && el.ID_CURSO == course.ID_CURSO) {
                el.value = course.value;
              }
            }
          } if (course.CODIGO_COMPONENTE == 'SEM') {
            el.value = course.value;
          }
          if (el.value) {
            if (this.checkCrosses(el)) {
              course.value = false;
              evt.target.checked = false;
              el.value = false;
              this.blockAssociated(el, this.scheduleAvailables, el.alertMessage);
              return
            }
          }
        } else {
          el.value = false;
        }
      });
    }
  }

  saveCycle(){
    this.loading = true;
    this.cycles.forEach(el => {
      if (el.value) {
        this.cycleSTRMSelected = el;
      } else {
        if (el.CICLO_LECTIVO != "0169") {
          this.otherCicle = el;
          this.session.setObject('otherCicle', this.otherCicle);
        }
      }
    });
    if (!this.cycleSTRMSelected) {
      this.toastS.error('Tienes que elegir un ciclo lectivo','', {progressBar: true});
    } else {
      this.selectCycleModal.close();
      this.selectedCycle(this.cycleSTRMSelected);
    }
  }

  checkInscription(cicles){
    let toSelectCycle = [];
    if(cicles){
      for (let i = 0; i < cicles.length; i++) {
        if (cicles[i].FLAG_INSCRIPCION == 'Y') {
          toSelectCycle.push(cicles[i]);
        } else {
          if (cicles[i].CICLO_LECTIVO != "0169") {
            this.otherCicle = cicles[i];
            this.session.setObject('otherCicle', this.otherCicle);
          }
        }
      }
    } else {
      this.toastS.error('Error con los ciclos');
    }
    return toSelectCycle
  }

  closeModal(modal){
    this.selectedCourse.value = false;
    modal.close();
  }

  removeSeconds(time){
    return time.slice(0, -3)
  }

  checkCrosses(pickedCourse){
    if (this.myCoursesinEnrollment) {
      for (let i = 0; i < this.myCoursesinEnrollment.length; i++) {
        if (this.myCoursesinEnrollment[i].CICLO_LECTIVO == pickedCourse.CICLO_LECTIVO) {
          if(pickedCourse.UCS_REST_DET2MREU){
            for (var o = 0; o < pickedCourse.UCS_REST_DET2MREU.length; o++) {
              for (var u = 0; u < this.myCoursesinEnrollment[i].UCS_REST_MTG_DET_REQ.length; u++) {
                if (!this.myCoursesinEnrollment[i].UCS_REST_MTG_DET_REQ[u]['DESCR_INSTALACION'].includes('VIRT') && pickedCourse.UCS_REST_DET2MREU[o]['TIPO'] != 'VIRT') {if (BetweenDays(this.myCoursesinEnrollment[i].UCS_REST_MTG_DET_REQ[u]['INICIO_FECHA'] + ' 00:00:00',this.myCoursesinEnrollment[i].UCS_REST_MTG_DET_REQ[u]['FIN_FECHA'] + ' 00:00:00', RealDate(new Date(pickedCourse.UCS_REST_DET2MREU[o]['FECHA_INICIAL'].replaceAll('-', '/') + ' 00:00:01'))) || BetweenDays(this.myCoursesinEnrollment[i].UCS_REST_MTG_DET_REQ[u]['INICIO_FECHA'] + ' 00:00:00',this.myCoursesinEnrollment[i].UCS_REST_MTG_DET_REQ[u]['FIN_FECHA'] + ' 00:00:00', RealDate(new Date(pickedCourse.UCS_REST_DET2MREU[o]['FECHA_FINAL'].replaceAll('-', '/') + ' 00:00:01')))) {
                  if (this.getDayY(this.myCoursesinEnrollment[i].UCS_REST_MTG_DET_REQ[u]) == pickedCourse.UCS_REST_DET2MREU[o]['DIA'].normalize("NFD").replace(/[\u0300-\u036f]/g, "").toUpperCase()) {
                    if ((this.timeToSeconds(pickedCourse.UCS_REST_DET2MREU[o]['HORA_INICIO']) >= this.timeToSeconds(this.myCoursesinEnrollment[i].UCS_REST_MTG_DET_REQ[u]['HORA_INICIO']) && this.timeToSeconds(pickedCourse.UCS_REST_DET2MREU[o]['HORA_INICIO']) < this.timeToSeconds(this.myCoursesinEnrollment[i].UCS_REST_MTG_DET_REQ[u]['HORA_FIN'])) || (this.timeToSeconds(pickedCourse.UCS_REST_DET2MREU[o]['HORA_FIN']) > this.timeToSeconds(this.myCoursesinEnrollment[i].UCS_REST_MTG_DET_REQ[u]['HORA_INICIO']) && this.timeToSeconds(pickedCourse.UCS_REST_DET2MREU[o]['HORA_FIN']) <= this.timeToSeconds(this.myCoursesinEnrollment[i].UCS_REST_MTG_DET_REQ[u]['HORA_FIN'])) || (this.timeToSeconds(this.myCoursesinEnrollment[i].UCS_REST_MTG_DET_REQ[u]['HORA_INICIO']) >= this.timeToSeconds(pickedCourse.UCS_REST_DET2MREU[o]['HORA_INICIO']) && this.timeToSeconds(this.myCoursesinEnrollment[i].UCS_REST_MTG_DET_REQ[u]['HORA_INICIO']) < this.timeToSeconds(pickedCourse.UCS_REST_DET2MREU[o]['HORA_FIN']))) {
                        this.toastS.error('Tienes un cruce con otra clase: ' + this.myCoursesinEnrollment[i]['CRSE_ID'] + '-' + this.myCoursesinEnrollment[i]['NOMBRE_CURSO'],'', {progressBar: true});
                        pickedCourse.alertMessage = 'Tienes un cruce con otra clase: ' + this.myCoursesinEnrollment[i]['CRSE_ID'] + '-' + this.myCoursesinEnrollment[i]['NOMBRE_CURSO'];
                        return true
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
    return false
  }

  getDayY(obj){
    for (let key in obj) {
      if (obj[key] == 'Y') {
        return key
      }
    }
  }

  timeToSeconds(time){
    let inSeconds = time.split(':');
    return inSeconds[0]*60*60 + inSeconds[1]*60
  }

  blockAssociated(actualCourse, array, errM){
    let numberOfPRA = this.countPRA(actualCourse);
    for (let i = 0; i < array.length; i++) {
      if (array[i].ASSOCIATED_CLASS == actualCourse.ASSOCIATED_CLASS) {
        if (actualCourse.SSR_COMPONENT == 'PRA') {
          if (numberOfPRA > 1 && actualCourse.CLASS_NBR == array[i].CLASS_NBR) {
            array[i].notAvailable = true;
            array[i].alertMessage = errM;
            array[i].value = false;
          } else {
            if(actualCourse.SSR_COMPONENT == 'TEO'){
              array[i].notAvailable = true;
              array[i].alertMessage = errM;
              array[i].value = false;
            } else if(actualCourse.SSR_COMPONENT == 'PRA'){
              array[i].notAvailable = true;
              array[i].alertMessage = errM;
              array[i].value = false;
            }
          }
        } else if(actualCourse.SSR_COMPONENT == 'TEO'){
          array[i].notAvailable = true;
          array[i].alertMessage = errM;
          array[i].value = false;
        }
      }
    }
  }

  countPRA(associated_class){
    let total = 0;
    for (var i = 0; i < this.scheduleAvailables.length; i++) {
      if(this.scheduleAvailables[i]['UCS_REST_DET2MREU']){
        for (var o = 0; o < this.scheduleAvailables[i]['UCS_REST_DET2MREU'].length; o++) {
          if ((this.scheduleAvailables[i].ASOCIACION_CLASE == associated_class.ASOCIACION_CLASE) && this.scheduleAvailables[i].CODIGO_COMPONENTE == 'PRA' && this.scheduleAvailables[i]['UCS_REST_DET2MREU'][o].show && this.scheduleAvailables[i].ID_CURSO == associated_class.ID_CURSO) {
            total++;
          }
        }
      }
    }
    return total;
  }

  countPRABeforeSave(associated_class){
    let total = 0;
    for (var i = 0; i < this.scheduleAvailables.length; i++) {
      if(this.scheduleAvailables[i]['UCS_REST_DET2MREU']){
        for (var o = 0; o < this.scheduleAvailables[i]['UCS_REST_DET2MREU'].length; o++) {
          if ((this.scheduleAvailables[i].ASOCIACION_CLASE == associated_class.ASSOCIATED_CLASS) && this.scheduleAvailables[i].CODIGO_COMPONENTE == 'PRA' && this.scheduleAvailables[i]['UCS_REST_DET2MREU'][o].show && this.scheduleAvailables[i].ID_CURSO == associated_class.CRSE_ID) {
            total++;
          }
        }
      }
    }
    return total;
  }

  // loadDataStudentCourses(){
  //   this.newEnrollmentS.getCourseClass({
  //     EMPLID: this.studentCode,
  //     STRM: this.cicleSelected['CICLO_LECTIVO']
  //   }).then((res) => {
  //     if (res.length > 0) {
  //       this.myCoursesinEnrollment = res.sort((a,b) => {
  //         return a.CRSE_ID - b.CRSE_ID
  //       });
  //       let example = res.sort(this.dynamicSortMultiple(["CRSE_ID"]));
  //       let credits = 0;
  //       let oneTimeCourse;
  //       for (let i = 0; i < example.length; i++) {
  //         if (oneTimeCourse == example[i]['CRSE_ID']) {
  //         } else {
  //           oneTimeCourse = example[i]['CRSE_ID'];
  //           let existInfo = example[i]['status'] == 'B' && !example[i]['units_repeat_limit2'];
  //           let number = existInfo?Number(example[i]['UNITS_REPEAT_LIMIT']):Number(example[i]['units_repeat_limit2']);
  //           if ((example[i].status == 'I' && example[i].units_repeat_limit2) || (example[i].status == 'B')) {
  //             if (example[i].FLAG2 == 'Y') {
  //               credits += Number(example[i]['UNITS_REQUIRED']);
  //             } else {
  //               credits += number;
  //             }
  //           }
  //         }
  //       }
  //       this.myCredits = credits;
  //       this.loading = false;
  //     }
  //     this.loading = false;
  //   });
  // }

  checkCap(section){
    if (Number(section.TOTAL_INSCRITOS) >= Number(section.TOTAL_CAPACIDAD)) {
      return true
    }
    return false
  }

  checkCreditsCap(course){
    if (this.myCredits + Number(course['CREDITOS']) > this.maxCredits) {
      this.toastS.error('Estas superando los creditos maximos','', {progressBar: true});
      return true
    } else {
      return false
    }
  }

  countASS(associated_class){
    let total = associated_class.UCS_REST_DET2MREU.length;
    if (total > 1) {
      return true
    }
  }

  checkDuplicates(array){
    array.sort(this.dynamicSortMultiple(["ASOCIACION_CLASE","ID_CURSO","-CODIGO_COMPONENTE","NRO_CLASE"]));
    for (var i = 0; i < array.length; i++) {
      if(array[i]['UCS_REST_DET2MREU']){
        for (var o = 0; o < array[i]['UCS_REST_DET2MREU'].length; o++) {
          if (o == 0) {
            array[i]['UCS_REST_DET2MREU'][o].show = true;
          } else {
            array[i]['UCS_REST_DET2MREU'][o].show = false;
          }
        }
      }
    }
    return array.filter(arr => arr.INGRESANTE_NORMAL != 'Y')
  }

  callModal(selected?){
    let data = [];
    if (selected) {
      this.selectedCourse['schedules'] = [];
      for (var i = 0; i < this.scheduleAvailables.length; i++) {
        if (this.scheduleAvailables[i].value) {
          data.push(this.scheduleAvailables[i]);
        }
      };
    }
    this.broadcaster.sendMessage({openModal: true, selectedOnHold: data});
  }

  goDashboard(){
    this.IntentionEnrollmentBack.close();
    this.broadcaster.sendMessage({openSelectModal: true})
  }

  dynamicSortMultiple(args) {
    var props = args;
    return (obj1, obj2) => {
      var i = 0, result = 0, numberOfProperties = props.length;
      while(result === 0 && i < numberOfProperties) {
        result = this.dynamicSort(props[i])(obj1, obj2);
        i++;
      }
      return result;
    }
  }

  dynamicSort(property) {
    var sortOrder = 1;
    if(property[0] === "-") {
      sortOrder = -1;
      property = property.substr(1);
    }
    return (a,b) => {
      var result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
      return result * sortOrder;
    }
  }

  confirmEnroll(){
    this.loading = true;
    let data = [];
    this.selectedCourse['schedules'] = [];
    for (var i = 0; i < this.scheduleAvailables.length; i++) {
      if (this.scheduleAvailables[i].value) {
        data.push({
          EMPLID: this.studentCode,
          INSTITUTION: this.myData['institucion'],
          ACAD_CAREER: this.myData['codigoGrado'],
          STRM: this.session.getObject('schoolCycle')['CICLO_LECTIVO'],
          CRSE_ID: this.scheduleAvailables[i]['ID_CURSO'],
          SESSION_CODE: this.scheduleAvailables[i]['CODIGO_SESION'],
          ASSOCIATED_CLASS: this.scheduleAvailables[i]['ASOCIACION_CLASE'],
          CLASS_NBR: this.scheduleAvailables[i]['NRO_CLASE'],
          CANT_COMPONENTES: this.selectedCourse['CANT_COMP'],
          OFFER_NBR: this.scheduleAvailables[i]['OFERTA_CURSO'],
          SSR_COMPONENT: this.scheduleAvailables[i]['CODIGO_COMPONENTE'],
          equivalent: '-'
        })
      }
    };
    let x = new Set();
    var result = data.reduce((acc,item)=>{
      if(!x.has(item.CLASS_NBR)){
        x.add(item.CLASS_NBR)
        acc.push(item)
      }
      return acc;
    },[]);
    if (data.length == 0) {
      this.loading = false;
      this.toastS.warning('No seleccionaste ninguna sección','', {progressBar: true});
      return
    }
    // if (result.length < Number(this.selectedCourse['CANT_COMP'])) {
    //   this.loading = false;
    //   this.toastS.warning('No seleccionaste los componentes necesarios: ' + this.selectedCourse['COMPONENTS'],'', {progressBar: true});
    //   return
    // }
    if (result[0]['SSR_COMPONENT'] == 'TEO') {
      let numberOfPRA = this.countPRABeforeSave(result[0]);
      if (numberOfPRA > 1 && result.length == 1) {
        this.loading = false;
        this.toastS.warning('Tienes que seleccionar alguna practica','', {progressBar: true});
        return
      }
    }
    this.newEnrollmentS.saveCourseClass({
      courses: result,
      emplid_admin: this.session.getItem('adminOprid')
    }).then((res) => {
      if (res['UCS_REST_INSCR_RES']['UCS_DET_CLA_RES'][0]['RESULTADO'] != 'No hay vacantes') {
        let index = this.availableCourses.findIndex(val => val['own_enrollment_skillful_load_id'] == this.selectedCourse['own_enrollment_skillful_load_id']);
        this.availableCourses.splice(index, 1);
        this.toastS.success('Curso matriculado','', {progressBar: true});
        this.loadCoursesAlready();
        this.loading = false;
        this.scheduleSelection.close();
      } else if(res.status == 'fail'){
        this.toastS.error(res.message,'', {progressBar: true});
        this.loading = false;
      } else if(res['UCS_REST_INSCR_RES'] && res['UCS_REST_INSCR_RES']['UCS_DET_CLA_RES'][0]['RESULTADO'] == 'Error cruce de horarios'){
        this.toastS.error(res['UCS_REST_INSCR_RES']['UCS_DET_CLA_RES'][0]['RESULTADO'],'', {progressBar: true});
        this.loading = false;
      } else {
        this.toastS.warning('No hay vacantes para este curso','', {progressBar: true});
        this.loading = false;
      }
    });
  }

}