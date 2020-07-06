import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { AppSettings } from '../app.settings';
import { GeneralService } from './general.service';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

	constructor(private http: HttpClient, 
		private generalS: GeneralService) { }

    public userLogin(data): Promise<any> {
        return this.http.post(AppSettings.BASE + AppSettings.STUDENT + '/login', data).toPromise();
    }

}
