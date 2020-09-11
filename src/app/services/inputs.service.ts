import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class InputsService {

  	constructor() { }

  	public OnlyNumbers(evt) {
	  var theEvent = evt || window.event;
	  if (theEvent.type === 'paste') {
	      key = evt.clipboardData.getData('text/plain');
	  } else {
	      var key = theEvent.keyCode || theEvent.which;
	      key = String.fromCharCode(key);
	  }
	  var regex = /[0-9]|\./;
	  if( !regex.test(key) ) {
	    theEvent.returnValue = false;
	    if(theEvent.preventDefault) theEvent.preventDefault();
	  }
	}

	public MinMaxNumber(evt, number, min, max){
	  var theEvent = evt || window.event;
	  if(theEvent.target.value < min) { number = min; }
	  else if(theEvent.target.value > max) { number = max; }
	  else if(theEvent.target.value == '') { number = min; }
	  var parts = (number + '').split('.');
	  if(parts.length > 1) { number = Number(parts[0]) + '.' + (parts[1]?parts[1]:''); }
	  else { number = Number(number); }
	  theEvent.target.value = number;
	  return number;
	}

	public MaxLengthString(evt, str, max){
	  var theEvent = evt || window.event;
	  if( theEvent.target.value.length >= max ) { theEvent.target.value = theEvent.target.value.substring(0, max); str.substring(0, max); }
	  return str;
	}

	public UpperCase(evt, str){
	  var theEvent = evt || window.event;
	  theEvent.target.value = theEvent.target.value.toUpperCase();
	  return str.toUpperCase();
	}
}
