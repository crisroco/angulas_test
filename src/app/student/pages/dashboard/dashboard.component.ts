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
import { AssistanceService } from '../../../services/assistance.service';
import { NewEnrollmentService } from '../../../services/newenrollment.service';
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
	@ViewChild('ModdleLinkModal2') ModdleLinkModal2: any;
	@ViewChild('aficheModal') aficheModal: any;
	@ViewChild('medicineModal') medicineModal: any;
	@ViewChild('postModal') postModal: any;
	@ViewChild('preModal') preModal: any;
	company = AppSettings.COMPANY;
	user: any = this.session.getObject('user');
	student: any = {};
	academicData: any;
	enrollmentStatus: any;
	loading: boolean = false;
	realDate: any = RealDate();
	noClosed: boolean;
	enroll: any;
	enroll_conditions: any = '';
	queueEnroll: any;
	showwsp: boolean = false;
	fidelityLink: any = '';
	imagesAcadConditions = new Array(29);
	imagesFinaConditions = new Array(25);
	realHourStart;
	realHourEnd;
	timeoutEnroll: boolean = false;
	crossdata: any;
	notifications: Array<any>;
	btnEnroll: boolean = false;
	currentNextClass: any = {
		limit: 0
	};
	offsetHour = 1000 * 60 * 10;
	nextClassLink: any;
	realProgram;
	showEnrollment: boolean = false;
	showTurn: boolean = false;
	realDevice = this.deviceS.getDeviceInfo();
	constructor(private formBuilder: FormBuilder,
		private session: SessionService,
		private studentS: StudentService,
		public inputsS: InputsService,
		private formS: FormService,
		private assistanceS: AssistanceService,
		private broadcaster: Broadcaster,
		private router: Router,
		private deviceS: DeviceDetectorService,
		public generalS: GeneralService,
		private toastr: ToastrService,
		public newEnrollmentS: NewEnrollmentService,
		public ngxSmartModalService: NgxSmartModalService,
		private intentionS: IntentionService) { }

	ngOnInit() {

		this.studentS.getListOfStudentsJson()
			.then((res) => {
				if (res.find(emp => emp == this.user.codigoAlumno)) {
					this.showTurn = true;
				}
			});

		this.studentS.getDataStudent({ email: this.user.email })
			.then(res => {
				this.student = res.UcsMetodoDatosPersRespuesta;
				this.session.setObject('student', this.student);
				this.getParameters();
				this.getNotifications();

			}, error => { });


		this.studentS.getAcademicDataStudent({ code: this.user.codigoAlumno })
			.then(res => {
				var units: Array<any> = res && res.UcsMetodoDatosAcadRespuesta && res.UcsMetodoDatosAcadRespuesta.UcsMetodoDatosAcadRespuesta ? res.UcsMetodoDatosAcadRespuesta.UcsMetodoDatosAcadRespuesta : [];
				this.enroll = units.filter(item => item.institucion == 'PREGR');
				this.enroll = this.enroll.length ? this.enroll[0] : null;
				if (this.enroll) {
					this.enroll.OPRID = this.user.email;
					this.enroll.INSTITUTION = this.enroll.institucion;
					this.enroll.ACAD_CAREER = this.enroll.codigoGrado;
					this.enroll.STRM = this.enroll.cicloAdmision;
					this.enroll.ACAD_PROG = this.enroll.codigoPrograma;
					this.enroll.EMPLID = this.user.codigoAlumno;
				}
			});
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
					this.studentS.getAllClasses({ code: message.code, institution: message.institution, date: message.date })
						.then((res) => {
							this.nextClass(res.RES_HR_CLS_ALU_VIR.DES_HR_CLS_ALU_VIR);
						});
				}
			}
		});
		var ese = new Array(4);
	}

	getParameters(open: boolean = true) {
		var rDate = this.realDate.year + '-' + this.realDate.month + '-' + this.realDate.day;
		this.intentionS.getParameters(this.user.codigoAlumno)
			.then(res => {
				this.enrollmentStatus = res.data && res.data ? res.data : [];
				this.enrollmentStatus.forEach((item) => {
					if (item && item.enrollment_intention_status == 'A' && item.authorizacion && item.type == 'PM' && item.authorizacion.ended_process == 'NO') {
						if (open) this.broadcaster.sendMessage({ intentionModal: 2 });
						this.noClosed = rDate > item.end_date || rDate < item.start_date ? true : false;
					}
					if (item && item.enrollment_intention_status == 'A' && item.type == 'M') {
						this.broadcaster.sendMessage({ getEnroll: 'Y' });
						this.btnEnroll = true;
					}
					if (item && item.enrollment_intention_status == 'A' && item.authorizacion && item.type == 'MI' && this.user.ind_deuda == 'N') {
						if (open) this.broadcaster.sendMessage({ intensiveModal: 2, intensiveData: item });
					}
					if (item && item.enrollment_intention_status == 'A' && item.type == 'NM') {
						this.broadcaster.sendMessage({ getEnroll: 'Y' });
						this.btnEnroll = true;
					}
				})
				// this.broadcaster.sendMessage({ getEnroll: 'Y' });
				// this.btnEnroll = true;
			})
	}

	getNotifications() {
		this.studentS.getAdStudent(this.user.codigoAlumno)
			.then(res => {
				this.notifications = res;
				setTimeout(() => {
					this.notifications.forEach((item, idx) => {
						this.ngxSmartModalService.open('NotificationModal' + idx);
					});
				}, 500);
			}, error => { });
	}

	setRealDateEnroll() {
		this.realDate = RealDate();
		if (this.realDate.timeseconds >= this.queueEnroll.date.timeseconds) this.timeoutEnroll = false;
		setTimeout(() => {
			if (this.timeoutEnroll) {
				this.setRealDateEnroll();
			}
		}, 5000);
	}

	saveAcademicCondition() {
		var tEnroll = JSON.parse(JSON.stringify(this.enroll));
		this.loading = true;
		tEnroll.FLAG = 'Y';
		this.studentS.saveAcademicCondition(tEnroll)
			.then(res => {
				this.loading = false;
				this.enroll_conditions.FLAG_ACADEMICO = res.UCS_GRAB_RES_COND_ACAD && res.UCS_GRAB_RES_COND_ACAD.UCS_GRAB_COM_COND_ACAD && res.UCS_GRAB_RES_COND_ACAD.UCS_GRAB_COM_COND_ACAD[0].FLAG_ACADEMICO == 'G' ? 'Y' : this.enroll_conditions.FLAG_ACADEMICO;
				if (this.enroll_conditions.FLAG_ACADEMICO == 'Y') this.AcademicConditionModal.close();
			}, error => { this.loading = false; });
	}

	saveFinancialCondition() {
		var tEnroll = JSON.parse(JSON.stringify(this.enroll));
		this.loading = true;
		tEnroll.FLAG = 'Y';
		this.studentS.saveFinancialCondition(tEnroll)
			.then(res => {
				this.loading = false;
				this.enroll_conditions.FLAG_FINANCIERO = res.UCS_GRAB_RES_COND_ACAD && res.UCS_GRAB_RES_COND_ACAD.UCS_GRAB_COM_COND_ACAD && res.UCS_GRAB_RES_COND_ACAD.UCS_GRAB_COM_COND_ACAD[0].FLAG_ACADEMICO == 'G' ? 'Y' : this.enroll_conditions.FLAG_ACADEMICO;
				if (this.enroll_conditions.FLAG_FINANCIERO == 'Y') this.FinancialConditionModal.close();
			}, error => { this.loading = false; });
	}

	enrollPeople() {
		if (this.user.ind_deuda != 'N') {
			this.toastr.error('Por favor, regularice su deuda, contactarse con Finanzas.');
			return;
		}
		if (this.enroll_conditions.FLAG_ACADEMICO == 'N' || this.enroll_conditions.FLAG_FINANCIERO == 'N') {
			this.toastr.error('Si no aceptas las condiciones académicas y financieras, no te permitirá ingresar a la opción de Matrícula.');
			return;
		}

		if (this.queueEnroll.ind_grupo == 'N') {
			this.toastr.error('Aún no tienes Turno de Matricula.');
			return;
		}
		this.realDate = RealDate();
		if (this.realDate.timeseconds >= this.queueEnroll.date.timeseconds) { window.open('/estudiante/accion/matricula', '_self'); } //this.router.navigate(['/estudiante/accion/matricula']);
		else { this.toastr.error(this.queueEnroll.mensaje, '', { enableHtml: true }) };
	}

	ngOnDestroy() {
		console.log('eliminado');
		this.crossdata.unsubscribe();
	}

	nextClass(arrClass) {
		var dt = new Date();
		var secs = dt.getSeconds() + (60 * dt.getMinutes()) + (60 * 60 * dt.getHours());
		if (arrClass) {
			for (let i = 0; i < arrClass.length; i++) {
				let actualC = arrClass[i];
				var hour = actualC['MEETING_TIME_START'].split(':')[0] * 60 * 60;
				var minute = actualC['MEETING_TIME_START'].split(':')[1] * 60;
				var total = hour + minute;
				var hour2 = actualC['MEETING_TIME_END'].split(':')[0] * 60 * 60;
				var minute2 = actualC['MEETING_TIME_END'].split(':')[1] * 60;
				var total2 = hour2 + minute2;
				if (total - 600 < secs && secs < total2 - 600) {
					this.currentNextClass = actualC;
					this.getLink(actualC);
				}
			}
		}
	}

	checkAssist() {
		window.open(this.nextClassLink, '_blank');
	}

	preGoMoodle() {
		var realClass = JSON.parse(JSON.stringify(this.currentNextClass));
		realClass.CLASS_ATTEND_DT = realClass.FECH_INI;
		let dates = this.getDates(realClass.FECH_INI, realClass.MEETING_TIME_START, realClass.MEETING_TIME_END);
		this.realHourStart = RealDate(dates.start);
		this.realHourEnd = RealDate(dates.end);
		let tclassNbr = 0;
		this.assistanceS.getAllClassNbrByCourse({
			STRM: realClass.STRM,
			EMPLID: this.student.codigoAlumno,
			CLASS_ATTEND_DT: realClass.CLASS_ATTEND_DT,
			CLASS_NBR: realClass.CLASS_NBR
		}).then((res) => {
			var realDate = this.realDate.year + '-' + this.realDate.month + '-' + this.realDate.day;
			var realHourStart = this.realHourStart.year + '-' + this.realHourStart.month + '-' + this.realHourStart.day;
			let clases = res['RES_INST_CRSE_MAT_NBR']['COM_INST_CRSE_MAT_NBR'];
			if (clases) {
				for (let i = 0; i < clases.length; i++) {
					let sending = 0;
					let data3 = {
						INSTITUTION: clases[i]['INSTITUTION'],
						ACAD_CAREER: clases[i]['ACAD_CAREER'],
						CLASS_ATTEND_DT: realClass.FECH_INI,
						STRM: realClass.STRM,
						CRSE_ID: clases[i]['CRSE_ID'],
						CLASS_NBR: clases[i]['CLASS_NBR'],
						CLASS_MTG_NBR: clases[i]['CLASS_MTG_NBR'],
						EMPLID: this.student.codigoAlumno,
						ATTEND_TMPLT_NBR: '0',
						ATTEND_PRESENT: 'Y',
						ATTEND_LEFT_EARLY: 'N',
						ATTEND_TARDY: 'N',
						ATTEND_REASON: "",
						platform: 'Moodle',
						STATUS: 'ER'
					};
					var difference = this.realHourStart.timeseconds - this.realDate.timeseconds;
					var difference2 = (this.realHourEnd.timesecond - this.realHourStart.timeseconds) / 2;
					var difference3 = this.realHourEnd.timeseconds - difference2 - this.realDate.timeseconds;
					if (Math.abs(difference) <= this.offsetHour || (difference3 <= difference2 && difference3 > 0) || (this.realHourStart.timeseconds < this.realDate.timeseconds && this.realDate.timeseconds < this.realHourEnd.timesecond)) {
						tclassNbr = clases[i];
						sending = 1;
						if (this.realHourStart.hour + ':' + this.realHourStart.minute == this.realDate.hour + ':' + this.realDate.minute) {
							realClass.STATUS = 'P';
						}
						else if (difference <= this.offsetHour && difference > 0) {
							realClass.ATTEND_LEFT_EARLY = 'Y';
							realClass.STATUS = 'E';
						}
						else if ((difference >= -this.offsetHour && difference < 0) || (difference3 <= difference2 && difference3 > 0)) {
							realClass.ATTEND_TARDY = 'Y';
							realClass.STATUS = 'L';
						}
						else {
							realClass.STATUS = 'ER';
							tclassNbr = 0;
							sending = 0;
						}
					} else {
						if (clases[i]['SESSION_CODE'] == 2) {
							if (tclassNbr) {
								var partTime = tclassNbr['MEETING_TIME_END'].split(':');
								var partMinute = parseInt(partTime[1]) + 10;
								var partHour = parseInt(partTime[0])
								if (partMinute >= 60) {
									partHour++;
									partMinute = partMinute % 60;
								} if (clases[i]['MEETING_TIME_START'] == tclassNbr['MEETING_TIME_END'] || (clases[i]['MEETING_TIME_START'] > tclassNbr['MEETING_TIME_END'] && clases[i]['MEETING_TIME_START'] <= partHour + ':' + partMinute)) {
									sending = 1;
									data3['STATUS'] = 'P';
								}
							}
						}
					}
					if (sending) {
						this.assistanceS.getAssistanceNBR(data3)
							.then(res => {
								this.assistanceS.saveAssistance(data3)
									.then(res => {
									});
							});
					}
				}
			}
			this.checkAssist();
		});
	}

	getLink(cls) {
		let d = new Date();
		var hour = cls.MEETING_TIME_START.split(':')[0];
		var minute = cls.MEETING_TIME_START.split(':')[1];
		d.setHours(hour);
		d.setMinutes(minute);
		d.setSeconds(0);
		let timeStamp = d.getTime().toString().slice(0, -3);
		this.studentS.getLinkZoom(cls['STRM'], cls['CLASS_NBR2'], Number(timeStamp), cls['DOCENTE'], cls['CLASS_SECTION'])
			.then((res) => {
				if (!res.includes('false')) {
					this.nextClassLink = res.replace(/<\/?[^>]+(>|$)/g, "");
				}
			});
	}

	goMoodle() {
		var emplid = this.student.codigoAlumno;
		var rdate = Math.floor(Date.now() / 1000);
		emplid = encodeURIComponent(CryptoJS.AES.encrypt(JSON.stringify(this.student.codigoAlumno + '//' + rdate), 'Educad123', { format: this.generalS.formatJsonCrypto }).toString());
		window.open('https://aulavirtualcpe.cientifica.edu.pe/local/wseducad/auth/sso.php?strm=9999&class=9999&emplid=' + emplid, '_self');
	}

	getDates(rDay: string, MEETING_TIME_START: string, MEETING_TIME_END: string) {
		let start: Date;
		let end: Date;
		const ua = navigator.userAgent.toLowerCase();
		if (ua.indexOf('safari') !== -1) {
			if (ua.indexOf('chrome') > -1) {
				start = new Date(rDay + 'T' + MEETING_TIME_START);
				end = new Date(rDay + 'T' + MEETING_TIME_END);
			} else {
				start = new Date(this.getDay(rDay, this.getHour(MEETING_TIME_START)));
				end = new Date(this.getDay(rDay, this.getHour(MEETING_TIME_END)));
			}
		} else {
			start = new Date(rDay + 'T' + MEETING_TIME_START);
			end = new Date(rDay + 'T' + MEETING_TIME_END);
		}

		return { start, end };
	}

	getHour(pHour: string): string {

		const arrHour = pHour.split(':');
		let hour = Number(arrHour[0]);
		hour += 5;
		const hourModified = this.pad(hour, 2);
		const minute = arrHour[1];
		const second = arrHour[2];

		return `${hourModified}:${minute}:${second}`;
	}

	getDay(pDay: string, pHour: string): string {

		let rDate = `${pDay}T${pHour}`;

		const arrHour = pHour.split(':');
		let hour = Number(arrHour[0]);
		if (hour > 23) {

			const arrDate = pDay.split('-'); // 2020-07-06

			let day = Number(arrDate[2]);
			day += 1;

			const dayModified = this.pad(day, 2);
			const month = arrDate[1];
			const year = arrDate[0];

			const vDate = `${year}-${month}-${dayModified}`;

			hour -= 24;
			const hourModified = this.pad(hour, 2);
			const minute = arrHour[1];
			const second = arrHour[2];

			const vHour = `${hourModified}:${minute}:${second}`;

			rDate = `${vDate}T${vHour}`;
		}
		return rDate;
	}

	pad(num: number, size: number): string {
		let s = num + '';
		while (s.length < size) { s = '0' + s; }
		return s;
	}

	goEnrollment() {
		let myFlags = this.enroll_conditions.FLAG_ACADEMICO == 'Y' && this.enroll_conditions.FLAG_FINANCIERO == 'Y';
		this.session.setObject('conditionsToEnrollment', { turn: this.realDate.timeseconds >= this.queueEnroll.date.timeseconds, conditions: myFlags });
		this.newEnrollmentS.getDebt({ EMPLID: this.user.codigoAlumno })
			.then((res) => {
				let notdeuda = res['UCS_WS_DEU_RSP']['UCS_WS_DEU_COM'][0]['DEUDA'] == 'N' ? true : false;
				if (notdeuda) {
					this.router.navigate(['/estudiante/matricula/disponibles']);
				} else {
					this.toastr.error('Tiene una deuda pendiente, por favor regularizar el pago.')
				}
			});
	}

}