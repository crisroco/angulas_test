import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { AppSettings } from '../app.settings';
import { SessionService } from '../services/session.service';

@Injectable({
  providedIn: 'root'
})
export class GeneralService {

	constructor(private http: HttpClient,
		private session: SessionService) { }

	public makeHeader(bearer = true, typeToken = 'token'){
		var header = {
		    'Content-Type': 'application/json',
		    'X-CSRF-Token': this.session.getItem(typeToken)
		};
		if(bearer) header['Authorization'] = 'Bearer ' + this.session.getItem('bearer_vac');
		return header;
	}

	public makeHeaderNormal(){
		return {
		    'Content-Type': 'application/json'
		};
	} 

	public getIPAddress(): Promise<any> { return this.http.get("http://api.ipify.org/?format=json").toPromise(); }

}