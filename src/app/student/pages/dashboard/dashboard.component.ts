import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder } from '@angular/forms';
import { DeviceDetectorService } from 'ngx-device-detector';
import { NgxSmartModalService } from 'ngx-smart-modal';
import { StudentService } from '../../../services/student.service';
import { SessionService } from '../../../services/session.service';
import { GeneralService } from '../../../services/general.service';
import { InputsService } from '../../../services/inputs.service';
import { FormService } from '../../../services/form.service';
import { Broadcaster } from '../../../services/broadcaster';
import { IntentionService } from '../../../services/intention.service';
import { AssistanceService } from '../../../services/assistance.service';
import { NewEnrollmentService } from '../../../services/newenrollment.service';
import { AppSettings } from '../../../app.settings';
import { BetweenDays, RealDate } from '../../../helpers/dates';
import { ToastrService } from 'ngx-toastr';
import * as CryptoJS from 'crypto-js';
import { notice } from './notice';
import { dataClass } from './mock';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})

export class DashboardComponent implements OnInit {
  @ViewChild('SurveyModal') SurveyModal: any;
  @ViewChild('SurveyModal2') SurveyModal2: any;
  @ViewChild('AcademicConditionModal') AcademicConditionModal: any;
  @ViewChild('FinancialConditionModal') FinancialConditionModal: any;
  @ViewChild('AnnouncementModal') AnnouncementModal: any;
  @ViewChild('allModal') allModal: any;
  @ViewChild('ModdleLinkModal') ModdleLinkModal: any;
  @ViewChild('ModdleLinkModal2') ModdleLinkModal2: any;
  @ViewChild('aficheModal') aficheModal: any;
  @ViewChild('medicineModal') medicineModal: any;
  @ViewChild('postModal') postModal: any;
  @ViewChild('preModal') preModal: any;
  @ViewChild('suspensionModal') suspensionModal: any;
  @ViewChild('answerStudentModal') answerStudentModal: any;
  @ViewChild('ethnicityModal') ethnicityModal: any;
  @ViewChild('matriculaExtracurricularModal') matriculaExtracurricularModal: any; //MODAL : SI - NO
  @ViewChild('cursosExtracurricularesModal') cursosExtracurricularesModal: any; //MODAL: CURSOS
  @ViewChild('horariosModal') horariosModal: any; //MODAL : HORARIOS DEL CURSO
  @ViewChild('eliminarMatriculaModal') eliminarMatriculaModal: any; //MODAL: CONFIRMACION DE ELIMINAR
  @ViewChild('modalComunicado') modalComunicado: any; //Communicado LV
  linktoSurvey = '';
  company = AppSettings.COMPANY;
  user: any = this.session.getObject('user');
  student: any = {};
  academicData: any;
  enrollmentStatus: any;
  loading: boolean = false;
  realDate: any = RealDate();
  noClosed: boolean;
  enroll: any;
  enroll_conditions: any = '';
  queueEnroll: any;
  showwsp: boolean = false;
  fidelityLink: any = '';
  imagesAcadConditions = new Array(35);
  imagesFinaConditions = new Array(25);
  realHourStart;
  realHourEnd;
  timeoutEnroll: boolean = false;
  crossdata: any;
  notifications: Array<any>;
  btnEnroll: boolean = false;
  currentNextClass: any = {
    limit: 0
  };
  offsetHour = 1000 * 60 * 10;
  nextClassLink: any;
  realProgram;
  showEnrollment: boolean = false;
  realDevice = this.deviceS.getDeviceInfo();
  ethnicities = AppSettings.ETHNICITIES;
  realEthnicity = '';
  realOther = '';

  /////////////////////////////////////
  courses = [];
  coursesSession = [];
  coursesPeople = [];
  arraySchedules: [];
  schedulesOfCourse: Array<any> = [];
  schedulesSelected = [];
  btnMatricula = false;
  dia: string;
  columTrash = false; //Mostrar columna de la tabla para eliminar
  selectedCourse = {
    TOPIC: '',
    value: false,
    checked: false
  };
  schedulesForDelete: any;
  horariosMatriculados = [];
  cursoId: number;
  countCoursesMatriculados = 0;
  /////////////////////////////////////
  constructor(private formBuilder: FormBuilder,
    private session: SessionService,
    private studentS: StudentService,
    public inputsS: InputsService,
    private formS: FormService,
    private assistanceS: AssistanceService,
    private broadcaster: Broadcaster,
    private router: Router,
    private deviceS: DeviceDetectorService,
    public generalS: GeneralService,
    private toastr: ToastrService,
    public newEnrollmentS: NewEnrollmentService,
    public ngxSmartModalService: NgxSmartModalService,
    private intentionS: IntentionService
  ) { }

  public notice = notice;
  public course: any[] = [];
  public loadCourse: boolean = false;

  ngOnInit() {
    // this.showModals();
    this.studentS.getDataStudent({ email: this.user.email })
      .then(res => {
        this.student = res.UcsMetodoDatosPersRespuesta;
        // console.log(this.student);

        this.student['firstNombreAlumno'] = this.student.nombreAlumno.trim().split(' ')[0];
        this.session.setObject('student', this.student);
        this.getParameters();
      }, error => { });
    this.crossdata = this.broadcaster.getMessage().subscribe(message => {
      // if (message && message.enroll_conditions) {
      //   this.enroll_conditions = message.enroll_conditions;
      // }
      if (message && message.queueEnroll) {
        this.queueEnroll = message.queueEnroll;
        this.setRealDateEnroll(this.queueEnroll);
        this.readConditions();
      }
      else if (message && message.enroll) {
        this.enroll = message.enroll;
      }
      else if (message && message.code) {
        if (message.institution != 'PSTRG') {
          this.studentS.getAllClasses({ code: message.code, institution: message.institution, date: message.date })
            .then((res) => {
              this.course = dataClass.sort((a, b) => {
                if (a.MEETING_TIME_START > b.MEETING_TIME_START) {
                  return 1;
                }
                if (a.MEETING_TIME_START < b.MEETING_TIME_START) {
                  return -1;
                }
                return 0;
              });
              console.log(this.course);
              
              this.loadCourse = true;
              // this.course = res.RES_HR_CLS_ALU_VIR.DES_HR_CLS_ALU_VIR.sort((a, b) => {
              //   if (a.MEETING_TIME_START > b.MEETING_TIME_START) {
              //     return 1;
              //   }
              //   if (a.MEETING_TIME_START < b.MEETING_TIME_START) {
              //     return -1;
              //   }
              //   return 0;
              // });
              this.nextClass(res.RES_HR_CLS_ALU_VIR.DES_HR_CLS_ALU_VIR, message.institution);
            });
        }
      }
    });
    // this.readConditions();
    var ese = new Array(4);
    //this.matriculaExtracurricularModal.open();
  }

  showBiblioteca() {
    this.studentS.setshowBiblioteca(true);
  }

  saveAnswer(answer) {
    this.studentS.saveAnswer({ emplid: this.user.codigoAlumno, answer: answer })
      .then((res) => {
        this.toastr.success('Gracias!');
        this.answerStudentModal.close();
      });
  }

  showModals() {
    this.suspensionModal.open();
    // this.postModal.open();
  }

  diaPeople(data: any) {
    for (var k in data) {
      if (data[k] == "Y") {
        return k;
      }
    }
  }

  onChangeAvailable(course, evt) {
    if (this.countCoursesMatriculados < 3) {
      this.loading = true;
      this.newEnrollmentS.getSchedulesCourse(course.CRSE_ID)
        .then((res) => {
          this.arraySchedules = res['SIS_WS_HORCC_RSP']['SIS_WS_HORCC_COM'];
          this.schedulesOfCourse = this.checkDuplicates(this.arraySchedules);
          this.selectedCourse = course;
          this.loading = false;
          this.horariosModal.open();
        }).catch(err => alert('No se pudo consultar los horarios del curso.'));
    } else {
      course.value = false;
      evt.target.checked = false;
      this.toastr.warning("Solo se puede matricular hasta en tres cursos extracurricualres.");
      return;
    }
  }

  checkDuplicates(array) {
    array.sort(this.dynamicSortMultiple(["CLASS_SECTION", "CLASS_NBR",]));
    let lastNBR;
    for (var i = 0; i < array.length; i++) {
      /* if (array[i]['FLAG1'] != 'I') { */
      if (!lastNBR) {
        lastNBR = array[i]['CLASS_NBR'];
        array[i].show = true;
      } else if (lastNBR == array[i]['CLASS_NBR']) {
        array[i].show = false;
      } else {
        lastNBR = array[i]['CLASS_NBR'];
        array[i].show = true;
      }
      /* } */
    }
    return array.filter(arr => arr.FLAG1 != 'I');
  }

  dynamicSortMultiple(args) {
    var props = args;
    return (obj1, obj2) => {
      var i = 0, result = 0, numberOfProperties = props.length;
      while (result === 0 && i < numberOfProperties) {
        result = this.dynamicSort(props[i])(obj1, obj2);
        i++;
      }
      return result;
    }
  }

  dynamicSort(property) {
    var sortOrder = 1;
    if (property[0] === "-") {
      sortOrder = -1;
      property = property.substr(1);
    }
    return (a, b) => {
      var result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
      return result * sortOrder;
    }
  }
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////MARCAR HORARIO
  changeSchedule(section, evt) {
    let variable = false;
    this.schedulesSelected = [];
    this.schedulesOfCourse.forEach(el => {
      if (section.CLASS_SECTION == el["CLASS_SECTION"] && section.CLASS_NBR == el["CLASS_NBR"]) {
        el.select = true;
        this.schedulesSelected.push(el);
      } else {
        el.select = false;
      }
    });
    this.schedulesSelected.forEach(pickedCourse => {
      if (!variable) {
        if (this.checkCrosses(pickedCourse)) {
          variable = true;
          section.value = false;
          section.select = false;
          evt.target.checked = false;
          return
        }
      }
    });

    if (!section.value || section.value == false) {
      this.btnMatricula = true;
    } else {
      this.btnMatricula = false;
    }

  }

  checkCrosses(pickedCourse) {
    if (this.horariosMatriculados) {
      for (let i = 0; i < this.horariosMatriculados.length; i++) {
        if (this.horariosMatriculados[i].STRM == "1087") {
          if (BetweenDays(this.horariosMatriculados[i]['START_DT'], this.horariosMatriculados[i]['END_DT'], RealDate(new Date(pickedCourse['START_DT'].replaceAll('-', '/') + ' 00:00:00'))) || BetweenDays(this.horariosMatriculados[i]['START_DT'], this.horariosMatriculados[i]['END_DT'], RealDate(new Date(pickedCourse['END_DT'].replaceAll('-', '/') + ' 00:00:00')))) {
            if (this.horariosMatriculados[i]['DIA'] == pickedCourse['DIA']) {
              if ((this.timeToSeconds(pickedCourse['HORA_INICIO']) >= this.timeToSeconds(this.horariosMatriculados[i]['HORA_INICIO']) && this.timeToSeconds(pickedCourse['HORA_INICIO']) < this.timeToSeconds(this.horariosMatriculados[i]['HORA_FIN'])) || (this.timeToSeconds(pickedCourse['HORA_FIN']) > this.timeToSeconds(this.horariosMatriculados[i]['HORA_INICIO']) && this.timeToSeconds(pickedCourse['HORA_FIN']) <= this.timeToSeconds(this.horariosMatriculados[i]['HORA_FIN']))) {
                this.toastr.error('Tienes un cruce con otra clase: ' + this.horariosMatriculados[i]['CLASS_SECTION'] + ' ' + this.horariosMatriculados[i]['DESCR']);
                pickedCourse.alertMessage = 'Tienes un cruce con otra clase: ' + this.horariosMatriculados[i]['CLASS_SECTION'] + ' ' + this.horariosMatriculados[i]['DESCR'];
                return true
              }
            }
          }
        }
      }
      return false
    }
  }

  timeToSeconds(time) {
    let inSeconds = time.split(':');
    return inSeconds[0] * 60 * 60 + inSeconds[1] * 60
  }
  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////MATRICULA
  matricula() {
    this.loading = true;
    let data = [];
    for (var i = 0; i < this.schedulesOfCourse.length; i++) {
      if (this.schedulesOfCourse[i]['select']) {
        data.push({
          ACAD_CAREER: this.schedulesOfCourse[i]['ACAD_CAREER'],
          ASSOCIATED_CLASS: this.schedulesOfCourse[i]['ASSOCIATED_CLASS'],
          CLASS_NBR: this.schedulesOfCourse[i]['CLASS_NBR'],
          CRSE_ID: this.schedulesOfCourse[i]['CRSE_ID'],
          EMPLID: this.user.codigoAlumno,
          INSTITUTION: this.schedulesOfCourse[i]['INSTITUTION'],
          OFFER_NBR: this.schedulesOfCourse[i]['CLASS_NBR'],
          SESSION_CODE: this.schedulesOfCourse[i]['SESSION_CODE'],
          SSR_COMPONENT: this.schedulesOfCourse[i]['SSR_COMPONENT'],
          STRM: this.schedulesOfCourse[i]['STRM'],
          equivalent: "-",
          CLASS_SECTION: this.schedulesOfCourse[i]['CLASS_SECTION'],
          DIA: this.schedulesOfCourse[i]['DIA'],
          HORA_INICIO: this.schedulesOfCourse[i]['HORA_INICIO'],
          HORA_FIN: this.schedulesOfCourse[i]['HORA_FIN'],
          START_DT: this.schedulesOfCourse[i]['START_DT'],
          END_DT: this.schedulesOfCourse[i]['END_DT'],
          DESCR: this.schedulesOfCourse[i]['DESCR'],
        });
      }
    };
    let x = new Set();
    var result = data.reduce((acc, item) => {
      if (!x.has(item.CLASS_NBR)) {
        x.add(item.CLASS_NBR)
        acc.push(item)
      }
      return acc;
    }, []);
    if (data.length == 0 || data == undefined) {
      this.loading = false;
      this.toastr.warning('No seleccionaste ninguna sección');
      return
    }
    this.newEnrollmentS.saveCourseClass({
      courses: result,
      emplid_admin: this.user.email
    }).then((res) => {
      if (res['UCS_REST_INSCR_RES']['UCS_DET_CLA_RES'][0]['RESULTADO'] != 'No hay vacantes') {
        this.toastr.success('Curso matriculado');

        let primerCurso = this.session.getObject('cursoExtracurricular');

        if (!primerCurso) {
          this.session.setObject('cursoExtracurricular', data);
          this.horariosMatriculados = data;
        } else {
          this.horariosMatriculados = this.session.getObject('cursoExtracurricular') ? this.session.getObject('cursoExtracurricular').concat(data) : [];
          this.session.setObject('cursoExtracurricular', this.horariosMatriculados);
        }
        this.selectedCourse.value = true;
        this.session.destroy('mySchedule');
        this.loading = false;
        this.ExistCursoMatriculado();
        this.countCoursesMatriculados = this.countCoursesMatriculados + 1;
        this.horariosModal.close();
      } else {
        this.toastr.warning('No hay vacantes para este curso');
        this.loading = false;
      }
    }).catch(err => alert('No se pudo matricular el curso'));
  }
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////REFRESH CURSOS
  ExistCursoMatriculado() {
    this.horariosMatriculados = this.session.getObject('cursoExtracurricular')
    if (!this.horariosMatriculados || this.horariosMatriculados.length == 0) {
      this.columTrash = false;
    }
    else {
      this.courses.forEach(course => {
        this.horariosMatriculados.forEach(horario => {
          if (horario.CRSE_ID === course.CRSE_ID) {
            course.value = true;
            this.columTrash = true;
          }
        });
      });
    }
  }
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////CERRAR MODALES
  closeModalCursos(modal) {
    this.horariosMatriculados = this.session.getObject('cursoExtracurricular') ? this.session.getObject('cursoExtracurricular') : [];
    this.selectedCourse.value = false;
    this.ExistCursoMatriculado();
    this.cursosExtracurricularesModal.close();
  }

  closeModalSecciones(modal) {
    this.horariosMatriculados = this.session.getObject('cursoExtracurricular');
    this.selectedCourse.value = false;
    this.btnMatricula = true;
    this.ExistCursoMatriculado();
    this.horariosModal.close();
  }
  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////ELIMINAR
  delete(course) {
    this.cursoId = course.CRSE_ID;
    this.schedulesForDelete = this.horariosMatriculados.filter(horario => horario.CRSE_ID != course.CRSE_ID);
    this.selectedCourse = course;
    this.eliminarMatriculaModal.open();
  }

  deleteEnrollment() {
    this.loading = true;
    this.newEnrollmentS.deleteCourseClassByCrseId(this.user.codigoAlumno, this.cursoId, '')
      .then((res) => {
        this.loading = false;
        this.horariosMatriculados = this.schedulesForDelete;
        this.session.setObject('cursoExtracurricular', this.horariosMatriculados);
        this.selectedCourse.value = false;
        this.ExistCursoMatriculado();
        this.countCoursesMatriculados = this.countCoursesMatriculados - 1;
        this.toastr.warning("Curso Removido");
        this.eliminarMatriculaModal.close();
      }).catch(err => alert('Error en servicio de eliminar.'));
  }

  readConditions() {
    this.newEnrollmentS.checkConditions(this.user.codigoAlumno)
      .then((res) => {
        this.enroll = true;
        this.enroll_conditions = res;
      });
  }

  example() {
    this.AcademicConditionModal.open();
  }

  getParameters(open: boolean = true) {
    var rDate = this.realDate.year + '-' + this.realDate.month + '-' + this.realDate.day;
    this.intentionS.getParameters(this.user.codigoAlumno)
      .then(res => {
        // this.enrollmentStatus = res.data && res.data ? res.data : [];
        // this.enrollmentStatus.forEach((item) => {
        //   if (item && item.enrollment_intention_status == 'A' && item.authorizacion && item.type == 'PM' && item.authorizacion.ended_process == 'NO') {
        //     if (open) this.broadcaster.sendMessage({ intentionModal: 2 });
        //     this.noClosed = rDate > item.end_date || rDate < item.start_date ? true : false;
        //   }
        //   if (item && item.enrollment_intention_status == 'A' && item.type == 'M') {
        //     this.broadcaster.sendMessage({ getEnroll: 'Y' });
        //     this.btnEnroll = true;
        //   }
        //   if (item && item.enrollment_intention_status == 'A' && item.authorizacion && item.type == 'MI' && this.user.ind_deuda == 'N') {
        //     if (open) this.broadcaster.sendMessage({ intensiveModal: 2, intensiveData: item });
        //   }
        //   if (item && item.enrollment_intention_status == 'A' && item.type == 'NM') {
        //     this.broadcaster.sendMessage({ getEnroll: 'Y' });
        //     this.btnEnroll = true;
        //   }
        // })
        this.broadcaster.sendMessage({ getEnroll: 'Y' });
        this.btnEnroll = true;
      })
  }

  getNotifications() {
    this.studentS.getAdStudent(this.user.codigoAlumno)
      .then(res => {
        this.notifications = res;
        setTimeout(() => {
          this.notifications.forEach((item, idx) => {
            this.ngxSmartModalService.open('NotificationModal' + idx);
          });
        }, 500);
      }, error => { });
  }

  setRealDateEnroll(turn) {
    this.timeoutEnroll = !turn.onTurn;
    setTimeout(() => {
      if (this.timeoutEnroll) {
        this.studentS.getEnrollQueueNumber({ EMPLID: this.user.codigoAlumno })
          .then((res) => {
            this.queueEnroll.onTurn = res.UCS_GRUPO_MAT_RES.onTurn;
            this.setRealDateEnroll(res.UCS_GRUPO_MAT_RES);
          });
      }
    }, 120000);
  }

  saveConditions(flag, modal) {
    this.loading = true;
    var tEnroll = JSON.parse(JSON.stringify(this.enroll_conditions));
    tEnroll[flag] = 'Y';
    tEnroll['STRM'] = this.session.getObject('dataEnrollment')['cicloAdmision'];
    this.newEnrollmentS.saveConditions(tEnroll)
      .then((res) => {
        this.loading = false;
        modal.close();
        this.enroll_conditions = res.conditions;
      });
  }

  // saveAcademicCondition(){
  //   var tEnroll = JSON.parse(JSON.stringify(this.enroll));
  //   this.loading = true;
  //   tEnroll.FLAG = 'Y';
  //   this.studentS.saveAcademicCondition(tEnroll)
  //   .then( res => {
  //     this.loading = false;
  //     this.enroll_conditions.FLAG_ACADEMICO = res.UCS_GRAB_RES_COND_ACAD && res.UCS_GRAB_RES_COND_ACAD.UCS_GRAB_COM_COND_ACAD && res.UCS_GRAB_RES_COND_ACAD.UCS_GRAB_COM_COND_ACAD[0].FLAG_ACADEMICO == 'G'?'Y':this.enroll_conditions.FLAG_ACADEMICO;
  //     if(this.enroll_conditions.FLAG_ACADEMICO == 'Y') this.AcademicConditionModal.close();
  //   }, error => { this.loading = false; });
  // }

  // saveFinancialCondition(){
  //   var tEnroll = JSON.parse(JSON.stringify(this.enroll));
  //   this.loading = true;
  //   tEnroll.FLAG = 'Y';
  //   this.studentS.saveFinancialCondition(tEnroll)
  //   .then( res => {
  //     this.loading = false;
  //     this.enroll_conditions.FLAG_FINANCIERO = res.UCS_GRAB_RES_COND_ACAD && res.UCS_GRAB_RES_COND_ACAD.UCS_GRAB_COM_COND_ACAD && res.UCS_GRAB_RES_COND_ACAD.UCS_GRAB_COM_COND_ACAD[0].FLAG_ACADEMICO == 'G'?'Y':this.enroll_conditions.FLAG_ACADEMICO;
  //     if(this.enroll_conditions.FLAG_FINANCIERO == 'Y') this.FinancialConditionModal.close();
  //   }, error => { this.loading = false; });
  // }

  enrollPeople() {
    if (this.user.ind_deuda != 'N') {
      this.toastr.error('Por favor, regularice su deuda, contactarse con Finanzas.');
      return;
    }
    if (this.enroll_conditions.FLAG_ACADEMICO == 'N' || this.enroll_conditions.FLAG_FINANCIERO == 'N') {
      this.toastr.error('Si no aceptas las condiciones académicas y financieras, no te permitirá ingresar a la opción de Matrícula.');
      return;
    }

    if (this.queueEnroll.ind_grupo == 'N') {
      this.toastr.error('Aún no tienes Turno de Matricula.');
      return;
    }
    this.realDate = RealDate();
    if (this.realDate.timeseconds >= this.queueEnroll.date.timeseconds) { window.open('/estudiante/accion/matricula', '_self'); } //this.router.navigate(['/estudiante/accion/matricula']);
    else { this.toastr.error(this.queueEnroll.mensaje, '', { enableHtml: true }) };
  }

  ngOnDestroy() {
    this.crossdata.unsubscribe();
  }

  nextClass(arrClass, inst) {
    var dt = new Date();
    var secs = dt.getSeconds() + (60 * dt.getMinutes()) + (60 * 60 * dt.getHours());
    if (arrClass) {
      for (let i = 0; i < arrClass.length; i++) {
        let actualC = arrClass[i];
        var hour = actualC['MEETING_TIME_START'].split(':')[0] * 60 * 60;
        var minute = actualC['MEETING_TIME_START'].split(':')[1] * 60;
        var total = hour + minute;
        var hour2 = actualC['MEETING_TIME_END'].split(':')[0] * 60 * 60;
        var minute2 = actualC['MEETING_TIME_END'].split(':')[1] * 60;
        var total2 = hour2 + minute2;
        if (total - 600 < secs && secs < total2 - 600) {
          this.currentNextClass = actualC;
          this.getLink(actualC, inst);
        }
      }
    }
  }

  checkAssist() {
    window.open(this.nextClassLink, '_blank');
  }

  preGoMoodle() {
    var realClass = JSON.parse(JSON.stringify(this.currentNextClass));
    realClass.CLASS_ATTEND_DT = realClass.FECH_INI;
    let dates = this.getDates(realClass.FECH_INI, realClass.MEETING_TIME_START, realClass.MEETING_TIME_END);
    this.realHourStart = RealDate(dates.start);
    this.realHourEnd = RealDate(dates.end);
    let tclassNbr = 0;
    this.assistanceS.getAllClassNbrByCourse({
      STRM: realClass.STRM,
      EMPLID: this.student.codigoAlumno,
      CLASS_ATTEND_DT: realClass.CLASS_ATTEND_DT,
      CLASS_NBR: realClass.CLASS_NBR
    }).then((res) => {
      var realDate = this.realDate.year + '-' + this.realDate.month + '-' + this.realDate.day;
      var realHourStart = this.realHourStart.year + '-' + this.realHourStart.month + '-' + this.realHourStart.day;
      let clases = res['RES_INST_CRSE_MAT_NBR']['COM_INST_CRSE_MAT_NBR'];
      if (clases) {
        for (let i = 0; i < clases.length; i++) {
          let sending = 0;
          let data3 = {
            INSTITUTION: clases[i]['INSTITUTION'],
            ACAD_CAREER: clases[i]['ACAD_CAREER'],
            CLASS_ATTEND_DT: realClass.FECH_INI,
            STRM: realClass.STRM,
            CRSE_ID: clases[i]['CRSE_ID'],
            CLASS_NBR: clases[i]['CLASS_NBR'],
            CLASS_MTG_NBR: clases[i]['CLASS_MTG_NBR'],
            EMPLID: this.student.codigoAlumno,
            ATTEND_TMPLT_NBR: '0',
            ATTEND_PRESENT: 'Y',
            ATTEND_LEFT_EARLY: 'N',
            ATTEND_TARDY: 'N',
            ATTEND_REASON: "",
            platform: this.realDevice.os + ' - ' + this.realDevice.browser,
            STATUS: 'ER'
          };
          var difference = this.realHourStart.timeseconds - this.realDate.timeseconds;
          var difference2 = (this.realHourEnd.timesecond - this.realHourStart.timeseconds) / 2;
          var difference3 = this.realHourEnd.timeseconds - difference2 - this.realDate.timeseconds;
          this.assistanceS.getAssistanceNBR(data3)
            .then((res) => {
              var templt_nbr = res.UCS_ASIST_ALUM_RES && res.UCS_ASIST_ALUM_RES.UCS_ASIST_ALUM_COM && res.UCS_ASIST_ALUM_RES.UCS_ASIST_ALUM_COM[0] ? res.UCS_ASIST_ALUM_RES.UCS_ASIST_ALUM_COM[0].ATTEND_TMPLT_NBR : '';
              data3.ATTEND_TMPLT_NBR = templt_nbr;
              if (templt_nbr && (Math.abs(difference) <= this.offsetHour || (difference3 <= difference2 && difference3 > 0) || (this.realHourStart.timeseconds < this.realDate.timeseconds && this.realDate.timeseconds < this.realHourEnd.timesecond))) {
                tclassNbr = clases[i];
                sending = 1;
                if (this.realHourStart.hour + ':' + this.realHourStart.minute == this.realDate.hour + ':' + this.realDate.minute) {
                  data3.STATUS = 'P';
                }
                else if (difference <= this.offsetHour && difference > 0) {
                  data3.ATTEND_LEFT_EARLY = 'Y';
                  data3.STATUS = 'E';
                }
                else if ((difference >= -this.offsetHour && difference < 0) || (difference3 <= difference2 && difference3 > 0)) {
                  data3.ATTEND_TARDY = 'Y';
                  data3.STATUS = 'L';
                }
                else {
                  data3.STATUS = 'ER';
                  tclassNbr = 0;
                  sending = 0;
                }
              } else {
                if (clases[i]['SESSION_CODE'] == 2) {
                  if (tclassNbr) {
                    var partTime = tclassNbr['MEETING_TIME_END'].split(':');
                    var partMinute = parseInt(partTime[1]) + 10;
                    var partHour = parseInt(partTime[0])
                    if (partMinute >= 60) {
                      partHour++;
                      partMinute = partMinute % 60;
                    } if (clases[i]['MEETING_TIME_START'] == tclassNbr['MEETING_TIME_END'] || (clases[i]['MEETING_TIME_START'] > tclassNbr['MEETING_TIME_END'] && clases[i]['MEETING_TIME_START'] <= partHour + ':' + partMinute)) {
                      sending = 1;
                      data3['STATUS'] = 'P';
                    }
                  }
                }
              }
              // if (sending) {
              this.assistanceS.sendAssistanceOnlinePs(data3)
                .then(res => {
                });
              // }
            });
        }
      }
      this.checkAssist();
    });
  }

  getLink(cls, inst) {
    let d = new Date();
    var hour = cls.MEETING_TIME_START.split(':')[0];
    var minute = cls.MEETING_TIME_START.split(':')[1];
    d.setHours(hour);
    d.setMinutes(minute);
    d.setSeconds(0);
    let timeStamp = d.getTime().toString().slice(0, -3);
    this.studentS.getLinkZoom(cls['STRM'], cls['CLASS_NBR2'], Number(timeStamp), cls['DOCENTE'], cls['CLASS_SECTION'], inst)
      .then((res) => {
        if (!res.includes('false')) {
          this.nextClassLink = res.replace(/<\/?[^>]+(>|$)/g, "");
          console.log(this.nextClassLink);
          
        }
      });
  }

  openZoom(event) {
    this.getLink(event, event.INSTITUTION);
  }

  goMoodle() {
    var emplid = this.student.codigoAlumno;
    var rdate = Math.floor(Date.now() / 1000);
    emplid = encodeURIComponent(CryptoJS.AES.encrypt(JSON.stringify(this.student.codigoAlumno + '//' + rdate), 'Educad123', { format: this.generalS.formatJsonCrypto }).toString());
    window.open('https://aulavirtualcpe.cientifica.edu.pe/local/wseducad/auth/sso.php?strm=9999&class=9999&emplid=' + emplid, '_self');
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
    let hour = Number(arrHour[0]);
    hour += 5;
    const hourModified = this.pad(hour, 2);
    const minute = arrHour[1];
    const second = arrHour[2];

    return `${hourModified}:${minute}:${second}`;
  }

  getDay(pDay: string, pHour: string): string {
    let rDate = `${pDay}T${pHour}`;
    const arrHour = pHour.split(':');
    let hour = Number(arrHour[0]);
    if (hour > 23) {

      const arrDate = pDay.split('-'); // 2020-07-06

      let day = Number(arrDate[2]);
      day += 1;

      const dayModified = this.pad(day, 2);
      const month = arrDate[1];
      const year = arrDate[0];

      const vDate = `${year}-${month}-${dayModified}`;

      hour -= 24;
      const hourModified = this.pad(hour, 2);
      const minute = arrHour[1];
      const second = arrHour[2];

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

  goEnrollment() {
    let myFlags = this.enroll_conditions.FLAG_ACADEMICO == 'Y' && this.enroll_conditions.FLAG_FINANCIERO == 'Y';
    this.session.setObject('conditionsToEnrollment', { turn: this.queueEnroll.onTurn, conditions: myFlags });
    this.newEnrollmentS.getDebt({ EMPLID: this.user.codigoAlumno })
      .then((res) => {
        let notdeuda = res['UCS_WS_DEU_RSP']['UCS_WS_DEU_COM'][0]['DEUDA'] == 'N' ? true : false;
        if (!notdeuda) {
          this.toastr.error('Tiene una deuda pendiente, por favor regularizar el pago.');
        } else {
          this.router.navigate(['/estudiante/matricula/disponibles']);
        }
      });
  }

  getEthnicity() {
    this.studentS.existEthnicity({
      "EMPLID": this.user.codigoAlumno
    })
      .then(res => {
        if (res.UCS_CON_ETNICO_RES && res.UCS_CON_ETNICO_RES.RESULTADO == 'Y') { }
        else { this.ethnicityModal.open(); }
      })

  }

  saveEthnicity() {
    if (!this.realEthnicity) {
      this.toastr.error('Debes seleccionar una Etnia');
      return;
    }
    if (this.realEthnicity && this.realEthnicity == '08' && !this.realOther) {
      this.toastr.error('Debes llenar el campo otros');
      return;
    }
    var nEthnicity = this.ethnicities.find(item => item.value == this.realEthnicity);
    this.studentS.saveEthnicity({
      "EMPLID": this.user.codigoAlumno,
      "UCS_ID_ETNICO": this.realEthnicity,
      "DESCR100": this.realEthnicity == '08' ? this.realOther.toUpperCase() : nEthnicity.name
    })
      .then(res => {
        if (res.UCS_SRV_ETNICO_RES && res.UCS_SRV_ETNICO_RES.RESULTADO) {
          if (res.UCS_SRV_ETNICO_RES.RESULTADO == 'G') {
            this.toastr.success('Datos guardados exitósamente');
            this.ethnicityModal.close();
          }
          else if (res.UCS_SRV_ETNICO_RES.RESULTADO == 'E') {
            this.toastr.success('Ya se guardo este dato anteriormente');
            this.ethnicityModal.close();
          }
          else {
            this.toastr.error('Hubo un error al actualizar');
          }
        }
        else {
          this.toastr.error('Hubo un error al actualizar');
        }
      })
  }
}