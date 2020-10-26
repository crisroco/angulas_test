import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ValidationErrors } from '@angular/forms';
import { DeviceDetectorService } from 'ngx-device-detector';
import { NgxSmartModalService } from 'ngx-smart-modal';
import { StudentService } from '../../../services/student.service';
import { SessionService } from '../../../services/session.service';
import { ValidationService } from '../../../services/validation.service';
import { GeneralService } from '../../../services/general.service';
import { InputsService } from '../../../services/inputs.service';
import { FormService } from '../../../services/form.service';
import { Broadcaster } from '../../../services/broadcaster';
import { IntentionService } from '../../../services/intention.service';
import { AppSettings } from '../../../app.settings';
import { RealDate } from '../../../helpers/dates';
import { ToastrService } from 'ngx-toastr';
import * as CryptoJS from 'crypto-js';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
	@ViewChild('SurveyModal') SurveyModal: any;
	@ViewChild('SurveyModal2') SurveyModal2: any;
	@ViewChild('AcademicConditionModal') AcademicConditionModal: any;
	@ViewChild('FinancialConditionModal') FinancialConditionModal: any;
	@ViewChild('AnnouncementModal') AnnouncementModal: any;
	@ViewChild('HolidayModal') HolidayModal: any;
	@ViewChild('ModdleLinkModal') ModdleLinkModal: any;
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
	showwsp: boolean = false;
	fidelityLink: any = '';
	imagesAcadConditions = new Array(29);
	imagesFinaConditions = new Array(25);
	timeoutEnroll: boolean = false;
	crossdata: any;
	notifications: Array<any>;
	btnEnroll: boolean = false;
	currentNextClass:any = {
		limit : 0
	};
	nextClassLink:any;

	constructor( private formBuilder: FormBuilder,
		private session: SessionService,
		private studentS: StudentService,
		public inputsS: InputsService,
		private formS: FormService,
		private broadcaster: Broadcaster,
		private router: Router,
		public generalS:GeneralService,
    	private toastr: ToastrService,
    	public ngxSmartModalService: NgxSmartModalService,
		private intentionS: IntentionService) { }

	ngOnInit() {
		// this.SurveyModal.open();
		// this.SurveyModal2.open();
		this.AnnouncementModal.open();
		this.studentS.getDataStudent({email: this.user.email})
		.then(res => {
			this.student = res.UcsMetodoDatosPersRespuesta;
			this.session.setObject('student', this.student);
			this.getParameters();
			this.getNotifications();
		}, error => { });
		this.crossdata = this.broadcaster.getMessage().subscribe(message => {
			if (message && message.enroll_conditions) {
				this.enroll_conditions = message.enroll_conditions;
			}
			else if (message && message.queueEnroll) {
				this.timeoutEnroll = true;
				this.queueEnroll = message.queueEnroll;
				this.setRealDateEnroll();
			}
			else if (message && message.enroll) {
				this.enroll = message.enroll;
			}
			else if (message && message.code) {
				if (message.institution != 'PSTRG') {
					this.studentS.getAllClasses({code: message.code, institution: message.institution, date: message.date})
					.then((res) => {
						this.nextClass(res.RES_HR_CLS_ALU_VIR.DES_HR_CLS_ALU_VIR);
					});
				}
			}
	    });
		var ese = new Array(4);
	}

	getParameters(open: boolean = true){
		var rDate = this.realDate.year + '-' + this.realDate.month + '-' + this.realDate.day;
		this.intentionS.getParameters(this.user.codigoAlumno)
		.then(res => {
			this.enrollmentStatus = res.data && res.data?res.data:[];
			this.enrollmentStatus.forEach((item) => {
				if(item && item.enrollment_intention_status == 'A' && item.authorizacion && item.type == 'PM' && item.authorizacion.ended_process == 'NO'){
					if(open) this.broadcaster.sendMessage({ intentionModal: 2 });
					this.noClosed = rDate > item.end_date || rDate < item.start_date?true:false;
				}
				if(item && item.enrollment_intention_status == 'A' && item.type == 'M'){
					this.broadcaster.sendMessage({ getEnroll: 'Y' });
					this.btnEnroll = true;
				}
				if(item && item.enrollment_intention_status == 'A' && item.authorizacion && item.type == 'MI' && this.user.ind_deuda == 'N'){
					if(open) this.broadcaster.sendMessage({ intensiveModal: 2, intensiveData: item });
				}
			})
			// this.broadcaster.sendMessage({ getEnroll: 'Y' });
			// this.btnEnroll = true;
		})
		this.studentS.getFidelityLink(this.user.codigoAlumno)
			.then((res) => {
				if (res['data']) {
					this.fidelityLink = res['data']['link'];
				}
			});
	}

	getNotifications(){
		this.studentS.getAdStudent(this.user.codigoAlumno)
		.then( res => {
			this.notifications = res;
			setTimeout(() =>{
				this.notifications.forEach((item, idx) => {
					this.ngxSmartModalService.open('NotificationModal' + idx);
				});
			}, 500);
		}, error => { });
	}

	setRealDateEnroll(){
		this.realDate = RealDate();
		if(this.realDate.timeseconds >= this.queueEnroll.date.timeseconds) this.timeoutEnroll = false;
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

		if(this.queueEnroll.ind_grupo == 'N'){
			this.toastr.error('Aún no tienes Turno de Matricula.');
			return;
		}
		this.realDate = RealDate();
		if(this.realDate.timeseconds >= this.queueEnroll.date.timeseconds) {window.open('/estudiante/accion/matricula', '_self');} //this.router.navigate(['/estudiante/accion/matricula']);
		else {this.toastr.error(this.queueEnroll.mensaje, '', {enableHtml: true})};
	}

	ngOnDestroy(){
		console.log('eliminado');
		this.crossdata.unsubscribe();
	}

	nextClass(arrClass){
		var dt = new Date();
  		var secs = dt.getSeconds() + (60 * dt.getMinutes()) + (60 * 60 * dt.getHours());
  		if (arrClass) {
  			for (let i = 0; i < arrClass.length; i++) {
				let actualC = arrClass[i];
				var hour = actualC['MEETING_TIME_START'].split(':')[0]*60*60;
				var minute = actualC['MEETING_TIME_START'].split(':')[1]*60;
				var total = hour + minute;
				var hour2 = actualC['MEETING_TIME_END'].split(':')[0]*60*60;
				var minute2 = actualC['MEETING_TIME_END'].split(':')[1]*60;
				var total2 = hour2 + minute2;
				if (total-600 < secs && secs < total2 - 600) {
					this.currentNextClass = actualC;
					this.getLink(actualC);
				}
			}
  		}
	}

	getLink(cls){
		let d = new Date();
		var hour = cls.MEETING_TIME_START.split(':')[0];
		var minute = cls.MEETING_TIME_START.split(':')[1];
		d.setHours(hour);
		d.setMinutes(minute);
		d.setSeconds(0);
		let timeStamp = d.getTime().toString().slice(0, -3);
		this.studentS.getLinkZoom(cls['STRM'], cls['CLASS_NBR2'], Number(timeStamp))
			.then((res) => {
				this.nextClassLink = res.replace(/<\/?[^>]+(>|$)/g, "");
			});
	}

}
