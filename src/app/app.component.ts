import { Component, OnInit } from '@angular/core';
import { Gtag } from 'angular-gtag';
import { RouterModule, Router, NavigationEnd, ParamMap} from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
	constructor(private gtag: Gtag,
    private router: Router){ }
	
  	title = 'alumno';

  ngOnInit(){
    this.router.events.subscribe(event => {
      if(event instanceof NavigationEnd){
        this.gtag.pageview({
          page_title: 'Alumno',
          page_path: this.router.url,
          page_location: 'L'+ this.router.url
        })
      }
    })
  }
}
