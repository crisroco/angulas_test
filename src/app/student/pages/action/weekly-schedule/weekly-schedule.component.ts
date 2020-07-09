import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { DeviceDetectorService } from 'ngx-device-detector';
import { StudentService } from '../../../../services/student.service';
import { SessionService } from '../../../../services/session.service';
import { CalendarDateFormatter, CalendarView, CalendarEventAction, CalendarEvent } from 'angular-calendar';
import { Observable, Subject } from 'rxjs';
import { setHours, setMinutes } from 'date-fns';
import { RealDate, AddDay, GetFirstDayWeek, GetFirstDayWeek2, SubstractDay, BetweenDays } from '../../../../helpers/dates';

@Component({
  selector: 'app-weekly-schedule',
  templateUrl: './weekly-schedule.component.html',
  styleUrls: ['./weekly-schedule.component.scss']
})
export class WeeklyScheduleComponent implements OnInit {
	user: any = this.session.getObject('user');
	student: any = this.session.getObject('student');
	realProgram: any;
	programs: Array<any>;
	classDay: Array<any>;
	realClass: any;
	virtualClass: Array<any>;
	realModal: any;

	virtualRoom: any = {
		"PSTGR": "https://aulavirtualposgrado.cientifica.edu.pe/",
	    "ESPEC": "https://aulavirtualposgrado.cientifica.edu.pe/",
	    "PREGR": "https://aulavirtualcpe.cientifica.edu.pe/",
	    "CIDIO": "https://aulavirtualcpe.cientifica.edu.pe/",
	    "CINVE": "https://aulavirtualcpe.cientifica.edu.pe/",
	    "TITPR": "https://aulavirtualcpe.cientifica.edu.pe/",
	    "ECONT": "https://aulavirtualcpe.cientifica.edu.pe/",
	    "PREUN": "https://aulavirtualcpe.cientifica.edu.pe/"
	}

	events:CalendarEvent[] = [];
	CalendarView = CalendarView;
    view: CalendarView = CalendarView.Week;
    viewDate: Date = new Date();
    refresh: Subject<any> = new Subject();
    locale: string = 'en';
    hourSegments: number = 2;
    weekStartsOn: number = 0;
    startsWithToday: boolean = true;
    activeDayIsOpen: boolean = true;
    weekendDays: number[] = [0,6];
    dayStartHour: number = 7;
    dayEndHour: number = 23;
    dayEndMinute: number = 59;
    dayStartMinute: number = 0;
    // minDate: Date = new Date();
    // maxDate: Date = endOfDay(addMonths(new Date(), 1));
    dayModifier: Function;
    hourModifier: Function;
    segmentModifier: Function;
    prevBtnDisabled: boolean = false;
    nextBtnDisabled: boolean = false;

	constructor(private session: SessionService,
		private router: Router,
		private studentS: StudentService) { }

	ngOnInit() {
		this.studentS.getAcademicDataStudent({code: this.user.codigoAlumno})
		.then(res => {
			this.programs = res.UcsMetodoDatosAcadRespuesta && res.UcsMetodoDatosAcadRespuesta.UcsMetodoDatosAcadRespuesta?res.UcsMetodoDatosAcadRespuesta.UcsMetodoDatosAcadRespuesta:[];
			if(this.programs.length){
				this.realProgram = this.programs[0];
				this.getData();
			}
		}, error => { });
	}

	getData(){
		this.getSchedule();
		this.getVirtualClass();
	}

	actions: CalendarEventAction[] = [
		{
			label: '<i class="fas fa-fw fa-pencil-alt"></i>',
			a11yLabel: 'Edit',
			onClick: ({ event }: { event: CalendarEvent }): void => {
				this.segmentClicked('Edited', event);
			},
		},
		{
			label: '<i class="fas fa-fw fa-trash-alt"></i>',
			a11yLabel: 'Delete',
			onClick: ({ event }: { event: CalendarEvent }): void => {
				this.events = this.events.filter((iEvent) => iEvent !== event);
				this.segmentClicked('Deleted', event);
			},
		},
	];

	goFinalGrades(){
		this.router.navigate(['/estudiante/accion/notas-finales/' + encodeURIComponent(
		      (!this.realClass.CLASS_NBR2 || this.realClass.CLASS_NBR2 == '0'?this.realClass.CLASS_NBR:this.realClass.CLASS_NBR2) + '|' + 
		      this.realClass.ACAD_CAREER + '|' + 
		      this.realClass.STRM + '|' +
		      this.realClass.CRSE_ID + '|' + 
		      this.realClass.DESCR
	    )]);
	}

	goAssistance(){
		this.router.navigate(['/estudiante/accion/asistencia/' + encodeURIComponent(
			this.realClass.INSTITUTION + '|' +
			this.realClass.STRM + '|' +
			this.realClass.CLASS_NBR + '|' +
			this.realClass.DESCR + '|' +
			this.realClass.DOCENTE + '|' +
			this.realClass.CLASS_SECTION + '|' +
			this.realClass.SSR_COMPONENT
		)]);
	}

	getSchedule(){
		this.studentS.getSchedule({code: this.user.codigoAlumno, institution: this.realProgram.institucion, strm: this.realProgram.cicloAdmision})
		.then(res => {
			this.classDay = res.RES_HR_CLS && res.RES_HR_CLS.RES_HR_CLS_DET?res.RES_HR_CLS.RES_HR_CLS_DET:[];
			this.closeOpenMonthViewDay();
		}, error => { });
	}

	getVirtualClass(){
		this.studentS.getVirtualClass({code: this.user.codigoAlumno, institution: this.realProgram.institucion, strm: this.realProgram.cicloAdmision})
		.then(res => {
			this.virtualClass = res.RES_HRS_VIR_CLS && res.RES_HRS_VIR_CLS.COM_HRS_VIR_CLS?res.RES_HRS_VIR_CLS.COM_HRS_VIR_CLS:[];
		}, error => { })
	}

	closeOpenMonthViewDay(){
		var firstDate = GetFirstDayWeek(this.viewDate);
		var days = {
			MON:  RealDate(firstDate),
			TUES: RealDate(AddDay(firstDate, 1)),
			WED: RealDate(AddDay(firstDate, 2)),
			THURS: RealDate(AddDay(firstDate, 3)),
			FRI: RealDate(AddDay(firstDate, 4)),
			SAT: RealDate(AddDay(firstDate, 5)),
			SUN: RealDate(AddDay(firstDate, 6)),
		}
		var events = [];
		var objEvents = {};
		let dates: any = {};
		this.classDay.forEach(classD => {
			for(var kDay in days){
				if(classD[kDay] == 'Y'){
					if(BetweenDays(classD.FECH_INI, classD.FECH_FIN, days[kDay])){
						var rDay = days[kDay].year + '-' + days[kDay].month + '-' + days[kDay].day;
						classD.date = rDay;
						if(!objEvents[rDay + ' ' + classD.MEETING_TIME_START + ' ' + classD.CRSE_ID]){
							dates = this.getDates(rDay, classD.MEETING_TIME_START, classD.MEETING_TIME_END);
							events.push({
								start: dates.start,//new Date(rDay + ' ' + classD.MEETING_TIME_START),
								end: dates.end,//new Date(rDay + ' ' + classD.MEETING_TIME_END),
								title: classD.MEETING_TIME_START + '-' + classD.MEETING_TIME_END + '<br>' + classD.DESCR,
								actions: this.actions,
								allDay: false,
								resizable: {
									beforeStart: true,
									afterEnd: true,
								},
								meta: classD,
							});
							objEvents[rDay + ' ' + classD.MEETING_TIME_START + ' ' + classD.CRSE_ID] = true;
						}
					}
				}
			}
		});
		this.events = events;
	}

	getDates(rDay: string, MEETING_TIME_START: string, MEETING_TIME_END: string) {
		let start: Date;
		let end: Date;
		const ua = navigator.userAgent.toLowerCase();
		if (ua.indexOf('safari') !== -1) {
			if (ua.indexOf('chrome') > -1) {
				start = new Date(rDay + 'T' + MEETING_TIME_START);
				end = new Date(rDay + 'T' + MEETING_TIME_END);
			} else {
				start = new Date(this.getDay(rDay, this.getHour(MEETING_TIME_START)));
				end = new Date(this.getDay(rDay, this.getHour(MEETING_TIME_END)));
			}
		} else {
			start = new Date(rDay + 'T' + MEETING_TIME_START);
			end = new Date(rDay + 'T' + MEETING_TIME_END);
		}

		return { start, end };
	}

	getHour(pHour: string): string {

		const arrHour = pHour.split(':');
		let hour =  Number(arrHour[0]);
		hour += 5;
		const hourModified = this.pad(hour, 2);
		const minute =  arrHour[1];
		const second =  arrHour[2];

		return `${hourModified}:${minute}:${second}`;
	}

	getDay(pDay: string, pHour: string): string {

		let rDate = `${pDay}T${pHour}`;

		const arrHour = pHour.split(':');
		let hour =  Number(arrHour[0]);
		if (hour > 23) {

			const arrDate = pDay.split('-'); // 2020-07-06

			let day =  Number(arrDate[2]);
			day += 1;

			const dayModified = this.pad(day, 2);
			const month =  arrDate[1];
			const year =  arrDate[0];

			const vDate = `${year}-${month}-${dayModified}`;

			hour -= 24;
			const hourModified = this.pad(hour, 2);
			const minute =  arrHour[1];
			const second =  arrHour[2];

			const vHour = `${hourModified}:${minute}:${second}`;

			rDate = `${vDate}T${vHour}`;
		}
		return rDate;
	}

	pad(num: number, size: number): string {
		let s = num + '';
		while (s.length < size) { s = '0' + s; }
		return s;
	}

	segmentClicked(type, segment){
		
	}

	eventClicked(event, modal){
		modal.open();
		this.realModal = modal;
		this.realClass = event.meta;
		console.log(event);
	}

	ngOnDestroy() {
		if(this.realModal) this.realModal.close();
	}

}
