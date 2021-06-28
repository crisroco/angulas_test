import { Component, OnInit, ViewChild } from '@angular/core';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { FormBuilder, FormGroup, Validators, ValidationErrors } from '@angular/forms';
import { SessionService } from '../services/session.service';
import { Router, NavigationEnd } from '@angular/router';
import { NgxSmartModalService } from 'ngx-smart-modal';
import { IntentionService } from '../services/intention.service';
import { StudentService } from '../services/student.service';
import { Broadcaster } from '../services/broadcaster';
import { ValidationService } from '../services/validation.service';
import { InputsService } from '../services/inputs.service';
import { FormService } from '../services/form.service';
import { RealDate, AddDay } from '../helpers/dates';
import { DynamicSort } from '../helpers/arrays';
import { ToastrService } from 'ngx-toastr';
import { AppSettings } from '../app.settings';
import { WebsocketService } from '../services/websocket.service';
import { QueueService } from '../services/queue.service';
import { DeviceDetectorService } from 'ngx-device-detector';
import { NewEnrollmentService } from '../services/newenrollment.service';
import { HttpClient } from '@angular/common/http';
import { fi } from 'date-fns/locale';

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

	showCartilla = false;
	showDeclaracion = false;
	showExoneracion = false;
	botonCartilla = false;
	botonDeclaracion = false;
	botonExoneracion = false;
	botonCerrar = true;
	botonesvacuna = false;

	company = AppSettings.COMPANY;
	user: any = this.session.getObject('user');
	enrollmentStatus: any;
	enrollmentIntentionStatus: any;
	enrollmentIntensiveStatus: any;
	public innewEnrollment:boolean = false;
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
							img: 'https://docs.cientifica.edu.pe/biblioteca/imagenes/elibro%20(2).png',
							url: 'https://elibro.net/es/lc/ucsur/inicio',
							width: '100px',
							description: 'user: correo institucional \n pass: Código de usuario'
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
							img: 'https://docs.cientifica.edu.pe/biblioteca/imagenes/Wiley%20Online%20Library_2.png',
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
							img: 'https://docs.cientifica.edu.pe/biblioteca/imagenes/ardi.png',
							url: 'https://login.research4life.org/tacgw/login.cshtml',
							width: '150px',
							description: 'user: PER044 \n pass: NgSHXazQ'
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
							url: 'https://login.research4life.org/tacgw/login.cshtml',
							width: '103px',
							description: 'user: PER044 \n pass: NgSHXazQ'
						},
						{
							img: 'assets/img/biblioteca/2-4.png',
							url: 'https://www.nejm.org',
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
							url: 'https://login.research4life.org/tacgw/login.cshtml',
							width: '130px',
							description: 'user: PER044 \n pass: NgSHXazQ'
						},
						{
							img: 'assets/img/biblioteca/agora_header_es.png',
							url: 'https://login.research4life.org/tacgw/login.cshtml',
							width: '130px',
							description: 'user: PER044 \n pass: NgSHXazQ'
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
							description: 'user: PER044 \n pass: NgSHXazQ'
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
					url: 'assets/pdfjs/calendario_verano_2021.pdf',
					description: 'CALENDARIO PREGRADO VERANO 2021'
				},
				{
					img: '',
					url: 'assets/pdfjs/calendario_academico_pregrado.pdf',
					description: 'CALENDARIO ACADÉMICO 2021 - 1'
				},
				{
					img: '',
					url: 'assets/pdfjs/ROTACIONES_EXTERNADO_2021.pdf',
					description: 'ROTACIONES DE EXTERNADO DE MEDICINA HUMANA 2021 '
				}
			],
			isOpen: true,
		},
		{
			name: 'Documentos CPE',
			links: [
				{
					img: '',
					url: 'assets/pdfjs/calendario_verano_cpe_2021.pdf',
					description: 'CALENDARIO ACADÉMICO VERANO 2021'
				},
				{
					img: '',
					url: 'assets/pdfjs/calendario_academico_cpe_villa.pdf',
					description: 'CALENDARIO ACADÉMICO 2021 - 1'
				}
			],
			isOpen: true,
		},
		{
			name: 'Manuales de Usuario',
			links: [
				{
					img: '',
					url: 'assets/pdfjs/portal_alumno.pptx',
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
	showVacunation:boolean = false;
	loading: boolean = false;
	motives: Array<any>;
	courses: Array<any>;
	coursesIntensive: Array<any>;
	comment: string = '';
	enroll: any = null;
	enrollCycles: Array<any>;
	enroll_conditions: any = null;
	queueEnroll: any;
	idfile: any;
	datafile = [];
	flagSendUpload: boolean = true;
	showScheduleLink: boolean = false;
	personalDataForm: FormGroup;
	workinglDataForm: FormGroup;
	personalUpdateForm: FormGroup;
	student: any = {};
	notifications: any;
	notifications_read: number = 0;

	// Actualiza Datos
	dataEstudiante: any;
	departamentos: Array<any>;
	provincias: Array<any>;
	distritos: Array<any>;
	modalUpdateDataClosable = true

	@ViewChild('IntensiveEnrollmentModal') IntensiveEnrollmentModal: any;
	@ViewChild('YesIntensiveEnrollmentModal') YesIntensiveEnrollmentModal: any;
	@ViewChild('ConfirmIntensiveEnrollmentModal') ConfirmIntensiveEnrollmentModal: any;
	@ViewChild('ConfirmSendUploadModal') ConfirmSendUploadModal: any;	
	@ViewChild('ConfirmEliminadUploadModal') ConfirmEliminadUploadModal: any;
	@ViewChild('IntentionEnrollmentModal') IntentionEnrollmentModal: any;
	@ViewChild('NotIntentionEnrollmentModal') NotIntentionEnrollmentModal: any;
	@ViewChild('YesIntentionEnrollmentModal') YesIntentionEnrollmentModal: any;
	@ViewChild('FinalIntentionEnrollmentModal') FinalIntentionEnrollmentModal: any;
	@ViewChild('EnrollScheduleModal') EnrollScheduleModal: any;
	@ViewChild('UpdateDataAlumnoModal') UpdateDataAlumnoModal: any;
	@ViewChild('UpdatePersonalDataModal') UpdatePersonalDataModal: any;
	@ViewChild('UpdateWorkingDataModal') UpdateWorkingDataModal: any;
	@ViewChild('humanityModal') humanityModal: any
	@ViewChild('AvisoVacunaModal') AvisoVacunaModal: any;
	userBackoffice: boolean;
	
	constructor( private wsService: WebsocketService,
		private queueS: QueueService,
		private formBuilder: FormBuilder,
		private session: SessionService,
		private router: Router,
		private intentionS: IntentionService,
		private studentS: StudentService,
    	private broadcaster: Broadcaster,
    	private deviceS: DeviceDetectorService,
    	private toastr: ToastrService,
		public inputsS: InputsService,
		private formS: FormService,
		public newEnrollmentS: NewEnrollmentService,
		public ngxSmartModalService: NgxSmartModalService, private http: HttpClient) {
		// this.innewEnrollment = false;
	}
		
	ngOnInit() {
		if(this.session.getItem('adminOprid')){//validación para mostrar la búsqueda de alumno solo al 'userBackoffice'
			this.userBackoffice = true;
		}

		if(!this.user){
			this.router.navigate(['/login']);
		}
		else{
			// this.getParameters();
		}
		this.initUpdatePersonalData();
		// this.checkInList();
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

			else if(message && message.hideFooter){
				this.innewEnrollment = message.hideFooter;
			}
		});
		this.initSocket();
		this.getFileUpload();
		this.getFlagSendUpload();
		// if ((this.user.ind_Medicina == 'Y') && this.router.url == '/estudiante') {
		// 	// this.AvisoVacunaModal.open();
		// 	this.showVacunation = true;
		// }
		// this.studentS.getListOfInterStudentsJson().then((res) => {
		// 	if (res.find(emp => emp == this.user.codigoAlumno)) {
		// 		this.showScheduleLink = true;
		// 	}
		// })
	}


	searchStudent(){
		this.session.destroy('emplidSelected');
		this.session.destroy('student');
		this.session.destroy('mySelectedStudent');
		this.session.destroy('user');
		this.session.destroy('acadmicData');
		this.router.navigate(['admin/home']);
	}


	initSocket(){
			this.wsService.enroll(this.user.codigoAlumno, '990051584', 'vallejoaguilar@gmail.com')
	    .then( (res: any) => {
	      if (res.ok) {
	      }
	    })
	    .catch( err => {
	      // console.log('catch!', err);
			});
			
			// this.queueS.notification( this.user.codigoAlumno )
			// 		.subscribe( (res: any) => {
			// 			this.notifications = res.data;
			// 			let filtered = res.data.filter ( ( d ) => { return d.read === 'N'; });
			// 			this.notifications_read = filtered.length;
			// 			// console.log('this.notifications_read', this.notifications_read)
			// 		});
	
			this.wsService.listenNotification()
				.subscribe( (res: any) => {
					this.toastr.info('Se actualizó su nota del curso ' + this.titleCase(res.course), "Nueva Notificación",{
						timeOut: 5000,
					});
					if( localStorage.getItem('user') != null ) {
						this.queueS.notification( this.user.codigoAlumno )
						.subscribe( (res: any) => {
							this.notifications = res.data;
							let filtered = res.data.filter ( ( d ) => { return d.read === 'N'; });
							this.notifications_read = filtered.length;
						});
					}
				});
	}
		
	notificationRead(){
		this.queueS.notificationRead( this.user.codigoAlumno )
				.subscribe( (res: any) => {
					console.log('Leyendo')
					this.notifications_read = 0;
				}, (err: any) => {
					console.log('error', err)
				})
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
		this.personalUpdateForm = this.formBuilder.group({
			email: ['', ValidationService.emailValidator],
			phone: ['', [Validators.required, Validators.pattern("(9)[0-9]{8}")]],
			// idDepa: ['', Validators.required],
			// idProv: ['', Validators.required],
			// idDist: ['', Validators.required],
			// direccion: ['', Validators.required],
			// referencia: ['', Validators.required],
		});
		this.getPersonalDataValidate();
	}

	getPersonalDataValidate(){
		this.studentS.getPersonalData(this.user.codigoAlumno)
		.then(res => {
			this.dataEstudiante = res.data;
			this.setClient(res.data || {})
					
			// this.studentS.getListOfStudentsUbigeoJson()
		 //      	.then((res2) => {
		 //        	if( res2.find(emp => emp == this.user.codigoAlumno && ( res.data == null || res.data.idDepa == null) )) {
			// 			this.modalUpdateDataClosable = false
			// 			this.UpdateDataAlumnoModal.open();
			// 			this.getDepartamento();
		 //        	}
		 //      	});
		});
	}

	getPersonalData(){
		this.studentS.getPersonalData(this.user.codigoAlumno)
		.then(res => {
			this.dataEstudiante = res.data;
			this.setClient(res.data || {})
		});
	}

	openPersonalDataModal(){
		this.getPersonalData();
		this.UpdateDataAlumnoModal.open();
		// debugger
		// if( this.departamentos == undefined ) this.getDepartamento();
	}
	
	saveDatosAlumno(){		
		if(this.personalUpdateForm.invalid){
			let data = this.personalUpdateForm.value;
			this.formS.controlErrors(this.personalUpdateForm);
			return;
		}
		let data = this.personalUpdateForm.value;
		data.emplid = this.user.codigoAlumno;
		this.loading = true;
		this.studentS.updEmailData(data)
		.then(res => {
			let {UCS_RES_EMAIL} = res;
			data.result_email = UCS_RES_EMAIL.UCS_COM_EMAIL[0].Mensaje;	
			
			this.studentS.updPhoneData(data)
			.then(res => {
			    let {UCS_RES_PHONE} = res;
				data.result_phone = UCS_RES_PHONE.UCS_COM_PHONE[0].Mensaje;		
				
				this.studentS.savePersonalData(data)
				.then(res => {
					this.loading = false;
					this.UpdateDataAlumnoModal.close();
					this.FinalIntentionEnrollmentModal.open();
				});

			});

		}).catch(error => {
			this.loading = false;
		});
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
		
		this.personalUpdateForm.controls['email'].setValue(data.email?data.email:'');
		this.personalUpdateForm.controls['phone'].setValue(data.phone?data.phone:'');
		// this.personalUpdateForm.controls['idDepa'].setValue(data.idDepa?data.idDepa:'');
		// if(data.idDepa) this.getProvincia(data.idDepa, data.idProv);
		// if(data.idProv) this.getDistrito(data.idProv, data.idDist);
		// this.personalUpdateForm.controls['direccion'].setValue(data.direccion?data.direccion:'');
		// this.personalUpdateForm.controls['referencia'].setValue(data.referencia?data.referencia:'');
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
				if(item.type == 'PM') this.enrollmentIntentionStatus = item;
				if(item && item.enrollment_intention_status == 'A' && item.authorizacion && item.type == 'PM' && item.authorizacion.ended_process == 'NO'){
					if(open) this.openIntentionEnrollment();
					this.noClosed = rDate > item.end_date || rDate < item.start_date?true:false;
				}
				if(item && item.enrollment_intention_status == 'A' && item.type == 'M'){
					this.broadcaster.sendMessage({ enrollTab: 'Y' });
				}
				if(item && item.enrollment_intention_status == 'A' && item.type == 'NM'){
					this.broadcaster.sendMessage({ enrollTab: 'Y' });
				}
			});
		})
	}

	getEnrollSchedule(){
		this.enrollCycles = null;
		this.EnrollScheduleModal.open();
		this.studentS.getEnrollSchedule(this.enroll.OPRID + '/' + this.enroll.INSTITUTION + '/' + this.enroll.ACAD_CAREER + '/' + this.enroll.ACAD_PROG + '/' + this.enroll.codigoPlan + '/' + this.enroll.EMPLID + '/0992')
		.then(res => {
			let allData: Array<any> = res.UCS_REST_HORARIOV2_RES && res.UCS_REST_HORARIOV2_RES.UCS_REST_HORARIOV2_COM?res.UCS_REST_HORARIOV2_RES.UCS_REST_HORARIOV2_COM:[];
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

	showEnrollmentSchedule(){
		this.enrollCycles = null;
		this.EnrollScheduleModal.open();
		let activeData = this.session.getObject('dataEnrollment');
		this.newEnrollmentS.getSkillfullLoad({EMPLID: activeData.EMPLID,CAMPUS:activeData.sede})
			.then(res => {
				let allData: Array<any> = res?res:[];
				// let allData: Array<any> = res.UCS_REST_HORARIO_RES && res.UCS_REST_HORARIO_RES.UCS_REST_HORARIO_COM?res.UCS_REST_HORARIO_RES.UCS_REST_HORARIO_COM:[];
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
							isOpen: false,
							type: item.LVF_CARACTER,
							courses_id: [],
							schedule: []
						}
					}
					objCycles[item.UCS_CICLO].courses[item.DESCR].courses_id.push(item.CRSE_ID, item.CRSE_ID2, item.CRSE_ID3,item.CRSE_ID4,item.CRSE_ID5,item.CRSE_ID6);
					objCycles[item.UCS_CICLO].courses[item.DESCR].courses_id = objCycles[item.UCS_CICLO].courses[item.DESCR].courses_id.filter(el => el != '');
					// objCycles[item.UCS_CICLO].courses[item.DESCR].schedule.push(item);
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
				// objCycles[0].name = 'Electivo';
				// this.enrollCycles.push(objCycles[0]);
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
				if (inst) {
					this.sendDataStudent(inst);
				}
			});
	}

	getQueueEnroll(){
		if(this.enroll && this.enroll_conditions && this.queueEnroll){
			this.sendEnroll();
		}
		else{
			this.student = this.session.getObject('student');
			this.user = this.session.getObject('user');
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
						// this.enroll.STRM = res.UCS_OBT_STRM_RES && res.UCS_OBT_STRM_RES.STRM?res.UCS_OBT_STRM_RES.STRM:this.enroll.STRM;
						this.broadcaster.sendMessage({enroll: this.enroll});
						this.studentS.getEnrollQueueNumber(this.enroll)
						.then(res => {
							this.queueEnroll = res.UCS_GRUPO_MAT_RES;
							var dateQueue = this.queueEnroll.exactDate.split(' ');
							var parts = dateQueue[0].split('/');
							var partsHour = dateQueue[1].split(':');
							if (this.deviceS.isMobile() && this.deviceS.getDeviceInfo().device == 'iPhone') {
								if ((this.deviceS.getDeviceInfo().browser == 'Chrome' || this.deviceS.getDeviceInfo().browser == 'Safari') && Number((this.deviceS.userAgent.split('_')[0]).slice(-2)) > 13) {
									var partsHour = this.queueEnroll.hora_ing.split(':');
									var hour = Number(partsHour[0] - 5)<10?'0' + (Number(partsHour[0]) - 5).toString():(Number(partsHour[0]) - 5).toString();
									this.queueEnroll.hora_ing = hour + ':' + partsHour[1];
									this.queueEnroll.exactDate = ' ' + hour + ':' + partsHour[1];
								}
 							}
 							this.session.setObject('dataEnrollment', this.enroll);
							var enrollDate = RealDate(this.getDates(parts[2] + '-' + parts[1] + '-' + parts[0], this.queueEnroll.exactDate.split(' ')[1] + ':00'));
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

	toggleCycle(obj){
		obj.isOpen = !obj.isOpen;
	}

	toggle(obj) {
		if(!obj.isOpen){
			this.loading = true;
			let activeData = this.session.getObject('dataEnrollment');
			for (let i = 0; i < obj.courses_id.length; i++) {
				let schedules = [];
				this.newEnrollmentS.getScheduleNew({
					CAMPUS: activeData.sede,
					CRSE_ID: obj.courses_id[i],
					OFFER_CRSE: '',
					SESSION_CODE: '',
					STRM: activeData.STRM
				}).then((res) => {
					if(res.UCS_REST_COHOR_RESP.UCS_REST_CON_HOR_RES){
						schedules.push(...res.UCS_REST_COHOR_RESP.UCS_REST_CON_HOR_RES);
					}
					if (i == obj.courses_id.length-1) {
						obj.schedule = schedules;
						obj.isOpen = !obj.isOpen;
						this.loading = false;
					}
				});
			}
		} else {
			obj.isOpen = !obj.isOpen;
		}
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

	titleCase(string: string) {
			var sentence = string.toLowerCase().split(" ");
			for(var i = 0; i< sentence.length; i++) {
				sentence[i] = sentence[i][0].toUpperCase() + sentence[i].slice(1);
			}
			return sentence.join(" ");
	}

	filesCartilla: File[] = [];
	filesDeclaracion: File[] = [];
	filesExoneracion: File[] = [];

	onSelectCartilla(event) {
		let filename = event.addedFiles[0].name;
		let flag = false;
		
		if(this.filesCartilla.length > 0){
			for (var i = 0; i < this.filesCartilla.length; i++) { 				
				if(this.filesCartilla[i].name == filename) {
					flag = true;
				}		
			}	
			if(!flag){
				this.filesCartilla.push(...event.addedFiles);
			}			
		}else{
			this.filesCartilla.push(...event.addedFiles);
		}

		this.validarBotonesFile();
		this.botonCerrar = false;
	}

	onSelectDeclaracion(event) {
		// debugger
		let filename = event.addedFiles[0].name;
		let flag = false;
		
		if (event.addedFiles.length > 1) {
			this.toastr.error('Solo puede subir un archivo en la sección de Declaración Jurada');
			return
		}
		else if((this.filesDeclaracion.length + this.datafile.length ) == 1) {
			this.toastr.error('Solo puede subir un archivo en la sección de Declaración Jurada');
		}
		else if(this.filesDeclaracion.length > 0){

			for (var i = 0; i < this.filesDeclaracion.length; i++) { 				
				if(this.filesDeclaracion[i].name == filename) {
					flag = true;
				}		
			}	
			if(!flag){
				this.filesDeclaracion.push(...event.addedFiles);
			}			
		}else{
			let name = event.addedFiles[0].name
			let arrName = name.split('.')
			let tipo = arrName[arrName.length-1].toLocaleLowerCase()
			if (tipo == 'docx' || tipo == 'doc' || tipo == 'pdf') {
				this.filesDeclaracion.push(...event.addedFiles);
			}else {
				this.toastr.error('Solo puede subir archivos de tipo PDF o Word');
			}

		}		
		this.validarBotonesFile();
		this.botonCerrar = false;
	}

	onSelectExoneracion(event) {
		let filename = event.addedFiles[0].name;
		let flag = false;
		
		if (event.addedFiles.length > 1) {
			this.toastr.error('Solo puede subir un archivo en la sección de Exoneración');
			return
		}
		else if((this.filesExoneracion.length + this.datafile.length) == 1) {
			this.toastr.error('Solo puede subir un archivo en la sección de Exoneración');
		}
		else if(this.filesExoneracion.length > 0){
			for (var i = 0; i < this.filesExoneracion.length; i++) { 				
				if(this.filesExoneracion[i].name == filename) {
					flag = true;
				}		
			}	
			if(!flag){
				this.filesExoneracion.push(...event.addedFiles);
			}			
		}else{
			let name = event.addedFiles[0].name
			let arrName = name.split('.')
			let tipo = arrName[arrName.length-1].toLocaleLowerCase()
			if (tipo == 'docx' || tipo == 'doc' || tipo == 'pdf') {
				this.filesExoneracion.push(...event.addedFiles);
			}else {
				this.toastr.error('Solo puede subir archivos de tipo PDF o Word');
			}
		}	
		this.validarBotonesFile()	
		this.botonCerrar = false;
	}
	
	
	validarBotonesFile() {
		if( this.filesCartilla.length >0 ) {
			this.botonCartilla = true;
			this.botonDeclaracion = false;
			this.botonExoneracion = false;
		} else if ( this.filesDeclaracion.length >0 ) {
			this.botonCartilla = false;
			this.botonDeclaracion = true;
			this.botonExoneracion = false;
		} else {
			this.botonCartilla = false;
			this.botonDeclaracion = false;
			this.botonExoneracion = true;
		}
	}

	validarBotonesBD(tipo: string) {
		if( tipo == 'Cartilla' ) {
			this.botonCartilla = true;
			this.showCartilla = true;
			this.botonDeclaracion = false;
			this.showDeclaracion = false;
			this.botonExoneracion = false;
			this.showExoneracion = false;
		} else if ( tipo == 'Declaración' ) {
			this.botonCartilla = false;
			this.showCartilla = false;
			this.botonDeclaracion = true;
			this.showDeclaracion = true;
			this.botonExoneracion = false;
			this.showExoneracion = false;
		} else {
			this.botonCartilla = false;
			this.showCartilla = false;
			this.botonDeclaracion = false;
			this.showDeclaracion = false;
			this.botonExoneracion = true;
			this.showExoneracion = true;
		}
	}

	upload() {
		if(this.filesCartilla.length > 0 || this.filesDeclaracion.length > 0 || this.filesExoneracion.length > 0){
			this.loading = true;
			const formData = new FormData();

			let file: any = [];
			let tipo: string;
			if( this.filesCartilla.length >0 ) {
				file = this.filesCartilla;
				tipo = "Cartilla";
			} else if ( this.filesDeclaracion.length >0 ) {
				file = this.filesDeclaracion;
				tipo = "Declaración";
			} else {
				file = this.filesExoneracion;
				tipo = "Exoneración";
			}

			for (var i = 0; i < file.length; i++) { 
				formData.append("file[]", file[i]); 
			}

			formData.append("tipo", tipo); 
			formData.append("nombres", this.student.nombreAlumno + ' ' + this.student.apellidoAlumno );

			let requestOptions: any = {
				method: 'POST',
				body: formData,
				redirect: 'follow'
			};
			
			fetch(AppSettings.BASE + "/student/uploadControlVacuna/" + this.user.codigoAlumno + "?file[]", requestOptions)
				.then(response => response.text())
				.then(result => {
					this.getFileUpload();
					this.getFlagSendUpload();
					setTimeout(()=>{ 
						this.loading = false;
						this.botonCerrar = true;
						this.filesCartilla.splice(0);
						this.filesDeclaracion.splice(0);
						this.filesExoneracion.splice(0);
						this.toastr.success('archivo(s) subido(s) correctamente!');
					}, 3000);	
				})
				.catch(error => this.toastr.success(error));

		}else{
			this.toastr.error('no hay archivos a subir');
		}		
	}

	getFileUpload(){	
		this.studentS.getFileUpload(this.user.codigoAlumno)
		.then((res) => {	
			this.botonesvacuna = true;
			// console.log(res.data.length);	
			this.datafile = res.data; 

			if(res.data.length == 0) {
				this.botonCartilla = true;
				this.botonDeclaracion = true;
				this.botonExoneracion = true;
			} else {
				this.datafile.forEach((item) => {
					this.validarBotonesBD(item.tipo)
				})
			}			

		});
	}

	preDeleteUpload(id){
		this.ConfirmEliminadUploadModal.open();
		this.idfile=id;		
		
	}

	deleteUpload(id){
		this.loading = true;	
		this.studentS.deleteUpload(id)
		.then((res) => {
			this.ConfirmEliminadUploadModal.close();	
			this.getFileUpload();	
			this.getFlagSendUpload();
			setTimeout(()=>{ 
				this.loading = false;
				this.toastr.success('archivo eliminado correctamente!');	
			}, 3000);
		},
		error => {
				this.toastr.error(error);
		});
	}

	sendUploadPS(){	
		this.loading = true;
		this.studentS.sendUploadPS({emplid: this.user.codigoAlumno})
		.then((res) => {
			if(res.UCS_REG_VAC_DET_RES.Estado == 'Y'){
				this.ConfirmSendUploadModal.close();					
				this.getFileUpload();
				this.getFlagSendUpload();	
				setTimeout(()=>{ 
					this.loading = false;
					this.toastr.success('declaración confirmada correctamente!');		
				}, 3000);			
			}else{
				this.toastr.error('ocurrio un error!');
			}
		},
		error => {
			this.loading = false;	
			this.toastr.error(error);
		});
	}

	getFlagSendUpload(){	
		this.studentS.getFlagSendUpload(this.user.codigoAlumno)
		.then((res) => {			
			this.flagSendUpload = res.status;
		});
	}

	onRemoveCartilla(event) {
		this.filesCartilla.splice(this.filesCartilla.indexOf(event), 1);
		this.habilitarbotonesVacunacion();
	}
	onRemoveDeclaracion(event) {
		this.filesDeclaracion.splice(this.filesDeclaracion.indexOf(event), 1);
		this.habilitarbotonesVacunacion();
	}
	onRemoveExoneracion(event) {
		this.filesExoneracion.splice(this.filesExoneracion.indexOf(event), 1);
		this.habilitarbotonesVacunacion();
	}

	habilitarbotonesVacunacion() {
		if( this.filesExoneracion.length == 0) {
			this.botonDeclaracion = true
			this.botonCartilla = true
			this.botonExoneracion = true
		}
	}

	cartilla(){
		if(this.botonCartilla) {
			this.showExoneracion = false;
			this.showCartilla = true;
			this.showDeclaracion = false;
		}else {
			this.toastr.info('Los documentos solo pueden pertencer a una sección.');
		}
	}

	declaracion(){
		if(this.botonDeclaracion) {
			this.showExoneracion = false;
			this.showCartilla = false;
			this.showDeclaracion = true;
		}else {
			this.toastr.info('Los documentos solo pueden pertencer a una sección.');
		}
	}

	exoneracion(){
		if(this.botonExoneracion) {
			this.showExoneracion = true;
			this.showCartilla = false;
			this.showDeclaracion = false;
		} else {
			this.toastr.info('Los documentos solo pueden pertencer a una sección.');
		}
	}

	getDepartamento(){
		
		this.loading = true;
		this.studentS.getDepartamento(null)
		.then(res => {
			this.departamentos = res.data;
			this.loading = false;
			if(this.dataEstudiante != null && this.dataEstudiante.idDepa != null) {
				this.personalUpdateForm.controls['idDepa'].setValue(this.dataEstudiante.idDepa);
				if(this.dataEstudiante.idDepa) this.getProvincia(this.dataEstudiante.idDepa, this.dataEstudiante.idProv);
				if(this.dataEstudiante.idProv) this.getDistrito(this.dataEstudiante.idProv, this.dataEstudiante.idDist);
			}
			
		}, error => { this.loading = false; });
	}
	
	getProvincia(cmbDepartamento, value){
		
		this.loading = true;
		this.studentS.getProvincia({ idDepa : cmbDepartamento})
		.then(res => {
			// debugger
			this.loading = false;
			this.provincias = res.data;
			if( value != null ) {
				this.personalUpdateForm.controls['idProv'].setValue(value ? value : '');
			}
		}, error => { this.loading = false; });
	}
	getDistrito(cmbProvincia, value){
		this.loading = true;
		this.studentS.getDistrito({ idProv : cmbProvincia})
		.then(res => {
			this.loading = false;
			this.distritos = res.data;
			if( value != null ) {
				this.personalUpdateForm.controls['idDist'].setValue(value ? value : '');
			}
		}, error => { this.loading = false; });
	}

}
