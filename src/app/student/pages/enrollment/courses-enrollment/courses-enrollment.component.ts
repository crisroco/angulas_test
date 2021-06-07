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
  numberofExtra:number = 0; 
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
    this.availableCourses = [];
    let credits = 0;
    let student = this.session.getObject('dataEnrollment')
    this.newEnrollmentS.getScheduleStudent({
      EMPLID: this.user.codigoAlumno,
      INSTITUTION: student['INSTITUTION'],
      ACAD_CAREER: student['ACAD_CAREER'],
      STRM1: this.schoolCycle['CICLO_LECTIVO'],
      STRM2: null,
      check:true
    }).then((res) => {
      let coursesInEnrollment = res.UCS_REST_CONS_HORA_MATR_RES.UCS_REST_DET_HORARIO_RES;
      let materialCourses = this.session.getObject('MaterialInCourse');
      if (res.UCS_REST_CONS_HORA_MATR_RES.UCS_REST_DET_HORARIO_RES) {
        for (let i = 0; i < coursesInEnrollment.length; i++) {
          credits += Number(coursesInEnrollment[i].CREDITOS);
          coursesInEnrollment[i]['flag'] = false;
          for(let o = 0; o < materialCourses.length; o++){
            if(coursesInEnrollment[i].CRSE_ID == (materialCourses[o].CRSE_ID || materialCourses[o].CRSE_ID2 || materialCourses[o].CRSE_ID3 || materialCourses[o].CRSE_ID4 || materialCourses[o].CRSE_ID5 || materialCourses[o].CRSE_ID6)){
              coursesInEnrollment[i]['flag'] = true;
            }
          }
        }
        this.availableCourses = coursesInEnrollment.sort(this.dynamicSortMultiple(["flag"]));
        console.log(this.availableCourses);
        this.numberofExtra = this.availableCourses.filter(el => el.flag).length;
        this.allToEmail = this.availableCourses.filter(el => el.PERMITIR_BAJA == 'Y');
      }
      this.myCredits = credits;
      this.loading = false;
    });
  }

  removeSeconds(time){
    return time.slice(0, -3)
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
    this.goingToDelete = [];
    this.deleteConfirmationModal.open();
    for (let o = 0; o < this.availableCourses.length; o++) {
      if (this.availableCourses[o]['CRSE_ID'] == first['CRSE_ID']) {
        this.goingToDelete.push(this.availableCourses[o]);
      }
    }
  }

  delete(){
    this.loading = true;
    this.session.destroy('mySchedule');
    this.newEnrollmentS.deleteCourseClass(this.user.codigoAlumno, this.user.codigoAlumno, {courses: this.goingToDelete})
    .then((res) => {
      this.loading = false;
      this.deleteConfirmationModal.close();
      this.loadInPS();
      this.toastS.warning('Cursos Removidos');
    });
  }

  findDay(obj){
    for (let key in obj) {
      if (obj[key] == 'Y') {
        return key
      }
    }
  }
}