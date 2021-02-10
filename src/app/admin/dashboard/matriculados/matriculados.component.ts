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
  	public myData = this.session.getObject('acadmicData');
  	public myCredits = 0;
    public maxCreditsEnrollment = this.session.getItem('MaxCreditsEnrollment');
  	@ViewChild('deleteConfirmationModal') deleteConfirmationModal: any;

  constructor(public broadcaster: Broadcaster,
    public newEnrollmentS: NewEnrollmentService,
    public toastS: ToastrService,
    public router: Router,
    public session: SessionService) { }

  removeSeconds(time){
    return time.slice(0, -3)
  }

  ngOnInit() {
    this.loadDataStudentCourses();
  }

  loadDataStudentCourses(){
    this.loading = true;
    this.newEnrollmentS.getCourseClass({
      EMPLID: this.myData.EMPLID
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
        console.log(example);
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
          } else if (array[i]['SSR_COMPONENT'] == 'TEO' && filteredArray[array[i].DESCR][0]['SSR_COMPONENT'] == 'PRA') {
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
    if (this.goingToDelete.length > 1) {
      this.newEnrollmentS.deleteCourseClassByCrseIdAdmin(this.myData.EMPLID, this.goingToDelete[0]['CRSE_ID'], this.session.getObject('user').codigoAlumno)
      .then((res) => {
        this.loading = false;
        this.deleteConfirmationModal.close();
        this.toastS.warning('Cursos Removidos');
        this.loadDataStudentCourses();
      });
    } else {
      this.newEnrollmentS.deleteCourseClassAdmin(this.goingToDelete[0].own_enrollment_id, this.session.getObject('user').codigoAlumno)
      .then((res) => {
        this.loading = false;
        this.deleteConfirmationModal.close();
        this.toastS.warning('Cursos Removidos');
        this.loadDataStudentCourses();
      });
    }
  }
}