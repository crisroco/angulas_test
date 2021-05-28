import { Component, OnInit, ViewChild } from '@angular/core';
import { Broadcaster } from '../../../../services/broadcaster';
import { NewEnrollmentService } from '../../../../services/newenrollment.service';
import { SessionService } from '../../../../services/session.service';
import { ToastrService } from 'ngx-toastr';
import { AppSettings } from '../../../../app.settings';
import { Router } from '@angular/router';

@Component({
  selector: 'app-courses-enrollment',
  templateUrl: './courses-enrollment.component.html',
  styleUrls: ['./courses-enrollment.component.scss']
})
export class CoursesEnrollmentComponent implements OnInit {
  crossdata: any;
	availableCourses:any;
  all:any;
  user: any = this.session.getObject('user');
  loading: boolean = false;
  showMessage: boolean = false;
  company = AppSettings.COMPANY;
  schoolCycle: any = this.session.getObject('schoolCycle');
  goingToDelete:Array<any> = [];
  showToDelete:Array<any> = [];
  public allToEmail:Array<any> = [];
  public myCredits = 0;
  public maxCreditsEnrollment = this.session.getItem('MaxCreditsEnrollment');
  @ViewChild('deleteConfirmationModal') deleteConfirmationModal: any;
  public listOfLockCourses = ['001070','001071','001072','001073','001074','001070','001071','001072','001073', '667233', '666911'];

  constructor(public broadcaster: Broadcaster,
    public newEnrollmentS: NewEnrollmentService,
    public toastS: ToastrService,
    public router: Router,
    public session: SessionService) { }

  ngOnInit() {
    // this.newEnrollmentS.getDebt({EMPLID: this.user.codigoAlumno})
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
    this.loadInPS();
    
  }

  loadInPS() {
    this.loading = true;
    let student = this.session.getObject('dataEnrollment')
    this.newEnrollmentS.getScheduleStudent({
      EMPLID: this.user.codigoAlumno,
      INSTITUTION: student['INSTITUTION'],
      ACAD_CAREER: student['ACAD_CAREER'],
      STRM1: student['STRM'],
      STRM2: student['STRM1'],
      check:true
    }).then((res) => {
      this.loadDataStudentCourses();
    });
  }

  removeSeconds(time){
    return time.slice(0, -3)
  }

  loadDataStudentCourses(){
    this.loading = true;
    this.newEnrollmentS.getCourseClass({
      EMPLID: this.user.codigoAlumno
    }).then((res) => {
      let go = res.reverse();
      this.availableCourses = this.groupByClass(go);
      if (res.length == 0) {
        this.myCredits = 0;
        this.showMessage = true;
      } else {
        let example = res.sort(this.dynamicSortMultiple(["CRSE_ID"]));
        let credits = 0;
        let oneTimeCourse;
        for (let i = 0; i < example.length; i++) {
          if (oneTimeCourse == example[i]['CRSE_ID']) {
          } else {
            oneTimeCourse = example[i]['CRSE_ID'];
            let existInfo = example[i]['status'] == 'B' && !example[i]['units_repeat_limit2'];
            let number = existInfo?Number(example[i]['UNITS_REPEAT_LIMIT']):Number(example[i]['units_repeat_limit2']);
            if (example[i].trash) {
              if (example[i].FLAG2 == 'Y') {
                credits += Number(example[i]['UNITS_REQUIRED']);
              } else {
                credits += number;
              }
            }
          }
        }
        this.myCredits = credits;
      }
      this.allToEmail = this.availableCourses.filter(el => el.trash != false);
      this.loading = false;
    });
  }

  groupByClass(array) {
    let filteredArray = {};
    let finalArray = [];
    for (let i = 0; i < array.length; i++) {
      array[i].DESCR = array[i].DESCR.toUpperCase();
      array[i].trash = false;
      if ((array[i].status == 'I' && array[i].units_repeat_limit2) || (array[i].status == 'B')) {
        array[i].trash = true;
      }
      if (this.listOfLockCourses.find(el => el == array[i]['CRSE_ID'])) {
        array[i].trash = false;
      }
      if (!filteredArray[array[i].DESCR]) {
        filteredArray[array[i].DESCR] = [];
        filteredArray[array[i].DESCR].push(array[i]);
      } else {
        if (filteredArray[array[i].DESCR].length < 2) {
          if (array[i]['SSR_COMPONENT'] == 'PRA' && filteredArray[array[i].DESCR][0]['SSR_COMPONENT'] == 'TEO') {
            filteredArray[array[i].DESCR].push(array[i]);
          } else if (array[i]['SSR_COMPONENT'] == 'TEO' && (filteredArray[array[i].DESCR][0]['SSR_COMPONENT'] == 'PRA' || filteredArray[array[i].DESCR][0]['SSR_COMPONENT'] == 'SEM')) {
            filteredArray[array[i].DESCR].push(array[i]);
          } else if (array[i]['SSR_COMPONENT'] == 'SEM') {
            filteredArray[array[i].DESCR].push(array[i]);
          }
        }
      }
      filteredArray[array[i].DESCR].sort(this.dynamicSortMultiple(['SSR_COMPONENT', 'DESCRSHORT']));
    }
    for(var el in filteredArray) {
      filteredArray[el].forEach(value => {
        if (filteredArray[el].length == 2 && (value.SSR_COMPONENT == 'PRA' || value.SSR_COMPONENT == 'SEM')) {
          value.showLine = true;
          finalArray.push(value);
        } else {
          finalArray.push(value);
        }
      });
    }
    finalArray.sort(this.dynamicSortMultiple(['trash', 'CRSE_ID']));
    return finalArray.reverse();
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

  callModal(){
    this.broadcaster.sendMessage({openModal: true});
  }

  callSendEmail(){
    this.broadcaster.sendMessage({sendEmailModal: true, myCredits: this.myCredits});
  }

  remove(first){
    if (!first.trash) {
      // this.toastS.error('Este curso no se puede eliminar');
    } else {
      this.goingToDelete = [];
      this.showToDelete = [];
      this.deleteConfirmationModal.open();
      for (let o = 0; o < this.availableCourses.length; o++) {
        if (this.availableCourses[o]['CRSE_ID'] == first['CRSE_ID']) {
          this.goingToDelete.push(this.availableCourses[o]);
        }
      }
      let dateToCompare = this.goingToDelete[0].DAY_OF_WEEK + this.goingToDelete[0].MEETING_TIME_START + this.goingToDelete[0].MEETING_TIME_END;
      let changed = true;
      for (let z = 0; z < this.goingToDelete.length; z++) {
        if (dateToCompare == this.goingToDelete[z].DAY_OF_WEEK + this.goingToDelete[z].MEETING_TIME_START + this.goingToDelete[z].MEETING_TIME_END) {
          if (changed) {
            this.showToDelete.push(this.goingToDelete[z]);
            changed = false;
          }
        } else {
          dateToCompare = this.goingToDelete[z].DAY_OF_WEEK + this.goingToDelete[z].MEETING_TIME_START + this.goingToDelete[z].MEETING_TIME_END;
          this.showToDelete.push(this.goingToDelete[z]);
          changed = true;
        }
      }
    }
  }

  delete(){
    this.loading = true;
    this.session.destroy('mySchedule');
    if (this.goingToDelete.length > 1) {
      this.newEnrollmentS.deleteCourseClassByCrseId(this.user.codigoAlumno, this.goingToDelete[0]['CRSE_ID'])
      .then((res) => {
        this.loading = false;
        this.deleteConfirmationModal.close();
        this.loadDataStudentCourses();
        this.toastS.warning('Cursos Removidos');
      });
    } else {
      this.newEnrollmentS.deleteCourseClass(this.goingToDelete[0].own_enrollment_id, this.user.codigoAlumno)
      .then((res) => {
        this.loading = false;
        this.deleteConfirmationModal.close();
        this.loadDataStudentCourses();
        this.toastS.warning('Cursos Removidos');
      });
    }
  }

  onChangeAvailable(){

  }
}