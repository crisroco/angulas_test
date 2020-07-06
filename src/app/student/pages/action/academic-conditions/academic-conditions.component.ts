import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { DeviceDetectorService } from 'ngx-device-detector';
import { StudentService } from '../../../../services/student.service';
import { SessionService } from '../../../../services/session.service';

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

	constructor(private session: SessionService,
		private studentS: StudentService) { }

	ngOnInit() {
		this.studentS.getAcademicDataStudent({code: this.user.codigoAlumno})
		.then(res => {
			this.programs = res.UcsMetodoDatosAcadRespuesta && res.UcsMetodoDatosAcadRespuesta.UcsMetodoDatosAcadRespuesta?res.UcsMetodoDatosAcadRespuesta.UcsMetodoDatosAcadRespuesta:[];
			if(this.programs.length){
				this.realProgram = this.programs[0];
				this.getAcademicConditions();
			}
		}, error => { });
	}

	getAcademicConditions(){
		this.studentS.getAcademicConditions({code: this.user.codigoAlumno, institution: this.realProgram.institucion, career: this.realProgram.codigoGrado, plain: this.realProgram.codigoPlan, program: this.realProgram.codigoPrograma })
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
					name: 'Cursos Electivos'
				}
			};
			var tcycles = res.RES_COND_ACAD && res.RES_COND_ACAD.RES_COND_ACAD_DET?res.RES_COND_ACAD.RES_COND_ACAD_DET:[];
			for (var i = tcycles.length - 1; i >= 0; i--) {
				if(objCycles[tcycles[i].UCS_CICLO]){
					objCycles[tcycles[i].UCS_CICLO].courses.push(tcycles[i]);
				}
			}
			for( var kcycle in objCycles){
				objCycles[kcycle].courses.sort(this.dynamicSortMultiple(["DESCR2", "DESCR1"]));
				this.cycles.push(objCycles[kcycle]);
			}
			this.getGlobalStatistics();
			this.getRequirements();
			this.getWeightedAverage();
		}, error => { });
	}

	getGlobalStatistics(){
		this.studentS.getGlobalStatistics({code: this.user.codigoAlumno, institution: this.realProgram.institucion, career: this.realProgram.codigoGrado, plain: this.realProgram.codigoPlan, program: this.realProgram.codigoPrograma })
		.then(res => {
			console.log(res);
			this.globalStatistics = res.UCS_REST_VAL_UNID_EGRE_RES && res.UCS_REST_VAL_UNID_EGRE_RES.UCS_REST_VAL_UNID_EGRE_COM && res.UCS_REST_VAL_UNID_EGRE_RES.UCS_REST_VAL_UNID_EGRE_COM[0]?res.UCS_REST_VAL_UNID_EGRE_RES.UCS_REST_VAL_UNID_EGRE_COM[0]:null;
			if(this.globalStatistics){
				this.globalStatistics.UNITS_REPEAT_LIMIT = parseInt(this.globalStatistics.UNITS_REPEAT_LIMIT);
				this.globalStatistics.UCS_OBLI_APROBADAS = parseInt(this.globalStatistics.UCS_OBLI_APROBADAS);
				this.globalStatistics.UCS_MAX_UNID_LEC = parseInt(this.globalStatistics.UCS_MAX_UNID_LEC);
				this.globalStatistics.UCS_ELEC_APROBADAS = parseInt(this.globalStatistics.UCS_ELEC_APROBADAS);
				this.globalStatistics.requiredProgress = this.globalStatistics.UNITS_REPEAT_LIMIT && this.globalStatistics.UCS_OBLI_APROBADAS?Math.round(this.globalStatistics.UCS_OBLI_APROBADAS / this.globalStatistics.UNITS_REPEAT_LIMIT * 10000)/100:0;
				this.globalStatistics.electiveProgress = this.globalStatistics.UCS_MAX_UNID_LEC && this.globalStatistics.UCS_ELEC_APROBADAS?Math.round(this.globalStatistics.UCS_ELEC_APROBADAS / this.globalStatistics.UCS_MAX_UNID_LEC * 10000)/100:0;
			}
		}, error => { });
	}

	getRequirements(){
		this.studentS.getRequirements({code: this.user.codigoAlumno, institution: this.realProgram.institucion, career: this.realProgram.codigoGrado, plain: this.realProgram.codigoPlan, program: this.realProgram.codigoPrograma })
		.then(res => {
			console.log(res);
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
				this.requirements.extraProgress = this.requirements.HORAS_EXTRA_ALUM && this.requirements.HORAS_EXTRA_REQ?Math.round(this.requirements.HORAS_EXTRA_ALUM / this.requirements.HORAS_EXTRA_REQ * 10000)/100:0;
			}
		}, error => { });
	}

	getWeightedAverage(){
		this.studentS.getWeightedAverage(this.user.codigoAlumno, this.realProgram.codigoGrado, this.realProgram.codigoPrograma)
		.then(res => {
			console.log(res);
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

}
