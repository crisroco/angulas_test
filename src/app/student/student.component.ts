import { Component, OnInit, ViewChild } from '@angular/core';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { FormBuilder, FormGroup, Validators, ValidationErrors } from '@angular/forms';
import { SessionService } from '../services/session.service';
import { Router } from '@angular/router';
import { NgxSmartModalService } from 'ngx-smart-modal';
import { IntentionService } from '../services/intention.service';
import { StudentService } from '../services/student.service';
import { Broadcaster } from '../services/broadcaster';
import { ValidationService } from '../services/validation.service';
import { InputsService } from '../services/inputs.service';
import { FormService } from '../services/form.service';
import { RealDate } from '../helpers/dates';
import { DynamicSort } from '../helpers/arrays';
import { ToastrService } from 'ngx-toastr';
import { AppSettings } from '../app.settings';

@Component({
  selector: 'app-student',
  templateUrl: './student.component.html',
  styleUrls: ['./student.component.scss'],
  animations: [
    trigger('openClose', [
      state('open', style({
        height: '*',
        'padding-bottom': '*',
        'padding-top': '*',
        'flex-wrap': 'nowrap',
        opacity: 1,
      })),
      state('closed', style({
        height: '0px',
        'padding-bottom': '0px',
        'padding-top': '0px',
        'flex-wrap': 'wrap',
        opacity: .5,
      })),
      transition('open => closed', [
        animate('.3s')
      ]),
      transition('closed => open', [
        animate('.3s')
      ]),
    ]),
  ]
})

export class StudentComponent implements OnInit {
	company = AppSettings.COMPANY;
	user: any = this.session.getObject('user');
	enrollmentStatus: any;
	enrollmentIntensiveStatus: any;
	typeLibraries: any = [
		{
			name: 'Sistema de Biblioteca',
			libraries: [
				{
					img: 'assets/img/biblioteca/biblioteca.jpg',
					url: 'https://biblioteca.cientifica.edu.pe/cgi-bin/koha/opac-main.pl?&userid={dni}&password={dni}&tokenucsur=q7v9hj8gp6gazkgyzx6vsm4&koha_login_context=opac',
					width: '100px',
					description: ''
				},
			],
			isOpen: true,
		},
		{
			name: 'Biblioteca Virtual',
			libraries: [],
			isOpen: true,
			subtypes: [
				{
					name: 'Multidisciplinaria',
					libraries: [
						{
							img: 'http://www.e-libro.com/Content/images/logo-dark@2x.png',
							url: 'https://elibro.net/es/lc/ucsur/inicio',
							width: '100px',
							description: ''
						},
						{
							img: 'https://upload.wikimedia.org/wikipedia/en/thumb/5/56/JSTOR_vector_logo.svg/1200px-JSTOR_vector_logo.svg.png',
							url: 'https://jstor.org',
							width: '80px',
							description: ''
						},
						{
							img: 'assets/img/biblioteca/ebsco.jpg',
							url: 'https://search.ebscohost.com/login.aspx?authtype=ip,uid&custid=s8884660&groupid=main&user=ucsuredu&password=ucs@2020',
							width: '100px',
							description: ''
						},
						{
							img: 'http://biblioteca.uoc.edu/sites/default/files/styles/public/Wiley%20Online%20Library_2.png',
							url: 'https://aplicaciones2.cientifica.edu.pe/biblioteca/databookw.php',
							width: '100px',
							description: 'user: UCSUR \n pass: UCSUR'
						},
						{
							img: 'https://hullunilibrary.files.wordpress.com/2017/05/sciencedirect1.png?w=630&h=630&crop=1',
							url: 'http://www.sciencedirect.com/',
							width: '90px',
							description: ''
						},
						{
							img: 'https://fahrenhouse.com/blog/wp-content/uploads/2019/03/scopus.jpg',
							url: 'http://www.scopus.com/',
							width: '150px',
							description: ''
						},
						{
							img: 'http://ardi.wipo.int/content/images/ardi_header_es.png',
							url: 'http://ardi.wipo.int/content/es/journals.php',
							width: '150px',
							description: ''
						}
					],
					isOpen: true,
				},
				{
					name: 'Ciencias de la Salud',
					libraries: [
						{
							img: 'assets/img/biblioteca/2-1.png',
							url: 'http://uptodate.cientifica.edu.pe/',
							width: '103px',
							description: ''
						},
						{
							img: 'assets/img/biblioteca/2-2.jpg',
							url: 'http://extranet.who.int/hinari/es/journals.php',
							width: '103px',
							description: ''
						}
					],
					isOpen: true,
				},
				{
					name: 'Ciencias Empresariales',
					libraries: [
						{
							img: 'assets/img/biblioteca/ADEX.jpg',
							url: 'https://aplicaciones2.cientifica.edu.pe/biblioteca/databook.php?XVMSF232343421=23XJX141413414324&bd=adex',
							width: '120px',
							description: ''
						},
					],
					isOpen: true,
				},
				{
					name: 'Ciencias Ambientales',
					libraries: [
						{
							img: 'https://www.architectureopenlibrary.com/img/logo.png',
							url: 'http://www.architectureopenlibrary.com/autologin/?userid=4027&salt=8d697804f7156dc79a512fb0fa80e6ad44b5fafd',
							width: '130px',
							description: ''
						},
						{
							img: 'https://www.cabi.org/gfx/cabidotorg/cabi-logo-narrow.svg',
							url: 'https://www.cabdirect.org/',
							width: '130px',
							description: ''
						},
						{
							img: 'assets/img/biblioteca/oare_header_es.png',
							url: 'http://oare.research4life.org/content/es/journals.php',
							width: '130px',
							description: ''
						},
						{
							img: 'assets/img/biblioteca/agora_header_es.png',
							url: 'http://agora-journals.fao.org/content/es/journals.php',
							width: '130px',
							description: ''
						}
					],
					isOpen: true,
				},
				{
					name: 'Ciencias Humanas',
					libraries: [
						{
							img: 'assets/img/biblioteca/5-1.jpg',
							url: 'http://goali.ilo.org/content/es/journals.php',
							width: '130px',
							description: ''
						},
					],
					isOpen: true,
				},
			]
		},
	];
	typeLinks: any = [
		{
			name: 'Documentos Pregrado',
			links: [
				{
					img: '',
					url: 'https://docs.cientifica.edu.pe/general_pdf/calendario-acad%C3%A9mico-PRGR-2020-2.pdf',
					description: 'CALENDARIO ACADÉMICO PREGRADO 2020-2'
				},
			],
			isOpen: true,
		},
		{
			name: 'Documentos CPE',
			links: [
				{
					img: '',
					url: 'https://docs.cientifica.edu.pe/general_pdf/calendario_CPE_2020-2_ATE.pdf',
					description: 'CALENDARIO ACADÉMICO 2020-2 CAMPUS ATE'
				},
				{
					img: '',
					url: 'https://docs.cientifica.edu.pe/general_pdf/calendario_CPE_2020-2_VILLA.pdf',
					description: 'CALENDARIO ACADÉMICO 2020-2 CAMPUS VILLA'
				},
			],
			isOpen: true,
		},
		{
			name: 'Manuales de Usuario',
			links: [
				{
					img: '',
					url: 'https://docs.cientifica.edu.pe/general_pdf/Manual-de-Usuario-Portal-Alumno-UCSUR.pptx',
					description: 'MANUAL DE USUARIO PORTAL ALUMNO – CIENTIFICA'
				},
			],
			isOpen: true,
		},
		{
			name: 'Bolsa de Trabajo',
			links: [
				{
					img: '',
					url: 'https://empleabilidad.cientifica.edu.pe/',
					description: 'EMPLEABILIDAD CIENTÍFICA'
				},
			],
			isOpen: true,
		},
	];
	realDate: any = RealDate();
	menus = false;
	noClosed: boolean = false;
	crossdata: any;
	loading: boolean = false;
	motives: Array<any>;
	courses: Array<any>;
	coursesIntensive: Array<any>;
	comment: string = '';
	enroll: any = null;
	enrollCycles: Array<any>;
	enroll_conditions: any;
	queueEnroll: any;
	personalDataForm: FormGroup;
	workinglDataForm: FormGroup;
	student: any;
	@ViewChild('IntensiveEnrollmentModal') IntensiveEnrollmentModal: any;
	@ViewChild('YesIntensiveEnrollmentModal') YesIntensiveEnrollmentModal: any;
	@ViewChild('ConfirmIntensiveEnrollmentModal') ConfirmIntensiveEnrollmentModal: any;

	@ViewChild('IntentionEnrollmentModal') IntentionEnrollmentModal: any;
	@ViewChild('NotIntentionEnrollmentModal') NotIntentionEnrollmentModal: any;
	@ViewChild('YesIntentionEnrollmentModal') YesIntentionEnrollmentModal: any;
	@ViewChild('FinalIntentionEnrollmentModal') FinalIntentionEnrollmentModal: any;
	@ViewChild('EnrollScheduleModal') EnrollScheduleModal: any;

	@ViewChild('UpdatePersonalDataModal') UpdatePersonalDataModal: any;
	@ViewChild('UpdateWorkingDataModal') UpdateWorkingDataModal: any;
	@ViewChild('humanityModal') humanityModal: any;

	constructor( private formBuilder: FormBuilder,
		private session: SessionService,
		private router: Router,
		private intentionS: IntentionService,
		private studentS: StudentService,
    	private broadcaster: Broadcaster,
    	private toastr: ToastrService,
		public inputsS: InputsService,
		private formS: FormService,
		public ngxSmartModalService: NgxSmartModalService) { }

	ngOnInit() {
		if(!this.user){
			this.router.navigate(['/login']);
		}
		else{
			this.getParameters();
		}
		this.initUpdatePersonalData();
		this.checkInList();
		this.crossdata = this.broadcaster.getMessage().subscribe(message => {
			if (message && message.intentionModal && message.intentionModal == '2') {
				this.IntentionEnrollmentModal.open();
				this.getParameters(false);
			}
			else if(message && message.openEnroll && message.openEnroll == 'Y'){
				this.getParameters(false);
			}
			else if (message && message.intensiveModal && message.intensiveModal == '2') {
				this.enrollmentIntensiveStatus = message.intensiveData;
				// if(this.enrollmentIntensiveStatus.authorizacion && this.enrollmentIntensiveStatus.authorizacion.ended_process != 'SI') this.IntensiveEnrollmentModal.open();
			}
			else if(message && message.enroll){
				this.enroll = message.enroll;
			}
			else if(message && message.getEnroll && message.getEnroll == 'Y'){
				this.getQueueEnroll();
			}
	    });
	}

	initUpdatePersonalData(){
		this.personalDataForm = this.formBuilder.group({
			emplid: [this.user.codigoAlumno, Validators.required],
			email: ['', ValidationService.emailValidator],
			phone: ['', [Validators.required, Validators.pattern("(9)[0-9]{8}")]],
			birth_date: ['', Validators.required],
			department: ['Lima', Validators.required],
			province: ['', Validators.required],
			district: ['', Validators.required],
			who_finances: ['', Validators.required],
			working: ['', Validators.required],
			privacy_policy: ['', ValidationService.booleanValidator],
		});
		this.workinglDataForm = this.formBuilder.group({
			emplid: [this.user.codigoAlumno, Validators.required],
			company_email: ['', ValidationService.emailValidator],
			company_name: ['', Validators.required],
			company_position: ['', Validators.required],
		});
		// this.getPersonalData();

	}

	getPersonalData(){
		this.studentS.getPersonalData(this.user.codigoAlumno)
		.then(res => {
			// if(!res.data){
			// 	this.UpdatePersonalDataModal.open();
			// }
			this.setClient(res.data);
		});
	}

	openPersonalDataModal(){
		this.getPersonalData();
		this.UpdatePersonalDataModal.open();
	}

	setClient(data){
		this.personalDataForm.controls['email'].setValue(data.email?data.email:'');
		this.personalDataForm.controls['phone'].setValue(data.phone?data.phone:'');
		this.personalDataForm.controls['birth_date'].setValue(data.birth_date?data.birth_date.split(' ')[0]:'');
		this.personalDataForm.controls['province'].setValue(data.province?data.province:'');
		this.personalDataForm.controls['district'].setValue(data.district?data.district:'');
		this.personalDataForm.controls['who_finances'].setValue(data.who_finances?data.who_finances:'');
		this.personalDataForm.controls['working'].setValue(data.working?data.working:'');
		this.personalDataForm.controls['privacy_policy'].setValue(data.privacy_policy?data.privacy_policy:'');
		this.workinglDataForm.controls['company_email'].setValue(data.company_email?data.company_email:'');
		this.workinglDataForm.controls['company_name'].setValue(data.company_name?data.company_name:'');
		this.workinglDataForm.controls['company_position'].setValue(data.company_position?data.company_position:'');
  	}

	savePersonalData(){
		if(this.personalDataForm.invalid){
			let data = this.personalDataForm.value;
			this.formS.controlErrors(this.personalDataForm);
			return;
		}
		let data = this.personalDataForm.value;
		data.birth_date_u = (new Date(data.birth_date)).getTime();
		if(data.working != 'SI'){
			data.company_email = ' ';
			data.company_name = ' ';
			data.company_position = ' ';
		}
		this.studentS.savePersonalData(data)
		.then(res => {
			this.UpdatePersonalDataModal.close();
			if(data.working == 'SI') this.UpdateWorkingDataModal.open();
			else this.FinalIntentionEnrollmentModal.open();
		});
	}

	openHumanityModal(){
		this.humanityModal.open();
	}

	saveWorkingData(){
		if(this.workinglDataForm.invalid){
			let data = this.workinglDataForm.value;
			this.formS.controlErrors(this.workinglDataForm);
			return;
		}
		let data = this.workinglDataForm.value;
		this.studentS.savePersonalData(data)
		.then(res => {
			this.UpdateWorkingDataModal.close();
			this.FinalIntentionEnrollmentModal.open();
		});
	}

	getParameters(open: boolean = true){
		var rDate = this.realDate.year + '-' + this.realDate.month + '-' + this.realDate.day;
		this.intentionS.getParameters(this.user.codigoAlumno)
		.then(res => {
			this.enrollmentStatus = res.data && res.data?res.data:[];
			this.enrollmentStatus.forEach((item) => {
				if(item && item.enrollment_intention_status == 'A' && item.authorizacion && item.type == 'PM' && item.authorizacion.ended_process == 'NO'){
					if(open) this.openIntentionEnrollment();
					this.noClosed = rDate > item.end_date || rDate < item.start_date?true:false;
				}
				if(item && item.enrollment_intention_status == 'A' && item.type == 'M'){
					this.broadcaster.sendMessage({ enrollTab: 'Y' });
				}
			});
		})
	}

	getEnrollSchedule(){
		this.enrollCycles = null;
		this.EnrollScheduleModal.open();
		this.studentS.getEnrollSchedule(this.enroll.OPRID + '/' + this.enroll.INSTITUTION + '/' + this.enroll.ACAD_CAREER + '/' + this.enroll.ACAD_PROG + '/' + this.enroll.codigoPlan + '/' + this.enroll.EMPLID + '/' + this.enroll.STRM)
		.then(res => {
			let allData: Array<any> = res.UCS_REST_HORARIO_RES && res.UCS_REST_HORARIO_RES.UCS_REST_HORARIO_COM?res.UCS_REST_HORARIO_RES.UCS_REST_HORARIO_COM:[];
			var objCycles = {};
			allData.forEach( (item)  => {
				if(!objCycles[item.UCS_CICLO]){
					objCycles[item.UCS_CICLO] = {
						name: item.UCS_CICLO,
						isOpen: true,
						courses: {}
					}
				}
				if(!objCycles[item.UCS_CICLO].courses[item.DESCR]){
					objCycles[item.UCS_CICLO].courses[item.DESCR] = {
						name: item.DESCR,
						isOpen: true,
						type: item.UCS_OBLIGATORIEDAD,
						schedule: []
					}
				}
				objCycles[item.UCS_CICLO].courses[item.DESCR].schedule.push(item);
			});
			this.enrollCycles = [];
			for(var kcycle in objCycles){
				var courses = [];
				for(var kcourse in objCycles[kcycle].courses){
					courses.push(objCycles[kcycle].courses[kcourse]);
				}
				objCycles[kcycle].courses = courses;
				if(kcycle > '0'){
					this.enrollCycles.push(objCycles[kcycle]);
				}
			}
			objCycles[0].name = 'Electivo';
			this.enrollCycles.push(objCycles[0]);
		});
	}

	sendEnroll(){
		this.broadcaster.sendMessage({enroll: this.enroll});
		this.broadcaster.sendMessage({enroll_conditions: this.enroll_conditions});
		this.broadcaster.sendMessage({queueEnroll: this.queueEnroll});
		this.broadcaster.sendMessage({initSocket: 'Y'});
	}

	sendDataStudent(inst){
		var rDate = this.realDate.year + '-' + this.realDate.month + '-' + this.realDate.day;
		this.broadcaster.sendMessage({code: this.user.codigoAlumno, institution: inst.institucion, date: rDate});
	}

	checkInList(){
		this.student = this.session.getObject('student');
		this.studentS.getAcademicDataStudent({code: this.user.codigoAlumno})
			.then((res) => {
				var units:Array<any> = res && res.UcsMetodoDatosAcadRespuesta && res.UcsMetodoDatosAcadRespuesta.UcsMetodoDatosAcadRespuesta? res.UcsMetodoDatosAcadRespuesta.UcsMetodoDatosAcadRespuesta:[];
				var one = units.filter(item => item.institucion == 'PREGR');
				var inst = one.length?one[0]:null;
				this.sendDataStudent(inst);
			});
	}

	getQueueEnroll(){
		if(this.enroll && this.enroll_conditions && this.queueEnroll){
			this.sendEnroll();
		}
		else{
			this.student = this.session.getObject('student');
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
					this.enroll.EMPLID = this.student.codigoAlumno;
					this.studentS.getSTRM(this.enroll)
					.then(res => {
						this.enroll.STRM = res.UCS_OBT_STRM_RES && res.UCS_OBT_STRM_RES.STRM?res.UCS_OBT_STRM_RES.STRM:this.enroll.STRM;
						this.broadcaster.sendMessage({enroll: this.enroll});
						this.studentS.getCompleteConditions(this.enroll)
						.then(res => {
							this.enroll_conditions = res.UCS_REST_RES_COND_ACAD && res.UCS_REST_RES_COND_ACAD.UCS_REST_COM_COND_ACAD && res.UCS_REST_RES_COND_ACAD.UCS_REST_COM_COND_ACAD[0]?res.UCS_REST_RES_COND_ACAD.UCS_REST_COM_COND_ACAD[0]:null;
							this.broadcaster.sendMessage({enroll_conditions: this.enroll_conditions});
						});
						this.studentS.getEnrollQueueNumber(this.enroll)
						.then(res => {
							this.queueEnroll = res.UCS_GRUPO_MAT_RES;
							var parts = this.queueEnroll.fecha_ing.split('/');
							var enrollDate = RealDate(this.getDates(parts[2] + '-' + parts[1] + '-' + parts[0], this.queueEnroll.hora_ing + ':00'));
							this.queueEnroll.date = enrollDate;
							this.broadcaster.sendMessage({queueEnroll: this.queueEnroll});
							this.broadcaster.sendMessage({initSocket: 'Y'});
						});
					});
				}
			}, error => { });
		}
	}

	openIntentionEnrollment(){
		this.IntentionEnrollmentModal.open();
	}

	toggle(obj) {
		obj.isOpen = !obj.isOpen;
	}

	logout(){
		this.session.allCLear();
		this.router.navigate(['/login']);
	}

	getMotives(){
		this.loading = true;
		this.intentionS.getMotives(this.user.codigoAlumno)
		.then(res => {
			this.loading = false;
			this.motives = res.data && res.data.motives? res.data.motives:[];
			var selecteds = res.data && res.data.selected?res.data.selected:[];
			this.motives.forEach(item => {
				item.value = selecteds.filter(sele => sele.MOTIVO_COD == item.MOTIVO_COD).length?true:'';
			});
		});
	}

	getDates(rDay: string, MEETING_TIME_START: string) {
		let start: Date;
		const ua = navigator.userAgent.toLowerCase();
		if (ua.indexOf('safari') !== -1) {
			if (ua.indexOf('chrome') > -1) {
				start = new Date(rDay + 'T' + MEETING_TIME_START);
			} else {
				start = new Date(this.getDay(rDay, this.getHour(MEETING_TIME_START)));
			}
		} else {
			start = new Date(rDay + 'T' + MEETING_TIME_START);
		}

		return start;
	}

	getHour(pHour: string): string {

		const arrHour = pHour.split(':');
		let hour =  Number(arrHour[0]);
		hour += 5;
		const hourModified = this.pad(hour, 2);
		const minute =  arrHour[1];
		const second =  arrHour[2];

		return `${hourModified}:${minute}:${second}`;
	}

	getDay(pDay: string, pHour: string): string {

		let rDate = `${pDay}T${pHour}`;

		const arrHour = pHour.split(':');
		let hour =  Number(arrHour[0]);
		if (hour > 23) {

			const arrDate = pDay.split('-'); // 2020-07-06

			let day =  Number(arrDate[2]);
			day += 1;

			const dayModified = this.pad(day, 2);
			const month =  arrDate[1];
			const year =  arrDate[0];

			const vDate = `${year}-${month}-${dayModified}`;

			hour -= 24;
			const hourModified = this.pad(hour, 2);
			const minute =  arrHour[1];
			const second =  arrHour[2];

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

	getCourses(){
		this.loading = true;
		this.intentionS.getCourses(this.user.codigoAlumno)
		.then(res => {
			this.loading = false;
			this.courses = res.data? res.data:[];
			this.courses.forEach(item => {
				item.value = item.MATRICULA && item.MATRICULA =='SI'?true:'';
				this.comment = item.COMENTARIO?item.COMENTARIO:'';
			});
			this.courses.sort(DynamicSort('CRSE_DESC'))
		});
	}

	getCoursesIntensive(){
		this.loading = true;
		this.intentionS.getCoursesIntensive(this.user.codigoAlumno)
		.then(res => {
			this.loading = false;
			this.coursesIntensive = res.data? res.data:[];
			var objCourseIntensive = {};
			this.coursesIntensive.forEach((item, idx) => {
				item.value = item.MATRICULA && item.MATRICULA =='SI'?true:'';
				this.comment = item.COMENTARIO?item.COMENTARIO:'';
				if(objCourseIntensive[item.CRSE_ID2]) this.coursesIntensive.splice(idx, 1);
				else objCourseIntensive[item.CRSE_ID2] = true;
			});
			this.coursesIntensive.sort(DynamicSort('CRSE_DESC'))
		});
	}

	openNotModal(){
		this.getMotives();
		this.IntentionEnrollmentModal.close();
		this.NotIntentionEnrollmentModal.open();
	}

	openYesMofal(){
		this.getCourses();
		this.IntentionEnrollmentModal.close();
		this.YesIntentionEnrollmentModal.open();
	}

	saveYesIntention(){
		var courses = this.courses.filter(item => item.value);
		if(courses.length){
			this.loading = true;
			this.intentionS.saveYesIntention({emplid: this.user.codigoAlumno, courses: this.courses, comment: this.comment})
			.then(res => {
				if(res && res.status){
					this.toastr.success('Se grabó exitosamente.');
					this.YesIntentionEnrollmentModal.close();
					this.FinalIntentionEnrollmentModal.open();
				}
				else{
					this.toastr.error('Error! Inténtelo nuevamente.');
				}
				this.loading = false;
			});
		}
		else{
			this.toastr.error('Debes seleccionar al menos un curso');
		}
	}

	saveNotIntention(){
		var motives = this.motives.filter(item => item.value);
		if(motives.length){
			this.loading = true;
			this.intentionS.saveNotIntention({emplid: this.user.codigoAlumno, motives: motives})
			.then(res => {
				if(res && res.status){
					this.toastr.success('Se grabó exitosamente.');
					this.NotIntentionEnrollmentModal.close();
					this.FinalIntentionEnrollmentModal.open();
				}
				else{
					this.toastr.error('Error! Inténtelo nuevamente.');
				}
				this.loading = false;
			});
		}
		else{
			this.toastr.error('Debes seleccionar al menos un motivo');
		}
	}
	openIntensiveModal(){
		if(this.enrollmentIntensiveStatus.authorizacion && this.enrollmentIntensiveStatus.authorizacion.ended_process != 'SI') this.IntensiveEnrollmentModal.open();
		else this.openYesIntensiveMofal();
	}

	changeCourseIntensive(course){
		this.coursesIntensive.forEach((item) => {
			item.value = '';
		});
		course.value = true;
	}

	openYesIntensiveMofal(){
		this.getCoursesIntensive();
		this.YesIntensiveEnrollmentModal.open();
		this.IntensiveEnrollmentModal.close();
	}

	openNotIntensiveModal(){
		this.IntensiveEnrollmentModal.close();
	}

	confirmIntensive(){
		var courseIntensive = this.coursesIntensive.filter(item => item.value);
		if(!courseIntensive.length){
			this.toastr.error('Elige al menos un curso');
			return;
		}
		this.ConfirmIntensiveEnrollmentModal.open();
	}

	saveYesIntensive(){
		var courseIntensive = this.coursesIntensive.filter(item => item.value);
		if(courseIntensive.length){
			this.loading = true;
			this.intentionS.saveYesIntensive(courseIntensive[0])
			.then(res =>{
				if(res.status){
					this.toastr.success('Solicitud Registrada - Condicionada a Pago', '', {closeButton:true, progressBar:true});
					this.ConfirmIntensiveEnrollmentModal.close();
					this.enrollmentIntensiveStatus.authorizacion.ended_process = 'SI';
					this.YesIntensiveEnrollmentModal.close();
					// this.enrollmentIntensiveStatus = null;
				}
				else{
					this.toastr.error(res.message);
				}
				this.loading = false;
			}, error => { this.loading = false; })
		}
	}

}
