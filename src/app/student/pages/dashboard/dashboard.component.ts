import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { DeviceDetectorService } from 'ngx-device-detector';
import { NgxSmartModalService } from 'ngx-smart-modal';
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
	crossdata: any;
	notifications: Array<any>;

	constructor(private session: SessionService,
		private studentS: StudentService,
		private broadcaster: Broadcaster,
		private router: Router,
    	private toastr: ToastrService,
    	public ngxSmartModalService: NgxSmartModalService,
		private intentionS: IntentionService) { }

	ngOnInit() {
		this.SurveyModal.open();
		this.studentS.getDataStudent({email: this.user.email})
		.then(res => {
			this.student = res.UcsMetodoDatosPersRespuesta;
			this.session.setObject('student', this.student);
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
	    });
		this.getParameters();
		this.getNotifications();
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
				}
				if(item && item.enrollment_intention_status == 'A' && item.authorizacion && item.type == 'MI'){
					console.log('dsadas');
					if(open) this.broadcaster.sendMessage({ intensiveModal: 2, intensiveData: item });
				}
			})
				
		})
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
			console.log(this.notifications);
		}, error => { });
	}

	setRealDateEnroll(){
		this.realDate = RealDate();
		console.log('ejecuta');
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
		if(this.realDate.timeseconds >= this.queueEnroll.date.timeseconds) this.router.navigate(['/estudiante/accion/matricula']);//window.open(AppSettings.PEOPLE_LOGIN, '_blank');
		else this.toastr.error(this.queueEnroll.mensaje, '', {enableHtml: true});
	}

	ngOnDestroy(){
		console.log('eliminado');
		this.crossdata.unsubscribe();
	}

}
