import { Component, OnInit } from '@angular/core';
import { AppSettings } from '../app.settings';
import { SessionService } from '../services/session.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {
	company = AppSettings.COMPANY;
	menus = false;
	userBackoffice: boolean;
  constructor(private session: SessionService,
		private router: Router) { }

  ngOnInit() {

	if(this.session.getItem('adminOprid')){//validación para mostrar la búsqueda de alumno solo al 'userBackoffice'
			this.userBackoffice = true;
		}

  }

  	logout(){
		this.session.allCLear();
		this.router.navigate(['/admin']);
	}

	searchStudent(){
		this.session.destroy('emplidSelected');
		this.session.destroy('student');
		this.session.destroy('mySelectedStudent');
		this.session.destroy('user');
		this.session.destroy('acadmicData');
		this.router.navigate(['admin/home']);
	}

}
