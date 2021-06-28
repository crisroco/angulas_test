import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { AppSettings } from '../app.settings';
import { GeneralService } from './general.service';
import { Encrypt, GetFormUrlEncoded } from '../helpers/general';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

	constructor(private http: HttpClient, 
		private generalS: GeneralService) { }

    public userLogin(data): Promise<any> {
        return this.http.post(AppSettings.BASE + AppSettings.STUDENT + '/login', data).toPromise();
    }

    public oauthToken(data): Promise<any> {
        return this.http.post(AppSettings.BASE + '/oauth/token', data).toPromise();
    }

    // BackOffice

    public getAccess_ps(base64): Promise<any> {
		let url = AppSettings.ACCESS_PS;
		const data = new FormData();
		data.append('credencial', JSON.stringify(base64));
		return this.http.post(url,data).toPromise();
	}

    public BackOffice(data): Promise<any> {
        return this.http.post(AppSettings.BASE + AppSettings.STUDENT + '/loginBackOffice', data).toPromise();
    }

	public login(params): Promise<any> {
        let date = new Date();
        let d = new Date(date.getFullYear() + '/' + (date.getMonth() + 1) + '/' + date.getDate());
        let timestamp = String(d.getTime());
        let clave = params.user + '&' + params.pass;
        let key = timestamp.slice(0, -3);
        let data = Encrypt(clave, key);
        return this.http.post(AppSettings.LOGIN_TOKEN, GetFormUrlEncoded({ credential: data }), {headers: { 'Content-Type': 'application/x-www-form-urlencoded' }}).toPromise();
    }

    public get_Token_WS_Vacaciones(): Promise<any> {
        return this.http.get(AppSettings.WS_DRUPAL_GENERARTOKEN, {responseType: 'text'}).toPromise();
    }

    public login_WS_Vacaciones(data): Promise<any> {
        return this.http.post(AppSettings.WS_DRUPAL_LOGINVACACIONES, data, { headers: this.generalS.makeHeader(false, 'token_vac')}).toPromise();
    }

	public log_sise(data: any): Promise<any> {
        return this.http.post(AppSettings.BASE_SISE_CODEIGNITER + '/dashboard/log_sise', data).toPromise();
    }

	public getIPAddress(): Promise<any> { return this.http.get("http://api.ipify.org/?format=json").toPromise(); }

}