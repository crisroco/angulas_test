import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { DeviceDetectorService } from 'ngx-device-detector';
import { LoginService } from '../services/login.service';
import { SessionService } from '../services/session.service';
import { QueueService } from '../services/queue.service';
import { AppSettings } from '../app.settings';
import { Encrypt } from '../helpers/general';
import { NewEnrollmentService } from '../services/newenrollment.service';
import { StudentService } from '../services/student.service';
import * as CryptoJS from 'crypto-js';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
	loading = false;
	loginForm: FormGroup;
	student: any;
	code_company = AppSettings.COMPANY;
	studentCode;
	allData: any;
	arrego: [];
	dataStudent:any;
	remotex: any;
	digital1: any;
	digital2: any;
	digital3: any;
	digital4: any;

	@ViewChild('piezaModal') piezaModal: any;
	constructor(private formBuilder: FormBuilder,
    	private toastr: ToastrService,
    	private loginS: LoginService,
    	private session: SessionService,
    	private queueS: QueueService,
    	public newEnrollmentS: NewEnrollmentService,
    	private router: Router,
		private studentS: StudentService,
    	private deviceS: DeviceDetectorService) { }

	ngOnInit() {
		// this.piezaModal.open();
		this.loginForm = this.formBuilder.group({
			email: ['', Validators.required],
			password: ['', Validators.required],
        });
	}

	login() {
		if (this.loginForm.invalid) { this.toastr.error('Complete todos los campos.'); return; }
		let data = this.loginForm.value;
		let deviceinfo = this.deviceS.getDeviceInfo();
		data.origen = deviceinfo.device == 'Unknown' ? 'W' : 'M';
		this.loading = true;
		this.loginS.userLogin(data).then(res => {
			this.student = res.UcsMetodoLoginRespuesta;
			this.loading = false;
			if (!this.student || this.student['valor'] != 'Y') {
				this.toastr.error(this.student && this.student.descripcion ? this.student.descripcion : 'No pudo loguearse, vuelva a intentarlo en unos minutos.');
				return;
			}
			if (this.student.tipo_usuario == 'D' || this.student.tipo_usuario == 'O') {
				this.toastr.error('El Acceso solo esta permitido a los ALUMNOS.');
				return;
			}
			//SET OBJECT dataStudent
			this.studentS.getDataStudent({ email: data.email }).then(res => {
				this.remotex = res.UcsMetodoDatosPersRespuesta;
				this.session.setObject('remotex', this.remotex);
			}, error => { });
			this.studentS.getAcademicDataStudent({ code: this.student.codigoAlumno }).then((res) => {
				var instis = res['UcsMetodoDatosAcadRespuesta']['UcsMetodoDatosAcadRespuesta'];
				console.log("INSTITUTION'S del alumno:");
				instis.forEach(i => {
				});
				var units: Array<any> = res && res.UcsMetodoDatosAcadRespuesta && res.UcsMetodoDatosAcadRespuesta.UcsMetodoDatosAcadRespuesta ? res.UcsMetodoDatosAcadRespuesta.UcsMetodoDatosAcadRespuesta : [];
				var one = units.filter(item => item.institucion == 'ECONT');//ECONT - PREGR
				var inst = one.length ? one[0] : null;
				this.dataStudent = inst;
				this.session.setObject('dataStudent', this.dataStudent);
			});
			this.student.email = data.email;
			this.session.setObject('user', this.student);
			// this.router.navigate(['estudiante']);
			this.loginS.oauthToken({
				username: data.email,
				password: data.password,
				// client_id: 16, //tst
				// client_secret: "wxcQmnx9NvaTIELf0rL3vP5kF1MJ97EUhdGadRLv",
				client_id: 2,
				client_secret: "UuSTMkuy1arAjaIA4yY5l5xXRm6NonaKZoBk2V1a",
				grant_type: "password"
			}).then((res) => {
				/* -----------------------------------------------------------------CREACIÓN DEL HASH---------------------------------------------------------------- */
				const SECRETKEY = "K4GxggYzW6vl0TwxJrBL8RJaZR2eVg60";
				const DIGITAL_LIBRARY_URL = "https://bennett.remotexs.in/alumni/login";
				const DIGITAL_LIBRARY_URL2 = "https://cientifica.remotexs.co/alumni/login";
				this.digital1 = "Alumni";
				this.digital2 = this.session.getObject('user').codigoAlumno;
				this.digital3 = this.session.getObject('remotex').correo;

				if (CryptoJS) {
					var hash = CryptoJS.HmacSHA256(DIGITAL_LIBRARY_URL2 + this.digital1 + this.digital2 + this.digital3, SECRETKEY);
					this.digital4 = CryptoJS.enc.Base64.stringify(hash);
				} else {
					alert("Error: CryptoJS is undefined");
				}

				this.session.setObject('hash', this.digital4);
				this.session.setObject('oauth', res);
				this.router.navigate(['estudiante']);
			}, error => { this.loading = false; });
		}, error => { this.loading = false; });
	}
}