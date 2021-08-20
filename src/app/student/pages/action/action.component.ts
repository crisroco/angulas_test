import { Component, OnInit } from '@angular/core';
import { Broadcaster } from '../../../services/broadcaster';
import { SessionService } from '../../../services/session.service';
import { NewEnrollmentService } from '../../../services/newenrollment.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-action',
  templateUrl: './action.component.html',
  styleUrls: ['./action.component.scss']
})
export class ActionComponent implements OnInit {
	crossdata: any;
	enrollTab: any;
	user:any;

	constructor( 
		private broadcaster: Broadcaster,
		private router: Router,
		private session: SessionService,
		public newEnrollmentS: NewEnrollmentService) { 
		// this.ngOnInit();
	}

	ngOnInit() {
		// this.broadcaster.sendMessage({openEnroll: 'Y'});
		this.crossdata = this.broadcaster.getMessage().subscribe(message => {
			if (message && message.enrollTab) {
				// console.log('llego', message.enrollTab);
				this.enrollTab = message.enrollTab;
			}
		});
	}

	validate(){
		this.user = this.session.getObject('user');
		this.newEnrollmentS.validateCurrent(this.user.codigoAlumno)
			.then((res) => {
				if(!res.status){
					this.session.allCLear();
					this.session.setItem('showModal', true);
					this.router.navigate(['/login']);
				}
			});
	}

}
