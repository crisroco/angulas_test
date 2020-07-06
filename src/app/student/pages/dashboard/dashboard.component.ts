import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { DeviceDetectorService } from 'ngx-device-detector';
import { StudentService } from '../../../services/student.service';
import { SessionService } from '../../../services/session.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
	@ViewChild('SurveyModal') SurveyModal: any;
	user: any = this.session.getObject('user');
	student: any = {};
	academicData: any;

	constructor(private session: SessionService,
		private studentS: StudentService) { }

	ngOnInit() {
		this.SurveyModal.open();
		this.studentS.getDataStudent({email: this.user.email})
		.then(res => {
			this.student = res.UcsMetodoDatosPersRespuesta;
			this.session.setObject('student', this.student);
			// this.studentS.getPhoneStudent({code: this.user.codigoAlumno})
			// .then(res => { console.log(res); }, error => { });
		}, error => { });

		this.studentS.getAcademicDataStudent({code: this.user.codigoAlumno})
		.then(res => { 
			this.academicData = res.UcsMetodoDatosAcadRespuesta && res.UcsMetodoDatosAcadRespuesta.UcsMetodoDatosAcadRespuesta && res.UcsMetodoDatosAcadRespuesta.UcsMetodoDatosAcadRespuesta[0]?res.UcsMetodoDatosAcadRespuesta.UcsMetodoDatosAcadRespuesta[0]:null;
			if(this.academicData){
				this.studentS.getScheduleStudent({code: this.user.codigoAlumno, academicGrade: this.academicData.codigoGrado})
				.then(res => {
					console.log(res);
				}, error => { });
			}				
		}, error => { });
	}

}
