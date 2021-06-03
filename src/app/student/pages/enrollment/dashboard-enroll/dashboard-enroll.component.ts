import { Component, OnInit, ViewChild } from '@angular/core';
import { NgxSmartModalService } from 'ngx-smart-modal';
import { ToastrService } from 'ngx-toastr';
import { SessionService } from '../../../../services/session.service';
import { Broadcaster } from '../../../../services/broadcaster';
import { NewEnrollmentService } from '../../../../services/newenrollment.service';
import { StudentService } from '../../../../services/student.service';
import { AppSettings } from '../../../../app.settings';
import { Router } from '@angular/router';
import { BetweenDays, RealDate } from '../../../../helpers/dates';

@Component({
  selector: 'app-dashboard-enroll',
  templateUrl: './dashboard-enroll.component.html',
  styleUrls: ['./dashboard-enroll.component.scss']
})
export class DashboardEnrollComponent implements OnInit {
  company = AppSettings.COMPANY;
  myCoursesinEnrollment:Array<any> = [];
  myRealCoursesInEnrollment:Array<any> = [];
  scheduleAvailables:Array<any> = [];
  numberOfCicles:Array<any> = [];
  cicleSelected:any;
  otherCicle:any;
  availableCourses: Array<any> = [];
  cycles: Array<any> = [];
  user: any = this.session.getObject('user');
  selectedCourse = {
    DESCR: '',
    value: false
  };
  loading: boolean = false;
  @ViewChild('scheduleSelection') scheduleSelection: any;
  @ViewChild('IntentionEnrollmentBack') IntentionEnrollmentBack: any;
  @ViewChild('selectCycleModal') selectCycleModal:any;
  dataCicle:any;
  dataStudent:any;
  crossdata: any;
  cycleSTRMSelected: any;
  maxCredits = 0;
  myCredits = 0;
  public listOfLockCourses = ['001070','001071','001072','001073','001074','001070','001071','001072','001073', '667233', '666911'];
  constructor(
    public session: SessionService,
    public toastS: ToastrService,
    public router: Router,
    public studentS: StudentService,
    public enrollmentS: NewEnrollmentService,
    private broadcaster: Broadcaster) { }

  ngOnInit() {
    this.loading = true;
    this.getCourses();
  }

  getCourses(){
    // this.enrollmentS.getDebt({EMPLID: this.user.codigoAlumno})
    //   .then((res)=> {
    //     let notdeuda = res['UCS_WS_DEU_RSP']['UCS_WS_DEU_COM'][0]['DEUDA']=='N'?true:false;
    //     if (!notdeuda) {
    //       this.toastS.error('Tiene una deuda pendiente, por favor regularizar el pago.');
    //       setTimeout(() => {
    //         this.router.navigate(['/estudiante']);
    //         return
    //       }, 1500)
    //     }
    //   });
    let myConditions = this.session.getObject('conditionsToEnrollment');
    if (myConditions) {
      if (!myConditions.turn || !myConditions.conditions) {
        this.toastS.error('Aún no tienes turno de matricula, o no aceptaste las condiciones');
        setTimeout(() => {
          this.router.navigate(['/estudiante']);
          return
        }, 1500)
      }
    }
    if (!myConditions) {
      this.toastS.error('Aún no tienes turno de matricula, o no aceptaste las condiciones');
      setTimeout(() => {
        this.router.navigate(['/estudiante']);
        return
      }, 1500)
    }
    this.dataStudent = this.session.getObject('dataEnrollment');
    this.enrollmentS.getSchoolCycle({EMPLID: this.user.codigoAlumno, INSTITUTION: this.dataStudent['INSTITUTION'], ACAD_CAREER: this.dataStudent['ACAD_CAREER']})
      .then((res) => {
        this.dataCicle = res;
        this.numberOfCicles = res['UCS_REST_CON_CIC_RES']['UCS_REST_CON_CIC_DET'];
        if (!this.numberOfCicles) {
          this.loading = false;
          this.toastS.error('Tu matricula no esta habilitada, comunicate con planificación');
          setTimeout(() => {
            this.router.navigate(['/estudiante']);
          }, 4000)
          return
        }
        this.cycles = this.checkInscription(this.numberOfCicles);
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
    this.loading = true;
    this.cicleSelected = cicle;
    this.session.setObject('schoolCycle', this.cicleSelected);
    this.broadcaster.sendMessage({cycleSelected: this.cicleSelected});
    this.loadCoursesAlready();
  }

  checkInscription(cicles){
    let toSelectCycle = [];
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
    return toSelectCycle
  }

  loadCoursesAlready(){
    this.enrollmentS.getScheduleStudent({
      EMPLID: this.user.codigoAlumno,
      INSTITUTION: this.dataStudent['INSTITUTION'],
      ACAD_CAREER: this.dataStudent['ACAD_CAREER'],
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
        this.myRealCoursesInEnrollment = coursesInEnrollment.filter(el => el.PERMITIR_BAJA == 'Y');
      }
      this.myCoursesinEnrollment = coursesInEnrollment;
      this.myCredits = creditos;
      this.enrollmentS.getSkillfullLoad({EMPLID: this.user.codigoAlumno, CAMPUS: this.dataStudent.sede})
        .then((res) => {
          this.availableCourses = res.sort((a,b) => {
            return a.UCS_CICLO - b.UCS_CICLO
          });
          if (coursesInEnrollment) {
            for (let i = 0; i < coursesInEnrollment.length; i++) {
              this.availableCourses = this.availableCourses.filter(el => el.CRSE_ID != coursesInEnrollment[i].CRSE_ID);
            }
          }
          this.maxCredits = Math.round(this.availableCourses[0]['FT_MAX_TOTAL_UNIT']);
          this.session.setItem('MaxCreditsEnrollment', this.maxCredits);
          this.loading = false;
        });
    });
  }

  // loadDataStudentCourses(){
  //   this.loading = true;
  //   this.enrollmentS.getCourseClass({
  //     EMPLID: this.user.codigoAlumno,
  //     STRM: this.cicleSelected['CICLO_LECTIVO']
  //   }).then((res) => {
  //     if (res.length > 0) {
  //       this.myCoursesinEnrollment = res.reverse().sort(this.dynamicSortMultiple(["CRSE_ID"]));
  //       let credits = 0;
  //       let oneTimeCourse;
  //       for (let i = 0; i < this.myCoursesinEnrollment.length; i++) {
  //         if (this.listOfLockCourses.find(el => el == this.myCoursesinEnrollment[i]['CRSE_ID'])) {
  //           this.myCoursesinEnrollment[i].notCount = true;
  //         } else {
  //           if (oneTimeCourse == this.myCoursesinEnrollment[i]['CRSE_ID']) {
  //           } else {
  //             oneTimeCourse = this.myCoursesinEnrollment[i]['CRSE_ID'];
  //             let existInfo = this.myCoursesinEnrollment[i]['status'] == 'B' && !this.myCoursesinEnrollment[i]['units_repeat_limit2'];
  //             let number = existInfo?Number(this.myCoursesinEnrollment[i]['UNITS_REPEAT_LIMIT']):Number(this.myCoursesinEnrollment[i]['units_repeat_limit2']);
  //             if ((this.myCoursesinEnrollment[i].status == 'I' && this.myCoursesinEnrollment[i].units_repeat_limit2) || (this.myCoursesinEnrollment[i].status == 'B')) {
  //               if (this.myCoursesinEnrollment[i].FLAG2 == 'Y') {
  //                 credits += Number(this.myCoursesinEnrollment[i]['UNITS_REQUIRED']);
  //               } else {
  //                 credits += number;
  //               }
  //             }
  //           }
  //         }
  //       }
  //       this.myCredits = credits;
  //     }
  //     this.myRealCoursesInEnrollment = this.myCoursesinEnrollment.filter(el => el.notCount != true);
  //     this.loading = false;
  //   });
  // }

  onChangeAvailable(course, evt){
    if (this.checkCreditsCap(course)) {
      evt.target.checked = false;
      course.value = false;
      return
    }
    this.loading = true;
    this.enrollmentS.getScheduleNew({
      CAMPUS: this.dataStudent.sede,
      CRSE_ID: course.CRSE_ID.length<=4?'00' + course.CRSE_ID:course.CRSE_ID,
      OFFER_CRSE: '',
      SESSION_CODE: '',
      STRM: this.cicleSelected['CICLO_LECTIVO']
    }).then((res) => {
      let data = res.UCS_REST_COHOR_RESP.UCS_REST_CON_HOR_RES;
      if (!data) {
        this.scheduleAvailables = [];
      } else {
        this.scheduleAvailables = this.checkDuplicates(data);
        this.selectedCourse = course;
      }
      // setTimeout(() => {
        this.loading = false;
        this.scheduleSelection.open();
      // }, 3000)
    });
    evt.target.checked = false;
  }

  clickCourse(course){
    course.value = false;
  }

  closeModal(modal){
    this.selectedCourse.value = false;
    modal.close();
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

  callSendEmail(){
    this.broadcaster.sendMessage({sendEmailModal: true, myCredits: this.myCredits});
  }

  equivalentCourses(){
    this.broadcaster.sendMessage({openEquivalentModal: true});
  }

  changeCycle(cycle) {
    this.cycles.forEach(el => {
      el.value = false;
    });
    cycle.value = true;
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
      this.toastS.error('Tienes que elegir un ciclo lectivo');
    } else {
      this.selectCycleModal.close();
      this.selectedCycle(this.cycleSTRMSelected);
    }
  }

  checkCreditsCap(course){
    if (this.myCredits + Number(course['UNITS_REPEAT_LIMIT']) > this.maxCredits) {
      this.toastS.error('Estas superando los creditos maximos');
      return true
    } else {
      return false
    }
  }

  changeSchedule(course, evt){
    if(course.notAvailable){
      evt.target.checked = false;
      course.value = false;
      this.toastS.error(course.alertMessage);
    } else {
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

  showMore(section){
    for (var i = 0; i < this.scheduleAvailables.length; i++) {
      for (var o = 0; o < this.scheduleAvailables[i]['UCS_REST_DET_MREU'].length; o++) {
        if ((this.scheduleAvailables[i].ASOCIACION_CLASE == section.ASOCIACION_CLASE) && !this.scheduleAvailables[i]['UCS_REST_DET_MREU'][o].show && this.scheduleAvailables[i].NRO_CLASE == section.NRO_CLASE) {
          this.scheduleAvailables[i]['UCS_REST_DET_MREU'][o].more = !section.up;
        }
      }
    }
    section.up = !section.up;
  }

  removeSeconds(time){
    return time.slice(0, -3)
  }

  checkCrosses(pickedCourse){
    for (let i = 0; i < this.myCoursesinEnrollment.length; i++) {
      if (this.myCoursesinEnrollment[i].CICLO_LECTIVO == pickedCourse.CICLO_LECTIVO) {
        for (var o = 0; o < pickedCourse.UCS_REST_DET_MREU.length; o++) {
          for (var u = 0; u < this.myCoursesinEnrollment[i].UCS_REST_MTG_DET_REQ.length; u++) {
            // if (this.myCoursesinEnrollment[i]['CRSE_ATTR'] != 'VIRT' && pickedCourse.UCS_REST_DET_MREU[o]['TIPO'] != 'VIRT') {
            if (!this.myCoursesinEnrollment[i].UCS_REST_MTG_DET_REQ[u]['DESCR_INSTALACION'].includes('VIRT') && pickedCourse.UCS_REST_DET_MREU[o]['TIPO'] != 'VIRT') {
              if (BetweenDays(this.myCoursesinEnrollment[i].UCS_REST_MTG_DET_REQ[u]['FECHA_INICIAL'] + ' 00:00:00',this.myCoursesinEnrollment[i].UCS_REST_MTG_DET_REQ[u]['FECHA_FINAL'] + ' 00:00:00', RealDate(new Date(pickedCourse.UCS_REST_DET_MREU[o]['FECHA_INICIAL'].replaceAll('-', '/') + ' 00:00:00'))) || BetweenDays(this.myCoursesinEnrollment[i].UCS_REST_MTG_DET_REQ[u]['FECHA_INICIAL'] + ' 00:00:00',this.myCoursesinEnrollment[i].UCS_REST_MTG_DET_REQ[u]['FECHA_FINAL'] + ' 00:00:00', RealDate(new Date(pickedCourse.UCS_REST_DET_MREU[o]['FECHA_FINAL'].replaceAll('-', '/') + ' 00:00:00')))) {
                if (this.getDayY(this.myCoursesinEnrollment[i].UCS_REST_MTG_DET_REQ[u]) == pickedCourse.UCS_REST_DET_MREU[o]['DIA'].replace(/\W/g, '').toUpperCase()) {
                  if ((this.timeToSeconds(pickedCourse.UCS_REST_DET_MREU[o]['HORA_INICIO']) >= this.timeToSeconds(this.myCoursesinEnrollment[i].UCS_REST_MTG_DET_REQ[u]['HORA_INICIO']) && this.timeToSeconds(pickedCourse.UCS_REST_DET_MREU[o]['HORA_INICIO']) < this.timeToSeconds(this.myCoursesinEnrollment[i].UCS_REST_MTG_DET_REQ[u]['HORA_FIN'])) || (this.timeToSeconds(pickedCourse.UCS_REST_DET_MREU[o]['HORA_FIN']) > this.timeToSeconds(this.myCoursesinEnrollment[i].UCS_REST_MTG_DET_REQ[u]['HORA_INICIO']) && this.timeToSeconds(pickedCourse.UCS_REST_DET_MREU[o]['HORA_FIN']) <= this.timeToSeconds(this.myCoursesinEnrollment[i].UCS_REST_MTG_DET_REQ[u]['HORA_FIN']))) {
                    // if (this.timeToSeconds(pickedCourse['MEETING_TIME_END']) <= this.timeToSeconds(this.myCoursesinEnrollment[i]['MEETING_TIME_START'])) {
                      // console.log(this.myCoursesinEnrollment);
                      this.toastS.error('Tienes un cruce con otra clase: ' + this.myCoursesinEnrollment[i]['CRSE_ID'] + '-' + this.myCoursesinEnrollment[i]['NOMBRE_CURSO']);
                      pickedCourse.alertMessage = 'Tienes un cruce con otra clase: ' + this.myCoursesinEnrollment[i]['CRSE_ID'] + '-' + this.myCoursesinEnrollment[i]['NOMBRE_CURSO'];
                      return true
                    // }
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

  countASS(associated_class){
    let total = associated_class.UCS_REST_DET_MREU.length;
    if (total > 1) {
      return true
    }
  }

  countPRA(associated_class){
    let total = 0;
    for (var i = 0; i < this.scheduleAvailables.length; i++) {
      for (var o = 0; o < this.scheduleAvailables[i]['UCS_REST_DET_MREU'].length; o++) {
        if ((this.scheduleAvailables[i].ASOCIACION_CLASE == associated_class.ASOCIACION_CLASE) && this.scheduleAvailables[i].CODIGO_COMPONENTE == 'PRA' && this.scheduleAvailables[i]['UCS_REST_DET_MREU'][o].show && this.scheduleAvailables[i].ID_CURSO == associated_class.ID_CURSO) {
          total++;
        }
      }
    }
    return total;
  }

  countPRABeforeSave(associated_class){
    let total = 0;
    for (var i = 0; i < this.scheduleAvailables.length; i++) {
      for (var o = 0; o < this.scheduleAvailables[i]['UCS_REST_DET_MREU'].length; o++) {
        if ((this.scheduleAvailables[i].ASOCIACION_CLASE == associated_class.ASSOCIATED_CLASS) && this.scheduleAvailables[i].CODIGO_COMPONENTE == 'PRA' && this.scheduleAvailables[i]['UCS_REST_DET_MREU'][o].show && this.scheduleAvailables[i].ID_CURSO == associated_class.CRSE_ID) {
          total++;
        }
      }
    }
    return total;
  }

  confirmEnroll(){
    this.loading = true;
    let data = [];
    this.selectedCourse['schedules'] = [];
    for (var i = 0; i < this.scheduleAvailables.length; i++) {
      if (this.scheduleAvailables[i].value) {
        for (var o = 0; o < this.scheduleAvailables[i]['UCS_REST_DET_MREU'].length; o++) {
          data.push({
            EMPLID: this.user.codigoAlumno,
            INSTITUTION: this.dataStudent['INSTITUTION'],
            ACAD_CAREER: this.dataStudent['ACAD_CAREER'],
            STRM: this.cicleSelected['CICLO_LECTIVO'],
            CRSE_ID: this.scheduleAvailables[i]['ID_CURSO'],
            SESSION_CODE: this.scheduleAvailables[i]['CODIGO_SESION'],
            ASSOCIATED_CLASS: this.scheduleAvailables[i]['ASOCIACION_CLASE'],
            CLASS_NBR: this.scheduleAvailables[i]['NRO_CLASE'],
            OFFER_NBR: this.scheduleAvailables[i]['OFERTA_CURSO'],
            SSR_COMPONENT: this.scheduleAvailables[i]['CODIGO_COMPONENTE'],
            equivalent: '-'
          })
        }
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
      this.toastS.warning('No seleccionaste ninguna sección');
      return
    }
    let teo = result[0];
    if (teo['SSR_COMPONENT'] == 'TEO') {
      let numberOfPRA = this.countPRABeforeSave(teo);
      if (numberOfPRA > 1 && result.length == 1) {
        this.loading = false;
        this.toastS.warning('Tienes que seleccionar alguna practica');
        return
      }
    }
    this.enrollmentS.saveCourseClass({
      courses: result,
      emplid_admin: this.user.email
    }).then((res) => {
      if (res['UCS_REST_INSCR_RES'] && res['UCS_REST_INSCR_RES']['UCS_DET_CLA_RES'][0]['RESULTADO'] != 'No hay vacantes') {
        let index = this.availableCourses.findIndex(val => val['own_enrollment_skillful_load_id'] == this.selectedCourse['own_enrollment_skillful_load_id']);
        this.availableCourses.splice(index, 1);
        this.toastS.success('Curso matriculado');
        this.session.destroy('mySchedule');
        this.loadCoursesAlready();
        this.scheduleSelection.close();
      } else if(res.status == 'fail'){
        this.toastS.error(res.message);
        this.loading = false;
      } else {
        this.toastS.warning('No hay vacantes para este curso');
        this.loading = false;
      }
    });
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

  checkDuplicates(array){
    array.sort(this.dynamicSortMultiple(["ASOCIACION_CLASE","ID_CURSO","-CODIGO_COMPONENTE","NRO_CLASE"]));
    let lastNBR;
    for (var i = 0; i < array.length; i++) {
      for (var o = 0; o < array[i]['UCS_REST_DET_MREU'].length; o++) {
        if (o == 0) {
          array[i]['UCS_REST_DET_MREU'][o].show = true;
        } else {
          array[i]['UCS_REST_DET_MREU'][o].show = false;
        }
      }
    }
    return array.filter(arr => arr.INGRESANTE_NORMAL != 'Y')
  }

  goDashboard(){
    this.router.navigate(['/estudiante']);
    this.IntentionEnrollmentBack.close();
  }

  checkCap(section){
    if (section.TOTAL_INSCRITOS >= section.TOTAL_CAPACIDAD) {
      return true
    }
    return false
  }

  blockAssociated(actualCourse, array, errM){
    let numberOfPRA = this.countPRA(actualCourse);
    for (let i = 0; i < array.length; i++) {
      if (array[i].ASOCIACION_CLASE == actualCourse.ASOCIACION_CLASE) {
        if (actualCourse.CODIGO_COMPONENTE == 'PRA') {
          if (numberOfPRA > 1 && actualCourse.NRO_CLASE == array[i].NRO_CLASE) {
            array[i].notAvailable = true;
            array[i].alertMessage = errM;
            array[i].value = false;
          } else {
            if(actualCourse.CODIGO_COMPONENTE == 'TEO'){
              array[i].notAvailable = true;
              array[i].alertMessage = errM;
              array[i].value = false;
            } else if(actualCourse.CODIGO_COMPONENTE == 'PRA'){
              if (numberOfPRA > 1) {
                actualCourse.notAvailable = true;
                actualCourse.alertMessage = errM;
                actualCourse.value = false;
              } else {
                array[i].notAvailable = true;
                array[i].alertMessage = errM;
                array[i].value = false;
              }
            }
          }
        } else if(actualCourse.CODIGO_COMPONENTE == 'TEO'){
          array[i].notAvailable = true;
          array[i].alertMessage = errM;
          array[i].value = false;
        }
      }
    }
  }
}