import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { DeviceDetectorService } from 'ngx-device-detector';
import { StudentService } from '../../../../services/student.service';
import { SessionService } from '../../../../services/session.service';
import { DynamicSort } from '../../../../helpers/arrays';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

@Component({
  selector: 'app-academic-conditions',
  templateUrl: './academic-conditions.component.html',
  styleUrls: ['./academic-conditions.component.scss']
})
export class AcademicConditionsComponent implements OnInit {
	user: any = this.session.getObject('user');
	student: any = this.session.getObject('student');
	realProgram: any;
	programs: Array<any>;
	cycles: Array<any>;
	globalStatistics:any;
	requirements:any;
	weightedAverage: number = 0;
	loading = false;

	constructor(private session: SessionService,
		public toastS: ToastrService,
		private studentS: StudentService) { }

	ngOnInit() {
		this.studentS.getAcademicDataStudent(this.session.getItem('emplidSelected'))
		.then(res => {
			this.programs = res.UcsMetodoDatosAcadRespuesta && res.UcsMetodoDatosAcadRespuesta.UcsMetodoDatosAcadRespuesta?res.UcsMetodoDatosAcadRespuesta.UcsMetodoDatosAcadRespuesta:[];
			if(this.programs.length){
				this.realProgram = this.programs[0];
				this.getAcademicConditions();
			}
		}, error => { });
	}

	getAcademicConditions(){
		this.studentS.getAcademicConditions({institution: this.realProgram.institucion, career: this.realProgram.codigoGrado, plain: this.realProgram.codigoPlan, program: this.realProgram.codigoPrograma, emplid: this.session.getItem('emplidSelected') })
		.then(res => {
			this.cycles = [];
			var objCycles = {
				'1': {
					courses: [],
					name: 'Ciclo: 1'
				},
				'2': {
					courses: [],
					name: 'Ciclo: 2'
				},
				'3': {
					courses: [],
					name: 'Ciclo: 3'
				},
				'4': {
					courses: [],
					name: 'Ciclo: 4'
				},
				'5': {
					courses: [],
					name: 'Ciclo: 5'
				},
				'6': {
					courses: [],
					name: 'Ciclo: 6'
				},
				'7': {
					courses: [],
					name: 'Ciclo: 7'
				},
				'8': {
					courses: [],
					name: 'Ciclo: 8'
				},
				'9': {
					courses: [],
					name: 'Ciclo: 9'
				},
				'10': {
					courses: [],
					name: 'Ciclo: 10'
				},
				'11': {
					courses: [],
					name: 'Ciclo: 11'
				},
				'12': {
					courses: [],
					name: 'Ciclo: 12'
				},
				'13': {
					courses: [],
					name: 'Ciclo: 13'
				},
				'14': {
					courses: [],
					name: 'Ciclo: 14'
				},
				'15': {
					courses: [],
					name: 'Ciclo: 15'
				},
				'ELECTIVOS': {
					courses: [],
					name: 'Cursos Electivos'
				}
			};
			var tcycles = res.RES_COND_ACAD && res.RES_COND_ACAD.RES_COND_ACAD_DET?res.RES_COND_ACAD.RES_COND_ACAD_DET:[];
			if(tcycles.length){
				for (var i = tcycles.length - 1; i >= 0; i--) {
					// tcycles[i].UCS_CICLO = (tcycles[i].UCS_CICLO > 10? 11 : tcycles[i].UCS_CICLO);
					if (objCycles[tcycles[i].LVF_CARACTER]) {
						objCycles['ELECTIVOS'].courses.push(tcycles[i]);
					} else {
						if(objCycles[tcycles[i].UCS_CICLO]){
							objCycles[tcycles[i].UCS_CICLO].courses.push(tcycles[i]);
						}
					}
				}
				for( var kcycle in objCycles){
					objCycles[kcycle].courses.sort(this.dynamicSortMultiple(["DESCR2", "DESCR1"]));
					this.cycles.push(objCycles[kcycle]);
				}
			}
			this.getGlobalStatistics();
			this.getRequirements();
			this.getWeightedAverage();
		}, error => { });
	}

	getGlobalStatistics(){
		this.loading = true;
		this.studentS.getGlobalStatistics({institution: this.realProgram.institucion, career: this.realProgram.codigoGrado, plain: this.realProgram.codigoPlan, program: this.realProgram.codigoPrograma, emplid: this.session.getItem('emplidSelected') })
		.then(res => {
			this.globalStatistics = res.UCS_REST_VAL_UNID_EGRE_RES && res.UCS_REST_VAL_UNID_EGRE_RES.UCS_REST_VAL_UNID_EGRE_COM && res.UCS_REST_VAL_UNID_EGRE_RES.UCS_REST_VAL_UNID_EGRE_COM[0]?res.UCS_REST_VAL_UNID_EGRE_RES.UCS_REST_VAL_UNID_EGRE_COM[0]:null;
			if(this.globalStatistics){
				this.globalStatistics.UNITS_REPEAT_LIMIT = parseInt(this.globalStatistics.UNITS_REPEAT_LIMIT);
				this.globalStatistics.UCS_OBLI_APROBADAS = parseInt(this.globalStatistics.UCS_OBLI_APROBADAS);
				this.globalStatistics.UCS_MAX_UNID_LEC = parseInt(this.globalStatistics.UCS_MAX_UNID_LEC);
				this.globalStatistics.UCS_ELEC_APROBADAS = parseInt(this.globalStatistics.UCS_ELEC_APROBADAS);
				this.globalStatistics.requiredProgress = this.globalStatistics.UNITS_REPEAT_LIMIT && this.globalStatistics.UCS_OBLI_APROBADAS?Math.round(this.globalStatistics.UCS_OBLI_APROBADAS / this.globalStatistics.UNITS_REPEAT_LIMIT * 10000)/100:0;
				this.globalStatistics.electiveProgress = this.globalStatistics.UCS_MAX_UNID_LEC && this.globalStatistics.UCS_ELEC_APROBADAS?Math.round(this.globalStatistics.UCS_ELEC_APROBADAS / this.globalStatistics.UCS_MAX_UNID_LEC * 10000)/100:0;
			}
			this.loading = false;
		}, error => { this.loading = false; });
	}

	getRequirements(){
		this.studentS.getRequirements({institution: this.realProgram.institucion, career: this.realProgram.codigoGrado, plain: this.realProgram.codigoPlan, program: this.realProgram.codigoPrograma, emplid: this.session.getItem('emplidSelected') })
		.then(res => {
			this.requirements = res.UCS_REST_VAL_REQ_EGRE_RES && res.UCS_REST_VAL_REQ_EGRE_RES.UCS_REST_VAL_REQ_EGRE_COM && res.UCS_REST_VAL_REQ_EGRE_RES.UCS_REST_VAL_REQ_EGRE_COM[0]?res.UCS_REST_VAL_REQ_EGRE_RES.UCS_REST_VAL_REQ_EGRE_COM[0]:null;
			if(this.requirements){
				var ingReq = 0;
				var ingReg = 0;
				for (var i = this.requirements.NIV_ING_REQ.length - 1; i >= 0; i--) {
					if(this.requirements.NIV_ING_REQ[i] == 'Y'){
						ingReq++;
					}
				}//
				for (var i = this.requirements.NIV_ING_REG.length - 1; i >= 0; i--) {
					if(this.requirements.NIV_ING_REG[i] == 'Y'){
						ingReg++;
					}
				}
				this.requirements.englishProgress = ingReg && ingReq?Math.round(ingReg / ingReq * 10000)/100:0;
				var secReq = 0;
				var secReg = 0;
				for (var i = this.requirements.NIV_ING_REQ.length - 1; i >= 0; i--) {
					if(this.requirements.NIV_ING_REQ[i] == 'Y'){
						secReq++;
					}
				}//
				for (var i = this.requirements.NIV_ING_REG.length - 1; i >= 0; i--) {
					if(this.requirements.NIV_ING_REG[i] == 'Y'){
						secReg++;
					}
				}
				this.requirements.secondProgress = secReg && secReq?Math.round(secReg / secReq * 10000)/100:0;
				if (this.requirements.HORAS_EXTRA_REQ == 0) {
					this.requirements.extraProgress = '---';
				} else {
					this.requirements.extraProgress = this.requirements.HORAS_EXTRA_ALUM && this.requirements.HORAS_EXTRA_REQ?Math.round(this.requirements.HORAS_EXTRA_ALUM / this.requirements.HORAS_EXTRA_REQ * 10000)/100:0;
					this.requirements.extraProgress = this.requirements.extraProgress + '%';
				}
				if(this.requirements.HORAS_PRACTICAS_REQ == 0){
					this.requirements.preProgress = '---';
				} else {
					this.requirements.preProgress = this.requirements.HORAS_PRACTICAS_REQ && this.requirements.HORAS_PRACTICAS_REQ?Math.round(this.requirements.HORAS_PRACTICAS_ALUM / this.requirements.HORAS_PRACTICAS_REQ * 10000)/100:0;
					this.requirements.preProgress = this.requirements.preProgress + '%';
				}
			}
		}, error => { });
	}

	getWeightedAverage(){
		this.studentS.getWeightedAverage(this.realProgram.codigoGrado, this.realProgram.codigoPrograma, this.session.getItem('emplidSelected'))
		.then(res => {
			this.weightedAverage = res.UCS_REST_PROMEDIO_RSP && res.UCS_REST_PROMEDIO_RSP.UCS_REST_PROMEDIO_COM && res.UCS_REST_PROMEDIO_RSP.UCS_REST_PROMEDIO_COM[0]?res.UCS_REST_PROMEDIO_RSP.UCS_REST_PROMEDIO_COM[0]:0;
		}, error => { });
	}

	dynamicSort(property) {
	    var sortOrder = 1;
	    if(property[0] === "-") {
	        sortOrder = -1;
	        property = property.substr(1);
	    }
	    return (a,b) => {
	        /* next line works with strings and numbers, 
	         * and you may want to customize it to your needs
	         */
	        var result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
	        return result * sortOrder;
	    }
	}

	dynamicSortMultiple(args) {
	    var props = args;
	    return (obj1, obj2) => {
	        var i = 0, result = 0, numberOfProperties = props.length;
	        while(result === 0 && i < numberOfProperties) {
	            result = this.dynamicSort(props[i])(obj1, obj2);
	            i++;
	        }
	        return result;
	    }
	}

	preparatePDF(){
		this.loading = true;
		this.studentS.getAcademicStatus({institution: this.realProgram.institucion, career: this.realProgram.codigoGrado, plain: this.realProgram.codigoPlan, program: this.realProgram.codigoPrograma, emplid: this.session.getItem('emplidSelected') })
		.then(res => {
			if (res.UCS_REST_RECORD_ACAD_RES && !res.UCS_REST_RECORD_ACAD_RES.UCS_REST_RECORD_ACAD_COM) {
				this.toastS.error('Hubo un error al generar el PDF');
				this.loading = false;
				return
			}
			var objSemester = {};
			var arSemester = [];
			let academicStatus: Array<any> = res.UCS_REST_RECORD_ACAD_RES && res.UCS_REST_RECORD_ACAD_RES.UCS_REST_RECORD_ACAD_COM?res.UCS_REST_RECORD_ACAD_RES.UCS_REST_RECORD_ACAD_COM:[];
			academicStatus.forEach((item, index) => {
				if(!objSemester[item.Ccl_Lvo]){
					objSemester[item.Ccl_Lvo] = {
						name: item.Descr_4,
						code: item.Ccl_Lvo,
						courses: []
					}
				}
				objSemester[item.Ccl_Lvo].courses.push(item);
			});
			for(var kSemester in objSemester){
				arSemester.push(objSemester[kSemester]);
			}
			arSemester.sort(DynamicSort('code'));
			this.loading = false;
			this.createPDF(arSemester, academicStatus[0]);
		});
	}

	createPDF(arr: Array<any>, general){
		var doc = new jsPDF('p', 'pt');
		var currentpage = 0;
		var footer = function (data) {
		  if (currentpage < doc.internal.getNumberOfPages()) {
		      doc.setFontSize(10);
		      doc.setFontStyle('normal');
		      doc.text("Copyright © 2019 Todos los derechos reservados.", 30, doc.internal.pageSize.height - 30);
		      currentpage = doc.internal.getNumberOfPages();
		  }
		};
		// var courseTitle = course.DESCR;
		// var gradeClass = course.ACAD_CAREER + ' - ' + course.CLASS_NBR + ' / ' + course.SSR_COMPONENT + ' - ' + course.CLASS_SECTION;
		var realDate = new Date();
		var img = new Image()
		img.src = 'assets/img/cientifica_pdf.png';
		doc.addImage(img, 'png',30, 30, 110, 40)
		// doc.setFontSize(10);
		// doc.text( 'Docente: '+ UpperFirstLetter(this.user.name + ' ' + this.user.surname), 30, 90);
		doc.setFontSize(10);
		doc.text( 'Fecha Imp: ' + realDate.toLocaleString().split(' ')[0], doc.internal.pageSize.width - 30, 45, 'right');
		doc.setFontSize(10);
		doc.text( 'Hora Imp: ' + realDate.toLocaleString().split(' ')[1], doc.internal.pageSize.width - 30, 55, 'right');
		doc.setFontSize(10);
		doc.text( 'Usuario: ' + this.user.email, doc.internal.pageSize.width - 30, 65, 'right');
		doc.setFontSize(25);
		var textTitle = "Registro Académico",
		    xOffset = (doc.internal.pageSize.width / 2) - (doc.getStringUnitWidth(textTitle) * doc.internal.getFontSize() / 2); 
		doc.text(textTitle, xOffset, 95);

		doc.setFontSize(10);
		doc.text( 'Institución Académica:: ', 30, 125, 'left');
		doc.setFontSize(10);
		doc.text( general.Institucion, 190, 125, 'left');
		doc.setFontSize(10);
		doc.text( 'Grado Académico: ', 30, 135, 'left');
		doc.setFontSize(10);
		doc.text( general.Grado, 190, 135, 'left');
		doc.setFontSize(10);
		doc.text( 'Programa Académico: ', 30, 145, 'left');
		doc.setFontSize(10);
		doc.text( general.Descr2, 190, 145, 'left');
		doc.setFontSize(10);
		doc.text( 'Plan Académico: ', 30, 155, 'left');
		doc.setFontSize(10);
		doc.text( general.Descr3, 190, 155, 'left');
		doc.setFontSize(10);
		doc.text( 'ID Alumno: ', 30, 165, 'left');
		doc.setFontSize(10);
		doc.text( general.EMPLID, 190, 165, 'left');
		doc.setFontSize(10);
		doc.text( 'Alumno: ', 30, 175, 'left');
		doc.setFontSize(10);
		doc.text( general.Apellido + ' ' + general.segundo_Apellido + ' ' + general.Nombre, 190, 175, 'left');

		var finalAverage = 0;
		var electivesAprobe = 0;
		var electivesDisaprobe = 0;
		var electivesUnd = 0;
		var requiredsAprobe = 0;
		var requiredsDisaprobe = 0;
		var requiredsUnd = 0;
		var objCourses = {};
		arr.forEach( (item, index) => {
			var offset = 35;
			var offset2 = 45;
			if(index == 0){
				offset = 220;
				offset2 = 230;
			}
			var body = []
			var totalCredits = 0;
			var higherProm = 0;
			// console.log(item);
			item.courses.forEach(item => {
				body.push([item.ID_Curso, item.Descr, (item.Caracter == 0?'Obligatorio':'Electivo'), item.Ciclo, item.Uni_Matrd, item.GRADE, item.Comentario]);
				totalCredits += parseInt(item.Uni_Matrd);
				finalAverage = Math.round(item.Promedio*100)/100;
				requiredsUnd = parseInt(item.OBLIGAT);
				electivesUnd = parseInt(item.ELECTIVO);
				if(!objCourses[item.ID_Curso]){
					objCourses[item.ID_Curso] = true;
					if(item.Caracter == 0) item.GRADE >= 13? requiredsAprobe += parseInt(item.Uni_Matrd): requiredsDisaprobe += parseInt(item.Uni_Matrd);
					else item.GRADE >= 13? electivesAprobe += parseInt(item.Uni_Matrd): electivesDisaprobe += parseInt(item.Uni_Matrd);
				}
				if (item.N_Med > higherProm) {
					higherProm = item.N_Med;
				}
			})
			doc.setFontSize(14);
			doc.text( item.name, 30, doc.autoTableEndPosY() + offset, 'left');
			doc.autoTable({
				head: [['Código', 'Curso', 'Tipo', 'Ciclo', 'Créditos', 'Nota', 'Observación']],
				body: body,
				startY: doc.autoTableEndPosY() + offset2,
				afterPageContent: footer,
				margin: { horizontal: 30 },
				bodyStyles: { 
				  valign: 'middle',
				  fontSize: 8,
				  halign: 'center'
				},
				styles: { overflow: 'linebreak' },
				headerStyles: {
				    fillColor: [0, 0, 0],
				    textColor: [255],
				    halign: 'center'
				},
				theme: 'striped'
			});
			doc.autoTable({
				head: [['Total Cursos = ' + item.courses.length + ' Total Unidades = ' + totalCredits + ' Promedio Ponderado Ciclo Lectivo = ' + higherProm]],
				startY: doc.autoTableEndPosY(),
				afterPageContent: footer,
				margin: { horizontal: 30 },
				styles: { overflow: 'linebreak' },
				headerStyles: {
				    fillColor: [255, 255, 255],
				    textColor: [0],
				    halign: 'left'
				},
				theme: 'striped'
			});
			var limit = doc.autoTableEndPosY();
			if(limit >= 730){
				var npages = doc.internal.getNumberOfPages();
				// console.log('numero de paginas: ' + npages);
				doc.autoTable({
					head: [['']],
					startY: doc.autoTableEndPosY() + 5,
					margin: { horizontal: 30 },
					styles: { overflow: 'linebreak' },
					headerStyles: {
					    fillColor: [255, 255, 255],
					    textColor: [255],
					    halign: 'center'
					},
					theme: 'striped'
				});
			}
		});

		doc.autoTable({
			head: [['Promedio Ponderado', finalAverage]],
			startY: doc.autoTableEndPosY() + 40,
			afterPageContent: footer,
			margin: { left: 220, right: 30 },
			styles: { overflow: 'linebreak' },
			headerStyles: {
			    fillColor: [255, 255, 255],
			    lineColor: [0, 0, 0],
			    lineWidth: 1,
			    textColor: [0],
			    halign: 'left'
			},
			theme: 'striped'
		});

		doc.autoTable({
			head: [['Tipo', 'UND', 'Aprobados', 'Por Aprobar']],
			body: [['Obligatorios', this.globalStatistics.UNITS_REPEAT_LIMIT, this.globalStatistics.UCS_OBLI_APROBADAS, this.globalStatistics.UNITS_REPEAT_LIMIT - this.globalStatistics.UCS_OBLI_APROBADAS ]
			,['Electivos', this.globalStatistics.UCS_MAX_UNID_LEC, this.globalStatistics.UCS_ELEC_APROBADAS, this.globalStatistics.UCS_MAX_UNID_LEC - this.globalStatistics.UCS_ELEC_APROBADAS ],
			['TOTAL', this.globalStatistics.UNITS_REPEAT_LIMIT + this.globalStatistics.UCS_MAX_UNID_LEC, this.globalStatistics.UCS_OBLI_APROBADAS + this.globalStatistics.UCS_ELEC_APROBADAS, (this.globalStatistics.UNITS_REPEAT_LIMIT + this.globalStatistics.UCS_MAX_UNID_LEC) - (this.globalStatistics.UCS_OBLI_APROBADAS + this.globalStatistics.UCS_ELEC_APROBADAS) ]],
			startY: doc.autoTableEndPosY() + 20,
			afterPageContent: footer,
			margin: { left: 220, right: 30 },
			bodyStyles: { valign: 'middle', fontSize: 8, halign: 'center' },
			styles: { overflow: 'linebreak' },
			headerStyles: { fillColor: [0, 0, 0], textColor: [255], halign: 'center' },
			theme: 'striped'
		});
			
		doc.save("record_" + this.user.codigoAlumno + '.pdf');
	}

	open(){
		var doc = new jsPDF('p', 'pt');
		var splitTitle = doc.splitTextToSize('este', 270);
		var pageHeight = doc.internal.pageSize.height;
		doc.setFontType("normal");
		doc.setFontSize("11");
		var y = 7;
		for (var i = 0; i < splitTitle.length; i++) {
			if (y > 280) {
			y = 10;
			doc.addPage();
			}
			doc.text(15, y, splitTitle[i]);
			y = y + 7;
		}
		doc.save('my.pdf');
	}

}
