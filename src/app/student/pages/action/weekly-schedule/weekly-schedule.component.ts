import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { DeviceDetectorService } from 'ngx-device-detector';
import { StudentService } from '../../../../services/student.service';
import { SessionService } from '../../../../services/session.service';
import { GeneralService } from '../../../../services/general.service';
import { AssistanceService } from '../../../../services/assistance.service';
import { CalendarDateFormatter, CalendarView, CalendarEventAction, CalendarEvent } from 'angular-calendar';
import { Observable, Subject } from 'rxjs';
import { setHours, setMinutes } from 'date-fns';
import { RealDateTz, RealDate, AddDay, SameDay, DateFixedSO, GetFirstDayWeek, GetFirstDayWeek2, SubstractDay, BetweenDays } from '../../../../helpers/dates';
import * as CryptoJS from 'crypto-js';
import * as moment from 'moment-timezone';
import { first } from 'rxjs/operators';

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
	realDate = RealDateTz();
	realHourStart;
	public loading = false;
	realHourEnd;
	offsetHour = 1000 * 60 * 10;
  	// public dateMoment = moment().tz('America/Lima').format('dddd, D MMMM YYYY HH:mm:ss');

	virtualRoom: any = {
		"PSTGR": "https://aulavirtualposgrado.cientifica.edu.pe/",
		"ESPEC": "https://aulavirtualposgrado.cientifica.edu.pe/",
		"PREGR": "https://aulavirtualcpe.cientifica.edu.pe/",
		"CIDIO": "https://aulavirtualcpe.cientifica.edu.pe/",
		"CINVE": "https://aulavirtualcpe.cientifica.edu.pe/",
		"TITPR": "https://aulavirtualcpe.cientifica.edu.pe/",
		"ECONT": "https://aulavirtualcpe.cientifica.edu.pe/",
		"PREUN": "https://aulavirtualcpe.cientifica.edu.pe/",
		"NEWSTRM": "https://cientificamoodle.cientifica.edu.pe/"
	}

	events: CalendarEvent[] = [];
	CalendarView = CalendarView;
	view: CalendarView = CalendarView.Week;
	tzDate = RealDateTz();
	viewDate: Date = DateFixedSO(this.realDate.sDate, this.realDate.sTime);
	refresh: Subject<any> = new Subject();
	hourSegments: number = 2;
	weekStartsOn: number = 0;
	startsWithToday: boolean = true;
	activeDayIsOpen: boolean = true;
	weekendDays: number[] = [0, 6];
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
	realDevice = this.deviceS.getDeviceInfo();

	constructor(private session: SessionService,
		private router: Router,
		private assistanceS: AssistanceService,
		private generalS: GeneralService,
		private deviceS: DeviceDetectorService,
		private studentS: StudentService) { }

	ngOnInit() {
		this.studentS.getAcademicDataStudent(this.session.getItem('emplidSelected'))
			.then(res => {
				this.programs = res.UcsMetodoDatosAcadRespuesta && res.UcsMetodoDatosAcadRespuesta.UcsMetodoDatosAcadRespuesta ? res.UcsMetodoDatosAcadRespuesta.UcsMetodoDatosAcadRespuesta : [];
				if (this.programs.length) {
					this.realProgram = this.programs[0];
					this.getData();
				}
			}, error => { });
	}

	capitalizarPrimeraLetra(str) {
		return str.charAt(0).toUpperCase() + str.slice(1);
	}

	getDateMoment() {
		return this.capitalizarPrimeraLetra(moment().tz('America/Lima').format('dddd, D MMMM YYYY HH:mm'));
	}

	getData() {
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

	goFinalGrades() {
		this.router.navigate(['/estudiante/accion/notas-finales/' + encodeURIComponent(
			(!this.realClass.CLASS_NBR2 || this.realClass.CLASS_NBR2 == '0' ? this.realClass.CLASS_NBR : this.realClass.CLASS_NBR2) + '|' +
			this.realClass.ACAD_CAREER + '|' +
			this.realClass.STRM + '|' +
			this.realClass.CRSE_ID + '|' +
			this.realClass.DESCR
		)]);
	}

	goAssistance() {
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

	getSchedule() {
		this.studentS.getSchedule({ institution: this.realProgram.institucion, strm: this.realProgram.cicloAdmision, emplid: this.session.getItem('emplidSelected') })
			.then(res => {
				this.classDay = res.RES_HR_CLS && res.RES_HR_CLS.RES_HR_CLS_DET ? res.RES_HR_CLS.RES_HR_CLS_DET : [];
				this.closeOpenMonthViewDay();
			}, error => { });
	}

	getVirtualClass() {
		this.studentS.getVirtualClass({ institution: this.realProgram.institucion, strm: this.realProgram.cicloAdmision, emplid: this.session.getItem('emplidSelected') })
			.then(res => {
				this.virtualClass = res.RES_HRS_VIR_CLS && res.RES_HRS_VIR_CLS.COM_HRS_VIR_CLS ? res.RES_HRS_VIR_CLS.COM_HRS_VIR_CLS : [];
			}, error => { })
	}

	preGoMoodle() {
		this.loading = true;
		var realClass = JSON.parse(JSON.stringify(this.realClass));
		realClass.CLASS_ATTEND_DT = realClass.date;
		this.assistanceS.getAssistanceNBR(realClass)
			.then(res => {
				this.realDate = RealDateTz();
				var templt_nbr = res.UCS_ASIST_ALUM_RES && res.UCS_ASIST_ALUM_RES.UCS_ASIST_ALUM_COM && res.UCS_ASIST_ALUM_RES.UCS_ASIST_ALUM_COM[0] ? res.UCS_ASIST_ALUM_RES.UCS_ASIST_ALUM_COM[0].ATTEND_TMPLT_NBR : '';
				var realDate = this.realDate.year + '-' + this.realDate.month + '-' + this.realDate.day;
				var realHourStart = this.realHourStart.year + '-' + this.realHourStart.month + '-' + this.realHourStart.day;
				realClass.EMPLID = this.user.codigoAlumno;
				realClass.ATTEND_TMPLT_NBR = templt_nbr;
				realClass.ATTEND_PRESENT = 'Y';
				realClass.ATTEND_LEFT_EARLY = 'N';
				realClass.ATTEND_TARDY = 'N';
				realClass.ATTEND_REASON = '';
				realClass.platform = this.realDevice.os + ' - ' + this.realDevice.browser;
				var difference = this.realHourStart.timeseconds - this.realDate.timeseconds;
				var difference2 = (this.realHourEnd.timeseconds - this.realHourStart.timeseconds) / 2;
				var difference3 = this.realHourEnd.timeseconds - difference2 - this.realDate.timeseconds;
				if (templt_nbr && (realDate == realHourStart || Math.abs(difference) <= this.offsetHour || (difference3 <= difference2 && difference3 > 0))) {
					if (this.realHourStart.hour + ':' + this.realHourStart.minute == this.realDate.hour + ':' + this.realDate.minute) {
						realClass.STATUS = 'P';
					}
					else if (difference <= this.offsetHour && difference > 0) {
						realClass.ATTEND_LEFT_EARLY = 'Y';
						realClass.STATUS = 'E';
					}
					else if ((difference >= -this.offsetHour && difference < 0) || (difference3 <= difference2 && difference3 > 0)) {
						realClass.ATTEND_TARDY = 'Y';
						realClass.STATUS = 'L';
					}
					else {
						realClass.STATUS = 'ER';
					}
				}
				else {
					realClass.STATUS = 'ER';
				}

				this.assistanceS.saveAssistance(realClass)
					.then(res => {
						this.goMoodle();
					}, error => { this.goMoodle(); });
			}, error => { this.goMoodle(); });
		setTimeout(() => {
			this.loading = false;
		}, 15000);
	}

	goMoodle() {
		var emplid = this.student.codigoAlumno;
		let url = '';
		if (this.realClass.INSTITUTION != 'PSTGR' && this.realClass.INSTITUTION != 'ESPEC') {
			var rdate = Math.floor(Date.now() / 1000);
			emplid = encodeURIComponent(CryptoJS.AES.encrypt(JSON.stringify(this.student.codigoAlumno + '//' + rdate), 'Educad123', { format: this.generalS.formatJsonCrypto }).toString());
		}
		if (this.realClass["STRM"] == '1072' || this.realClass["STRM"] == '1073' || this.realClass["STRM"] == '1117' || this.realClass["STRM"] == '1118' || this.realClass["STRM"] == '1156' || this.realClass["STRM"] == '1157' || this.realClass["STRM"] == '2220' || this.realClass["STRM"] == '2222' || this.realClass["STRM"] == '2225' || this.realClass["STRM"] == '2228' || this.realClass["STRM"] == '2235' || this.realClass["STRM"] == '2237' || this.realClass["STRM"] == '2238' || this.realClass["STRM"] == '2210' || this.realClass["STRM"] == '2224' || this.realClass["STRM"] == '0965' || this.realClass["STRM"] == '2236' || this.realClass["STRM"] == '1031' || this.realClass["STRM"] == '1128' || this.realClass["STRM"] == '2221' || this.realClass["STRM"] == '1030' || this.realClass["STRM"] == '2228' || this.realClass["STRM"] == '2226' || this.realClass["STRM"] == '1116' || this.realClass["STRM"] == '2239' || this.realClass["STRM"] == '1125' || this.realClass["STRM"] == '1081' || this.realClass["STRM"] == '2240') {
			url = this.virtualRoom[this.realClass.INSTITUTION] + 'local/wseducad/auth/sso.php?strm=' + this.realClass.STRM + '&class=' + (this.realClass.CLASS_NBR2 == '0' || !this.realClass.CLASS_NBR2 ? this.realClass.CLASS_NBR : this.realClass.CLASS_NBR2) + '&emplid=' + emplid;
		} else {
			if(this.realClass.INSTITUTION == 'PSTGR' || this.realClass.INSTITUTION == 'ESPEC'){
				url = this.virtualRoom["PSTGR"] + 'local/wseducad/auth/sso.php?strm=' + this.realClass.STRM + '&class=' + (this.realClass.CLASS_NBR2 == '0' || !this.realClass.CLASS_NBR2 ? this.realClass.CLASS_NBR : this.realClass.CLASS_NBR2) + '&emplid=' + emplid;
			} else {
				url = this.virtualRoom["NEWSTRM"] + 'local/wseducad/auth/sso.php?strm=' + this.realClass.STRM + '&class=' + (this.realClass.CLASS_NBR2 == '0' || !this.realClass.CLASS_NBR2 ? this.realClass.CLASS_NBR : this.realClass.CLASS_NBR2) + '&emplid=' + emplid;
			}
		}
		this.openTabZoom(url);
	}
	
	openTabZoom(res) {
		let link = res.replace(/<\/?[^>]+(>|$)/g, "");
		let a = document.createElement("a");
		a.setAttribute('style', 'display: none');
		a.href = link;
		a.target = '_blank';
		a.click();
		window.URL.revokeObjectURL(link);
		a.remove();
	}

	closeOpenMonthViewDay() {
		var firstDate = GetFirstDayWeek(this.viewDate);
		var days = {
			MON: RealDate(firstDate),
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
			for (var kDay in days) {
				if (classD[kDay] == 'Y') {
					if (SameDay(classD.FECH_INI, days[kDay])) {
						var rDay = days[kDay].year + '-' + days[kDay].month + '-' + days[kDay].day;
						classD.date = rDay;
						if (!objEvents[rDay + ' ' + classD.MEETING_TIME_START + ' ' + classD.CRSE_ID]) {
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
		start = DateFixedSO(rDay, MEETING_TIME_START);
		end = DateFixedSO(rDay, MEETING_TIME_END);
		return { start, end };
	}

	segmentClicked(type, segment) {

	}

	eventClicked(event, modal) {
		modal.open();
		this.realModal = modal;
		this.realClass = event.meta;
		this.realHourStart = RealDate(event.start);
		this.realHourEnd = RealDate(event.end);
	}

	ngOnDestroy() {
		if (this.realModal) this.realModal.close();
	}
}