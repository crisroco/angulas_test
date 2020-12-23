import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { DeviceDetectorService } from 'ngx-device-detector';
import { LoginService } from '../services/login.service';
import { SessionService } from '../services/session.service';
import { QueueService } from '../services/queue.service';
import { AppSettings } from '../app.settings';
import { Encrypt } from '../helpers/general';

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

	constructor(private formBuilder: FormBuilder,
    	private toastr: ToastrService,
    	private loginS: LoginService,
    	private session: SessionService,
    	private queueS: QueueService,
    	private router: Router,
    	private deviceS: DeviceDetectorService) { }

	ngOnInit() {
		this.loginForm = this.formBuilder.group({
			email: ['', Validators.required],
			password: ['', Validators.required],
        });
	}

	login(){
		if (this.loginForm.invalid) { this.toastr.error('Complete todos los campos.'); return;}
		let data = this.loginForm.value;
		let deviceinfo = this.deviceS.getDeviceInfo();
		data.origen = deviceinfo.device == 'Unknown'?'W':'M';
		this.loading = true;
		this.loginS.userLogin(data)
		.then(res => {
			this.student = res.UcsMetodoLoginRespuesta;
			this.loading = false;
			if(!this.student || this.student['valor'] != 'Y'){
				this.toastr.error(this.student && this.student.descripcion?this.student.descripcion:'No pudo loguearse, vuelva a intentarlo en unos minutos.');
				return;
			}
			if(this.student.tipo_usuario == 'D' || this.student.tipo_usuario == 'O'){
				this.toastr.error('El Acceso solo esta permitido a los ALUMNOS.');
				return;
			}

			this.queueS.authEncrypt({...data, code: this.student.codigoAlumno})
				.subscribe( (res: any) => {
					this.session.setItem('up', res.ciphertext);
					// this.session.setItem('data', Encrypt(JSON.stringify(data), 'miportal&ucs'));
					this.student.email = data.email;
					this.session.setObject('user', this.student);
					this.loginS.oauthToken({
						username: data.email,
					    password: data.password,
					    // client_id: 16, tst
					    // client_secret: "wxcQmnx9NvaTIELf0rL3vP5kF1MJ97EUhdGadRLv",
					    // client_id: 16,
					    // client_secret: "YuVuaUbO73GDhi78ao8pPiXv7FXqVUrgvkTcPVrU",
					    client_id: 6,
					    client_secret: "0IQYU1wXVKM7s4OB7URhvUcNEno7LrWDxS7r2MYl",
					    grant_type: "password"
					})
						.then((res) => {
							this.session.setObject('oauth', res);
							this.router.navigate(['estudiante']);
						});
			});
		}, error => { this.loading = false; });
	}

}
