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
  constructor(private session: SessionService,
		private router: Router) { }

  ngOnInit() {
  }

  	logout(){
		this.session.allCLear();
		this.router.navigate(['/admin']);
	}

}
