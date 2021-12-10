import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { StudentService } from '../../../../services/student.service';
import { SessionService } from '../../../../services/session.service';
import { RealDate } from '../../../../helpers/dates';

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
	realDate = RealDate();
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
		this.studentS.getAssistanceHistory(this.INSTITUTION + "," + this.STRM  + "," + this.CLASS_NBR  + "," + (this.session.getItem('emplidSelected')?this.session.getItem('emplidSelected'):''))
		.then(res => {
			var timeNowSeconds = (Number(this.realDate.hour)*60*60) + (Number(this.realDate.minute)*60);
			this.assistances = res.UCS_REST_LSTALU_ASIS_RES && res.UCS_REST_LSTALU_ASIS_RES.UCS_REST_LSTALU_ASIS_COM?res.UCS_REST_LSTALU_ASIS_RES.UCS_REST_LSTALU_ASIS_COM: [];
			var rDate = this.realDate.year + '-' + this.realDate.month + '-' + this.realDate.day;
			this.assistances = this.assistances.filter(item => item.CLASS_ATTEND_DT <= rDate);
			this.assistances.forEach(item => {
				if (item.CLASS_ATTEND_DT == rDate && this.hourToSeconds(item.ATTEND_FROM_TIME) > timeNowSeconds) {
					item.notShow = true;
				}
				if (!item.notShow) {
					if(item.ATTEND_PRESENT == 'Y') this.yesAssistance++;
					else this.notAssistance++;
				}
			});
			this.percentYesAssistance = this.assistances.length && this.yesAssistance?Math.round(this.yesAssistance/this.assistances.filter(el => !el.notShow).length*100):0;
			this.percentNotAssistance = this.assistances.length && this.notAssistance?Math.round(this.notAssistance/this.assistances.filter(el => !el.notShow).length*100):0;
		})
	}

	hourToSeconds(time){
		return time.split(':')[0]*60*60 + time.split(':')[1]*60;
	}

}