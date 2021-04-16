import { Component, OnInit } from '@angular/core';
import { AppSettings } from '../../app.settings';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { DeviceDetectorService } from 'ngx-device-detector';
import { LoginService } from '../../services/login.service';
import { QueueService } from '../../services/queue.service';
import { Encrypt } from '../../helpers/general';
import { SessionService } from '../../services/session.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  code_company = AppSettings.COMPANY;
  loginForm: FormGroup;
  loading = false;
  ip: any;
  data_browser: any;
  variable: string = '';
  student: any;
  process1: false;
  process2: false;
  process3: false;
  //public available = ["100075537","100014866", "100044425", "100031168", "100047588", "4200810348", "100055878", "100000384", "100000752", "100003261", "100032537", "100054527", "100054525", "100075831", "100054938", "100054418", "100052377", "100075396", "100064384","100070412","100040451","100075372","100083509", "100005682", "100055266"];
  public usersMatricula = ["EMORAN","TLOZANO","LYAYA","DALARCONU","BROLDANSA","SLEONA","CCIEZA","ACORNEJOC","BRAMIREZ","APALOMINO","BBARRIOSA"];
  public usersMiPortal = ["AJAUREGUIA","MFALCON"];
  public usersAdmin = ["BENCISO","AFARFANP","WALVA","JCRUCESP","JSOLANOB", "EACOSTAC"];
  public cientifica_data = {
    empresa_url : 'ucientifica.edu.pe',
    cod_empresa : '002',
    nom_empresa : 'UCSUR'
  }
  constructor(private formBuilder: FormBuilder,
    public toastr: ToastrService,
    private session: SessionService,
    private queueS: QueueService,
    public router: Router,
    public deviceS:DeviceDetectorService,
    private loginS: LoginService) { }

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      empresa: ['002', Validators.required],
      email: ['', Validators.required],
      password: ['', Validators.required],
    });
    this.loginS.getIPAddress()
    .then(res => {
      this.ip = res.ip;
    }, error => {
      this.ip = '0.0.0.0';
    });
    this.data_browser = this.deviceS.getDeviceInfo();
  }

  login(){
    if (this.loginForm.invalid) { this.toastr.error('Complete todos los campos.'); return;}
    let data = this.loginForm.value;
    this.loading = true;
    this.variable = btoa(this.cientifica_data.empresa_url + "&&" + data.email.toUpperCase() + "&&" + data.password);
    let deviceinfo = this.deviceS.getDeviceInfo();
    data.origen = deviceinfo.device == 'Unknown'?'W':'M';    
    this.loginS.userLogin(data)
    .then(res => {
      let codigoUsuario = res['UcsMetodoLoginRespuesta']['codigoAlumno'];
      let opridForm = this.loginForm.controls.email.value;

      if(!res['UcsMetodoLoginRespuesta'] || res['UcsMetodoLoginRespuesta']['valor'] != 'Y'){
        this.toastr.error(res['UcsMetodoLoginRespuesta'] && res['UcsMetodoLoginRespuesta'].descripcion?res['UcsMetodoLoginRespuesta'].descripcion:'No pudo loguearse, vuelva a intentarlo en unos minutos.');
        this.loading = false;
        return;
      }
      if (this.usersMiPortal.includes(opridForm)){
        this.session.setItem('userBackOffice', "personalMiPortal");
      } else if (this.usersMatricula.includes(opridForm)) {
        this.session.setItem('userBackOffice', "personalMatricula");
      } else if (this.usersAdmin.includes(opridForm)) {
        this.session.setItem('userBackOffice', "personalBothProcess");
      } else {
        this.toastr.error('No cuentas con los accesos necesarios');
        this.loading = false;
        return;
      }
      this.session.setItem('adminOprid', this.loginForm.controls.email.value);//campo para la validación de login del admin
      this.session.setItem('cod_company', "002");
      this.loginS.oauthToken({
        username: data.email,
        password: data.password,
        client_id: 2,
        client_secret: "UuSTMkuy1arAjaIA4yY5l5xXRm6NonaKZoBk2V1a",
        grant_type: "password" 
      }).then((res) => {
        this.session.setObject('oauth', res);
        this.router.navigate(['admin/home']);
      });
    }, error => { this.loading = false; });
  }
}