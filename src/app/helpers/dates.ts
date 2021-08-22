import { AppSettings } from '../app.settings';
import * as moment from 'moment-timezone';

export function RealDateTz(d = null, timezone = "America/Lima"){
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
		toText: '',
		sDate: '',
		sTime: '',
		localDate: null,
		sdtz: ''
	};
	var date = d?d:Date.now();
	var localDate = new Date(date);
    var sdtz = new Date(date).toLocaleString('en-US', {timeZone: "America/Lima"});
    real.sdtz = sdtz;
    real.localDate = localDate;
    const parts = sdtz.split(', ');
    const partsDate = parts[0].split('/');
    const parts2 = parts[1].split(' ');
    const partsHour = parts2[0].split(':');
	real.year = partsDate[2];
	let month = partsDate[0];
	real.month = parseInt(month) > 9?month:'0' + month;
	let day = partsDate[1];
	real.day = parseInt(day) > 9?day:'0' + day;
	let hour = parseInt(partsHour[0]) + (parts2[1] && parts2[1] == 'PM' && parseInt(partsHour[0]) != 12?12:0);
	real.hour = (hour < 10?'0':'') + hour;
	real.thour = hour >= 12?'PM':'AM';
	real.hour12 = hour % 12;
	real.hour12 = real.hour12 == 0?12:real.hour12;
	real.minute = partsHour[1];
	real.second = partsHour[2];
	real.nday = AppSettings.NAMES_DAYS[new Date(sdtz).getDay()];
	real.nmonth = AppSettings.NAMES_MONTH[(Number(real.month) - 1)];
	real.timeseconds = localDate.getTime();
	real.sDate = real.year + '-' + real.month + '-' + real.day;
	real.sTime = real.hour + ':' + real.minute + ':' + real.second;
	real.toText = real.year + '-' + real.month + '-' + real.day + ' ' + real.hour + ':' + real.minute + ':' + real.second;
	return real;
}

export function RealDate(d = null){
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
	};
	var date = d?d:(new Date());
	real.year = date.getFullYear() + '';
	var month = date.getMonth() + 1;
	real.month = (month < 10? '0':'') + month;
	var day = date.getDate();
	real.day = (day < 10? '0':'') + day;
	var hour = date.getHours();
	real.thour = hour >= 12?'PM':'AM';
	real.hour12 = hour % 12;
	real.hour12 = real.hour12 == 0?12:real.hour12;
	real.hour = (hour < 10? '0':'') + hour;
	var minute = date.getMinutes();
	real.minute = (minute < 10? '0':'') + minute;
	var second = date.getSeconds();
	real.second = (second < 10? '0':'') + second;
	real.nday = AppSettings.NAMES_DAYS[date.getDay()];
	real.nmonth = AppSettings.NAMES_MONTH[month - 1];
	real.timeseconds = date.getTime();
	return real;
}

export function DateFixedSO(sDay, sTime){
	const ua = navigator.userAgent.toLowerCase();
	let start;
	if (ua.indexOf('windows') !== -1) {
		start = new Date(sDay + ' ' + sTime);
	} else {
		var date = sDay.split('-');
		start = new Date(parseInt(date[1]) + '/' + parseInt(date[2]) + '/' + date[0] + ', ' + sTime);
	}
	return start;
}

export function DateFixedSOTz(sDay, sTime, timezone = 'GMT-0500'){
	const ua = navigator.userAgent.toLowerCase();
	let start;
	if (ua.indexOf('windows') !== -1) {
		start = new Date(sDay + ' ' + sTime + ' ' + timezone);
	} else {
		var date = sDay.split('-');
		start = new Date(parseInt(date[1]) + '/' + parseInt(date[2]) + '/' + date[0] + ', ' + sTime + ' ' + timezone);
	}
	return start;
}

export function GetHour(pHour: string): string {
	const arrHour = pHour.split(':');
	let hour = Number(arrHour[0]);
	hour += 5;
	const hourModified = Pad(hour, 2);
	const minute = arrHour[1];
	const second = arrHour[2];
	return `${hourModified}:${minute}:${second}`;
}

export function GetDay(pDay: string, pHour: string): string {
	let rDate = `${pDay}T${pHour}`;
	const arrHour = pHour.split(':');
	let hour = Number(arrHour[0]);
	if (hour > 23) {
		const arrDate = pDay.split('-'); // 2020-07-06
		let day = Number(arrDate[2]);
		day += 1;
		const dayModified = Pad(day, 2);
		const month = arrDate[1];
		const year = arrDate[0];
		const vDate = `${year}-${month}-${dayModified}`;
		hour -= 24;
		const hourModified = Pad(hour, 2);
		const minute = arrHour[1];
		const second = arrHour[2];
		const vHour = `${hourModified}:${minute}:${second}`;
		rDate = `${vDate}T${vHour}`;
	}
	return rDate;
}

export function Pad(num: number, size: number): string {
	let s = num + '';
	while (s.length < size) { s = '0' + s; }
	return s;
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