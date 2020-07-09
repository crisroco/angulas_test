import { Component, OnInit, ViewChild } from '@angular/core';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { SessionService } from '../services/session.service';
import { Router } from '@angular/router';
import { NgxSmartModalService } from 'ngx-smart-modal';
import { IntentionService } from '../services/intention.service';
import { Broadcaster } from '../services/broadcaster';
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
					url: 'https://miportal.cientifica.edu.pe/core/docs/CALENDARIO_ACADEMICO_2020_I_PREGR.pdf',
					description: 'CALENDARIO ACADÉMICO 2020-I'
				},
			],
			isOpen: true,
		},
		{
			name: 'Documentos CPE',
			links: [
				{
					img: '',
					url: 'https://miportal.cientifica.edu.pe/core/docs/CALENDARIO_ACADEMICO_2020_I_CPE_ATE.pdf',
					description: 'CALENDARIO ACADÉMICO 2020-I CAMPUS ATE'
				},
				{
					img: '',
					url: 'https://miportal.cientifica.edu.pe/core/docs/CALENDARIO_ACADEMICO_2020_I_CPE_VILLA.pdf',
					description: 'CALENDARIO ACADÉMICO 2020-I CAMPUS VILLA'
				},
			],
			isOpen: true,
		},
		{
			name: 'Manuales de Usuario',
			links: [
				{
					img: '',
					url: 'https://miportal.cientifica.edu.pe/core/docs/Manual_de_Usuario_Portal_Alumno_-_UCSUR.pptx',
					description: 'MANUAL DE USUARIO PORTAL ALUMNO – CIENTIFICA'
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
	comment: string = '';
	@ViewChild('IntentionEnrollmentModal') IntentionEnrollmentModal: any;
	@ViewChild('NotIntentionEnrollmentModal') NotIntentionEnrollmentModal: any;
	@ViewChild('YesIntentionEnrollmentModal') YesIntentionEnrollmentModal: any;
	@ViewChild('FinalIntentionEnrollmentModal') FinalIntentionEnrollmentModal: any;

	constructor(private session: SessionService,
		private router: Router,
		private intentionS: IntentionService,
    	private broadcaster: Broadcaster,
    	private toastr: ToastrService,
		public ngxSmartModalService: NgxSmartModalService) { }

	ngOnInit() {
		if(!this.user){
			this.router.navigate(['/login']);
			// for (var i = this.typeLibraries.length - 1; i >= 0; i--) {
			// 	this.typeLibraries[i].libraries.forEach((library) => {
			// 		library.url = library.url.replace(/{dni}/gi, this.dataTeacher.dni);
			// 	});
			// }
		}
		else{
			this.getParameters();
		}

		this.crossdata = this.broadcaster.getMessage().subscribe(message => {
			if (message && message.intentionModal && message.intentionModal == '2') {
				this.IntentionEnrollmentModal.open();
				this.getParameters(false);
			}
	    });
	}

	getParameters(open: boolean = true){
		var rDate = this.realDate.year + '-' + this.realDate.month + '-' + this.realDate.day;
		this.intentionS.getParameters(this.user.codigoAlumno)
		.then(res => {
			this.enrollmentStatus = res.data && res.data.enrollment_intention_status?res.data:{};
			if(this.enrollmentStatus && this.enrollmentStatus.enrollment_intention_status == 'A' && this.enrollmentStatus.authorizacion && this.enrollmentStatus.authorizacion.ended_process == 'NO'){
				if(open) this.openIntentionEnrollment();
				this.noClosed = rDate > this.enrollmentStatus.end_date || rDate < this.enrollmentStatus.start_date?true:false;
				console.log(this.noClosed);
				console.log(this.enrollmentStatus.end_date, this.enrollmentStatus.start_date, rDate);
			}
		})
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

}
