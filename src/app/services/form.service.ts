import { Injectable } from '@angular/core';
import { AppSettings } from '../app.settings';
import { ToastrService } from 'ngx-toastr';
import { ValidationService } from './validation.service';
import { FormBuilder, FormGroup, Validators, ValidationErrors } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class FormService {

  	constructor( private toastr: ToastrService, ) { }

 	public controlErrors(form) {
	    Object.keys(form.controls).forEach(key => {
				const controlErrors: ValidationErrors = form.get(key).errors;
				 	if (controlErrors != null) {
    			Object.keys(controlErrors).forEach(keyError => {
					this.toastr.error(AppSettings.STRINGS[key] + ': ' + (ValidationService.getValidatorErrorMessage(keyError) == undefined?'Inválido':ValidationService.getValidatorErrorMessage(keyError)) );
    			});
  			}
		});
	}
}
