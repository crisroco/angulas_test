import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { DeviceDetectorService } from 'ngx-device-detector';
import { StudentService } from '../../../../services/student.service';
import { SessionService } from '../../../../services/session.service';

@Component({
  selector: 'app-course-history',
  templateUrl: './course-history.component.html',
  styleUrls: ['./course-history.component.scss']
})
export class CourseHistoryComponent implements OnInit {
	user: any = this.session.getObject('user');
	student: any = this.session.getObject('student');
	realProgram: any;
	programs: Array<any>;
	cycles: Array<any>;

	constructor(private session: SessionService,
		private studentS: StudentService) { }

	ngOnInit() {
		this.studentS.getAcademicDataStudent(this.session.getItem('emplidSelected'))
		.then(res => {
			this.programs = res.UcsMetodoDatosAcadRespuesta && res.UcsMetodoDatosAcadRespuesta.UcsMetodoDatosAcadRespuesta?res.UcsMetodoDatosAcadRespuesta.UcsMetodoDatosAcadRespuesta:[];
			if(this.programs.length){
				this.realProgram = this.programs[0];
				this.getCourses();
			}
		}, error => { });
	}

	getCourses(){
		this.studentS.getCourseHistory({institution: this.realProgram.institucion, career: this.realProgram.codigoGrado, emplid: this.session.getItem('emplidSelected')})
		.then( res => {
			this.cycles = [];
			var objCycles = {};
			var tcycles = res.UCS_REST_HST_CRSE_RES && res.UCS_REST_HST_CRSE_RES.UCS_REST_HST_CRSE_COM?res.UCS_REST_HST_CRSE_RES.UCS_REST_HST_CRSE_COM:[];
			for (var i = tcycles.length - 1; i >= 0; i--) {
				if(!objCycles[tcycles[i].Ciclo_lectivo]){
					objCycles[tcycles[i].Ciclo_lectivo] = {
						name: tcycles[i].Ciclo_lectivo,
						courses: [],
						nota: tcycles[i].Nota_media
					};
				}
				if(objCycles[tcycles[i].Ciclo_lectivo]){
					objCycles[tcycles[i].Ciclo_lectivo].courses.push(tcycles[i]);
				}
			}
			for( var kcycle in objCycles){
				objCycles[kcycle].courses.sort(this.dynamicSortMultiple(["Des_ciclo_lectivo", "Curso_descripcion"]));
				this.cycles.push(objCycles[kcycle]);
			}
			this.cycles.sort(this.sortname);
		}, error => { });
	}

	sortname(a, b){
		if(a.name < b.name) return -1;
		if(b.name < a.name) return 1;
		return 0;
	}

	dynamicSort(property) {
	    var sortOrder = 1;
	    if(property[0] === "-") {
	        sortOrder = -1;
	        property = property.substr(1);
	    }
	    return (a,b) => {
	        /* next line works with strings and numbers, 
	         * and you may want to customize it to your needs
	         */
	        var result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
	        return result * sortOrder;
	    }
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

}
