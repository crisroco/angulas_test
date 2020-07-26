import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { AppSettings } from '../app.settings';
import { SessionService } from '../services/session.service';
import * as CryptoJS from 'crypto-js';

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

	public formatJsonCrypto = {
	  'stringify': function (cipherParams) {
	    var j:any = { ct: cipherParams.ciphertext.toString(CryptoJS.enc.Base64) }
	    if (cipherParams.iv) j.iv = cipherParams.iv.toString()
	    if (cipherParams.salt) j.s = cipherParams.salt.toString()
	    return JSON.stringify(j).replace(/\s/g, '')
	  },
	  'parse': function (jsonStr) {
	    var j = JSON.parse(jsonStr)
	    var cipherParams = CryptoJS.lib.CipherParams.create({ ciphertext: CryptoJS.enc.Base64.parse(j.ct) })
	    if (j.iv) cipherParams.iv = CryptoJS.enc.Hex.parse(j.iv)
	    if (j.s) cipherParams.salt = CryptoJS.enc.Hex.parse(j.s)
	    return cipherParams
	  }
	}

}