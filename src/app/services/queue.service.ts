import { Injectable } from '@angular/core';
import { AppSettings } from '../app.settings';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class QueueService {

	constructor(private http: HttpClient) { }

	public authEncrypt(data) {
		return this.http.post( AppSettings.WSURL + 'api/alumno/auth/encrypt', data);
	}

	public authDecrypt(data) {
		return this.http.post( AppSettings.WSURL + 'api/alumno/auth/decrypt', data);
	}
}