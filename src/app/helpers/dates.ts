import { AppSettings } from '../app.settings';
import * as moment from 'moment-timezone';

export function RealDate(d = null, timezone = "America/Lima"){
	var real = {
		year: '',
		month: '',
		day: '',
		hour: '',
		hour12: 0,
		thour: '',
		minute: '',
		second: '',
		nday: '',
		nmonth: '',
		timeseconds: 0,
		toText: ''
	};
	var date = d?d:Date.now();
	var localDate = new Date(date);
    var sdtz = new Date(date).toLocaleString('en-US', {timeZone: "America/Lima"});
    const parts = sdtz.split(', ');
    const partsDate = parts[0].split('/');
    const parts2 = parts[1].split(' ');
    const partsHour = parts2[0].split(':');
	real.year = partsDate[2];
	real.month = partsDate[0];
	real.day = partsDate[1];
	let hour = parseInt(partsHour[0]) + (parts2[1] && parts2[1] == 'PM'?12:0);
	real.hour = (hour < 10?'0':'') + hour;
	real.thour = hour >= 12?'PM':'AM';
	real.hour12 = hour % 12;
	real.hour12 = real.hour12 == 0?12:real.hour12;
	real.minute = partsHour[1];
	real.second = partsHour[2];
	real.nday = AppSettings.NAMES_DAYS[new Date(sdtz).getDay()];
	real.nmonth = AppSettings.NAMES_MONTH[(Number(real.month) - 1)];
	real.timeseconds = localDate.getTime();
	real.toText = real.year + '-' + real.month + '-' + real.day + ' ' + real.hour + ':' + real.minute + ':' + real.second;
	return real;
}



export function GetFirstDayWeek(d) {
	d = new Date(d);
	var day = d.getDay(),
	diff = d.getDate() - day + (day == 0 ? -6:1);
	return new Date(d.setDate(diff));
}

export function GetFirstDayWeek2(d) {
	d = new Date(d);
	var day = d.getDay(),
	diff = d.getDate() - day;
	return new Date(d.setDate(diff));
}


export function GetLastDayWeek(d) {
	d = new Date(d);
	var day = d.getDay(),
	diff = d.getDate() + 6 - (day - 1);
	return new Date(d.setDate(diff));
}

export function AddDay(d, numDay){
	d = new Date(d);
	var diff = d.getDate() + numDay;
	return new Date(d.setDate(diff));
}

export function SubstractDay(d, numDay){
	d = new Date(d);
	var diff = d.getDate() - numDay;
	return new Date(d.setDate(diff));
}

//Horario curso matriculado(F_INI, F_FIN, day)
export function BetweenDays(first, last, day){
	if (first == last) {
		return true;
	}
	var sDay = day.year + '-' + day.month + '-' + day.day + ' ' + day.hour + ':' + day.minute + ':' + day.second;
	if(sDay < first || sDay > last) return false;
	else return true;
}

export function SameDay(stDate, day){
	var sDay = day.year + '-' + day.month + '-' + day.day;
	if(sDay == stDate) return true;
	else return false;
}