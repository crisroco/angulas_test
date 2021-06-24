import { Component, OnInit, ViewChild } from '@angular/core';
import { Broadcaster } from '../../../services/broadcaster';
import { NewEnrollmentService } from '../../../services/newenrollment.service';
import { SessionService } from '../../../services/session.service';
import { ToastrService } from 'ngx-toastr';
import { AppSettings } from '../../../app.settings';
import { Router } from '@angular/router';

@Component({
  selector: 'app-matriculados',
  templateUrl: './matriculados.component.html',
  styleUrls: ['./matriculados.component.scss']
})
export class MatriculadosComponent implements OnInit {
	availableCourses:any;
  all:any;
  user: any = this.session.getObject('user');
  loading: boolean = false;
  showMessage: boolean = false;
  company = AppSettings.COMPANY;
  schoolCycle: any = this.session.getObject('schoolCycle');
  goingToDelete:Array<any> = [];
  numberofExtra:Array<any> = [];
  public myData = this.session.getObject('acadmicData');
  public myCredits = 0;
  public maxCreditsEnrollment = this.session.getItem('MaxCreditsEnrollment');
  @ViewChild('deleteConfirmationModal') deleteConfirmationModal: any;

  constructor(public broadcaster: Broadcaster,
    public newEnrollmentS: NewEnrollmentService,
    public toastS: ToastrService,
    public router: Router,
    public session: SessionService) { }

  ngOnInit() {
    this.loadDataStudentCourses();
  }

  loadDataStudentCourses(){
    this.loading = true;
    this.availableCourses = [];
    let credits = 0;
    let allData = this.session.getObject('acadmicData');
    this.newEnrollmentS.getScheduleStudent({
      EMPLID: this.session.getItem('emplidSelected'),
      INSTITUTION: allData['institucion'],
      ACAD_CAREER: allData['codigoGrado'],
      STRM1: allData['cicloAdmision'],
      STRM2: null
    }).then((res) => {
      let coursesInEnrollment = res.UCS_REST_CONS_HORA_MATR_RES.UCS_REST_DET_HORARIO_RES;
      let materialCourses = this.session.getObject('MaterialInCourse');
      if (res.UCS_REST_CONS_HORA_MATR_RES.UCS_REST_DET_HORARIO_RES) {
        for (let i = 0; i < coursesInEnrollment.length; i++) {
          credits += Number(coursesInEnrollment[i].CREDITOS);
          coursesInEnrollment[i]['flag'] = false;
          for(let o = 0; o < materialCourses.length; o++){
            if(coursesInEnrollment[i].CRSE_ID == materialCourses[o].CRSE_ID || coursesInEnrollment[i].CRSE_ID == materialCourses[o].CRSE_ID2 || coursesInEnrollment[i].CRSE_ID == materialCourses[o].CRSE_ID3 || coursesInEnrollment[i].CRSE_ID == materialCourses[o].CRSE_ID4 || coursesInEnrollment[i].CRSE_ID == materialCourses[o].CRSE_ID5 || coursesInEnrollment[i].CRSE_ID == materialCourses[o].CRSE_ID6){
              coursesInEnrollment[i]['flag'] = true;
            }
          }
        }
        this.availableCourses = coursesInEnrollment.sort(this.dynamicSortMultiple(["flag"]));
        this.numberofExtra = this.availableCourses.filter(el => el.flag).length;
      }
      this.myCredits = credits;
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
      if (!filteredArray[array[i].DESCR]) {
        filteredArray[array[i].DESCR] = [];
        if (array[i]['SSR_COMPONENT'] == 'TEO') {
          filteredArray[array[i].DESCR].push(array[i]);
        } else {
          filteredArray[array[i].DESCR].push(array[i]);
        }
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

  remove(first){
    this.goingToDelete = [];
    this.deleteConfirmationModal.open();
    for (let o = 0; o < this.availableCourses.length; o++) {
      if (this.availableCourses[o]['CRSE_ID'] == first['CRSE_ID']) {
        this.goingToDelete.push(this.availableCourses[o]);
      }
    }
  }

  findDay(obj){
    for (let key in obj) {
      if (obj[key] == 'Y') {
        return key
      }
    }
  }

  delete(){
    this.loading = true;
    this.session.destroy('mySchedule');
    this.newEnrollmentS.deleteCourseClass(this.user.codigoAlumno, this.session.getItem('adminOprid'), {courses: this.goingToDelete})
    .then((res) => {
      this.loading = false;
      this.deleteConfirmationModal.close();
      this.loadDataStudentCourses();
      this.toastS.warning('Cursos Removidos');
    });
  }
}