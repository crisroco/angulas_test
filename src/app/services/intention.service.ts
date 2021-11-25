import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { AppSettings } from '../app.settings';
import { GeneralService } from './general.service';

@Injectable({
  providedIn: 'root'
})
export class IntentionService {

	constructor(private http: HttpClient, 
		private generalS: GeneralService) { }

    public getParameters(): Promise<any> {
        return this.http.get(AppSettings.BASE + AppSettings.INTENTION + '/getParameters', { headers: this.generalS.makeHeaderNormal()}).toPromise();
    }

    public getCourses(code): Promise<any> {
        return this.http.get(AppSettings.BASE + AppSettings.INTENTION + '/getCourses/' + code, { headers: this.generalS.makeHeaderNormal()}).toPromise();
    }

    public getCoursesIntensive(code): Promise<any> {
        return this.http.get(AppSettings.BASE + AppSettings.INTENTION + '/getCoursesIntensive/' + code, { headers: this.generalS.makeHeaderNormal()}).toPromise();
    }

    public getMotives(code): Promise<any> {
    	return this.http.get(AppSettings.BASE + AppSettings.INTENTION + '/getMotives/' + code, { headers: this.generalS.makeHeaderNormal()}).toPromise();
    }

    public saveNotIntention(data: any): Promise<any> {
    	return this.http.post(AppSettings.BASE + AppSettings.INTENTION + '/saveNotIntention', data, { headers: this.generalS.makeHeaderNormal()}).toPromise();
    }

    public saveYesIntention(data: any): Promise<any> {
    	return this.http.post(AppSettings.BASE + AppSettings.INTENTION + '/saveYesIntention', data, { headers: this.generalS.makeHeaderNormal()}).toPromise();
    }

    public saveYesIntensive(data: any): Promise<any> {
        return this.http.post(AppSettings.BASE + AppSettings.INTENTION + '/saveYesIntensive', data, { headers: this.generalS.makeHeaderNormal()}).toPromise();
    }

}