import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { DeviceDetectorService } from 'ngx-device-detector';
import { StudentService } from '../../../../services/student.service';
import { SessionService } from '../../../../services/session.service';

@Component({
  selector: 'app-account-status',
  templateUrl: './account-status.component.html',
  styleUrls: ['./account-status.component.scss']
})
export class AccountStatusComponent implements OnInit {
	user: any = this.session.getObject('user');
	student: any = this.session.getObject('student');
	accounts: any;
	colors: any = {
		'VENCIDO': '#DA6161',
		'CANCELADO': '#5bce5b',
		'POR VENCER': '#CED44A'
	}

	constructor(private session: SessionService,
		private studentS: StudentService) { }

	ngOnInit() {
		this.studentS.getAccountStatus()
		.then(res => { 
			this.accounts = res.UcsMetodoEstadoCuentaRespuesta && res.UcsMetodoEstadoCuentaRespuesta.UcsMetodoEstadoCuentaDetalle?res.UcsMetodoEstadoCuentaRespuesta.UcsMetodoEstadoCuentaDetalle:[];
			// console.log(this.accounts);
		}, error => { });
	}

}
