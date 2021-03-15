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
    this.enrollmentS.getDebt({EMPLID: this.user.codigoAlumno})
      .then((res)=> {
        let notdeuda = res['UCS_WS_DEU_RSP']['UCS_WS_DEU_COM'][0]['DEUDA']=='N'?true:false;
        if (!notdeuda) {
          this.toastS.error('Tiene una deuda pendiente, por favor regularizar el pago.');
        }
      });
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
    // this.enrollmentS.getDataStudentEnrollment({EMPLID: this.user.codigoAlumno})
    //   .then((res) => {
    //     let std = res['UCS_DATPERS_RSP']['UCS_DATPERS_COM'][0];
    //     if (std.COND_ACAD != 'Y' || std.COND_FINAN != 'Y') {
    //       std = '';
    //       this.toastS.error('No aceptaste las Condiciones Académicas y/o Financieras')
    //       setTimeout(() => {
    //       this.router.navigate(['/estudiante']);
    //         return
    //       }, 1500)
    //     }
    //   });
    this.enrollmentS.getAcademicData({EMPLID: this.user.codigoAlumno})
      .then((res) => {
        if (res.length == 0) {
          console.log(res);
          this.toastS.error('Tu matricula no esta habilitada, comunicate con planificación');
          setTimeout(() => {
            this.router.navigate(['/estudiante']);
          }, 4000)
        } else {
          this.dataStudent = res[0];
          this.session.setObject('dataEnrollment', this.dataStudent);
          this.enrollmentS.getSchoolCycle({EMPLID: this.user.codigoAlumno, INSTITUTION: res[0]['INSTITUTION'], ACAD_CAREER: res[0]['ACAD_CAREER']})
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
      });
  }

  loadDataStudentCourses(){
    this.loading = true;
    this.enrollmentS.getCourseClass({
      EMPLID: this.user.codigoAlumno,
      STRM: this.cicleSelected['CICLO_LECTIVO']
    }).then((res) => {
      if (res.length > 0) {
        this.myCoursesinEnrollment = res.reverse().sort(this.dynamicSortMultiple(["CRSE_ID"]));
        let credits = 0;
        let oneTimeCourse;
        for (let i = 0; i < this.myCoursesinEnrollment.length; i++) {
          if (this.listOfLockCourses.find(el => el == this.myCoursesinEnrollment[i]['CRSE_ID'])) {
            this.myCoursesinEnrollment[i].notCount = true;
          } else {
            if (oneTimeCourse == this.myCoursesinEnrollment[i]['CRSE_ID']) {
            } else {
              oneTimeCourse = this.myCoursesinEnrollment[i]['CRSE_ID'];
              let existInfo = this.myCoursesinEnrollment[i]['status'] == 'B' && !this.myCoursesinEnrollment[i]['units_repeat_limit2'];
              let number = existInfo?Number(this.myCoursesinEnrollment[i]['UNITS_REPEAT_LIMIT']):Number(this.myCoursesinEnrollment[i]['units_repeat_limit2']);
              if ((this.myCoursesinEnrollment[i].status == 'I' && this.myCoursesinEnrollment[i].units_repeat_limit2) || (this.myCoursesinEnrollment[i].status == 'B')) {
                if (this.myCoursesinEnrollment[i].FLAG2 == 'Y') {
                  credits += Number(this.myCoursesinEnrollment[i]['UNITS_REQUIRED']);
                } else {
                  credits += number;
                }
              }
            }
          }
        }
        this.myCredits = credits;
      }
      this.myRealCoursesInEnrollment = this.myCoursesinEnrollment.filter(el => el.notCount != true);
      this.loading = false;
    });
  }

  selectedCycle(cicle){
    this.loading = true;
    this.cicleSelected = cicle;
    this.session.setObject('schoolCycle', this.cicleSelected);
    this.broadcaster.sendMessage({cycleSelected: this.cicleSelected})
    this.loadDataStudentCourses();
    this.enrollmentS.getSkillfullLoad({EMPLID: this.user.codigoAlumno, CAMPUS: this.dataStudent.CAMPUS})
    .then((res) => {
      this.availableCourses = res.sort((a,b) => {
        return a.UCS_CICLO - b.UCS_CICLO
      });
      this.maxCredits = Math.round(this.availableCourses[0]['FT_MAX_TOTAL_UNIT']);
      this.session.setItem('MaxCreditsEnrollment', this.maxCredits)
      this.loadCoursesAlready();
    });
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
      STRM2: this.otherCicle?this.otherCicle['CICLO_LECTIVO']:null,
      check:true
    }).then((res) => {
      this.loading = false;
    });
  }

  onChangeAvailable(course, evt){
    if (this.checkCreditsCap(course)) {
      evt.target.checked = false;
      course.value = false;
      return
    }
    this.loading = true;
    this.enrollmentS.getSchedule({
      EMPLID: this.user.codigoAlumno,
      CAMPUS: this.dataStudent.CAMPUS,
      CRSE_ID: parseInt(course.CRSE_ID),
      STRM: this.cicleSelected['CICLO_LECTIVO']
    }).then((res) => {
      this.scheduleAvailables = this.checkDuplicates(res);
      console.log(this.scheduleAvailables);
      this.selectedCourse = course;
      this.checkCap(this.scheduleAvailables);
      // setTimeout(() => {
        this.loading = false;
        this.scheduleSelection.open();
      // }, 3000)
    });
    // evt.target.checked = false;
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
        if (el.ASSOCIATED_CLASS == course.ASSOCIATED_CLASS) {
          if (course.SSR_COMPONENT == 'PRA') {
            if(el.SSR_COMPONENT == 'TEO'){
              if (el.CRSE_ID == course.CRSE_ID) {
                el.value = course.value;
              } else {
                el.value = false;
              }
            }
            if (!el.show && el.CLASS_NBR == course.CLASS_NBR) {
              el.value = course.value;
            }
            if (numberOfPRA > 1 && el.SSR_COMPONENT == 'PRA' && el.CLASS_NBR != course.CLASS_NBR) {
              el.value = false;
            }
            if (el.SSR_COMPONENT == 'PRA' && el.CRSE_ID != course.CRSE_ID) {
              el.value = false;
            }
          }
          if (course.SSR_COMPONENT == 'TEO') {
            if (course != el) {
              el.value = false;
            }
            if (!el.show && el.CLASS_NBR == course.CLASS_NBR) {
              el.value = course.value;
            }
            if (el.SSR_COMPONENT == 'PRA') {
              el.value = false;
            }
            if (el.SSR_COMPONENT == 'SEM') {
              el.value = course.value;
            }
            if (numberOfPRA > 1) {
              
            } else {
              if (el.SSR_COMPONENT == 'PRA' && el.CRSE_ID == course.CRSE_ID) {
                el.value = course.value;
              }
            }
          } if (course.SSR_COMPONENT == 'SEM') {
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
    this.scheduleAvailables.forEach(el => {
      if ((el.ASSOCIATED_CLASS == section.ASSOCIATED_CLASS) && !el.show && el.CLASS_NBR == section.CLASS_NBR) {
        el.more = !section.up;
      }
    });
    section.up = !section.up;
  }

  removeSeconds(time){
    return time.slice(0, -3)
  }

  checkCrosses(pickedCourse){
    for (let i = 0; i < this.myCoursesinEnrollment.length; i++) {
      if (this.myCoursesinEnrollment[i].STRM == pickedCourse.STRM) {
        if (this.myCoursesinEnrollment[i]['CRSE_ATTR'] != 'VIRT' && pickedCourse['CRSE_ATTR'] != 'VIRT') {
          if (BetweenDays(this.myCoursesinEnrollment[i]['START_DT_DO'] + ' 00:00:00',this.myCoursesinEnrollment[i]['END_DT_DO'] + ' 00:00:00', RealDate(new Date(pickedCourse['START_DT_DO'].replaceAll('-', '/') + ' 00:00:00'))) || BetweenDays(this.myCoursesinEnrollment[i]['START_DT_DO'] + ' 00:00:00',this.myCoursesinEnrollment[i]['END_DT_DO'] + ' 00:00:00', RealDate(new Date(pickedCourse['END_DT_DO'].replaceAll('-', '/') + ' 00:00:00')))) {
            if (this.myCoursesinEnrollment[i]['DAY_OF_WEEK'] == pickedCourse['DAY_OF_WEEK']) {
              if ((this.timeToSeconds(pickedCourse['MEETING_TIME_START']) >= this.timeToSeconds(this.myCoursesinEnrollment[i]['MEETING_TIME_START']) && this.timeToSeconds(pickedCourse['MEETING_TIME_START']) < this.timeToSeconds(this.myCoursesinEnrollment[i]['MEETING_TIME_END'])) || (this.timeToSeconds(pickedCourse['MEETING_TIME_END']) > this.timeToSeconds(this.myCoursesinEnrollment[i]['MEETING_TIME_START']) && this.timeToSeconds(pickedCourse['MEETING_TIME_END']) <= this.timeToSeconds(this.myCoursesinEnrollment[i]['MEETING_TIME_END']))) {
                // if (this.timeToSeconds(pickedCourse['MEETING_TIME_END']) <= this.timeToSeconds(this.myCoursesinEnrollment[i]['MEETING_TIME_START'])) {
                  // console.log(this.myCoursesinEnrollment);
                  this.toastS.error('Tienes un cruce con otra clase: ' + this.myCoursesinEnrollment[i]['CLASS_SECTION'] + ' ' + this.myCoursesinEnrollment[i]['DESCR']);
                  pickedCourse.alertMessage = 'Tienes un cruce con otra clase: ' + this.myCoursesinEnrollment[i]['CLASS_SECTION'] + ' ' + this.myCoursesinEnrollment[i]['DESCR'];
                  return true
                // }
              }
            }
          }
        }
      }
    }
    return false
  }

  timeToSeconds(time){
    let inSeconds = time.split(':');
    return inSeconds[0]*60*60 + inSeconds[1]*60
  }

  countASS(associated_class){
    let total = this.scheduleAvailables.filter(el => el.ASSOCIATED_CLASS == associated_class.ASSOCIATED_CLASS && !el.show && el.CLASS_NBR == associated_class.CLASS_NBR).length;
    if (total > 0) {
      return true
    }
  }

  countPRA(associated_class){
    return this.scheduleAvailables.filter(el => el.ASSOCIATED_CLASS == associated_class.ASSOCIATED_CLASS && el.SSR_COMPONENT == 'PRA' && el.show && el.CRSE_ID == associated_class.CRSE_ID).length;
  }

  confirmEnroll(){
    this.loading = true;
    let data = [];
    this.selectedCourse['schedules'] = [];
    for (var i = 0; i < this.scheduleAvailables.length; i++) {
      if (this.scheduleAvailables[i].value) {
        data.push({
          EMPLID: this.user.codigoAlumno,
          INSTITUTION: this.dataStudent['INSTITUTION'],
          ACAD_CAREER: this.dataStudent['ACAD_CAREER'],
          STRM: this.cicleSelected['CICLO_LECTIVO'],
          CRSE_ID: this.scheduleAvailables[i]['CRSE_ID'],
          SESSION_CODE: this.scheduleAvailables[i]['SESSION_CODE'],
          ASSOCIATED_CLASS: this.scheduleAvailables[i]['ASSOCIATED_CLASS'],
          CLASS_NBR: this.scheduleAvailables[i]['CLASS_NBR'],
          OFFER_NBR: this.scheduleAvailables[i]['OFFER_NBR'],
          SSR_COMPONENT: this.scheduleAvailables[i]['SSR_COMPONENT'],
          equivalent: this.scheduleAvailables[i]['CRSE_ID_DESCR']!='-'&& this.scheduleAvailables[i]['CRSE_ID_DESCR']!=null?this.scheduleAvailables[i]['CRSE_ID_DESCR'].split('-')[0]:null
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
      this.toastS.warning('No seleccionaste ninguna sección');
      return
    }
    let teo = result[0];
    if (teo['SSR_COMPONENT'] == 'TEO') {
      let numberOfPRA = this.countPRA(teo);
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
      if (res['UCS_REST_INSCR_RES']['UCS_DET_CLA_RES'][0]['RESULTADO'] != 'No hay vacantes') {
        let index = this.availableCourses.findIndex(val => val['own_enrollment_skillful_load_id'] == this.selectedCourse['own_enrollment_skillful_load_id']);
        this.availableCourses.splice(index, 1);
        this.toastS.success('Curso matriculado');
        this.session.destroy('mySchedule');
        this.loadDataStudentCourses();
        this.loading = false;
        this.scheduleSelection.close();
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
    array.sort(this.dynamicSortMultiple(["ASSOCIATED_CLASS","CRSE_ID","-SSR_COMPONENT","CLASS_NBR","CRSE_ATTR"]));
    let lastNBR;
    for (var i = 0; i < array.length; i++) {
      if (array[i]['FLAG1'] != 'I') {
        if (!lastNBR) {
          lastNBR = array[i]['CLASS_NBR'];
          array[i].show = true;
        }else if (lastNBR == array[i]['CLASS_NBR']){
          array[i].show = false;
        } else {
          lastNBR = array[i]['CLASS_NBR'];
          array[i].show = true;
        }
      }
    }
    return array.filter(arr => arr.FLAG1 != 'I')
  }

  goDashboard(){
    this.router.navigate(['/estudiante']);
    this.IntentionEnrollmentBack.close();
  }

  checkCap(section){
    if (section.number == section.ENRL_CAP) {
      return true
    }
    return false
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
        } else if(actualCourse.SSR_COMPONENT == 'TEO'){
          array[i].notAvailable = true;
          array[i].alertMessage = errM;
          array[i].value = false;
        }
      }
    }
  }

  invertDates(date_format){
    let x = date_format.split('/');
    return x[2] + '-' + x[1] + '-' + x[0]
  }

}