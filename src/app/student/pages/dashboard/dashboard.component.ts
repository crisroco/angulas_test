import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { DeviceDetectorService } from 'ngx-device-detector';
import { StudentService } from '../../../services/student.service';
import { SessionService } from '../../../services/session.service';
import { Broadcaster } from '../../../services/broadcaster';
import { IntentionService } from '../../../services/intention.service';
import { AppSettings } from '../../../app.settings';
import { RealDate } from '../../../helpers/dates';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
	@ViewChild('SurveyModal') SurveyModal: any;
	@ViewChild('AcademicConditionModal') AcademicConditionModal: any;
	@ViewChild('FinancialConditionModal') FinancialConditionModal: any;
	company = AppSettings.COMPANY;
	user: any = this.session.getObject('user');
	student: any = {};
	academicData: any;
	enrollmentStatus: any;
	loading: boolean = false;
	realDate: any = RealDate();
	noClosed: boolean;
	enroll: any;
	enroll_conditions: any;
	queueEnroll: any;
	imagesAcadConditions = new Array(8);
	imagesFinaConditions = new Array(23);
	timeoutEnroll: boolean = false;

	constructor(private session: SessionService,
		private studentS: StudentService,
		private crossData: Broadcaster,
    	private toastr: ToastrService,
		private intentionS: IntentionService) { }

	ngOnInit() {
		// this.AcademicConditionModal.open();
		// this.FinancialConditionModal.open();
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
		var ese = new Array(4);
	}

	getParameters(open: boolean = true){
		var rDate = this.realDate.year + '-' + this.realDate.month + '-' + this.realDate.day;
		this.intentionS.getParameters(this.user.codigoAlumno)
		.then(res => {
			this.enrollmentStatus = res.data && res.data.enrollment_intention_status?res.data:{};
			if(this.enrollmentStatus && this.enrollmentStatus.enrollment_intention_status == 'A' && this.enrollmentStatus.authorizacion && this.enrollmentStatus.type == 'PM' && this.enrollmentStatus.authorizacion.ended_process == 'NO'){
				if(open) this.crossData.sendMessage({ intentionModal: 2 });
				this.noClosed = rDate > this.enrollmentStatus.end_date || rDate < this.enrollmentStatus.start_date?true:false;
			}

			if(this.enrollmentStatus && this.enrollmentStatus.enrollment_intention_status == 'A' && this.enrollmentStatus.type == 'M'){
				this.studentS.getAcademicDataStudent({code: this.user.codigoAlumno})
				.then(res => {
					var units:Array<any> = res && res.UcsMetodoDatosAcadRespuesta && res.UcsMetodoDatosAcadRespuesta.UcsMetodoDatosAcadRespuesta? res.UcsMetodoDatosAcadRespuesta.UcsMetodoDatosAcadRespuesta:[];
					this.enroll = units.filter(item => item.institucion == 'PREGR');
					this.enroll = this.enroll.length?this.enroll[0]:null;
					if(this.enroll){
						this.enroll.OPRID = this.user.email;
						this.enroll.INSTITUTION = this.enroll.institucion;
						this.enroll.ACAD_CAREER = this.enroll.codigoGrado;
						this.enroll.STRM = this.enroll.cicloAdmision;// == '0904'?'0992':'2204';
						this.enroll.ACAD_PROG = this.enroll.codigoPrograma;
						this.enroll.EMPLID = this.user.codigoAlumno;
						this.studentS.getSTRM(this.enroll)
						.then(res => {
							this.enroll.STRM = res.UCS_OBT_STRM_RES && res.UCS_OBT_STRM_RES.STRM?res.UCS_OBT_STRM_RES.STRM:this.enroll.STRM;
							this.crossData.sendMessage({ enroll: this.enroll });
							this.studentS.getCompleteConditions(this.enroll)
							.then(res => {
								this.enroll_conditions = res.UCS_REST_RES_COND_ACAD && res.UCS_REST_RES_COND_ACAD.UCS_REST_COM_COND_ACAD && res.UCS_REST_RES_COND_ACAD.UCS_REST_COM_COND_ACAD[0]?res.UCS_REST_RES_COND_ACAD.UCS_REST_COM_COND_ACAD[0]:null;
							});
							this.studentS.getEnrollQueueNumber(this.enroll)
							.then(res => {
								this.queueEnroll = res.UCS_GRUPO_MAT_RES;
								this.timeoutEnroll = true;
								var parts = this.queueEnroll.fecha_ing.split('/');
								var enrollDate = RealDate(new Date(parts[2] + '-' + parts[1] + '-' + parts[0] + ' ' + this.queueEnroll.hora_ing));
								this.queueEnroll.date = enrollDate;
							});
						});
					}
				}, error => { });
			}
		})
	}

	setRealDateEnroll(){
		this.realDate = RealDate();
		setTimeout(() => {
			if(this.timeoutEnroll){
				this.setRealDateEnroll();
			}
		}, 5000);
	}

	saveAcademicCondition(){
		var tEnroll = JSON.parse(JSON.stringify(this.enroll));
		this.loading = true;
		tEnroll.FLAG = 'Y';
		this.studentS.saveAcademicCondition(tEnroll)
		.then( res => {
			this.loading = false;
			this.enroll_conditions.FLAG_ACADEMICO = res.UCS_GRAB_RES_COND_ACAD && res.UCS_GRAB_RES_COND_ACAD.UCS_GRAB_COM_COND_ACAD && res.UCS_GRAB_RES_COND_ACAD.UCS_GRAB_COM_COND_ACAD[0].FLAG_ACADEMICO == 'G'?'Y':this.enroll_conditions.FLAG_ACADEMICO;
			if(this.enroll_conditions.FLAG_ACADEMICO == 'Y') this.AcademicConditionModal.close();
		}, error => { this.loading = false; });
	}

	saveFinancialCondition(){
		var tEnroll = JSON.parse(JSON.stringify(this.enroll));
		this.loading = true;
		tEnroll.FLAG = 'Y';
		this.studentS.saveFinancialCondition(tEnroll)
		.then( res => {
			this.loading = false;
			this.enroll_conditions.FLAG_FINANCIERO = res.UCS_GRAB_RES_COND_ACAD && res.UCS_GRAB_RES_COND_ACAD.UCS_GRAB_COM_COND_ACAD && res.UCS_GRAB_RES_COND_ACAD.UCS_GRAB_COM_COND_ACAD[0].FLAG_ACADEMICO == 'G'?'Y':this.enroll_conditions.FLAG_ACADEMICO;
			if(this.enroll_conditions.FLAG_FINANCIERO == 'Y') this.FinancialConditionModal.close();
		}, error => { this.loading = false; });
	}

	enrollPeople(){
		if(this.user.ind_deuda != 'N'){
			this.toastr.error('Por favor, regularice su deuda, contactarse con Finanzas.');
			return;
		}
		if(this.enroll_conditions.FLAG_ACADEMICO == 'N' || this.enroll_conditions.FLAG_FINANCIERO == 'N'){
			this.toastr.error('Si no aceptas las condiciones académicas y financieras, no te permitirá ingresar a la opción de Matrícula.');
			return;
		}
		this.loading = true;
		this.studentS.getEnrollQueueNumber(this.enroll)
		.then(res => {
			this.queueEnroll = res.UCS_GRUPO_MAT_RES;
			this.loading = false;
			if(this.queueEnroll.ind_grupo == 'N'){
				this.toastr.error('Aún no tienes Turno de Matricula.');
				return;
			}
			this.realDate = RealDate();
			var parts = this.queueEnroll.fecha_ing.split('/');
			var enrollDate = RealDate(new Date(parts[2] + '-' + parts[1] + '-' + parts[0] + ' ' + this.queueEnroll.hora_ing));
			this.queueEnroll.date = enrollDate;
			if(this.realDate.timeseconds >= this.queueEnroll.date.timeseconds) window.open(AppSettings.PEOPLE_LOGIN, '_blank');
			else this.toastr.error(this.queueEnroll.mensaje, '', {enableHtml: true});
		}, error => { this.loading = false; });
	}

}
