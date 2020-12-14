import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { StudentService } from '../../../../services/student.service';
import { SessionService } from '../../../../services/session.service';

@Component({
  selector: 'app-final-grades',
  templateUrl: './final-grades.component.html',
  styleUrls: ['./final-grades.component.scss']
})
export class FinalGradesComponent implements OnInit {
	user: any = this.session.getObject('user');
	student: any = this.session.getObject('student');
	CLASS_NBR: string = '';
	ACAD_CAREER: string = '';
	STRM: string = '';
	CRSE_ID: string = '';
	DESCR: string = '';
	formule: any;
	grades: Array<any>;
	courses: Array<any>;
	realCourse: any;

	constructor(private realRoute: ActivatedRoute,
		private studentS: StudentService,
		private session: SessionService ) { 
		this.realRoute.paramMap.subscribe((query: any) => {
			var parts = decodeURIComponent(query.params.parts).split('|');
			this.CLASS_NBR = parts[0];
			this.ACAD_CAREER = parts[1];
			this.STRM = parts[2];
			this.CRSE_ID = parts[3];
			this.DESCR = parts[4];
		});
	}

	ngOnInit() {
		this.studentS.getFormuleCourse(this.CLASS_NBR, this.STRM)
		.then(res => {
			this.formule = res.UCS_REST_FORMULA_RES && res.UCS_REST_FORMULA_RES.UCS_REST_FORMULA_COM && res.UCS_REST_FORMULA_RES.UCS_REST_FORMULA_COM[0] && res.UCS_REST_FORMULA_RES.UCS_REST_FORMULA_COM[0].FORMULA?res.UCS_REST_FORMULA_RES.UCS_REST_FORMULA_COM[0].FORMULA:'';
		}, error => { });
		this.getGradesCourses();
		this.getFinalGrades();
	}

	getGradesCourses(){
		this.studentS.getGradesCourses({code: this.user.codigoAlumno, career: this.ACAD_CAREER, strm: this.STRM, course: this.CRSE_ID})
		.then(res => {
			this.grades = res.UcsMetodoDatosNotaRespuesta && res.UcsMetodoDatosNotaRespuesta.UcsMetodoDatosNotaDetalle? res.UcsMetodoDatosNotaRespuesta.UcsMetodoDatosNotaDetalle:[];
		}, error => { });
	}

	getFinalGrades(){
		this.studentS.getFinalGrades({code: this.user.codigoAlumno, career: this.ACAD_CAREER, cycle: this.STRM})
		.then(res => {
			this.courses = res.UcsMetodoDatosHoraRespuesta_V2 && res.UcsMetodoDatosHoraRespuesta_V2.UcsMetodoDatosHoraDetalle_V2?res.UcsMetodoDatosHoraRespuesta_V2.UcsMetodoDatosHoraDetalle_V2:[];
			var rCourse = this.courses.filter(item => item.codigoCurso == this.CRSE_ID);
			this.realCourse = rCourse?rCourse[0]:null;
		}, error => { });
	}

}
