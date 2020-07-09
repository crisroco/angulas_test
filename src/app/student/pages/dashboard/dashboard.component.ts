import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { DeviceDetectorService } from 'ngx-device-detector';
import { StudentService } from '../../../services/student.service';
import { SessionService } from '../../../services/session.service';
import { Broadcaster } from '../../../services/broadcaster';
import { IntentionService } from '../../../services/intention.service';
import { AppSettings } from '../../../app.settings';
import { RealDate } from '../../../helpers/dates';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
	@ViewChild('SurveyModal') SurveyModal: any;
	company = AppSettings.COMPANY;
	user: any = this.session.getObject('user');
	student: any = {};
	academicData: any;
	enrollmentStatus: any;
	loading: boolean = false;
	realDate: any = RealDate();
	noClosed: boolean;

	constructor(private session: SessionService,
		private studentS: StudentService,
		private crossData: Broadcaster,
		private intentionS: IntentionService) { }

	ngOnInit() {
		// this.SurveyModal.open();
		this.studentS.getDataStudent({email: this.user.email})
		.then(res => {
			this.student = res.UcsMetodoDatosPersRespuesta;
			this.session.setObject('student', this.student);
		}, error => { });
		// this.studentS.getAcademicDataStudent({code: this.user.codigoAlumno})
		// .then(res => { 
		// 	this.academicData = res.UcsMetodoDatosAcadRespuesta && res.UcsMetodoDatosAcadRespuesta.UcsMetodoDatosAcadRespuesta && res.UcsMetodoDatosAcadRespuesta.UcsMetodoDatosAcadRespuesta[0]?res.UcsMetodoDatosAcadRespuesta.UcsMetodoDatosAcadRespuesta[0]:null;
		// 	if(this.academicData){
		// 		this.studentS.getScheduleStudent({code: this.user.codigoAlumno, academicGrade: this.academicData.codigoGrado})
		// 		.then(res => {
		// 			console.log(res);
		// 		}, error => { });
		// 	}				
		// }, error => { });
		this.getParameters();
	}

	getParameters(open: boolean = true){
		var rDate = this.realDate.year + '-' + this.realDate.month + '-' + this.realDate.day;
		this.intentionS.getParameters(this.user.codigoAlumno)
		.then(res => {
			this.enrollmentStatus = res.data && res.data.enrollment_intention_status?res.data:{};
			if(this.enrollmentStatus && this.enrollmentStatus.enrollment_intention_status == 'A' && this.enrollmentStatus.authorizacion && this.enrollmentStatus.authorizacion.ended_process == 'NO'){
				if(open) this.crossData.sendMessage({ intentionModal: 2 });
				this.noClosed = rDate > this.enrollmentStatus.end_date || rDate < this.enrollmentStatus.start_date?true:false;
			}
		})
	}

}
