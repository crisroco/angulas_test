import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { AppSettings } from '../app.settings';
import { GeneralService } from './general.service';

@Injectable({
  providedIn: 'root'
})
export class AssistanceService {

	constructor(private http: HttpClient, 
		private generalS: GeneralService) { }

    public getAssistanceNBR(data: any): Promise<any> {
    	return this.http.post(AppSettings.BASE + AppSettings.ASSISTANCE + '/getAssistanceNBR', data, { headers: this.generalS.makeHeaderNormal()}).toPromise();
    }
    
    public saveAssistance(data: any): Promise<any> {
        return this.http.post(AppSettings.BASE + AppSettings.ASSISTANCE + '/saveAssistance', data, { headers: this.generalS.makeHeaderNormal()}).toPromise();
    }

    public getAllClassNbrByCourse(data: any): Promise<any> {
        return this.http.post(AppSettings.BASE + AppSettings.ASSISTANCE + '/getAllClassNbrByCourse', data, { headers: this.generalS.makeHeaderNormal()}).toPromise();
    }

    public sendAssistanceOnlinePs(data:any): Promise<any> {
        return this.http.post(AppSettings.BASE + AppSettings.ASSISTANCE + '/sendAssistanceOnlinePs', data, { headers: this.generalS.makeHeaderNormal()}).toPromise();
    }

}