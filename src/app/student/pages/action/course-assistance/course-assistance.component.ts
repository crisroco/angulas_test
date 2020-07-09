import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { StudentService } from '../../../../services/student.service';
import { SessionService } from '../../../../services/session.service';

@Component({
  selector: 'app-course-assistance',
  templateUrl: './course-assistance.component.html',
  styleUrls: ['./course-assistance.component.scss']
})
export class CourseAssistanceComponent implements OnInit {
	user: any = this.session.getObject('user');
	student: any = this.session.getObject('student');
	INSTITUTION: string = '';
	STRM: string = '';
	CLASS_NBR: string = '';
	CRSE_NAME: string = '';
	DOCENTE: string = '';
	CLASS_SECTION: string = '';
	SSR_COMPONENT: string = '';
	assistances: Array<any>;

	notAssistance = 0;
	yesAssistance = 0;
	percentNotAssistance = 0;
	percentYesAssistance = 0;

	constructor(private realRoute: ActivatedRoute,
		private studentS: StudentService,
		private session: SessionService ) { 
		this.realRoute.paramMap.subscribe((query: any) => {
			var parts = decodeURIComponent(query.params.parts).split('|');
			this.INSTITUTION = parts[0];
			this.STRM = parts[1];
			this.CLASS_NBR = parts[2];
			this.CRSE_NAME = parts[3];
			this.DOCENTE = parts[4];
			this.CLASS_SECTION = parts[5];
			this.SSR_COMPONENT = parts[6];
		});
	}

	ngOnInit() {
		this.studentS.getAssistanceHistory(this.INSTITUTION + "," + this.STRM  + "," + this.CLASS_NBR  + "," + this.user.codigoAlumno)
		.then(res => {
			console.log(res);
			this.assistances = res.UCS_REST_LSTALU_ASIS_RES && res.UCS_REST_LSTALU_ASIS_RES.UCS_REST_LSTALU_ASIS_COM?res.UCS_REST_LSTALU_ASIS_RES.UCS_REST_LSTALU_ASIS_COM: [];
			this.assistances.forEach(item => {
				if(item.ATTEND_PRESENT == 'Y') this.yesAssistance++;
				else this.notAssistance++;
			});
			this.percentYesAssistance = this.assistances.length && this.yesAssistance?Math.round(this.yesAssistance/this.assistances.length*10000)/100:0;
			this.percentNotAssistance = this.assistances.length && this.notAssistance?Math.round(this.notAssistance/this.assistances.length*10000)/100:0;
		})
	}

}
